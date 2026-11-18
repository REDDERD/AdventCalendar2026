import { useState } from 'react';
import { AssetImage } from '../../ui/AssetImage';
import {
  arrangeLogic,
  boardChar,
  gridPieces,
  gridSize,
  placeGrid,
  swapRow,
  tapStick,
  type ArrangeConfig,
  type ArrangeState,
  type GridConfig,
  type GridState,
  type RowConfig,
  type RowState,
  type SticksConfig,
  type SticksState,
} from '../logic/arrange';
import { useDragPick } from './pointer';
import type { Engine, EngineProps } from './types';

function ArrangeEngine(props: EngineProps<ArrangeState>) {
  const config = props.puzzle.config as ArrangeConfig;
  const { state } = props;
  if (config.mode === 'row' && state.mode === 'row') return <RowArrange {...props} config={config} state={state} />;
  if (config.mode === 'grid' && state.mode === 'grid') return <GridArrange {...props} config={config} state={state} />;
  if (config.mode === 'sticks' && state.mode === 'sticks') return <SticksArrange {...props} config={config} state={state} />;
  return null;
}

type ModeProps<C, S> = Omit<EngineProps<ArrangeState>, 'state'> & { config: C; state: S };

// ---------- Row: books on a shelf; drag onto another place or tap two to swap ----------

const BOOK_COLORS = ['#8e1b1b', '#1d3f8a', '#1e6b3a', '#6b4226', '#5a3a6e', '#9a6a3c', '#2b5a5a', '#7a2e4a'];

