import fs from 'node:fs';
import path from 'node:path';
import { Compiler, CompilerOptions } from 'inkjs/full';
import { describe, expect, it } from 'vitest';
import { extractChoices, preprocessInk } from '../../scripts/ink-compiler';
import { DialogueRunner, type Step } from '../../src/dialogue/DialogueRunner';
import { parseSpeaker } from '../../src/dialogue/tags';

const GLOBALS = fs.readFileSync(path.resolve('src/content/ink/globals.ink'), 'utf8');

function compile(source: string): string {
  const errors: string[] = [];
  const handler = {
    ResolveInkFilename: (f: string) => f,
    LoadInkFileContents: () => preprocessInk(GLOBALS),
  };
  const compiler = new Compiler(
    preprocessInk(source),
    new CompilerOptions(null, [], false, (m: string, type: number) => type === 2 && errors.push(m), handler),
  );
  const story = compiler.Compile();
  if (errors.length) throw new Error(errors.join('\n'));
  return story.ToJson()!;
}

const TEST_DAY = `INCLUDE globals.ink
=== day99 ===
# bg: great_hall
# show: quill right
quill: Hallo, {name}.
# choice_point: d99.test Testfrage?
* [Zuhören] # cid: d99.test.listen
    ~ bond_ellis += 10
    ellis: Danke!
* [Weggehen] # cid: d99.test.leave
    # clue: k02
    Du gehst.
- quill: Ein Rätsel …
# puzzle: p99
{ last_puzzle_first_try: ellis: Erster Versuch! }
quill: {pronoun_form("Liebe", "Lieber", "Liebes")} Assistenz.
-> END
`;

function runner(json: string, solved: Set<string> = new Set()) {
  return new DialogueRunner(json, {
    personal: (key) => `personal:${key}`,
    isPuzzleResolved: (id) => solved.has(id),
  });
}

function nextLine(r: DialogueRunner): Extract<Step, { kind: 'line' }> {
  const step = r.next();
  if (step.kind !== 'line') throw new Error(`expected line, got ${step.kind}`);
  return step;
}

describe('ink preprocessing', () => {
  it('moves cid tags into the choice brackets', () => {
    expect(preprocessInk('* [Den Brief geben] # cid: d07.letter.give')).toBe('* [Den Brief geben #cid: d07.letter.give]');
    expect(preprocessInk('  + {x} [Text] # cid: a.b.c # other')).toBe('  + {x} [Text #cid: a.b.c] # other');
    expect(preprocessInk('quill: Hallo [nicht] # cid: x.y')).toBe('quill: Hallo [nicht] # cid: x.y');
  });

  it('extracts the choice catalog [INK-1]', () => {
    const { entries, errors } = extractChoices(TEST_DAY, 'day99');
    expect(errors).toEqual([]);
    expect(entries).toEqual([
      {
        id: 'd99.test',
        day: 99,
        file: 'day99',
        question: 'Testfrage?',
        options: [
          { option: 'listen', cid: 'd99.test.listen', text: 'Zuhören' },
          { option: 'leave', cid: 'd99.test.leave', text: 'Weggehen' },
        ],
      },
    ]);
  });

  it('reports cids without choice_point', () => {
    const { errors } = extractChoices('* [A] # cid: d01.x.a', 'day01');
    expect(errors[0]).toMatch(/no preceding choice_point/);
  });
});

describe('parseSpeaker', () => {
  it('detects known speakers only', () => {
    expect(parseSpeaker('quill: Hallo')).toEqual({ speaker: 'quill', text: 'Hallo' });
    expect(parseSpeaker('Tipp: nicht sprechen')).toEqual({ speaker: null, text: 'Tipp: nicht sprechen' });
    expect(parseSpeaker('Es ist still.')).toEqual({ speaker: null, text: 'Es ist still.' });
  });
});

