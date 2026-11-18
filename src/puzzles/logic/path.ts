import { z } from 'zod';
import type { Puzzle } from '../schema';
import { result, type EngineLogic } from './types';

/**
 * `path`: draw a line from point to point along the given connections.
 * - `every_edge_once`: use every connection exactly once (stairs, constellation)
 * - `simple`: never visit a point twice (spider web); `visitAll` makes it a tour
 */
export const pathConfig = z.object({
  nodes: z
    .array(
      z.object({
        id: z.string().min(1),
        x: z.number().min(0).max(256),
        y: z.number().min(0).max(256),
        label: z.string().optional(),
      }),
    )
    .min(2),
  /** [a, b] both ways; [a, b, ">"] only from a to b (a moving staircase). */
  edges: z.array(z.union([z.tuple([z.string(), z.string()]), z.tuple([z.string(), z.string(), z.literal(">")])])).min(1),
  rule: z.enum(['every_edge_once', 'simple']),
  start: z.string().optional(),
  end: z.string().optional(),
  visitAll: z.boolean().default(false),
});
export type PathConfig = z.infer<typeof pathConfig>;

/** Visited points in order. */
export type PathState = string[];

export const edgeKey = (a: string, b: string): string => (a < b ? `${a}~${b}` : `${b}~${a}`);

export function usedEdges(path: PathState): Set<string> {
  const used = new Set<string>();
  for (let i = 1; i < path.length; i++) used.add(edgeKey(path[i - 1], path[i]));
  return used;
}

/**
 * Extend the line to `node`. Returns null on a rule violation: unknown point,
 * wrong start, no connection, a connection used twice or a point visited twice.
 */
export function extendPath(config: PathConfig, path: PathState, node: string): PathState | null {
  if (!config.nodes.some((n) => n.id === node)) return null;
  if (!path.length) return config.start && node !== config.start ? null : [node];
  const last = path[path.length - 1];
  if (node === last) return null;
  const key = edgeKey(last, node);
  const edge = config.edges.find(([a, b]) => edgeKey(a, b) === key);
  if (!edge) return null;
  if (edge[2] === '>' && edge[0] !== last) return null; // one-way
  if (config.rule === 'every_edge_once' && usedEdges(path).has(key)) return null;
  if (config.rule === 'simple' && path.includes(node)) return null;
  return [...path, node];
}

function isComplete(config: PathConfig, path: PathState): boolean {
  if (path.length < 2) return false;
  if (config.end && path[path.length - 1] !== config.end) return false;
  if (config.rule === 'every_edge_once') return usedEdges(path).size === config.edges.length;
  return !config.visitAll || new Set(path).size === config.nodes.length;
}

function isValid(config: PathConfig, path: PathState): boolean {
  let replay: PathState | null = [];
  for (const node of path) {
    replay = extendPath(config, replay, node);
    if (!replay) return false;
  }
  return true;
}

/** All complete lines (capped), by depth-first search. */
export function allPaths(config: PathConfig, cap = 10_000): PathState[] {
  const found: PathState[] = [];
  const starts = config.start ? [config.start] : config.nodes.map((n) => n.id);
  const walk = (path: PathState) => {
    if (found.length >= cap) return;
    if (isComplete(config, path)) found.push(path);
    for (const n of config.nodes) {
      const next = extendPath(config, path, n.id);
      if (next) walk(next);
    }
  };
  for (const s of starts) walk([s]);
  return found;
}

export const pathLogic: EngineLogic<PathState> = {
  config: pathConfig,
  /** One valid line, for verify and the help. */
  solution: z.array(z.string()).min(2),
  initial: () => [],
  check: (puzzle, path) => {
    const config = puzzle.config as PathConfig;
    return isValid(config, path) && isComplete(config, path);
  },
  describe: (_puzzle, path) => path.join('-') || '–',
  verify: (puzzle: Puzzle) => {
    const config = puzzle.config as PathConfig;
    const errors: string[] = [];
    const ids = new Set(config.nodes.map((n) => n.id));
    if (ids.size !== config.nodes.length) errors.push('node ids must be unique');
    const keys = config.edges.map(([a, b]) => edgeKey(a, b));
    if (new Set(keys).size !== keys.length) errors.push('duplicate edge');
    for (const [a, b] of config.edges) if (!ids.has(a) || !ids.has(b) || a === b) errors.push(`bad edge ${a}-${b}`);
    for (const id of [config.start, config.end]) if (id && !ids.has(id)) errors.push(`unknown start/end ${id}`);
    const solution = puzzle.solution as PathState;
    if (!(isValid(config, solution) && isComplete(config, solution))) errors.push('the given solution is not a valid line');
    const count = allPaths(config).length;
    if (!count) errors.push('no valid line exists');
    return result(errors, [`${count} valid lines`]);
  },
};
