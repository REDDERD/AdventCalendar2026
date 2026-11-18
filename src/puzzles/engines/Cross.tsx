import { useState } from 'react';
import { AssetImage } from '../../ui/AssetImage';
import { PixelButton } from '../../ui/PixelButton';
import { crossLogic, crossOver, type CrossConfig, type CrossState } from '../logic/cross';
import type { Engine, EngineProps } from './types';

const SPRITES = ['puzzle.hippogriff', 'puzzle.ferret'] as const;

/**
 * `custom:cross`: tap animals on the boat's bank to board (up to the capacity),
 * tap them in the boat to step out again, then "Ablegen".
 */
function CrossEngine({ puzzle, state, setState, disabled }: EngineProps<CrossState>) {
  const config = puzzle.config as CrossConfig;
  const [boat, setBoat] = useState<[number, number]>([0, 0]);
  const [refused, setRefused] = useState(false);
  const total = [config.predators.count, config.prey.count];
  const right: [number, number] = [total[0] - state.left[0], total[1] - state.left[1]];
  const labels = [config.predators.label, config.prey.label];
  const aboard = boat[0] + boat[1];

  const bankFor = (isLeft: boolean) => {
    const counts = isLeft ? state.left : right;
    const boatHere = state.boatLeft === isLeft;
    return [0, 1].map((kind) => (boatHere ? counts[kind] - boat[kind] : counts[kind]));
  };

  const board = (kind: number) => {
    if (disabled || aboard >= config.capacity) return;
    const next: [number, number] = [...boat];
    next[kind]++;
    setBoat(next);
  };
  const leave = (kind: number) => {
    const next: [number, number] = [...boat];
    next[kind]--;
    setBoat(next);
  };
  const sail = () => {
    const next = crossOver(config, state, boat[0], boat[1]);
    setBoat([0, 0]);
    if (next) setState(next);
    else {
      setRefused(true);
      setTimeout(() => setRefused(false), 900);
    }
  };

  const bank = (isLeft: boolean) => {
    const counts = bankFor(isLeft);
    const boatHere = state.boatLeft === isLeft;
    return (
      <div className={`cross-bank ${boatHere ? 'boat-here' : ''}`}>
        <div className="cross-bank-name">{config.banks[isLeft ? 0 : 1]}</div>
        {[0, 1].map((kind) => (
          <div key={kind} className="cross-group">
            {Array.from({ length: counts[kind] }, (_, i) => (
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
      </div>
    );
  };

  return (
    <div className="engine-center cross">
      <div className="cross-scene">
        {bank(true)}
        <div className={`cross-lake ${state.boatLeft ? 'left' : 'right'}`}>
          <div className={`cross-boat ${refused ? 'refused' : ''}`}>
            {[0, 1].flatMap((kind) =>
              Array.from({ length: boat[kind] }, (_, i) => (
                <button key={`${kind}${i}`} type="button" className="cross-animal" aria-label={`${labels[kind]} aussteigen`} onClick={() => leave(kind)}>
                  <AssetImage id={SPRITES[kind]} w={32} h={32} />
                </button>
              )),
            )}
            {aboard === 0 && <span className="cross-empty">Boot</span>}
          </div>
          <PixelButton small disabled={disabled || aboard === 0} onClick={sail}>
            Ablegen
          </PixelButton>
        </div>
        {bank(false)}
      </div>
      <div className="engine-status">
        {refused ? 'Überzahl! Die Federn fliegen – zurück ans Ufer.' : `Fahrten: ${state.moves} · Boot für ${config.capacity}`}
      </div>
    </div>
  );
}

export const crossEngine: Engine<CrossState> = { logic: crossLogic, Component: CrossEngine, submit: 'check' };
