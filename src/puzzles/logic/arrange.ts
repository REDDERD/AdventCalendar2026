import { z } from 'zod';
import type { Puzzle } from '../schema';
import { allPlacements, clueHolds, clueText, gridLogic, placementOf } from './gridClues';
import { equationHolds, readEquation, romanSlots, sticksFor, type RomanSlot } from './roman';
import { permutations, result, sameArray, sameSet, type EngineLogic, type VerifyResult } from './types';

// ---------- Modes ----------

/** Machine-readable versions of the clues in the prompt, so `puzzles:verify` can prove uniqueness. */
const rowRule = z.discriminatedUnion('type', [
  /** `item` stands at `pos` (0 = leftmost, -1 = rightmost). */
  z.object({ type: z.literal('at'), item: z.string(), pos: z.number().int() }),
  /** `item` stands directly right of `of`. */
  z.object({ type: z.literal('right_of'), item: z.string(), of: z.string() }),
  /** `item` stands somewhere left of `of`, at least `gap` places apart (2 = not directly next to it). */
  z.object({ type: z.literal('left_of'), item: z.string(), of: z.string(), gap: z.number().int().min(1).default(1) }),
  z.object({ type: z.literal('next_to'), item: z.string(), of: z.string() }),
  z.object({ type: z.literal('not_next_to'), item: z.string(), of: z.string() }),
]);
export type RowRule = z.infer<typeof rowRule>;

const rowConfig = z.object({
  mode: z.literal('row'),
  items: z
    .array(z.object({ id: z.string().min(1), label: z.string().min(1), color: z.string().optional() }))
    .min(2)
    .max(8),
  /** Order at the start (item ids). */
  start: z.array(z.string()),
  rules: z.array(rowRule).optional(),
});

/** Board rows: '.' free, '#' blocked, a letter = fixed piece of that kind. */
const gridConfig = z.object({
  mode: z.literal('grid'),
  board: z.array(z.string().min(2).max(6)).min(2).max(6),
  /** Movable pieces per kind, e.g. { "M": 3 }. */
  pieces: z.record(z.string().length(1), z.number().int().min(1).max(8)),
  kinds: z.record(z.string().length(1), z.object({ label: z.string(), sprite: z.string().optional() })),
  rules: z.array(z.enum(['distinct_rows', 'distinct_cols', 'no_touch'])).optional(),
  /** Labels above the columns (text) and icons left of the rows (asset ids). */
  colHeads: z.array(z.string()).optional(),
  rowIcons: z.array(z.string()).optional(),
  /** Logic-grid clues (one piece per kind, distinct rows and columns), see gridClues.ts. */
  logic: gridLogic.optional(),
});

/**
 * Sticks lie on slots (line segments in play-area pixels); move up to `moves` of them.
 * Either free slots (`slots` + `start`) or a Roman equation: `roman.cells` lists the
 * cells ('n' numeral, 'o' operator), `roman.start` the equation as text. Roman
 * solutions are equations as text, e.g. "IX-III=VI".
 */
const sticksConfig = z
  .object({
    mode: z.literal('sticks'),
    slots: z
      .array(z.object({ id: z.string().min(1), x1: z.number(), y1: z.number(), x2: z.number(), y2: z.number() }))
      .min(2)
      .optional(),
    start: z.array(z.string()).min(1).optional(),
    roman: z.object({ cells: z.string().regex(/^[no]+$/), start: z.string().min(3) }).optional(),
    moves: z.number().int().min(1).max(3),
  })
  .refine((c) => !!c.roman !== !!(c.slots && c.start), 'sticks need either roman or slots + start');

export const arrangeConfig = z.discriminatedUnion('mode', [rowConfig, gridConfig, sticksConfig]);
export type ArrangeConfig = z.infer<typeof arrangeConfig>;
export type RowConfig = z.infer<typeof rowConfig>;
export type GridConfig = z.infer<typeof gridConfig>;
export type SticksConfig = z.infer<typeof sticksConfig>;

