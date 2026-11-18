import { useState } from 'react';
import { logEvent } from '../../services/EventLogger';
import type { PetId } from '../../types';
import { AssetImage } from '../../ui/AssetImage';
import { Frame } from '../../ui/Frame';
import { Layout } from '../../ui/Layout';
import { PixelButton } from '../../ui/PixelButton';
import { advancePrologue, useDraft } from './prologueFlow';

const PETS: Array<{ id: PetId; name: string; text: string }> = [
  { id: 'owl', name: 'Eule', text: 'Bringt Post und wirft kluge Blicke.' },
  { id: 'cat', name: 'Katze', text: 'Schnurrt, schläft und weiß alles.' },
  { id: 'toad', name: 'Kröte', text: 'Unterschätzt, aber unglaublich treu.' },
];

/** Section 6.1 step 4: owl, cat or toad (`pet`). */
export function PetScreen() {
  const draft = useDraft();
  const [selected, setSelected] = useState<PetId | null>(draft.pet ?? null);
  const pet = PETS.find((p) => p.id === selected);

  const confirm = () => {
    if (!selected) return;
    logEvent('prologue_value', 0, { field: 'pet', value: selected });
    void advancePrologue('prologue.train', (d) => {
      d.pet = selected;
    });
  };

  return (
    <Layout
      bare
      top={
        <div className="pet-top">
          <div className="pet-sign">Magische Menagerie</div>
          <div className="pet-shelf">
            {PETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`pet-slot ${selected === p.id ? 'selected' : ''}`}
                aria-label={p.name}
                onClick={() => setSelected(p.id)}
              >
                <AssetImage id={`pet.${p.id}`} w={64} h={64} />
              </button>
            ))}
          </div>
        </div>
      }
      bottom={
        <div className="pet-bottom">
          <Frame className="pet-info">
            {pet ? (
              <>
                <div className="pet-name">{pet.name}</div>
                <div>{pet.text}</div>
              </>
            ) : (
              <div>Ein Haustier begleitet dich durch Hogwarts. Wen nimmst du mit?</div>
            )}
          </Frame>
          <div className="pet-buttons">
            {PETS.map((p) => (
              <PixelButton key={p.id} small className={selected === p.id ? 'active' : ''} onClick={() => setSelected(p.id)}>
                {p.name}
              </PixelButton>
            ))}
          </div>
          <PixelButton variant="wax" disabled={!selected} onClick={confirm}>
            Das ist meins!
          </PixelButton>
        </div>
      }
    />
  );
}
