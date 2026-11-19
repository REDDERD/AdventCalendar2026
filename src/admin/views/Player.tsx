import { useMemo, useState } from 'react';
import catalog from '../../content/generated/choices.generated.json';
import { HOUSE_COLORS } from '../../assets/palette';
import { CharacterSprite } from '../../character/CharacterSprite';
import { CLUES, ITEMS } from '../../content/catalog';
import { SPEAKER_NAMES } from '../../dialogue/speakers';
import type { HouseId, SaveDoc } from '../../types';
import { currentRunEvents, playerTimeline, type DayTimeline } from '../analysis';
import { Chip, ENDING_NAME, HOUSE_NAME, houseColor, ROUTE_NAME } from '../components';
import type { AdminPlayer } from '../data';
import { formatDuration, PET, PRONOUN, puzzleNumber, WAND, type CatalogEntry } from '../eventText';
import { adminHref } from '../routes';
import { lastActive, relativeTime } from '../stats';
import { useEvents } from '../useEvents';

const DATE_TIME = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
const CLUE_IDS = Object.keys(CLUES);

/** Relationship values (Section 8.1) with their ranges. */
const RELATIONS: Array<{ key: string; who: string; min: number; max: number }> = [
  { key: 'bond_ellis', who: 'ellis', min: 0, max: 5 },
  { key: 'trust_theo', who: 'theo', min: -2, max: 3 },
  { key: 'trust_maren', who: 'maren', min: -2, max: 3 },
  { key: 'trust_grimsby', who: 'grimsby', min: -2, max: 3 },
  { key: 'trust_aldous', who: 'aldous', min: -2, max: 3 },
];

/** Section 11.3 admin.player. */
export function PlayerView({ players, uid }: { players: AdminPlayer[] | null; uid: string | null }) {
  const { events, error } = useEvents(players, { uid: uid ?? undefined }, !!uid);
  const player = players?.find((p) => p.user.uid === uid);
  const timeline = useMemo(
    () => (player ? playerTimeline(player.save, currentRunEvents([player], events ?? []).get(player.user.uid) ?? [], catalog as CatalogEntry[]) : []),
    [player, events],
  );

  if (!players) return <p className="admin-muted">Lade …</p>;
  if (!player) return <p className="admin-muted">Spieler nicht gefunden.</p>;
  const save = player.save;

  return (
    <>
      <a className="admin-btn back-link" href={adminHref('overview')}>
        ← Übersicht
      </a>
      <Profile player={player} />
      {save?.profile && (
        <>
          <Relations save={save} />
          <Finds save={save} />
        </>
      )}
      <section className="admin-card">
        <h2>Zeitstrahl</h2>
        {error && <div className="admin-error">{error}</div>}
        {!events && !error && <p className="admin-muted">Lade …</p>}
        {events && !timeline.length && <p className="admin-muted">Noch nichts gespielt.</p>}
        {timeline.map((t) => (
          <Day key={t.day} t={t} />
        ))}
      </section>
      <div className="admin-row admin-row-wrap">
        <a className="admin-btn" href={adminHref('users')}>
          Verwalten (pausieren, zurücksetzen …)
        </a>
        <a className="admin-btn" href={adminHref('personal')}>
          Persönliches
        </a>
      </div>
    </>
  );
}

function Profile({ player }: { player: AdminPlayer }) {
  const save = player.save;
  const p = save?.profile;
  return (
    <section className="admin-card player-profile" style={{ borderLeft: `6px solid ${houseColor(player)}` }}>
      <div className="profile-figure">{p && <CharacterSprite look={p.look} house={p.house} scale={2} />}</div>
      <div className="profile-facts">
        <h2>{player.user.displayName}</h2>
        <div className="admin-muted">
          {player.user.username} · zuletzt {relativeTime(lastActive(player), Date.now())}
          {!player.user.active && ' · pausiert'}
          {player.user.note ? ` · ${player.user.note}` : ''}
        </div>
        {!p && <p>Hat den Prolog noch nicht beendet.</p>}
        {p && (
          <dl className="facts">
            <dt>Name im Spiel</dt>
            <dd>{p.name}</dd>
            <dt>Anrede</dt>
            <dd>{PRONOUN[p.pronoun] ?? p.pronoun}</dd>
            <dt>Haus</dt>
            <dd>
              <strong style={{ color: HOUSE_COLORS[p.house][0] }}>{HOUSE_NAME[p.house]}</strong>
              {p.hatOverruled ? ` (Hut wollte ${HOUSE_NAME[p.hatSuggestion]})` : ' (wie der Hut)'}
            </dd>
            <dt>Hut-Antworten</dt>
            <dd className="hat-answers">
              {p.sortingAnswers.map((h: HouseId, i) => (
                <span key={i} className="hat-answer" style={{ background: HOUSE_COLORS[h][0], color: HOUSE_COLORS[h][1] }} title={`Frage ${i + 1}: ${HOUSE_NAME[h]}`}>
                  {HOUSE_NAME[h].slice(0, 1)}
                </span>
              ))}
            </dd>
            <dt>Zauberstab</dt>
            <dd>{WAND[p.wand] ?? p.wand}</dd>
            <dt>Haustier</dt>
            <dd>{(PET[p.pet] ?? p.pet).replace(/^eine? /, '')}</dd>
            <dt>Punkte</dt>
            <dd>
              ★ {save!.housePoints} Hauspunkte · {save!.sparks} Funken
            </dd>
            {(save!.vars.route || save!.ending) && (
              <>
                <dt>Weg</dt>
                <dd>
                  {ROUTE_NAME[String(save!.vars.route)] ?? '–'}
                  {save!.ending && ` · Ende: ${ENDING_NAME[save!.ending]}`}
                </dd>
              </>
            )}
          </dl>
        )}
      </div>
    </section>
  );
}

