import { z } from 'zod';
import type { Puzzle } from '../schema';
import { result, type EngineLogic } from './types';

/**
 * `custom:finale` (day 24): a two-stage gear train. The pinion P on the minute
 * hand drives wheel W1; pinion P2 on the same axle drives wheel W2 on the hour
 * hand. The clock strikes when (W1 / P) × (W2 / P2) equals the ratio (12 : 1).
 * Each slot offers a few gears; a slot can be fixed (the golden gear no. 12) or
 * pre-set by Theo's wrench (`theo_wrench`, one step less).
 */
const slot = z.array(z.number().int().min(4).max(96)).min(1).max(6);
export const finaleConfig = z.object({
  component: z.literal('finale'),
  pinion: z.number().int().min(4).max(24),
  ratio: z.number().int().min(2).max(24),
  slots: z.object({ w1: slot, p2: slot, w2: slot }),
  /** Slots that cannot change, e.g. { p2: 12 } – the golden gear as the hinge. */
  fixed: z.record(z.string(), z.number().int()).default({}),
  /** With Theo's wrench this slot is already in place. */
  wrench: z.record(z.string(), z.number().int()).default({}),
});
export type FinaleConfig = z.infer<typeof finaleConfig>;

export type GearSlot = 'w1' | 'p2' | 'w2';
export const GEAR_SLOTS: GearSlot[] = ['w1', 'p2', 'w2'];
export type FinaleState = Record<GearSlot, number | null>;

export const finaleSolution = z.object({ w1: z.number().int(), p2: z.number().int(), w2: z.number().int() });

/** Exact check of (w1 / pinion) × (w2 / p2) = ratio, without floating point. */
export function strikes(config: FinaleConfig, gears: { w1: number; p2: number; w2: number }): boolean {
  return gears.w1 * gears.w2 === config.ratio * config.pinion * gears.p2;
}

/** The start state; with the wrench the pre-set slot is filled as well. */
export function finaleStart(config: FinaleConfig, withWrench = false): FinaleState {
  const state: FinaleState = { w1: null, p2: null, w2: null };
  for (const s of GEAR_SLOTS) {
    if (config.fixed[s] !== undefined) state[s] = config.fixed[s];
    else if (withWrench && config.wrench[s] !== undefined) state[s] = config.wrench[s];
  }
  return state;
}

/** Put a gear into a slot; fixed slots, unknown gears and (with the wrench) the pre-set slot refuse. */
export function placeGear(config: FinaleConfig, state: FinaleState, slotId: GearSlot, teeth: number, withWrench = false): FinaleState {
  if (config.fixed[slotId] !== undefined) return state;
  if (withWrench && config.wrench[slotId] !== undefined) return state;
  if (!config.slots[slotId].includes(teeth)) return state;
  return { ...state, [slotId]: state[slotId] === teeth ? null : teeth };
}

/** All gear combinations that strike, given the fixed (and optionally pre-set) slots. */
export function strikingCombinations(config: FinaleConfig, withWrench = false): Array<{ w1: number; p2: number; w2: number }> {
  const start = finaleStart(config, withWrench);
  const choices = (s: GearSlot) => (start[s] !== null ? [start[s]!] : config.slots[s]);
  const out: Array<{ w1: number; p2: number; w2: number }> = [];
  for (const w1 of choices('w1')) for (const p2 of choices('p2')) for (const w2 of choices('w2')) {
    if (strikes(config, { w1, p2, w2 })) out.push({ w1, p2, w2 });
  }
  return out;
}

export const finaleLogic: EngineLogic<FinaleState> = {
  config: finaleConfig,
  solution: finaleSolution,
  initial: (puzzle) => finaleStart(puzzle.config as FinaleConfig),
  check: (puzzle, state) => {
    const config = puzzle.config as FinaleConfig;
    if (state.w1 === null || state.p2 === null || state.w2 === null) return false;
    return strikes(config, { w1: state.w1, p2: state.p2, w2: state.w2 });
  },
  describe: (_puzzle, state) => `W1 ${state.w1 ?? '–'} · P2 ${state.p2 ?? '–'} · W2 ${state.w2 ?? '–'}`,
  verify: (puzzle: Puzzle) => {
    const config = puzzle.config as FinaleConfig;
    const solution = puzzle.solution as { w1: number; p2: number; w2: number };
    const errors: string[] = [];
    for (const s of GEAR_SLOTS) {
      if (config.fixed[s] === undefined && !config.slots[s].includes(solution[s])) errors.push(`solution gear ${s} = ${solution[s]} is not offered`);
      if (config.fixed[s] !== undefined && config.fixed[s] !== solution[s]) errors.push(`fixed gear ${s} differs from the solution`);
      if (config.wrench[s] !== undefined && config.wrench[s] !== solution[s]) errors.push(`the wrench pre-sets a wrong ${s}`);
    }
    const all = strikingCombinations(config);
    if (all.length !== 1) errors.push(`${all.length} gear combinations strike, expected exactly 1`);
    const total = GEAR_SLOTS.reduce((n, s) => n * (config.fixed[s] !== undefined ? 1 : config.slots[s].length), 1);
    return result(errors, [`1 of ${total} combinations strikes`, `with the wrench: ${strikingCombinations(config, true).length} striking`]);
  },
};
