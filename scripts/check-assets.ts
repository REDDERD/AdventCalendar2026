// assets:check – missing and unused assets, missing licences [GFX-6] [GFX-3].
// Missing files are allowed (placeholders) unless --strict is passed.
import fs from 'node:fs';
import path from 'node:path';
import { assets, isCrop } from '../src/assets/manifest';

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
