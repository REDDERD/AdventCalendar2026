import { useEffect, useRef, useState } from 'react';
import { playSfx } from '../../audio/AudioService';
import { AssetImage } from '../../ui/AssetImage';
import { PixelButton } from '../../ui/PixelButton';
import { crossAttempt, crossLogic, type CrossConfig, type CrossState } from '../logic/cross';
import type { Engine, EngineProps } from './types';

const SPRITES = ['puzzle.hippogriff', 'puzzle.ferret'] as const;
const SAIL_MS = 700;
const BRAWL_MS = 1600;

/**
 * Idle → the boat sails over with its animals. A safe crossing is then committed. If a bank
 * breaks the rule, the hippogriffs set upon the ferrets there in a cartoon dust cloud and
 * a popup takes the move back: the state before casting off, boat still loaded.
 */
type Phase =
  | { kind: 'idle' }
  | { kind: 'sailing' | 'brawl' | 'undo'; boat: [number, number]; next: CrossState; unsafe: [boolean, boolean] };

/**
 * `custom:cross`: tap animals on the boat's bank to board (up to the capacity),
 * tap them in the boat to step out again, then "Ablegen".
 */
function CrossEngine({ puzzle, state, setState, disabled }: EngineProps<CrossState>) {
  const config = puzzle.config as CrossConfig;
  const [boat, setBoat] = useState<[number, number]>([0, 0]);
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });
  const timers = useRef<number[]>([]);
  const total = [config.predators.count, config.prey.count];
  const labels = [config.predators.label, config.prey.label];
  const busy = phase.kind !== 'idle';
  const aboard = boat[0] + boat[1];

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => clearTimers, []);
  // "Zurücksetzen" in the action bar (or a committed crossing) ends any animation
  useEffect(() => {
    clearTimers();
    setPhase({ kind: 'idle' });
  }, [state]);

  // What the scene shows: before arrival the old state, afterwards the new one
  const shown = phase.kind === 'brawl' || phase.kind === 'undo' ? phase.next : state;
  const cargo = phase.kind === 'idle' ? boat : phase.kind === 'sailing' ? phase.boat : [0, 0];
  const boatLeft = phase.kind === 'idle' ? state.boatLeft : phase.kind === 'sailing' ? !state.boatLeft : phase.next.boatLeft;

  const counts = (isLeft: boolean) => {
    const c = isLeft ? shown.left : [total[0] - shown.left[0], total[1] - shown.left[1]];
    const boarding = phase.kind === 'idle' || phase.kind === 'sailing';
    return [0, 1].map((kind) => (boarding && state.boatLeft === isLeft ? c[kind] - cargo[kind] : c[kind]));
  };

  const board = (kind: number) => {
    if (disabled || busy || aboard >= config.capacity) return;
    const next: [number, number] = [...boat];
    next[kind]++;
    setBoat(next);
  };
  const leave = (kind: number) => {
    if (busy) return;
    const next: [number, number] = [...boat];
    next[kind]--;
    setBoat(next);
  };
  const sail = () => {
    const attempt = crossAttempt(config, state, boat[0], boat[1]);
    if (!attempt) return;
    const loaded = boat;
    setPhase({ kind: 'sailing', boat: loaded, ...attempt });
    later(SAIL_MS, () => {
      if (!attempt.unsafe.some(Boolean)) {
        setBoat([0, 0]);
        setState(attempt.next);
        return;
      }
      setPhase({ kind: 'brawl', boat: loaded, ...attempt });
      playSfx('brawl');
      later(BRAWL_MS, () => setPhase({ kind: 'undo', boat: loaded, ...attempt }));
    });
  };
  const undo = () => {
    if (phase.kind === 'idle') return;
    playSfx('select');
    setBoat(phase.boat);
    setPhase({ kind: 'idle' });
  };

  const bank = (isLeft: boolean) => {
    const c = counts(isLeft);
    const boatHere = !busy && state.boatLeft === isLeft;
    const side = isLeft ? 0 : 1;
    const fight = phase.kind !== 'idle' && phase.kind !== 'sailing' && phase.unsafe[side];
    return (
      <div className={`cross-bank ${boatHere ? 'boat-here' : ''}`}>
        <div className="cross-bank-name">{config.banks[side]}</div>
        {[0, 1].map((kind) => (
          <div key={kind} className="cross-group">
            {kind === 1 && fight && phase.kind === 'undo'
              ? Array.from({ length: c[kind] }, (_, i) => <span key={i} className="cross-fluff" aria-hidden="true" />)
              : Array.from({ length: c[kind] }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className="cross-animal"
                    aria-label={`${labels[kind]} einsteigen`}
                    disabled={!boatHere || disabled}
                    onClick={() => board(kind)}
                  >
                    <AssetImage id={SPRITES[kind]} w={32} h={32} />
                  </button>
                ))}
          </div>
        ))}
        {fight && phase.kind === 'brawl' && <Brawl />}
      </div>
    );
  };

  const boatW = config.capacity * 32 + 4;
  const fightBank = phase.kind === 'undo' ? config.banks[phase.unsafe[0] ? 0 : 1] : '';

  return (
    <div className="engine-center cross">
      <div className="cross-scene">
        {bank(true)}
        <div className="cross-lake">
          <div className="cross-water">
            <div
              className={`cross-boat ${phase.kind === 'sailing' ? 'sailing' : ''}`}
              style={{ width: boatW, left: boatLeft ? '0px' : `calc(100% - ${boatW}px)`, transitionDuration: phase.kind === 'sailing' ? `${SAIL_MS}ms` : '0ms' }}
            >
              {[0, 1].flatMap((kind) =>
                Array.from({ length: cargo[kind] }, (_, i) => (
                  <button key={`${kind}${i}`} type="button" className="cross-animal" aria-label={`${labels[kind]} aussteigen`} disabled={busy} onClick={() => leave(kind)}>
                    <AssetImage id={SPRITES[kind]} w={32} h={32} />
                  </button>
                )),
              )}
              {cargo[0] + cargo[1] === 0 && <span className="cross-empty">Boot</span>}
            </div>
          </div>
          <PixelButton small disabled={disabled || busy || aboard === 0} onClick={sail}>
            Ablegen
          </PixelButton>
        </div>
        {bank(false)}
        {phase.kind === 'undo' && (
          <div className="cross-popup" role="dialog" aria-label="Regelbruch">
            <p>
              Autsch! Am {fightBank} waren die {labels[0]} in der Überzahl. Von den {labels[1]} ist nur Fell übrig.
            </p>
            <PixelButton variant="wax" onClick={undo}>
              Zug rückgängig machen
            </PixelButton>
          </div>
        )}
      </div>
      <div className="engine-status">
        {phase.kind === 'sailing'
          ? 'Das Boot legt ab …'
          : phase.kind === 'brawl'
            ? 'Gerangel!'
            : `Fahrten: ${state.moves} · Boot für ${config.capacity}`}
      </div>
    </div>
  );
}

/** The cartoon scuffle: a bouncing dust cloud with limbs, feathers and swear symbols. */
function Brawl() {
  return (
    <div className="brawl" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={`brawl-puff p${i}`} />
      ))}
      <span className="brawl-bit b0">
        <AssetImage id="puzzle.hippogriff" w={16} h={16} />
      </span>
      <span className="brawl-bit b1">
        <AssetImage id="puzzle.ferret" w={16} h={16} />
      </span>
      <span className="brawl-bit b2">
        <AssetImage id="puzzle.hippogriff" w={16} h={16} />
      </span>
      {['★', '#!', '@', '✶'].map((s, i) => (
        <span key={i} className={`brawl-sym s${i}`}>
          {s}
        </span>
      ))}
    </div>
  );
}

export const crossEngine: Engine<CrossState> = { logic: crossLogic, Component: CrossEngine, submit: 'check', autoSolve: () => true };
