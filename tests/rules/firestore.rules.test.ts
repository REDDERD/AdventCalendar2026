import fs from 'node:fs';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { deleteApp, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  type Firestore,
} from 'firebase/firestore';
import { afterAll, beforeEach, describe, it } from 'vitest';

// Runs inside `firebase emulators:exec`, which loads firestore.rules from firebase.json.
const PROJECT = 'demo-hogwarts';
const HOST = '127.0.0.1';
const PORT = 8080;

const rules = fs.readFileSync('firestore.rules', 'utf8');
const ADMIN = rules.match(/function isAdmin\(\)\s*\{ return signedIn\(\) && request\.auth\.uid == '([^']+)'/)![1];

const apps = new Map<string, { app: FirebaseApp; db: Firestore }>();

/** Firestore client authenticated as `uid`; 'owner' bypasses rules, null is unauthenticated. */
function client(uid: string | null): Firestore {
  const key = uid ?? '(anon)';
  const existing = apps.get(key);
  if (existing) return existing.db;
  const app = initializeApp({ projectId: PROJECT, apiKey: 'demo' }, `rules-${key}`);
  const db = getFirestore(app);
  connectFirestoreEmulator(
    db,
    HOST,
    PORT,
    uid === null ? {} : { mockUserToken: uid === 'owner' ? 'owner' : { sub: uid, user_id: uid } },
  );
  apps.set(key, { app, db });
  return db;
}

