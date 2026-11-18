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
