import { useEffect, useRef } from 'react';
import { STAGE_W, useStage } from '../../core/PixelStage';
import { bootTarget, finishBoot } from '../../core/ScreenMachine';
import { APPROACH_S, ARRIVAL_S, createFilmBuffers, FADE_IN_S, renderFilm, type FilmState } from './film';

/** The full approach plays once per app start; a later boot (after logging in) starts at the castle. */
let approachShown = false;

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * Boot screen: the owl's flight to Hogwarts while the game loads. The film never
 * stops halfway — if loading is quick it still ends with the owl reaching the
 * Owlery; if loading is slow the owl circles the spire until everything is ready.
 * With reduced motion a still picture is shown instead.
 */
export function BootScreen() {
  const { height } = useStage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const film = useRef<{ st: FilmState; still: boolean } | null>(null);
  if (!film.current) {
    const still = prefersReducedMotion();
    const skipApproach = approachShown || still;
    film.current = { still, st: { time: 0, approach: skipApproach ? 1 : 0, hold: 0, arrival: 0, intro: still ? 1 : 0 } };
  }

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    const { st, still } = film.current!;
    let raf = 0;
    const end = () => {
      approachShown = true;
      finishBoot();
    };
    if (!ctx) {
      end();
      return;
    }
    const buffers = createFilmBuffers(STAGE_W, height);
    renderFilm(ctx, buffers, st);

    let last = performance.now();
    const frame = (now: number) => {
      if (still) {
        if (bootTarget()) end();
        else raf = requestAnimationFrame(frame);
        return;
      }
      // Clamp the step so a paused tab resumes where it left off.
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      st.time += dt;
      st.intro = Math.min(1, st.intro + dt / FADE_IN_S);
      if (st.approach < 1) st.approach = Math.min(1, st.approach + dt / APPROACH_S);
      else if (st.arrival === 0 && !bootTarget()) st.hold += dt;
      else st.arrival = Math.min(1, st.arrival + dt / ARRIVAL_S);
      renderFilm(ctx, buffers, st);
      if (st.arrival >= 1) end();
      else raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [height]);

  return (
    <canvas
      ref={canvasRef}
      className="boot-film pixelated"
      width={STAGE_W}
      height={height}
      role="img"
      aria-label="Eine Eule fliegt über den See nach Hogwarts"
    />
  );
}
