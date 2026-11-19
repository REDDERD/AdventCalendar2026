import { useEffect, useState } from 'react';
import { LAST_DAY } from '../../content/schedule';
import { adminHref } from '../routes';
import { Avatar, Chip, ENDING_NAME, houseColor, houseName } from '../components';
import type { AdminPlayer } from '../data';
import { formatDuration } from '../eventText';
import { highestDay, lastActive, overviewMetrics, playerStatus, relativeTime, statusLabel, type PlayerStatus } from '../stats';

const TONE: Record<PlayerStatus, 'good' | 'warn' | 'plain' | 'gold'> = {
  playing: 'good',
  up_to_date: 'plain',
  behind: 'warn',
  not_started: 'plain',
  finished: 'gold',
};

function useMinuteClock(): number {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/** Section 11.3 admin.overview. Test accounts are hidden by default [AUTH-13]. */
export function OverviewView({ players }: { players: AdminPlayer[] | null }) {
  const now = useMinuteClock();
  const [showTest, setShowTest] = useState(false);
  if (!players) return <p className="admin-muted">Lade …</p>;

  const visible = players.filter((p) => showTest || !p.user.isTest);
  const metrics = overviewMetrics(visible, now);

  return (
    <>
      <section className="metrics">
        <div className="metric">
          <div className="metric-value">{metrics.activePlayers}</div>
          <div className="metric-label">aktive Spieler</div>
        </div>
        <div className="metric">
          <div className="metric-value">{metrics.playedToday}</div>
          <div className="metric-label">heute gespielt</div>
        </div>
        <div className="metric">
          <div className="metric-value">{metrics.avgSecondsToday === null ? '–' : formatDuration(metrics.avgSecondsToday)}</div>
          <div className="metric-label">Ø Spielzeit heute</div>
        </div>
      </section>

      <label className="admin-toggle">
        <input type="checkbox" checked={showTest} onChange={(e) => setShowTest(e.target.checked)} /> Testkonten zeigen
      </label>

      {!visible.length && <p className="admin-muted">Noch keine Spieler. Lade jemanden unter „Mehr → Spieler verwalten“ ein.</p>}

      {visible.map((p) => {
        const status = playerStatus(p.save, now);
        const day = highestDay(p.save);
        const ending = p.save?.ending;
        return (
          <a key={p.user.uid} href={adminHref('player', p.user.uid)} className="player-card" style={{ borderLeftColor: houseColor(p) }}>
            <Avatar player={p} size={48} />
            <div className="player-body">
              <div className="player-head">
                <strong>{p.user.displayName}</strong>
                <Chip tone={TONE[status.status]}>{statusLabel(status)}</Chip>
              </div>
              <div className="admin-muted">
                {houseName(p)} · {relativeTime(lastActive(p), now)}
                {!p.user.active && ' · pausiert'}
                {p.user.isTest && ' · Test'}
              </div>
              <div className="progress" aria-label={`Tag ${day} von ${LAST_DAY}`}>
                <div className="progress-bar" style={{ width: `${(day / LAST_DAY) * 100}%` }} />
                <span>
                  Tag {day} / {LAST_DAY}
                </span>
              </div>
              <div className="player-foot">
                <span>★ {p.save?.housePoints ?? 0} Hauspunkte</span>
                {ending && <span>Ende: {ENDING_NAME[ending]}</span>}
              </div>
            </div>
          </a>
        );
      })}
    </>
  );
}
