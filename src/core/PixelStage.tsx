import { createContext, useContext, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

export const STAGE_W = 256;
export const STAGE_H = 448;

/**
 * [UI-1] Integer device-pixel scale where possible; non-integer when the
 * integer result would be narrower than 85 % of the screen. Additionally
 * limited by the available height so the stage never scrolls.
 */
export function computeScale(cssWidth: number, cssHeight: number, dpr: number): number {
  const s = Math.floor((cssWidth * dpr) / STAGE_W);
  let scale = s / dpr;
  if (s < 1 || STAGE_W * scale < 0.85 * cssWidth) scale = cssWidth / STAGE_W;
  if (STAGE_H * scale > cssHeight) scale = cssHeight / STAGE_H;
  return scale;
}

interface StageApi {
  scale: number;
  /** Convert client (CSS) coordinates into logical stage pixels. */
  toLogical: (clientX: number, clientY: number) => { x: number; y: number };
}

const StageContext = createContext<StageApi>({ scale: 1, toLogical: (x, y) => ({ x, y }) });

export function useStage(): StageApi {
  return useContext(StageContext);
}

export function PixelStage({ children }: { children: ReactNode }) {
  const measureRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const update = () => setScale(computeScale(el.clientWidth, el.clientHeight, window.devicePixelRatio || 1));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const api: StageApi = {
    scale,
    toLogical: (clientX, clientY) => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return { x: (clientX - rect.left) / scale, y: (clientY - rect.top) / scale };
    },
  };

  return (
    <div className="stage-outer">
      <div className="stage-measure" ref={measureRef}>
        <div className="stage-frame" style={{ width: STAGE_W * scale, height: STAGE_H * scale }}>
          <div className="stage" ref={stageRef} style={{ transform: `scale(${scale})` }}>
            <StageContext.Provider value={api}>{children}</StageContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}
