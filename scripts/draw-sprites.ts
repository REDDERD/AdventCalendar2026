// assets:draw – the agent's own pixel sprites [GFX-4]: sorting hat, pets, wands, house crests.
// Drawn from simple shapes so they stay editable; replace the PNGs later without code changes.
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hexToRgb } from '../src/character/recolor';

class Canvas {
  readonly png: PNG;
  constructor(readonly w: number, readonly h: number) {
    this.png = new PNG({ width: w, height: h });
  }
  set(x: number, y: number, hex: string | null): void {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 4;
    if (hex === null) {
      this.png.data[i + 3] = 0;
      return;
    }
    const [r, g, b] = hexToRgb(hex);
    this.png.data.set([r, g, b, 255], i);
  }
  filled(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return false;
    return this.png.data[(y * this.w + x) * 4 + 3] > 0;
  }
  get(x: number, y: number): string | null {
    if (!this.filled(x, y)) return null;
    const i = (y * this.w + x) * 4;
    return `#${[0, 1, 2].map((c) => this.png.data[i + c].toString(16).padStart(2, '0')).join('')}`;
  }
  rect(x: number, y: number, w: number, h: number, hex: string): void {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, hex);
  }
  /** Ellipse; `shade` picks a colour per pixel from its position (u, v in -1..1). */
  ellipse(cx: number, cy: number, rx: number, ry: number, shade: string | ((u: number, v: number) => string)): void {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const u = (x + 0.5 - cx) / rx;
        const v = (y + 0.5 - cy) / ry;
        if (u * u + v * v <= 1) this.set(x, y, typeof shade === 'string' ? shade : shade(u, v));
      }
    }
  }
  line(x0: number, y0: number, x1: number, y1: number, hex: string): void {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) this.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, hex);
  }
  /** Dark outline around every filled region (classic sprite contour). */
  outline(hex: string): void {
    const edge: Array<[number, number]> = [];
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (this.filled(x, y)) continue;
        if (this.filled(x + 1, y) || this.filled(x - 1, y) || this.filled(x, y + 1) || this.filled(x, y - 1)) edge.push([x, y]);
      }
    }
    for (const [x, y] of edge) this.set(x, y, hex);
  }
  save(file: string): void {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, PNG.sync.write(this.png));
  }
}

const ramp = (colors: string[], t: number) => colors[Math.max(0, Math.min(colors.length - 1, Math.floor(t * colors.length)))];
const OUT = path.resolve('public/assets');

// ---------- Sorting hat (64 × 64): patched, droopy tip, a fold for a mouth, on a stool ----------
function sortingHat(): Canvas {
  const c = new Canvas(64, 64);
  const brown = ['#3d2414', '#56341c', '#6e4526', '#8a5a34', '#a87444'];
  // stool
  c.rect(22, 54, 3, 9, '#5a3a20');
  c.rect(39, 54, 3, 9, '#5a3a20');
  c.rect(31, 55, 2, 8, '#4a2e18');
  c.ellipse(32, 53, 16, 3.5, (u) => (u < -0.3 ? '#6b4226' : u > 0.5 ? '#a87444' : '#8a5a34'));
  // brim
  c.ellipse(32, 47, 22, 5, (u, v) => ramp(brown, 0.15 + (u + 1) * 0.35 + (v < 0 ? 0.1 : -0.1)));
  // cone: base width 26 at y=46, tip near y=8 drooping to the right
  for (let y = 8; y <= 46; y++) {
    const t = (y - 8) / 38; // 0 at tip, 1 at base
    const half = 1 + t * 12.5;
    const droop = t < 0.35 ? (0.35 - t) * 34 : 0; // tip leans right
    const cx = 31 + droop;
    for (let x = Math.floor(cx - half); x <= Math.ceil(cx + half); x++) {
      const u = (x - cx) / half;
      // wrinkle bands every few rows
      const band = Math.sin(y * 0.9 + u * 2) > 0.85 ? -0.18 : 0;
      c.set(x, y, ramp(brown, 0.1 + (u + 1) * 0.42 + band));
    }
  }
  // patches with stitches
  c.rect(21, 42, 6, 3, '#5b6b3a');
  c.rect(37, 20, 5, 6, '#7a4a5a');
  for (const [x, y] of [[21, 42], [23, 42], [25, 42], [22, 44], [26, 44], [37, 20], [39, 20], [41, 22], [37, 25], [41, 25]]) c.set(x, y, '#e2cf9c');
  // face: heavy brow folds, squinting eye creases, a wide crooked mouth fold
  c.line(22, 29, 28, 28, '#2a170c');
  c.line(35, 28, 41, 29, '#2a170c');
  c.line(22, 30, 28, 29, '#a87444');
  c.line(35, 29, 41, 30, '#a87444');
  for (const [x0, x1] of [[23, 28], [35, 40]]) {
    c.line(x0, 32, x1, 32, '#140a04');
    c.line(x0 + 1, 33, x1 - 1, 33, '#140a04');
    c.set(x0 + 2, 32, '#f2d675'); // a glint in the eye
  }
  for (let x = 21; x <= 43; x++) {
    const curve = Math.round(Math.sin(((x - 21) / 22) * Math.PI) * 2.5);
    c.set(x, 38 + curve, '#140a04');
    c.set(x, 39 + curve, '#140a04');
    c.set(x, 37 + curve, '#3d2414');
    c.set(x, 40 + curve, '#a87444');
  }
  c.outline('#1a0e06');
  return c;
}

// ---------- Pets (32 × 32) ----------
function owl(): Canvas {
  const c = new Canvas(32, 32);
  const feathers = ['#4a3628', '#6b4f38', '#8c6a4a', '#b08a62'];
  c.ellipse(16, 20, 9, 10, (u, v) => ramp(feathers, 0.3 + (u + 1) * 0.3 - v * 0.1));
  c.ellipse(16, 23, 5.5, 6, (u, v) => ((Math.round((u + v) * 4) % 2 === 0) ? '#e6d2a8' : '#c9b080'));
  // ear tufts
  c.line(9, 9, 11, 13, '#4a3628');
  c.line(23, 9, 21, 13, '#4a3628');
  // facial disc and eyes
  c.ellipse(12.5, 15, 3.5, 3.5, '#f0e2c0');
  c.ellipse(19.5, 15, 3.5, 3.5, '#f0e2c0');
  c.ellipse(12.5, 15, 2, 2, '#f2b632');
  c.ellipse(19.5, 15, 2, 2, '#f2b632');
  c.set(12, 15, '#140c08');
  c.set(19, 15, '#140c08');
  c.set(13, 14, '#ffffff');
  c.set(20, 14, '#ffffff');
  c.rect(15, 17, 2, 2, '#e08a2a');
  // feet
  c.rect(12, 29, 3, 1, '#e08a2a');
  c.rect(18, 29, 3, 1, '#e08a2a');
  c.outline('#1e140e');
  return c;
}

function cat(): Canvas {
  const c = new Canvas(32, 32);
  const fur = ['#2e2e3a', '#4a4a5a', '#6a6a7e', '#8e8ea2'];
  // tail
  for (let i = 0; i < 9; i++) c.rect(22 + Math.round(Math.sin(i / 3) * 2), 28 - i, 2, 1, '#4a4a5a');
  c.ellipse(15, 23, 8, 7.5, (u) => ramp(fur, 0.2 + (u + 1) * 0.35));
  c.ellipse(15, 13, 6.5, 5.5, (u) => ramp(fur, 0.25 + (u + 1) * 0.35));
  // ears
  for (let i = 0; i < 4; i++) {
    c.rect(9 + i / 2, 5 + i, 4 - i, 1, '#4a4a5a');
    c.rect(17 + i / 2, 5 + i, 4 - i, 1, '#6a6a7e');
  }
  c.set(11, 7, '#d99aa0');
  c.set(19, 7, '#d99aa0');
  // white chest and paws
  c.ellipse(15, 22, 3, 4, '#e8e8f0');
  c.rect(11, 29, 3, 2, '#e8e8f0');
  c.rect(16, 29, 3, 2, '#e8e8f0');
  // eyes, nose
  c.rect(12, 12, 2, 2, '#9ad14a');
  c.rect(17, 12, 2, 2, '#9ad14a');
  c.set(12, 12, '#141418');
  c.set(18, 12, '#141418');
  c.set(15, 15, '#d97a86');
  c.outline('#141418');
  return c;
}

