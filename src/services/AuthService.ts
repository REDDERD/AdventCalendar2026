import { FirebaseError } from 'firebase/app';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { ADMIN_NAME, ADMIN_UID, ADMIN_USERNAME } from '../config';
import type { UserDoc } from '../types';
import { userDocSchema } from '../types/schemas';
import { auth, db, toMillis } from './firebase';
import { isValidUsername, normalizeUsername, usernameToEmail } from './username';

export type LoginError = 'invalid_username' | 'unknown_owl' | 'wrong_password' | 'invalid_credentials' | 'too_many' | 'network' | 'unknown';

/** [AUTH-8] Friendly messages. */
export const LOGIN_ERROR_TEXT: Record<LoginError, string> = {
  invalid_username: 'Eulennamen bestehen aus 3–16 Zeichen: a–z, 0–9 und -.',
  unknown_owl: 'Diese Eule kenne ich nicht.',
  wrong_password: 'Das Zauberwort stimmt nicht.',
  invalid_credentials: 'Eulenname oder Zauberwort stimmen nicht.',
  too_many: 'Zu viele Versuche. Warte kurz und versuch es dann noch einmal.',
  network: 'Keine Verbindung zum Schloss. Bist du online?',
  unknown: 'Da ist etwas schiefgegangen. Versuch es noch einmal.',
};

export async function login(usernameInput: string, password: string): Promise<LoginError | null> {
  const username = normalizeUsername(usernameInput);
  if (!isValidUsername(username)) return 'invalid_username';
  try {
    await signInWithEmailAndPassword(auth, usernameToEmail(username), password);
    return null;
  } catch (e) {
    const code = e instanceof FirebaseError ? e.code : '';
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/invalid-email':
        return 'unknown_owl';
      case 'auth/wrong-password':
        return 'wrong_password';
      // With email enumeration protection on, Firebase does not tell the two apart.
      case 'auth/invalid-credential':
      case 'auth/invalid-login-credentials':
        return 'invalid_credentials';
      case 'auth/too-many-requests':
        return 'too_many';
      case 'auth/network-request-failed':
        return 'network';
      default:
        console.error(e);
        return 'unknown';
    }
  }
}

export function logout(): Promise<void> {
  return signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export function parseUserDoc(data: Record<string, unknown>): UserDoc {
  return userDocSchema.parse({
    ...data,
    createdAt: toMillis(data.createdAt) ?? 0,
    lastSeenAt: toMillis(data.lastSeenAt),
  });
}

/**
 * Load `users/{uid}`. [AUTH-12] On the admin's first login the document is
 * created, together with `usernames/{ADMIN_USERNAME}`.
 */
export async function loadUserDoc(uid: string): Promise<UserDoc | null> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return parseUserDoc(snap.data());
  if (uid !== ADMIN_UID) return null;

  const batch = writeBatch(db);
  batch.set(ref, {
    uid,
    username: ADMIN_USERNAME,
    displayName: ADMIN_NAME,
    role: 'admin',
    active: true,
    isTest: true, // [AUTH-13]
    runId: 1,
    createdAt: serverTimestamp(),
    lastSeenAt: null,
  });
  batch.set(doc(db, 'usernames', ADMIN_USERNAME), { uid });
  await batch.commit();
  const created = await getDoc(ref);
  return created.exists() ? parseUserDoc(created.data()) : null;
}
