import { useEffect, useState } from 'react';
import { useStore } from '../core/store';
import { loadPuzzle } from '../services/ContentService';
import type { SaveDoc } from '../types';
import type { Puzzle } from './schema';

/** Apply per-house (p09) or per-ending (p24) variants. */
export function resolveVariant(puzzle: Puzzle, save: SaveDoc | null): Puzzle {
  if (!puzzle.variants || !save) return puzzle;
  const keys = [save.profile?.house, save.ending].filter((k): k is NonNullable<typeof k> => !!k);
  const key = keys.find((k) => puzzle.variants?.[k]);
  return key ? ({ ...puzzle, ...puzzle.variants[key] } as Puzzle) : puzzle;
}

/** The puzzle of the current day step (`progress.current.puzzleId`). */
export function useCurrentPuzzle(): Puzzle | null {
  const puzzleId = useStore((s) => s.save?.progress.current?.puzzleId);
  const save = useStore((s) => s.save);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  useEffect(() => {
    if (!puzzleId) return;
    let alive = true;
    loadPuzzle(puzzleId)
      .then((p) => alive && setPuzzle(p))
      .catch((e) => console.error(e));
    return () => {
      alive = false;
    };
  }, [puzzleId]);

  return puzzle ? resolveVariant(puzzle, save) : null;
}
