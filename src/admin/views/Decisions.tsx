import { useMemo, useState } from 'react';
import catalog from '../../content/generated/choices.generated.json';
import { SPEAKER_NAMES } from '../../dialogue/speakers';
import { currentRunEvents, decisionStats, playerSummary, type DayCatalogEntry } from '../analysis';
import { Avatar, ENDING_NAME, HOUSE_NAME, houseColor, ROUTE_NAME } from '../components';
import type { AdminPlayer } from '../data';
import { adminHref } from '../routes';
import { useEvents, withoutTests } from '../useEvents';

const CATALOG = catalog as DayCatalogEntry[];

/** Section 11.3 admin.decisions: summary per player, then every choice point per day. */
export function DecisionsView({ players }: { players: AdminPlayer[] | null }) {
  const { events, error } = useEvents(players, { type: 'choice' });
  const [showTest, setShowTest] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  const visible = useMemo(() => withoutTests(players ?? [], showTest), [players, showTest]);
  const days = useMemo(() => decisionStats(CATALOG, currentRunEvents(visible, events ?? [])), [visible, events]);
  const byUid = new Map(visible.map((p) => [p.user.uid, p]));

  if (!players) return <p className="admin-muted">Lade …</p>;

  return (
    <>
      <label className="admin-toggle">
        <input type="checkbox" checked={showTest} onChange={(e) => setShowTest(e.target.checked)} /> Testkonten zeigen
      </label>

      <section className="admin-card">
        <h2>Wege der Spieler</h2>
        {!visible.length && <p className="admin-muted">Noch keine Spieler.</p>}
        <table className="admin-table summary-table">
          <thead>
            <tr>
              <th />
              <th>Haus</th>
              <th>Route</th>
              <th>Anklage</th>
              <th>Ende</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => {
              const s = playerSummary(p.save);
              return (
                <tr key={p.user.uid}>
                  <td>
                    <a href={adminHref('player', p.user.uid)} className="summary-name">
                      <Avatar player={p} size={24} /> {p.user.displayName}
                    </a>
                  </td>
                  <td>
                    {s.house ? (
                      <span title="Hut-Vorschlag → gewählt">
                        {s.overruled && s.hatSuggestion ? `${HOUSE_NAME[s.hatSuggestion]} → ` : ''}
                        <strong style={{ color: houseColor(p) }}>{HOUSE_NAME[s.house]}</strong>
                      </span>
                    ) : (
                      '–'
                    )}
                  </td>
                  <td>{ROUTE_NAME[s.route] ?? '–'}</td>
                  <td>{s.accused ? (SPEAKER_NAMES[s.accused] ?? s.accused) : '–'}</td>
                  <td>{s.ending ? (ENDING_NAME[s.ending] ?? s.ending) : '–'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {error && <div className="admin-error">{error}</div>}
      {!events && !error && <p className="admin-muted">Lade Entscheidungen …</p>}

      {events &&
        [...days].map(([day, rows]) => {
          const made = rows.reduce((n, r) => n + r.total, 0);
          return (
            <section key={day} className="admin-card decision-day">
              <button type="button" className="decision-day-head" aria-expanded={open === day} onClick={() => setOpen(open === day ? null : day)}>
                <strong>Tag {day}</strong>
                <span className="admin-muted">
                  {rows.length} {rows.length === 1 ? 'Entscheidung' : 'Entscheidungen'} · {made} gewählt
                </span>
                <span aria-hidden="true">{open === day ? '▾' : '▸'}</span>
              </button>
              {open === day &&
                rows.map((row) => (
                  <div key={row.id} className="decision">
                    <p className="decision-question">{row.question}</p>
                    {row.options.map((o) => {
                      const share = row.total ? o.uids.length / row.total : 0;
                      return (
                        <div key={o.option} className="decision-option">
                          <div className="decision-text">
                            <span>„{o.text}“</span>
                            <span className="admin-muted">{o.uids.length}</span>
                          </div>
                          <div className="decision-bar" aria-label={`${Math.round(share * 100)} %`}>
                            <div style={{ width: `${share * 100}%` }} />
                          </div>
                          <div className="decision-who">
                            {o.uids.map((uid) => {
                              const p = byUid.get(uid);
                              return p ? (
                                <a key={uid} href={adminHref('player', uid)} title={p.user.displayName}>
                                  <Avatar player={p} size={24} />
                                </a>
                              ) : null;
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
            </section>
          );
        })}
    </>
  );
}
