import { useEffect, useRef, useState } from 'react';
import type { HouseId, Look } from '../types';
import { playerSheet } from './CharacterComposer';
import { FRAME, frameIndex, SHEET_COLS, type Direction } from './layers';

interface Props {
  look: Look;
  house: HouseId | null;
  direction?: Direction;
  /** Walk step 0–8 (0 = standing). */
  step?: number;
  scale?: number;
  /** Head crop only (portraits, admin avatars [ADM-5]). */
  portrait?: boolean;
  className?: string;
}

/** The player character, composed at runtime from LPC layers. */
export function CharacterSprite({ look, house, direction = 'down', step = 0, scale = 1, portrait, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [sheet, setSheet] = useState<HTMLCanvasElement | null>(null);
  const lookKey = JSON.stringify(look);

  useEffect(() => {
    let alive = true;
    playerSheet(JSON.parse(lookKey) as Look, house)
      .then((s) => alive && setSheet(s))
      .catch((e) => console.warn('[character]', e));
    return () => {
      alive = false;
    };
  }, [lookKey, house]);

  const [sx, sy, size] = (() => {
    const index = frameIndex(direction, step);
    const x = (index % SHEET_COLS) * FRAME;
    const y = Math.floor(index / SHEET_COLS) * FRAME;
    // Same head crop as the NPC portraits in the asset manifest
    return portrait ? [x + 16, y + 12, 32] : [x, y, FRAME];
  })();
  const px = size * scale;

  useEffect(() => {
    const c = ref.current;
    if (!c || !sheet) return;
    const ctx = c.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(sheet, sx, sy, size, size, 0, 0, size, size);
  }, [sheet, sx, sy, size]);

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      className={`pixelated ${className ?? ''}`}
      style={{ width: px, height: px }}
    />
  );
}