/** row: item ids left to right · grid: movable piece id per cell · sticks: occupied slots + the stick in hand */
export type RowState = { mode: 'row'; order: string[] };
export type GridState = { mode: 'grid'; cells: Array<string | null> };
export type SticksState = { mode: 'sticks'; on: string[]; held: string | null };
export type ArrangeState = RowState | GridState | SticksState;

// ---------- Row ----------

/** Swap two places. Invalid places are a rule violation and change nothing. */
export function swapRow(state: RowState, a: number, b: number): RowState {
  const n = state.order.length;
  if (![a, b].every((i) => Number.isInteger(i) && i >= 0 && i < n) || a === b) return state;
  const order = [...state.order];
  [order[a], order[b]] = [order[b], order[a]];
  return { mode: 'row', order };
}

export function rowRuleHolds(rule: RowRule, order: readonly string[]): boolean {
  const pos = (id: string) => order.indexOf(id);
  switch (rule.type) {
    case 'at':
      return pos(rule.item) === (rule.pos < 0 ? order.length + rule.pos : rule.pos);
    case 'right_of':
      return pos(rule.item) === pos(rule.of) + 1;
    case 'left_of':
      return pos(rule.of) - pos(rule.item) >= rule.gap;
    case 'next_to':
      return Math.abs(pos(rule.item) - pos(rule.of)) === 1;
    case 'not_next_to':
      return Math.abs(pos(rule.item) - pos(rule.of)) !== 1;
  }
}

function verifyRow(config: RowConfig, solution: string[]): VerifyResult {
  const ids = config.items.map((i) => i.id);
  const errors: string[] = [];
  if (!sameSet(ids, solution) || solution.length !== ids.length) errors.push('solution must list every item once');
  if (!sameSet(ids, config.start) || config.start.length !== ids.length) errors.push('start must list every item once');
  if (sameArray(config.start, solution)) errors.push('start is already solved');
  if (!config.rules) return result(errors, ['no rules: uniqueness not checked']);
  const matches = [...permutations(ids)].filter((order) => config.rules!.every((r) => rowRuleHolds(r, order)));
  if (matches.length !== 1) errors.push(`${matches.length} orders satisfy the rules, expected exactly 1`);
  else if (!sameArray(matches[0], solution)) errors.push(`the rules lead to ${matches[0].join(',')}, not the solution`);
  return result(errors, [`${matches.length} order(s) fit the rules`]);
}

// ---------- Grid ----------

export function gridSize(config: GridConfig): { rows: number; cols: number } {
  return { rows: config.board.length, cols: config.board[0].length };
}

/** Movable pieces, e.g. M1, M2, M3. */
export function gridPieces(config: GridConfig): Array<{ id: string; kind: string }> {
  return Object.entries(config.pieces).flatMap(([kind, count]) =>
    Array.from({ length: count }, (_, i) => ({ id: `${kind}${i + 1}`, kind })),
  );
}

export function boardChar(config: GridConfig, cell: number): string {
  const { cols } = gridSize(config);
  return config.board[Math.floor(cell / cols)][cell % cols];
}

/**
 * Put a piece on a cell (`null` = back to the tray). A piece already there
 * swaps places with it. Blocked and fixed cells are a rule violation.
 */
export function placeGrid(config: GridConfig, state: GridState, pieceId: string, cell: number | null): GridState {
  if (!gridPieces(config).some((p) => p.id === pieceId)) return state;
  const cells = [...state.cells];
  const from = cells.indexOf(pieceId);
  if (cell === null) {
    if (from >= 0) cells[from] = null;
    return { mode: 'grid', cells };
  }
  if (!Number.isInteger(cell) || cell < 0 || cell >= cells.length || boardChar(config, cell) !== '.') return state;
  const other = cells[cell];
  cells[cell] = pieceId;
  if (from >= 0) cells[from] = other;
  return { mode: 'grid', cells };
}

