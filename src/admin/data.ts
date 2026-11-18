import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { parseUserDoc } from '../services/AuthService';
import { db, toMillis } from '../services/firebase';
import { parseSave } from '../services/SaveService';
import type { EventDoc, EventType, SaveDoc, UserDoc } from '../types';

export interface AdminPlayer {
  user: UserDoc;
  /** Save of the current run, or null if the player has not started (or was reset). */
  save: SaveDoc | null;
}

/** [ADM-11] All users with their saves; loaded on open and on pull-to-refresh [ADM-12]. */
export async function loadPlayers(): Promise<AdminPlayer[]> {
  const [users, saves] = await Promise.all([getDocs(collection(db, 'users')), getDocs(collection(db, 'saves'))]);
  const saveByUid = new Map<string, SaveDoc>();
  for (const snap of saves.docs) {
    const save = parseSave(snap.data());
    if (save) saveByUid.set(snap.id, save);
  }
  return users.docs
    .map((snap) => parseUserDoc(snap.data()))
    .map((user) => {
      const save = saveByUid.get(user.uid);
      return { user, save: save && save.runId === user.runId ? save : null };
    })
    .sort((a, b) => a.user.displayName.localeCompare(b.user.displayName, 'de'));
}

export interface FeedEvent extends EventDoc {
  id: string;
}

export const FEED_LIMIT = 100;

function parseEvent(id: string, data: Record<string, unknown>): FeedEvent {
  return {
    id,
    uid: String(data.uid),
    runId: Number(data.runId),
    type: data.type as EventType,
    day: typeof data.day === 'number' ? data.day : null,
    data: (data.data ?? {}) as Record<string, unknown>,
    // Pending server timestamps fall back to the device time
    at: toMillis(data.at) ?? Number(data.clientAt),
    clientAt: Number(data.clientAt),
    appVersion: String(data.appVersion ?? ''),
  };
}

/** [ADM-12] The only realtime listener: the latest events of all players. */
export function subscribeFeed(onEvents: (events: FeedEvent[]) => void, onError: (e: Error) => void): Unsubscribe {
  const q = query(collection(db, 'events'), orderBy('at', 'desc'), limit(FEED_LIMIT));
  return onSnapshot(q, (snap) => onEvents(snap.docs.map((d) => parseEvent(d.id, d.data()))), onError);
}

/** [ADM-7] [ADM-10] */
export function updateUser(uid: string, patch: Partial<Pick<UserDoc, 'active' | 'displayName' | 'note'>>): Promise<void> {
  return updateDoc(doc(db, 'users', uid), patch);
}
