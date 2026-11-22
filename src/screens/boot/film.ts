/**
 * Boot film: a cinematic flight across the Black Lake to Hogwarts, drawn live at
 * the stage's native resolution (256 px wide). Everything is built from simple
 * shapes in a small 2.5D camera, so the zoom stays crisp pixel art instead of a
 * blurry upscale. `renderFilm` is pure: the picture depends only on `FilmState`.
 *
 * Story: fade in → the owl swoops past the camera and flies ahead to the castle
 * (approach) → while the game is still loading it circles the Owlery spire
 * (hold, endless) → it dives into the Owlery window, the castle lights up,
 * fade to night (arrival).
 */
import { palette } from '../../assets/palette';

export const APPROACH_S = 3.2;
export const ARRIVAL_S = 1.6;
export const FADE_IN_S = 0.5;

export interface FilmState {
  /** Seconds since the film started (snow, twinkling, wing beats). */
  time: number;
  /** Approach progress 0…1. */
  approach: number;
  /** Seconds the owl has circled the Owlery while the game was still loading. */
  hold: number;
  /** Arrival progress 0…1 (stays 0 until loading has finished). */
  arrival: number;
  /** Fade-in progress 0…1. */
  intro: number;
}

interface V3 {
  x: number;
  y: number;
  z: number;
}

// ---------- Camera ----------

/** Focal length in stage pixels. */
const F = 280;
const CASTLE_Z = 1000;
const BACK_Z = 1030;

const CAM_START: V3 = { x: 10, y: 30, z: 0 };
const CAM_HOLD: V3 = { x: -40, y: 118, z: 815 };
const CAM_END: V3 = { x: -80, y: 141, z: 905 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z, b.z, t) });
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const stepped = (t: number, steps: number) => Math.ceil(clamp01(t) * steps) / steps;

function bezier(p0: V3, p1: V3, p2: V3, p3: V3, t: number): V3 {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return { x: a * p0.x + b * p1.x + c * p2.x + d * p3.x, y: a * p0.y + b * p1.y + c * p2.y + d * p3.y, z: a * p0.z + b * p1.z + c * p2.z + d * p3.z };
}

function holdCam(hold: number): V3 {
  return {
    x: CAM_HOLD.x + 3 * Math.sin(hold * 0.6),
    y: CAM_HOLD.y + 2 * Math.sin(hold * 0.9),
    z: CAM_HOLD.z + 6 * Math.sin(hold * 0.4),
  };
}

function cameraAt(st: FilmState): V3 {
  if (st.approach < 1) return lerp3(CAM_START, CAM_HOLD, easeInOut(st.approach));
  const held = holdCam(st.hold);
  return lerp3(held, CAM_END, easeInOut(seg(st.arrival, 0, 0.75)));
}

// ---------- Owl path ----------

/** The owl circles the Owlery spire while waiting. */
const LOOP = { x: -80, y: 182, z: CASTLE_Z, r: 24, speed: 1.5, start: 0.5 };
const loopPos = (a: number): V3 => ({ x: LOOP.x + LOOP.r * Math.cos(a), y: LOOP.y + 3 * Math.sin(2 * a), z: LOOP.z - LOOP.r * Math.sin(a) });
const OWL_WINDOW: V3 = { x: -80, y: 142, z: CASTLE_Z - 1 };

interface OwlPose {
  pos: V3;
  /** Size factor (shrinks to 0 as it slips through the window). */
  size: number;
  /** Wing-beat speed factor (glides while circling). */
  beat: number;
}

function owlAt(st: FilmState): OwlPose | null {
  if (st.approach < 1) {
    // Path relative to the camera: it starts right in front of the lens (bottom left)
    // and pulls ahead until it reaches the spire just as the camera settles.
    const end = loopPos(LOOP.start);
    const r3: V3 = { x: end.x - CAM_HOLD.x, y: end.y - CAM_HOLD.y, z: end.z - CAM_HOLD.z };
    const rel = bezier({ x: -5, y: -6, z: 12 }, { x: -2, y: -1, z: 28 }, { x: -18, y: 30, z: 110 }, r3, easeInOut(Math.min(1, st.approach * 1.05)));
    const cam = cameraAt(st);
    return { pos: { x: cam.x + rel.x, y: cam.y + rel.y, z: cam.z + rel.z }, size: 1, beat: 1 };
  }
  const angle = LOOP.start + st.hold * LOOP.speed;
  const looping = loopPos(angle);
  if (st.arrival <= 0) return { pos: looping, size: 1, beat: 0.6 + 0.4 * Math.max(0, Math.sin(st.hold * 1.3)) };
  const t = seg(st.arrival, 0, 0.42);
  if (t >= 1) return null;
  // Swing out in front of the tower, then into the window.
  const swing: V3 = { x: looping.x + 6, y: looping.y - 10, z: CASTLE_Z - 45 };
  const e = easeInOut(t);
  const u = 1 - e;
  const pos: V3 = {
    x: u * u * looping.x + 2 * u * e * swing.x + e * e * OWL_WINDOW.x,
    y: u * u * looping.y + 2 * u * e * swing.y + e * e * OWL_WINDOW.y,
    z: u * u * looping.z + 2 * u * e * swing.z + e * e * OWL_WINDOW.z,
  };
  return { pos, size: 1 - seg(t, 0.7, 1), beat: 1.2 };
}

