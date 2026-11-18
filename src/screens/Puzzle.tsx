import { PuzzleHost } from '../puzzles/PuzzleHost';
import { useCurrentPuzzle } from '../puzzles/usePuzzle';
import { Layout } from '../ui/Layout';

/** Section 4, step 5. */
export function PuzzleScreen() {
  const puzzle = useCurrentPuzzle();
  return puzzle ? <PuzzleHost key={puzzle.id} puzzle={puzzle} /> : <Layout />;
}
