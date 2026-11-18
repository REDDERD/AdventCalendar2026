// assets:npcs – compose NPC sprite sheets from the imported LPC layers [GFX-1].
// Writes public/assets/sprites/<id>.png (576 × 256, walk: up/left/down/right × 9 frames).
// --preview <file>: also write an enlarged overview of all NPCs (down-facing) for review.
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import { resolveRecipe, type Recipe } from '../src/character/layers';
import { NPCS } from '../src/character/npcs';
import { blendOver, ghostify, ghostKeep, recolorPixels } from '../src/character/recolor';

const OUT = path.resolve('public/assets/sprites');
const W = 576;
const H = 256;

function readPng(file: string): PNG {
  return PNG.sync.read(fs.readFileSync(path.resolve('public', file)));
}

export function composeRecipe(recipe: Recipe): PNG {
  const out = new PNG({ width: W, height: H });
  for (const layer of resolveRecipe(recipe)) {
    const png = readPng(layer.file);
    if (png.width < W || png.height < H) throw new Error(`${layer.file}: unexpected size ${png.width}×${png.height}`);
    // Copy the walk area into a sheet-sized buffer (some files are larger).
    const src = new PNG({ width: W, height: H });
    PNG.bitblt(png, src, 0, 0, W, H, 0, 0);
    recolorPixels(src.data, layer.maps);
    blendOver(out.data, src.data);
  }
  const keep = ghostKeep(recipe.ghost);
  if (keep !== null) ghostify(out.data, keep);
  return out;
}

fs.mkdirSync(OUT, { recursive: true });
const sheets: Array<[string, PNG]> = [];
for (const [id, recipe] of Object.entries(NPCS)) {
  const png = composeRecipe(recipe);
  fs.writeFileSync(path.join(OUT, `${id}.png`), PNG.sync.write(png));
  sheets.push([id, png]);
}
console.log(`Wrote ${sheets.length} NPC sheets to ${path.relative(process.cwd(), OUT)}`);

const previewIndex = process.argv.indexOf('--preview');
if (previewIndex > 0) {
  const scale = 3;
  const preview = new PNG({ width: sheets.length * 64 * scale, height: 64 * scale * 2 });
  preview.data.fill(0x30);
  sheets.forEach(([, png], n) => {
    for (const [row, frameRow] of [[0, 2], [1, 3]] as const) {
      for (let y = 0; y < 64 * scale; y++) {
        for (let x = 0; x < 64 * scale; x++) {
          const si = ((frameRow * 64 + Math.floor(y / scale)) * W + Math.floor(x / scale)) * 4;
          const di = ((row * 64 * scale + y) * preview.width + n * 64 * scale + x) * 4;
          const a = png.data[si + 3] / 255;
          for (let c = 0; c < 3; c++) preview.data[di + c] = Math.round(png.data[si + c] * a + 0x30 * (1 - a));
          preview.data[di + 3] = 255;
        }
      }
    }
  });
  fs.writeFileSync(process.argv[previewIndex + 1], PNG.sync.write(preview));
}
