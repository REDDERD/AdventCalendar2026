import { z } from 'zod';
import type { Puzzle } from '../schema';
import { result, sameSet, type EngineLogic } from './types';

/** `toggle`: tapping a cell switches it and its four neighbours; goal: all on. */
export const toggleConfig = z.object({
  rows: z.number().int().min(2).max(5),
  cols: z.number().int().min(2).max(5),
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

/**
 * Solve over GF(2): tapping twice cancels out, so a solution is a set of cells.
 * Returns the dimension of the solution space (0 = unique) and one solution.
 */
export function solveToggle(config: ToggleConfig): { nullity: number; taps: number[] | null } {
  const n = config.rows * config.cols;
  // Row i of the system: which taps affect cell i, plus the wanted change (bit n).
  const rows = Array.from({ length: n }, (_, cell) => {
    let row = config.lit.includes(cell) ? 0 : 2 ** n;
    for (let tap = 0; tap < n; tap++) if (toggleNeighbours(config, tap).includes(cell)) row += 2 ** tap;
    return BigInt(row);
  });
  const pivots: number[] = [];
  let rank = 0;
  for (let col = 0; col < n; col++) {
    const bit = 1n << BigInt(col);
    const p = rows.findIndex((r, i) => i >= rank && (r & bit) !== 0n);
    if (p < 0) continue;
    [rows[rank], rows[p]] = [rows[p], rows[rank]];
    for (let i = 0; i < n; i++) if (i !== rank && (rows[i] & bit) !== 0n) rows[i] ^= rows[rank];
    pivots.push(col);
    rank++;
  }
  const rhs = 1n << BigInt(n);
  if (rows.slice(rank).some((r) => (r & rhs) !== 0n)) return { nullity: n - rank, taps: null };
  const taps = pivots.filter((_, i) => (rows[i] & rhs) !== 0n);
  return { nullity: n - rank, taps };
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
    const { nullity, taps } = solveToggle(config);
    const errors: string[] = [];
    if (nullity !== 0) errors.push(`${2 ** nullity} solutions, expected exactly 1`);
    if (!taps) errors.push('no solution');
    else if (!sameSet(taps.map(String), (puzzle.solution as number[]).map(String))) {
      errors.push(`the given solution differs from the computed one: ${taps.join(',')}`);
    }
    return result(errors, [`${taps?.length ?? '?'} taps`]);
  },
};
