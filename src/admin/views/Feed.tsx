import { useEffect, useMemo, useState } from 'react';
import catalog from '../../content/generated/choices.generated.json';
import { Avatar } from '../components';
import { subscribeFeed, type AdminPlayer, type FeedEvent } from '../data';
import { EVENT_GROUPS, eventSentence, type CatalogEntry } from '../eventText';
import { sameBerlinDay } from '../stats';

const TIME = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' });
const DATE = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit' });

/** Section 11.3 admin.feed: the latest 100 events of all players, live [ADM-12]. */
export function FeedView({ players }: { players: AdminPlayer[] | null }) {
  const [events, setEvents] = useState<FeedEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [player, setPlayer] = useState('all');
  const [group, setGroup] = useState('all');
  const [allRuns, setAllRuns] = useState(false);

  useEffect(
    () =>
      subscribeFeed(
        (list) => setEvents(list),
        (e) => {
          console.error(e);
          setError('Die Eulenpost ist gerade nicht erreichbar.');
        },
      ),
    [],
  );

  const byUid = useMemo(() => new Map((players ?? []).map((p) => [p.user.uid, p])), [players]);

  const visible = (events ?? []).filter((e) => {
    const p = byUid.get(e.uid);
    if (player !== 'all' && e.uid !== player) return false;
    if (group !== 'all' && !EVENT_GROUPS[group].types.includes(e.type)) return false;
    // [ADM-8] by default only the current run of each player
    if (!allRuns && p && e.runId !== p.user.runId) return false;
    return true;
  });
  const now = Date.now();

  return (
    <>
      <div className="feed-filters">
        <select value={player} onChange={(e) => setPlayer(e.target.value)} aria-label="Spieler">
          <option value="all">Alle Spieler</option>
          {(players ?? []).map((p) => (
            <option key={p.user.uid} value={p.user.uid}>
              {p.user.displayName}
            </option>
          ))}
        </select>
        <select value={group} onChange={(e) => setGroup(e.target.value)} aria-label="Ereignistyp">
          {Object.entries(EVENT_GROUPS).map(([id, g]) => (
            <option key={id} value={id}>
              {g.label}
            </option>
          ))}
        </select>
      </div>
      <label className="admin-toggle">
        <input type="checkbox" checked={allRuns} onChange={(e) => setAllRuns(e.target.checked)} /> alle Durchläufe
      </label>

      {error && <div className="admin-error">{error}</div>}
      {!events && !error && <p className="admin-muted">Lade …</p>}
      {events && !visible.length && <p className="admin-muted">Noch keine Eulen eingetroffen.</p>}

      <ol className="feed">
        {visible.map((e) => {
          const p = byUid.get(e.uid);
          const name = p?.user.displayName ?? 'Unbekannt';
          return (
            <li key={e.id} className="feed-item">
              {p ? <Avatar player={p} size={32} /> : <span className="avatar" />}
              <div>
                <div className="feed-text">{eventSentence(e, name, catalog as CatalogEntry[])}</div>
                <div className="admin-muted feed-time">
                  {sameBerlinDay(e.at, now) ? '' : `${DATE.format(e.at)} · `}
                  {TIME.format(e.at)}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
