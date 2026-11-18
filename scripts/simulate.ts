// content:simulate – random playthroughs per day (Section 15.3).
// Every path must reach END; the longest path must stay within MAX_WORDS.
// Full 1–24 runs with the ending distribution follow once Act III exists (M8).
import fs from 'node:fs';
import path from 'node:path';
import { DialogueRunner } from '../src/dialogue/DialogueRunner';
import { HOUSES, type InkVarValue } from '../src/types';
import { dayFromFile, GENERATED_DIR, listStoryFiles } from './ink-compiler';

const RUNS = 500;
const MAX_STEPS = 2000;
const MAX_WORDS = 500; // DECISIONS.md #16
const WORDS_PER_MIN = 200;

const pick = <T>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)];
const int = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const CLUES = ['k01', 'k02', 'k03', 'k04', 'k05', 'k06', 'k07', 'k08', 'k09', 'k10'];
const ITEMS = ['bookmark', 'anonymous_letter', 'house_token', 'lantern', 'archive_key', 'gift_scarf', 'gift_music_box', 'theo_wrench'];

function randomState(): Record<string, InkVarValue> {
  return {
    name: 'Testi',
    pronoun: pick(['f', 'm', 'n']),
    house: pick(HOUSES),
    hat_overruled: Math.random() < 0.3,
    wand: pick(['phoenix', 'dragon', 'unicorn']),
    pet: pick(['owl', 'cat', 'toad']),
    bond_ellis: int(0, 5),
    trust_theo: int(-2, 3),
    trust_maren: int(-2, 3),
    trust_grimsby: int(-2, 3),
    trust_aldous: int(-2, 3),
    clues: CLUES.filter(() => Math.random() < 0.4),
    items: ITEMS.filter(() => Math.random() < 0.3),
    route: pick(['forest', 'archive']),
    maren_covered: Math.random() < 0.5,
    peeves_friend: Math.random() < 0.5,
    f_d01_watch: Math.random() < 0.5,
    wrote_home: Math.random() < 0.5,
    ate_rockcake: Math.random() < 0.5,
  };
}

let failed = false;

for (const stem of listStoryFiles()) {
  const day = dayFromFile(stem);
  if (day === null || day === 0) continue;
  const json = fs.readFileSync(path.join(GENERATED_DIR, `${stem}.json`), 'utf8');
  let maxWords = 0;
  let minWords = Infinity;
  let errors = 0;

  for (let run = 0; run < RUNS; run++) {
    const solved = new Set<string>();
    const runner = new DialogueRunner(json, { personal: (k) => `[${k}]`, isPuzzleResolved: (id) => solved.has(id) });
    runner.start(stem, randomState());
    let words = 0;
    let ended = false;
    for (let step = 0; step < MAX_STEPS; step++) {
      const s = runner.next();
      if (s.kind === 'end') {
        ended = true;
        break;
      }
      if (s.kind === 'line') words += s.text.split(/\s+/).filter(Boolean).length;
      else if (s.kind === 'choices') runner.choose(int(0, s.options.length - 1));
      else if (s.kind === 'puzzle') {
        solved.add(s.puzzleId);
        runner.setVar('last_puzzle_first_try', Math.random() < 0.5);
      } else if (s.kind === 'ending') runner.setVar('ending', pick(['A', 'B', 'C_A', 'C_B']));
    }
    if (!ended) errors++;
    maxWords = Math.max(maxWords, words);
    minWords = Math.min(minWords, words);
  }

  const minutes = (maxWords / WORDS_PER_MIN).toFixed(1);
  const status = errors || maxWords > MAX_WORDS ? 'FAIL' : 'ok  ';
  console.log(`${status} ${stem}: ${minWords}–${maxWords} words (longest ≈ ${minutes} min reading)${errors ? `, ${errors} runs without END` : ''}`);
  if (status === 'FAIL') failed = true;
}

process.exit(failed ? 1 : 0);
