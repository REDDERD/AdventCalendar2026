// content:lint – static checks on Ink and puzzle JSON (Section 15.3).
// Path-based checks (≤ 250 words on every path, END reachable) live in content:simulate.
import fs from 'node:fs';
import path from 'node:path';
import { MUSIC_IDS, SFX_IDS } from '../src/assets/manifest';
import { CLUES, ITEMS } from '../src/content/catalog';
import { parsePuzzle } from '../src/puzzles/schema';
import { CHARACTERS, LOCATIONS } from '../src/types';
import { compileAll, dayFromFile, INK_DIR, listStoryFiles } from './ink-compiler';

const PUZZLE_DIR = path.resolve('src/content/puzzles');
const EMOTES = ['!', '?', 'heart', 'sweat', 'note', 'dots'];
const MAX_WORDS = 500; // [RB-3], doubled on request (DECISIONS.md #16)
const MIN_CHOICE_POINTS = 2; // per day (DECISIONS.md #16)
const MAX_LINE_CHARS = 90; // [STY-2]
const MAX_CHOICE_CHARS = 40; // [STY-3]

const errors: string[] = [];
const warnings: string[] = [];
const characters = new Set<string>(CHARACTERS);

// 1. Compilation (also reports undeclared variables)
const compiled = compileAll();
errors.push(...compiled.errors);

// 2. Puzzles
const puzzleIds = new Set<string>();
for (const file of fs.readdirSync(PUZZLE_DIR).filter((f) => f.endsWith('.json'))) {
  const id = file.replace(/\.json$/, '');
  try {
    const puzzle = parsePuzzle(JSON.parse(fs.readFileSync(path.join(PUZZLE_DIR, file), 'utf8')));
    if (puzzle.id !== id) errors.push(`puzzles/${file}: id "${puzzle.id}" does not match file name`);
    if (!characters.has(puzzle.intro.speaker)) errors.push(`puzzles/${file}: unknown intro speaker ${puzzle.intro.speaker}`);
    puzzleIds.add(id);
  } catch (e) {
    errors.push(`puzzles/${file}: ${(e as Error).message}`);
  }
}

// 3. Ink sources
const sparkIds = new Set<string>();
const SYNTAX = /^\s*(~|\/\/|#|\*|\+|-|=|\{|\}|INCLUDE|VAR|CONST|LIST|EXTERNAL|->|<-|$)/;

function strip(text: string): string {
  return text
    .replace(/#.*$/, '')
    .replace(/\{[^{}]*\}/g, 'xxxxxxxx')
    .trim();
}

for (const stem of listStoryFiles()) {
  const file = `${stem}.ink`;
  const day = dayFromFile(stem);
  const source = fs.readFileSync(path.join(INK_DIR, file), 'utf8');
  let words = 0;

  source.split('\n').forEach((raw, i) => {
    const at = `${file}:${i + 1}`;
    const line = raw.replace(/\/\/.*$/, '');

    // Choices: cid required [DEC-1], text ≤ 40 chars [STY-3]
    const choice = line.match(/^\s*([*+]\s*)+(.*)$/);
    if (choice) {
      if (!/#\s*cid:/.test(line)) errors.push(`${at}: choice without "# cid:"`);
      const cid = line.match(/#\s*cid:\s*d(\d{2})/);
      if (cid && day !== null && day > 0 && Number(cid[1]) !== day) {
        errors.push(`${at}: cid belongs to day ${cid[1]}, file is day ${day}`);
      }
      const text = choice[2].replace(/#.*$/, '').replace(/[[\]]/g, '').replace(/\{[^}]*\}/g, '').trim();
      if (text.length > MAX_CHOICE_CHARS) errors.push(`${at}: choice text longer than ${MAX_CHOICE_CHARS} chars`);
    }

    // Tags
    for (const m of line.matchAll(/#\s*(\w+):\s*([^#]*)/g)) {
      const [, key, rawValue] = m;
      const value = rawValue.trim();
      const [first, second] = value.split(/\s+/);
      switch (key) {
        case 'bg':
          if (!(LOCATIONS as string[]).includes(value)) errors.push(`${at}: unknown location "${value}"`);
          break;
        case 'show':
        case 'hide':
          if (!characters.has(first)) errors.push(`${at}: unknown character "${first}"`);
          if (key === 'show' && second && !['left', 'center', 'right'].includes(second)) {
            errors.push(`${at}: position must be left|center|right`);
          }
          break;
        case 'emote':
          if (!characters.has(first)) errors.push(`${at}: unknown character "${first}"`);
          if (!EMOTES.includes(second)) errors.push(`${at}: unknown emote "${second}"`);
          break;
        case 'puzzle':
          if (!puzzleIds.has(value)) errors.push(`${at}: puzzle "${value}" has no JSON`);
          break;
        case 'clue':
          if (!(value in CLUES)) errors.push(`${at}: unknown clue "${value}"`);
          break;
        case 'item':
          if (!(value in ITEMS)) errors.push(`${at}: unknown item "${value}"`);
          break;
        case 'music':
          if (!(MUSIC_IDS as readonly string[]).includes(value)) errors.push(`${at}: unknown music "${value}"`);
          break;
        case 'sfx':
          if (!(SFX_IDS as readonly string[]).includes(value)) errors.push(`${at}: unknown sfx "${value}"`);
          break;
        case 'spark': {
          const [id, x, y] = value.split(/\s+/);
          if (!/^d\d{2}[wa]?\.s\d$/.test(id ?? '')) errors.push(`${at}: spark id must look like d07.s1`);
          if (sparkIds.has(id)) errors.push(`${at}: duplicate spark id ${id}`);
          sparkIds.add(id);
          const nx = Number(x);
          const ny = Number(y);
          if (!(nx >= 0 && nx < 256 && ny >= 0 && ny < 192)) errors.push(`${at}: spark outside the top screen`);
          break;
        }
      }
    }

    // ~ items += x / clues += x must reference existing ids
    for (const m of line.matchAll(/~\s*(items|clues)\s*[+-]=\s*\(?([\w,\s]+)\)?/g)) {
      const catalog = m[1] === 'items' ? ITEMS : CLUES;
      for (const id of m[2].split(',').map((s) => s.trim()).filter(Boolean)) {
        if (!(id in catalog)) errors.push(`${at}: unknown ${m[1]} entry "${id}"`);
      }
    }

    if (SYNTAX.test(line) && !/^\s*-\s+\w/.test(line) && !choice) return;

    // Dialogue lines
    const content = strip(line.replace(/^\s*-\s+/, '').replace(/^\s*([*+]\s*)+\[[^\]]*\]/, ''));
    if (!content) return;
    const speaker = content.match(/^([a-z_]+):\s/);
    if (speaker && !characters.has(speaker[1])) errors.push(`${at}: unknown speaker "${speaker[1]}"`);
    const text = speaker ? content.slice(speaker[0].length) : content;
    if (text.length > MAX_LINE_CHARS) warnings.push(`${at}: line has ${text.length} chars (max ~${MAX_LINE_CHARS})`);
    words += text.split(/\s+/).filter(Boolean).length;
  });

  const choicePoints = source.match(/^\s*#\s*choice_point:/gm)?.length ?? 0;
  if (day !== null && day > 0 && choicePoints < MIN_CHOICE_POINTS) {
    errors.push(`${file}: ${choicePoints} choice points, at least ${MIN_CHOICE_POINTS} required`);
  }

  // Upper bound: all lines of the file. Exact per-path counts: content:simulate.
  if (words > MAX_WORDS) warnings.push(`${file}: ${words} words in total – check the longest path with content:simulate`);
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
console.log(`content:lint – ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
