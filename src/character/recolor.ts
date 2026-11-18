// Palette swap on raw RGBA pixels, shared by the browser composer and the NPC build script.
// Same rule as the LPC generator: a pixel matches a source colour within ±1 per channel.

export type Rgb = [number, number, number];

export function hexToRgb(hex: string): Rgb {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export interface ColorMap {
  from: Rgb[];
  to: Rgb[];
}

/** Pairs source and target colours index by index; identical pairs are skipped. */
export function colorMap(from: readonly string[], to: readonly string[]): ColorMap {
  const map: ColorMap = { from: [], to: [] };
  from.forEach((src, i) => {
    const dst = to[i] ?? to[to.length - 1];
    if (!dst || src.toLowerCase() === dst.toLowerCase()) return;
    map.from.push(hexToRgb(src));
    map.to.push(hexToRgb(dst));
  });
  return map;
}

const TOLERANCE = 1;

/** Replace colours in place. Fully transparent pixels are left alone. */
export function recolorPixels(data: Uint8Array | Uint8ClampedArray, maps: readonly ColorMap[]): void {
  const active = maps.filter((m) => m.from.length);
  if (!active.length) return;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    outer: for (const map of active) {
      for (let c = 0; c < map.from.length; c++) {
        const [fr, fg, fb] = map.from[c];
        if (Math.abs(r - fr) <= TOLERANCE && Math.abs(g - fg) <= TOLERANCE && Math.abs(b - fb) <= TOLERANCE) {
          [data[i], data[i + 1], data[i + 2]] = map.to[c];
          break outer;
        }
      }
    }
  }
}

/** Source-over blend of `src` onto `dst` (same size), as canvas drawImage would do. */
export function blendOver(dst: Uint8Array | Uint8ClampedArray, src: Uint8Array | Uint8ClampedArray): void {
  for (let i = 0; i < dst.length; i += 4) {
    const sa = src[i + 3] / 255;
    if (sa === 0) continue;
    const da = dst[i + 3] / 255;
    const oa = sa + da * (1 - sa);
    for (let c = 0; c < 3; c++) {
      dst[i + c] = Math.round((src[i + c] * sa + dst[i + c] * da * (1 - sa)) / oa);
    }
    dst[i + 3] = Math.round(oa * 255);
  }
}

/**
 * Translucent, bluish look for ghosts. `keep` = share of the original colours
 * (0 = pale blue all over like Sir Aldous, 0.5 = a tinted Peeves who still looks like a jester).
 */
export function ghostify(data: Uint8Array | Uint8ClampedArray, keep = 0, alpha = 170): void {
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const lum = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
    const blue = [Math.min(255, 90 + lum * 0.6), Math.min(255, 140 + lum * 0.5), Math.min(255, 190 + lum * 0.3)];
    for (let c = 0; c < 3; c++) data[i + c] = data[i + c] * keep + blue[c] * (1 - keep); // typed array truncates
    data[i + 3] = Math.min(data[i + 3], alpha);
  }
}

/** `Recipe.ghost` → share of the original colours, or null for the living. */
export function ghostKeep(ghost: boolean | number | undefined): number | null {
  if (ghost === undefined || ghost === false) return null;
  return ghost === true ? 0 : ghost;
}
