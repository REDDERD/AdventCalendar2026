import { AssetImage } from '../../ui/AssetImage';
import { MARK_RADIUS, maxMarks, tapLogic, toggleMark, type TapConfig, type TapState } from '../logic/tap';
import { useLocalPoint } from './pointer';
import type { Engine, EngineProps } from './types';

function TapEngine({ puzzle, state, setState, disabled }: EngineProps<TapState>) {
  const config = puzzle.config as TapConfig;
  const { ref, toLocal } = useLocalPoint<HTMLDivElement>();
  return (
    <div className="engine-center">
      <div
        ref={ref}
        className="tap-picture"
        role="img"
        aria-label="Bild zum Antippen"
        style={{ width: 256, height: config.height }}
        onClick={(e) => {
          if (disabled) return;
          const p = toLocal(e);
          setState(toggleMark(puzzle, state, p.x, p.y));
        }}
      >
        <AssetImage id={config.image} w={256} h={config.height} />
        {state.map((m, i) => (
          <span
            key={i}
            className="tap-mark"
            style={{ left: m.x - MARK_RADIUS, top: m.y - MARK_RADIUS, width: MARK_RADIUS * 2, height: MARK_RADIUS * 2 }}
          />
        ))}
      </div>
      <div className="engine-status">
        Markiert: {state.length} / {maxMarks(puzzle)}
      </div>
    </div>
  );
}

export const tapEngine: Engine<TapState> = { logic: tapLogic, Component: TapEngine, submit: 'check' };
