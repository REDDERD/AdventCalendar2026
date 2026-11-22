import { AssetImage } from '../../ui/AssetImage';
import { toggleCell, toggleLogic, type ToggleConfig, type ToggleState } from '../logic/toggle';
import type { Engine, EngineProps } from './types';

const CELL_MAX = 72;

function ToggleEngine({ puzzle, state, setState, disabled }: EngineProps<ToggleState>) {
  const config = puzzle.config as ToggleConfig;
  const cell = Math.min(CELL_MAX, Math.floor(232 / config.cols));
  return (
    <div className="engine-center">
      <div className="toggle-grid" style={{ gridTemplateColumns: `repeat(${config.cols}, ${cell}px)`, gridAutoRows: cell }}>
        {state.map((on, i) => (
          <button
            key={i}
            type="button"
            className={`toggle-cell ${on ? 'on' : 'off'}`}
            aria-label={`Feld ${i + 1}`}
            aria-pressed={on}
            disabled={disabled}
            onClick={() => setState(toggleCell(config, state, i))}
          >
            {config.sprites ? (
              <AssetImage id={on ? config.sprites.on : config.sprites.off} w={cell - 8} h={cell - 8} />
            ) : (
              <span className="toggle-lamp" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export const toggleEngine: Engine<ToggleState> = { logic: toggleLogic, Component: ToggleEngine, submit: 'check', autoSolve: () => true };
