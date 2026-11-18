import { useEffect, useState } from 'react';
import { useStore } from '../../core/store';
import { resolveVariant } from '../../puzzles/usePuzzle';
import type { Puzzle } from '../../puzzles/schema';
import { listPuzzleIds, loadPuzzle } from '../../services/ContentService';

/** Section 9: 27 puzzles over 24 days (days 13–15 have one per route). */
const TOTAL_PUZZLES = 27;

/**
 * [DAY-5] Solved puzzles can be replayed without points. The admin sees every
 * puzzle in the bundle ("Werkstatt") to try each engine on the phone (M4).
 */
export function PuzzleCollection({ onPlay }: { onPlay: (puzzle: Puzzle) => void }) {
  const save = useStore((s) => s.save);
  const isAdmin = useStore((s) => s.user?.role === 'admin');
  const [puzzles, setPuzzles] = useState<Puzzle[] | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all(listPuzzleIds().map(loadPuzzle))
      .then((all) => alive && setPuzzles(all))
      .catch((e) => console.error(e));
    return () => {
      alive = false;
    };
  }, []);

  if (!save || !puzzles) return <p className="muted">Die Truhe knarzt …</p>;
  const solved = puzzles.filter((p) => save.puzzles[p.id]?.solved);
  const shown = isAdmin ? puzzles : solved;

  return (
    <div className="puzzle-list">
      <p className="muted">
        {solved.length} von {TOTAL_PUZZLES} gelöst{isAdmin ? ' · Werkstatt: alle Rätsel' : ''}
      </p>
      {!shown.length && <p className="muted">Noch keine Rätsel gelöst.</p>}
      {shown.map((p) => {
        const result = save.puzzles[p.id];
        return (
          <button key={p.id} type="button" className="puzzle-row" onClick={() => onPlay(resolveVariant(p, save))}>
            <span className="puzzle-row-number">{String(p.number).padStart(2, '0')}{p.id.slice(3)}</span>
            <span className="puzzle-row-title">{p.title}</span>
            <span className="puzzle-row-points">{result?.solved ? `${result.points} P.` : p.type}</span>
          </button>
        );
      })}
    </div>
  );
}
