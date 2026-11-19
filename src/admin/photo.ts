import { palette } from '../assets/palette';

/** [PRS-1] Mirror photo for day 18: 96 × 72, game palette, PNG data URL under 30 KB. */
export const PHOTO_W = 96;
export const PHOTO_H = 72;
export const PHOTO_MAX_CHARS = 30 * 1024;

export type RGB = [number, number, number];

export const PALETTE_RGB: RGB[] = Object.values(palette).map(
  (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB,
);

/**
 * Source rectangle for a 4:3 crop that covers the target. `zoom` ≥ 1 narrows it,
 * `panX`/`panY` in −1…1 move it within the picture.
 */
export function cropRect(srcW: number, srcH: number, zoom = 1, panX = 0, panY = 0): { sx: number; sy: number; sw: number; sh: number } {
  const aspect = PHOTO_W / PHOTO_H;
  let sw = srcW;
  let sh = srcW / aspect;
  if (sh > srcH) {
    sh = srcH;
    sw = srcH * aspect;
  }
  sw /= Math.max(1, zoom);
  sh /= Math.max(1, zoom);
  const clamp = (v: number) => Math.max(-1, Math.min(1, v));
  const sx = ((srcW - sw) / 2) * (1 + clamp(panX));
  const sy = ((srcH - sh) / 2) * (1 + clamp(panY));
  return { sx, sy, sw, sh };
}

function nearest(colors: readonly RGB[], r: number, g: number, b: number): RGB {
  let best = colors[0];
  let bestD = Infinity;
  for (const c of colors) {
    // weighted distance: the eye is most sensitive to green
    const d = 2 * (c[0] - r) ** 2 + 4 * (c[1] - g) ** 2 + 3 * (c[2] - b) ** 2;
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best;
}

/** Floyd–Steinberg dithering onto `colors`, in place on RGBA data; alpha becomes opaque. */
export function ditherToPalette(data: Uint8ClampedArray, w: number, h: number, colors: readonly RGB[] = PALETTE_RGB): void {
  const buf = new Float32Array(w * h * 3);
  for (let i = 0; i < w * h; i++) for (let c = 0; c < 3; c++) buf[i * 3 + c] = data[i * 4 + c];
  const spread = (x: number, y: number, err: number[], f: number) => {
    if (x < 0 || x >= w || y >= h) return;
    const i = (y * w + x) * 3;
    for (let c = 0; c < 3; c++) buf[i + c] += err[c] * f;
  };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3;
      const old = [buf[i], buf[i + 1], buf[i + 2]];
      const n = nearest(colors, old[0], old[1], old[2]);
      const err = old.map((v, c) => v - n[c]);
      for (let c = 0; c < 3; c++) data[(y * w + x) * 4 + c] = n[c];
      data[(y * w + x) * 4 + 3] = 255;
      spread(x + 1, y, err, 7 / 16);
      spread(x - 1, y + 1, err, 3 / 16);
      spread(x, y + 1, err, 5 / 16);
      spread(x + 1, y + 1, err, 1 / 16);
    }
  }
}

/** Browser only: draw the crop, dither it and return the PNG data URL. */
export function renderPhoto(image: CanvasImageSource & { width: number; height: number }, zoom: number, panX: number, panY: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = PHOTO_W;
  canvas.height = PHOTO_H;
  const ctx = canvas.getContext('2d')!;
  const { sx, sy, sw, sh } = cropRect(image.width, image.height, zoom, panX, panY);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, PHOTO_W, PHOTO_H);
  const img = ctx.getImageData(0, 0, PHOTO_W, PHOTO_H);
  ditherToPalette(img.data, PHOTO_W, PHOTO_H);
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL('image/png');
}
