import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { SPEAKER_NAMES } from '../dialogue/speakers';
import { AssetImage } from '../ui/AssetImage';
import { PixelButton } from '../ui/PixelButton';
import { useLocalPoint, type Point } from './engines/pointer';
import type { Puzzle } from './schema';
import { hintCost, nextHint, SUPER_HINT } from './scoring';

const LEVELS = [1, 2, 3, SUPER_HINT];

interface HintPanelProps {
  puzzle: Puzzle;
  bought: readonly number[];
  sparks: number;
  /** Practice in the trunk: every hint is free. */
  free: boolean;
  pet?: { id: string; line: string };
  onBuy: (level: number) => void;
  onClose: () => void;
}

/** [PZL-4] Hints 1–3 cost 1 spark, the super hint 2; bought hints stay visible. */
export function HintPanel({ puzzle, bought, sparks, free, pet, onBuy, onClose }: HintPanelProps) {
  const next = nextHint(bought);
  const texts = [...puzzle.hints, puzzle.superHint];
  return (
    <div className="puzzle-overlay hint-panel">
      <div className="overlay-head">
        <span>Hinweise</span>
        <span className="muted-light">{free ? 'Übung: gratis' : `Funken: ${sparks}`}</span>
        <button type="button" className="overlay-close" aria-label="Hinweise schließen" onClick={onClose}>
          ✕
        </button>
      </div>
      {pet && (
        <div className="pet-line">
          <AssetImage id={`pet.${pet.id}`} w={32} h={32} />
          <span>{pet.line}</span>
        </div>
      )}
      {LEVELS.map((level, i) => {
        const title = level === SUPER_HINT ? 'Super-Hinweis' : `Hinweis ${level}`;
        if (bought.includes(level)) {
          return (
            <div key={level} className="hint hint-open">
              <b>{title}</b>
              <p>{texts[i]}</p>
            </div>
          );
        }
        if (level !== next) {
          return (
            <div key={level} className="hint hint-locked">
              {title} · erst {LEVELS[i - 1] === SUPER_HINT ? 'Super-Hinweis' : `Hinweis ${LEVELS[i - 1]}`}
            </div>
          );
        }
        const cost = free ? 0 : hintCost(level);
        return (
          <div key={level} className="hint">
            <PixelButton small variant="parchment" disabled={sparks < cost} onClick={() => onBuy(level)}>
              {title} öffnen{cost ? ` · ${cost} ${cost === 1 ? 'Funke' : 'Funken'}` : ''}
            </PixelButton>
            {sparks < cost && <p className="muted">Zu wenig Funken. In den Szenen glitzert es manchmal …</p>}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Section 5.5 "Notiz-Zeichenfläche": draw over the puzzle. The drawing stays
 * while the layer is inactive (it then lets touches through).
 */
export function NotesLayer({ active, clearSignal }: { active: boolean; clearSignal: number }) {
  const { ref, toLocal } = useLocalPoint<HTMLCanvasElement>();
  const last = useRef<Point | null>(null);

  // Canvas pixels = logical pixels, so strokes look like pixel art when scaled.
  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }, [ref]);

  useEffect(() => {
    const canvas = ref.current;
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
  }, [clearSignal, ref]);

  const dot = (p: Point) => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#c4512a';
    ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 2, 2);
  };
  const stroke = (to: Point) => {
    const from = last.current ?? to;
    const steps = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y)));
    for (let i = 0; i <= steps; i++) dot({ x: from.x + ((to.x - from.x) * i) / steps, y: from.y + ((to.y - from.y) * i) / steps });
    last.current = to;
  };

  return (
    <canvas
      ref={ref}
      className={`notes-layer ${active ? 'active' : ''}`}
      onPointerDown={(e: ReactPointerEvent<HTMLCanvasElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        last.current = null;
        stroke(toLocal(e));
      }}
      onPointerMove={(e) => last.current && stroke(toLocal(e))}
      onPointerUp={() => (last.current = null)}
      onPointerCancel={() => (last.current = null)}
    />
  );
}

/** Clue card ("Karte"): tap a clue to cross it off – handy for logic grids. */
export function ClueCard({ clues, crossed, onToggle, onClose }: {
  clues: readonly string[];
  crossed: ReadonlySet<number>;
  onToggle: (i: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="puzzle-overlay clue-card">
      <div className="overlay-head">
        <span>Quills Karte</span>
        <span className="muted-light">antippen = abhaken</span>
        <button type="button" className="overlay-close" aria-label="Karte schließen" onClick={onClose}>
          ✕
        </button>
      </div>
      <ol className="clue-list">
        {clues.map((clue, i) => (
          <li key={i}>
            <button type="button" className={crossed.has(i) ? 'crossed' : ''} aria-pressed={crossed.has(i)} onClick={() => onToggle(i)}>
              {clue}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** [PZL-5] "Sollen wir es gemeinsam durchgehen?" */
export function HelpOffer({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  return (
    <div className="help-offer">
      <div className="dialogue-box">
        <div className="dialogue-portrait">
          <AssetImage id="portrait.quill" w={64} h={64} />
        </div>
        <div className="dialogue-content">
          <div className="dialogue-name">{SPEAKER_NAMES.quill}</div>
          <p className="dialogue-text">Eine harte Nuss. Sollen wir es gemeinsam durchgehen?</p>
          <div className="help-buttons">
            <PixelButton small onClick={onAccept}>Ja, gern</PixelButton>
            <PixelButton small variant="parchment" onClick={onDecline}>Noch nicht</PixelButton>
          </div>
        </div>
      </div>
    </div>
  );
}
