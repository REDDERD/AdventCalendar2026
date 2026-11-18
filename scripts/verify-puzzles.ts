// puzzles:verify – solve every puzzle by script before it counts as done [PLAN-3]:
// brute force for toggle/arrange, search for path, BFS for slide and pour.
import fs from 'node:fs';
import path from 'node:path';
import { logicFor } from '../src/puzzles/logic';
import { parsePuzzle } from '../src/puzzles/schema';

const PUZZLE_DIR = path.resolve('src/content/puzzles');
let failed = 0;

for (const file of fs.readdirSync(PUZZLE_DIR).filter((f) => f.endsWith('.json')).sort()) {
  try {
    const puzzle = parsePuzzle(JSON.parse(fs.readFileSync(path.join(PUZZLE_DIR, file), 'utf8')));
    const logic = logicFor(puzzle.type, puzzle.config)!;
    const { errors, info } = logic.verify(puzzle);
    const kind = puzzle.type === 'custom' ? `custom:${String(puzzle.config.component)}` : puzzle.type;
    if (errors.length) {
      failed++;
      console.error(`FAIL ${puzzle.id} (${kind})`);
      for (const e of errors) console.error(`     ${e}`);
    } else {
      console.log(`ok   ${puzzle.id} (${kind}) ${info.join(' · ')}`);
    }
  } catch (e) {
    failed++;
    console.error(`FAIL ${file}: ${(e as Error).message}`);
  }
}

console.log(`puzzles:verify – ${failed} failed`);
process.exit(failed ? 1 : 0);
