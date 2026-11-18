/** [PZL-5] Mentor offers help after this many wrong attempts … */
export const HELP_AFTER_ATTEMPTS = 3;
/** … or after this many milliseconds. */
export const HELP_AFTER_MS = 4 * 60 * 1000;
/** Declined help is offered again after this many milliseconds. */
export const HELP_REOFFER_MS = 2 * 60 * 1000;

/**
 * [PZL-5] When the mentor offers help: right away after 3 wrong attempts,
 * otherwise 4 minutes after the start; after a "no", 2 minutes later.
 */
export function helpDueAt(r: { attempts: number; startedAt?: number; helpDeclinedAt?: number }): number {
  if (r.helpDeclinedAt) return r.helpDeclinedAt + HELP_REOFFER_MS;
  if (r.attempts >= HELP_AFTER_ATTEMPTS) return 0;
  return (r.startedAt ?? 0) + HELP_AFTER_MS;
}

/** [PZL-3] Sparks every player starts with. */
export const START_SPARKS = 3;
/** [PZL-4] Price of hint 1–3 and of the super hint. */
export const HINT_COST = 1;
export const SUPER_HINT_COST = 2;
/** Hint levels as stored in `hintsBought`: 1–3 and 4 = super hint. */
export const SUPER_HINT = 4;

export function hintCost(level: number): number {
  return level === SUPER_HINT ? SUPER_HINT_COST : HINT_COST;
}

/** Hints open in order: 1, 2, 3, then the super hint. Returns null when all are open. */
export function nextHint(bought: readonly number[]): number | null {
  for (let level = 1; level <= SUPER_HINT; level++) if (!bought.includes(level)) return level;
  return null;
}

/**
 * Section 10.3: share of the base points.
 * `attempt` is the 1-based number of the attempt that solved the puzzle.
 */
export function pointsFor(basePoints: number, attempt: number, solvedBy: 'self' | 'help'): number {
  let share: number;
  if (solvedBy === 'help') share = 0.25;
  else if (attempt <= 1) share = 1;
  else if (attempt === 2) share = 0.8;
  else share = 0.6;
  return Math.round(basePoints * share);
}

/** [PZL-7] The other houses finish just below the player's score. */
export const RIVAL_SHARES = [0.88, 0.82, 0.75] as const;

export function rivalScores(playerPoints: number): number[] {
  return RIVAL_SHARES.map((share) => Math.floor(playerPoints * share));
}
