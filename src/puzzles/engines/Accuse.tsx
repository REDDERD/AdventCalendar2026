import { useState } from 'react';
import { playSfx } from '../../audio/AudioService';
import { CLUES } from '../../content/catalog';
import { useStore } from '../../core/store';
import { accuseLogic, assignCard, togglePoint, type AccuseConfig, type AccuseState } from '../logic/accuse';
import type { Engine, EngineProps } from './types';

/**
 * `custom:accuse`: step 1 – pick a suspect's folder, then the card that clears
 * them; step 2 – tap every card that points to the culprit. Clues the player has
 * not found yet appear as Quill's notes with the same text [DEC-3].
 */
function AccuseEngine({ puzzle, state, setState, disabled }: EngineProps<AccuseState>) {
  const config = puzzle.config as AccuseConfig;
  const found = useStore((s) => s.save?.vars.clues);
  const foundIds = Array.isArray(found) ? found : [];
  const [step, setStep] = useState<1 | 2>(1);
  const [folder, setFolder] = useState<string>(config.suspects[0].id);

  const ownerOf = (card: string) => config.suspects.find((s) => state.clears[s.id] === card);

  const tapCard = (card: string) => {
    if (disabled) return;
    playSfx('select');
    if (step === 2) return setState(togglePoint(state, card));
    setState(assignCard(state, folder, card));
    // move on to the next folder without a card
    const next = config.suspects.find((s) => s.id !== folder && !state.clears[s.id]);
    if (next && state.clears[folder] !== card) setFolder(next.id);
  };

  const cleared = config.suspects.filter((s) => state.clears[s.id]).length;

  return (
    <div className="engine-center accuse">
      <div className="accuse-steps" role="tablist">
        <button type="button" role="tab" aria-selected={step === 1} className={step === 1 ? 'active' : ''} onClick={() => setStep(1)}>
          1 · Entlasten
        </button>
        <button type="button" role="tab" aria-selected={step === 2} className={step === 2 ? 'active' : ''} onClick={() => setStep(2)}>
          2 · Beweise
        </button>
      </div>
      {step === 1 ? (
        <div className="accuse-folders">
          {config.suspects.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`accuse-folder ${folder === s.id ? 'selected' : ''}`}
              aria-label={`Akte ${s.label}`}
              aria-pressed={folder === s.id}
              disabled={disabled}
              onClick={() => setFolder(s.id)}
            >
              <strong>{s.label}</strong>
              <span>{state.clears[s.id] ? CLUES[state.clears[s.id]!] : '–'}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="accuse-culprit">Was zeigt auf {config.culprit}? Tippe alle Karten an.</div>
      )}
      <div className="accuse-board">
        {config.cards.map((card) => {
          const owner = ownerOf(card);
          const pointed = state.points.includes(card);
          const note = !foundIds.includes(card);
          return (
            <button
              key={card}
              type="button"
              className={`accuse-card ${note ? 'note' : ''} ${owner ? 'cleared' : ''} ${pointed ? 'pointed' : ''}`}
              aria-label={CLUES[card]}
              aria-pressed={!!owner || pointed}
              disabled={disabled}
              onClick={() => tapCard(card)}
            >
              <span className="accuse-text">{CLUES[card]}</span>
              {owner && <span className="accuse-tag">entlastet {owner.label}</span>}
              {pointed && <span className="accuse-tag pin">zeigt auf {config.culprit}</span>}
              {note && !owner && !pointed && <span className="accuse-tag note-tag">Quills Notiz</span>}
            </button>
          );
        })}
      </div>
      <div className="engine-status">
        Entlastet: {cleared} / {config.suspects.length} · Beweise: {state.points.length}
      </div>
    </div>
  );
}

export const accuseEngine: Engine<AccuseState> = { logic: accuseLogic, Component: AccuseEngine, submit: 'check' };
