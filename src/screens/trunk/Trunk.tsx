import { useState } from 'react';
import { useStore } from '../../core/store';
import { PuzzleHost } from '../../puzzles/PuzzleHost';
import type { Puzzle } from '../../puzzles/schema';
import { Collection } from './Collection';
import { Diary } from './Diary';
import { Profile } from './Profile';
import { PuzzleCollection } from './PuzzleCollection';
import { SettingsPanel } from './Settings';

type Tab = 'diary' | 'puzzles' | 'inventory' | 'clues' | 'profile' | 'settings';

const TABS: Array<[Tab, string]> = [
  ['diary', 'Tagebuch'],
  ['puzzles', 'Rätsel'],
  ['inventory', 'Inventar'],
  ['clues', 'Hinweise'],
  ['profile', 'Steckbrief'],
  ['settings', 'Optionen'],
];

/** Section 2 "Truhe": the main menu overlay. */
export function Trunk() {
  const setTrunkOpen = useStore((s) => s.setTrunkOpen);
  const [tab, setTab] = useState<Tab>('diary');
  const [practice, setPractice] = useState<Puzzle | null>(null);

  if (practice) {
    return (
      <div className="trunk">
        <PuzzleHost key={practice.id} puzzle={practice} practice={{ onClose: () => setPractice(null) }} />
      </div>
    );
  }

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
        {tab === 'puzzles' && <PuzzleCollection onPlay={setPractice} />}
        {tab === 'inventory' && <Collection kind="items" />}
        {tab === 'clues' && <Collection kind="clues" />}
        {tab === 'profile' && <Profile />}
        {tab === 'settings' && <SettingsPanel />}
      </div>
    </div>
  );
}