function toad(): Canvas {
  const c = new Canvas(32, 32);
  const skin = ['#3d5a22', '#55772c', '#6f9436', '#8fb34a'];
  c.ellipse(16, 22, 11, 7, (u, v) => ramp(skin, 0.3 + (u + 1) * 0.25 - v * 0.15));
  c.ellipse(16, 24, 6, 3.5, '#d8d08a');
  // eye bumps
  c.ellipse(10, 15, 3.5, 3.5, (u) => ramp(skin, 0.4 + u * 0.3));
  c.ellipse(22, 15, 3.5, 3.5, (u) => ramp(skin, 0.5 + u * 0.3));
  c.ellipse(10, 14.5, 1.8, 1.8, '#e8c040');
  c.ellipse(22, 14.5, 1.8, 1.8, '#e8c040');
  c.rect(9, 14, 2, 1, '#141408');
  c.rect(21, 14, 2, 1, '#141408');
  // warts and mouth
  for (const [x, y] of [[7, 21], [12, 19], [20, 19], [25, 22], [16, 18]]) c.set(x, y, '#3d5a22');
  c.line(11, 20, 21, 20, '#2a3e16');
  // legs
  c.ellipse(6, 27, 3.5, 2, '#55772c');
  c.ellipse(26, 27, 3.5, 2, '#6f9436');
  c.outline('#1a2a0c');
  return c;
}

// ---------- Wands (48 × 12) ----------
function wand(wood: string[], handle: string, tip: string): Canvas {
  const c = new Canvas(48, 12);
  for (let x = 4; x < 44; x++) {
    const thick = x < 16 ? 2 : 1;
    const y = 6 - Math.round((x - 4) * 0.05);
    for (let t = 0; t < thick + 1; t++) c.set(x, y + t, ramp(wood, x < 16 ? 0.1 + t * 0.3 : 0.4 + t * 0.4));
  }
  for (const x of [6, 9, 12]) c.line(x, 5, x, 8, handle);
  c.set(44, 4, tip);
  c.outline('#1a0e06');
  return c;
}

// ---------- House crests (24 × 28) ----------
const LETTER: Record<string, string[]> = {
  G: ['.###', '#...', '#.##', '#..#', '.###'],
  H: ['#..#', '#..#', '####', '#..#', '#..#'],
  R: ['###.', '#..#', '###.', '#.#.', '#..#'],
  S: ['.###', '#...', '.##.', '...#', '###.'],
};

function crest(primary: string, secondary: string, letter: string): Canvas {
  const c = new Canvas(24, 28);
  for (let y = 2; y < 26; y++) {
    const narrow = y > 16 ? Math.round((y - 16) * 0.9) : 0;
    for (let x = 2 + narrow; x < 22 - narrow; x++) {
      const border = x === 2 + narrow || x === 21 - narrow || y === 2 || x === 3 + narrow || x === 20 - narrow || y === 3;
      c.set(x, y, border ? secondary : primary);
    }
  }
  LETTER[letter].forEach((row, j) =>
    [...row].forEach((ch, i) => {
      if (ch !== '#') return;
      c.rect(8 + i * 2, 8 + j * 2, 2, 2, secondary);
    }),
  );
  c.outline('#140c08');
  return c;
}