function RowArrange({ config, state, setState, disabled }: ModeProps<RowConfig, RowState>) {
  const [selected, setSelected] = useState<number | null>(null);
  const items = new Map(config.items.map((item, i) => [item.id, { ...item, color: item.color ?? BOOK_COLORS[i % BOOK_COLORS.length] }]));
  const width = Math.min(44, Math.floor(232 / state.order.length) - 4);

  const swap = (a: number, b: number) => {
    setSelected(null);
    setState(swapRow(state, a, b));
  };
  const tap = (place: number) => {
    if (selected === null) setSelected(place);
    else if (selected === place) setSelected(null);
    else swap(selected, place);
  };
  const { containerProps, itemProps, ghost } = useDragPick<HTMLDivElement>({
    onTap: (id) => tap(state.order.indexOf(id)),
    onDrop: (id, target) => target?.startsWith('place-') && swap(state.order.indexOf(id), Number(target.slice(6))),
  });

  const book = (id: string, extra = '') => {
    const item = items.get(id)!;
    return (
      <div className={`book ${extra}`} style={{ width, background: item.color }}>
        <span>{item.label}</span>
      </div>
    );
  };

  return (
    <div className="engine-center">
      <div className="shelf" {...containerProps}>
        {state.order.map((id, place) => (
          <div key={place} className="shelf-place" data-drop={`place-${place}`} style={{ width: width + 4 }}>
            <button
              type="button"
              className="piece-btn"
              aria-label={items.get(id)!.label}
              aria-pressed={selected === place}
              disabled={disabled}
              {...itemProps(id, disabled)}
            >
              {book(id, `${selected === place ? 'selected' : ''} ${ghost?.id === id ? 'dragging' : ''}`)}
            </button>
          </div>
        ))}
        {ghost && (
          <div className="drag-ghost" style={{ left: ghost.x - width / 2, top: ghost.y - 60 }}>
            {book(ghost.id)}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Grid: pieces from the tray onto the board ----------

function GridArrange({ config, state, setState, disabled }: ModeProps<GridConfig, GridState>) {
  const [selected, setSelected] = useState<string | null>(null);
  const { rows, cols } = gridSize(config);
  const cell = Math.min(48, Math.floor(216 / Math.max(rows, cols)));
  const pieces = gridPieces(config);
  const kindOf = new Map(pieces.map((p) => [p.id, p.kind]));
  const tray = pieces.filter((p) => !state.cells.includes(p.id));

  const place = (pieceId: string, target: number | null) => {
    setSelected(null);
    setState(placeGrid(config, state, pieceId, target));
  };
  const { containerProps, itemProps, ghost } = useDragPick<HTMLDivElement>({
    onTap: (id) => {
      const onBoard = state.cells.indexOf(id);
      // A selected piece tapped onto another piece on the board swaps with it.
      if (selected && selected !== id && onBoard >= 0) place(selected, onBoard);
      else setSelected(selected === id ? null : id);
    },
    onDrop: (id, target) => {
      if (target === 'tray') place(id, null);
      else if (target?.startsWith('cell-')) place(id, Number(target.slice(5)));
    },
  });

  const token = (kind: string, size: number) => {
    const def = config.kinds[kind];
    return def?.sprite ? <AssetImage id={def.sprite} w={size} h={size} /> : <span className="grid-token">{def?.label.charAt(0) ?? kind}</span>;
  };
  const piece = (id: string) => (
    <button
      key={id}
      type="button"
      className={`piece-btn grid-piece ${selected === id ? 'selected' : ''} ${ghost?.id === id ? 'dragging' : ''}`}
      aria-label={config.kinds[kindOf.get(id)!]?.label ?? id}
      aria-pressed={selected === id}
      disabled={disabled}
      {...itemProps(id, disabled)}
    >
      {token(kindOf.get(id)!, cell - 6)}
    </button>
  );

  return (
    <div className="engine-center" {...containerProps}>
      <div className="grid-board" style={{ gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gridAutoRows: cell }}>
        {state.cells.map((pieceId, i) => {
          const fixed = boardChar(config, i);
          if (fixed === '#') return <div key={i} className="grid-cell blocked" />;
          if (fixed !== '.') return <div key={i} className="grid-cell fixed">{token(fixed, cell - 6)}</div>;
          return (
            <div
              key={i}
              className="grid-cell"
              data-drop={`cell-${i}`}
              aria-label={`Feld ${Math.floor(i / cols) + 1}-${(i % cols) + 1}`}
              onClick={() => selected && !pieceId && place(selected, i)}
            >
              {pieceId && piece(pieceId)}
            </div>
          );
        })}
      </div>
      <div className="grid-tray" data-drop="tray" style={{ minHeight: cell }} onClick={() => selected && place(selected, null)}>
        {tray.length ? tray.map((p) => piece(p.id)) : <span className="muted">alles verteilt</span>}
      </div>
      {ghost && (
        <div className="drag-ghost" style={{ left: ghost.x - cell / 2, top: ghost.y - cell / 2 }}>
          {token(kindOf.get(ghost.id)!, cell - 6)}
        </div>
      )}
    </div>
  );
}

// ---------- Sticks: tap a stick to pick it up, tap an empty place to put it down ----------

function SticksArrange({ config, state, setState, disabled }: ModeProps<SticksConfig, SticksState>) {
  return (
    <div className="engine-center">
      {/* Slots use y 40–220; the status line fits below on a 256 px area. */}
      <svg className="sticks-board" width={256} height={180} viewBox="0 40 256 180">
        {config.slots.map((s) => {
          const on = state.on.includes(s.id);
          const held = state.held === s.id;
          return (
            <g key={s.id}>
              <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} className={on ? 'stick' : held ? 'stick-held' : 'stick-slot'} />
              <line
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                className="stick-hit"
                role="button"
                aria-label={`Stab ${s.id}`}
                onClick={() => !disabled && setState(tapStick(config, state, s.id))}
              />
            </g>
          );
        })}
      </svg>
      <div className="engine-status">{state.held ? 'Wohin damit?' : `Umlegen: ${config.moves} ${config.moves === 1 ? 'Stab' : 'Stäbe'}`}</div>
    </div>
  );
}

export const arrangeEngine: Engine<ArrangeState> = { logic: arrangeLogic, Component: ArrangeEngine, submit: 'check' };
