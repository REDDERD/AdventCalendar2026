import { DaySession } from '../core/DaySession';
import { go } from '../core/ScreenMachine';
import { useStore } from '../core/store';
import { useCurrentPuzzle } from '../puzzles/usePuzzle';
import { Frame } from '../ui/Frame';
import { Layout } from '../ui/Layout';
import { PixelButton } from '../ui/PixelButton';

/** Section 4, step 6: stamp, explanation, points awarded. */
export function SolutionScreen() {
  const puzzle = useCurrentPuzzle();
  const result = useStore((s) => (puzzle ? s.save?.puzzles[puzzle.id] : undefined));
  if (!puzzle || !result) return <Layout />;

  const next = () => {
    const firstTry = result.solvedBy === 'self' && result.attempts === 1;
    DaySession.current?.resolvePuzzle(firstTry);
    go('scene');
  };

  return (
    <Layout
      top={
        <div className="solution-top">
          <div className="stamp stamp-correct stamp-static">Richtig!</div>
          <Frame className="solution-text">{puzzle.solutionText}</Frame>
        </div>
      }
      bottom={
        <div className="center-msg">
          <Frame className="msg-frame">
            <div className="points-big">+{result.points} Hauspunkte</div>
            {result.solvedBy === 'help' ? (
              <div>Gemeinsam mit Prof. Quill gelöst.</div>
            ) : (
              <div>
                {result.attempts === 1 ? 'Im ersten Versuch!' : `Im ${result.attempts}. Versuch.`}
              </div>
            )}
          </Frame>
          <PixelButton variant="wax" onClick={next}>
            Weiter
          </PixelButton>
        </div>
      }
    />
  );
}
