import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import type { LeaderboardEntry } from '../core/ranking';
import { HOUSES, type HouseId, type SaveDoc, type UserDoc } from '../types';
import { db } from './firebase';

/**
 * Rangliste (DECISIONS.md #78): every real player keeps one public line
 * `leaderboard/{uid}` with character name, house and house points. Test
 * accounts (including the admin) never get one; the rules enforce it.
 */

let lastWritten = '';

/** Write the player's line when name, house or points changed. */
export function syncLeaderboard(save: SaveDoc, user: UserDoc | null): void {
  if (!save.profile || !user || user.isTest || !user.active || user.uid !== save.uid) return;
  const entry = { name: save.profile.name.slice(0, 40), house: save.profile.house, points: save.housePoints };
  const key = `${save.uid}|${entry.name}|${entry.house}|${entry.points}`;
  if (key === lastWritten) return;
  lastWritten = key;
  setDoc(doc(db, 'leaderboard', save.uid), { ...entry, updatedAt: serverTimestamp() }).catch((e) => {
    lastWritten = '';
    console.error('Leaderboard update failed', e);
  });
}

export async function loadLeaderboard(): Promise<LeaderboardEntry[]> {
  const snap = await getDocs(collection(db, 'leaderboard'));
  return snap.docs
    .map((d) => {
      const data = d.data();
      return { uid: d.id, name: String(data.name ?? ''), house: data.house as HouseId, points: Number(data.points ?? 0) };
    })
    .filter((e) => e.name && HOUSES.includes(e.house));
}

/** Admin: take a player off the list (reset, deactivation). */
export function removeFromLeaderboard(uid: string): Promise<void> {
  return deleteDoc(doc(db, 'leaderboard', uid));
}
