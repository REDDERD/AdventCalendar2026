import { describe, expect, it } from 'vitest';
import { ENDING_CARDS, epilogueLines, houseCup } from '../../src/content/finale';
import { HOUSES, type Profile } from '../../src/types';

describe('after day 24 (Section 8.6 / 8.7)', () => {
  it('has an end card for every ending', () => {
    expect(Object.keys(ENDING_CARDS).sort()).toEqual(['A', 'B', 'C_A', 'C_B']);
  });

  it('[PZL-7] the own house wins, the others end 12, 18 and 25 % below', () => {
    expect(houseCup('ravenclaw', 1000, HOUSES)).toEqual([
      { house: 'ravenclaw', points: 1000 },
      { house: 'gryffindor', points: 880 },
      { house: 'hufflepuff', points: 820 },
      { house: 'slytherin', points: 750 },
    ]);
  });

  it('lists every epilogue line that applies, in order, and always closes', () => {
    const profile = { hatOverruled: true } as Profile;
    const all = epilogueLines({ bond_ellis: 4, trust_theo: 2, maren_covered: true, trust_grimsby: 1 }, profile);
    expect(all).toHaveLength(6);
    expect(all[0]).toContain('Schal');
    expect(all[4]).toContain('Hut');
    expect(epilogueLines({ bond_ellis: 3, trust_theo: 1 }, null)).toHaveLength(1);
  });
});
