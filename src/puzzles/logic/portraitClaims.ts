import { z } from 'zod';

/**
 * Statements of talking portraits for `tap` (p15a): exactly one frame holds the
 * original and says only true things; every copy says only false things. The
 * frames hang in a grid (`columns` per row, numbered 1… row by row). Each claim
 * is machine-readable so `puzzles:verify` can prove there is one answer, and the
 * German text is generated from it, so the card the player reads (`clues`)
 * always matches what is checked.
 */
const frame = z.number().int().min(1);

export const portraitClaim = z.discriminatedUnion('type', [
  /** The original hangs in a column left of / right of frame `of`'s column. */
  z.object({ type: z.literal('left_of'), of: frame }),
  z.object({ type: z.literal('right_of'), of: frame }),
  z.object({ type: z.literal('is_original'), of: frame }),
  z.object({ type: z.literal('is_copy'), of: frame }),
  z.object({ type: z.literal('both_copies'), a: frame, b: frame }),
  z.object({ type: z.literal('either'), a: frame, b: frame }),
  z.object({ type: z.literal('top_row') }),
  z.object({ type: z.literal('bottom_row') }),
  z.object({ type: z.literal('my_row') }),
  z.object({ type: z.literal('other_row') }),
  z.object({ type: z.literal('my_column') }),
  z.object({ type: z.literal('next_to_me') }),
  z.object({ type: z.literal('above_or_below_me') }),
  z.object({ type: z.literal('at_edge') }),
  z.object({ type: z.literal('not_at_edge') }),
]);
export type PortraitClaim = z.infer<typeof portraitClaim>;

export const portraitClaims = z.object({
  /** Frames per row; the number of statements is the number of frames (two rows). */
  columns: z.number().int().min(2).max(5),
  /** Statement i is spoken by frame i + 1. */
  statements: z.array(portraitClaim).min(2),
});
export type PortraitClaims = z.infer<typeof portraitClaims>;

const rowOf = (c: PortraitClaims, frameNo: number) => Math.floor((frameNo - 1) / c.columns);
const colOf = (c: PortraitClaims, frameNo: number) => (frameNo - 1) % c.columns;

/** Is `claim`, spoken by frame `me`, true if frame `original` holds the original? */
export function claimHolds(c: PortraitClaims, claim: PortraitClaim, me: number, original: number): boolean {
  switch (claim.type) {
    case 'left_of':
      return colOf(c, original) < colOf(c, claim.of);
    case 'right_of':
      return colOf(c, original) > colOf(c, claim.of);
    case 'is_original':
      return original === claim.of;
    case 'is_copy':
      return original !== claim.of;
    case 'both_copies':
      return original !== claim.a && original !== claim.b;
    case 'either':
      return original === claim.a || original === claim.b;
    case 'top_row':
      return rowOf(c, original) === 0;
    case 'bottom_row':
      return rowOf(c, original) === 1;
    case 'my_row':
      return rowOf(c, original) === rowOf(c, me);
    case 'other_row':
      return rowOf(c, original) !== rowOf(c, me);
    case 'my_column':
      return colOf(c, original) === colOf(c, me);
    case 'next_to_me':
      return rowOf(c, original) === rowOf(c, me) && Math.abs(original - me) === 1;
    case 'above_or_below_me':
      return Math.abs(original - me) === c.columns;
    case 'at_edge':
      return [0, c.columns - 1].includes(colOf(c, original));
    case 'not_at_edge':
      return ![0, c.columns - 1].includes(colOf(c, original));
  }
}

/** The German sentence, as the card shows it. */
export function claimText(claim: PortraitClaim): string {
  switch (claim.type) {
    case 'left_of':
      return `Das Original hängt weiter links als Bild ${claim.of}.`;
    case 'right_of':
      return `Das Original hängt weiter rechts als Bild ${claim.of}.`;
    case 'is_original':
      return `Bild ${claim.of} ist das Original.`;
    case 'is_copy':
      return `Bild ${claim.of} ist eine Kopie.`;
    case 'both_copies':
      return `Bild ${claim.a} und Bild ${claim.b} sind Kopien.`;
    case 'either':
      return `Das Original ist Bild ${claim.a} oder Bild ${claim.b}.`;
    case 'top_row':
      return 'Das Original hängt in der oberen Reihe.';
    case 'bottom_row':
      return 'Das Original hängt in der unteren Reihe.';
    case 'my_row':
      return 'Das Original hängt in meiner Reihe.';
    case 'other_row':
      return 'Das Original hängt in der anderen Reihe.';
    case 'my_column':
      return 'Das Original hängt in meiner Spalte.';
    case 'next_to_me':
      return 'Das Original hängt direkt neben mir.';
    case 'above_or_below_me':
      return 'Das Original hängt direkt über oder unter mir.';
    case 'at_edge':
      return 'Das Original hängt am Rand.';
    case 'not_at_edge':
      return 'Das Original hängt nicht am Rand.';
  }
}

/** The card line for frame `me`: "Bild 3: „…“". */
export const claimLine = (me: number, claim: PortraitClaim): string => `Bild ${me}: „${claimText(claim)}“`;

/** Frames where "the original is here, so it speaks the truth and every copy lies" works out. */
export function consistentOriginals(c: PortraitClaims): number[] {
  const frames = Array.from({ length: c.statements.length }, (_, i) => i + 1);
  return frames.filter((original) => frames.every((me) => claimHolds(c, c.statements[me - 1], me, original) === (me === original)));
}

/** Number of statements that contradict the hypothesis "frame `original` is the original", per hypothesis. */
export function contradictions(c: PortraitClaims, original: number): number {
  return c.statements.filter((s, i) => claimHolds(c, s, i + 1, original) !== (i + 1 === original)).length;
}
