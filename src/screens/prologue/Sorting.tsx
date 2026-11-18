import { useMusic } from '../../audio/useMusic';
import { useMemo, useState, type ReactNode } from 'react';
import { evaluateSorting, HAT_LINES, shuffled, SORTING_QUESTIONS } from '../../content/sortingQuiz';
import { useStore } from '../../core/store';
import { DialogueBox } from '../../dialogue/DialogueBox';
import { SceneRenderer } from '../../scene/SceneRenderer';
import { logEvent } from '../../services/EventLogger';
import { HOUSES, type HouseId } from '../../types';
import { Frame } from '../../ui/Frame';
import { Layout } from '../../ui/Layout';
import { PixelButton } from '../../ui/PixelButton';
import { advancePrologue, HOUSE_LABEL, useDraft } from './prologueFlow';

/** The hat sits above the question panel (four answers ≈ 200 px). */
const HAT_FLOOR = 204;

const STAGE = { bg: 'great_hall', music: null, actors: [{ id: 'hat', pos: 'center' as const }], sparks: [] };

type Phase =
  | { kind: 'intro'; line: number }
  | { kind: 'question' }
  | { kind: 'verdict'; line: number }
  | { kind: 'wish' }
  | { kind: 'choose' }
  | { kind: 'closing'; house: HouseId; overruled: boolean };

/** Section 6.3: five questions, verdict, and the chance to object [HAT-1] [HAT-2]. */
export function SortingScreen() {
  useMusic('castle');
  const draft = useDraft();
  const updateSave = useStore((s) => s.updateSave);
  const textSpeed = useStore((s) => s.save?.settings.textSpeed ?? 'normal');
  const answers = draft.sortingAnswers ?? [];
  const suggestion = draft.hatSuggestion;
  const [phase, setPhase] = useState<Phase>(() =>
    suggestion ? { kind: 'wish' } : answers.length ? { kind: 'question' } : { kind: 'intro', line: 0 },
  );

  const questionIndex = answers.length;
  const question = SORTING_QUESTIONS[questionIndex];
  // [HAT-1] random answer order, stable while the question is shown
  const order = useMemo(() => shuffled(HOUSES), [questionIndex]);

  const answer = (house: HouseId) => {
    const next = [...answers, house];
    logEvent('sorting_answer', 0, { question: next.length, house });
    const done = next.length === SORTING_QUESTIONS.length;
    const verdict = done ? evaluateSorting(next) : undefined;
    updateSave(
      (s) => {
        s.prologueDraft = { ...s.prologueDraft, sortingAnswers: next, ...(verdict ? { hatSuggestion: verdict } : {}) };
      },
      { immediate: true },
    );
    if (done) setPhase({ kind: 'verdict', line: 0 });
  };

  const decide = (house: HouseId) => {
    const overruled = house !== suggestion;
    logEvent('sorting_result', 0, { suggestion, chosen: house, overruled });
    setPhase({ kind: 'closing', house, overruled });
  };

  const finish = (house: HouseId, overruled: boolean) =>
    void advancePrologue('prologue.reveal', (d) => {
      d.house = house;
      d.hatOverruled = overruled;
    });

  let bottom: ReactNode;
  if (phase.kind === 'intro') {
    bottom = (
      <DialogueBox
        speaker="hat"
        text={HAT_LINES.intro[phase.line]}
        textSpeed={textSpeed}
        onAdvance={() =>
          setPhase(phase.line + 1 < HAT_LINES.intro.length ? { kind: 'intro', line: phase.line + 1 } : { kind: 'question' })
        }
      />
    );
  } else if (phase.kind === 'question' && question) {
    bottom = (
      <div className="sorting-question">
        <Frame className="sorting-prompt">
          <span className="sorting-count">
            {questionIndex + 1}/{SORTING_QUESTIONS.length}
          </span>{' '}
          {question.question}
        </Frame>
        <div className="choices">
          {order.map((house) => (
            <button key={house} type="button" className="choice" onClick={() => answer(house)}>
              {question.answers[house]}
            </button>
          ))}
        </div>
      </div>
    );
  } else if (phase.kind === 'verdict' && suggestion) {
    const lines = [HAT_LINES.ponder, HAT_LINES.traits[suggestion], `${HAT_LINES.announce} ${HOUSE_LABEL[suggestion].toUpperCase()}!`];
    bottom = (
      <DialogueBox
        speaker="hat"
        text={lines[phase.line]}
        textSpeed={textSpeed}
        onAdvance={() => setPhase(phase.line + 1 < lines.length ? { kind: 'verdict', line: phase.line + 1 } : { kind: 'wish' })}
      />
    );
  } else if (phase.kind === 'wish' && suggestion) {
    bottom = (
      <div className="sorting-question">
        <Frame className="sorting-prompt">
          <b>Der Sprechende Hut:</b> {HAT_LINES.wish}
        </Frame>
        <div className="choices">
          <button type="button" className="choice" onClick={() => decide(suggestion)}>
            {HOUSE_LABEL[suggestion]} passt perfekt!
          </button>
          <button type="button" className="choice" onClick={() => setPhase({ kind: 'choose' })}>
            Ich wünsche mir ein anderes Haus.
          </button>
        </div>
      </div>
    );
  } else if (phase.kind === 'choose' && suggestion) {
    bottom = (
      <div className="sorting-question">
        <Frame className="sorting-prompt">Welches Haus wünschst du dir?</Frame>
        <div className="choices">
          {HOUSES.filter((h) => h !== suggestion).map((h) => (
            <button key={h} type="button" className="choice" onClick={() => decide(h)}>
              {HOUSE_LABEL[h]}
            </button>
          ))}
          <PixelButton small onClick={() => setPhase({ kind: 'wish' })}>
            Zurück
          </PixelButton>
        </div>
      </div>
    );
  } else if (phase.kind === 'closing') {
    bottom = (
      <DialogueBox
        speaker="hat"
        text={phase.overruled ? `${HAT_LINES.overruled} Also gut: ${HOUSE_LABEL[phase.house].toUpperCase()}!` : HAT_LINES.accepted}
        textSpeed={textSpeed}
        onAdvance={() => finish(phase.house, phase.overruled)}
      />
    );
  }

  return (
    <Layout bare>
      <SceneRenderer stage={STAGE} emotes={{}} floor={HAT_FLOOR} />
      {bottom}
    </Layout>
  );
}
