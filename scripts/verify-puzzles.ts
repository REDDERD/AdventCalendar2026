// puzzles:verify – solve every puzzle by script before it counts as done [PLAN-3]:
// brute force for toggle/arrange, search for path, BFS for slide and pour.
// Variants (per house on day 9, per ending on day 24) are checked as puzzles of their own.
import fs from 'node:fs';
import path from 'node:path';
import { logicFor } from '../src/puzzles/logic';
import { parsePuzzle } from '../src/puzzles/schema';

const PUZZLE_DIR = path.resolve('src/content/puzzles');
let failed = 0;

function check(raw: Record<string, unknown>, label: string): void {
  const puzzle = parsePuzzle(raw);
  const logic = logicFor(puzzle.type, puzzle.config)!;
  const { errors, info } = logic.verify(puzzle);
  const kind = puzzle.type === 'custom' ? `custom:${String(puzzle.config.component)}` : puzzle.type;
  if (errors.length) {
    failed++;
    console.error(`FAIL ${label} (${kind})`);
    for (const e of errors) console.error(`     ${e}`);
  } else {
    console.log(`ok   ${label} (${kind}) ${info.join(' · ')}`);
  }
}

for (const file of fs.readdirSync(PUZZLE_DIR).filter((f) => f.endsWith('.json')).sort()) {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(PUZZLE_DIR, file), 'utf8')) as Record<string, unknown>;
    check(raw, String(raw.id));
    const variants = (raw.variants ?? {}) as Record<string, Record<string, unknown>>;
    for (const [key, variant] of Object.entries(variants)) {
      check({ ...raw, ...variant, variants: undefined }, `${String(raw.id)}[${key}]`);
    }
  } catch (e) {
    failed++;
    console.error(`FAIL ${file}: ${(e as Error).message}`);
  }
}

console.log(`puzzles:verify – ${failed} failed`);
process.exit(failed ? 1 : 0);
