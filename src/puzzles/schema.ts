import { z } from 'zod';

export const PUZZLE_TYPES = ['choice', 'input', 'tap', 'arrange', 'slide', 'toggle', 'path', 'custom'] as const;
export type PuzzleType = (typeof PUZZLE_TYPES)[number];

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
  variants: z.record(z.string(), z.record(z.string(), z.unknown())).optional(),
});

export type Puzzle = z.infer<typeof puzzleBaseSchema>;

/** Engine-specific config/solution schemas. Engines not listed here are validated in M4. */
export const engineSchemas: Partial<Record<PuzzleType, { config: z.ZodType; solution: z.ZodType }>> = {
  input: {
    config: z.object({
      inputMode: z.enum(['number', 'text']),
      maxLength: z.number().int().min(1).max(24),
    }),
    solution: z.array(z.string().min(1)).min(1),
  },
};

export type InputConfig = { inputMode: 'number' | 'text'; maxLength: number };

export function parsePuzzle(raw: unknown): Puzzle {
  const puzzle = puzzleBaseSchema.parse(raw);
  const engine = engineSchemas[puzzle.type];
  if (engine) {
    engine.config.parse(puzzle.config);
    engine.solution.parse(puzzle.solution);
  }
  return puzzle;
}
