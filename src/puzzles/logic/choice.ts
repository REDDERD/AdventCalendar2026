import { z } from 'zod';
import { result, type EngineLogic } from './types';

/** `choice`: 2–6 answer cards, one is right. */
export const choiceConfig = z.object({
  options: z
    .array(z.object({ label: z.string().min(1).max(60), image: z.string().optional() }))
    .min(2)
    .max(6),
  /** Picture above the cards (play-area width 256), e.g. a gear train. */
  figure: z.object({ image: z.string(), height: z.number().int().min(32).max(176) }).optional(),
  /** 1 = full-width cards, 2 = two columns (short labels or images). */
  columns: z.union([z.literal(1), z.literal(2)]).default(1),
});
export type ChoiceConfig = z.infer<typeof choiceConfig>;

export type ChoiceState = number | null;

export const choiceLogic: EngineLogic<ChoiceState> = {
  config: choiceConfig,
  solution: z.number().int().min(0),
  initial: () => null,
  check: (puzzle, selected) => selected === puzzle.solution,
  describe: (puzzle, selected) =>
    selected === null ? '–' : ((puzzle.config as ChoiceConfig).options[selected]?.label ?? String(selected)),
  verify: (puzzle) => {
    const { options } = puzzle.config as ChoiceConfig;
    const answer = puzzle.solution as number;
    const labels = options.map((o) => o.label);
    const errors: string[] = [];
    if (answer >= options.length) errors.push(`solution index ${answer} has no option`);
    if (new Set(labels).size !== labels.length) errors.push('option labels must be distinct');
    return result(errors);
  },
};
