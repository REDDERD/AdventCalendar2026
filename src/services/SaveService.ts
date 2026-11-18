import { doc, getDoc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import { START_SPARKS } from '../puzzles/scoring';
import type { SaveDoc } from '../types';
import { saveDocSchema } from '../types/schemas';
import { db, toMillis } from './firebase';

const DEBOUNCE_MS = 500;

export function newSave(uid: string, runId: number): SaveDoc {
  return {
    uid,
    runId,
    schemaVersion: 1,
    profile: null,
    vars: {},
    progress: { completedDays: [], current: null, dayStartedAt: {}, dayCompletedAt: {} },
    puzzles: {},
    housePoints: 0,
    sparks: START_SPARKS,
    foundSparks: [],
    diary: [],
    ending: null,
    settings: { textSpeed: 'normal', music: true, sfx: true },
    updatedAt: Date.now(),
  };
}

function millisRecord(value: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries((value ?? {}) as Record<string, unknown>)) {
    const ms = toMillis(v);
    if (ms !== null) out[k] = ms;
  }
  return out;
}

function timestampRecord(value: Record<string, number>): Record<string, Timestamp> {
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, Timestamp.fromMillis(v)]));
}

export function parseSave(data: Record<string, unknown>): SaveDoc | null {
  const progress = (data.progress ?? {}) as Record<string, unknown>;
  const result = saveDocSchema.safeParse({
    ...data,
    progress: {
      ...progress,
      dayStartedAt: millisRecord(progress.dayStartedAt),
      dayCompletedAt: millisRecord(progress.dayCompletedAt),
    },
    updatedAt: toMillis(data.updatedAt) ?? Date.now(),
  });
  if (!result.success) {
    console.error('Invalid save document', result.error);
    return null;
  }
  return result.data as SaveDoc;
}

/** Load `saves/{uid}`. A save from an older run (after a reset [ADM-8]) is discarded. */
export async function loadSave(uid: string, runId: number): Promise<SaveDoc> {
  const snap = await getDoc(doc(db, 'saves', uid));
  if (snap.exists()) {
    const save = parseSave(snap.data());
    if (save && save.runId === runId) return save;
  }
  return newSave(uid, runId);
}

let pending: SaveDoc | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;

function write(save: SaveDoc): Promise<void> {
  // Not awaited by callers: offline, the promise only resolves after sync [EVT-2].
  return setDoc(doc(db, 'saves', save.uid), {
    ...save,
    progress: {
      ...save.progress,
      dayStartedAt: timestampRecord(save.progress.dayStartedAt),
      dayCompletedAt: timestampRecord(save.progress.dayCompletedAt),
    },
    updatedAt: serverTimestamp(),
  }).catch((e) => console.error('Saving failed', e));
}

/** [DAY-4] Save after every step, debounced. */
export function scheduleSave(save: SaveDoc): void {
  pending = save;
  if (timer) clearTimeout(timer);
  timer = setTimeout(flushSave, DEBOUNCE_MS);
}

/** Save immediately (decisions). */
export function saveNow(save: SaveDoc): void {
  pending = save;
  flushSave();
}

export function flushSave(): void {
  if (timer) clearTimeout(timer);
  timer = null;
  if (!pending) return;
  const save = pending;
  pending = null;
  void write(save);
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flushSave);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushSave();
  });
}
