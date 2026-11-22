import { z } from 'zod';
import type { Puzzle } from '../schema';
import { result, sameArray, type EngineLogic } from './types';

/**
 * `custom:weigh`: one of `coins` coins is lighter than the rest (the chocolate
 * coin in gold foil). The player has a balance that works `weighings` times,
 * with the same number of coins in each pan, then names the light coin.
 *
 * The fake is not fixed in advance: the balance always gives the answer that
 * keeps the most coins under suspicion (tie: balanced, then left, then right).
 * So only a real plan reaches the goal, never luck. The answers stay
 * consistent with at least one fake coin, so the game is fair.
 */
export const weighConfig = z.object({
  component: z.literal('weigh'),
  coins: z.number().int().min(3).max(9).default(9),
  weighings: z.number().int().min(1).max(4).default(2),
  fake: z.literal('lighter').default('lighter'),
});
export type WeighConfig = z.infer<typeof weighConfig>;

export type Side = 'tray' | 'left' | 'right';
/** Which pan went up: the one holding the light coin. `even`: both pans balanced. */
export type WeighResult = 'left_up' | 'right_up' | 'even';
export type WeighEntry = { left: number[]; right: number[]; result: WeighResult };
export type WeighState = {
  /** Where each coin lies (index = coin number minus 1). */
  sides: Side[];
  /** Coins that can still be the light one. */
  candidates: number[];
  log: WeighEntry[];
  /** True from a weighing until the pans are cleared: the beam shows the result and the coins stay put. */
  weighed: boolean;
  /** The coin the player named, once they have. */
  named: number | null;
  outcome: 'open' | 'won' | 'lost';
};

export function weighInitial(config: WeighConfig): WeighState {
  return {
    sides: Array.from({ length: config.coins }, () => 'tray' as Side),
    candidates: Array.from({ length: config.coins }, (_, i) => i),
    log: [],
    weighed: false,
    named: null,
    outcome: 'open',
  };
}

const NEXT_SIDE: Record<Side, Side> = { tray: 'left', left: 'right', right: 'tray' };

/** Tap a coin: tray → left pan → right pan → tray. Not possible while the result of a weighing is shown or after the game ended. */
export function cycleCoin(state: WeighState, coin: number): WeighState {
  if (state.outcome !== 'open' || state.weighed || !Number.isInteger(coin) || coin < 0 || coin >= state.sides.length) return state;
  const sides = [...state.sides];
  sides[coin] = NEXT_SIDE[sides[coin]];
  return { ...state, sides };
}

/** Take every coin out of the pans again (after a weighing). */
export function clearPans(state: WeighState): WeighState {
  if (state.outcome !== 'open') return state;
  return { ...state, sides: state.sides.map(() => 'tray' as Side), weighed: false };
}

export const coinsOn = (state: WeighState, side: Side): number[] => state.sides.flatMap((s, i) => (s === side ? [i] : []));

/** What the balance says: the answer that leaves the most suspects. */
export function balanceAnswer(candidates: readonly number[], left: readonly number[], right: readonly number[]): { result: WeighResult; candidates: number[] } {
  const inLeft = candidates.filter((c) => left.includes(c));
  const inRight = candidates.filter((c) => right.includes(c));
  const rest = candidates.filter((c) => !left.includes(c) && !right.includes(c));
  // the light coin's pan goes up
  const options: Array<{ result: WeighResult; candidates: number[] }> = [
    { result: 'even', candidates: rest },
    { result: 'left_up', candidates: inLeft },
    { result: 'right_up', candidates: inRight },
  ];
  return options.reduce((best, o) => (o.candidates.length > best.candidates.length ? o : best));
}

/** Weigh what lies in the pans. Returns null on a rule violation: no coins, unequal pans, out of weighings, result not yet cleared, game over. */
export function weigh(config: WeighConfig, state: WeighState): WeighState | null {
  if (state.outcome !== 'open' || state.weighed || state.log.length >= config.weighings) return null;
  const left = coinsOn(state, 'left');
  const right = coinsOn(state, 'right');
  if (left.length === 0 || left.length !== right.length) return null;
  const answer = balanceAnswer(state.candidates, left, right);
  return {
    ...state,
    candidates: answer.candidates,
    log: [...state.log, { left, right, result: answer.result }],
    weighed: true,
  };
}

