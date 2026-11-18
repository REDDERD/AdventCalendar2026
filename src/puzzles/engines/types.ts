import type { ComponentType } from 'react';
import type { Puzzle } from '../schema';

export interface EngineProps {
  puzzle: Puzzle;
  disabled: boolean;
  /** Submit an attempt; the host checks it with the engine's `check`. */
  onSubmit: (input: unknown) => void;
}

export interface Engine {
  Component: ComponentType<EngineProps>;
  check: (puzzle: Puzzle, input: unknown) => boolean;
  /** Human-readable attempt for the event log [PZL-8]. */
  describe: (input: unknown) => string;
}
