import { EMAIL_DOMAIN } from '../config';

const USERNAME_RE = /^[a-z0-9-]{3,16}$/;

/** [AUTH-2] Lowercase and trim user input. */
export function normalizeUsername(input: string): string {
  return input.trim().toLowerCase();
}

export function isValidUsername(username: string): boolean {
  return USERNAME_RE.test(username);
}

/** [AUTH-1] Map an owl name to its synthetic Firebase Auth address. */
export function usernameToEmail(input: string): string {
  const username = normalizeUsername(input);
  if (!isValidUsername(username)) throw new Error(`Invalid username: ${input}`);
  return `${username}@${EMAIL_DOMAIN}`;
}

export function emailToUsername(email: string): string | null {
  const suffix = `@${EMAIL_DOMAIN}`;
  return email.endsWith(suffix) ? email.slice(0, -suffix.length) : null;
}