// ---------- Raster helpers ----------

type Ctx = CanvasRenderingContext2D;

/** Solid polygon from screen points (x0, y0, x1, y1, …), scanline-filled so the edges stay pixel-hard. */
function poly(ctx: Ctx, pts: number[], color: string): void {
  let minY = Infinity, maxY = -Infinity;
  for (let i = 1; i < pts.length; i += 2) {
    minY = Math.min(minY, pts[i]);
    maxY = Math.max(maxY, pts[i]);
  }
  const top = Math.max(0, Math.floor(minY));
  const bottom = Math.min(ctx.canvas.height, Math.ceil(maxY));
  if (bottom <= top) return;
  ctx.fillStyle = color;
  const n = pts.length / 2;
  const xs: number[] = [];
  for (let y = top; y < bottom; y++) {
    const sy = y + 0.5;
    xs.length = 0;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const x0 = pts[i * 2], y0 = pts[i * 2 + 1], x1 = pts[j * 2], y1 = pts[j * 2 + 1];
      if ((y0 <= sy && y1 > sy) || (y1 <= sy && y0 > sy)) xs.push(x0 + ((sy - y0) * (x1 - x0)) / (y1 - y0));
    }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const a = Math.round(xs[k]);
      const b = Math.round(xs[k + 1]);
      if (b > a) ctx.fillRect(a, y, b - a, 1);
    }
  }
}

