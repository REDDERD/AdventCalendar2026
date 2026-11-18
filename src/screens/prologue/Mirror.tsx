import { useRef, useState } from 'react';
import { CharacterSprite } from '../../character/CharacterSprite';
import { buildForPronoun, DEFAULT_LOOK, OPTIONS, randomLook, type Direction } from '../../character/layers';
import { useStore } from '../../core/store';
import { logEvent } from '../../services/EventLogger';
import type { Look } from '../../types';
import { AssetImage } from '../../ui/AssetImage';
import { Layout } from '../../ui/Layout';
import { PixelButton } from '../../ui/PixelButton';
import { advancePrologue, useDraft } from './prologueFlow';

// The body shape is not chosen here; it follows the pronoun from the letter.
const CATEGORIES: Array<[keyof Look, string]> = [
  ['skin', 'Haut'],
  ['hair', 'Frisur'],
  ['hairColor', 'Haarfarbe'],
  ['eyes', 'Augen'],
  ['glasses', 'Brille'],
  ['accessory', 'Extra'],
  ['sweater', 'Pullover'],
  ['bottom', 'Unterteil'],
];

/** Turning order for swipes: front → left side → back → right side. */
const TURN: Direction[] = ['down', 'left', 'up', 'right'];
const SWIPE_PX = 20;

/** Section 6.1 step 2: choose the look in the robe shop's mirror [CHAR-1]. */
export function MirrorScreen() {
  const draft = useDraft();
  const updateSave = useStore((s) => s.updateSave);
  const build = buildForPronoun(draft.pronoun);
  const [look, setLook] = useState<Look>({ ...DEFAULT_LOOK, ...draft.look, build });
  const [category, setCategory] = useState(0);
  const [turn, setTurn] = useState(0);
  const swipeStart = useRef<number | null>(null);

  const update = (next: Look) => {
    setLook(next);
    updateSave((s) => {
      s.prologueDraft = { ...s.prologueDraft, look: next };
    });
  };

  const [key, label] = CATEGORIES[category];
  const options = OPTIONS[key] as ReadonlyArray<readonly [string, string]>;
  const index = Math.max(0, options.findIndex(([id]) => id === look[key]));
  const cycle = (delta: number) => update({ ...look, [key]: options[(index + delta + options.length) % options.length][0] });
  const rotate = (delta: number) => setTurn((t) => (t + delta + TURN.length) % TURN.length);

  const done = () => {
    logEvent('prologue_value', 0, { field: 'look', value: look });
    void advancePrologue('prologue.wand', (d) => {
      d.look = look;
    });
  };

  return (
    <Layout bare className="mirror-screen">
      <div
        className="mirror-top"
        onPointerDown={(e) => (swipeStart.current = e.clientX)}
        onPointerUp={(e) => {
          if (swipeStart.current === null) return;
          const dx = e.clientX - swipeStart.current;
          swipeStart.current = null;
          if (Math.abs(dx) > SWIPE_PX) rotate(dx < 0 ? 1 : -1);
        }}
      >
        <div className="scene-world">
          <AssetImage id="bg.robe_shop" w={256} h={512} />
        </div>
        <div className="mirror-glass">
          <CharacterSprite look={look} house={null} direction={TURN[turn]} scale={2} />
        </div>
        <button type="button" className="turn-btn turn-left" aria-label="Drehen" onClick={() => rotate(-1)}>
          ⟲
        </button>
        <button type="button" className="turn-btn turn-right" aria-label="Drehen" onClick={() => rotate(1)}>
          ⟳
        </button>
      </div>
      <div className="mirror-bottom">
        <div className="mirror-tabs">
          {CATEGORIES.map(([id, name], i) => (
            <button key={id} type="button" className={i === category ? 'active' : ''} onClick={() => setCategory(i)}>
              {name}
            </button>
          ))}
        </div>
        <div className="mirror-option">
          <button type="button" className="arrow" aria-label="Zurück" onClick={() => cycle(-1)}>
            ◀
          </button>
          <div className="mirror-value">
            <div className="mirror-label">{label}</div>
            <div>{options[index][1]}</div>
            <div className="mirror-count">
              {index + 1} / {options.length}
            </div>
          </div>
          <button type="button" className="arrow" aria-label="Weiter" onClick={() => cycle(1)}>
            ▶
          </button>
        </div>
        <div className="row-buttons">
          <PixelButton onClick={() => update(randomLook(build))}>Zufall</PixelButton>
          <PixelButton variant="wax" onClick={done}>
            Fertig
          </PixelButton>
        </div>
      </div>
    </Layout>
  );
}
