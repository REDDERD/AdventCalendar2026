import { z } from 'zod';
import type { Puzzle } from '../schema';
import { bfs, result, type EngineLogic } from './types';

/**
 * `custom:cross`: river crossing ("Wolves and Chicks"). Predators and prey cross
 * in a boat; on a bank with at least one prey animal there must never be more
 * predators than prey. Checked after every crossing on both banks.
 */
export const crossConfig = z.object({
  component: z.literal('cross'),
  capacity: z.number().int().min(1).max(4),
  predators: z.object({ label: z.string(), count: z.number().int().min(1).max(6) }),
  prey: z.object({ label: z.string(), count: z.number().int().min(1).max(6) }),
  banks: z.tuple([z.string(), z.string()]),
});
export type CrossConfig = z.infer<typeof crossConfig>;

/** Animals on the left bank [predators, prey], where the boat is, crossings so far. */
export type CrossState = { left: [number, number]; boatLeft: boolean; moves: number };

export const bankSafe = (predators: number, prey: number): boolean => prey === 0 || predators <= prey;

/**
 * Cross with `h` predators and `f` prey. Returns null on a rule violation:
 * empty or overloaded boat, animals that are not on the boat's bank, or a
 * bank where the predators outnumber the prey afterwards.
 */
export function crossOver(config: CrossConfig, state: CrossState, h: number, f: number): CrossState | null {
  const total = [config.predators.count, config.prey.count];
  if (![h, f].every((n) => Number.isInteger(n) && n >= 0) || h + f < 1 || h + f > config.capacity) return null;
  const here = state.boatLeft ? state.left : [total[0] - state.left[0], total[1] - state.left[1]];
  if (h > here[0] || f > here[1]) return null;
  const sign = state.boatLeft ? -1 : 1;
  const left: [number, number] = [state.left[0] + sign * h, state.left[1] + sign * f];
  if (!bankSafe(left[0], left[1]) || !bankSafe(total[0] - left[0], total[1] - left[1])) return null;
  return { left, boatLeft: !state.boatLeft, moves: state.moves + 1 };
}

function nextStates(config: CrossConfig, s: CrossState): CrossState[] {
  const out: CrossState[] = [];
  for (let h = 0; h <= config.capacity; h++) {
    for (let f = 0; h + f <= config.capacity; f++) {
      const n = crossOver(config, s, h, f);
      if (n) out.push(n);
    }
  }
  return out;
}

const key = (s: CrossState) => `${s.left.join('/')}${s.boatLeft ? 'L' : 'R'}`;

export const crossLogic: EngineLogic<CrossState> = {
  config: crossConfig,
  /** Animals left on the start bank at the end, [predators, prey] – normally [0, 0]; the boat ends on the far side. */
  solution: z.tuple([z.number().int().min(0), z.number().int().min(0)]),
  initial: (puzzle) => {
    const config = puzzle.config as CrossConfig;
    return { left: [config.predators.count, config.prey.count], boatLeft: true, moves: 0 };
  },
  check: (puzzle, state) => {
    const goal = puzzle.solution as [number, number];
    return !state.boatLeft && state.left[0] === goal[0] && state.left[1] === goal[1];
  },
  describe: (puzzle, state) => {
    const config = puzzle.config as CrossConfig;
    return `${config.banks[0]}: ${state.left[0]}/${state.left[1]}, Boot ${state.boatLeft ? 'links' : 'rechts'} (${state.moves} Fahrten)`;
  },
  verify: (puzzle: Puzzle) => {
    const config = puzzle.config as CrossConfig;
    const goal = puzzle.solution as [number, number];
    const start = crossLogic.initial(puzzle);
    const errors: string[] = [];
    if (!bankSafe(start.left[0], start.left[1])) errors.push('the start bank is not safe');
    const moves = bfs(
      start,
      (s) => !s.boatLeft && s.left[0] === goal[0] && s.left[1] === goal[1],
      (s) => nextStates(config, s),
      key,
    );
    if (moves === null) errors.push('the goal cannot be reached');
    // all safe states reachable from the start (for the report)
    const seen = new Set([key(start)]);
    let frontier = [start];
    while (frontier.length) {
      const next: CrossState[] = [];
      for (const s of frontier) for (const n of nextStates(config, s)) if (!seen.has(key(n))) { seen.add(key(n)); next.push(n); }
      frontier = next;
    }
    return result(errors, [`${moves} crossings minimum`, `${seen.size} reachable states`]);
  },
};
