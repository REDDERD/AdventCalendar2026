import { z } from 'zod';
import { matchesAnswer, normalizeAnswer } from '../normalize';
import type { Puzzle } from '../schema';
import { result, type EngineLogic } from './types';

/** `input`: number or word via the pixel keyboard, compared normalised [PZL-1]. */
export const inputConfig = z.object({
  inputMode: z.enum(['number', 'text']),
  maxLength: z.number().int().min(1).max(24),
  /** Picture above the keyboard (play-area width 256). */
  figure: z.object({ image: z.string(), height: z.number().int().min(32).max(96) }).optional(),
});
export type InputConfig = z.infer<typeof inputConfig>;

export const inputLogic: EngineLogic<string> = {
  config: inputConfig,
  solution: z.array(z.string().min(1)).min(1),
  initial: () => '',
  check: (puzzle, value) => matchesAnswer(value, puzzle.solution as string[]),
  describe: (_puzzle, value) => value,
  verify: (puzzle: Puzzle) => {
    const config = puzzle.config as InputConfig;
    const errors: string[] = [];
    for (const answer of puzzle.solution as string[]) {
      const typed = answer.replace(/\s/g, '');
      if (typed.length > config.maxLength) errors.push(`answer "${answer}" is longer than maxLength ${config.maxLength}`);
      if (config.inputMode === 'number' && !/^\d+$/.test(typed)) errors.push(`answer "${answer}" cannot be typed on the number pad`);
      if (!normalizeAnswer(answer)) errors.push(`answer "${answer}" is empty after normalisation`);
    }
    return result(errors);
  },
};
