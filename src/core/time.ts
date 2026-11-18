import { LAST_DAY, schedule } from '../content/schedule';

export type DoorState = 'locked' | 'available' | 'done';

export function unlockAtMs(day: number): number {
  const entry = schedule.find((e) => e.day === day);
  if (!entry) throw new Error(`Unknown day ${day}`);
  return Date.parse(entry.unlockAt);
}

export function isUnlocked(day: number, now: number): boolean {
  return now >= unlockAtMs(day);
}

/** [DAY-1] Day N is playable when it is unlocked and day N−1 is done (0 = prologue). */
export function isPlayable(day: number, now: number, completedDays: readonly number[]): boolean {
  if (completedDays.includes(day)) return false;
  if (!isUnlocked(day, now)) return false;
  return day === 0 || completedDays.includes(day - 1);
}

export function doorState(day: number, now: number, completedDays: readonly number[]): DoorState {
  if (completedDays.includes(day)) return 'done';
  return isPlayable(day, now, completedDays) ? 'available' : 'locked';
}

/** The next day the player should play, or null if nothing is playable right now. */
export function nextPlayableDay(now: number, completedDays: readonly number[]): number | null {
  for (let day = 0; day <= LAST_DAY; day++) {
    if (isPlayable(day, now, completedDays)) return day;
  }
  return null;
}

/** [DAY-3] Number of unlocked days not yet completed ("3 Kapitel warten auf dich"). */
export function waitingChapters(now: number, completedDays: readonly number[]): number {
  let count = 0;
  for (let day = 1; day <= LAST_DAY; day++) {
    if (isUnlocked(day, now) && !completedDays.includes(day)) count++;
  }
  return count;
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return '0:00:00';
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const hms = `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return days > 0 ? `${days} T ${hms}` : hms;
}
