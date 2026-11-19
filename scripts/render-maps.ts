// assets:maps – render the scene backgrounds to public/assets/bg/<location>.png [GFX-2]
// (DECISIONS.md #53: scene scripts instead of Tiled files). `-- <id>` renders one scene,
// `-- --preview <file>` also writes a contact sheet of everything rendered.
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import { Picture } from './maps/kit';
import { SCENES } from './maps/scenes';

const args = process.argv.slice(2);
const previewAt = args.indexOf('--preview');
const preview = previewAt >= 0 ? args[previewAt + 1] : null;
const only = args.filter((a, i) => !a.startsWith('--') && (previewAt < 0 || i !== previewAt + 1));
const ids = only.length ? only : Object.keys(SCENES);

const rendered: Array<[string, PNG]> = [];
for (const id of ids) {
  const draw = SCENES[id];
  if (!draw) throw new Error(`no scene "${id}"`);
  const p = new Picture();
  draw(p);
  p.save(id);
  rendered.push([id, p.png]);
}
console.log(`Rendered ${rendered.length} backgrounds: ${ids.join(', ')}`);

if (preview) {
  const gap = 4;
  const sheet = new PNG({ width: rendered.length * (256 + gap), height: 512 });
  sheet.data.fill(40);
  rendered.forEach(([, png], i) => PNG.bitblt(png, sheet, 0, 0, 256, 512, i * (256 + gap), 0));
  // mark what a 448-high stage shows (world y ≥ 88) and the dialogue box (y > 412)
  for (let i = 0; i < rendered.length; i++) {
    for (let x = 0; x < 256; x++) {
      for (const y of [88, 412]) sheet.data.set([255, 0, 255, 255], (y * sheet.width + i * (256 + gap) + x) * 4);
    }
  }
  fs.mkdirSync(path.dirname(preview), { recursive: true });
  fs.writeFileSync(preview, PNG.sync.write(sheet));
}
