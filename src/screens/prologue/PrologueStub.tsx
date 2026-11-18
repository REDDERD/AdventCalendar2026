import { useState } from 'react';
import { go } from '../../core/ScreenMachine';
import { useStore } from '../../core/store';
import { logEvent } from '../../services/EventLogger';
import { now } from '../../services/UnlockService';
import { HOUSES, type HouseId, type Profile } from '../../types';
import { HOUSE_NAMES } from '../../dialogue/DialogueRunner';
import { Frame } from '../../ui/Frame';
import { Layout } from '../../ui/Layout';
import { PixelButton } from '../../ui/PixelButton';

/**
 * Placeholder until the real prologue (M2): sets a default character so the
 * engine can be tested with day 1.
 */
export function PrologueStub() {
  const user = useStore((s) => s.user);
  const updateSave = useStore((s) => s.updateSave);
  const [name, setName] = useState(user?.displayName ?? '');

  const finish = (house: HouseId) => {
    const profile: Profile = {
      name: name.trim() || 'Gast',
      pronoun: 'n',
      look: { skin: 's1', hair: 'h1', hairColor: 'c1', eyes: 'e1', glasses: 'none', accessory: 'none', sweater: 'w1' },
      wand: 'phoenix',
      pet: 'owl',
      hatSuggestion: house,
      house,
      hatOverruled: false,
      sortingAnswers: [house, house, house, house, house],
    };
    const t = now();
    updateSave(
      (s) => {
        s.profile = profile;
        s.vars = {
          ...s.vars,
          name: profile.name,
          pronoun: profile.pronoun,
          house,
          hat_overruled: false,
          wand: profile.wand,
          pet: profile.pet,
        };
        s.progress.dayStartedAt['0'] = t;
        s.progress.dayCompletedAt['0'] = t;
        if (!s.progress.completedDays.includes(0)) s.progress.completedDays.push(0);
      },
      { immediate: true },
    );
    logEvent('prologue_value', 0, { field: 'name', value: profile.name });
    logEvent('sorting_result', 0, { suggestion: house, chosen: house, overruled: false });
    go('calendar');
  };

  return (
    <Layout
      bare
      top={
        <div className="center-msg">
          <Frame className="msg-frame">
            <h2>Prolog</h2>
            <p>Der richtige Prolog mit Spiegel, Zauberstab und Sprechendem Hut folgt in Meilenstein 2.</p>
          </Frame>
        </div>
      }
      bottom={
        <div className="prologue-stub">
          <label className="field">
            <span>Name</span>
            <input value={name} maxLength={12} onChange={(e) => setName(e.target.value)} />
          </label>
          <div className="house-buttons">
            {HOUSES.map((h) => (
              <PixelButton key={h} small onClick={() => finish(h)} className={`house-${h}`}>
                {HOUSE_NAMES[h]}
              </PixelButton>
            ))}
          </div>
        </div>
      }
    />
  );
}
