import { z } from 'zod';
import type { Puzzle } from '../schema';
import { bfs, result, sameArray, type EngineLogic } from './types';

/** `slide`: sliding puzzle; 0 is the gap. */
export const slideConfig = z.object({
  size: z.literal(3),
  start: z.array(z.number().int().min(0)),
  /** Optional picture (size × 80 px square) cut into tiles; otherwise numbers. */
  image: z.string().optional(),
});
export type SlideConfig = z.infer<typeof slideConfig>;

/** Tile number per place, row-major. */
export type SlideState = number[];

/** Places next to `place` (orthogonal). */
export function slideNeighbours(size: number, place: number): number[] {
  const r = Math.floor(place / size);
  const c = place % size;
  const out: number[] = [];
  if (r > 0) out.push(place - size);
  if (r < size - 1) out.push(place + size);
  if (c > 0) out.push(place - 1);
  if (c < size - 1) out.push(place + 1);
  return out;
}

/** Slide the tile at `place` into the gap. Tiles not next to the gap don't move (rule). */
export function slideTile(size: number, state: SlideState, place: number): SlideState {
  const gap = state.indexOf(0);
  if (!slideNeighbours(size, gap).includes(place)) return state;
  const next = [...state];
  [next[gap], next[place]] = [next[place], next[gap]];
  return next;
}

/** Minimal number of moves from `start` to `goal`, or null if impossible. */
export function slideDistance(size: number, start: SlideState, goal: SlideState): number | null {
  return bfs(
    start,
    (s) => sameArray(s, goal),
    (s) => slideNeighbours(size, s.indexOf(0)).map((p) => slideTile(size, s, p)),
    (s) => s.join(','),
  );
}

export const slideLogic: EngineLogic<SlideState> = {
  config: slideConfig,
  solution: z.array(z.number().int().min(0)),
  initial: (puzzle) => [...(puzzle.config as SlideConfig).start],
  check: (puzzle, state) => sameArray(state, puzzle.solution as number[]),
  describe: (_puzzle, state) => state.join(''),
  verify: (puzzle: Puzzle) => {
    const { size, start } = puzzle.config as SlideConfig;
    const goal = puzzle.solution as number[];
    const tiles = Array.from({ length: size * size }, (_, i) => i);
    const errors: string[] = [];
    for (const [name, s] of [['start', start], ['solution', goal]] as const) {
      if (!sameArray([...s].sort((a, b) => a - b), tiles)) errors.push(`${name} must contain 0…${size * size - 1} once`);
    }
    if (errors.length) return result(errors);
    const moves = slideDistance(size, start, goal);
    if (moves === null) errors.push('the solution cannot be reached from the start');
    else if (moves === 0) errors.push('start is already solved');
    return result(errors, [`${moves} moves minimum`]);
  },
};
