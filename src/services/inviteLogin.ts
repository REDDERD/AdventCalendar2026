import { auth } from './firebase';
import { login, LOGIN_ERROR_TEXT } from './AuthService';
import { isValidUsername, normalizeUsername, usernameToEmail } from './username';

let pending = false;

/** While true, the auth flow must not jump to the login screen. */
export function isInviteLoginPending(): boolean {
  return pending;
}

/**
 * Read `?u=<name>#z=<password>` from an invitation link and remove the
 * password from the address bar and history right away (DECISIONS.md #31).
 */
export function takeInviteCredentials(): { username: string; password: string } | null {
  const match = location.hash.match(/^#z=(.+)$/);
  if (!match) return null;
  history.replaceState(null, '', `${location.pathname}${location.search}`);
  const username = normalizeUsername(new URLSearchParams(location.search).get('u') ?? '');
  if (!isValidUsername(username)) return null;
  return { username, password: decodeURIComponent(match[1]) };
}

/**
 * Log in straight from the invitation QR code. `attempted` is false when the
 * URL carried no credentials; `error` is a text for the login screen.
 */
export async function runInviteLogin(): Promise<{ attempted: boolean; error: string | null }> {
  const creds = takeInviteCredentials();
  if (!creds) return { attempted: false, error: null };
  pending = true;
  try {
    await auth.authStateReady();
    if (auth.currentUser?.email === usernameToEmail(creds.username)) return { attempted: true, error: null };
    const error = await login(creds.username, creds.password);
    return { attempted: true, error: error ? LOGIN_ERROR_TEXT[error] : null };
  } finally {
    pending = false;
  }
}
