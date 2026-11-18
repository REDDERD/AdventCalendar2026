import { useState } from 'react';
import { SPEAKER_NAMES } from '../../dialogue/speakers';
import { SceneRenderer } from '../../scene/SceneRenderer';
import { logEvent } from '../../services/EventLogger';
import type { WandId } from '../../types';
import { AssetImage } from '../../ui/AssetImage';
import { Frame } from '../../ui/Frame';
import { Layout } from '../../ui/Layout';
import { PixelButton } from '../../ui/PixelButton';
import { advancePrologue, useDraft } from './prologueFlow';

export const WANDS: Array<{ id: WandId; name: string; line: string }> = [
  { id: 'phoenix', name: 'Weide & Phönixfeder', line: 'Weide und Phönixfeder. Sucht Abenteuer – und findet sie meistens.' },
  { id: 'dragon', name: 'Ebenholz & Drachenherz', line: 'Ebenholz und Drachenherzfaser. Kraftvoll. Und ein kleines bisschen stur.' },
  { id: 'unicorn', name: 'Birke & Einhornhaar', line: 'Birke und Einhornhaar. Treu, sanft und erstaunlich geduldig.' },
];

const STAGE = { bg: 'wand_shop', music: null, actors: [{ id: 'wandmaker', pos: 'center' as const }], sparks: [] };

/** Section 6.1 step 3: three wands on velvet; tap → sparks → confirm. */
export function WandScreen() {
  const draft = useDraft();
  const [selected, setSelected] = useState<WandId | null>(draft.wand ?? null);
  const wand = WANDS.find((w) => w.id === selected);

  const confirm = () => {
    if (!selected) return;
    logEvent('prologue_value', 0, { field: 'wand', value: selected });
    void advancePrologue('prologue.pet', (d) => {
      d.wand = selected;
    });
  };

  return (
    <Layout
      bare
      top={<SceneRenderer stage={STAGE} emotes={wand ? { wandmaker: '!' } : {}} />}
      bottom={
        <div className="wand-bottom">
          <Frame className="npc-line">
            <div className="dialogue-name">{SPEAKER_NAMES.wandmaker}</div>
            {wand?.line ?? 'Der Zauberstab wählt dich, nicht umgekehrt. Probier sie ruhig aus.'}
          </Frame>
          <div className="velvet">
            {WANDS.map((w) => (
              <button
                key={w.id}
                type="button"
                className={`wand-slot ${selected === w.id ? 'selected' : ''}`}
                aria-label={w.name}
                onClick={() => setSelected(w.id)}
              >
                <AssetImage id={`ui.wand.${w.id}`} w={96} h={24} />
                {selected === w.id && <span className="wand-sparks" />}
              </button>
            ))}
          </div>
          <PixelButton variant="wax" disabled={!selected} onClick={confirm}>
            Diesen nehme ich
          </PixelButton>
        </div>
      }
    />
  );
}
