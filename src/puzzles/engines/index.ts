import type { Puzzle, PuzzleType } from '../schema';
import { accuseEngine } from './Accuse';
import { arrangeEngine } from './Arrange';
import { choiceEngine } from './Choice';
import { crossEngine } from './Cross';
import { inputEngine } from './Input';
import { nimEngine } from './Nim';
import { pathEngine } from './Path';
import { pourEngine } from './Pour';
import { slideEngine } from './Slide';
import { tapEngine } from './Tap';
import { toggleEngine } from './Toggle';
import type { Engine } from './types';

/** State types differ per engine; the registry erases them. */
type AnyEngine = Engine<any>;

const ENGINES: Record<Exclude<PuzzleType, 'custom'>, AnyEngine> = {
  choice: choiceEngine,
  input: inputEngine,
  tap: tapEngine,
  arrange: arrangeEngine,
  slide: slideEngine,
  toggle: toggleEngine,
  path: pathEngine,
};

/** `custom` components by `config.component`. */
const CUSTOM: Record<string, AnyEngine> = {
  pour: pourEngine,
  cross: crossEngine,
  nim: nimEngine,
  accuse: accuseEngine,
};

/** Section 10: 8 engine types, configured only by JSON. */
export function engineFor(puzzle: Puzzle): Engine<unknown> | null {
  const engine = puzzle.type === 'custom' ? CUSTOM[String(puzzle.config.component)] : ENGINES[puzzle.type];
  return (engine as Engine<unknown> | undefined) ?? null;
}
