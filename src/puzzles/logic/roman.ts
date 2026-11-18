/**
 * Roman matchstick equations for `arrange` mode `sticks` (p22): every slot
 * belongs to a cell and plays a role in a glyph, so a state can be read as
 * text ("V+I=VI") and checked. Used by `puzzles:verify` to prove that exactly
 * the listed solutions are reachable [PLAN-3].
 */

/** Numeral cells hold I, V or X; operator cells +, − or =. */
export const NUMERAL_ROLES = ['I', 'V1', 'V2', 'X1', 'X2'] as const;
export const OPERATOR_ROLES = ['H', 'P', 'E1', 'E2'] as const;
export type StickRole = (typeof NUMERAL_ROLES)[number] | (typeof OPERATOR_ROLES)[number];

export interface RomanSlot {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cell?: number;
  role?: StickRole;
}

const GLYPHS: Record<string, string> = {
  '': '',
  I: 'I',
  'V1,V2': 'V',
  'X1,X2': 'X',
  'H,P': '+',
  H: '-',
  'E1,E2': '=',
};

/** The glyph a cell shows, '' when empty, null when the sticks form no glyph. */
export function readCell(roles: readonly string[]): string | null {
  return GLYPHS[[...roles].sort().join(',')] ?? null;
}

/** Read the sticks as text, cell by cell; null if any cell is not a glyph. */
export function readEquation(slots: readonly RomanSlot[], on: readonly string[]): string | null {
  const cells = new Map<number, string[]>();
  for (const s of slots) {
    if (s.cell === undefined || !s.role) continue;
    if (!cells.has(s.cell)) cells.set(s.cell, []);
    if (on.includes(s.id)) cells.get(s.cell)!.push(s.role);
  }
  let text = '';
  for (const cell of [...cells.keys()].sort((a, b) => a - b)) {
    const glyph = readCell(cells.get(cell)!);
    if (glyph === null) return null;
    text += glyph;
  }
  return text;
}

/** Value of a canonical Roman numeral up to 39, else null ("IIII", "VX" …). */
export function romanValue(s: string): number | null {
  if (!/^X{0,3}(IX|IV|V?I{0,3})$/.test(s) || !s) return null;
  const v: Record<string, number> = { I: 1, V: 5, X: 10 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = v[s[i]];
    total += cur < (v[s[i + 1]] ?? 0) ? -cur : cur;
  }
  return total;
}

/** "V+I=VI" → true. Exactly one "=", numbers joined by + and −. */
export function equationHolds(text: string | null): boolean {
  if (!text) return false;
  const sides = text.split('=');
  if (sides.length !== 2) return false;
  const evaluate = (side: string): number | null => {
    const parts = side.split(/([+-])/);
    let total = 0;
    let sign = 1;
    for (let i = 0; i < parts.length; i++) {
      if (i % 2) {
        sign = parts[i] === '+' ? 1 : -1;
        continue;
      }
      const value = romanValue(parts[i]);
      if (value === null) return null;
      total += sign * value;
    }
    return total;
  };
  const left = evaluate(sides[0]);
  const right = evaluate(sides[1]);
  return left !== null && right !== null && left === right;
}

/**
 * Slots for a row of cells ('n' = numeral, 'o' = operator), cell width `w`,
 * glyph height from `top` to `bottom`. Ids look like "c3.V1".
 */
export function romanSlots(kinds: ReadonlyArray<'n' | 'o'>, x0: number, w: number, top: number, bottom: number): RomanSlot[] {
  const mid = (top + bottom) / 2;
  const half = w / 2 - 2;
  return kinds.flatMap((kind, cell) => {
    const cx = x0 + cell * w + w / 2;
    const at = (role: StickRole, x1: number, y1: number, x2: number, y2: number): RomanSlot => ({
      id: `c${cell}.${role}`, cell, role, x1, y1, x2, y2,
    });
    if (kind === 'n') {
      return [
        at('I', cx, top, cx, bottom),
        at('V1', cx - half, top, cx, bottom),
        at('V2', cx + half, top, cx, bottom),
        at('X1', cx - half, top, cx + half, bottom),
        at('X2', cx + half, top, cx - half, bottom),
      ];
    }
    return [
      at('H', cx - half, mid, cx + half, mid),
      at('P', cx, mid - half, cx, mid + half),
      at('E1', cx - half, mid - 7, cx + half, mid - 7),
      at('E2', cx - half, mid + 7, cx + half, mid + 7),
    ];
  });
}

/** Occupied slot ids that spell `text` in the given cell kinds (numbers right-aligned in their cells). */
export function sticksFor(kinds: ReadonlyArray<'n' | 'o'>, text: string): string[] {
  const roles: Record<string, string[]> = {
    I: ['I'], V: ['V1', 'V2'], X: ['X1', 'X2'], '+': ['H', 'P'], '-': ['H'], '=': ['E1', 'E2'],
  };
  // Split the text into numbers and operators and fill the cells.
  const tokens = text.split(/([+\-=])/);
  const out: string[] = [];
  let cell = 0;
  for (const token of tokens) {
    if (/^[+\-=]$/.test(token)) {
      while (kinds[cell] !== 'o') cell++;
      out.push(...roles[token].map((r) => `c${cell}.${r}`));
      cell++;
      continue;
    }
    let end = cell;
    while (end < kinds.length && kinds[end] === 'n') end++;
    const start = end - token.length;
    if (start < cell) throw new Error(`"${token}" does not fit`);
    [...token].forEach((ch, i) => out.push(...roles[ch].map((r) => `c${start + i}.${r}`)));
    cell = end;
  }
  return out;
}
