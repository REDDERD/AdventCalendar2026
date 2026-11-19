import { useEffect, useMemo, useState } from 'react';
import { listPuzzleIds, loadPuzzle } from '../../services/ContentService';
import { FLAG_DURATION_SEC, FLAG_HELP_RATE, puzzleStats } from '../analysis';
import type { AdminPlayer } from '../data';
import { formatDuration, puzzleNumber } from '../eventText';
import { withoutTests } from '../useEvents';

const percent = (v: number | null) => (v === null ? '–' : `${Math.round(v * 100)} %`);

/** Puzzle titles from the bundle (only the puzzles that exist so far). */
function usePuzzleTitles(): Record<string, string> {
  const [titles, setTitles] = useState<Record<string, string>>({});
  useEffect(() => {
    let alive = true;
    Promise.all(listPuzzleIds().map(loadPuzzle))
      .then((list) => alive && setTitles(Object.fromEntries(list.map((p) => [p.id, p.title]))))
      .catch((e) => console.error(e));
    return () => {
      alive = false;
    };
  }, []);
  return titles;
}

/** Section 11.3 admin.puzzles, from the saves of the current runs. */
export function PuzzlesView({ players }: { players: AdminPlayer[] | null }) {
  const [showTest, setShowTest] = useState(false);
  const titles = usePuzzleTitles();
  const visible = useMemo(() => withoutTests(players ?? [], showTest), [players, showTest]);
  const stats = useMemo(() => puzzleStats(listPuzzleIds(), visible), [visible]);

  if (!players) return <p className="admin-muted">Lade …</p>;

  return (
    <>
      <label className="admin-toggle">
        <input type="checkbox" checked={showTest} onChange={(e) => setShowTest(e.target.checked)} /> Testkonten zeigen
      </label>
      <section className="admin-card">
        <table className="admin-table puzzle-table">
          <thead>
            <tr>
              <th>Rätsel</th>
              <th>gelöst</th>
              <th>Ø Vers.</th>
              <th>Ø Zeit</th>
              <th>Hinw.</th>
              <th>Hilfe</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.id} className={s.flagged ? 'flagged' : ''}>
                <td>
                  <strong>{puzzleNumber(s.id)}</strong> <span className="puzzle-title">{titles[s.id] ?? ''}</span>
                </td>
                <td>
                  {s.solved}
                  {s.started > s.solved && <span className="admin-muted"> / {s.started}</span>}
                </td>
                <td>{s.avgAttempts === null ? '–' : s.avgAttempts.toFixed(1).replace('.', ',')}</td>
                <td className={(s.avgDurationSec ?? 0) > FLAG_DURATION_SEC ? 'bad' : ''}>
                  {s.avgDurationSec === null ? '–' : formatDuration(s.avgDurationSec).replace(' min', '')}
                </td>
                <td>{percent(s.hintRate)}</td>
                <td className={(s.helpRate ?? 0) > FLAG_HELP_RATE ? 'bad' : ''}>{percent(s.helpRate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="admin-muted">
          „gelöst“ = Spieler mit gelöstem Rätsel (/ angefangen). Rot: Ø Zeit über 8 min oder Hilfe von Prof. Quill über 30 %. Hinweis-Quote zählt
          auch geschenkte Haustier-Hinweise.
        </p>
      </section>
    </>
  );
}
