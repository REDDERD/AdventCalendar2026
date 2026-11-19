import { useEffect, useState } from 'react';
import type { EventType } from '../types';
import { loadEvents, type AdminPlayer, type FeedEvent } from './data';

/**
 * [ADM-12] Events load on open and again whenever the players are refreshed
 * (pull-to-refresh produces a new players array).
 */
export function useEvents(players: AdminPlayer[] | null, filter: { uid?: string; type?: EventType }, enabled = true) {
  const [events, setEvents] = useState<FeedEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { uid, type } = filter;

  useEffect(() => {
    if (!players || !enabled) return;
    let alive = true;
    loadEvents({ uid, type })
      .then((list) => alive && setEvents(list))
      .catch((e) => {
        console.error(e);
        if (alive) setError('Ereignisse konnten nicht geladen werden.');
      });
    return () => {
      alive = false;
    };
  }, [players, uid, type, enabled]);

  return { events, error };
}

/** [AUTH-13] Test accounts are left out of the statistics unless asked for. */
export function withoutTests(players: AdminPlayer[], showTest: boolean): AdminPlayer[] {
  return players.filter((p) => showTest || !p.user.isTest);
}
