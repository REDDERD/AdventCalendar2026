import { deleteField, type FieldValue } from 'firebase/firestore';
import type { PersonalDoc } from '../services/PersonalService';

export const LETTER_MAX = 4000;

/** The text fields of Section 12 as the editor shows them; the photo follows in M6. */
export interface PersonalForm {
  scents: [string, string, string];
  jokes: [string, string];
  patronus: string;
  favoriteSweet: string;
  letter: string;
  letterSignature: string;
  surprise: string;
}

const pad = <T extends string[]>(values: string[] | undefined, n: number): T =>
  Array.from({ length: n }, (_, i) => values?.[i] ?? '') as T;

export function toForm(doc: PersonalDoc): PersonalForm {
  return {
    scents: pad(doc.amortentiaScents, 3),
    jokes: pad(doc.insideJokes, 2),
    patronus: doc.patronus ?? '',
    favoriteSweet: doc.favoriteSweet ?? '',
    letter: doc.letter ?? '',
    letterSignature: doc.letterSignature ?? '',
    surprise: doc.surprise ?? '',
  };
}

type Patch = { [K in keyof PersonalDoc]?: PersonalDoc[K] | FieldValue };

/**
 * Empty fields are removed, so the game falls back to its neutral defaults (Section 12).
 * Inside jokes keep their position: joke 2 alone stays the day-17 line.
 */
export function toPatch(form: PersonalForm, remove: () => FieldValue = deleteField): Patch {
  const text = (v: string) => (v.trim() ? v.trim() : remove());
  const scents = form.scents.map((s) => s.trim()).filter(Boolean);
  const jokes = form.jokes.map((s) => s.trim());
  while (jokes.length && !jokes[jokes.length - 1]) jokes.pop();
  return {
    amortentiaScents: scents.length ? scents : remove(),
    insideJokes: jokes.length ? jokes : remove(),
    patronus: text(form.patronus),
    favoriteSweet: text(form.favoriteSweet),
    letter: form.letter.trim() ? form.letter.trim().slice(0, LETTER_MAX) : remove(),
    letterSignature: text(form.letterSignature),
    surprise: text(form.surprise),
  };
}
