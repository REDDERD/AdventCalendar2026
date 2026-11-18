import { useState } from 'react';
import { useStore } from '../../core/store';
import { Diary } from './Diary';
import { Collection } from './Collection';
import { Profile } from './Profile';
import { SettingsPanel } from './Settings';

type Tab = 'diary' | 'inventory' | 'clues' | 'profile' | 'settings';

const TABS: Array<[Tab, string]> = [
  ['diary', 'Tagebuch'],
  ['inventory', 'Inventar'],
  ['clues', 'Hinweise'],
  ['profile', 'Steckbrief'],
  ['settings', 'Optionen'],
];

/** Section 2 "Truhe": the main menu overlay. Puzzle collection follows in M4. */
export function Trunk() {
  const setTrunkOpen = useStore((s) => s.setTrunkOpen);
  const [tab, setTab] = useState<Tab>('diary');

  return (
    <div className="trunk">
      <div className="trunk-header">
        <span>Truhe</span>
        <button type="button" className="trunk-close" onClick={() => setTrunkOpen(false)}>
          ✕
        </button>
      </div>
      <div className="trunk-tabs">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" className={`trunk-tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      <div className="trunk-body">
        {tab === 'diary' && <Diary />}
        {tab === 'inventory' && <Collection kind="items" />}
        {tab === 'clues' && <Collection kind="clues" />}
        {tab === 'profile' && <Profile />}
        {tab === 'settings' && <SettingsPanel />}
      </div>
    </div>
  );
}
