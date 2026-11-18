import { LAST_DAY } from '../content/schedule';
import { waitingChapters } from '../core/time';
import type { SaveDoc } from '../types';
import type { AdminPlayer } from './data';

export type PlayerStatus = 'playing' | 'up_to_date' | 'behind' | 'not_started' | 'finished';

/** "spielt gerade" = the save changed within this time. */
export const PLAYING_WINDOW_MS = 5 * 60 * 1000;

export function highestDay(save: SaveDoc | null): number {
  return save ? Math.max(0, ...save.progress.completedDays) : 0;
}

/** Section 11.3 admin.overview status chip. */
export function playerStatus(save: SaveDoc | null, now: number): { status: PlayerStatus; behind: number } {
  const completed = save?.progress.completedDays ?? [];
  if (completed.includes(LAST_DAY)) return { status: 'finished', behind: 0 };
  if (!save || (!completed.length && !save.progress.current)) return { status: 'not_started', behind: 0 };
  if (save.progress.current && now - save.updatedAt < PLAYING_WINDOW_MS) return { status: 'playing', behind: 0 };
  const behind = waitingChapters(now, completed);
  return behind ? { status: 'behind', behind } : { status: 'up_to_date', behind: 0 };
}

export function statusLabel({ status, behind }: { status: PlayerStatus; behind: number }): string {
  switch (status) {
    case 'playing':
      return 'spielt gerade';
    case 'up_to_date':
      return 'auf dem Laufenden';
    case 'behind':
      return behind === 1 ? '1 Tag zurück' : `${behind} Tage zurück`;
    case 'not_started':
      return 'noch nicht gestartet';
    case 'finished':
      return 'fertig';
  }
}

const BERLIN_DAY = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', dateStyle: 'short' });

export function sameBerlinDay(a: number, b: number): boolean {
  return BERLIN_DAY.format(a) === BERLIN_DAY.format(b);
}

export interface OverviewMetrics {
  activePlayers: number;
  playedToday: number;
  /** Average time of days completed today, in seconds (null if none). */
  avgSecondsToday: number | null;
}

export function overviewMetrics(players: readonly AdminPlayer[], now: number): OverviewMetrics {
  const active = players.filter((p) => p.user.active);
  let playedToday = 0;
  const durations: number[] = [];
  for (const { save } of active) {
    if (!save) continue;
    const started = Object.values(save.progress.dayStartedAt);
    const completed = save.progress.dayCompletedAt;
    if (started.some((t) => sameBerlinDay(t, now)) || Object.values(completed).some((t) => sameBerlinDay(t, now))) playedToday++;
    for (const [day, end] of Object.entries(completed)) {
      const start = save.progress.dayStartedAt[day];
      if (start && sameBerlinDay(end, now)) durations.push((end - start) / 1000);
    }
  }
  return {
    activePlayers: active.length,
    playedToday,
    avgSecondsToday: durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : null,
  };
}

/** "vor 2 Std." */
export function relativeTime(ms: number | null, now: number): string {
  if (!ms) return 'nie';
  const min = Math.round((now - ms) / 60000);
  if (min < 1) return 'gerade eben';
  if (min < 60) return `vor ${min} Min.`;
  const h = Math.round(min / 60);
  if (h < 24) return `vor ${h} Std.`;
  const d = Math.round(h / 24);
  return d === 1 ? 'gestern' : `vor ${d} Tagen`;
}

/** Last activity: the newer of lastSeenAt (app start) and the last save. */
export function lastActive(player: AdminPlayer): number | null {
  return Math.max(player.user.lastSeenAt ?? 0, player.save?.updatedAt ?? 0) || null;
}
