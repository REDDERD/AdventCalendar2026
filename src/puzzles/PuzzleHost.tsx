import { useEffect, useRef, useState, type ReactNode } from 'react';
import { DaySession } from '../core/DaySession';
import { go } from '../core/ScreenMachine';
import { useStore } from '../core/store';
import { logEvent } from '../services/EventLogger';
import { now } from '../services/UnlockService';
import { AssetImage } from '../ui/AssetImage';
import { Frame } from '../ui/Frame';
import { Layout } from '../ui/Layout';
import { PixelButton } from '../ui/PixelButton';
import { engineFor } from './engines';
import type { Engine } from './engines/types';
import { ClueCard, HelpOffer, HintPanel, NotesLayer } from './PuzzleParts';
import type { Puzzle } from './schema';
import { helpDueAt, hintCost, nextHint, pointsFor, SUPER_HINT } from './scoring';

const STAMP_MS = 900;

interface Props {
  puzzle: Puzzle;
  /** Trunk → puzzle collection: replay without points, events or sparks [DAY-5]. */
  practice?: { onClose: () => void };
}

/** Section 13.2 PuzzleHost: engine, attempts, hints, notes, mentor help, points and events. */
export function PuzzleHost({ puzzle, practice }: Props) {
  const engine = engineFor(puzzle);
  if (!engine) {
    return (
      <Shell practice={practice}>
        <div className="center-msg">Dieses Rätsel ist noch in der Werkstatt.</div>
      </Shell>
    );
  }
  return <PuzzleRun puzzle={puzzle} practice={practice} engine={engine} />;
}

function Shell({ practice, children }: { practice?: Props['practice']; children: ReactNode }) {
  if (!practice) return <Layout className="puzzle-view">{children}</Layout>;
  return (
    <div className="layout practice">
      <div className="practice-head">
        <span>Übung · ohne Punkte</span>
        <button type="button" className="overlay-close" aria-label="Übung beenden" onClick={practice.onClose}>
          ✕
        </button>
      </div>
      <div className="screen-body puzzle-view">{children}</div>
    </div>
  );
}