/** Name the light coin. Right only if no other coin can still be it. */
export function nameCoin(state: WeighState, coin: number): WeighState | null {
  if (state.outcome !== 'open' || !Number.isInteger(coin) || coin < 0 || coin >= state.sides.length) return null;
  const right = state.candidates.length === 1 && state.candidates[0] === coin;
  return { ...state, named: coin, outcome: right ? 'won' : 'lost' };
}

// ---------- search (verify and tests) ----------

/**
 * Fewest weighings that always find the light coin among `c` suspects when `g`
 * coins are known to be genuine (usable as filler). Exact search over splits.
 */
export function minWeighings(c: number, g: number, memo = new Map<string, number>()): number {
  if (c <= 1) return 0;
  const key = `${c},${g}`;
  const known = memo.get(key);
  if (known !== undefined) return known;
  let best = Infinity;
  for (const [a1, a2] of firstMoves(c, g)) {
    if (a1 === c || a2 === c) continue; // one answer would keep every suspect: no progress
    // answers: left pan up → a1 suspects; right up → a2; balanced → the rest
    const worst = Math.max(minWeighings(a1, g + c - a1, memo), minWeighings(a2, g + c - a2, memo), minWeighings(c - a1 - a2, g + a1 + a2, memo));
    best = Math.min(best, 1 + worst);
  }
  memo.set(key, best);
  return best;
}

/** Suspect counts (left, right) of every legal weighing; pans are filled up with genuine coins. */
function firstMoves(c: number, g: number): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let a1 = 0; a1 <= c; a1++) {
    for (let a2 = 0; a1 + a2 <= c; a2++) {
      if (a1 + a2 === 0) continue;
      // pan sizes must match: fill the smaller side with genuine coins
      if (Math.abs(a1 - a2) <= g) out.push([a1, a2]);
    }
  }
  return out;
}

/** Splits `k` against `k` of the first weighing (nothing known yet) that still allow a safe finish. */
export function safeFirstSplits(config: WeighConfig): number[] {
  const memo = new Map<string, number>();
  const out: number[] = [];
  for (let k = 1; k * 2 <= config.coins; k++) {
    const worst = Math.max(minWeighings(k, config.coins - k, memo), minWeighings(config.coins - 2 * k, 2 * k, memo));
    if (1 + worst <= config.weighings) out.push(k);
  }
  return out;
}

const RESULT_TEXT: Record<WeighResult, string> = { left_up: 'links leichter', right_up: 'rechts leichter', even: 'Gleichgewicht' };
export const resultText = (r: WeighResult): string => RESULT_TEXT[r];
const nums = (coins: number[]) => coins.map((c) => c + 1).join(' ');

export const weighLogic: EngineLogic<WeighState> = {
  config: weighConfig,
  /** The first weighing that leads to a sure finish: this many coins in each pan. */
  solution: z.tuple([z.number().int().min(1), z.number().int().min(1)]),
  initial: (puzzle) => weighInitial(puzzle.config as WeighConfig),
  check: (_puzzle, state) => state.outcome === 'won',
  describe: (_puzzle, state) => {
    const steps = state.log.map((e) => `${nums(e.left)} gegen ${nums(e.right)}: ${resultText(e.result)}`);
    const end = state.named === null ? 'offen' : `Münze ${state.named + 1} benannt: ${state.outcome === 'won' ? 'richtig' : 'falsch'}`;
    return [...steps, end].join(' · ');
  },
  verify: (puzzle: Puzzle) => {
    const config = puzzle.config as WeighConfig;
    const errors: string[] = [];
    const need = minWeighings(config.coins, 0);
    if (need > config.weighings) errors.push(`${config.coins} coins need ${need} weighings, only ${config.weighings} allowed`);
    if (need < config.weighings) errors.push(`${config.coins} coins need only ${need} weighings, but ${config.weighings} are allowed: too easy`);
    const splits = safeFirstSplits(config);
    const solution = puzzle.solution as number[];
    if (splits.length !== 1) errors.push(`${splits.length} safe first splits, expected exactly 1`);
    else if (!sameArray(solution, [splits[0], splits[0]])) errors.push(`the only safe first weighing is ${splits[0]} against ${splits[0]}`);
    return result(errors, [`${need} weighings minimum`, `only first split ${splits.map((k) => `${k} vs ${k}`).join(', ')}`]);
  },
};