// ---------- Emote bubbles (16 × 16), classic RPG style ----------
const GLYPHS: Record<string, { color: string; rows: string[] }> = {
  exclaim: { color: '#c23b3b', rows: ['.##.', '.##.', '.##.', '.##.', '....', '.##.'] },
  question: { color: '#2e5a8f', rows: ['.###.', '##.##', '...##', '..##.', '.....', '..##.'] },
  heart: { color: '#d8405a', rows: ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'] },
  note: { color: '#4f6b3a', rows: ['..###', '..#.#', '..#.#', '..#..', '###..', '###..'] },
  dots: { color: '#3a3440', rows: ['#.#.#'] },
};

function emote(name: string): Canvas {
  const c = new Canvas(16, 16);
  if (name === 'sweat') {
    // a single drop, no bubble
    c.ellipse(9, 10, 3.5, 3.5, (u, v) => (u + v < -0.6 ? '#ffffff' : '#a9cbe8'));
    for (let i = 0; i < 4; i++) c.rect(9 - i / 3, 3 + i, 1 + i / 2, 1, '#a9cbe8');
    c.outline('#2e5a8f');
    return c;
  }
  c.ellipse(8, 7, 7, 6, '#fff8ea');
  c.set(5, 13, '#fff8ea');
  c.set(5, 14, '#fff8ea');
  c.set(6, 13, '#fff8ea');
  const { color, rows } = GLYPHS[name];
  const ox = 8 - Math.floor(rows[0].length / 2);
  const oy = 7 - Math.floor(rows.length / 2);
  rows.forEach((row, j) => [...row].forEach((ch, i) => ch === '#' && c.set(ox + i, oy + j, color)));
  c.outline('#2b2a33');
  return c;
}
for (const name of ['exclaim', 'question', 'heart', 'sweat', 'note', 'dots']) emote(name).save(path.join(OUT, `emotes/${name}.png`));

// ---------- Puzzle pieces ----------

/** Floating candle (32 × 32): lit with a flame, unlit with a curl of smoke – differs by shape, not only colour. */
function candle(lit: boolean): Canvas {
  const c = new Canvas(32, 32);
  const wax = lit ? ['#e8d5a6', '#f6ead0', '#fff8ea'] : ['#a89a80', '#c9b994', '#ddd0b0'];
  for (let y = 14; y < 30; y++) for (let x = 12; x < 20; x++) c.set(x, y, ramp(wax, (x - 12) / 8));
  c.rect(12, 14, 8, 1, wax[2]);
  c.rect(13, 15, 2, 3, wax[2]); // wax drip
  c.rect(15, 11, 1, 3, '#3a3440'); // wick
  if (lit) {
    c.ellipse(15.5, 7.5, 3, 5, (u, v) => (Math.abs(u) < 0.45 && v > -0.2 ? '#fff1c2' : v < -0.4 ? '#ff9a3c' : '#ffd27a'));
  } else {
    for (const [x, y] of [[16, 9], [17, 8], [17, 7], [16, 6], [15, 5], [15, 4], [16, 3]]) c.set(x, y, '#9aa0b0');
  }
  c.outline('#2b2a33');
  return c;
}

/** Mandrake in a pot (16 × 16). */
function mandrake(): Canvas {
  const c = new Canvas(16, 16);
  for (let y = 9; y < 15; y++) {
    const inset = Math.floor((y - 9) / 3);
    for (let x = 3 + inset; x < 13 - inset; x++) c.set(x, y, x < 6 ? '#a8502c' : x > 10 - inset ? '#7a3420' : '#c4683c');
  }
  c.rect(2, 8, 12, 2, '#d47a48');
  c.ellipse(8, 7, 3, 2, '#c9a66b'); // the root's head peeking out
  c.set(7, 7, '#3a3440');
  c.set(9, 7, '#3a3440');
  for (const [x0, lean] of [[6, -1], [8, 0], [10, 1]]) {
    for (let i = 0; i < 4; i++) c.set(x0 + Math.round((lean * i) / 2), 4 - i, i > 1 ? '#7ab84a' : '#4f8a3c');
  }
  c.outline('#2b1a10');
  return c;
}

/** p18 "Die Tür, die erscheint" (105 × 105 = 3 × 3 tiles of 35 px, shown at 2×). */
function door(): Canvas {
  const c = new Canvas(105, 105);
  // stone wall
  for (let y = 0; y < 105; y++) {
    for (let x = 0; x < 105; x++) {
      const row = Math.floor(y / 9);
      const brickEdge = y % 9 === 0 || (x + (row % 2) * 9) % 18 === 0;
      c.set(x, y, brickEdge ? '#3a3846' : (x * 7 + y * 13) % 11 === 0 ? '#5d5a6a' : '#514e5e');
    }
  }
  // arch frame and door leaf
  const inArch = (x: number, y: number, r: number) => (y >= 40 ? Math.abs(x - 52) <= r : Math.hypot(x - 52, y - 40) <= r);
  for (let y = 6; y < 105; y++) {
    for (let x = 14; x < 92; x++) {
      if (inArch(x, y, 37) && !inArch(x, y, 31)) c.set(x, y, (x + y) % 7 === 0 ? '#9a96a8' : '#857f94');
      else if (inArch(x, y, 31)) {
        const plank = Math.floor((x - 21) / 10);
        const seam = (x - 21) % 10 === 0;
        c.set(x, y, seam ? '#2b1a10' : ['#6b4226', '#7a4c2c', '#5f3a20', '#734828', '#68401f', '#7d4f2e'][plank % 6]);
        if (!seam && (x * 3 + y * 5) % 23 === 0) c.set(x, y, '#4e2f18'); // wood grain
      }
    }
  }
  // round window with candle glow
  c.ellipse(52, 30, 9, 9, '#2b1a10');
  c.ellipse(52, 30, 7, 7, (u, v) => (Math.hypot(u, v) < 0.45 ? '#fff1c2' : '#ffd27a'));
  c.rect(45, 30, 15, 1, '#2b1a10');
  c.rect(52, 23, 1, 15, '#2b1a10');
  // iron hinges with bolts
  for (const y of [48, 86]) {
    c.rect(21, y, 30, 4, '#2b2a33');
    for (const x of [24, 32, 40, 48]) c.set(x, y + 1, '#7a7788');
  }
  // brass knocker ring and keyhole
  c.ellipse(70, 68, 6, 6, '#d4a73a');
  c.ellipse(70, 68, 3.5, 3.5, '#734828');
  c.rect(69, 60, 3, 3, '#f2d675');
  c.rect(60, 80, 3, 5, '#1a1423');
  c.rect(59, 79, 5, 2, '#1a1423');
  // star runes in the arch stones
  for (const [x, y] of [[22, 22], [82, 22], [52, 7]]) {
    c.set(x, y, '#a9cbe8');
    c.set(x - 1, y, '#5d8fc7');
    c.set(x + 1, y, '#5d8fc7');
    c.set(x, y - 1, '#5d8fc7');
    c.set(x, y + 1, '#5d8fc7');
  }
  // a pot of mistletoe on the left, a mouse hole on the right – detail for the bottom tiles
  c.rect(4, 92, 8, 9, '#a8502c');
  c.ellipse(8, 89, 5, 3, '#4f8a3c');
  c.set(6, 88, '#f6ead0');
  c.set(10, 88, '#f6ead0');
  c.ellipse(98, 100, 4, 5, '#1a1423');
  return c;
}

/** Tiny 3 × 5 capitals for labels in puzzle pictures. */
const LETTERS: Record<string, string[]> = {
  A: ['.#.', '#.#', '###', '#.#', '#.#'],
  B: ['##.', '#.#', '##.', '#.#', '##.'],
  C: ['.##', '#..', '#..', '#..', '.##'],
  D: ['##.', '#.#', '#.#', '#.#', '##.'],
  E: ['###', '#..', '##.', '#..', '###'],
  F: ['###', '#..', '##.', '#..', '#..'],
};
function label(c: Canvas, text: string, x: number, y: number, color: string): void {
  [...text].forEach((ch, k) =>
    LETTERS[ch].forEach((row, j) => [...row].forEach((p, i) => p === '#' && c.set(x + k * 4 + i, y + j, color))),
  );
}

/**
 * p21 "Zahnräder" (256 × 132): crank on A, chain A–B–C, a crossed belt C–D,
 * D–E–F with a pointer on F. A ring of three gears (which would jam) sits
 * close to B but does not touch it.
 */
function gearTrain(): Canvas {
  const c = new Canvas(256, 132);
  for (let y = 0; y < 132; y++) for (let x = 0; x < 256; x++) c.set(x, y, (x + y) % 4 === 0 ? '#e2cc98' : '#e8d5a6');
  const brass = ['#7a5a1c', '#a8802a', '#d4a73a', '#f2d675'];
  const gear = (cx: number, cy: number, r: number, colors: string[], phase = 0) => {
    const teeth = Math.max(6, Math.round(r * 0.7));
    for (let y = Math.floor(cy - r - 4); y <= cy + r + 4; y++) {
      for (let x = Math.floor(cx - r - 4); x <= cx + r + 4; x++) {
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
        const a = Math.atan2(y + 0.5 - cy, x + 0.5 - cx);
        const tooth = Math.cos(teeth * a + phase) > 0;
        if (d <= r || (d <= r + 3 && tooth)) {
          const light = (x - cx + (y - cy)) / (r * 2);
          c.set(x, y, d > r * 0.45 && d < r * 0.6 ? colors[0] : colors[Math.max(0, Math.min(3, Math.round(2 - light * 2)))]);
        }
      }
    }
    c.ellipse(cx, cy, 2.5, 2.5, '#2b1a10');
  };
  // ring of three (decoy): same brass, only a narrow gap to B
  gear(64.5, 118, 9, brass);
  gear(87.5, 118, 9, brass, 0.4);
  gear(76, 98, 9, brass, 0.8);
  // main train
  gear(36, 50, 18, brass);
  gear(64, 72, 12, brass, 0.5);
  gear(94, 64, 16, brass, 0.2);
  gear(170, 40, 14, brass, 0.3);
  gear(188, 62, 10, brass, 0.1);
  gear(208, 87, 16, brass, 0.6);
  // crossed belt C–D on small pulleys
  c.ellipse(94, 64, 9, 9, '#3b2414');
  c.ellipse(170, 40, 9, 9, '#3b2414');
  for (const d of [0, 1]) {
    c.line(94, 55 + d, 170, 48 + d, '#3b2414');
    c.line(94, 72 - d, 170, 31 - d, '#3b2414');
  }
  c.ellipse(94, 64, 2.5, 2.5, '#d4a73a');
  c.ellipse(170, 40, 2.5, 2.5, '#d4a73a');
  // crank on A with a clockwise arrow
  c.line(36, 50, 22, 36, '#3b2414');
  c.line(37, 50, 23, 36, '#3b2414');
  c.ellipse(21, 35, 3, 3, '#8e1b1b');
  for (let k = 0; k <= 40; k++) {
    const a = (-150 + k * 3) * (Math.PI / 180);
    c.rect(36 + Math.cos(a) * 26, 50 + Math.sin(a) * 26, 2, 2, '#c23b3b');
  }
  const tip = (-30 * Math.PI) / 180;
  const [tx, ty] = [36 + Math.cos(tip) * 26, 50 + Math.sin(tip) * 26];
  // arrowhead pointing along the clockwise direction (down-right at -30°)
  for (let i = 0; i < 6; i++) c.rect(tx - 4 + i * 0.5 + 1, ty - 3 + i, 8 - i * 1.2, 1, '#c23b3b');
  // pointer on F
  c.line(208, 87, 226, 72, '#1a1423');
  c.line(209, 87, 227, 72, '#1a1423');
  c.rect(226, 70, 3, 3, '#c23b3b');
  // labels
  label(c, 'A', 8, 54, '#1a1423');
  label(c, 'B', 52, 84, '#1a1423');
  label(c, 'C', 112, 48, '#1a1423');
  label(c, 'D', 168, 15, '#1a1423');
  label(c, 'E', 202, 50, '#1a1423');
  label(c, 'F', 228, 102, '#1a1423');
  return c;
}

/** The Advent clock (96 × 120): calendar picture and source of the app icons [UI-5]. */
function adventClock(): Canvas {
  const c = new Canvas(96, 120);
  const wood = ['#3b2414', '#5a3a20', '#6b4226', '#8a5a34', '#9a6a3c'];
  // case: arched crown, head, waist, base with feet – lit from the left
  for (let y = 2; y < 16; y++) for (let x = 12; x < 84; x++) {
    const u = (x - 48) / 36;
    const v = (16 - y) / 14;
    if (u * u + v * v <= 1) c.set(x, y, ramp(wood, 0.55 - u * 0.25));
  }
  const block = (x: number, y: number, w: number, h: number) => {
    c.rect(x, y, w, h, wood[2]);
    c.rect(x, y, 1, h, wood[4]);
    c.rect(x + w - 2, y, 2, h, wood[1]);
  };
  block(10, 14, 76, 44);
  block(24, 58, 48, 44);
  block(16, 102, 64, 12);
  c.rect(18, 114, 8, 4, wood[0]);
  c.rect(70, 114, 8, 4, wood[0]);
  // clock face, stopped at midnight
  c.ellipse(48, 36, 21, 21, (u, v) => (u + v < -0.5 ? '#f2d675' : '#a8802a'));
  c.ellipse(48, 36, 19, 19, wood[0]);
  c.ellipse(48, 36, 17, 17, (u, v) => (u + v < -0.9 ? '#fff8ea' : '#f6ead0'));
  for (let h = 0; h < 12; h++) {
    const a = (h / 12) * Math.PI * 2;
    c.rect(48 + Math.sin(a) * 14, 36 - Math.cos(a) * 14, h % 3 === 0 ? 2 : 1, h % 3 === 0 ? 2 : 1, '#3b2414');
  }
  c.rect(47, 23, 2, 13, '#1a1423');
  c.rect(47, 27, 2, 9, '#1a1423');
  c.ellipse(48, 36, 2, 2, '#d4a73a');
  // pendulum window with the brass pendulum
  c.rect(34, 64, 28, 34, '#1b2a4e');
  c.rect(47, 64, 2, 22, '#d4a73a');
  c.ellipse(48, 88, 5, 5, (u, v) => (u + v < -0.4 ? '#f2d675' : '#d4a73a'));
  // 24 little doors as dots on the waist
  for (let i = 0; i < 4; i++) {
    c.rect(27, 62 + i * 9, 4, 5, '#c4512a');
    c.rect(65, 62 + i * 9, 4, 5, '#c4512a');
  }
  // holly on the crown, a star on top
  c.ellipse(36, 12, 4, 2.5, '#2e5a2a');
  c.ellipse(60, 12, 4, 2.5, '#2e5a2a');
  c.rect(46, 10, 2, 2, '#c23b3b');
  c.rect(49, 11, 2, 2, '#c23b3b');
  for (const [x, y] of [[48, 0], [47, 1], [49, 1], [46, 2], [50, 2], [48, 2], [48, 3]]) c.set(x, y, '#f2d675');
  c.outline('#1a1423');
  return c;
}

/** App icon: the clock centred on midnight blue (size × size). */
function appIcon(size: number): Canvas {
  const c = new Canvas(size, size);
  c.rect(0, 0, size, size, '#0b1530');
  const clock = adventClock();
  // nearest-neighbour sampling, so the clock fills ~85 % of the height at any icon size
  const scale = (size * 0.85) / 120;
  const ox = Math.floor((size - 96 * scale) / 2);
  const oy = Math.floor((size - 120 * scale) / 2);
  for (let y = 0; y < 120 * scale; y++) for (let x = 0; x < 96 * scale; x++) {
    const hex = clock.get(Math.floor(x / scale), Math.floor(y / scale));
    if (hex) c.set(ox + x, oy + y, hex);
  }
  return c;
}

adventClock().save(path.join(OUT, 'ui/clock.png'));
for (const size of [180, 192, 512]) appIcon(size).save(path.resolve(`public/icons/icon-${size}.png`));

/** p01 (256 × 64): the clock face, hands at a right angle (three o'clock). */
function clockFace(): Canvas {
  const c = new Canvas(256, 64);
  for (let y = 0; y < 64; y++) for (let x = 0; x < 256; x++) c.set(x, y, (x + y) % 4 === 0 ? '#1b2a4e' : '#0b1530');
  c.ellipse(128, 32, 30, 30, '#6b4226');
  c.ellipse(128, 32, 27, 27, (u, v) => (u + v < -0.9 ? '#fff8ea' : '#f6ead0'));
  for (let h = 0; h < 12; h++) {
    const a = (h / 12) * Math.PI * 2;
    const len = h % 3 === 0 ? 5 : 2;
    for (let r = 24 - len; r <= 24; r++) c.rect(128 + Math.sin(a) * r, 32 - Math.cos(a) * r, h % 3 === 0 ? 2 : 1, h % 3 === 0 ? 2 : 1, '#3b2414');
  }
  for (let r = 0; r <= 19; r++) c.rect(127, 32 - r, 2, 1, '#1a1423'); // minute hand to 12
  for (let r = 0; r <= 13; r++) c.rect(128 + r, 31, 1, 3, '#1a1423'); // hour hand to 3
  c.ellipse(128, 32, 2.5, 2.5, '#d4a73a');
  // candles left and right
  for (const x of [60, 196]) {
    c.rect(x, 30, 6, 22, '#e8d5a6');
    c.ellipse(x + 3, 25, 2, 4, '#ffd27a');
  }
  return c;
}

/** p06 treats (16 × 16): row icons of the boot grid. */
function treat(kind: 'star' | 'mandarin' | 'nut' | 'licorice' | 'gingerbread'): Canvas {
  const c = new Canvas(16, 16);
  if (kind === 'star') {
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const a = Math.atan2(y - 8, x - 8);
        const r = Math.hypot(x - 7.5, y - 8);
        const edge = 4 + 3.5 * Math.max(0, Math.cos(5 * (a + Math.PI / 2)));
        if (r <= edge) c.set(x, y, r < edge - 1.5 ? '#fff8ea' : '#a8743c');
      }
    }
  } else if (kind === 'mandarin') {
    c.ellipse(8, 9, 6, 5.5, (u, v) => (u + v < -0.6 ? '#ffb05a' : '#e8781e'));
    c.rect(7, 2, 2, 2, '#4f8a3c');
    c.rect(9, 2, 3, 1, '#7ab84a');
  } else if (kind === 'nut') {
    c.ellipse(8, 8, 5.5, 6.5, (u, v) => (Math.abs(u) < 0.12 ? '#6b4226' : u + v < -0.5 ? '#c9a66b' : '#9a6a3c'));
    for (let y = 4; y < 13; y += 3) c.rect(5, y, 6, 1, '#7a4c2c');
  } else if (kind === 'licorice') {
    // licorice snail: a spiral with visible gaps
    c.ellipse(8, 8, 7, 7, '#3a3440');
    for (let a = 0; a < Math.PI * 5; a += 0.02) {
      const r = 0.6 + (a / (Math.PI * 5)) * 6;
      c.set(8 + Math.cos(a) * r, 8 + Math.sin(a) * r, '#1a1423');
    }
  } else {
    // gingerbread heart with icing
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const u = (x - 7.5) / 6.5;
        const v = (7 - y) / 6.5;
        const heart = (u * u + v * v - 0.6) ** 3 - u * u * v * v * v < 0;
        if (heart) c.set(x, y, '#9a5a2c');
      }
    }
    for (const [x, y] of [[5, 6], [7, 8], [9, 6], [11, 8]]) c.set(x, y, '#fff8ea');
  }
  c.outline('#2b1a10');
  return c;
}