/** Screen rectangle with shared rounded edges (no seams between neighbours); `min1` keeps tiny lights visible. */
function rect(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, color: string, min1 = false): void {
  let a = Math.round(Math.min(x0, x1)), b = Math.round(Math.max(x0, x1));
  let c = Math.round(Math.min(y0, y1)), d = Math.round(Math.max(y0, y1));
  if (min1) {
    if (b <= a) b = a + 1;
    if (d <= c) d = c + 1;
  }
  if (b <= a || d <= c) return;
  ctx.fillStyle = color;
  ctx.fillRect(a, c, b - a, d - c);
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Layer transform for everything at depth z: local (x, y) → screen. */
interface Layer {
  ox: number;
  oy: number;
  s: number;
}

function layerAt(cam: V3, z: number, worldX: number, W: number, horizon: number): Layer {
  const s = F / (z - cam.z);
  return { ox: W / 2 + (worldX - cam.x) * s, oy: horizon + cam.y * s, s };
}

const X = (l: Layer, x: number) => l.ox + x * l.s;
const Y = (l: Layer, y: number) => l.oy - y * l.s;

function lpoly(ctx: Ctx, l: Layer, pts: number[], color: string): void {
  const out: number[] = [];
  for (let i = 0; i < pts.length; i += 2) out.push(X(l, pts[i]), Y(l, pts[i + 1]));
  poly(ctx, out, color);
}

function lrect(ctx: Ctx, l: Layer, x0: number, y0: number, x1: number, y1: number, color: string, min1 = false): void {
  rect(ctx, X(l, x0), Y(l, y1), X(l, x1), Y(l, y0), color, min1);
}

// ---------- Palette ----------

const C = {
  skyTop: '#040817',
  sky: [palette.night, '#0f1b3d', '#142247', palette.nightLight, '#24365f', '#2f4573'],
  water: ['#16264c', '#0f1c3c', '#0b1530', '#081026', '#060c1e'],
  mountainFar: '#22335c',
  mountainFarSnow: '#5a6f9e',
  mountainNear: '#16213f',
  mountainNearSnow: '#3f5384',
  forest: '#0b161f',
  forestLit: '#152633',
  forestSnow: '#8ea3c4',
  cliff: '#121729',
  cliffLit: '#222b46',
  cliffDark: '#0b0f1c',
  front: { main: '#363b58', lit: '#535b84', dark: '#262a42' },
  back: { main: '#272b44', lit: '#363d5e', dark: '#1d2035' },
  roofLit: '#2f3d6c',
  roofDark: '#1a2246',
  roofBackLit: '#232f57',
  roofBackDark: '#151b38',
  snow: '#dbe5f6',
  snowBack: '#a9b8d4',
  unlit: '#151a2c',
  lights: [palette.candle, palette.flame, palette.candleLight],
};

// ---------- Castle ----------

interface Tower {
  x0: number;
  x1: number;
  top: number;
  /** Apex of the conical roof; omitted for battlements. */
  roof?: number;
}

const BASE = 40; // bodies start below the cliff top (hidden behind it)
const CLIFF_TOP = 60;

const BACK_TOWERS: Tower[] = [
  { x0: 54, x1: 72, top: 190, roof: 228 }, // Astronomy Tower
  { x0: -40, x1: -24, top: 150, roof: 176 },
  { x0: 84, x1: 98, top: 128, roof: 150 },
  { x0: -132, x1: -120, top: 112, roof: 130 },
];
const FRONT_TOWERS: Tower[] = [
  { x0: -88, x1: -72, top: 160, roof: 194 }, // Owlery
  { x0: -58, x1: -44, top: 118 },
  { x0: 46, x1: 60, top: 138, roof: 162 },
  { x0: 100, x1: 112, top: 100, roof: 118 },
  { x0: -114, x1: -102, top: 92, roof: 108 },
  { x0: -8, x1: 2, top: 128, roof: 146 },
];

interface Win {
  x: number;
  y: number;
  w: number;
  h: number;
  back: boolean;
  /** Lit before the owl arrives. */
  lit: boolean;
}

const WINDOWS: Win[] = (() => {
  const list: Win[] = [];
  const add = (x: number, y: number, w: number, h: number, back: boolean) =>
    list.push({ x, y, w, h, back, lit: hash(list.length + 3) < 0.6 });
  // Great Hall: tall windows
  for (let i = 0; i < 6; i++) add(6 + i * 7, 78, 3, 13, false);
  // Back wall
  for (let x = -118; x <= 112; x += 13) add(x, 86, 2, 3, true);
  add(61.5, 120, 3, 5, true);
  add(61.5, 150, 3, 5, true);
  add(61.5, 172, 3, 5, true);
  add(-33.5, 112, 3, 4, true);
  add(-33.5, 132, 3, 4, true);
  add(89.5, 104, 3, 4, true);
  add(-127.5, 98, 2, 3, true);
  add(-81, 104, 2, 4, false);
  add(-81, 120, 2, 4, false);
  add(-52, 90, 2, 4, false);
  add(-52, 104, 2, 4, false);
  add(51.5, 104, 3, 4, false);
  add(51.5, 122, 3, 4, false);
  add(105, 84, 2, 3, false);
  add(-109, 76, 2, 3, false);
  add(-4.5, 112, 3, 4, false);
  for (let x = -100; x <= 96; x += 16) add(x, 66, 2, 3, false);
  return list;
})();
/** The Owlery window the owl flies into. */
const OWLERY_WIN = { x0: -82, x1: -78, y0: 138, y1: 147 };

function drawTower(ctx: Ctx, l: Layer, t: Tower, back: boolean): void {
  const c = back ? C.back : C.front;
  const w = t.x1 - t.x0;
  lrect(ctx, l, t.x0, BASE, t.x1, t.top, c.main);
  lrect(ctx, l, t.x0, BASE, t.x0 + w * 0.22, t.top, c.lit);
  lrect(ctx, l, t.x1 - w * 0.2, BASE, t.x1, t.top, c.dark);
  const mid = (t.x0 + t.x1) / 2;
  if (t.roof === undefined) {
    // Battlements
    for (let x = t.x0; x < t.x1 - 0.5; x += 3) lrect(ctx, l, x, t.top, Math.min(x + 1.6, t.x1), t.top + 3, c.main);
    lrect(ctx, l, t.x0, t.top - 1, t.x1, t.top, back ? C.snowBack : C.snow);
    return;
  }
  const e0 = t.x0 - 1.6, e1 = t.x1 + 1.6;
  lpoly(ctx, l, [e0, t.top, mid, t.top, mid, t.roof], back ? C.roofBackLit : C.roofLit);
  lpoly(ctx, l, [mid, t.top, e1, t.top, mid, t.roof], back ? C.roofBackDark : C.roofDark);
  // Snow on the eaves follows the roof slope
  const k = (2.4 * (mid - e0)) / (t.roof - t.top);
  lpoly(ctx, l, [e0, t.top, e1, t.top, e1 - k, t.top + 2.4, e0 + k, t.top + 2.4], back ? C.snowBack : C.snow);
  lrect(ctx, l, mid - 0.4, t.roof, mid + 0.4, t.roof + 3, palette.gold, true);
}

function drawWall(ctx: Ctx, l: Layer, x0: number, x1: number, top: number, back: boolean): void {
  const c = back ? C.back : C.front;
  lrect(ctx, l, x0, BASE, x1, top, c.main);
  for (let x = x0; x < x1 - 0.5; x += 3) lrect(ctx, l, x, top, Math.min(x + 1.6, x1), top + 2.5, c.main);
  lrect(ctx, l, x0, top - 0.8, x1, top, back ? C.snowBack : C.snow);
}

function windowColor(i: number, time: number, wave: number, x: number): string {
  const w = WINDOWS[i];
  // Wave of light spreading from the Owlery after the owl arrives
  const reached = wave > 0 && wave * 260 > Math.abs(x - OWLERY_WIN.x0) + hash(i) * 30;
  if (!w.lit && !reached) return C.unlit;
  if (reached && !w.lit) return C.lights[2];
  const flicker = hash(i * 7.3 + Math.floor(time * 3 + hash(i) * 10));
  return flicker < 0.18 ? C.lights[1] : C.lights[0];
}

function drawCastleLayer(ctx: Ctx, l: Layer, back: boolean, time: number, wave: number): void {
  if (back) {
    drawWall(ctx, l, -124, 118, 98, true);
    // Inner keep and halls fill the gaps between the towers
    drawWall(ctx, l, -70, -4, 124, true);
    lpoly(ctx, l, [-72, 124, -2, 124, -10, 136, -64, 136], C.roofBackDark);
    lpoly(ctx, l, [-72, 124, -37, 124, -37, 136, -64, 136], C.roofBackLit);
    drawWall(ctx, l, 20, 92, 114, true);
    for (const t of BACK_TOWERS) drawTower(ctx, l, t, true);
    // Astronomy Tower balcony
    lrect(ctx, l, 52, 164, 74, 166, C.back.lit);
  } else {
    drawWall(ctx, l, -122, 122, 76, false);
    // Great Hall with its long pitched roof
    lrect(ctx, l, 2, BASE, 50, 108, C.front.main);
    lrect(ctx, l, 2, BASE, 5, 108, C.front.lit);
    lpoly(ctx, l, [0, 108, 52, 108, 47, 122, 5, 122], C.roofDark);
    lpoly(ctx, l, [0, 108, 26, 108, 26, 122, 5, 122], C.roofLit);
    lpoly(ctx, l, [5, 122, 47, 122, 46, 123.2, 6, 123.2], C.snow);
    for (const t of FRONT_TOWERS) drawTower(ctx, l, t, false);
  }
  WINDOWS.forEach((w, i) => {
    if (w.back !== back) return;
    lrect(ctx, l, w.x, w.y, w.x + w.w, w.y + w.h, windowColor(i, time, wave, w.x), true);
  });
  if (!back) {
    const glow = wave > 0 ? C.lights[2] : C.lights[0];
    lrect(ctx, l, OWLERY_WIN.x0, OWLERY_WIN.y0, OWLERY_WIN.x1, OWLERY_WIN.y1, glow, true);
    // Pointed arch
    lpoly(ctx, l, [OWLERY_WIN.x0, OWLERY_WIN.y1, OWLERY_WIN.x1, OWLERY_WIN.y1, (OWLERY_WIN.x0 + OWLERY_WIN.x1) / 2, OWLERY_WIN.y1 + 2.5], glow);
    lrect(ctx, l, OWLERY_WIN.x0 - 0.6, OWLERY_WIN.y0 - 0.8, OWLERY_WIN.x1 + 0.6, OWLERY_WIN.y0, C.snow);
  }
}

const CLIFF = [-158, 0, -146, 14, -136, 24, -131, 38, -124, 46, -122, CLIFF_TOP, 122, CLIFF_TOP, 127, 50, 133, 36, 141, 22, 150, 10, 162, 0];

function drawCliff(ctx: Ctx, l: Layer): void {
  lpoly(ctx, l, CLIFF, C.cliff);
  // Moonlit left flank, shadowed right flank, thin rock strata
  lpoly(ctx, l, [-158, 0, -146, 14, -136, 24, -131, 38, -124, 46, -122, CLIFF_TOP, -104, CLIFF_TOP, -112, 44, -118, 30, -126, 16, -134, 0], C.cliffLit);
  lpoly(ctx, l, [104, CLIFF_TOP, 122, CLIFF_TOP, 127, 50, 133, 36, 141, 22, 150, 10, 162, 0, 128, 0, 124, 18, 116, 36, 110, 50], C.cliffDark);
  for (const [x0, x1, y, slope] of [[-110, 100, 50, 2], [-118, 60, 38, -1.5], [-96, 118, 27, 1], [-126, 40, 15, 1.5], [-60, 140, 7, -1]]) {
    lpoly(ctx, l, [x0, y, x1, y + slope, x1, y + slope - 0.9, x0, y - 0.9], C.cliffDark);
  }
  lrect(ctx, l, -122, CLIFF_TOP - 1.8, 122, CLIFF_TOP + 0.6, C.snow);
  lpoly(ctx, l, [-124, 46, -110, 47, -100, 44.5, -118, 44], C.snowBack);
  lpoly(ctx, l, [-136, 24, -126, 25, -120, 22.5, -132, 22], C.snowBack);
  // Boathouse steps with a lantern
  lrect(ctx, l, -20, 0, -10, 6, C.cliffLit);
  lrect(ctx, l, -16, 6, -14, 9, palette.candle, true);
}

// ---------- Landscape ----------

interface Ridge {
  z: number;
  pts: number[];
  caps: number[][];
  color: string;
  snow: string;
}

function makeRidge(seed: number, z: number, minH: number, maxH: number, color: string, snow: string): Ridge {
  const rnd = mulberry32(seed);
  const pts: number[] = [-7000, 0];
  const peaks: Array<[number, number]> = [];
  for (let x = -7000; x <= 7000; x += 260 + rnd() * 260) {
    const h = minH + (maxH - minH) * rnd();
    pts.push(x, h);
    peaks.push([x, h]);
  }
  pts.push(7000, 0);
  const caps: number[][] = [];
  for (let i = 1; i < peaks.length - 1; i++) {
    const [x, h] = peaks[i];
    if (h < peaks[i - 1][1] || h < peaks[i + 1][1]) continue;
    const [lx, lh] = peaks[i - 1];
    const [rx, rh] = peaks[i + 1];
    const k = 0.28;
    caps.push([x, h, lerp(x, lx, k), lerp(h, lh, k), lerp(x, (x + lx) / 2, k * 0.6), lerp(h, h - (h - lh) * 0.5, k), lerp(x, rx, k * 0.7), lerp(h, rh, k * 0.7)]);
  }
  return { z, pts, caps, color, snow };
}

const RIDGES = [
  makeRidge(11, 9000, 260, 820, C.mountainFar, C.mountainFarSnow),
  makeRidge(23, 5200, 120, 420, C.mountainNear, C.mountainNearSnow),
];

interface Tree {
  x: number;
  h: number;
}

const FOREST_Z = 1700;
const TREES: Tree[] = (() => {
  const rnd = mulberry32(7);
  const list: Tree[] = [];
  for (let x = -1300; x < 1300; x += 9 + rnd() * 16) {
    if (x > -190 && x < 230) continue; // clearing behind the castle
    list.push({ x, h: 26 + rnd() * 34 + (x < 0 ? 12 : 0) });
  }
  return list;
})();

function drawForest(ctx: Ctx, l: Layer): void {
  lrect(ctx, l, -1400, 0, 1400, 5, C.forest);
  for (const t of TREES) {
    const w = t.h * 0.32;
    lpoly(ctx, l, [t.x - w, 4, t.x + w, 4, t.x, 4 + t.h], C.forest);
    lpoly(ctx, l, [t.x - w, 4, t.x, 4, t.x, 4 + t.h], C.forestLit);
    lpoly(ctx, l, [t.x - w * 0.25, 4 + t.h * 0.75, t.x + w * 0.25, 4 + t.h * 0.75, t.x, 4 + t.h], C.forestSnow);
  }
}

// ---------- Buffers ----------

export interface FilmBuffers {
  W: number;
  H: number;
  horizon: number;
  sky: HTMLCanvasElement;
  water: HTMLCanvasElement;
  far: HTMLCanvasElement;
  forest: HTMLCanvasElement;
  castle: HTMLCanvasElement;
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Vertical colour bands with ordered dithering at every band edge. */
function bandedGradient(cv: HTMLCanvasElement, y0: number, y1: number, colors: string[]): void {
  const ctx = cv.getContext('2d')!;
  const h = y1 - y0;
  if (h <= 0) return;
  const img = ctx.createImageData(cv.width, h);
  const cols = colors.map(rgb);
  for (let y = 0; y < h; y++) {
    const v = (y / Math.max(1, h - 1)) * (cols.length - 1);
    const band = Math.min(cols.length - 2, Math.floor(v));
    const frac = v - band;
    for (let x = 0; x < cv.width; x++) {
      const c = cols[BAYER[(y % 4) * 4 + (x % 4)] < frac ? band + 1 : band];
      const i = (y * cv.width + x) * 4;
      img.data[i] = c[0];
      img.data[i + 1] = c[1];
      img.data[i + 2] = c[2];
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, y0);
}

function canvas(W: number, H: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  return c;
}

export function createFilmBuffers(W: number, H: number): FilmBuffers {
  const horizon = Math.round(H * 0.56);
  const sky = canvas(W, H);
  bandedGradient(sky, 0, horizon + 8, [C.skyTop, ...C.sky]);
  const water = canvas(W, H);
  bandedGradient(water, horizon, H, C.water);
  return { W, H, horizon, sky, water, far: canvas(W, H), forest: canvas(W, H), castle: canvas(W, H) };
}

// ---------- Sky ----------

interface Star {
  x: number;
  y: number;
  b: number;
  big: boolean;
  phase: number;
  color: string;
}

let starCache: { H: number; stars: Star[] } | null = null;

function starsFor(W: number, horizon: number): Star[] {
  if (starCache?.H === horizon) return starCache.stars;
  const rnd = mulberry32(42);
  const stars: Star[] = [];
  for (let i = 0; i < 110; i++) {
    const y = Math.pow(rnd(), 1.4) * (horizon - 12);
    stars.push({
      x: Math.floor(rnd() * W),
      y: Math.floor(y),
      b: 0.35 + rnd() * 0.65,
      big: rnd() < 0.07,
      phase: rnd() * Math.PI * 2,
      color: [palette.snow, palette.winterLight, palette.candleLight][Math.floor(rnd() * 3)],
    });
  }
  starCache = { H: horizon, stars };
  return stars;
}

function drawSky(ctx: Ctx, b: FilmBuffers, st: FilmState, cam: V3): void {
  ctx.drawImage(b.sky, 0, 0);
  const lift = (cam.y - CAM_START.y) * 0.04; // the sky drifts a little as the camera climbs
  for (const s of starsFor(b.W, b.horizon)) {
    const tw = 0.55 + 0.45 * Math.sin(st.time * (1.5 + s.phase) + s.phase * 3);
    ctx.globalAlpha = Math.max(0.15, s.b * tw);
    ctx.fillStyle = s.color;
    const y = Math.round(s.y + lift);
    ctx.fillRect(s.x, y, 1, 1);
    if (s.big && tw > 0.5) {
      ctx.globalAlpha *= 0.6;
      ctx.fillRect(s.x - 1, y, 1, 1);
      ctx.fillRect(s.x + 1, y, 1, 1);
      ctx.fillRect(s.x, y - 1, 1, 1);
      ctx.fillRect(s.x, y + 1, 1, 1);
    }
  }
  ctx.globalAlpha = 1;

  // Shooting star early in the approach
  const sh = seg(st.time, 1.1, 1.7);
  if (sh > 0 && sh < 1) {
    const x = Math.round(lerp(230, 140, sh));
    const y = Math.round(lerp(30, 70, sh));
    for (let i = 0; i < 9; i++) {
      ctx.globalAlpha = (1 - i / 9) * (1 - sh * 0.6);
      ctx.fillStyle = palette.candleLight;
      ctx.fillRect(x + i * 2, y - i, 2, 1);
    }
    ctx.globalAlpha = 1;
  }

  // Crescent moon with a soft halo
  const mx = Math.round(60 - (cam.x - CAM_START.x) * 0.05);
  const my = Math.round(b.horizon * 0.27 + lift);
  const halo = ctx.createRadialGradient(mx, my, 6, mx, my, 34);
  halo.addColorStop(0, 'rgba(246, 234, 208, 0.22)');
  halo.addColorStop(1, 'rgba(246, 234, 208, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(mx - 34, my - 34, 68, 68);
  for (let y = -10; y <= 10; y++) {
    for (let x = -10; x <= 10; x++) {
      if (x * x + y * y > 100) continue;
      const dx = x - 5, dy = y + 3;
      if (dx * dx + dy * dy <= 72) continue;
      ctx.fillStyle = x + y < -6 ? palette.parchmentLight : palette.parchment;
      ctx.fillRect(mx + x, my + y, 1, 1);
    }
  }
}

// ---------- Water ----------

/** Mirror `src` below `line` onto the lake, with ripples and broken rows. */
function reflect(ctx: Ctx, src: HTMLCanvasElement, line: number, H: number, time: number, alpha: number): void {
  const w = src.width;
  ctx.globalAlpha = alpha;
  const shift = Math.floor(time * 7);
  for (let r = line; r < H; r++) {
    const d = r - line;
    const from = line - d - 1;
    if (from < 0) break;
    if ((r + shift) % 6 === 0 && d > 2) continue;
    const dx = Math.round(Math.sin(r * 0.55 + time * 2.6) * Math.min(2, d / 14));
    ctx.drawImage(src, 0, from, w, 1, dx, r, w, 1);
  }
  ctx.globalAlpha = 1;
}

function moonGlitter(ctx: Ctx, x: number, from: number, H: number, time: number): void {
  ctx.fillStyle = palette.candleLight;
  const tick = Math.floor(time * 6);
  for (let r = from + 1; r < H; r += 2) {
    const d = r - from;
    const len = Math.round(1 + d * 0.09 + hash(r * 3.1 + tick) * (2 + d * 0.06));
    const jitter = Math.round((hash(r + tick * 1.7) - 0.5) * (2 + d * 0.1));
    ctx.globalAlpha = 0.18 + 0.32 * hash(r * 1.3 + tick * 0.7);
    ctx.fillRect(x - Math.floor(len / 2) + jitter, r, len, 1);
  }
  ctx.globalAlpha = 1;
}

// ---------- Snow ----------

interface Flake {
  nx: number;
  ny: number;
  z0: number;
  span: number;
  fall: number;
  sway: number;
}

const FLAKES: Flake[] = (() => {
  const rnd = mulberry32(99);
  const list: Flake[] = [];
  for (let i = 0; i < 230; i++) {
    const near = i % 3 === 0;
    list.push({ nx: rnd() * 2 - 1, ny: rnd() * 2 - 1, z0: rnd() * 1000, span: near ? 90 : 520, fall: 5 + rnd() * 6, sway: rnd() * 6 });
  }
  return list;
})();

const wrap = (v: number, min: number, max: number) => min + ((((v - min) % (max - min)) + (max - min)) % (max - min));

function drawSnow(ctx: Ctx, b: FilmBuffers, cam: V3, time: number, nearPass: boolean): void {
  const castleDist = CASTLE_Z - cam.z;
  ctx.fillStyle = palette.snow;
  for (const f of FLAKES) {
    const zr = 3 + wrap(f.z0 - cam.z, 0, f.span);
    if (nearPass !== zr <= castleDist) continue;
    const s = F / zr;
    const yRange = f.span * 0.95;
    const xr = f.nx * f.span * 0.5 + Math.sin(time * 0.8 + f.sway) * 1.5;
    const yr = wrap(f.ny * yRange - time * f.fall, -yRange, yRange);
    const x = Math.round(b.W / 2 + xr * s);
    const y = Math.round(b.horizon - yr * s);
    if (x < -2 || x > b.W + 2 || y < -2 || y > b.H + 2) continue;
    const size = s > 5 ? 2 : 1;
    ctx.globalAlpha = Math.max(0.25, Math.min(1, 1.15 - zr / f.span));
    ctx.fillRect(x, y, size, size);
  }
  ctx.globalAlpha = 1;
}

// ---------- Owl ----------

/** A tawny owl seen from behind, wings beating (flap −1 = up … 1 = down). */
function drawOwl(ctx: Ctx, sx: number, sy: number, k: number, flap: number): void {
  const span = 17 * k;
  if (span < 1) return;
  if (span < 6) {
    const up = flap < 0 ? -1 : 0;
    ctx.fillStyle = palette.parchment;
    ctx.fillRect(Math.round(sx), Math.round(sy), 1, 1);
    ctx.fillStyle = palette.woodLight;
    ctx.fillRect(Math.round(sx) - 1, Math.round(sy) + up, 1, 1);
    ctx.fillRect(Math.round(sx) + 1, Math.round(sy) + up, 1, 1);
    if (span >= 4) {
      ctx.fillRect(Math.round(sx) - 2, Math.round(sy) + up * 2, 1, 1);
      ctx.fillRect(Math.round(sx) + 2, Math.round(sy) + up * 2, 1, 1);
    }
    return;
  }
  const P = (x: number, y: number) => [sx + x * k, sy + y * k];
  // Wing outline (right side): rounded leading edge, fingered primaries, scalloped trailing edge.
  // Each point bends with the wing beat in proportion to its distance from the shoulder.
  const WING: Array<[number, number]> = [
    [1.4, -2.4], [3.6, -3.4], [6, -3.4], [8.2, -2.8], [9.6, -1.6], [9.9, -0.8],
    [9, -0.6], [9.4, 0], [8.2, 0], [8.4, 0.7], [7.1, 0.6], [7.1, 1.3],
    [5.6, 1.3], [5.4, 1.9], [4, 1.8], [3.6, 2.3], [2.2, 2.1], [1.4, 2],
  ];
  const COVERTS: Array<[number, number]> = [[1.4, -2.4], [3.6, -3.4], [6, -3.4], [6.6, -2.1], [4.6, -1.2], [2.6, -0.9], [1.4, -0.6]];
  const BAR: Array<[number, number]> = [[3.2, 0.4], [7.4, -0.6], [7.6, -0.1], [3.3, 1]];
  const TIPS: Array<[number, number]> = [[8.2, -2.8], [9.6, -1.6], [9.9, -0.8], [9, -0.6], [9.4, 0], [8.2, 0], [8.4, 0.7], [7.6, 0.6]];
  const bend = (x: number) => flap * (x - 1.4) * 0.48;
  const shape = (pts: Array<[number, number]>, side: 1 | -1) => pts.flatMap(([x, y]) => P(x * side, y + bend(x)));
  for (const side of [-1, 1] as const) {
    poly(ctx, shape(WING, side), palette.wood);
    poly(ctx, shape(TIPS, side), palette.woodDark);
    poly(ctx, shape(BAR, side), palette.woodLight);
    poly(ctx, shape(COVERTS, side), side < 0 ? palette.parchmentDark : palette.woodLight);
  }
  // Tail, body, head with ear tufts (seen from behind, moonlight from the left)
  poly(ctx, [...P(-1.4, 2.2), ...P(1.4, 2.2), ...P(1, 4.4), ...P(0, 4.9), ...P(-1, 4.4)], palette.woodDark);
  oval(ctx, sx, sy + 0.4 * k, 2.4 * k, 3 * k, palette.woodLight);
  oval(ctx, sx - 0.6 * k, sy - 0.2 * k, 1.2 * k, 1.8 * k, palette.parchmentDark);
  oval(ctx, sx, sy - 3.5 * k, 2.3 * k, 2.1 * k, palette.woodLight);
  oval(ctx, sx - 0.7 * k, sy - 4.1 * k, 1.1 * k, 1 * k, palette.parchmentDark);
  poly(ctx, [...P(-2.1, -4.4), ...P(-1.1, -5.4), ...P(-2.2, -6.4)], palette.woodDark);
  poly(ctx, [...P(2.1, -4.4), ...P(1.1, -5.4), ...P(2.2, -6.4)], palette.woodDark);
  // A few darker flecks on the back
  if (k >= 3) {
    for (const [x, y] of [[-0.8, 0.6], [0.9, 1.4], [0.2, -0.6], [-0.4, 2], [1, -2.9], [-0.3, -2.4]]) {
      oval(ctx, sx + x * k, sy + y * k, 0.3 * k, 0.22 * k, palette.wood);
    }
  }
}

function oval(ctx: Ctx, cx: number, cy: number, rx: number, ry: number, color: string): void {
  if (rx < 0.5 || ry < 0.5) return;
  ctx.fillStyle = color;
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
    const v = (y + 0.5 - cy) / ry;
    if (v * v > 1) continue;
    const half = rx * Math.sqrt(1 - v * v);
    const a = Math.round(cx - half), b = Math.round(cx + half);
    if (b > a) ctx.fillRect(a, y, b - a, 1);
  }
}

function owlScreen(b: FilmBuffers, cam: V3, pos: V3): { x: number; y: number; k: number } {
  const s = F / (pos.z - cam.z);
  return { x: b.W / 2 + (pos.x - cam.x) * s, y: b.horizon - (pos.y - cam.y) * s, k: s * 0.62 };
}

// ---------- Frame ----------

function clear(cv: HTMLCanvasElement): Ctx {
  const ctx = cv.getContext('2d')!;
  ctx.clearRect(0, 0, cv.width, cv.height);
  return ctx;
}

export function renderFilm(ctx: Ctx, b: FilmBuffers, st: FilmState): void {
  const { W, H, horizon } = b;
  const cam = cameraAt(st);
  const time = st.time;
  ctx.imageSmoothingEnabled = false;

  drawSky(ctx, b, st, cam);

  // Mountains (far layer) and the lake below them
  const far = clear(b.far);
  for (const r of RIDGES) {
    const l = layerAt(cam, r.z, 0, W, horizon);
    lpoly(far, l, r.pts, r.color);
    for (const cap of r.caps) lpoly(far, l, cap, r.snow);
  }
  ctx.drawImage(b.far, 0, 0);
  const farLine = Math.round(layerAt(cam, RIDGES[1].z, 0, W, horizon).oy);
  ctx.drawImage(b.water, 0, farLine, W, H - farLine, 0, farLine, W, H - farLine);
  reflect(ctx, b.far, farLine, H, time, 0.4);
  const moonX = Math.round(60 - (cam.x - CAM_START.x) * 0.05);
  moonGlitter(ctx, moonX, farLine, H, time);

  // Forbidden Forest on the far shore
  const forest = clear(b.forest);
  const fl = layerAt(cam, FOREST_Z, 0, W, horizon);
  drawForest(forest, fl);
  ctx.drawImage(b.forest, 0, 0);
  reflect(ctx, b.forest, Math.round(fl.oy), H, time, 0.35);

  drawSnow(ctx, b, cam, time, false);

  // Castle on its cliff (back towers, owl if behind, front, cliff)
  const owl = owlAt(st);
  const wave = seg(st.arrival, 0.42, 0.85);
  const castle = clear(b.castle);
  drawCastleLayer(castle, layerAt(cam, BACK_Z, 0, W, horizon), true, time, wave);
  const flapPhase = time * Math.PI * 2 * 3.4;
  const owlBehind = owl && owl.pos.z > CASTLE_Z;
  if (owl && owlBehind) {
    const o = owlScreen(b, cam, owl.pos);
    drawOwl(castle, o.x, o.y, o.k * owl.size, Math.sin(flapPhase * owl.beat));
  }
  const cl = layerAt(cam, CASTLE_Z, 0, W, horizon);
  drawCastleLayer(castle, cl, false, time, wave);
  drawCliff(castle, cl);
  reflect(ctx, b.castle, Math.round(cl.oy), H, time, 0.5);
  ctx.drawImage(b.castle, 0, 0);

  if (owl && !owlBehind) {
    const o = owlScreen(b, cam, owl.pos);
    drawOwl(ctx, o.x, o.y, o.k * owl.size, Math.sin(flapPhase * owl.beat));
  }

  drawSnow(ctx, b, cam, time, true);

  // The Owlery window flares up as the owl slips inside
  const flare = seg(st.arrival, 0.38, 0.62);
  if (flare > 0) {
    const wx = X(cl, (OWLERY_WIN.x0 + OWLERY_WIN.x1) / 2);
    const wy = Y(cl, (OWLERY_WIN.y0 + OWLERY_WIN.y1) / 2);
    const r = 6 + 70 * easeOut(flare);
    const g = ctx.createRadialGradient(wx, wy, 1, wx, wy, r);
    const a = Math.sin(flare * Math.PI) * 0.75 + (flare >= 1 ? 0.25 : 0.25 * flare);
    g.addColorStop(0, `rgba(255, 241, 194, ${a})`);
    g.addColorStop(0.35, `rgba(255, 210, 122, ${a * 0.5})`);
    g.addColorStop(1, 'rgba(255, 210, 122, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(wx - r, wy - r, r * 2, r * 2);
  }

  // Fade in from night, fade out to night
  const cover = Math.max(1 - stepped(st.intro, 4), stepped(seg(st.arrival, 0.78, 1), 4));
  if (cover > 0) {
    ctx.globalAlpha = cover;
    ctx.fillStyle = palette.night;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }
}
