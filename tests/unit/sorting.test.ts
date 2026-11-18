import { describe, expect, it } from 'vitest';
import { evaluateSorting, scoreSorting, shuffled, SORTING_QUESTIONS } from '../../src/content/sortingQuiz';
import { HOUSES, type HouseId } from '../../src/types';

const G: HouseId = 'gryffindor';
const H: HouseId = 'hufflepuff';
const R: HouseId = 'ravenclaw';
const S: HouseId = 'slytherin';

describe('sorting quiz data [HAT-1]', () => {
  it('has 5 questions with exactly one answer per house', () => {
    expect(SORTING_QUESTIONS).toHaveLength(5);
    for (const q of SORTING_QUESTIONS) {
      expect(Object.keys(q.answers).sort()).toEqual([...HOUSES].sort());
      for (const text of Object.values(q.answers)) expect(text.length).toBeGreaterThan(0);
    }
  });

  it('gives 2 points per answer', () => {
    expect(scoreSorting([G, G, R, S, G])).toEqual({ gryffindor: 6, hufflepuff: 0, ravenclaw: 2, slytherin: 2 });
  });
});

describe('evaluateSorting [HAT-1]', () => {
  it('picks the house with the most points', () => {
    expect(evaluateSorting([R, R, R, G, H])).toBe(R);
    expect(evaluateSorting([S, S, S, S, S])).toBe(S);
  });

  it('breaks a tie with the answer to question 4', () => {
    // G 4, H 4, R 2; question 4 = H
    expect(evaluateSorting([G, G, H, H, R])).toBe(H);
    // S 4, G 4, H 2; question 4 = G
    expect(evaluateSorting([S, H, S, G, G])).toBe(G);
  });

  it('falls back to the latest tied answer when question 4 is not tied', () => {
    // G 4, H 4, R 2; question 4 = R → latest tied answer is question 5 = H
    expect(evaluateSorting([G, G, H, R, H])).toBe(H);
    // G 4, H 4, R 2; question 4 = R → question 5 = G
    expect(evaluateSorting([G, H, H, R, G])).toBe(G);
  });

  it('handles a four-way-ish tie (2/2/2/4 is no tie)', () => {
    expect(evaluateSorting([G, H, R, S, S])).toBe(S);
  });

  it('rejects incomplete answers', () => {
    expect(() => evaluateSorting([G, G])).toThrow();
  });
});

describe('shuffled', () => {
  it('keeps all elements', () => {
    expect(shuffled(HOUSES).sort()).toEqual([...HOUSES].sort());
  });
});
