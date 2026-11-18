// Building kit for the scene backgrounds (256 × 512, DECISIONS.md #32/#53): blocks from the
// LPC Base Assets tile sheets (assets-src/tilesets/lpc, CC-BY-SA 3.0 / GPL 3.0) plus a few
// drawn details (sky, snow, candles, banners) and the game's own sprites.
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const TILESETS = path.resolve('assets-src/tilesets/lpc');
const SPRITES = path.resolve('public/assets');
export const T = 32;

const sheets = new Map<string, PNG>();
export function sheet(name: string): PNG {
  if (!sheets.has(name)) sheets.set(name, PNG.sync.read(fs.readFileSync(path.join(TILESETS, `${name}.png`))));
  return sheets.get(name)!;
}

export type RGB = [number, number, number];
export const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
const mix = (a: RGB, b: RGB, t: number): RGB => a.map((v, i) => Math.round(v + (b[i] - v) * t)) as RGB;

/** Deterministic random numbers, so every build draws the same picture. */
export function random(seed: number): () => number {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

interface BlitOptions {
  flipX?: boolean;
  /** Change colours, e.g. green → snowy white. */
  recolor?: (rgb: RGB) => RGB;
  /** Extra opacity 0–1. */
  alpha?: number;
}

export class Picture {
  readonly png: PNG;
  constructor(readonly w = 256, readonly h = 512) {
    this.png = new PNG({ width: w, height: h });
  }

  /** Paint one pixel, blended over what is there. */
  dot(x: number, y: number, rgb: RGB, alpha = 1): void {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h || alpha <= 0) return;
    const i = (y * this.w + x) * 4;
    const d = this.png.data;
    const a = Math.min(1, alpha);
    const base: RGB = [d[i], d[i + 1], d[i + 2]];
    const out = d[i + 3] ? mix(base, rgb, a) : rgb;
    d[i] = out[0];
    d[i + 1] = out[1];
    d[i + 2] = out[2];
    d[i + 3] = Math.max(d[i + 3], Math.round(a * 255));
  }

  rect(x: number, y: number, w: number, h: number, color: string, alpha = 1): void {
    const rgb = hex(color);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.dot(x + i, y + j, rgb, alpha);
  }

  /** Vertical gradient between two colours. */
  gradient(y0: number, y1: number, top: string, bottom: string, x0 = 0, x1 = this.w): void {
    const a = hex(top);
    const b = hex(bottom);
    for (let y = y0; y < y1; y++) {
      const t = (y - y0) / Math.max(1, y1 - y0 - 1);
      // a little dithering keeps the gradient pixel-art like
      for (let x = x0; x < x1; x++) this.dot(x, y, mix(a, b, Math.min(1, t + (((x + y) % 2) - 0.5) * 0.04)));
    }
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, color: string, alpha = 1): void {
    const rgb = hex(color);
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++) {
      for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
        const u = (x + 0.5 - cx) / rx;
        const v = (y + 0.5 - cy) / ry;
        if (u * u + v * v <= 1) this.dot(x, y, rgb, alpha);
      }
    }
  }

  line(x0: number, y0: number, x1: number, y1: number, color: string, alpha = 1): void {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    const rgb = hex(color);
    for (let i = 0; i <= n; i++) this.dot(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, rgb, alpha);
  }

  /** Copy a pixel rectangle from a tile sheet. */
  blit(name: string, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, opts: BlitOptions = {}): void {
    const src = sheet(name);
    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const si = ((sy + y) * src.width + sx + (opts.flipX ? sw - 1 - x : x)) * 4;
        const a = src.data[si + 3] / 255;
        if (!a) continue;
        let rgb: RGB = [src.data[si], src.data[si + 1], src.data[si + 2]];
        if (opts.recolor) rgb = opts.recolor(rgb);
        this.dot(dx + x, dy + y, rgb, a * (opts.alpha ?? 1));
      }
    }
  }

  /** Copy a block of w × h tiles (32 px) from (col, row) to pixel (dx, dy). */
  tile(name: string, col: number, row: number, dx: number, dy: number, w = 1, h = 1, opts: BlitOptions = {}): void {
    this.blit(name, col * T, row * T, w * T, h * T, dx, dy, opts);
  }

  /** Repeat a tile block over a pixel area (clipped). */
  fill(name: string, col: number, row: number, x0: number, y0: number, x1: number, y1: number, w = 1, h = 1, opts: BlitOptions = {}): void {
    for (let y = y0; y < y1; y += h * T) {
      for (let x = x0; x < x1; x += w * T) {
        this.blit(name, col * T, row * T, Math.min(w * T, x1 - x), Math.min(h * T, y1 - y), x, y, opts);
      }
    }
  }

  /** One of the game's own sprites (public/assets/…), scaled by an integer factor. */
  sprite(file: string, dx: number, dy: number, scale = 1, frame?: { x: number; y: number; w: number; h: number }): void {
    const src = PNG.sync.read(fs.readFileSync(path.join(SPRITES, file)));
    const f = frame ?? { x: 0, y: 0, w: src.width, h: src.height };
    for (let y = 0; y < f.h * scale; y++) {
      for (let x = 0; x < f.w * scale; x++) {
        const si = ((f.y + Math.floor(y / scale)) * src.width + f.x + Math.floor(x / scale)) * 4;
        const a = src.data[si + 3] / 255;
        if (a) this.dot(dx + x, dy + y, [src.data[si], src.data[si + 1], src.data[si + 2]], a);
      }
    }
  }

  /** A starry night sky with a few brighter stars. */
  stars(x0: number, y0: number, x1: number, y1: number, count: number, seed: number): void {
    const rnd = random(seed);
    for (let i = 0; i < count; i++) {
      const x = x0 + rnd() * (x1 - x0);
      const y = y0 + rnd() * (y1 - y0);
      const bright = rnd() < 0.15;
      this.dot(x, y, hex(bright ? '#fff8ea' : '#a9cbe8'), bright ? 1 : 0.7);
      if (bright) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) this.dot(x + dx, y + dy, hex('#a9cbe8'), 0.5);
    }
  }

  /** Falling snow: white dots of two sizes. */
  snow(x0: number, y0: number, x1: number, y1: number, count: number, seed: number): void {
    const rnd = random(seed);
    for (let i = 0; i < count; i++) {
      const x = x0 + rnd() * (x1 - x0);
      const y = y0 + rnd() * (y1 - y0);
      this.dot(x, y, hex('#f4f8ff'), 0.9);
      if (rnd() < 0.3) this.dot(x + 1, y, hex('#f4f8ff'), 0.6);
    }
  }

  /** A floating candle with flame (Great Hall). */
  candle(x: number, y: number): void {
    this.rect(x, y, 3, 8, '#f6ead0');
    this.rect(x, y, 1, 8, '#fff8ea');
    this.rect(x + 2, y, 1, 8, '#c9b994');
    this.dot(x + 1, y - 1, hex('#3a3440'));
    this.rect(x + 1, y - 4, 1, 3, '#ffd27a');
    this.dot(x + 1, y - 5, hex('#fff1c2'));
    this.ellipse(x + 1.5, y - 3, 4, 4, '#ffd27a', 0.18);
  }

  /** A house banner hanging from a rod. */
  banner(x: number, y: number, w: number, h: number, main: string, trim: string): void {
    this.rect(x - 2, y, w + 4, 2, '#3b2414');
    this.rect(x, y + 2, w, h, main);
    for (let j = 0; j < w / 2; j++) {
      this.rect(x + j, y + 2 + h + j, w - 2 * j, 1, main); // pointed bottom
    }
    this.rect(x, y + 2, 1, h, trim);
    this.rect(x + w - 1, y + 2, 1, h, trim);
    this.ellipse(x + w / 2, y + 2 + h / 2, w / 4, w / 4, trim);
  }

  save(id: string): void {
    const file = path.join(SPRITES, 'bg', `${id}.png`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    // backgrounds are opaque
    for (let i = 3; i < this.png.data.length; i += 4) this.png.data[i] = 255;
    fs.writeFileSync(file, PNG.sync.write(this.png));
  }
}

/** Colour helper for recolouring tiles: green grass → snow, etc. */
export function toSnow([r, g, b]: RGB): RGB {
  const l = 0.3 * r + 0.59 * g + 0.11 * b;
  return mix([l, l, l], [236, 242, 250], 0.75).map((v) => Math.min(255, v + 30)) as RGB;
}