/** Board as rows of characters: '.', '#' or the kind of the piece on it. */
export function gridRows(config: GridConfig, state: GridState): string[] {
  const kindOf = new Map(gridPieces(config).map((p) => [p.id, p.kind]));
  const { rows, cols } = gridSize(config);
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const cell = r * cols + c;
      const fixed = boardChar(config, cell);
      if (fixed !== '.') return fixed;
      const piece = state.cells[cell];
      return piece ? kindOf.get(piece)! : '.';
    }).join(''),
  );
}

export function gridRulesHold(rules: GridConfig['rules'], rows: readonly string[]): boolean {
  const filled: Array<[number, number]> = [];
  rows.forEach((row, r) => [...row].forEach((ch, c) => ch !== '.' && ch !== '#' && filled.push([r, c])));
  for (let i = 0; i < filled.length; i++) {
    for (let j = i + 1; j < filled.length; j++) {
      const [r1, c1] = filled[i];
      const [r2, c2] = filled[j];
      if (rules?.includes('distinct_rows') && r1 === r2) return false;
      if (rules?.includes('distinct_cols') && c1 === c2) return false;
      if (rules?.includes('no_touch') && Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1) return false;
    }
  }
  return true;
}

/** Logic grid: enumerate every placement, the clues must leave exactly the solution; card text must match. */
function verifyLogicGrid(config: GridConfig, solution: string[], cardText: readonly string[] = []): VerifyResult {
  const logic = config.logic!;
  const errors: string[] = [];
  const kinds = Object.keys(config.pieces);
  const { rows, cols } = gridSize(config);
  if (rows !== cols || kinds.length !== rows || kinds.some((k) => config.pieces[k] !== 1)) {
    errors.push('a logic grid needs one piece per kind and as many kinds as rows and columns');
    return result(errors);
  }
  const target = JSON.stringify(placementOf(solution));
  const matches = [...allPlacements(kinds, rows)].filter((p) => logic.clues.every((c) => clueHolds(c, p)));
  if (matches.length !== 1) errors.push(`${matches.length} placements satisfy the clues, expected exactly 1`);
  else if (JSON.stringify(Object.fromEntries(Object.entries(matches[0]).sort())) !== JSON.stringify(Object.fromEntries(Object.entries(JSON.parse(target)).sort()))) {
    errors.push('the clues lead to a different placement than the solution');
  }
  const expected = logic.clues.map((c) => clueText(c, logic.names));
  if (JSON.stringify(expected) !== JSON.stringify(cardText)) errors.push(`the card text must be: ${JSON.stringify(expected)}`);
  return result(errors, [`${matches.length} placement(s) fit ${logic.clues.length} clues`]);
}

