import { useState } from 'react';
import { pour, pourLogic, type PourConfig, type PourState } from '../logic/pour';
import type { Engine, EngineProps } from './types';

/** Logical pixels per unit of liquid. */
const UNIT = 14;

/** `custom:pour`: tap the bottle to pour from, then the bottle to pour into. */
function PourEngine({ puzzle, state, setState, disabled }: EngineProps<PourState>) {
  const config = puzzle.config as PourConfig;
  const [from, setFrom] = useState<number | null>(null);
  const [refused, setRefused] = useState<number | null>(null);

  const tap = (i: number) => {
    if (from === null) {
      if (state.levels[i] > 0) setFrom(i);
      return;
    }
    if (from === i) return setFrom(null);
    const next = pour(config, state, from, i);
    setFrom(null);
    if (next) setState(next);
    else {
      setRefused(i);
      setTimeout(() => setRefused(null), 400);
    }
  };

  return (
    <div className="engine-center">
      <div className="bottles">
        {config.capacities.map((cap, i) => (
          <button
            key={i}
            type="button"
            className={`bottle-btn ${from === i ? 'selected' : ''} ${refused === i ? 'refused' : ''}`}
            aria-label={`${config.labels?.[i] ?? `Flasche ${i + 1}`}: ${state.levels[i]} von ${cap}`}
            aria-pressed={from === i}
            disabled={disabled}
            onClick={() => tap(i)}
          >
            <span className="bottle-neck" />
            <span className="bottle" style={{ height: cap * UNIT + 4 }}>
              <span className="liquid" style={{ height: state.levels[i] * UNIT }} />
              {Array.from({ length: cap - 1 }, (_, k) => (
                <span key={k} className="bottle-mark" style={{ bottom: (k + 1) * UNIT + 2 }} />
              ))}
            </span>
            <span className="bottle-label">
              {state.levels[i]}/{cap}
            </span>
          </button>
        ))}
      </div>
      <div className="engine-status">
        {from === null ? 'Woraus gießen?' : 'Wohinein?'} · Züge: {state.moves}
      </div>
    </div>
  );
}

export const pourEngine: Engine<PourState> = { logic: pourLogic, Component: PourEngine, submit: 'check' };