function PuzzleRun({ puzzle, practice, engine }: Props & { engine: Engine<unknown> }) {
  const save = useStore((s) => s.save)!;
  const updateSave = useStore((s) => s.updateSave);
  const day = useStore((s) => s.activeDay);
  const [state, setState] = useState(() => engine.logic.initial(puzzle));
  const [stamp, setStamp] = useState<'correct' | 'wrong' | null>(null);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [notesOn, setNotesOn] = useState(false);
  const [notesCleared, setNotesCleared] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [crossed, setCrossed] = useState<Set<number>>(new Set());
  const [practiceRun, setPracticeRun] = useState({ attempts: 0, hints: [] as number[], solved: false });
  const started = useRef(false);

  const result = practice ? undefined : save.puzzles[puzzle.id];
  const attempts = practice ? practiceRun.attempts : (result?.attempts ?? 0);
  const bought = practice ? practiceRun.hints : (result?.hintsBought ?? []);
  const pet = save.profile?.pet;
  const petLine = pet && puzzle.petHint ? { id: pet, line: puzzle.petHint[pet] } : undefined;

  // [PZL-8] start event; [PLAN-2] the pet unlocks hint 1 for free
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (practice) {
      if (petLine) setPracticeRun((r) => ({ ...r, hints: [1] }));
      return;
    }
    if (save.puzzles[puzzle.id]) return;
    updateSave(
      (s) => {
        s.puzzles[puzzle.id] = { solved: false, attempts: 0, hintsBought: petLine ? [1] : [], points: 0, startedAt: now() };
      },
      { immediate: true },
    );
    logEvent('puzzle_start', day, { puzzleId: puzzle.id });
    if (petLine) {
      logEvent('puzzle_hint', day, { puzzleId: puzzle.id, level: 1, free: true });
      setHintsOpen(true);
    }
  }, [practice, petLine, puzzle.id, save.puzzles, updateSave, day]);

  // [PZL-5] the mentor offers help after 3 wrong attempts or 4 minutes, again 2 minutes after a "no"
  const solved = result?.solved ?? false;
  useEffect(() => {
    if (practice || !result || solved || helpOpen || stamp) return;
    const timer = setTimeout(() => setHelpOpen(true), Math.max(0, helpDueAt(result) - now()));
    return () => clearTimeout(timer);
  }, [practice, result, solved, helpOpen, stamp]);

  const durationSec = () => Math.round((now() - (result?.startedAt ?? now())) / 1000);

  const finish = () => {
    DaySession.current?.setScreen('solution');
    go('solution');
  };

  const submit = (input: unknown) => {
    if (stamp || solved || practiceRun.solved) return;
    const correct = engine.logic.check(puzzle, input);
    const attempt = attempts + 1;
    setStamp(correct ? 'correct' : 'wrong');
    navigator.vibrate?.(correct ? 30 : [40, 60, 40]);

    if (practice) {
      setPracticeRun((r) => ({ ...r, attempts: attempt }));
      setTimeout(() => {
        setStamp(null);
        if (correct) setPracticeRun((r) => ({ ...r, solved: true }));
      }, STAMP_MS);
      return;
    }

    logEvent('puzzle_attempt', day, { puzzleId: puzzle.id, attempt, input: engine.logic.describe(puzzle, input), correct });
    if (!correct) {
      updateSave(
        (s) => {
          s.puzzles[puzzle.id].attempts = attempt;
        },
        { immediate: true },
      );
      setTimeout(() => setStamp(null), STAMP_MS);
      return;
    }
    const points = pointsFor(puzzle.points, attempt, 'self');
    const duration = durationSec();
    updateSave(
      (s) => {
        Object.assign(s.puzzles[puzzle.id], { solved: true, solvedBy: 'self', attempts: attempt, points, durationSec: duration });
        s.housePoints += points;
      },
      { immediate: true },
    );
    logEvent('puzzle_solved', day, { puzzleId: puzzle.id, attempts: attempt, durationSec: duration, points, solvedBy: 'self' });
    setTimeout(finish, STAMP_MS);
  };

  const buyHint = (level: number) => {
    if (nextHint(bought) !== level) return;
    if (practice) return setPracticeRun((r) => ({ ...r, hints: [...r.hints, level] }));
    const cost = hintCost(level);
    if (save.sparks < cost) return;
    updateSave(
      (s) => {
        s.sparks -= cost;
        s.puzzles[puzzle.id].hintsBought.push(level);
      },
      { immediate: true },
    );
    logEvent('puzzle_hint', day, { puzzleId: puzzle.id, level: level === SUPER_HINT ? 'super' : level, free: false });
  };

  const acceptHelp = () => {
    const points = pointsFor(puzzle.points, attempts, 'help');
    const duration = durationSec();
    updateSave(
      (s) => {
        Object.assign(s.puzzles[puzzle.id], { solved: true, solvedBy: 'help', points, durationSec: duration });
        s.housePoints += points;
      },
      { immediate: true },
    );
    logEvent('puzzle_solved', day, { puzzleId: puzzle.id, attempts, durationSec: duration, points, solvedBy: 'help' });
    setHelpOpen(false);
    finish();
  };

  const declineHelp = () => {
    // Saved at once: the offer must not come back after closing the app
    updateSave(
      (s) => {
        s.puzzles[puzzle.id].helpDeclinedAt = now();
      },
      { immediate: true },
    );
    setHelpOpen(false);
  };

  const busy = !!stamp || solved;

  return (
    <Shell practice={practice}>
      {/* Prompt panel · play area (at least 256 × 256, DECISIONS.md #32) · action bar */}
      <div className="puzzle-panel">
        <div className="puzzle-header">
          <span>Rätsel {String(puzzle.number).padStart(2, '0')}</span>
          <span className="puzzle-attempts">{attempts ? `Fehlversuche: ${attempts}` : ''}</span>
          <span>{puzzle.points} P.</span>
        </div>
        {/* Text first: on a 448 px stage the panel has ~136 px before it scrolls */}
        <Frame className="puzzle-prompt">{puzzle.prompt}</Frame>
        {puzzle.image && <AssetImage id={puzzle.image} w={256} h={64} className="puzzle-image" />}
      </div>
      <div className="puzzle-area">
        <engine.Component puzzle={puzzle} state={state} setState={setState} disabled={busy} onSubmit={submit} />
        <NotesLayer active={notesOn} clearSignal={notesCleared} />
        {notesOn && (
          <button type="button" className="notes-clear" onClick={() => setNotesCleared((n) => n + 1)}>
            Wischen
          </button>
        )}
        {cardOpen && puzzle.clues && (
          <ClueCard
            clues={puzzle.clues}
            crossed={crossed}
            onToggle={(i) => setCrossed((prev) => {
              const next = new Set(prev);
              if (!next.delete(i)) next.add(i);
              return next;
            })}
            onClose={() => setCardOpen(false)}
          />
        )}
        {hintsOpen && (
          <HintPanel
            puzzle={puzzle}
            bought={bought}
            sparks={save.sparks}
            free={!!practice}
            pet={petLine}
            onBuy={buyHint}
            onClose={() => setHintsOpen(false)}
          />
        )}
        {practiceRun.solved && (
          <div className="puzzle-overlay practice-solved">
            <Frame className="solution-text">{puzzle.solutionText}</Frame>
            <PixelButton
              small
              onClick={() => {
                setState(engine.logic.initial(puzzle));
                setPracticeRun({ attempts: 0, hints: petLine ? [1] : [], solved: false });
              }}
            >
              Nochmal
            </PixelButton>
            <PixelButton small variant="wax" onClick={practice?.onClose}>
              Zur Sammlung
            </PixelButton>
          </div>
        )}
      </div>
      <div className="puzzle-actions">
        <PixelButton small aria-pressed={hintsOpen} onClick={() => setHintsOpen(!hintsOpen)}>
          Hinweis
        </PixelButton>
        {puzzle.clues && (
          <PixelButton small aria-pressed={cardOpen} className={cardOpen ? 'active' : ''} onClick={() => { setCardOpen(!cardOpen); setHintsOpen(false); }}>
            Karte
          </PixelButton>
        )}
        <PixelButton small aria-pressed={notesOn} className={notesOn ? 'active' : ''} onClick={() => setNotesOn(!notesOn)}>
          Notiz
        </PixelButton>
        {engine.submit === 'check' && (
          <>
            <PixelButton small aria-label="Zurücksetzen" disabled={busy} onClick={() => setState(engine.logic.initial(puzzle))}>
              ↺
            </PixelButton>
            <PixelButton small variant="wax" className="check-btn" disabled={busy} onClick={() => submit(state)}>
              Prüfen
            </PixelButton>
          </>
        )}
      </div>
      {helpOpen && <HelpOffer onAccept={acceptHelp} onDecline={declineHelp} />}
      {stamp && <div className={`stamp stamp-${stamp}`}>{stamp === 'correct' ? 'Richtig!' : 'Leider falsch'}</div>}
    </Shell>
  );
}
