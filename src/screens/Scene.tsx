import { useCallback, useEffect, useRef, useState } from 'react';
import { playSfx } from '../audio/AudioService';
import { useMusic } from '../audio/useMusic';
import { DaySession, type StepEffects } from '../core/DaySession';
import { go } from '../core/ScreenMachine';
import { useStore } from '../core/store';
import { ChoiceList } from '../dialogue/ChoiceList';
import { DialogueBox } from '../dialogue/DialogueBox';
import type { Step } from '../dialogue/DialogueRunner';
import { SceneRenderer } from '../scene/SceneRenderer';
import { Layout } from '../ui/Layout';

const EMOTE_MS = 1600;

/** Section 4, steps 3 and 7: Ink scene with background, actors, dialogue and choices. */
export function SceneScreen() {
  const session = DaySession.current;
  const textSpeed = useStore((s) => s.save?.settings.textSpeed ?? 'normal');
  const showToast = useStore((s) => s.showToast);
  const [step, setStep] = useState<Step | null>(null);
  const [stage, setStage] = useState(session?.stage);
  const [emotes, setEmotes] = useState<Record<string, string>>({});
  const started = useRef(false);

  const applyEffects = useCallback(
    (effects: StepEffects) => {
      effects.toasts.forEach(showToast);
      effects.sfx.forEach((id) => playSfx(id));
      if (effects.emotes.length) {
        setEmotes((prev) => {
          const next = { ...prev };
          for (const { id, emote } of effects.emotes) next[id] = emote;
          return next;
        });
        const ids = effects.emotes.map((e) => e.id);
        setTimeout(() => {
          setEmotes((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.includes(id))));
        }, EMOTE_MS);
      }
    },
    [showToast],
  );

  const advance = useCallback(() => {
    if (!session) return;
    let { step: next, effects } = session.advance();
    if (next.kind === 'ending') {
      session.resolveEnding();
      ({ step: next, effects } = session.advance());
    }
    setStage(session.stage);
    applyEffects(effects);
    if (next.kind === 'puzzle') {
      go('puzzleIntro');
    } else if (next.kind === 'end' && session.day === 0) {
      // Prologue: the train ride is followed by the sorting hat (Section 6.1)
      session.leaveScene('prologue.sorting');
      go('prologue.sorting');
    } else if (next.kind === 'end') {
      session.complete();
      go('dayEnd');
    } else {
      setStep(next);
    }
  }, [session, applyEffects]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!session) {
      go('calendar');
      return;
    }
    advance();
  }, [session, advance]);

  useMusic(stage?.music ?? 'castle');

  if (!session || !stage) return null;

  const choose = (index: number) => {
    playSfx('select');
    session.choose(index);
    advance();
  };

  const collectSpark = (id: string) => {
    session.collectSpark(id);
    setStage(session.stage);
    showToast('Ein Zauberfunke! +1');
    playSfx('spark');
    navigator.vibrate?.(20);
  };

  const portraitEmote = step?.kind === 'line' && step.speaker ? emotes[step.speaker] : undefined;

  return (
    <Layout>
      <SceneRenderer stage={stage} emotes={emotes} onSpark={collectSpark} />
      {step?.kind === 'line' && (
        <DialogueBox speaker={step.speaker} text={step.text} textSpeed={textSpeed} emote={portraitEmote} onAdvance={advance} />
      )}
      {step?.kind === 'choices' && (
        <div className="choice-screen">
          <ChoiceList options={step.options} onChoose={choose} />
        </div>
      )}
    </Layout>
  );
}
