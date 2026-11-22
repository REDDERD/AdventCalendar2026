import { z } from 'zod';
import { CLUES } from '../../content/catalog';
import type { Puzzle } from '../schema';
import { result, type EngineLogic } from './types';

/**
 * `custom:accuse` (day 23): a pinboard with the clue cards. Part 1: give every
 * suspect the one card that clears them. Part 2: mark every card that points
 * to the culprit. Cards that explain neither stay where they are. Missing clues
 * are shown as Quill's notes, so the puzzle never locks [DEC-3].
 */
export const accuseConfig = z.object({
  component: z.literal('accuse'),
  suspects: z.array(z.object({ id: z.string().min(1), label: z.string().min(1) })).min(1).max(4),
  /** Clue ids (Section 8.3); the text comes from the catalog. */
  cards: z.array(z.string().min(1)).min(2).max(12),
  /** Who the remaining cards point to, e.g. "Sir Aldous". */
  culprit: z.string().min(1),
});
export type AccuseConfig = z.infer<typeof accuseConfig>;

export const accuseSolution = z.object({
  clears: z.record(z.string(), z.string()),
  points: z.array(z.string()).min(1),
});
export type AccuseSolution = z.infer<typeof accuseSolution>;

export type AccuseState = { clears: Record<string, string | null>; points: string[] };

/** Pin `card` to `suspect` (moving it off any other folder and out of the evidence); same card again unpins it. */
export function assignCard(state: AccuseState, suspect: string, card: string): AccuseState {
  if (!(suspect in state.clears)) return state;
  const clears = { ...state.clears };
  const already = clears[suspect] === card;
  for (const s of Object.keys(clears)) if (clears[s] === card) clears[s] = null;
  clears[suspect] = already ? null : card;
  return { clears, points: state.points.filter((p) => p !== card) };
}

/** Mark or unmark `card` as evidence against the culprit (taking it out of any folder). */
export function togglePoint(state: AccuseState, card: string): AccuseState {
  if (state.points.includes(card)) return { ...state, points: state.points.filter((p) => p !== card) };
  const clears = { ...state.clears };
  for (const s of Object.keys(clears)) if (clears[s] === card) clears[s] = null;
  return { clears, points: [...state.points, card] };
}

const sameSet = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((x) => b.includes(x));

export const accuseLogic: EngineLogic<AccuseState> = {
  config: accuseConfig,
  solution: accuseSolution,
  initial: (puzzle) => ({
    clears: Object.fromEntries((puzzle.config as AccuseConfig).suspects.map((s) => [s.id, null])),
    points: [],
  }),
  check: (puzzle, state) => {
    const solution = puzzle.solution as AccuseSolution;
    const cleared = Object.keys(solution.clears).every((s) => state.clears[s] === solution.clears[s]);
    return cleared && sameSet(state.points, solution.points);
  },
  describe: (puzzle, state) => {
    const config = puzzle.config as AccuseConfig;
    const folders = config.suspects.map((s) => `${s.label} ← ${state.clears[s.id] ?? '–'}`).join(', ');
    return `${folders}; zeigt auf ${config.culprit}: ${state.points.length ? [...state.points].sort().join(', ') : '–'}`;
  },
  verify: (puzzle: Puzzle) => {
    const config = puzzle.config as AccuseConfig;
    const solution = puzzle.solution as AccuseSolution;
    const errors: string[] = [];
    for (const card of config.cards) if (!(card in CLUES)) errors.push(`unknown clue ${card}`);
    if (new Set(config.cards).size !== config.cards.length) errors.push('a card is listed twice');
    const ids = config.suspects.map((s) => s.id);
    if (!sameSet(Object.keys(solution.clears), ids)) errors.push('every suspect needs exactly one clearing card');
    const clearing = Object.values(solution.clears);
    if (new Set(clearing).size !== clearing.length) errors.push('two suspects share a clearing card');
    for (const card of [...clearing, ...solution.points]) if (!config.cards.includes(card)) errors.push(`solution card ${card} is not on the board`);
    if (solution.points.some((p) => clearing.includes(p))) errors.push('a card both clears and points');
    const neither = config.cards.filter((c) => !clearing.includes(c) && !solution.points.includes(c));
    return result(errors, [`${clearing.length} clear, ${solution.points.length} point, ${neither.length} neither`]);
  },
};
