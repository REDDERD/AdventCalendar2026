import type { PuzzleType } from '../schema';
import { inputEngine } from './Input';
import type { Engine } from './types';

/** Engines built so far; the rest follow in M4. */
export const engines: Partial<Record<PuzzleType, Engine>> = {
  input: inputEngine,
};