/** 3 × 5 digits and "?" for number plates. */
const DIGITS: Record<string, string[]> = {
  0: ['###', '#.#', '#.#', '#.#', '###'],
  1: ['.#.', '##.', '.#.', '.#.', '###'],
  2: ['###', '..#', '###', '#..', '###'],
  3: ['###', '..#', '.##', '..#', '###'],
  4: ['#.#', '#.#', '###', '..#', '..#'],
  5: ['###', '#..', '###', '..#', '###'],
  6: ['###', '#..', '###', '#.#', '###'],
  7: ['###', '..#', '.#.', '.#.', '.#.'],
  8: ['###', '#.#', '###', '#.#', '###'],
  9: ['###', '#.#', '###', '..#', '###'],
  '?': ['###', '..#', '.##', '...', '.#.'],
};
function digits(c: Canvas, text: string, cx: number, y: number, color: string, scale = 2): void {
  const w = text.length * 4 * scale - scale;
  [...text].forEach((ch, k) =>
    DIGITS[ch].forEach((row, j) =>
      [...row].forEach((p, i) => p === '#' && c.rect(cx - w / 2 + (k * 4 + i) * scale, y + j * scale, scale, scale, color)),
    ),
  );
}

/** p07 (256 × 72): five owls with ring numbers on a perch, the sixth place is empty. */
function owlPerch(): Canvas {
  const c = new Canvas(256, 72);
  for (let y = 0; y < 72; y++) for (let x = 0; x < 256; x++) c.set(x, y, (x * 3 + y * 7) % 23 === 0 ? '#2a3a66' : '#1b2a4e');
  c.rect(0, 40, 256, 4, '#6b4226'); // perch
  c.rect(0, 40, 256, 1, '#9a6a3c');
  const owl = PNG.sync.read(fs.readFileSync(path.join(OUT, 'sprites/pet_owl.png')));
  const numbers = ['1', '4', '6', '11', '21', '?'];
  numbers.forEach((n, i) => {
    const cx = 22 + i * 42;
    if (n !== '?') {
      for (let y = 0; y < 32; y++) {
        for (let x = 0; x < 32; x++) {
          const k = (y * 32 + x) * 4;
          if (owl.data[k + 3] > 0) c.set(cx - 16 + x, 10 + y, `#${[0, 1, 2].map((j) => owl.data[k + j].toString(16).padStart(2, '0')).join('')}`);
        }
      }
    }
    c.rect(cx - 13, 50, 26, 16, n === '?' ? '#c4512a' : '#e8d5a6');
    c.rect(cx - 13, 50, 26, 1, '#3b2414');
    c.rect(cx - 13, 65, 26, 1, '#3b2414');
    digits(c, n, cx, 53, n === '?' ? '#fff1c2' : '#1a1423');
  });
  return c;
}

