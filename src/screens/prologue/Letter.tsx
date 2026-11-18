import { useState } from 'react';
import { useStore } from '../../core/store';
import { logEvent } from '../../services/EventLogger';
import type { Pronoun } from '../../types';
import { Frame } from '../../ui/Frame';
import { Layout } from '../../ui/Layout';
import { PixelButton } from '../../ui/PixelButton';
import { advancePrologue, useDraft } from './prologueFlow';

// The pronoun also decides the body shape in the mirror (DECISIONS.md #20).
const PRONOUNS: Array<[Pronoun, string]> = [
  ['f', 'Hexe'],
  ['m', 'Zauberer'],
];

/** Section 6.1 step 1: the sealed letter; signing sets `name` and `pronoun`. */
export function LetterScreen() {
  const user = useStore((s) => s.user);
  const draft = useDraft();
  const [opened, setOpened] = useState(!!draft.name);
  const [name, setName] = useState(draft.name ?? (user?.displayName ?? '').slice(0, 12));
  const [pronoun, setPronoun] = useState<Pronoun | null>(draft.pronoun === 'f' || draft.pronoun === 'm' ? draft.pronoun : null);
  const trimmed = name.trim();
  const valid = trimmed.length >= 1 && trimmed.length <= 12 && pronoun !== null;

  const sign = () => {
    if (!valid) return;
    logEvent('prologue_value', 0, { field: 'name', value: trimmed });
    logEvent('prologue_value', 0, { field: 'pronoun', value: pronoun });
    void advancePrologue('prologue.mirror', (d) => {
      d.name = trimmed;
      d.pronoun = pronoun!;
    });
  };

  return (
    <Layout bare className="letter-screen">
      {opened ? (
        <>
          <div className="letter-top">
            <Frame className="letter-paper">
              <div className="letter-head">Hogwarts-Schule für Hexerei und Zauberei</div>
              <p>Wir freuen uns, dir mitzuteilen, dass du ab dem 1. Dezember als Austauschgast in Hogwarts aufgenommen bist.</p>
              <p>Der Zug fährt heute Abend. Bitte unterschreibe unten.</p>
              <p className="letter-sign">A. Thornbury, Schulleiterin</p>
            </Frame>
          </div>
          <div className="letter-form">
            <label className="field">
              <span>Unterschrift (dein Name)</span>
              <input value={name} maxLength={12} onChange={(e) => setName(e.target.value)} autoComplete="off" />
            </label>
            <div className="field-label">Wie sollen wir dich nennen?</div>
            <div className="segmented segmented-dark">
              {PRONOUNS.map(([id, label]) => (
                <button key={id} type="button" className={pronoun === id ? 'active' : ''} onClick={() => setPronoun(id)}>
                  {label}
                </button>
              ))}
            </div>
            <PixelButton variant="wax" disabled={!valid} onClick={sign}>
              Unterschreiben
            </PixelButton>
          </div>
        </>
      ) : (
        <div className="letter-top" onClick={() => setOpened(true)}>
          <div className="envelope">
            <div className="envelope-flap" />
            <button type="button" className="wax-seal" aria-label="Siegel brechen" onClick={() => setOpened(true)}>
              H
            </button>
          </div>
          <div className="tap-hint">Tippe auf das Siegel</div>
        </div>
      )}
    </Layout>
  );
}
