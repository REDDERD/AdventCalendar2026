import { parsePuzzle, type Puzzle } from '../puzzles/schema';

// One lazy chunk per day [Section 13.2 ContentService].
const stories = import.meta.glob<{ default: object }>('../content/generated/*.json');
const puzzles = import.meta.glob<{ default: unknown }>('../content/puzzles/*.json');

export function storyStem(day: number): string {
  return day === 0 ? 'prologue' : `day${String(day).padStart(2, '0')}`;
}

export function hasStory(day: number): boolean {
  return `../content/generated/${storyStem(day)}.json` in stories;
}

export async function loadStory(day: number): Promise<object> {
  const loader = stories[`../content/generated/${storyStem(day)}.json`];
  if (!loader) throw new Error(`No story for day ${day}`);
  return (await loader()).default;
}

export function hasPuzzle(id: string): boolean {
  return `../content/puzzles/${id}.json` in puzzles;
}

/** Every puzzle in the bundle, e.g. ["p01", "p02", …, "p13a", "p13w"]. */
export function listPuzzleIds(): string[] {
  return Object.keys(puzzles)
    .map((path) => path.match(/(p\d{2}[wa]?)\.json$/)?.[1])
    .filter((id): id is string => !!id)
    .sort();
}

export async function loadPuzzle(id: string): Promise<Puzzle> {
  const loader = puzzles[`../content/puzzles/${id}.json`];
  if (!loader) throw new Error(`No puzzle ${id}`);
  return parsePuzzle((await loader()).default);
}