function verifyGrid(config: GridConfig, solution: string[], cardText?: readonly string[]): VerifyResult {
  if (config.logic) return verifyLogicGrid(config, solution, cardText);
  const errors: string[] = [];
  const { rows, cols } = gridSize(config);
  if (config.board.some((r) => r.length !== cols)) errors.push('board rows differ in length');
  if (solution.length !== rows || solution.some((r) => r.length !== cols)) return result([...errors, 'solution size differs from the board']);
  for (const kind of Object.keys(config.pieces)) if (!config.kinds[kind]) errors.push(`kind ${kind} has no label`);
  const free: number[] = [];
  for (let cell = 0; cell < rows * cols; cell++) {
    const fixed = boardChar(config, cell);
    const wanted = solution[Math.floor(cell / cols)][cell % cols];
    if (fixed === '.') free.push(cell);
    else if (wanted !== fixed) errors.push(`solution changes the fixed cell ${cell}`);
  }
  for (const [kind, count] of Object.entries(config.pieces)) {
    const placed = solution.join('').split(kind).length - 1 - (config.board.join('').split(kind).length - 1);
    if (placed !== count) errors.push(`solution places ${placed} × ${kind}, expected ${count}`);
  }
  if (!config.rules) return result(errors, ['no rules: uniqueness not checked']);
  if (!gridRulesHold(config.rules, solution)) errors.push('the solution breaks the rules');

  // Backtracking over the free cells: piece or nothing, pruned by the rules after every placement.
  const remaining = { ...config.pieces };
  const board = config.board.map((r) => [...r]);
  let matches = 0;
  let match: string[] | null = null;
  const place = (i: number) => {
    if (matches > 1) return;
    if (Object.values(remaining).every((n) => n === 0)) {
      matches++;
      match = board.map((r) => r.join(''));
      return;
    }
    if (i === free.length) return;
    const cell = free[i];
    const [r, c] = [Math.floor(cell / cols), cell % cols];
    for (const kind of Object.keys(remaining)) {
      if (!remaining[kind]) continue;
      board[r][c] = kind;
      remaining[kind]--;
      if (gridRulesHold(config.rules, board.map((row) => row.join('')))) place(i + 1);
      remaining[kind]++;
      board[r][c] = '.';
    }
    place(i + 1);
  };
  place(0);
  if (matches !== 1) errors.push(`${matches} placements satisfy the rules, expected exactly 1`);
  else if (!sameArray(match!, solution)) errors.push('the rules lead to a different placement than the solution');
  return result(errors, [`${matches} placement(s) fit the rules`]);
}

// ---------- Sticks ----------

/** Roman equations: cells 22 px wide, centred, glyphs from y 98 to 154. */
const ROMAN_CELL = 22;

const cellKinds = (config: SticksConfig) => [...config.roman!.cells] as Array<'n' | 'o'>;

export function stickSlots(config: SticksConfig): RomanSlot[] {
  if (!config.roman) return config.slots!;
  const kinds = cellKinds(config);
  return romanSlots(kinds, (256 - kinds.length * ROMAN_CELL) / 2, ROMAN_CELL, 98, 154);
}

export function stickStart(config: SticksConfig): string[] {
  return config.roman ? sticksFor(cellKinds(config), config.roman.start) : config.start!;
}

/** Start sticks no longer on their slot (the stick in hand counts as moved). */
export function sticksMoved(config: SticksConfig, on: readonly string[]): number {
  return stickStart(config).filter((s) => !on.includes(s)).length;
}

/**
 * Tap a slot: pick up its stick, or put the stick in hand there.
 * Rule violations change nothing: picking up a further stick beyond `moves`,
 * putting a stick on an occupied slot, unknown slots.
 */
export function tapStick(config: SticksConfig, state: SticksState, slot: string): SticksState {
  if (!stickSlots(config).some((s) => s.id === slot)) return state;
  const occupied = state.on.includes(slot);
  if (state.held) {
    if (occupied) return state;
    return { mode: 'sticks', on: [...state.on, slot], held: null };
  }
  if (!occupied) return state;
  const on = state.on.filter((s) => s !== slot);
  if (sticksMoved(config, on) > config.moves) return state;
  return { mode: 'sticks', on, held: slot };
}

/** Every arrangement reachable by moving at most `moves` sticks (as sorted slot lists). */
function reachableSticks(config: SticksConfig): string[][] {
  const ids = stickSlots(config).map((s) => s.id);
  const seen = new Set<string>();
  let frontier = [stickStart(config)];
  for (let m = 0; m < config.moves; m++) {
    const next: string[][] = [];
    for (const on of frontier) {
      for (const from of on) {
        for (const to of ids) {
          if (on.includes(to)) continue;
          const moved = [...on.filter((x) => x !== from), to].sort();
          const key = moved.join();
          if (seen.has(key) || sticksMoved(config, moved) > config.moves) continue;
          seen.add(key);
          next.push(moved);
        }
      }
    }
    frontier = next;
  }
  return [...seen].map((k) => k.split(','));
}

