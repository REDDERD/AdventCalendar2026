import { z } from 'zod';
import { permutations } from './types';

/**
 * Logic-grid clues for `arrange` mode `grid` (p06): every kind is placed once,
 * columns are positions (doors 1…n, left to right), rows are attributes
 * (treats). The clues are machine-readable so `puzzles:verify` can prove
 * uniqueness, and their German text is generated from them – the card the
 * player reads always matches what is checked.
 */
const ref = z.union([z.object({ kind: z.string().length(1) }), z.object({ item: z.number().int().min(0) })]);
export type ClueRef = z.infer<typeof ref>;

export const gridClue = z.discriminatedUnion('type', [
  /** `a` stands at door `door` and/or holds item `item`. */
  z.object({ type: z.literal('is'), a: ref, door: z.number().int().optional(), item: z.number().int().optional() }),
  z.object({ type: z.literal('is_not'), a: ref, door: z.number().int().optional(), item: z.number().int().optional() }),
  /** door(a) = door(b) + by (1 = directly right of b). */
  z.object({ type: z.literal('offset'), a: ref, b: ref, by: z.number().int() }),
  z.object({ type: z.literal('next_to'), a: ref, b: ref }),
  z.object({ type: z.literal('not_next_to'), a: ref, b: ref }),
  /** door(a) < door(b). */
  z.object({ type: z.literal('left_of'), a: ref, b: ref }),
]);
export type GridClue = z.infer<typeof gridClue>;

export const gridLogic = z.object({
  /** How the clue text names things: kinds ("Theos Stiefel") and items per row. */
  names: z.object({
    kinds: z.record(z.string().length(1), z.string()),
    items: z.array(z.object({ a: z.string(), none: z.string(), boot: z.string() })),
  }),
  clues: z.array(gridClue).min(1),
});
export type GridLogic = z.infer<typeof gridLogic>;

/** kind → [item row, door column] */
export type Placement = Record<string, [number, number]>;

function locate(p: Placement, r: ClueRef): [number, number] | null {
  if ('kind' in r) return p[r.kind] ?? null;
  const hit = Object.values(p).find(([row]) => row === r.item);
  return hit ?? null;
}

export function clueHolds(clue: GridClue, p: Placement): boolean {
  const a = locate(p, clue.a);
  if (!a) return false;
  if (clue.type === 'is' || clue.type === 'is_not') {
    const match = (clue.door === undefined || a[1] === clue.door) && (clue.item === undefined || a[0] === clue.item);
    return clue.type === 'is' ? match : !match;
  }
  const b = locate(p, clue.b);
  if (!b) return false;
  switch (clue.type) {
    case 'offset':
      return a[1] === b[1] + clue.by;
    case 'next_to':
      return Math.abs(a[1] - b[1]) === 1;
    case 'not_next_to':
      return Math.abs(a[1] - b[1]) !== 1;
    case 'left_of':
      return a[1] < b[1];
  }
}

/** Every placement of the kinds (one each) with distinct rows and columns. */
export function* allPlacements(kinds: readonly string[], size: number): Generator<Placement> {
  const idx = Array.from({ length: size }, (_, i) => i);
  const rowPerms = [...permutations(idx)];
  for (const rows of rowPerms) {
    for (const cols of rowPerms) {
      yield Object.fromEntries(kinds.map((k, i) => [k, [rows[i], cols[i]]]));
    }
  }
}

/** Board rows ('.' and kind letters) → placement. */
export function placementOf(rows: readonly string[]): Placement {
  const p: Placement = {};
  rows.forEach((row, r) => [...row].forEach((ch, c) => ch !== '.' && ch !== '#' && (p[ch] = [r, c])));
  return p;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** „der Stiefel …“ → „dem Stiefel …“, „dein Stiefel“ → „deinem Stiefel“. */
const dative = (s: string) => s.replace(/^der /, 'dem ').replace(/^dein /, 'deinem ');

/** The German sentence for a clue. */
export function clueText(clue: GridClue, names: GridLogic['names']): string {
  const name = (r: ClueRef) => ('kind' in r ? names.kinds[r.kind] : names.items[r.item].boot);
  const A = cap(name(clue.a));
  switch (clue.type) {
    case 'is':
    case 'is_not': {
      const not = clue.type === 'is_not';
      if (clue.door !== undefined && clue.item === undefined) return `${A} steht ${not ? 'nicht ' : ''}vor Tür ${clue.door + 1}.`;
      if (clue.item !== undefined && clue.door === undefined && 'kind' in clue.a) {
        const item = names.items[clue.item];
        return `In ${dative(name(clue.a))} liegt ${not ? item.none : item.a}.`;
      }
      return `${A} steht ${not ? 'nicht ' : ''}vor Tür ${(clue.door ?? 0) + 1}${clue.item !== undefined ? ` und enthält ${names.items[clue.item].a}` : ''}.`;
    }
    case 'offset': {
      const B = name(clue.b);
      if (clue.by === 1) return `${A} steht direkt rechts neben ${dative(B)}.`;
      if (clue.by === -1) return `${A} steht direkt links neben ${dative(B)}.`;
      const n = Math.abs(clue.by) === 2 ? 'zwei' : Math.abs(clue.by) === 3 ? 'drei' : String(Math.abs(clue.by));
      return `${A} steht ${n} Türen ${clue.by > 0 ? 'rechts' : 'links'} von ${dative(B)}.`;
    }
    case 'next_to':
      return `${A} und ${name(clue.b)} stehen nebeneinander.`;
    case 'not_next_to':
      return `${A} und ${name(clue.b)} stehen nicht nebeneinander.`;
    case 'left_of':
      return `${A} steht weiter links als ${name(clue.b)}.`;
  }
}
