import { useEffect, useRef, useState } from 'react';
import { playSfx } from '../../audio/AudioService';
import { AssetImage } from '../../ui/AssetImage';
import { PixelButton } from '../../ui/PixelButton';
import {
  clearPans,
  coinsOn,
  cycleCoin,
  nameCoin,
  resultText,
  weigh,
  weighLogic,
  type WeighConfig,
  type WeighResult,
  type WeighState,
} from '../logic/weigh';
import type { Engine, EngineProps } from './types';

const RESTART_MS = 1800;
/** Beam: pivot on the post, ends 76 px from it; tilt in degrees when one pan is lighter. */
const PIVOT = { x: 128, y: 34 };
const ARM = 76;
const TILT = 12;
const PAN_W = 100;

/** Positive angle = clockwise = right end down = the left pan is lighter. */
const ANGLE: Record<WeighResult, number> = { left_up: TILT, right_up: -TILT, even: 0 };

/** `custom:weigh`: tap coins onto the pans, weigh, then name the light one. A wrong name restarts the game. */
function WeighEngine({ puzzle, state, setState, disabled, onSubmit }: EngineProps<WeighState>) {
  const config = puzzle.config as WeighConfig;
  const [naming, setNaming] = useState(false);
  const [pick, setPick] = useState<number | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const left = coinsOn(state, 'left');
  const right = coinsOn(state, 'right');
  const last = state.log[state.log.length - 1];
  const angle = state.weighed && last ? ANGLE[last.result] : 0;
  const rad = (angle * Math.PI) / 180;
  const endY = (sign: 1 | -1) => PIVOT.y + sign * Math.sin(rad) * ARM;
  const endX = (sign: 1 | -1) => PIVOT.x + sign * Math.cos(rad) * ARM;
  const weighingsLeft = config.weighings - state.log.length;
  const busy = disabled || state.outcome !== 'open';
  const canWeigh = !busy && !state.weighed && weighingsLeft > 0 && left.length > 0 && left.length === right.length;

  const tapCoin = (coin: number) => {
    if (busy) return;
    if (naming) return setPick(pick === coin ? null : coin);
    const next = cycleCoin(state, coin);
    if (next !== state) {
      playSfx('select');
      setState(next);
    }
  };

  const doWeigh = () => {
    const next = weigh(config, state);
    if (!next) return;
    playSfx('blip');
    setState(next);
  };

  const confirmName = () => {
    if (pick === null) return;
    const end = nameCoin(state, pick);
    if (!end) return;
    setNaming(false);
    setPick(null);
    setState(end);
    onSubmit(end);
    if (end.outcome === 'lost') timer.current = window.setTimeout(() => setState(weighLogic.initial(puzzle)), RESTART_MS);
  };

  let status: string;
  if (state.outcome === 'won') status = 'Das ist der Schokotaler!';
  else if (state.outcome === 'lost') status = 'Nein, den hätte die Waage nicht verraten. Neue Runde …';
  else if (naming) status = pick === null ? 'Welche Münze ist leichter? Tippe sie an.' : `Münze ${pick + 1} benennen?`;
  else if (state.weighed && last) status = `${resultText(last.result)}. Räum die Schalen ab.`;
  else if (left.length !== right.length) status = 'In beiden Schalen müssen gleich viele Münzen liegen.';
  else if (weighingsLeft === 0) status = 'Die Waage klemmt. Benenne die leichte Münze.';
  else status = 'Tippe Münzen an: Ablage, links, rechts.';

  const coinButton = (coin: number, where: 'tray' | 'pan') => (
    <button
      key={coin}
      type="button"
      className={`weigh-coin ${where === 'pan' ? 'in-pan' : ''} ${pick === coin ? 'picked' : ''}`}
      aria-label={`Münze ${coin + 1}`}
      disabled={busy}
      onClick={() => tapCoin(coin)}
    >
      <AssetImage id="puzzle.coin" w={24} h={24} />
      <span className="weigh-num">{coin + 1}</span>
    </button>
  );

  const pan = (side: 'left' | 'right', coins: number[]) => {
    const sign = side === 'left' ? -1 : 1;
    return (
      <div className="weigh-pan" style={{ left: endX(sign) - PAN_W / 2, top: endY(sign), width: PAN_W }}>
        <AssetImage id="puzzle.scale.pan" w={PAN_W} h={48} />
        <div className="weigh-pan-coins">{coins.map((c) => coinButton(c, 'pan'))}</div>
      </div>
    );
  };

  return (
    <div className="engine-center weigh">
      <div className="weigh-stage" style={{ width: 256, height: 112 }}>
        <AssetImage id="puzzle.scale.stand" w={64} h={84} className="weigh-stand" />
        <div className="weigh-beam" style={{ transform: `rotate(${angle}deg)`, left: PIVOT.x - 88, top: PIVOT.y - 6 }}>
          <AssetImage id="puzzle.scale.beam" w={176} h={12} />
        </div>
        {pan('left', left)}
        {pan('right', right)}
      </div>
      <div className="weigh-tray">{state.sides.map((side, coin) => (side === 'tray' ? coinButton(coin, 'tray') : <span key={coin} className="weigh-gap" />))}</div>
      <div className="weigh-buttons">
        {naming ? (
          <>
            <PixelButton small disabled={busy || pick === null} onClick={confirmName}>
              Das ist sie!
            </PixelButton>
            <PixelButton
              small
              onClick={() => {
                setNaming(false);
                setPick(null);
              }}
            >
              Zurück
            </PixelButton>
          </>
        ) : (
          <>
            {state.weighed ? (
              <PixelButton small disabled={busy} onClick={() => setState(clearPans(state))}>
                Abräumen
              </PixelButton>
            ) : (
              <PixelButton small disabled={!canWeigh} onClick={doWeigh}>
                Wiegen
              </PixelButton>
            )}
            <PixelButton small disabled={busy} onClick={() => setNaming(true)}>
              Benennen
            </PixelButton>
          </>
        )}
      </div>
      <div className="weigh-log" aria-label="Protokoll">
        {state.log.map((e, i) => (
          <div key={i}>
            {i + 1}. {e.left.map((c) => c + 1).join(' ')} | {e.right.map((c) => c + 1).join(' ')} · {resultText(e.result)}
          </div>
        ))}
      </div>
      <div className="engine-status">
        Wägungen: {state.log.length} von {config.weighings} · {status}
      </div>
    </div>
  );
}

export const weighEngine: Engine<WeighState> = { logic: weighLogic, Component: WeighEngine, submit: 'direct' };
