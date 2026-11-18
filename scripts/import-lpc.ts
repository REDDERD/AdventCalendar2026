// assets:import-lpc – copy the LPC layers listed in scripts/lpc/catalog.ts into public/assets/lpc,
// together with palettes and credits [GFX-1] [GFX-3].
// Usage: npm run assets:import-lpc -- <path-to-Universal-LPC-Spritesheet-Character-Generator> [--list]
//   --list  print the sparse-checkout paths that are still missing, then exit
import fs from 'node:fs';
import path from 'node:path';
import { BODIES, LAYERS, PALETTES, type LayerSpec, type LpcBody } from './lpc/catalog';

const [repo, flag] = process.argv.slice(2);
if (!repo) {
  console.error('Usage: npm run assets:import-lpc -- <lpc-repo> [--list]');
  process.exit(1);
}

const OUT_DIR = path.resolve('public/assets/lpc');
const GENERATED = path.resolve('src/character/lpc.generated.json');
const CREDITS_JSON = path.resolve('src/content/credits.generated.json');
const CREDITS_MD = path.resolve('CREDITS.md');

interface Credit {
  file: string;
  notes?: string;
  authors: string[];
  licenses: string[];
  urls: string[];
}

interface SheetDef {
  name: string;
  recolors?: Record<string, unknown>;
  credits?: Credit[];
  [layer: string]: unknown;
}

export interface Recolor {
  material: string;
  base: string;
}

const readJson = <T>(file: string): T => JSON.parse(fs.readFileSync(file, 'utf8')) as T;

const materialBase = (material: string): string =>
  readJson<{ base: string }>(path.join(repo, 'palette_definitions', material, `meta_${material}.json`)).base;

function recolorsOf(def: SheetDef, spec: LayerSpec): Recolor[] {
  if (spec.variant || !def.recolors) return [];
  const r = def.recolors as Record<string, unknown>;
  const entries = 'material' in r ? [r] : Object.values(r);
  return entries
    .filter((e): e is { material: string; base?: string | null } => typeof e === 'object' && e !== null && 'material' in e)
    .map((e) => ({ material: e.material, base: e.base ?? materialBase(e.material) }));
}

function sourceFile(layerPath: string, variant?: string): string {
  const file = variant ? `walk/${variant.replace(/ /g, '_')}.png` : 'walk.png';
  return `spritesheets/${layerPath}${file}`;
}

interface Planned {
  spec: LayerSpec;
  def: SheetDef;
  z: number;
  recolor: Recolor[];
  files: Array<{ key: LpcBody | 'any'; src: string; out: string }>;
}

const plan: Planned[] = LAYERS.map((spec) => {
  const def = readJson<SheetDef>(path.join(repo, 'sheet_definitions', spec.def));
  const layer = def[spec.layer ?? 'layer_1'] as Record<string, string | number> | undefined;
  if (!layer) throw new Error(`${spec.id}: ${spec.def} has no ${spec.layer ?? 'layer_1'}`);
  const z = spec.z ?? Number(layer.zPos);
  const bodies = spec.bodies ?? [];
  const files = bodies.length
    ? bodies.map((body) => ({
        key: body,
        src: sourceFile(String(layer[body]), spec.variant),
        out: `${spec.id}.${body}.png`,
      }))
    : [{ key: 'any' as const, src: sourceFile(String(layer.male ?? layer.female), spec.variant), out: `${spec.id}.png` }];
  return { spec, def, z, recolor: recolorsOf(def, spec), files };
});

const missing = plan.flatMap((p) => p.files.map((f) => f.src)).filter((src) => !fs.existsSync(path.join(repo, src)));

if (flag === '--list') {
  for (const src of [...new Set(missing)]) console.log(`/${src}`);
  process.exit(0);
}
if (missing.length) {
  console.error(`Missing ${missing.length} files in ${repo}; run with --list and sparse-checkout them:`);
  for (const src of missing) console.error(`  ${src}`);
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const layers: Record<string, { z: number; recolor: Recolor[]; files: Partial<Record<LpcBody | 'any', string>> }> = {};
const credits = new Map<string, Credit & { title: string; usedBy: string[] }>();

for (const p of plan) {
  layers[p.spec.id] = { z: p.z, recolor: p.recolor, files: {} };
  for (const f of p.files) {
    fs.copyFileSync(path.join(repo, f.src), path.join(OUT_DIR, f.out));
    layers[p.spec.id].files[f.key] = `assets/lpc/${f.out}`;
    // Credit entries name a folder; keep those that match the used file (or all, if none match).
    const rel = f.src.replace(/^spritesheets\//, '');
    const all = p.def.credits ?? [];
    const matching = all.filter((c) => rel.startsWith(c.file));
    for (const c of matching.length ? matching : all) {
      const key = `${c.file}|${c.authors.join(',')}`;
      const entry = credits.get(key) ?? { ...c, title: p.def.name, usedBy: [] };
      if (!entry.usedBy.includes(f.out)) entry.usedBy.push(f.out);
      credits.set(key, entry);
    }
  }
}

const palettes = Object.fromEntries(
  Object.entries(PALETTES).map(([name, file]) => [name, readJson(path.join(repo, 'palette_definitions', file))]),
);

fs.writeFileSync(GENERATED, `${JSON.stringify({ bodies: BODIES, layers, palettes }, null, 2)}\n`);

const creditList = [...credits.values()].sort((a, b) => a.file.localeCompare(b.file));
fs.writeFileSync(
  CREDITS_JSON,
  `${JSON.stringify(creditList.map(({ title, file, authors, licenses, urls }) => ({ title, file, authors, licenses, urls })), null, 2)}\n`,
);

// CREDITS.md: replace the generated block
const block = [
  '<!-- lpc:start (generated by npm run assets:import-lpc) -->',
  '| Ebene | Dateien | Autoren | Lizenzen | Quellen |',
  '| --- | --- | --- | --- | --- |',
  ...creditList.map(
    (c) =>
      `| ${c.title} (\`${c.file}\`) | ${c.usedBy.join(', ')} | ${c.authors.join(', ')} | ${c.licenses.join(' / ')} | ${c.urls.map((u, i) => `[${i + 1}](${u})`).join(' ')} |`,
  ),
  '<!-- lpc:end -->',
].join('\n');
const md = fs.readFileSync(CREDITS_MD, 'utf8');
const updated = md.includes('<!-- lpc:start')
  ? md.replace(/<!-- lpc:start[\s\S]*?<!-- lpc:end -->/, block)
  : md.replace('## Grafiken\n', `## Grafiken\n\n### Liberated Pixel Cup (Universal LPC Spritesheet Character Generator)\n\nQuelle: https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator\n\n${block}\n`);
fs.writeFileSync(CREDITS_MD, updated);

console.log(`Imported ${plan.reduce((n, p) => n + p.files.length, 0)} files, ${creditList.length} credit entries.`);
