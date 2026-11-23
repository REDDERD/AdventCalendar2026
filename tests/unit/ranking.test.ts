import { describe, expect, it } from 'vitest';
import { rankHouses, rankPlayers, type LeaderboardEntry } from '../../src/core/ranking';

const e = (uid: string, house: LeaderboardEntry['house'], points: number): LeaderboardEntry => ({ uid, name: uid, house, points });

describe('Rangliste (DECISIONS.md #78)', () => {
  it('ranks players by house points; equal points share a place', () => {
    const ranked = rankPlayers([e('Bea', 'ravenclaw', 120), e('Ada', 'gryffindor', 200), e('Cem', 'hufflepuff', 120), e('Dov', 'slytherin', 40)]);
    expect(ranked.map((p) => [p.name, p.rank])).toEqual([['Ada', 1], ['Bea', 2], ['Cem', 2], ['Dov', 4]]);
  });

  it('ranks houses by the average per player, empty houses last and unranked', () => {
    const houses = rankHouses([e('a', 'gryffindor', 100), e('b', 'gryffindor', 300), e('c', 'hufflepuff', 250), e('d', 'ravenclaw', 199)]);
    expect(houses.map((h) => [h.house, h.rank, h.average, h.players, h.total])).toEqual([
      ['hufflepuff', 1, 250, 1, 250],
      ['gryffindor', 2, 200, 2, 400],
      ['ravenclaw', 3, 199, 1, 199],
      ['slytherin', null, 0, 0, 0],
    ]);
  });

  it('a big house does not win just by numbers', () => {
    const houses = rankHouses([e('a', 'slytherin', 50), e('b', 'slytherin', 50), e('c', 'slytherin', 50), e('d', 'gryffindor', 60)]);
    expect(houses[0].house).toBe('gryffindor');
  });

  it('equal averages share a place', () => {
    const houses = rankHouses([e('a', 'slytherin', 80), e('b', 'gryffindor', 80)]);
    expect(houses.slice(0, 2).map((h) => h.rank)).toEqual([1, 1]);
  });
});
