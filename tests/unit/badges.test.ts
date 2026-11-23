import { describe, expect, it } from 'vitest';
import { badgeStates, BADGES } from '../../src/core/badges';
import { newSave } from '../../src/services/SaveService';
import type { PuzzleResult } from '../../src/types';

const result = (attempts: number, hints: number[] = [], solvedBy: PuzzleResult['solvedBy'] = 'self'): PuzzleResult => ({
  solved: true, solvedBy, attempts, hintsBought: hints, points: 10,
});

describe('Steckbrief badges (DECISIONS.md #79)', () => {
  it('a fresh save has earned nothing', () => {
    expect(badgeStates(newSave('u', 1)).filter((b) => b.earned)).toEqual([]);
  });

  it('counts found sparks, days, first tries and puzzles without hints; Quill’s help counts for neither', () => {
    const save = newSave('u', 1);
    save.foundSparks = Array.from({ length: 12 }, (_, i) => `d01.s${i}`);
    save.progress.completedDays = [1, 2, 3, 4, 5, 6, 7];
    save.puzzles = {
      p01: result(1), p02: result(1), p03: result(1), p04: result(1, [1]), p05: result(2),
      p06: result(1, [], 'help'), p07: result(1),
    };
    const state = Object.fromEntries(badgeStates(save).map((b) => [b.badge.id, [b.earned, b.value]]));
    expect(state).toMatchObject({
      sparks10: [true, 10], sparks30: [false, 12], firsttry: [true, 5], nohint: [false, 5],
      week: [true, 7], half: [false, 7], all: [false, 7], ownway: [false, 0],
    });
  });

  it('every badge has an icon id and a reachable goal', () => {
    for (const b of BADGES) {
      expect(b.goal, b.id).toBeGreaterThan(0);
      expect(b.id).toMatch(/^[a-z0-9]+$/);
    }
  });
});
