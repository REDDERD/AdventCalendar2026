import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { edgeKey, extendPath, pathLogic, usedEdges, type PathConfig, type PathState } from '../logic/path';
import { useLocalPoint, type Point } from './pointer';
import type { Engine, EngineProps } from './types';

/** Finger within this distance of a point counts as touching it. */
const HIT = 14;

/** Triangle at the middle of a one-way connection, pointing from p to q. */
function arrowHead(p: Point, q: Point): string {
  const len = Math.hypot(q.x - p.x, q.y - p.y) || 1;
  const [ux, uy] = [(q.x - p.x) / len, (q.y - p.y) / len];
  const [mx, my] = [(p.x + q.x) / 2 + ux * 5, (p.y + q.y) / 2 + uy * 5];
  const corner = (side: number) => `${mx - ux * 10 - uy * 6 * side},${my - uy * 10 + ux * 6 * side}`;
  return `${mx},${my} ${corner(1)} ${corner(-1)}`;
}

/** Five-pointed star around (x, y), for constellations. */
function starPoints(x: number, y: number): string {
  return Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? 3.5 : 8;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    return `${x + Math.cos(a) * r},${y + Math.sin(a) * r}`;
  }).join(' ');
}

function PathEngine({ puzzle, state, setState, disabled }: EngineProps<PathState>) {
  const config = puzzle.config as PathConfig;
  const { ref, toLocal } = useLocalPoint<SVGSVGElement>();
  const drawing = useRef(false);
  // Pointer events can arrive faster than React re-renders.
  const live = useRef(state);
  live.current = state;

  const nodeAt = (p: Point) => {
    let best: { id: string; d: number } | null = null;
    for (const n of config.nodes) {
      const d = Math.hypot(n.x - p.x, n.y - p.y);
      if (d <= HIT && (!best || d < best.d)) best = { id: n.id, d };
    }
    return best?.id ?? null;
  };

  /** Extend to the node, or step back when the finger returns to the previous point. */
  const visit = (node: string) => {
    const path = live.current;
    if (path.length >= 2 && node === path[path.length - 2]) {
      live.current = path.slice(0, -1);
    } else {
      const next = extendPath(config, path, node);
      if (!next) return;
      live.current = next;
    }
    setState(live.current);
  };

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (disabled) return;
    const node = nodeAt(toLocal(e));
    if (!node) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    if (node !== live.current[live.current.length - 1]) visit(node);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!drawing.current) return;
    const node = nodeAt(toLocal(e));
    if (node && node !== live.current[live.current.length - 1]) visit(node);
  };

  const used = usedEdges(state);
  const last = state[state.length - 1];
  const pos = new Map(config.nodes.map((n) => [n.id, n]));

  return (
    <div className="engine-center">
      <svg
        ref={ref}
        className="path-board"
        width={256}
        height={256}
        viewBox="0 0 256 256"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => (drawing.current = false)}
        onPointerCancel={() => (drawing.current = false)}
      >
        {config.edges.map(([a, b, oneWay]) => {
          const p = pos.get(a)!;
          const q = pos.get(b)!;
          const on = used.has(edgeKey(a, b));
          return (
            <g key={edgeKey(a, b)}>
              <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} className={on ? 'path-edge used' : 'path-edge'} />
              {oneWay && <polygon className="path-arrow" points={arrowHead(p, q)} />}
            </g>
          );
        })}
        {state.slice(1).map((node, i) => {
          const p = pos.get(state[i])!;
          const q = pos.get(node)!;
          return <line key={`trail${i}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} className="path-trail" />;
        })}
        {config.nodes.map((n) => (
          <g key={n.id} className={`path-node ${state.includes(n.id) ? 'visited' : ''} ${n.id === last ? 'current' : ''}`}>
            {config.style === 'stars' ? (
              <polygon className="path-star" points={starPoints(n.x, n.y)} />
            ) : (
              <>
                <rect x={n.x - 9} y={n.y - 9} width={18} height={18} />
                <text x={n.x} y={n.y + 4}>{n.label ?? n.id}</text>
              </>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

export const pathEngine: Engine<PathState> = { logic: pathLogic, Component: PathEngine, submit: 'check', autoSolve: () => true };
