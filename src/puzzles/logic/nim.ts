import { z } from 'zod';
import type { Puzzle } from '../schema';
import { result, sameArray, type EngineLogic } from './types';

/**
 * `custom:nim`: heaps of crackers; players take any number from one heap in
 * turn, whoever takes the last one wins (normal play). The player starts; the
 * opponents play perfectly: the winning move if there is one, else the
 * smallest legal move (first non-empty heap, one cracker).
 */
export const nimConfig = z.object({
  component: z.literal('nim'),
  heaps: z.array(z.number().int().min(1).max(9)).min(2).max(4),
  /** Who plays against you, taking turns (e.g. Fred, George). */
  opponents: z.array(z.string().min(1)).min(1).default(['Gegner']),
});
export type NimConfig = z.infer<typeof nimConfig>;

export type NimMove = { by: 'player' | 'opponent'; heap: number; count: number };
export type NimState = { heaps: number[]; turn: 'player' | 'opponent'; winner: 'player' | 'opponent' | null; log: NimMove[] };

export const nimSum = (heaps: readonly number[]): number => heaps.reduce((s, h) => s ^ h, 0);

/** Take `count` from `heap`. Returns null on a rule violation: wrong turn, game over, unknown heap, nothing or too many. */
export function take(state: NimState, by: NimMove['by'], heap: number, count: number): NimState | null {
  if (state.winner || state.turn !== by) return null;
  if (!Number.isInteger(heap) || heap < 0 || heap >= state.heaps.length) return null;
  if (!Number.isInteger(count) || count < 1 || count > state.heaps[heap]) return null;
  const heaps = [...state.heaps];
  heaps[heap] -= count;
  const over = heaps.every((h) => h === 0);
  return {
    heaps,
    turn: by === 'player' ? 'opponent' : 'player',
    winner: over ? by : null,
    log: [...state.log, { by, heap, count }],
  };
}

/** The opponents' move for these heaps (they never lose a won position). */
export function opponentMove(heaps: readonly number[]): { heap: number; count: number } {
  const s = nimSum(heaps);
  if (s !== 0) {
    const heap = heaps.findIndex((h) => (h ^ s) < h);
    return { heap, count: heaps[heap] - (heaps[heap] ^ s) };
  }
  return { heap: heaps.findIndex((h) => h > 0), count: 1 };
}

/** Player move plus the opponents' answer (if the game goes on). */
export function playRound(state: NimState, heap: number, count: number): NimState | null {
  const after = take(state, 'player', heap, count);
  if (!after || after.winner) return after;
  const reply = opponentMove(after.heaps);
  return take(after, 'opponent', reply.heap, reply.count);
}

function playerMoves(heaps: readonly number[]): Array<{ heap: number; count: number }> {
  const moves: Array<{ heap: number; count: number }> = [];
  heaps.forEach((h, heap) => {
    for (let count = 1; count <= h; count++) moves.push({ heap, count });
  });
  return moves;
}

/** Can the player (to move) force a win against the opponents' policy? Memoised game tree. */
function playerWins(heaps: number[], memo: Map<string, boolean>): boolean {
  const key = heaps.join(',');
  const known = memo.get(key);
  if (known !== undefined) return known;
  let wins = false;
  for (const m of playerMoves(heaps)) {
    const next = [...heaps];
    next[m.heap] -= m.count;
    if (next.every((h) => h === 0)) {
      wins = true;
      break;
    }
    const reply = opponentMove(next);
    next[reply.heap] -= reply.count;
    if (!next.every((h) => h === 0) && playerWins(next, memo)) {
      wins = true;
      break;
    }
  }
  memo.set(key, wins);
  return wins;
}

/** First moves that still win (heaps after the move). */
export function winningFirstMoves(config: NimConfig): number[][] {
  const memo = new Map<string, boolean>();
  const out: number[][] = [];
  for (const m of playerMoves(config.heaps)) {
    const next = [...config.heaps];
    next[m.heap] -= m.count;
    if (next.every((h) => h === 0)) {
      out.push(next);
      continue;
    }
    const reply = opponentMove(next);
    const after = [...next];
    after[reply.heap] -= reply.count;
    if (!after.every((h) => h === 0) && playerWins(after, memo)) out.push(next);
  }
  return out;
}

/** Share of games a player with random moves wins (exact, over the game tree). */
export function randomWinRate(heaps: readonly number[], memo = new Map<string, number>()): number {
  const key = heaps.join(',');
  const known = memo.get(key);
  if (known !== undefined) return known;
  const moves = playerMoves(heaps);
  let sum = 0;
  for (const m of moves) {
    const next = [...heaps];
    next[m.heap] -= m.count;
    if (next.every((h) => h === 0)) {
      sum += 1;
      continue;
    }
    const reply = opponentMove(next);
    next[reply.heap] -= reply.count;
    if (!next.every((h) => h === 0)) sum += randomWinRate(next, memo);
  }
  const rate = sum / moves.length;
  memo.set(key, rate);
  return rate;
}

const HEAP = ['ersten', 'zweiten', 'dritten', 'vierten'];

export const nimLogic: EngineLogic<NimState> = {
  config: nimConfig,
  /** The heaps after the one winning first move (documents the key move; checked by verify). */
  solution: z.array(z.number().int().min(0)),
  initial: (puzzle) => ({ heaps: [...(puzzle.config as NimConfig).heaps], turn: 'player', winner: null, log: [] }),
  check: (_puzzle, state) => state.winner === 'player',
  describe: (_puzzle, state) => {
    const moves = state.log.map((m) => `${m.by === 'player' ? 'Du' : 'Zwillinge'}: ${m.count} aus dem ${HEAP[m.heap]}`).join(', ');
    return `${moves} → ${state.winner === 'player' ? 'gewonnen' : state.winner ? 'verloren' : 'offen'}`;
  },
  verify: (puzzle: Puzzle) => {
    const config = puzzle.config as NimConfig;
    const errors: string[] = [];
    const wins = winningFirstMoves(config);
    if (wins.length !== 1) errors.push(`${wins.length} winning first moves, expected exactly 1`);
    else if (!sameArray(wins[0], puzzle.solution as number[])) errors.push(`the winning first move leads to ${wins[0].join('/')}`);
    const rate = randomWinRate(config.heaps);
    return result(errors, [`nim sum ${nimSum(config.heaps)}`, `random play wins ${(rate * 100).toFixed(2)} %`]);
  },
};
