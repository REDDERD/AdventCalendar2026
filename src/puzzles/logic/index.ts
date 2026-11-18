import type { PuzzleType } from '../schema';
import { arrangeLogic } from './arrange';
import { choiceLogic } from './choice';
import { crossLogic } from './cross';
import { inputLogic } from './input';
import { pathLogic } from './path';
import { pourLogic } from './pour';
import { slideLogic } from './slide';
import { tapLogic } from './tap';
import { toggleLogic } from './toggle';
import type { EngineLogic } from './types';

/** State types differ per engine; the registry erases them. */
type AnyEngineLogic = EngineLogic<any>;

/** `custom` puzzles name their component in `config.component`; accuse and finale follow with days 23/24. */
export const CUSTOM_LOGIC: Record<string, AnyEngineLogic> = {
  pour: pourLogic,
  cross: crossLogic,
};

const LOGIC: Record<Exclude<PuzzleType, 'custom'>, AnyEngineLogic> = {
  choice: choiceLogic,
  input: inputLogic,
  tap: tapLogic,
  arrange: arrangeLogic,
  slide: slideLogic,
  toggle: toggleLogic,
  path: pathLogic,
};

/** The rules for a puzzle, or null for a custom component that doesn't exist (yet). */
export function logicFor(type: PuzzleType, config: Record<string, unknown>): EngineLogic<unknown> | null {
  if (type !== 'custom') return LOGIC[type] as EngineLogic<unknown>;
  return (CUSTOM_LOGIC[String(config.component)] as EngineLogic<unknown> | undefined) ?? null;
}
