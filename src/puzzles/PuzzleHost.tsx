import { useEffect, useRef, useState } from 'react';
import { DaySession } from '../core/DaySession';
import { go } from '../core/ScreenMachine';
import { useStore } from '../core/store';
import { logEvent } from '../services/EventLogger';
import { now } from '../services/UnlockService';
import { AssetImage } from '../ui/AssetImage';
import { Frame } from '../ui/Frame';
import { Layout } from '../ui/Layout';
import { PixelButton } from '../ui/PixelButton';
import { engines } from './engines';
import type { Engine } from './engines/types';
import type { Puzzle } from './schema';
import { pointsFor } from './scoring';

const STAMP_MS = 900;

/** Fallback until the engine for this type exists (M4). */
const dummyEngine: Engine = {
  Component: ({ onSubmit, disabled }) => (
    <div className="center-msg">
      <PixelButton disabled={disabled} onClick={() => onSubmit('dummy')}>
        Rätsel lösen (Platzhalter)
      </PixelButton>
    </div>
  ),
  check: () => true,
  describe: () => 'dummy',
};

/** Section 13.2 PuzzleHost: attempts, points and events [PZL-8]. Hints and help follow in M4. */
export function PuzzleHost({ puzzle }: { puzzle: Puzzle }) {
  const save = useStore((s) => s.save)!;
  const updateSave = useStore((s) => s.updateSave);
  const [stamp, setStamp] = useState<'correct' | 'wrong' | null>(null);
  const day = useStore((s) => s.activeDay);
  const started = useRef(false);
  const engine = engines[puzzle.type] ?? dummyEngine;
  const result = save.puzzles[puzzle.id];

  useEffect(() => {
    if (started.current || save.puzzles[puzzle.id]) return;
    started.current = true;
    updateSave(
      (s) => {
        s.puzzles[puzzle.id] = { solved: false, attempts: 0, hintsBought: [], points: 0, startedAt: now() };
      },
      { immediate: true },
    );
    logEvent('puzzle_start', day, { puzzleId: puzzle.id });
  }, [puzzle.id, save.puzzles, updateSave, day]);

  const submit = (input: unknown) => {
    if (stamp || result?.solved) return;
    const correct = engine.check(puzzle, input);
    const attempt = (result?.attempts ?? 0) + 1;
    logEvent('puzzle_attempt', day, { puzzleId: puzzle.id, attempt, input: engine.describe(input), correct });

    if (!correct) {
      updateSave((s) => {
        s.puzzles[puzzle.id].attempts = attempt;
      });
      setStamp('wrong');
      navigator.vibrate?.([40, 60, 40]);
      setTimeout(() => setStamp(null), STAMP_MS);
      return;
    }

    const points = pointsFor(puzzle.points, attempt, 'self');
    const startedAt = result?.startedAt ?? now();
    const durationSec = Math.round((now() - startedAt) / 1000);
    updateSave(
      (s) => {
        Object.assign(s.puzzles[puzzle.id], { solved: true, solvedBy: 'self', attempts: attempt, points, durationSec });
        s.housePoints += points;
      },
      { immediate: true },
    );
    logEvent('puzzle_solved', day, { puzzleId: puzzle.id, attempts: attempt, durationSec, points, solvedBy: 'self' });
    setStamp('correct');
    navigator.vibrate?.(30);
    setTimeout(() => {
      DaySession.current?.setScreen('solution');
      go('solution');
    }, STAMP_MS);
  };

  return (
    <Layout
      top={
        <div className="puzzle-top">
          <div className="puzzle-header">
            <span>Rätsel {String(puzzle.number).padStart(2, '0')}</span>
            <span>{puzzle.points} P.</span>
          </div>
          {puzzle.image && <AssetImage id={puzzle.image} w={256} h={84} className="puzzle-image" />}
          <Frame className="puzzle-prompt">{puzzle.prompt}</Frame>
          {stamp && <div className={`stamp stamp-${stamp}`}>{stamp === 'correct' ? 'Richtig!' : 'Leider falsch'}</div>}
        </div>
      }
      bottom={
        <div className="puzzle-bottom">
          <engine.Component puzzle={puzzle} disabled={!!stamp} onSubmit={submit} />
        </div>
      }
      nav={
        <div className="puzzle-nav">
          <span className="puzzle-attempts">Versuche: {result?.attempts ?? 0}</span>
        </div>
      }
    />
  );
}
