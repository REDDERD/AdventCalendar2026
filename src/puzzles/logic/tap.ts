import { z } from 'zod';
import type { Puzzle } from '../schema';
import { result, type EngineLogic } from './types';

/**
 * `tap`: mark places in a picture. Marks can go anywhere (so wrong spots don't
 * give the answer away); solved when every solution target holds exactly one
 * mark and no mark lies outside them.
 */
export const tapConfig = z.object({
  image: z.string(),
  /** Picture height in play-area pixels (width is always 256). */
  height: z.number().int().min(64).max(320).default(256),
  targets: z
    .array(
      z.object({
        id: z.string().min(1),
        x: z.number().min(0),
        y: z.number().min(0),
        w: z.number().min(8),
        h: z.number().min(8),
      }),
    )
    .min(1),
  /** How many marks may be set; default: as many as the solution has. */
  maxMarks: z.number().int().min(1).optional(),
});
export type TapConfig = z.infer<typeof tapConfig>;

export type TapMark = { x: number; y: number };
export type TapState = TapMark[];

/** Tapping near an existing mark removes it. */
export const MARK_RADIUS = 10;

export function maxMarks(puzzle: Puzzle): number {
  return (puzzle.config as TapConfig).maxMarks ?? (puzzle.solution as string[]).length;
}

/** Set or remove a mark. More marks than allowed is a rule violation and changes nothing. */
export function toggleMark(puzzle: Puzzle, state: TapState, x: number, y: number): TapState {
  const near = state.findIndex((m) => Math.hypot(m.x - x, m.y - y) <= MARK_RADIUS);
  if (near >= 0) return state.filter((_, i) => i !== near);
  const { height } = puzzle.config as TapConfig;
  if (x < 0 || y < 0 || x > 256 || y > height) return state;
  if (state.length >= maxMarks(puzzle)) return state;
  return [...state, { x, y }];
}

export function targetAt(config: TapConfig, mark: TapMark): string | null {
  const t = config.targets.find((t) => mark.x >= t.x && mark.x <= t.x + t.w && mark.y >= t.y && mark.y <= t.y + t.h);
  return t?.id ?? null;
}

export const tapLogic: EngineLogic<TapState> = {
  config: tapConfig,
  /** Ids of the targets that must be marked. */
  solution: z.array(z.string()).min(1),
  initial: () => [],
  check: (puzzle, marks) => {
    const config = puzzle.config as TapConfig;
    const wanted = puzzle.solution as string[];
    const hits = marks.map((m) => targetAt(config, m));
    if (hits.some((id) => !id || !wanted.includes(id))) return false;
    return wanted.every((id) => hits.filter((h) => h === id).length === 1);
  },
  describe: (puzzle, marks) =>
    marks.map((m) => targetAt(puzzle.config as TapConfig, m) ?? `${Math.round(m.x)}/${Math.round(m.y)}`).join(',') || '–',
  verify: (puzzle: Puzzle) => {
    const config = puzzle.config as TapConfig;
    const wanted = puzzle.solution as string[];
    const errors: string[] = [];
    const ids = config.targets.map((t) => t.id);
    if (new Set(ids).size !== ids.length) errors.push('target ids must be unique');
    for (const id of wanted) if (!ids.includes(id)) errors.push(`unknown target ${id}`);
    if (new Set(wanted).size !== wanted.length) errors.push('solution lists a target twice');
    for (const t of config.targets) {
      if (t.x + t.w > 256 || t.y + t.h > config.height) errors.push(`target ${t.id} lies outside the picture`);
      if (t.w < 20 || t.h < 20) errors.push(`target ${t.id} is smaller than 20 × 20 [UI-4]`);
    }
    if (maxMarks(puzzle) < wanted.length) errors.push('maxMarks is smaller than the solution');
    return result(errors, [`${wanted.length} of ${ids.length} targets`]);
  },
};
