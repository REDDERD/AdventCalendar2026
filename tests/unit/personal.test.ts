import type { FieldValue } from 'firebase/firestore';
import { describe, expect, it } from 'vitest';
import { LETTER_MAX, toForm, toPatch } from '../../src/admin/personal';
import { joinGerman } from '../../src/services/PersonalService';

const DEL = 'DELETE' as unknown as FieldValue;
const remove = () => DEL;

describe('personal content editor (Section 12)', () => {
  it('fills missing fields with empty strings', () => {
    const form = toForm({ amortentiaScents: ['Zimt'], patronus: 'ein Otter' });
    expect(form.scents).toEqual(['Zimt', '', '']);
    expect(form.jokes).toEqual(['', '']);
    expect(form.patronus).toBe('ein Otter');
  });

  it('trims, drops empty scents and deletes empty fields so defaults apply', () => {
    const form = toForm({});
    form.scents = [' Regen ', '', 'Kakao'];
    form.patronus = '   ';
    const patch = toPatch(form, remove);
    expect(patch.amortentiaScents).toEqual(['Regen', 'Kakao']);
    expect(patch.patronus).toBe(DEL);
    expect(patch.insideJokes).toBe(DEL);
    expect(patch.letter).toBe(DEL);
  });

  it('keeps the position of the inside jokes (joke 2 alone is still the day-17 line)', () => {
    const form = toForm({});
    form.jokes = ['', 'Die Sache mit dem Käse'];
    expect(toPatch(form, remove).insideJokes).toEqual(['', 'Die Sache mit dem Käse']);
    form.jokes = ['Pinguine', ''];
    expect(toPatch(form, remove).insideJokes).toEqual(['Pinguine']);
  });

  it('caps the letter at 4000 characters', () => {
    const form = toForm({});
    form.letter = 'x'.repeat(LETTER_MAX + 50);
    expect((toPatch(form, remove).letter as string).length).toBe(LETTER_MAX);
  });

  it('joins scents the German way', () => {
    expect(joinGerman(['Zimt'])).toBe('Zimt');
    expect(joinGerman(['Zimt', 'Regen', 'Kakao'])).toBe('Zimt, Regen und Kakao');
  });
});
