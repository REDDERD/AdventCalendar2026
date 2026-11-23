// assets:check – missing and unused assets, missing licences [GFX-6] [GFX-3].
// Missing files are allowed (placeholders) unless --strict is passed.
import fs from 'node:fs';
import path from 'node:path';
import { assets, isCrop } from '../src/assets/manifest';
import { RECORDINGS } from '../src/audio/recordings';

const PUBLIC = path.resolve('public');
const strict = process.argv.includes('--strict');

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const referenced = new Set<string>();
// LPC layers are referenced by the CharacterComposer via lpc.generated.json, not the manifest.
const lpc = JSON.parse(fs.readFileSync('src/character/lpc.generated.json', 'utf8')) as {
  layers: Record<string, { files: Record<string, string> }>;
};
for (const layer of Object.values(lpc.layers)) for (const file of Object.values(layer.files)) referenced.add(file);
const missing: string[] = [];
const unlicensed: string[] = [];

for (const [id, def] of Object.entries(assets)) {
  if (isCrop(def)) {
    if (!assets[def.from]) missing.push(`${id}: crop source ${def.from} not in manifest`);
    continue;
  }
  referenced.add(def.file);
  const exists = fs.existsSync(path.join(PUBLIC, def.file));
  if (!exists) missing.push(`${id} → public/${def.file}`);
  else if (!def.license) unlicensed.push(`${id} → public/${def.file}`);
}

// Music recordings (DECISIONS.md #81): every file needs performer, licence and source page.
for (const r of RECORDINGS) {
  const file = `audio/music/${r.id}.m4a`;
  referenced.add(file);
  if (!fs.existsSync(path.join(PUBLIC, file))) missing.push(`music ${r.id} → public/${file}`);
  else if (!r.licence || !r.page || !r.performer) unlicensed.push(`music ${r.id} → public/${file}`);
}

const unused = [...walk(path.join(PUBLIC, 'assets')), ...walk(path.join(PUBLIC, 'audio'))]
  .map((f) => path.relative(PUBLIC, f).split(path.sep).join('/'))
  .filter((f) => !referenced.has(f) && !f.endsWith('.gitkeep'));

const section = (title: string, list: string[]) => {
  console.log(`\n${title} (${list.length})`);
  for (const item of list) console.log(`  ${item}`);
};

section('Missing files – rendered as placeholders', missing);
section('Files without licence in the manifest', unlicensed);
section('Unused files', unused);

if (unlicensed.length || (strict && missing.length)) process.exit(1);
