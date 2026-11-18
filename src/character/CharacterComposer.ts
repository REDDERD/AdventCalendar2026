import { assetUrl } from '../assets/AssetRegistry';
import type { HouseId, Look } from '../types';
import { FRAME, playerRecipe, resolveRecipe, SHEET_COLS, type Recipe } from './layers';
import { ghostify, recolorPixels } from './recolor';

const SHEET_W = FRAME * SHEET_COLS;
const SHEET_H = FRAME * 4;

const images = new Map<string, Promise<HTMLImageElement>>();
const sheets = new Map<string, Promise<HTMLCanvasElement>>();

function loadImage(file: string): Promise<HTMLImageElement> {
  let promise = images.get(file);
  if (!promise) {
    promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Missing LPC layer ${file}`));
      img.src = assetUrl(file);
    });
    images.set(file, promise);
  }
  return promise;
}

function canvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = SHEET_W;
  c.height = SHEET_H;
  return [c, c.getContext('2d', { willReadFrequently: true })!];
}

/**
 * [CHAR-1] Compose LPC layers into one walk sheet (palette swap per layer),
 * cached per recipe.
 */
export function composeSheet(recipe: Recipe): Promise<HTMLCanvasElement> {
  const key = JSON.stringify(recipe);
  let promise = sheets.get(key);
  if (!promise) {
    promise = (async () => {
      const layers = resolveRecipe(recipe);
      const loaded = await Promise.all(layers.map((l) => loadImage(l.file)));
      const [out, ctx] = canvas();
      const [tmp, tctx] = canvas();
      layers.forEach((layer, i) => {
        tctx.clearRect(0, 0, SHEET_W, SHEET_H);
        tctx.drawImage(loaded[i], 0, 0, SHEET_W, SHEET_H, 0, 0, SHEET_W, SHEET_H);
        if (layer.maps.length) {
          const data = tctx.getImageData(0, 0, SHEET_W, SHEET_H);
          recolorPixels(data.data, layer.maps);
          tctx.putImageData(data, 0, 0);
        }
        ctx.drawImage(tmp, 0, 0);
      });
      if (recipe.ghost) {
        const data = ctx.getImageData(0, 0, SHEET_W, SHEET_H);
        ghostify(data.data);
        ctx.putImageData(data, 0, 0);
      }
      return out;
    })();
    promise.catch(() => sheets.delete(key));
    sheets.set(key, promise);
  }
  return promise;
}

/** [CHAR-2] Grey robe before sorting, house colours after. */
export function playerSheet(look: Look, house: HouseId | null): Promise<HTMLCanvasElement> {
  return composeSheet(playerRecipe(look, house));
}
