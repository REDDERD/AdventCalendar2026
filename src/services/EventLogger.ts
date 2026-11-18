import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { APP_VERSION } from '../config';
import type { EventType } from '../types';
import { db } from './firebase';

let context: { uid: string; runId: number } | null = null;

export function setEventContext(uid: string, runId: number): void {
  context = { uid, runId };
}

export function clearEventContext(): void {
  context = null;
}

/**
 * Section 14.3: append-only protocol for the admin console.
 * Offline events are queued by the Firestore cache [EVT-2], so this never awaits.
 */
export function logEvent(type: EventType, day: number | null, data: Record<string, unknown> = {}): void {
  if (!context) {
    console.warn(`Event ${type} dropped: no user context`);
    return;
  }
  addDoc(collection(db, 'events'), {
    uid: context.uid,
    runId: context.runId,
    type,
    day,
    data,
    at: serverTimestamp(),
    clientAt: Date.now(),
    appVersion: APP_VERSION,
  }).catch((e) => console.error(`Event ${type} failed`, e));
}

export function detectPlatform(): { platform: 'ios' | 'android' | 'other'; standalone: boolean } {
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const platform = ios ? 'ios' : /Android/i.test(ua) ? 'android' : 'other';
  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return { platform, standalone };
}
