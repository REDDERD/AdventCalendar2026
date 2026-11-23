import { HOUSES, type HouseId } from '../types';

/** One public line of the Rangliste (DECISIONS.md #78). */
export interface LeaderboardEntry {
  uid: string;
  name: string;
  house: HouseId;
  points: number;
}

export interface RankedPlayer extends LeaderboardEntry {
  rank: number;
}

export interface RankedHouse {
  house: HouseId;
  /** null while the house has no players */
  rank: number | null;
  players: number;
  total: number;
  /** average house points per player, rounded */
  average: number;
}

/** Players by house points; equal points share a rank (1, 1, 3). Ties are listed by name. */
export function rankPlayers(entries: LeaderboardEntry[]): RankedPlayer[] {
  const sorted = [...entries].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name, 'de'));
  return sorted.map((e, i) => ({ ...e, rank: i > 0 && sorted[i - 1].points === e.points ? -1 : i + 1 })).map((e, i, all) => {
    if (e.rank !== -1) return e;
    let j = i;
    while (all[j].rank === -1) j--;
    return { ...e, rank: all[j].rank };
  });
}

/** Houses by average points per player; houses without players come last, unranked. */
export function rankHouses(entries: LeaderboardEntry[]): RankedHouse[] {
  const rows = HOUSES.map((house) => {
    const members = entries.filter((e) => e.house === house);
    const total = members.reduce((n, e) => n + e.points, 0);
    return { house, players: members.length, total, average: members.length ? Math.round(total / members.length) : 0, rank: null as number | null };
  });
  const active = rows.filter((r) => r.players > 0).sort((a, b) => b.average - a.average || b.total - a.total);
  active.forEach((r, i) => {
    r.rank = i > 0 && active[i - 1].average === r.average ? active[i - 1].rank : i + 1;
  });
  return [...active, ...rows.filter((r) => r.players === 0)];
}
