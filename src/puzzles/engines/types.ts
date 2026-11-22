import type { ComponentType } from 'react';
import type { EngineLogic } from '../logic/types';
import type { Puzzle } from '../schema';

export interface EngineProps<S> {
  puzzle: Puzzle;
  /** The host owns the state so "Zurücksetzen" and "Prüfen" work for every engine [PZL-6]. */
  state: S;
  setState: (next: S) => void;
  disabled: boolean;
  /** Only for `direct` engines, which submit themselves (keyboard OK). */
  onSubmit: (state: S) => void;
}

export interface Engine<S = never> {
  logic: EngineLogic<S>;
  Component: ComponentType<EngineProps<S>>;
  /** `check`: the action bar's "Prüfen" submits; `direct`: the engine submits itself. */
  submit: 'check' | 'direct';
  /**
   * Solve as soon as the state is right, without "Prüfen" – for puzzles whose goal is a
   * state you build (lights, slide, pour, crossing, a path, the mandrake bed), not an answer.
   */
  autoSolve?: (puzzle: Puzzle) => boolean;
}