function verifyRoman(config: SticksConfig, solutions: string[]): VerifyResult {
  const errors: string[] = [];
  const slots = stickSlots(config);
  if (equationHolds(readEquation(slots, stickStart(config)))) errors.push('the start equation is already true');
  const reachable = new Set(
    reachableSticks(config).map((on) => readEquation(slots, on)).filter((text): text is string => equationHolds(text)),
  );
  if (!sameSet([...reachable], solutions)) errors.push(`reachable true equations: ${[...reachable].join(' | ') || 'none'}`);
  return result(errors, [`${reachable.size} true equation(s) within ${config.moves} move(s)`]);
}

function verifySticks(config: SticksConfig, solutions: string[][]): VerifyResult {
  const errors: string[] = [];
  const slots = stickSlots(config);
  const start = stickStart(config);
  const ids = new Set(slots.map((s) => s.id));
  if (ids.size !== slots.length) errors.push('slot ids must be unique');
  for (const id of start) if (!ids.has(id)) errors.push(`unknown start slot ${id}`);
  for (const sol of solutions) {
    if (sol.some((id) => !ids.has(id))) errors.push(`unknown slot in solution ${sol.join(',')}`);
    if (new Set(sol).size !== start.length) errors.push(`solution ${sol.join(',')} has a different number of sticks`);
    if (sticksMoved(config, sol) > config.moves) errors.push(`solution ${sol.join(',')} needs more than ${config.moves} moves`);
    if (sticksMoved(config, sol) === 0) errors.push('a solution equals the start');
  }
  return result(errors, [`${solutions.length} accepted solution(s)`]);
}

// ---------- Engine ----------

export const arrangeLogic: EngineLogic<ArrangeState> = {
  config: arrangeConfig,
  /** row: ids in order · grid: board rows · sticks: accepted slot sets, or equations for roman */
  solution: z.union([z.array(z.string()), z.array(z.array(z.string()))]),
  initial: (puzzle) => {
    const config = puzzle.config as ArrangeConfig;
    if (config.mode === 'row') return { mode: 'row', order: [...config.start] };
    if (config.mode === 'grid') {
      const { rows, cols } = gridSize(config);
      return { mode: 'grid', cells: Array.from({ length: rows * cols }, () => null) };
    }
    return { mode: 'sticks', on: stickStart(config), held: null };
  },
  check: (puzzle, state) => {
    const config = puzzle.config as ArrangeConfig;
    if (config.mode === 'row' && state.mode === 'row') return sameArray(state.order, puzzle.solution as string[]);
    if (config.mode === 'grid' && state.mode === 'grid') return sameArray(gridRows(config, state), puzzle.solution as string[]);
    if (config.mode === 'sticks' && state.mode === 'sticks') {
      if (state.held) return false;
      if (config.roman) {
        const text = readEquation(stickSlots(config), state.on);
        return equationHolds(text) && (puzzle.solution as string[]).includes(text!);
      }
      return (puzzle.solution as string[][]).some((sol) => sameSet(sol, state.on));
    }
    return false;
  },
  describe: (puzzle, state) => {
    const config = puzzle.config as ArrangeConfig;
    if (config.mode === 'grid' && state.mode === 'grid') return gridRows(config, state).join('/');
    if (state.mode === 'row') return state.order.join(',');
    if (config.mode === 'sticks' && state.mode === 'sticks' && config.roman) return readEquation(stickSlots(config), state.on) ?? '?';
    if (state.mode === 'sticks') return [...state.on].sort().join(',');
    return '–';
  },
  verify: (puzzle: Puzzle) => {
    const config = puzzle.config as ArrangeConfig;
    if (config.mode === 'row') return verifyRow(config, puzzle.solution as string[]);
    if (config.mode === 'grid') return verifyGrid(config, puzzle.solution as string[], puzzle.clues);
    if (config.roman) return verifyRoman(config, puzzle.solution as string[]);
    return verifySticks(config, puzzle.solution as string[][]);
  },
};
