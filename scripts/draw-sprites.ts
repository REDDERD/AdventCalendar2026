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
hippogriff().save(path.join(OUT, 'puzzles/hippogriff.png'));
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
