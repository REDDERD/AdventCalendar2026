import type { z } from 'zod';
import type { Puzzle } from '../schema';

/** Result of `puzzles:verify` for one puzzle [PLAN-3]. */
export interface VerifyResult {
  errors: string[];
  /** Short facts for the report, e.g. "1 solution" or "7 moves". */
  info: string[];
}

/**
 * Pure rules of an engine (no React): validated by zod, used by the
 * component, the tests [PZL-2] and `puzzles:verify` [PLAN-3].
 */
export interface EngineLogic<S = unknown> {
  config: z.ZodType;
  solution: z.ZodType;
  initial: (puzzle: Puzzle) => S;
  check: (puzzle: Puzzle, state: S) => boolean;
  /** Human-readable attempt for the event log [PZL-8]. */
  describe: (puzzle: Puzzle, state: S) => string;
  verify: (puzzle: Puzzle) => VerifyResult;
}

export function result(errors: string[] = [], info: string[] = []): VerifyResult {
  return { errors, info };
}

export function sameSet(a: readonly string[], b: readonly string[]): boolean {
  const sa = new Set(a);
  return sa.size === new Set(b).size && b.every((x) => sa.has(x));
}

export function sameArray<T>(a: readonly T[], b: readonly T[]): boolean {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

/** All permutations of `items` (small n only). */
export function* permutations<T>(items: readonly T[]): Generator<T[]> {
  if (items.length <= 1) {
    yield [...items];
    return;
  }
  for (let i = 0; i < items.length; i++) {
    const rest = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const p of permutations(rest)) yield [items[i], ...p];
  }
}

/** All k-element subsets of `items`. */
export function* combinations<T>(items: readonly T[], k: number, from = 0): Generator<T[]> {
  if (k === 0) {
    yield [];
    return;
  }
  for (let i = from; i <= items.length - k; i++) {
    for (const rest of combinations(items, k - 1, i + 1)) yield [items[i], ...rest];
  }
}

/** Breadth-first search over a small state space; returns the minimal number of moves or null. */
export function bfs<S>(start: S, isGoal: (s: S) => boolean, next: (s: S) => S[], key: (s: S) => string, limit = 500_000): number | null {
  const seen = new Set([key(start)]);
  let frontier = [start];
  for (let depth = 0; frontier.length; depth++) {
    const following: S[] = [];
    for (const s of frontier) {
      if (isGoal(s)) return depth;
      for (const n of next(s)) {
        const k = key(n);
        if (seen.has(k)) continue;
        seen.add(k);
        following.push(n);
      }
    }
    if (seen.size > limit) return null;
    frontier = following;
  }
  return null;
}