/** A key (24 × 24): bow shape, number of teeth, metal (p10). */
const METALS: Record<string, string[]> = {
  brass: ['#7a5a1c', '#d4a73a', '#f2d675'],
  silver: ['#6a6878', '#c0c8d0', '#f4f8ff'],
  iron: ['#2b2a33', '#5a5866', '#8a889a'],
};
function keySprite(bow: 'round' | 'square' | 'heart', teeth: number, metal: keyof typeof METALS): Canvas {
  const c = new Canvas(24, 24);
  const [dark, mid, light] = METALS[metal];
  const shade = (u: number, v: number) => (u + v < -0.5 ? light : u + v > 0.6 ? dark : mid);
  if (bow === 'round') c.ellipse(6, 12, 5.5, 5.5, shade);
  else if (bow === 'square') for (let y = 6; y < 18; y++) for (let x = 1; x < 12; x++) c.set(x, y, shade((x - 6) / 6, (y - 12) / 6));
  else {
    for (let y = 5; y < 19; y++) {
      for (let x = 0; x < 13; x++) {
        const u = (x - 6) / 6;
        const v = (12 - y) / 6.5;
        if ((u * u + v * v - 0.55) ** 3 - u * u * v * v * v < 0) c.set(x, y, shade(u, -v));
      }
    }
  }
  for (let x = 5; x < 8; x++) for (let y = 11; y < 14; y++) c.set(x, y, null); // the hole
  c.rect(11, 11, 12, 3, mid); // shaft
  c.rect(11, 11, 12, 1, light);
  for (let t = 0; t < teeth; t++) c.rect(20 - t * 4, 14, 2, 4 - (t % 2), mid);
  c.outline('#1a1423');
  return c;
}

/** p10 (256 × 120): Grimsby's key board, 3 × 3 hooks, the bottom right one empty. */
function keyBoard(grid: Array<[string, number, string] | null>): Canvas {
  const c = new Canvas(256, 120);
  for (let y = 0; y < 120; y++) for (let x = 0; x < 256; x++) c.set(x, y, (y % 12 === 0 ? '#5a3a20' : (x * 5 + y * 3) % 31 === 0 ? '#7a4c2c' : '#6b4226'));
  c.rect(60, 4, 136, 112, '#9a6a3c'); // board
  c.rect(60, 4, 136, 2, '#c99a5c');
  c.rect(60, 114, 136, 2, '#3b2414');
  grid.forEach((key, i) => {
    const cx = 84 + (i % 3) * 44;
    const cy = 10 + Math.floor(i / 3) * 36;
    c.rect(cx - 1, cy, 3, 4, '#2b2a33'); // hook
    if (key) {
      const sprite = keySprite(key[0] as 'round', key[1], key[2] as 'brass');
      for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
        const hex = sprite.get(x, y);
        if (hex) c.set(cx - 6 + x, cy + 3 + y, hex);
      }
    } else {
      digits(c, '?', cx + 6, cy + 9, '#fff1c2');
    }
  });
  return c;
}

