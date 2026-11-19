import { useEffect, useRef, useState } from 'react';
import { playSfx } from '../../audio/AudioService';
import { AssetImage } from '../../ui/AssetImage';
import { PixelButton } from '../../ui/PixelButton';
import { nimLogic, opponentMove, take, type NimConfig, type NimState } from '../logic/nim';
import type { Engine, EngineProps } from './types';

const COLORS = ['puzzle.cracker.red', 'puzzle.cracker.green', 'puzzle.cracker.blue', 'puzzle.cracker.red'];
const THINK_MS = 800;
const RESTART_MS = 1800;

/**
 * `custom:nim`: tap a cracker to take it and every cracker to its right, then
 * "Nehmen". The opponents answer after a short pause. The game reports itself:
 * a win solves the puzzle, a loss counts as a wrong attempt and the heaps reset.
 */
function NimEngine({ puzzle, state, setState, disabled, onSubmit }: EngineProps<NimState>) {
  const config = puzzle.config as NimConfig;
  const [pick, setPick] = useState<{ heap: number; from: number } | null>(null);
  const [thinking, setThinking] = useState(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const opponentMoves = state.log.filter((m) => m.by === 'opponent').length;
  const nameOf = (k: number) => config.opponents[k % config.opponents.length];
  const last = state.log[state.log.length - 1];
  const busy = disabled || thinking || !!state.winner;

  const finish = (end: NimState) => {
    onSubmit(end);
    if (end.winner === 'opponent') later(RESTART_MS, () => setState(nimLogic.initial(puzzle)));
  };

  const confirm = () => {
    if (!pick || busy) return;
    const after = take(state, 'player', pick.heap, state.heaps[pick.heap] - pick.from);
    setPick(null);
    if (!after) return;
    playSfx('select');
    setState(after);
    if (after.winner) return finish(after);
    setThinking(true);
    later(THINK_MS, () => {
      const reply = opponentMove(after.heaps);
      const next = take(after, 'opponent', reply.heap, reply.count)!;
      playSfx('blip');
      setThinking(false);
      setState(next);
      if (next.winner) finish(next);
    });
  };

  let status: string;
  if (state.winner === 'player') status = 'Du hast das letzte Knallbonbon!';
  else if (state.winner === 'opponent') status = `${nameOf(opponentMoves - 1)} nimmt das letzte. Neue Partie …`;
  else if (thinking) status = `${nameOf(opponentMoves)} überlegt …`;
  else if (pick) status = `${state.heaps[pick.heap] - pick.from} aus Haufen ${pick.heap + 1} nehmen?`;
  else if (last?.by === 'opponent') status = `${nameOf(opponentMoves - 1)} nimmt ${last.count} aus Haufen ${last.heap + 1}. Du bist dran.`;
  else status = 'Du bist dran: Tippe ein Bonbon an.';

  return (
    <div className="engine-center nim">
      <div className="nim-heaps">
        {state.heaps.map((count, heap) => (
          <div key={heap} className="nim-heap">
            <span className="nim-label">{heap + 1}</span>
            <div className="nim-row">
              {Array.from({ length: count }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`nim-cracker ${pick?.heap === heap && i >= pick.from ? 'picked' : ''}`}
                  aria-label={`Haufen ${heap + 1}, ab Bonbon ${i + 1} nehmen`}
                  disabled={busy}
                  onClick={() => setPick(pick?.heap === heap && pick.from === i ? null : { heap, from: i })}
                >
                  <AssetImage id={COLORS[heap]} w={32} h={16} />
                </button>
              ))}
              {count === 0 && <span className="nim-empty">leer</span>}
            </div>
          </div>
        ))}
      </div>
      <PixelButton small disabled={busy || !pick} onClick={confirm}>
        Nehmen
      </PixelButton>
      <div className="engine-status">{status}</div>
    </div>
  );
}

export const nimEngine: Engine<NimState> = { logic: nimLogic, Component: NimEngine, submit: 'direct' };