function Relations({ save }: { save: SaveDoc }) {
  return (
    <section className="admin-card">
      <h2>Beziehungen</h2>
      {RELATIONS.map((r) => {
        const value = Number(save.vars[r.key] ?? 0);
        const span = r.max - r.min;
        const zero = ((0 - r.min) / span) * 100;
        const at = ((Math.max(r.min, Math.min(r.max, value)) - r.min) / span) * 100;
        return (
          <div key={r.key} className="relation">
            <span>{SPEAKER_NAMES[r.who] ?? r.who}</span>
            <div className="relation-bar" aria-label={`${r.key} ${value}`}>
              <div
                className={value < 0 ? 'neg' : ''}
                style={{ left: `${Math.min(zero, at)}%`, width: `${Math.abs(at - zero)}%` }}
              />
              {r.min < 0 && <span className="relation-zero" style={{ left: `${zero}%` }} />}
            </div>
            <span className="relation-value">{value > 0 && r.min < 0 ? `+${value}` : value}</span>
          </div>
        );
      })}
    </section>
  );
}

function Finds({ save }: { save: SaveDoc }) {
  const clues = Array.isArray(save.vars.clues) ? save.vars.clues : [];
  const items = Array.isArray(save.vars.items) ? save.vars.items : [];
  return (
    <section className="admin-card">
      <h2>Hinweise und Inventar</h2>
      <div className="clue-badges">
        {CLUE_IDS.map((id, i) => (
          <span key={id} className={`clue-badge ${clues.includes(id) ? 'found' : ''}`} title={CLUES[id]}>
            {i + 1}
          </span>
        ))}
      </div>
      <ul className="find-list">
        {CLUE_IDS.filter((id) => clues.includes(id)).map((id) => (
          <li key={id}>🔍 {CLUES[id]}</li>
        ))}
        {items.map((id) => (
          <li key={id}>🎒 {ITEMS[id] ?? id}</li>
        ))}
        {!clues.length && !items.length && <li className="admin-muted">Noch nichts gefunden.</li>}
      </ul>
    </section>
  );
}

function Day({ t }: { t: DayTimeline }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="timeline-day">
      <button type="button" className="decision-day-head" aria-expanded={open} onClick={() => setOpen(!open)}>
        <strong>{t.day === 0 ? 'Prolog' : `Tag ${t.day}`}</strong>
        <span className="admin-muted">
          {t.completedAt ? `fertig · ${t.durationSec !== null ? formatDuration(t.durationSec) : '–'}` : 'begonnen'}
        </span>
        <span aria-hidden="true">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="timeline-body">
          <p className="admin-muted">
            {t.startedAt ? `Start ${DATE_TIME.format(t.startedAt)}` : ''}
            {t.completedAt ? ` · Ende ${DATE_TIME.format(t.completedAt)}` : ''}
          </p>
          {t.choices.map((c, i) => (
            <p key={i} className="timeline-choice">
              <span className="admin-muted">{c.question}</span>
              <br />„{c.text}“
            </p>
          ))}
          {t.puzzles.map((p) => (
            <div key={p.id} className="timeline-puzzle">
              <div>
                <strong>Rätsel {puzzleNumber(p.id)}</strong>{' '}
                {p.result?.solved ? (
                  <Chip tone={p.result.solvedBy === 'help' ? 'warn' : 'good'}>
                    {p.result.solvedBy === 'help' ? 'mit Quill' : `+${p.result.points} P.`}
                  </Chip>
                ) : (
                  <Chip>offen</Chip>
                )}
                {p.result?.durationSec !== undefined && <span className="admin-muted"> {formatDuration(p.result.durationSec)}</span>}
              </div>
              {p.hints.length > 0 && <div className="admin-muted">Hinweise: {p.hints.join(', ')}</div>}
              <ol className="attempts">
                {p.attempts.map((a, i) => (
                  <li key={i} className={a.correct ? 'ok' : 'wrong'}>
                    {a.correct ? '✓' : '✗'} {a.input}
                  </li>
                ))}
              </ol>
            </div>
          ))}
          {t.finds.length > 0 && (
            <p className="admin-muted">
              Funde:{' '}
              {t.finds
                .map((f) => (f.type === 'clue_found' ? CLUES[f.id] : f.type === 'item_found' ? ITEMS[f.id] : 'Zauberfunke') ?? f.id)
                .join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
