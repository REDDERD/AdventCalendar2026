import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { useStage } from '../../core/PixelStage';

export type Point = { x: number; y: number };

/** Pointer position in logical pixels relative to the element behind `ref`. */
export function useLocalPoint<T extends Element>() {
  const ref = useRef<T>(null);
  const { scale } = useStage();
  const toLocal = (e: { clientX: number; clientY: number }): Point => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale };
  };
  return { ref, toLocal };
}

interface DragOptions {
  /** Dropped on the element with `data-drop` under the finger (null: nowhere). */
  onDrop: (id: string, target: string | null) => void;
  /** Touched without moving. */
  onTap: (id: string) => void;
}

const DRAG_THRESHOLD = 4;

/**
 * Drag & drop plus tap-to-select for `arrange` [Section 10]: pieces get
 * `itemProps(id)`, drop zones a `data-drop` attribute, the container
 * `containerProps`. While dragging, `ghost` follows the finger.
 */
export function useDragPick<T extends HTMLElement>({ onDrop, onTap }: DragOptions) {
  const { ref, toLocal } = useLocalPoint<T>();
  const [drag, setDrag] = useState<{ id: string; start: Point; at: Point; moved: boolean } | null>(null);

  const itemProps = (id: string, disabled = false) => ({
    onPointerDown: (e: ReactPointerEvent) => {
      if (disabled || !ref.current) return;
      e.preventDefault();
      ref.current.setPointerCapture(e.pointerId);
      const p = toLocal(e);
      setDrag({ id, start: p, at: p, moved: false });
    },
  });

  const containerProps = {
    ref,
    onPointerMove: (e: ReactPointerEvent) => {
      if (!drag) return;
      const at = toLocal(e);
      const moved = drag.moved || Math.hypot(at.x - drag.start.x, at.y - drag.start.y) > DRAG_THRESHOLD;
      setDrag({ ...drag, at, moved });
    },
    onPointerUp: (e: ReactPointerEvent) => {
      if (!drag) return;
      setDrag(null);
      if (!drag.moved) return onTap(drag.id);
      const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-drop]');
      onDrop(drag.id, target?.getAttribute('data-drop') ?? null);
    },
    onPointerCancel: () => setDrag(null),
  };

  return { containerProps, itemProps, ghost: drag?.moved ? { id: drag.id, ...drag.at } : null };
}
