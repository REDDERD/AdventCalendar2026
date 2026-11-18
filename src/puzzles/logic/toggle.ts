import { z } from 'zod';
import type { Puzzle } from '../schema';
import { combinations, result, sameSet, type EngineLogic } from './types';

/** `toggle`: tapping a cell switches it and its four neighbours; goal: all on. */
export const toggleConfig = z.object({
  rows: z.number().int().min(2).max(4),
  cols: z.number().int().min(2).max(4),
  /** Cells that are on at the start (row-major indices). */
  lit: z.array(z.number().int().min(0)).default([]),
  /** Optional sprites for both states, e.g. a candle. */
  sprites: z.object({ on: z.string(), off: z.string() }).optional(),
});
export type ToggleConfig = z.infer<typeof toggleConfig>;

/** On/off per cell, row-major. */
export type ToggleState = boolean[];

/** The cell itself and its orthogonal neighbours. */
export function toggleNeighbours(config: ToggleConfig, cell: number): number[] {
  const { rows, cols } = config;
  const r = Math.floor(cell / cols);
  const c = cell % cols;
  const cells = [cell];
  if (r > 0) cells.push(cell - cols);
  if (r < rows - 1) cells.push(cell + cols);
  if (c > 0) cells.push(cell - 1);
  if (c < cols - 1) cells.push(cell + 1);
  return cells;
}

/** Tap a cell. Cells outside the grid are a rule violation and change nothing. */
export function toggleCell(config: ToggleConfig, state: ToggleState, cell: number): ToggleState {
  if (!Number.isInteger(cell) || cell < 0 || cell >= config.rows * config.cols) return state;
  const next = [...state];
  for (const n of toggleNeighbours(config, cell)) next[n] = !next[n];
  return next;
}

function initial(config: ToggleConfig): ToggleState {
  return Array.from({ length: config.rows * config.cols }, (_, i) => config.lit.includes(i));
}

export const toggleLogic: EngineLogic<ToggleState> = {
  config: toggleConfig,
  /** The cells to tap (any order) – used by verify and the help. */
  solution: z.array(z.number().int().min(0)),
  initial: (puzzle) => initial(puzzle.config as ToggleConfig),
  check: (puzzle, state) => {
    const config = puzzle.config as ToggleConfig;
    return state.length === config.rows * config.cols && state.every(Boolean);
  },
  describe: (puzzle, state) => {
    const { cols } = puzzle.config as ToggleConfig;
    const rows: string[] = [];
    for (let i = 0; i < state.length; i += cols) rows.push(state.slice(i, i + cols).map((on) => (on ? '#' : '.')).join(''));
    return rows.join('/');
  },
  verify: (puzzle: Puzzle) => {
    const config = puzzle.config as ToggleConfig;
    const cells = Array.from({ length: config.rows * config.cols }, (_, i) => i);
    const solved = (taps: number[]) => taps.reduce((s, c) => toggleCell(config, s, c), initial(config)).every(Boolean);
    // Tapping a cell twice cancels out, so every solution is a set of cells.
    const solutions: number[][] = [];
    for (let k = 0; k <= cells.length; k++) for (const taps of combinations(cells, k)) if (solved(taps)) solutions.push(taps);
    const errors: string[] = [];
    if (solutions.length !== 1) errors.push(`${solutions.length} solutions, expected exactly 1`);
    const given = (puzzle.solution as number[]).map(String);
    if (!solutions.some((s) => sameSet(s.map(String), given))) errors.push('the given solution does not light every cell');
    return result(errors, [`${solutions[0]?.length ?? '?'} taps`]);
  },
};
