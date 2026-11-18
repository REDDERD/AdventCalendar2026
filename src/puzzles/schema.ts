import { z } from 'zod';
import { logicFor } from './logic';

export const PUZZLE_TYPES = ['choice', 'input', 'tap', 'arrange', 'slide', 'toggle', 'path', 'custom'] as const;
export type PuzzleType = (typeof PUZZLE_TYPES)[number];

const petLines = z.object({ owl: z.string(), cat: z.string(), toad: z.string() });

// Section 10.1
export const puzzleBaseSchema = z.object({
  id: z.string().regex(/^p\d{2}[wa]?$/),
  number: z.number().int().min(1).max(24),
  title: z.string().min(1),
  points: z.number().int().positive(),
  type: z.enum(PUZZLE_TYPES),
  prompt: z.string().min(1).max(280),
  image: z.string().optional(),
  config: z.record(z.string(), z.unknown()),
  solution: z.unknown(),
  hints: z.tuple([z.string(), z.string(), z.string()]),
  superHint: z.string(),
  solutionText: z.string(),
  intro: z.object({ speaker: z.string(), text: z.string() }),
  /** [PLAN-2] The pet comments on the puzzle and unlocks hint 1 for free (days 5, 13, 21). */
  petHint: petLines.optional(),
  variants: z.record(z.string(), z.record(z.string(), z.unknown())).optional(),
});

export type Puzzle = z.infer<typeof puzzleBaseSchema>;

/** Validate the base format and the engine's own config/solution schema; applies config defaults. */
export function parsePuzzle(raw: unknown): Puzzle {
  const puzzle = puzzleBaseSchema.parse(raw);
  const logic = logicFor(puzzle.type, puzzle.config);
  if (!logic) throw new Error(`${puzzle.id}: unknown custom component "${String(puzzle.config.component)}"`);
  const config = logic.config.parse(puzzle.config) as Record<string, unknown>;
  logic.solution.parse(puzzle.solution);
  return { ...puzzle, config };
}