const P10: Array<[string, number, string] | null> = [
  ['round', 1, 'brass'], ['square', 2, 'iron'], ['heart', 3, 'silver'],
  ['square', 3, 'iron'], ['heart', 1, 'silver'], ['round', 2, 'brass'],
  ['heart', 2, 'silver'], ['round', 3, 'brass'], null,
];
/** p11 animals (16 × 16, shown at 2×): a hippogriff and a ferret. */
function hippogriff(): Canvas {
  const c = new Canvas(16, 16);
  c.ellipse(9, 10, 5, 3.5, (_u, v) => (v < -0.3 ? '#b4b2c2' : '#8a889a')); // horse body
  for (const x of [5, 7, 11, 13]) c.rect(x, 12, 1, 3, '#6a6878'); // legs
  c.rect(13, 8, 2, 2, '#8a889a'); // tail
  c.ellipse(4.5, 6, 2.8, 3, (u, v) => (u + v < -0.4 ? '#f4f8ff' : '#c0c8d0')); // eagle head
  c.rect(1, 6, 2, 1, '#d4a73a'); // beak
  c.set(1, 7, '#d4a73a');
  c.set(4, 5, '#1a1423'); // eye
  for (let i = 0; i < 5; i++) c.rect(7 + i, 7 - Math.floor(i / 2), 1, 3, '#a8a6b8'); // wing
  c.outline('#2b2a33');
  return c;
}
function ferret(): Canvas {
  const c = new Canvas(16, 16);
  c.ellipse(8, 11, 6, 2.5, (_u, v) => (v < -0.2 ? '#f6ead0' : '#e2cc98')); // long body
  c.ellipse(3, 9, 2.5, 2.2, '#f6ead0'); // head
  c.rect(1, 8, 2, 2, '#c9a66b'); // mask
  c.set(2, 8, '#1a1423'); // eye
  c.set(0, 10, '#d8405a'); // nose
  c.rect(13, 10, 3, 1, '#c9a66b'); // tail
  for (const x of [4, 6, 10, 12]) c.rect(x, 13, 1, 2, '#c9a66b');
  c.outline('#3b2414');
  return c;
}
/** p13w (256 × 96): a snowy clearing as a 6 × 6 grid of crossings, five trees, start top left, gate bottom right. */
const P13W_TREES = ['1,1', '1,4', '2,4', '3,1', '4,1'];
function centaurClearing(): Canvas {
  const c = new Canvas(256, 96);
  for (let y = 0; y < 96; y++) for (let x = 0; x < 256; x++) c.set(x, y, (x * 5 + y * 3) % 17 === 0 ? '#c9d6e8' : '#e4ecf6');
  const X = (i: number) => 38 + i * 36;
  const Y = (j: number) => 8 + j * 16;
  // paths: right and down only
  for (let j = 0; j < 6; j++) for (let i = 0; i < 6; i++) {
    if (i < 5) c.rect(X(i), Y(j) - 1, 36, 3, '#c9a66b');
    if (j < 5) c.rect(X(i) - 1, Y(j), 3, 16, '#c9a66b');
  }
  for (let j = 0; j < 6; j++) for (let i = 0; i < 6; i++) {
    if (P13W_TREES.includes(`${j},${i}`)) {
      c.ellipse(X(i), Y(j) + 5, 4, 2, '#9aa6b8'); // shadow
      for (let k = 0; k < 12; k++) c.rect(X(i) - Math.floor(k / 2), Y(j) - 9 + k, 1 + 2 * Math.floor(k / 2), 1, k < 3 ? '#f4f8ff' : k % 4 === 0 ? '#2e5a3a' : '#3f7a4a');
      c.rect(X(i) - 1, Y(j) + 3, 3, 3, '#5a3a20');
    } else {
      c.ellipse(X(i), Y(j), 2.5, 2.5, '#8a5a34');
    }
  }
  // start: hoof prints coming out of the forest edge; goal: a wooden gate
  c.ellipse(X(0), Y(0), 6, 6, '#d4a73a');
  c.ellipse(X(0), Y(0), 3.5, 3.5, '#e4ecf6');
  for (let k = 0; k < 3; k++) c.ellipse(6 + k * 9, Y(0) + (k % 2 ? 3 : -2), 2, 1.5, '#6b4226');
  c.rect(X(5) + 6, Y(5) - 9, 3, 14, '#6b4226');
  c.rect(X(5) + 18, Y(5) - 9, 3, 14, '#6b4226');
  for (const dy of [-6, -1, 3]) c.rect(X(5) + 6, Y(5) + dy, 15, 2, '#9a6a3c');
  c.line(X(5) + 7, Y(5) + 4, X(5) + 20, Y(5) - 7, '#9a6a3c');
  return c;
}

/** Knopf the niffler (64 × 64, standing at the bottom like the LPC figures): black fur, duck bill, a gold coin. */
function niffler(): Canvas {
  // small: about half the height of a person on the stage
  const c = new Canvas(64, 64);
  const fur = (u: number, v: number) => (u + v < -0.7 ? '#4a4856' : u + v > 0.5 ? '#1a1423' : '#2b2a33');
  c.ellipse(32, 55, 8, 6.5, fur); // round body
  c.ellipse(32, 46, 6, 5.5, fur); // head
  c.ellipse(27, 41, 2, 2, fur); // ears
  c.ellipse(37, 41, 2, 2, fur);
  c.ellipse(32, 50, 4, 2, (u) => (u < -0.2 ? '#c99a7a' : '#e2b48e')); // flat duck bill
  c.rect(30, 49, 4, 1, '#9a6a4a');
  for (const x of [29, 35]) c.rect(x, 44, 2, 2, '#f4f8ff'); // shiny eyes
  for (const x of [30, 35]) c.set(x, 45, '#1a1423');
  c.ellipse(32, 58, 5, 3, (u, v) => (u + v < -0.4 ? '#f2d675' : '#d4a73a')); // the coin it hugs
  for (const x of [26, 38]) c.ellipse(x, 57, 2, 1.5, '#3a3440'); // paws on the coin
  for (const x of [28, 36]) c.rect(x - 1, 61, 3, 2, '#3a3440'); // feet
  c.outline('#0b0a10');
  return c;
}

// ---------- p15w "Was glänzt?" (256 × 192): twelve finds from Knopf's hoard in 4 × 3 cells ----------
type Metal = 'gold' | 'silver' | 'brass';
const COIN: Record<Metal, string[]> = {
  gold: ['#7a5a1c', '#a8802a', '#d4a73a', '#f2d675'],
  silver: ['#5a5866', '#8a889a', '#c0c8d0', '#f4f8ff'],
  brass: ['#4a4024', '#6a5a30', '#8a7a48', '#9a8a58'], // dull: no bright highlight
};
interface Find {
  kind: 'coin' | 'spoon' | 'chocolate' | 'button';
  metal?: Metal;
  reeded?: boolean;
  emblem?: 'dragon' | 'griffin' | null;
}
const HOARD: Find[] = [
  { kind: 'coin', metal: 'gold', reeded: false, emblem: 'dragon' },
  { kind: 'coin', metal: 'gold', reeded: true, emblem: 'dragon' }, // real
  { kind: 'spoon' },
  { kind: 'chocolate', metal: 'gold', reeded: false, emblem: 'dragon' },
  { kind: 'coin', metal: 'gold', reeded: true, emblem: 'dragon' }, // real
  { kind: 'coin', metal: 'silver', reeded: true, emblem: 'dragon' },
  { kind: 'button', metal: 'gold', reeded: true, emblem: null },
  { kind: 'coin', metal: 'gold', reeded: true, emblem: 'dragon' }, // real
  { kind: 'coin', metal: 'gold', reeded: true, emblem: 'griffin' },
  { kind: 'spoon' },
  { kind: 'coin', metal: 'gold', reeded: true, emblem: 'dragon' }, // real
  { kind: 'coin', metal: 'brass', reeded: true, emblem: 'dragon' },
];

/** Side view of a dragon: bat wing with points, horned head, long tail with an arrow tip. */
function dragonEmblem(c: Canvas, cx: number, cy: number, col: string): void {
  const thick = (x0: number, y0: number, x1: number, y1: number) => {
    c.line(x0, y0, x1, y1, col);
    c.line(x0, y0 + 1, x1, y1 + 1, col);
  };
  c.ellipse(cx, cy + 4, 7, 3.5, col); // body
  thick(cx + 5, cy + 2, cx + 8, cy - 5); // neck
  c.rect(cx + 6, cy - 8, 5, 3, col); // head
  c.rect(cx + 11, cy - 7, 3, 2, col); // snout
  c.set(cx + 7, cy - 9, col); // horns
  c.set(cx + 6, cy - 10, col);
  // bat wing: a fan from the shoulder to three points with scallops between
  const tips: Array<[number, number]> = [[-11, -11], [-7, -7], [-5, -13], [-2, -7], [1, -11]];
  for (let k = 0; k < tips.length - 1; k++) {
    for (let t = 0; t <= 1; t += 0.1) {
      const x = tips[k][0] + (tips[k + 1][0] - tips[k][0]) * t;
      const y = tips[k][1] + (tips[k + 1][1] - tips[k][1]) * t;
      c.line(cx - 1, cy + 1, cx + x, cy + y, col);
    }
  }
  thick(cx - 6, cy + 5, cx - 12, cy + 8); // tail
  thick(cx - 12, cy + 8, cx - 15, cy + 4);
  c.rect(cx - 17, cy + 1, 4, 2, col); // arrow tip
  c.set(cx - 16, cy, col);
  for (const x of [cx - 4, cx + 3]) c.rect(x, cy + 7, 2, 3, col); // legs
}

/** Front view of a griffin: eagle head between two spread wings. */
function griffinEmblem(c: Canvas, cx: number, cy: number, col: string): void {
  for (const s of [-1, 1]) {
    for (let k = 0; k < 9; k++) c.line(cx + s * 2, cy + 2, cx + s * (12 - (k % 3)), cy - 6 + k, col);
  }
  c.ellipse(cx, cy - 4, 3, 3.5, col); // head
  c.rect(cx - 1, cy - 1, 2, 3, col); // beak
  c.ellipse(cx, cy + 5, 3, 4, col); // body
  for (const x of [cx - 3, cx + 2]) c.rect(x, cy + 8, 1, 3, col);
}

