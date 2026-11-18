import { assets, isCrop, type AssetDef } from './manifest';
import { PALETTE_HEX } from './palette';

const images = new Map<string, Promise<HTMLImageElement | null>>();
const warned = new Set<string>();

export function getDef(id: string): AssetDef | undefined {
  return assets[id];
}

export function assetUrl(file: string): string {
  return `${import.meta.env.BASE_URL}${file}`;
}

function warnMissing(id: string, reason: string): void {
  if (warned.has(id)) return;
  warned.add(id);
  console.warn(`[assets] ${id}: ${reason} – rendering placeholder`);
}

/** Resolve an image asset to its file; crops resolve to their source file. */
export function sourceFileOf(id: string): string | null {
  const def = assets[id];
  if (!def) return null;
  return isCrop(def) ? sourceFileOf(def.from) : def.file;
}

/** [GFX-6] Resolves to null (and logs a warning) when the file is missing. */
export function loadImage(id: string): Promise<HTMLImageElement | null> {
  const cached = images.get(id);
  if (cached) return cached;
  const file = sourceFileOf(id);
  const promise = new Promise<HTMLImageElement | null>((resolve) => {
    if (!file) {
      warnMissing(id, 'not in manifest');
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      warnMissing(id, `missing file ${file}`);
      resolve(null);
    };
    img.src = assetUrl(file);
  });
  images.set(id, promise);
  return promise;
}

export function preloadImages(ids: string[]): Promise<unknown> {
  return Promise.all(ids.map(loadImage));
}

/** Deterministic placeholder colour per ID. */
export function placeholderColor(id: string): string {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return PALETTE_HEX[Math.abs(hash) % PALETTE_HEX.length];
}
