import { doc, getDocFromServer, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, toMillis } from './firebase';

const DEBUG_KEY = 'hogwarts.debugDate';
const TIMEOUT_MS = 5000;

let serverOffset = 0;
let debug: { base: number; setAt: number } | null = null;
let debugAllowed = false;

/**
 * [DAY-2] Measure the device clock against server time by writing
 * `lastSeenAt: serverTimestamp()` and reading it back. Offline: device clock.
 */
export async function measureServerOffset(uid: string): Promise<number> {
  const ref = doc(db, 'users', uid);
  const t0 = Date.now();
  try {
    await withTimeout(updateDoc(ref, { lastSeenAt: serverTimestamp() }));
    const snap = await withTimeout(getDocFromServer(ref));
    const t1 = Date.now();
    const server = toMillis(snap.get('lastSeenAt'));
    if (server !== null) serverOffset = server - (t0 + t1) / 2;
  } catch (e) {
    console.warn('Server time not available, using device clock', e);
    serverOffset = 0;
  }
  return serverOffset;
}

/** [DAY-7] Debug date is only honoured for the admin. */
export function enableDebugDate(allowed: boolean): void {
  debugAllowed = allowed;
  debug = null;
  if (!allowed) return;
  try {
    const raw = localStorage.getItem(DEBUG_KEY);
    if (raw) debug = JSON.parse(raw) as { base: number; setAt: number };
  } catch {
    debug = null;
  }
}

/** Set (or clear with null) a debug date; time keeps running from there. */
export function setDebugDate(value: number | null): void {
  if (!debugAllowed) return;
  debug = value === null ? null : { base: value, setAt: Date.now() };
  try {
    if (debug) localStorage.setItem(DEBUG_KEY, JSON.stringify(debug));
    else localStorage.removeItem(DEBUG_KEY);
  } catch {
    // storage unavailable: debug date lasts for this session only
  }
}

export function debugDateActive(): boolean {
  return debugAllowed && debug !== null;
}

export function now(): number {
  if (debugAllowed && debug) return debug.base + (Date.now() - debug.setAt);
  return Date.now() + serverOffset;
}

function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)),
  ]);
}
