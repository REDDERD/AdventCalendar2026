import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  connectAuthEmulator,
  indexedDBLocalPersistence,
  initializeAuth,
} from 'firebase/auth';
import {
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  Timestamp,
} from 'firebase/firestore';
import { firebaseConfig, USE_EMULATOR } from '../config';

// The emulator runs a demo project so local data can never touch production.
export const app = initializeApp(USE_EMULATOR ? { ...firebaseConfig, projectId: 'demo-hogwarts' } : firebaseConfig);

// [AUTH-4] Stay signed in permanently.
export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence],
});

// [EVT-2] The persistent cache queues writes while offline.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  ignoreUndefinedProperties: true,
});

if (USE_EMULATOR) {
  const host = location.hostname;
  connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
  connectFirestoreEmulator(db, host, 8080);
}

export function toMillis(value: unknown): number | null {
  if (value instanceof Timestamp) return value.toMillis();
  if (typeof value === 'number') return value;
  return null;
}