function coin(c: Canvas, cx: number, cy: number, f: Find): void {
  const [dark, mid, base, light] = COIN[f.metal ?? 'gold'];
  const r = 21;
  c.ellipse(cx, cy, r, r, (u, v) => (u + v < -0.9 && f.metal !== 'brass' ? light : u + v > 0.8 ? mid : base));
  // rim: reeded = notches sticking out all around (like a gear), smooth = one even ring
  for (let a = 0; a < 160; a++) {
    const ang = (a / 160) * Math.PI * 2;
    const notch = f.reeded && Math.floor(a / 4) % 2 === 0;
    for (let d = r - 3; d <= r + (notch ? 2 : 0); d++) {
      c.set(cx + Math.cos(ang) * d, cy + Math.sin(ang) * d, d >= r ? dark : d === r - 3 ? dark : mid);
    }
  }
  if (f.kind === 'button') {
    for (const [dx, dy] of [[-4, -4], [4, -4], [-4, 4], [4, 4]]) c.ellipse(cx + dx, cy + dy, 2, 2, '#2b1a10');
    return;
  }
  if (f.emblem === 'dragon') dragonEmblem(c, cx, cy, dark);
  if (f.emblem === 'griffin') griffinEmblem(c, cx, cy, dark);
  if (f.kind === 'chocolate') {
    // crinkled foil and a torn corner with chocolate underneath
    const rnd = (x: number, y: number) => ((x * 73 + y * 151) % 17) / 17;
    for (let y = cy - r + 4; y < cy + r - 4; y++) for (let x = cx - r + 4; x < cx + r - 4; x++) {
      if (Math.hypot(x - cx, y - cy) < r - 4 && rnd(x, y) > 0.86) c.set(x, y, light);
    }
    for (let y = cy + 6; y < cy + r; y++) for (let x = cx + 6; x < cx + r; x++) {
      if (Math.hypot(x - cx, y - cy) < r - 1 && x + y > cx + cy + 22) c.set(x, y, (x + y) % 3 ? '#5a3a20' : '#6b4226');
    }
  }
}

function spoon(c: Canvas, cx: number, cy: number): void {
  const [dark, , base, light] = COIN.silver;
  for (let k = 0; k < 30; k++) c.rect(cx - 15 + k, cy + 12 - Math.round(k * 0.8), 3, 2, k % 7 === 0 ? light : base); // handle
  c.ellipse(cx + 12, cy - 12, 8, 6, (u, v) => (u + v < -0.5 ? light : base)); // bowl
  c.ellipse(cx + 13, cy - 11, 4, 3, dark);
}

function hoard(): Canvas {
  const c = new Canvas(256, 192);
  for (let y = 0; y < 192; y++) for (let x = 0; x < 256; x++) c.set(x, y, (x * 7 + y * 11) % 31 === 0 ? '#5a3a20' : (x + y) % 2 ? '#2b1a10' : '#33200f');
  HOARD.forEach((f, i) => {
    const x = 6 + (i % 4) * 62;
    const y = 6 + Math.floor(i / 4) * 62;
    c.rect(x, y, 56, 56, '#3b2414');
    c.rect(x, y, 56, 1, '#5a3a20');
    if (f.kind === 'spoon') spoon(c, x + 28, y + 28);
    else coin(c, x + 28, y + 28, f);
  });
  return c;
}

// ---------- p15a "Das Porträt" (256 × 232): the knight of 1726 above, a retouched copy below ----------
function knightPortrait(c: Canvas, oy: number, original: boolean): void {
  // gold frame and a dark painted background
  c.rect(40, oy, 176, 112, '#a8802a');
  c.rect(42, oy + 2, 172, 108, '#f2d675');
  c.rect(45, oy + 5, 166, 102, '#7a5a1c');
  for (let y = oy + 7; y < oy + 105; y++) for (let x = 47; x < 209; x++) c.set(x, y, (x + y) % 5 === 0 ? '#2a2a3a' : '#1f2030');
  const steel = (u: number, v: number) => (u + v < -0.6 ? '#d8dee8' : u + v > 0.6 ? '#5a5866' : '#9aa2b0');
  // body: pauldrons and breastplate
  c.ellipse(104, oy + 52, 12, 8, steel);
  c.ellipse(152, oy + 52, 12, 8, steel);
  for (let y = oy + 46; y < oy + 104; y++) {
    const half = 26 - Math.max(0, (y - oy - 80) / 4);
    for (let x = 128 - half; x < 128 + half; x++) c.set(x, y, steel((x - 128) / half, (y - oy - 75) / 30));
  }
  c.rect(127, oy + 50, 2, 30, '#8a889a');
  // sword arm (viewer's left): arm down to the hand, sword held upright beside it
  c.rect(92, oy + 56, 10, 30, '#b8c0cc');
  c.rect(92, oy + 56, 2, 30, '#f4f8ff');
  c.rect(78, oy + 14, 4, 70, '#d8dee8'); // blade
  c.rect(78, oy + 14, 1, 70, '#ffffff');
  c.rect(70, oy + 84, 20, 4, '#a8802a'); // cross guard
  c.rect(77, oy + 88, 6, 8, '#5a3a20'); // grip
  c.ellipse(80, oy + 98, 4, 4, '#a8802a'); // pommel
  if (original) {
    // a tiny gear in the pommel
    c.ellipse(80, oy + 98, 3, 3, '#f2d675');
    for (const [dx, dy] of [[0, -4], [4, 0], [0, 4], [-4, 0]]) c.set(80 + dx, oy + 98 + dy, '#f2d675');
    c.set(80, oy + 98, '#7a5a1c');
  }
  c.ellipse(97, oy + 92, 5, 4, '#e8c39e'); // hand
  // ribbon tied round the sword arm: Isolde's blue in the original, red in the copy
  const ribbon = original ? ['#1d3f8a', '#3a6ac0'] : ['#8e1b1b', '#c23b3b'];
  c.rect(90, oy + 64, 14, 5, ribbon[0]);
  c.rect(90, oy + 64, 14, 2, ribbon[1]);
  c.rect(86, oy + 68, 3, 9, ribbon[0]);
  c.rect(91, oy + 69, 3, 8, ribbon[1]);
  // belt and, in the original, the clock key on the right hip
  c.rect(104, oy + 82, 48, 4, '#5a3a20');
  c.rect(124, oy + 81, 8, 6, '#d4a73a');
  if (original) {
    c.line(152, oy + 84, 166, oy + 88, '#a8802a');
    c.ellipse(168, oy + 90, 4, 4, '#d4a73a');
    c.ellipse(168, oy + 90, 1.5, 1.5, '#1f2030');
    c.rect(167, oy + 94, 2, 9, '#d4a73a');
    c.rect(169, oy + 99, 3, 2, '#d4a73a');
  }
  // head: brown hair, eyes, and the mouth – a smile only in the original
  c.ellipse(128, oy + 30, 11, 13, (u, v) => (u + v > 0.7 ? '#c9956a' : '#e8c39e'));
  c.ellipse(128, oy + 20, 12, 7, '#5a3a20');
  c.rect(116, oy + 20, 4, 14, '#5a3a20');
  c.rect(136, oy + 20, 4, 14, '#5a3a20');
  for (const x of [123, 132]) c.rect(x, oy + 28, 2, 2, '#1a1423');
  c.rect(127, oy + 31, 2, 3, '#c9956a'); // nose
  if (original) {
    c.rect(124, oy + 36, 8, 1, '#8e3b3b');
    c.set(123, oy + 35, '#8e3b3b');
    c.set(132, oy + 35, '#8e3b3b');
  } else {
    c.rect(125, oy + 36, 6, 1, '#6a3030');
  }
  // brass plate on the frame with the year
  c.rect(104, oy + 96, 48, 12, '#a8802a');
  c.rect(105, oy + 97, 46, 10, '#d4a73a');
  digits(c, original ? '1726' : '1826', 128, oy + 99, '#3b2414', 1);
}

