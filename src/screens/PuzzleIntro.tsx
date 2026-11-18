import { DaySession } from '../core/DaySession';
import { go } from '../core/ScreenMachine';
import { useStore } from '../core/store';
import { DialogueBox } from '../dialogue/DialogueBox';
import { useCurrentPuzzle } from '../puzzles/usePuzzle';
import { Layout } from '../ui/Layout';

/** Section 4, step 4: "Rätsel 07 · 30 Hauspunkte" (Layton style), introduced by a character. */
export function PuzzleIntroScreen() {
  const puzzle = useCurrentPuzzle();
  const textSpeed = useStore((s) => s.save?.settings.textSpeed ?? 'normal');
  if (!puzzle) return <Layout />;

  const next = () => {
    DaySession.current?.setScreen('puzzle');
    go('puzzle');
  };

  return (
    <Layout>
      <div className="puzzle-intro" onClick={next}>
        <div className="puzzle-intro-number">Rätsel {String(puzzle.number).padStart(2, '0')}</div>
        <div className="puzzle-intro-title">{puzzle.title}</div>
        <div className="puzzle-intro-points">{puzzle.points} Hauspunkte</div>
      </div>
      <DialogueBox speaker={puzzle.intro.speaker} text={puzzle.intro.text} textSpeed={textSpeed} onAdvance={next} />
    </Layout>
  );
}
