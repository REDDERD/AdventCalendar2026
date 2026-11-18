import { DaySession } from '../core/DaySession';
import { go } from '../core/ScreenMachine';
import { SPEAKER_NAMES } from '../dialogue/speakers';
import { useCurrentPuzzle } from '../puzzles/usePuzzle';
import { AssetImage } from '../ui/AssetImage';
import { Frame } from '../ui/Frame';
import { Layout } from '../ui/Layout';

/** Section 4, step 4: "Rätsel 07 · 30 Hauspunkte" (Layton style). */
export function PuzzleIntroScreen() {
  const puzzle = useCurrentPuzzle();
  if (!puzzle) return <Layout />;

  const next = () => {
    DaySession.current?.setScreen('puzzle');
    go('puzzle');
  };

  return (
    <Layout
      top={
        <div className="puzzle-intro" onClick={next}>
          <div className="puzzle-intro-number">Rätsel {String(puzzle.number).padStart(2, '0')}</div>
          <div className="puzzle-intro-title">{puzzle.title}</div>
          <div className="puzzle-intro-points">{puzzle.points} Hauspunkte</div>
        </div>
      }
      bottom={
        <div className="dialogue" onClick={next}>
          <div className="dialogue-portrait">
            <AssetImage id={`portrait.${puzzle.intro.speaker}`} w={64} h={64} />
          </div>
          <Frame className="dialogue-box">
            <div className="dialogue-name">{SPEAKER_NAMES[puzzle.intro.speaker] ?? puzzle.intro.speaker}</div>
            <p className="dialogue-text">{puzzle.intro.text}</p>
            <span className="dialogue-more">▼</span>
          </Frame>
        </div>
      }
    />
  );
}
