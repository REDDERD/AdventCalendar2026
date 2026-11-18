import { createContext, useContext, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

export const STAGE_W = 256;
/** Logical height range: one big screen over the phone's full height (DECISIONS.md #32). */
export const MIN_H = 448;
export const MAX_H = 560;

export interface StageSize {
  /** CSS pixels per logical pixel. */
  scale: number;
  /** Logical stage height (MIN_H…MAX_H). */
  height: number;
}

/**
 * [UI-1] Width is always 256 logical pixels. On DPR ≥ 2 the stage fills the
 * screen width (non-integer factors are invisible there); on DPR 1 an integer
 * factor is used unless it would be narrower than 85 %. The height fills the
 * screen between MIN_H and MAX_H; short screens shrink the scale to fit MIN_H.
 */
export function computeStage(cssWidth: number, cssHeight: number, dpr: number): StageSize {
  let scale = cssWidth / STAGE_W;
  if (dpr < 2) {
    const s = Math.floor((cssWidth * dpr) / STAGE_W);
    if (s >= 1 && (STAGE_W * s) / dpr >= 0.85 * cssWidth) scale = s / dpr;
  }
  if (MIN_H * scale > cssHeight) scale = cssHeight / MIN_H;
  const height = Math.max(MIN_H, Math.min(MAX_H, Math.floor(cssHeight / scale)));
  return { scale, height };
}

interface StageApi extends StageSize {
  /** Convert client (CSS) coordinates into logical stage pixels. */
  toLogical: (clientX: number, clientY: number) => { x: number; y: number };
}

const StageContext = createContext<StageApi>({ scale: 1, height: MIN_H, toLogical: (x, y) => ({ x, y }) });

export function useStage(): StageApi {
  return useContext(StageContext);
}

export function PixelStage({ children }: { children: ReactNode }) {
  const measureRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<StageSize>({ scale: 1, height: MIN_H });

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const update = () => setSize(computeStage(el.clientWidth, el.clientHeight, window.devicePixelRatio || 1));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { scale, height } = size;
  const api: StageApi = {
    scale,
    height,
    toLogical: (clientX, clientY) => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return { x: (clientX - rect.left) / scale, y: (clientY - rect.top) / scale };
    },
  };

  return (
    <div className="stage-outer">
      <div className="stage-measure" ref={measureRef}>
        <div className="stage-frame" style={{ width: STAGE_W * scale, height: height * scale }}>
          <div
            className="stage"
            ref={stageRef}
            style={{ transform: `scale(${scale})`, height }}
          >
            <StageContext.Provider value={api}>{children}</StageContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}
