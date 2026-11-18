import { z } from 'zod';
import type { Puzzle } from '../schema';
import { bfs, result, sameArray, type EngineLogic } from './types';

/** `custom:pour`: pour between bottles until the giver is empty or the taker full. */
export const pourConfig = z.object({
  component: z.literal('pour'),
  capacities: z.array(z.number().int().min(1).max(20)).min(2).max(4),
  start: z.array(z.number().int().min(0)),
  labels: z.array(z.string()).optional(),
});
export type PourConfig = z.infer<typeof pourConfig>;

export type PourState = { levels: number[]; moves: number };

/**
 * Pour bottle `from` into bottle `to`. Returns null on a rule violation:
 * same bottle, empty giver, full taker, unknown bottle.
 */
export function pour(config: PourConfig, state: PourState, from: number, to: number): PourState | null {
  const n = config.capacities.length;
  if (from === to || ![from, to].every((i) => Number.isInteger(i) && i >= 0 && i < n)) return null;
  const amount = Math.min(state.levels[from], config.capacities[to] - state.levels[to]);
  if (amount <= 0) return null;
  const levels = [...state.levels];
  levels[from] -= amount;
  levels[to] += amount;
  return { levels, moves: state.moves + 1 };
}

export function pourDistance(config: PourConfig, goal: number[]): number | null {
  const n = config.capacities.length;
  return bfs<PourState>(
    { levels: config.start, moves: 0 },
    (s) => sameArray(s.levels, goal),
    (s) => {
      const next: PourState[] = [];
      for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
        const p = pour(config, s, a, b);
        if (p) next.push(p);
      }
      return next;
    },
    (s) => s.levels.join(','),
  );
}

export const pourLogic: EngineLogic<PourState> = {
  config: pourConfig,
  /** Levels to reach. */
  solution: z.array(z.number().int().min(0)),
  initial: (puzzle) => ({ levels: [...(puzzle.config as PourConfig).start], moves: 0 }),
  check: (puzzle, state) => sameArray(state.levels, puzzle.solution as number[]),
  describe: (_puzzle, state) => `${state.levels.join('/')} (${state.moves} Züge)`,
  verify: (puzzle: Puzzle) => {
    const config = puzzle.config as PourConfig;
    const goal = puzzle.solution as number[];
    const errors: string[] = [];
    const n = config.capacities.length;
    if (config.start.length !== n || goal.length !== n) errors.push('start and solution need one level per bottle');
    if (config.start.some((l, i) => l > config.capacities[i])) errors.push('start overfills a bottle');
    const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);
    if (sum(config.start) !== sum(goal)) errors.push('pouring cannot change the total amount');
    if (errors.length) return result(errors);
    const moves = pourDistance(config, goal);
    if (moves === null) errors.push('the solution cannot be reached');
    return result(errors, [`${moves} moves minimum`]);
  },
};
