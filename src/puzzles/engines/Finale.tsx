import { useEffect } from 'react';
import { playSfx } from '../../audio/AudioService';
import { useStore } from '../../core/store';
import { finaleLogic, finaleStart, GEAR_SLOTS, placeGear, type FinaleConfig, type FinaleState, type GearSlot } from '../logic/finale';
import type { Engine, EngineProps } from './types';

const NAMES: Record<GearSlot, string> = { w1: 'Rad W1', p2: 'Ritzel P2', w2: 'Rad W2' };

/** Radius of a gear with `teeth` teeth in the drawing. */
const radius = (teeth: number) => 5 + teeth * 0.5;

function Gear({ cx, cy, teeth, gold, empty, label, labelAtTop }: { cx: number; cy: number; teeth: number; gold?: boolean; empty?: boolean; label: string; labelAtTop?: boolean }) {
  const r = radius(teeth);
  const shown = Math.min(teeth, 36); // keep big gears readable
  const fill = empty ? 'none' : gold ? '#f2d675' : '#a8802a';
  const stroke = empty ? '#7a7788' : '#5a3a1c';
  return (
    <g>
      {!empty &&
        Array.from({ length: shown }, (_, k) => {
          const a = (k / shown) * Math.PI * 2;
          return <rect key={k} x={cx + Math.cos(a) * r - 2} y={cy + Math.sin(a) * r - 2} width={4} height={4} fill={fill} stroke={stroke} strokeWidth={0.5} />;
        })}
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={1.5} strokeDasharray={empty ? '3 3' : undefined} />
      <circle cx={cx} cy={cy} r={2.5} fill="#3b2414" />
      <text x={cx} y={labelAtTop ? cy - r + 12 : cy + 5} textAnchor="middle" className="finale-teeth">
        {label}
      </text>
    </g>
  );
}

/**
 * `custom:finale`: pick a gear for each free slot. The drawing shows the train:
 * pinion P (minute hand) → W1, P2 on W1's axle → W2 (hour hand). Fixed slots
 * (the golden gear no. 12) and the slot pre-set by Theo's wrench cannot change.
 */
function FinaleEngine({ puzzle, state, setState, disabled }: EngineProps<FinaleState>) {
  const config = puzzle.config as FinaleConfig;
  const items = useStore((s) => s.save?.vars.items);
  const wrench = Array.isArray(items) && items.includes('theo_wrench') && Object.keys(config.wrench).length > 0;

  // Theo's wrench: the pre-set gear is in place from the start (and after "Zurücksetzen")
  useEffect(() => {
    if (!wrench) return;
    const start = finaleStart(config, true);
    if (GEAR_SLOTS.some((s) => config.wrench[s] !== undefined && state[s] !== start[s])) setState({ ...state, ...start });
  }, [wrench, state, config, setState]);

  const pick = (slot: GearSlot, teeth: number) => {
    if (disabled) return;
    const next = placeGear(config, state, slot, teeth, wrench);
    if (next !== state) {
      playSfx('select');
      setState(next);
    }
  };

  // layout: P left, W1 meshing with it, P2 drawn in front of W1, W2 meshing with P2
  const rP = radius(config.pinion);
  const rW1 = radius(state.w1 ?? 30);
  const rP2 = radius(state.p2 ?? 18);
  const rW2 = radius(state.w2 ?? 40);
  const cy = 62;
  const xP = 8 + rP;
  const xW1 = xP + rP + rW1;
  const xW2 = Math.min(248 - rW2, xW1 + rP2 + rW2);
  const locked = (slot: GearSlot) => config.fixed[slot] !== undefined || (wrench && config.wrench[slot] !== undefined);

  return (
    <div className="engine-center finale">
      <svg className="finale-train" viewBox="0 0 256 124" width={256} height={124} role="img" aria-label="Das Getriebe">
        <Gear cx={xP} cy={cy} teeth={config.pinion} label={String(config.pinion)} />
        <Gear cx={xW1} cy={cy} teeth={state.w1 ?? 30} empty={state.w1 === null} label={state.w1 ? String(state.w1) : 'W1'} labelAtTop />
        <Gear cx={xW1} cy={cy} teeth={state.p2 ?? 18} gold={config.fixed.p2 !== undefined} empty={state.p2 === null} label={state.p2 ? String(state.p2) : 'P2'} />
        <Gear cx={xW2} cy={cy} teeth={state.w2 ?? 40} empty={state.w2 === null} label={state.w2 ? String(state.w2) : 'W2'} />
        <text x={xP} y={118} textAnchor="middle" className="finale-caption">Minuten</text>
        <text x={xW2} y={118} textAnchor="middle" className="finale-caption">Stunden</text>
      </svg>
      <div className="finale-slots">
        {GEAR_SLOTS.map((slot) => (
          <div key={slot} className="finale-slot">
            <span className="finale-slot-name">{NAMES[slot]}</span>
            {locked(slot) ? (
              <span className="finale-locked">
                {state[slot]} Zähne · {config.fixed[slot] !== undefined ? 'das goldene Zahnrad Nr. 12' : 'Theos Schlüssel hat es eingesetzt'}
              </span>
            ) : (
              <div className="finale-options" role="radiogroup" aria-label={NAMES[slot]}>
                {config.slots[slot].map((teeth) => (
                  <button
                    key={teeth}
                    type="button"
                    role="radio"
                    aria-checked={state[slot] === teeth}
                    aria-label={`${NAMES[slot]}: ${teeth} Zähne`}
                    className={`finale-option ${state[slot] === teeth ? 'selected' : ''}`}
                    disabled={disabled}
                    onClick={() => pick(slot, teeth)}
                  >
                    {teeth}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export const finaleEngine: Engine<FinaleState> = { logic: finaleLogic, Component: FinaleEngine, submit: 'check' };