async function clearFirestore(): Promise<void> {
  const res = await fetch(`http://${HOST}:${PORT}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`clear failed: ${res.status}`);
}

const user = (uid: string, active = true) => ({
  uid,
  username: uid,
  displayName: uid,
  role: uid === ADMIN ? 'admin' : 'player',
  active,
  isTest: false,
  runId: 1,
  createdAt: Timestamp.now(),
  lastSeenAt: null,
});

const event = (uid: string) => ({
  uid,
  runId: 1,
  type: 'day_start',
  day: 1,
  data: {},
  at: serverTimestamp(),
  clientAt: Date.now(),
  appVersion: 'test',
});

afterAll(async () => {
  await Promise.all([...apps.values()].map(({ app }) => deleteApp(app)));
});

beforeEach(async () => {
  await clearFirestore();
  const db = client('owner');
  await setDoc(doc(db, 'users', ADMIN), user(ADMIN));
  await setDoc(doc(db, 'users', 'alice'), user('alice'));
  await setDoc(doc(db, 'users', 'bob'), user('bob'));
  await setDoc(doc(db, 'users', 'carl'), user('carl', false));
  await setDoc(doc(db, 'usernames', 'alice'), { uid: 'alice' });
  for (const uid of ['alice', 'bob', 'carl', 'dave']) {
    await setDoc(doc(db, 'saves', uid), { uid, runId: 1 });
    await setDoc(doc(db, 'personal', uid), { patronus: 'ein Otter' });
  }
  await setDoc(doc(db, 'events', 'e1'), { ...event('alice'), at: Timestamp.now() });
});

const as = (uid: string) => client(uid);

describe('[SEC-1] saves', () => {
  it('a player reads and writes the own save', async () => {
    await assertSucceeds(getDoc(doc(as('alice'), 'saves', 'alice')));
    await assertSucceeds(setDoc(doc(as('alice'), 'saves', 'alice'), { uid: 'alice', runId: 1, sparks: 4 }));
  });

  it('denies another player’s save', async () => {
    await assertFails(getDoc(doc(as('alice'), 'saves', 'bob')));
    await assertFails(setDoc(doc(as('alice'), 'saves', 'bob'), { uid: 'bob' }));
  });

  it('denies a deactivated player', async () => {
    await assertFails(getDoc(doc(as('carl'), 'saves', 'carl')));
    await assertFails(setDoc(doc(as('carl'), 'saves', 'carl'), { uid: 'carl' }));
    await assertFails(addDoc(collection(as('carl'), 'events'), event('carl')));
  });

  it('denies an account without users document', async () => {
    await assertFails(getDoc(doc(as('dave'), 'saves', 'dave')));
    await assertFails(setDoc(doc(as('dave'), 'saves', 'dave'), { uid: 'dave' }));
    await assertFails(getDoc(doc(as('dave'), 'personal', 'dave')));
    await assertFails(addDoc(collection(as('dave'), 'events'), event('dave')));
  });

  it('denies unauthenticated access', async () => {
    const anon = client(null);
    await assertFails(getDoc(doc(anon, 'saves', 'alice')));
    await assertFails(getDoc(doc(anon, 'users', 'alice')));
  });
});

describe('[SEC-1] events', () => {
  it('a player creates own events with server time', async () => {
    await assertSucceeds(addDoc(collection(as('alice'), 'events'), event('alice')));
  });

  it('denies events for another uid or with client time', async () => {
    await assertFails(addDoc(collection(as('alice'), 'events'), event('bob')));
    const forged = Timestamp.fromMillis(Date.now() - 60_000);
    await assertFails(addDoc(collection(as('alice'), 'events'), { ...event('alice'), at: forged }));
  });

  it('denies players reading events', async () => {
    await assertFails(getDoc(doc(as('alice'), 'events', 'e1')));
    await assertFails(getDocs(collection(as('alice'), 'events')));
  });

  it('never allows updating or deleting events', async () => {
    await assertFails(updateDoc(doc(as('alice'), 'events', 'e1'), { day: 2 }));
    await assertFails(deleteDoc(doc(as('alice'), 'events', 'e1')));
    await assertFails(updateDoc(doc(as(ADMIN), 'events', 'e1'), { day: 2 }));
    await assertFails(deleteDoc(doc(as(ADMIN), 'events', 'e1')));
  });
});

describe('[SEC-1] users', () => {
  it('a player reads the own user document but not others', async () => {
    await assertSucceeds(getDoc(doc(as('alice'), 'users', 'alice')));
    await assertFails(getDoc(doc(as('alice'), 'users', 'bob')));
  });

  it('a deactivated player can still read the own user document [AUTH-9]', async () => {
    await assertSucceeds(getDoc(doc(as('carl'), 'users', 'carl')));
  });

  it('denies a player changing the own role or active flag', async () => {
    await assertFails(updateDoc(doc(as('alice'), 'users', 'alice'), { role: 'admin' }));
    await assertFails(updateDoc(doc(as('carl'), 'users', 'carl'), { active: true }));
    await assertFails(updateDoc(doc(as('alice'), 'users', 'alice'), { runId: 5 }));
  });

  it('allows a player to set only lastSeenAt to server time [DAY-2]', async () => {
    await assertSucceeds(updateDoc(doc(as('alice'), 'users', 'alice'), { lastSeenAt: serverTimestamp() }));
    // A forged client time. Not Timestamp.now(): on a fast runner it can land in the
    // same millisecond as request.time and pass the equality check by chance.
    const forged = Timestamp.fromMillis(Date.now() - 60_000);
    await assertFails(updateDoc(doc(as('alice'), 'users', 'alice'), { lastSeenAt: forged }));
  });

  it('denies players creating user or username documents', async () => {
    await assertFails(setDoc(doc(as('dave'), 'users', 'dave'), user('dave')));
    await assertFails(setDoc(doc(as('alice'), 'usernames', 'alice2'), { uid: 'alice' }));
    await assertFails(getDoc(doc(as('alice'), 'usernames', 'alice')));
  });
});

describe('[SEC-1] personal', () => {
  it('a player reads only the own personal content and never writes it', async () => {
    await assertSucceeds(getDoc(doc(as('alice'), 'personal', 'alice')));
    await assertFails(getDoc(doc(as('alice'), 'personal', 'bob')));
    await assertFails(setDoc(doc(as('alice'), 'personal', 'alice'), { letter: 'x' }));
  });
});

describe('[SEC-1] admin', () => {
  it('reads everything', async () => {
    const db = as(ADMIN);
    await assertSucceeds(getDocs(collection(db, 'users')));
    await assertSucceeds(getDocs(collection(db, 'saves')));
    await assertSucceeds(getDocs(collection(db, 'events')));
    await assertSucceeds(getDocs(collection(db, 'personal')));
    await assertSucceeds(getDoc(doc(db, 'usernames', 'alice')));
  });

  it('manages users, saves and personal content [AUTH-5] [ADM-7] [ADM-8]', async () => {
    const db = as(ADMIN);
    await assertSucceeds(setDoc(doc(db, 'users', 'erin'), user('erin')));
    await assertSucceeds(setDoc(doc(db, 'usernames', 'erin'), { uid: 'erin' }));
    await assertSucceeds(updateDoc(doc(db, 'users', 'alice'), { active: false, runId: 2 }));
    await assertSucceeds(deleteDoc(doc(db, 'saves', 'alice')));
    await assertSucceeds(setDoc(doc(db, 'personal', 'alice'), { letter: 'Hallo' }));
  });
});