function portraits(): Canvas {
  const c = new Canvas(256, 232);
  c.rect(0, 0, 256, 232, '#3a3440');
  knightPortrait(c, 0, true);
  knightPortrait(c, 120, false);
  return c;
}

/** A Christmas cracker (32 × 16) for p17: wrapped middle, twisted ends, a gold band. */
function cracker(main: string, dark: string, light: string): Canvas {
  const c = new Canvas(32, 16);
  for (let x = 8; x < 24; x++) for (let y = 4; y < 12; y++) c.set(x, y, y < 6 ? light : y > 9 ? dark : main);
  for (const side of [0, 1]) {
    for (let k = 0; k < 7; k++) {
      const x = side ? 24 + k : 7 - k;
      const half = k < 2 ? 2 - k : k - 2; // pinched near the body, flared at the end
      for (let y = 8 - half - 1; y <= 8 + half; y++) c.set(x, y, k < 2 ? dark : y < 7 ? light : main);
    }
  }
  c.rect(14, 4, 4, 8, '#d4a73a');
  c.rect(14, 4, 4, 2, '#f2d675');
  c.outline('#1a1423');
  return c;
}

/** 5 × 7 capitals for Isolde's handwriting (p14a). */
const HAND: Record<string, string[]> = {
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
};

/** p14a (256 × 80): a dungeon wall with Isolde's line written mirror-inverted, and a brass hand mirror. */
function mirrorWriting(word: string): Canvas {
  const c = new Canvas(256, 80);
  for (let y = 0; y < 80; y++) for (let x = 0; x < 256; x++) {
    const brick = (y % 16 === 0) || ((x + (Math.floor(y / 16) % 2) * 16) % 32 === 0);
    c.set(x, y, brick ? '#3a3440' : (x * 7 + y * 13) % 29 === 0 ? '#5a5866' : '#4a4856');
  }
  // the word, mirrored as a whole: letters flipped and in reverse order, slightly slanted
  const s = 4;
  const total = word.length * 6 * s - s;
  const x0 = 24;
  [...word].forEach((ch, k) =>
    HAND[ch].forEach((row, j) =>
      [...row].forEach((p, i) => {
        if (p !== '#') return;
        const x = x0 + total - (k * 6 + i + 1) * s - Math.floor(j / 3);
        c.rect(x, 22 + j * s, s, s, '#e8d5a6');
      }),
    ),
  );
  // brass hand mirror on the right
  c.ellipse(232, 34, 13, 17, '#a8802a');
  c.ellipse(232, 34, 10, 14, (u, v) => (u + v < -0.6 ? '#f4f8ff' : '#a9cbe8'));
  c.rect(229, 50, 6, 20, '#a8802a');
  c.rect(230, 50, 2, 20, '#f2d675');
  return c;
}

hippogriff().save(path.join(OUT, 'puzzles/hippogriff.png'));
mirrorWriting('QFOEFM').save(path.join(OUT, 'puzzles/p14a.png'));
niffler().save(path.join(OUT, 'sprites/knopf.png'));
hoard().save(path.join(OUT, 'puzzles/p15w.png'));
portraits().save(path.join(OUT, 'puzzles/p15a.png'));
cracker('#c23b3b', '#8e1b1b', '#e86a6a').save(path.join(OUT, 'puzzles/cracker_red.png'));
cracker('#4f8a3c', '#2e5a26', '#7ab84a').save(path.join(OUT, 'puzzles/cracker_green.png'));
cracker('#5d8fc7', '#2e5a8f', '#a9cbe8').save(path.join(OUT, 'puzzles/cracker_blue.png'));
centaurClearing().save(path.join(OUT, 'puzzles/p13w.png'));
ferret().save(path.join(OUT, 'puzzles/ferret.png'));
keyBoard(P10).save(path.join(OUT, 'puzzles/p10.png'));
for (const [name, bow, teeth, metal] of [
  ['a', 'square', 1, 'brass'], ['b', 'square', 1, 'iron'], ['c', 'round', 1, 'iron'], ['d', 'square', 2, 'iron'],
] as const) keySprite(bow, teeth, metal).save(path.join(OUT, `puzzles/p10_key_${name}.png`));

owlPerch().save(path.join(OUT, 'puzzles/p07.png'));
for (const kind of ['star', 'mandarin', 'nut', 'licorice', 'gingerbread'] as const) {
  treat(kind).save(path.join(OUT, `puzzles/treat_${kind}.png`));
}
clockFace().save(path.join(OUT, 'puzzles/p01.png'));
door().save(path.join(OUT, 'puzzles/p18_door.png'));
gearTrain().save(path.join(OUT, 'puzzles/p21_gears.png'));
candle(true).save(path.join(OUT, 'puzzles/candle_on.png'));
candle(false).save(path.join(OUT, 'puzzles/candle_off.png'));
mandrake().save(path.join(OUT, 'puzzles/mandrake.png'));

sortingHat().save(path.join(OUT, 'sprites/hat.png'));
owl().save(path.join(OUT, 'sprites/pet_owl.png'));
cat().save(path.join(OUT, 'sprites/pet_cat.png'));
toad().save(path.join(OUT, 'sprites/pet_toad.png'));
wand(['#3a2210', '#6b4226', '#9a6a3c'], '#d4a73a', '#ffd27a').save(path.join(OUT, 'ui/wand_phoenix.png'));
wand(['#1e1e24', '#3a3440', '#5a5060'], '#c23b3b', '#ff9a3c').save(path.join(OUT, 'ui/wand_dragon.png'));
wand(['#c8b896', '#e2d6b4', '#f6ead0'], '#a9cbe8', '#ffffff').save(path.join(OUT, 'ui/wand_unicorn.png'));
crest('#8e1b1b', '#d9a425', 'G').save(path.join(OUT, 'ui/crest_gryffindor.png'));
crest('#e0b320', '#2b2620', 'H').save(path.join(OUT, 'ui/crest_hufflepuff.png'));
crest('#1d3f8a', '#b08850', 'R').save(path.join(OUT, 'ui/crest_ravenclaw.png'));
crest('#1e6b3a', '#c0c8d0', 'S').save(path.join(OUT, 'ui/crest_slytherin.png'));
console.log('Drew hat, pets, wands and crests.');

// Preview for review: everything on one sheet, ×4
if (process.argv[2] === '--preview') {
  const items = [
    'sprites/hat.png', 'sprites/pet_owl.png', 'sprites/pet_cat.png', 'sprites/pet_toad.png',
    'ui/wand_phoenix.png', 'ui/wand_dragon.png', 'ui/wand_unicorn.png',
    'ui/crest_gryffindor.png', 'ui/crest_hufflepuff.png', 'ui/crest_ravenclaw.png', 'ui/crest_slytherin.png',
    'emotes/exclaim.png', 'emotes/question.png', 'emotes/heart.png', 'emotes/sweat.png', 'emotes/note.png', 'emotes/dots.png',
  ].map((f) => PNG.sync.read(fs.readFileSync(path.join(OUT, f))));
  const s = 4;
  const width = items.reduce((w, p) => w + (p.width + 4) * s, 0);
  const sheet = new PNG({ width, height: 64 * s });
  sheet.data.fill(0x3a);
  let ox = 0;
  for (const p of items) {
    for (let y = 0; y < p.height * s; y++) {
      for (let x = 0; x < p.width * s; x++) {
        const si = (Math.floor(y / s) * p.width + Math.floor(x / s)) * 4;
        if (!p.data[si + 3]) continue;
        const di = (y * width + ox + x) * 4;
        sheet.data.set([p.data[si], p.data[si + 1], p.data[si + 2], 255], di);
      }
    }
    ox += (p.width + 4) * s;
  }
  fs.writeFileSync(process.argv[3], PNG.sync.write(sheet));
}
