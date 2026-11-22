import { AssetImage } from '../../ui/AssetImage';
import { slideLogic, slideTile, type SlideConfig, type SlideState } from '../logic/slide';
import type { Engine, EngineProps } from './types';

const TILE = 72;

function SlideEngine({ puzzle, state, setState, disabled }: EngineProps<SlideState>) {
  const { size, image } = puzzle.config as SlideConfig;
  // Tiles keep their key, so they glide to the new place.
  const places = new Map(state.map((tile, place) => [tile, place]));
  const tiles = [...places.keys()].filter((t) => t !== 0).sort((a, b) => a - b);
  return (
    <div className="engine-center">
      <div className="slide-board" style={{ width: size * TILE + 4, height: size * TILE + 4 }}>
        {tiles.map((tile) => {
          const place = places.get(tile)!;
          return (
            <button
              key={tile}
              type="button"
              className="slide-tile"
              aria-label={`Teil ${tile}`}
              disabled={disabled}
              style={{ left: 2 + (place % size) * TILE, top: 2 + Math.floor(place / size) * TILE }}
              onClick={() => setState(slideTile(size, state, place))}
            >
              {image ? <AssetImage id={image} w={TILE - 2} h={TILE - 2} frame={tile - 1} /> : <span>{tile}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const slideEngine: Engine<SlideState> = { logic: slideLogic, Component: SlideEngine, submit: 'check', autoSolve: () => true };
