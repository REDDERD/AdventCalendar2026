import { deleteApp, FirebaseError, initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  inMemoryPersistence,
  initializeAuth,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { USE_EMULATOR } from '../config';
import { appOptions, db } from './firebase';
import { generatePassword } from './password';
import { isValidUsername, normalizeUsername, usernameToEmail } from './username';

export interface NewPlayer {
  displayName: string;
  username: string;
  note?: string;
}

export interface ProvisionedPlayer {
  uid: string;
  username: string;
  displayName: string;
  /** Shown once on the invitation, never stored [ADM-6]. */
  password: string;
}

export class ProvisionError extends Error {}

export async function isUsernameTaken(username: string): Promise<boolean> {
  return (await getDoc(doc(db, 'usernames', username))).exists();
}

/**
 * [AUTH-5] Create a player account without a server: a second Firebase app
 * instance creates the Auth user and signs out right away, so the admin stays
 * signed in on the main instance. Then `users/{uid}` and `usernames/{username}`
 * are written in one transaction.
 */
export async function provisionPlayer(input: NewPlayer): Promise<ProvisionedPlayer> {
  const username = normalizeUsername(input.username);
  const displayName = input.displayName.trim();
  if (!displayName) throw new ProvisionError('Bitte einen Anzeigenamen angeben.');
  if (!isValidUsername(username)) throw new ProvisionError('Eulennamen: 3–16 Zeichen, a–z, 0–9 und -.');
  if (await isUsernameTaken(username)) throw new ProvisionError(`Der Eulenname „${username}“ ist schon vergeben.`);

  const password = generatePassword();
  const provisioning = initializeApp(appOptions, `provisioning-${Date.now()}`);
  let uid: string;
  try {
    const auth = initializeAuth(provisioning, { persistence: inMemoryPersistence });
    if (USE_EMULATOR) connectAuthEmulator(auth, `http://${location.hostname}:9099`, { disableWarnings: true });
    const credential = await createUserWithEmailAndPassword(auth, usernameToEmail(username), password);
    uid = credential.user.uid;
    await signOut(auth);
  } catch (e) {
    if (e instanceof FirebaseError && e.code === 'auth/email-already-in-use') {
      throw new ProvisionError(`Für „${username}“ gibt es schon ein Konto in Firebase Auth.`);
    }
    throw e;
  } finally {
    await deleteApp(provisioning);
  }

  await runTransaction(db, async (tx) => {
    const nameRef = doc(db, 'usernames', username);
    if ((await tx.get(nameRef)).exists()) throw new ProvisionError(`Der Eulenname „${username}“ ist schon vergeben.`);
    tx.set(doc(db, 'users', uid), {
      uid,
      username,
      displayName,
      role: 'player',
      active: true,
      isTest: false,
      runId: 1,
      createdAt: serverTimestamp(),
      lastSeenAt: null,
      ...(input.note?.trim() ? { note: input.note.trim() } : {}),
    });
    tx.set(nameRef, { uid });
  });

  return { uid, username, displayName, password };
}