describe('DialogueRunner', () => {
  const json = compile(TEST_DAY);

  it('starts with saved variables and reports tags with the first line', () => {
    const r = runner(json);
    r.start('day99', { name: 'Lena', pronoun: 'f' });
    const line = nextLine(r);
    expect(line).toMatchObject({ speaker: 'quill', text: 'Hallo, Lena.' });
    expect(line.tags.map((t) => t.key)).toEqual(['bg', 'show']);
  });

  it('exposes choice point and cids [DEC-1]', () => {
    const r = runner(json);
    r.start('day99', {});
    nextLine(r);
    const step = r.next();
    expect(step.kind).toBe('choices');
    if (step.kind !== 'choices') return;
    expect(step.choicePoint).toEqual({ id: 'd99.test', question: 'Testfrage?' });
    expect(step.options.map((o) => o.cid)).toEqual(['d99.test.listen', 'd99.test.leave']);
    expect(r.choose(1)).toEqual({ cid: 'd99.test.leave', pointId: 'd99.test', option: 'leave', label: 'Weggehen' });
  });

  it('applies clue tags once and reports them as found', () => {
    const r = runner(json);
    r.start('day99', {});
    nextLine(r);
    r.next();
    r.choose(1);
    const line = nextLine(r);
    expect(line.text).toBe('Du gehst.');
    expect(line.found.clues).toEqual(['k02']);
    expect(r.getVar('clues')).toEqual(['k02']);
    expect(nextLine(r).found.clues).toEqual([]);
  });

  it('clamps relationship values', () => {
    const r = runner(json);
    r.start('day99', {});
    nextLine(r);
    r.next();
    r.choose(0);
    nextLine(r);
    expect(r.getVar('bond_ellis')).toBe(5);
  });

  it('pauses before the puzzle line and evaluates it afterwards [ARC-3]', () => {
    const solved = new Set<string>();
    const r = runner(json, solved);
    r.start('day99', { pronoun: 'm' });
    nextLine(r);
    r.next();
    r.choose(1);
    nextLine(r); // Du gehst.
    expect(nextLine(r).text).toBe('Ein Rätsel …');
    const pause = r.next();
    expect(pause).toMatchObject({ kind: 'puzzle', puzzleId: 'p99' });

    solved.add('p99');
    r.setVar('last_puzzle_first_try', true);
    expect(nextLine(r)).toMatchObject({ speaker: 'ellis', text: 'Erster Versuch!' });
    expect(nextLine(r).text).toBe('Lieber Assistenz.');
    expect(r.next().kind).toBe('end');
  });

  it('skips the first-try line when the puzzle took several attempts', () => {
    const solved = new Set<string>(['p99']);
    const r = runner(json, solved);
    r.start('day99', { last_puzzle_first_try: false });
    nextLine(r);
    r.next();
    r.choose(0);
    nextLine(r);
    nextLine(r);
    expect(nextLine(r).text).toBe('Liebes Assistenz.');
  });

  it('resumes exactly from the checkpoint [ARC-2] [DAY-4]', () => {
    const r1 = runner(json);
    r1.start('day99', { name: 'Mama' });
    nextLine(r1);
    r1.next();
    r1.choose(1);
    const shown = nextLine(r1); // "Du gehst." with clue k02
    const saved = { state: r1.checkpoint, vars: r1.getVars() };

    const r2 = runner(json);
    r2.resume(saved.state, saved.vars);
    const again = nextLine(r2);
    expect(again.text).toBe(shown.text);
    expect(again.found.clues).toEqual([]); // not reported twice
    expect(r2.getVar('name')).toBe('Mama');
  });

  it('round-trips variables including lists', () => {
    const r = runner(json);
    r.start('day99', { clues: ['k01', 'k07'], items: ['lantern'], trust_theo: 9, route: 'forest' });
    const vars = r.getVars();
    expect(vars.clues).toEqual(['k01', 'k07']);
    expect(vars.items).toEqual(['lantern']);
    expect(vars.trust_theo).toBe(3);
    expect(vars.route).toBe('forest');
    r.setVar('clues', []);
    expect(r.getVar('clues')).toEqual([]);
  });
});

describe('day01.ink', () => {
  const json = fs.readFileSync(path.resolve('src/content/generated/day01.json'), 'utf8');

  it.each([0, 1])('runs to END with choice %i', (choice) => {
    const solved = new Set<string>();
    const r = runner(json, solved);
    r.start('day01', { name: 'Lena', pronoun: 'f', house: 'hufflepuff' });
    let puzzles = 0;
    for (let i = 0; i < 200; i++) {
      const step = r.next();
      if (step.kind === 'end') break;
      if (step.kind === 'choices') r.choose(choice);
      if (step.kind === 'puzzle') {
        puzzles++;
        solved.add(step.puzzleId);
      }
    }
    expect(r.next().kind).toBe('end');
    expect(puzzles).toBe(1);
    expect(r.getVar('bond_ellis')).toBe(choice === 0 ? 2 : 1);
  });
});
