import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  arrangeLogic,
  placeGrid,
  swapRow,
  tapStick,
  type ArrangeState,
  type GridConfig,
  type GridState,
  type RowState,
  type SticksConfig,
  type SticksState,
  stickSlots,
} from '../../src/puzzles/logic/arrange';
import { clueHolds, clueText, placementOf } from '../../src/puzzles/logic/gridClues';
import { equationHolds, readEquation, romanValue } from '../../src/puzzles/logic/roman';
import { choiceLogic } from '../../src/puzzles/logic/choice';
import { inputLogic } from '../../src/puzzles/logic/input';
import { extendPath, pathLogic, type PathConfig, type PathState } from '../../src/puzzles/logic/path';
import { pour, pourLogic, type PourConfig, type PourState } from '../../src/puzzles/logic/pour';
import { slideLogic, slideTile } from '../../src/puzzles/logic/slide';
import { tapLogic, toggleMark, type TapState } from '../../src/puzzles/logic/tap';
import { solveToggle, toggleCell, toggleLogic, type ToggleConfig } from '../../src/puzzles/logic/toggle';
import { parsePuzzle, type Puzzle } from '../../src/puzzles/schema';
import { resolveVariant } from '../../src/puzzles/usePuzzle';
import type { SaveDoc } from '../../src/types';
import { helpDueAt, HELP_AFTER_MS, HELP_REOFFER_MS, nextHint } from '../../src/puzzles/scoring';

const load = (id: string): Puzzle =>
  parsePuzzle(JSON.parse(fs.readFileSync(path.resolve(`src/content/puzzles/${id}.json`), 'utf8')));

// [PZL-2] every engine: solvable, wrong input, rule violation

describe('input (p01)', () => {
  const p = load('p01');
  it('is solvable', () => expect(inputLogic.check(p, '22')).toBe(true));
  it('rejects a wrong answer (the trap 24)', () => expect(inputLogic.check(p, '24')).toBe(false));
  it('rejects empty input', () => expect(inputLogic.check(p, '  ')).toBe(false));
  it('verifies', () => expect(inputLogic.verify(p).errors).toEqual([]));
});

describe('choice (p21)', () => {
  const p = load('p21');
  it('is solvable', () => expect(choiceLogic.check(p, 1)).toBe(true));
  it('rejects a wrong card', () => expect(choiceLogic.check(p, 2)).toBe(false));
  it('rejects no selection and unknown cards', () => {
    expect(choiceLogic.check(p, null)).toBe(false);
    expect(choiceLogic.check(p, 9)).toBe(false);
  });
  it('verify catches a solution without option', () => {
    expect(choiceLogic.verify({ ...p, solution: 7 }).errors).not.toEqual([]);
  });
});

describe('toggle (p02)', () => {
  const p = load('p02');
  const config = p.config as ToggleConfig;
  const tap = (cells: number[]) => cells.reduce((s, c) => toggleCell(config, s, c), toggleLogic.initial(p));
  it('is solvable with 11 taps', () => {
    expect(toggleLogic.check(p, tap([0, 1, 2, 3, 5, 6, 8, 9, 13, 14, 15]))).toBe(true);
  });
  it('rejects a wrong pattern', () => {
    expect(toggleLogic.check(p, tap([0, 2, 4]))).toBe(false);
    expect(toggleLogic.check(p, tap([0, 1, 2, 3, 5, 6, 8, 9, 13, 14, 15, 15]))).toBe(false);
  });
  it('ignores cells outside the grid (rule)', () => {
    const start = toggleLogic.initial(p);
    expect(toggleCell(config, start, 20)).toBe(start);
    expect(toggleCell(config, start, -1)).toBe(start);
  });
  it('has exactly one solution (GF(2))', () => {
    expect(toggleLogic.verify(p).errors).toEqual([]);
    expect(solveToggle(config).nullity).toBe(0);
    // 4 × 4 has no unique solutions – verify must say so
    expect(solveToggle({ rows: 4, cols: 4, lit: [] }).nullity).toBeGreaterThan(0);
  });
});

describe('path (p03)', () => {
  const p = load('p03');
  const config = p.config as PathConfig;
  const draw = (nodes: string[]) => nodes.reduce<PathState | null>((s, n) => (s ? extendPath(config, s, n) : null), []);
  it('is solvable: every stair once', () => {
    expect(pathLogic.check(p, draw(['1', '4', 'A', '7', '6', '4', '2', 'A', '3', '2', '1', 'A', '5', '7'])!)).toBe(true);
  });
  it('rejects an incomplete line', () => {
    expect(pathLogic.check(p, draw(['1', 'A', '5', '7'])!)).toBe(false);
  });
  it('refuses rule violations', () => {
    expect(extendPath(config, [], '5')).toBeNull(); // must start at 1
    expect(extendPath(config, ['1'], '3')).toBeNull(); // no stair 1–3
    expect(extendPath(config, ['1', '2', '1'], '2')).toBeNull(); // stair 1–2 twice
    expect(extendPath(config, ['1', '2', 'A'], '1')).toBeNull(); // one-way: only 1 → A
    expect(extendPath(config, ['1'], 'A')).toEqual(['1', 'A']);
  });
  it('verifies', () => {
    const { errors, info } = pathLogic.verify(p);
    expect(errors).toEqual([]);
    expect(info).toContain('28 valid lines');
  });
});

describe('arrange: row (p04)', () => {
  const p = load('p04');
  const start = arrangeLogic.initial(p) as RowState;
  it('is solvable by swapping', () => {
    // pendel anker stunde zeit feder rad → feder zeit rad anker stunde pendel
    const end = [[0, 4], [1, 3], [2, 5], [4, 5]].reduce((s, [a, b]) => swapRow(s, a, b), start);
    expect(arrangeLogic.check(p, end)).toBe(true);
  });
  it('rejects the start order', () => expect(arrangeLogic.check(p, start)).toBe(false));
  it('ignores invalid places (rule)', () => {
    expect(swapRow(start, 0, 6)).toBe(start);
    expect(swapRow(start, 2, 2)).toBe(start);
  });
  it('the clues allow exactly one order', () => expect(arrangeLogic.verify(p).errors).toEqual([]));
});

describe('arrange: grid (p08)', () => {
  const p = load('p08');
  const config = p.config as GridConfig;
  const start = arrangeLogic.initial(p) as GridState;
  const put = (moves: Array<[string, number | null]>) => moves.reduce((s, [id, cell]) => placeGrid(config, s, id, cell), start);
  const solved: Array<[string, number]> = [['M1', 5], ['M2', 8], ['M3', 16], ['M4', 18], ['M5', 27], ['M6', 31]];
  it('is solvable', () => expect(arrangeLogic.check(p, put(solved))).toBe(true));
  it('rejects a wrong placement', () => {
    expect(arrangeLogic.check(p, put([...solved.slice(0, 5), ['M6', 33]]))).toBe(false);
  });
  it('refuses stones and unknown pieces (rule)', () => {
    expect(placeGrid(config, start, 'M1', 4)).toBe(start); // a stone
    expect(placeGrid(config, start, 'X9', 5)).toBe(start);
  });
  it('swaps pieces and returns them to the tray', () => {
    const s = put([['M1', 7], ['M2', 8], ['M2', 7]]);
    expect(s.cells[7]).toBe('M2');
    expect(s.cells[8]).toBe('M1');
    expect(placeGrid(config, s, 'M2', null).cells.includes('M2')).toBe(false);
  });
  it('the rules allow exactly one placement', () => expect(arrangeLogic.verify(p).errors).toEqual([]));
});

describe('arrange: sticks, Roman (p22)', () => {
  const p = load('p22');
  const config = p.config as SticksConfig;
  const start = arrangeLogic.initial(p) as SticksState;
  const tap = (slots: string[]) => slots.reduce<ArrangeState>((s, id) => tapStick(config, s as SticksState, id), start);
  it('reads the start as an equation', () => {
    expect(readEquation(stickSlots(config), start.on)).toBe('IX+II=VI');
  });
  it('is solvable: the plus gives its upright stick to the II', () => {
    expect(arrangeLogic.check(p, tap(['c3.P', 'c4.I']))).toBe(true);
    expect(arrangeLogic.describe(p, tap(['c3.P', 'c4.I']))).toBe('IX-III=VI');
  });
  it('rejects a wrong move and a stick still in hand', () => {
    expect(arrangeLogic.check(p, tap(['c3.P', 'c0.I']))).toBe(false);
    expect(arrangeLogic.check(p, tap(['c3.P']))).toBe(false);
  });
  it('refuses a second stick and occupied places (rule)', () => {
    const moved = tap(['c3.P', 'c4.I']) as SticksState;
    expect(tapStick(config, moved, 'c1.I')).toBe(moved); // only one stick may move
    const holding = tap(['c3.P']) as SticksState;
    expect(tapStick(config, holding, 'c1.I')).toBe(holding); // occupied
    expect(tapStick(config, moved, 'c4.I').held).toBe('c4.I'); // the moved stick may move again
  });
  it('has exactly one true equation within one move', () => expect(arrangeLogic.verify(p).errors).toEqual([]));
});

describe('Roman equations', () => {
  it('reads canonical numerals only', () => {
    expect(romanValue('IX')).toBe(9);
    expect(romanValue('XIV')).toBe(14);
    expect(romanValue('IIII')).toBeNull();
    expect(romanValue('VX')).toBeNull();
  });
  it('checks equations', () => {
    expect(equationHolds('IX-III=VI')).toBe(true);
    expect(equationHolds('IX+II=VI')).toBe(false);
    expect(equationHolds('V=V=V')).toBe(false);
    expect(equationHolds('V+=V')).toBe(false);
  });
});

describe('slide (p18)', () => {
  const p = load('p18');
  it('is solvable (BFS, 26 moves)', () => {
    const { errors, info } = slideLogic.verify(p);
    expect(errors).toEqual([]);
    expect(info).toContain('26 moves minimum');
    expect(slideLogic.check(p, [1, 2, 3, 4, 5, 6, 7, 8, 0])).toBe(true);
  });
  it('rejects the start', () => expect(slideLogic.check(p, slideLogic.initial(p))).toBe(false));
  it('does not move tiles away from the gap (rule)', () => {
    const start = slideLogic.initial(p); // gap in the middle
    expect(slideTile(3, start, 0)).toBe(start);
    expect(slideTile(3, start, 1)).not.toBe(start);
  });
});

describe('tap (p11)', () => {
  const p = load('p11');
  it('is solvable: mark the greenhouse', () => expect(tapLogic.check(p, [{ x: 180, y: 205 }])).toBe(true));
  it('rejects a wrong place and an empty picture', () => {
    expect(tapLogic.check(p, [{ x: 128, y: 208 }])).toBe(false);
    expect(tapLogic.check(p, [{ x: 128, y: 100 }])).toBe(false);
    expect(tapLogic.check(p, [])).toBe(false);
  });
  it('refuses more marks than allowed (rule) and removes a mark when tapped again', () => {
    const one = toggleMark(p, [], 180, 205);
    expect(toggleMark(p, one, 30, 200)).toBe(one);
    expect(toggleMark(p, one, 182, 207)).toEqual([] as TapState);
  });
});

describe('custom: pour (p05)', () => {
  const p = load('p05');
  const config = p.config as PourConfig;
  it('is solvable in 13 moves', () => {
    const moves: Array<[number, number]> = [
      [0, 1], [1, 2], [2, 0], [1, 2], [0, 1], [1, 2], [2, 0], [1, 2], [2, 0], [1, 2], [0, 1], [1, 2], [2, 0],
    ];
    const end = moves.reduce<PourState | null>((s, [a, b]) => (s ? pour(config, s, a, b) : null), pourLogic.initial(p));
    expect(end?.levels).toEqual([7, 7, 0]);
    expect(pourLogic.check(p, end!)).toBe(true);
    expect(pourLogic.verify(p).info).toContain('13 moves minimum');
  });
  it('rejects other levels', () => expect(pourLogic.check(p, { levels: [5, 9, 0], moves: 1 })).toBe(false));
  it('refuses pouring from empty, into full or into itself (rule)', () => {
    const start = pourLogic.initial(p);
    expect(pour(config, start, 1, 0)).toBeNull();
    expect(pour(config, start, 0, 0)).toBeNull();
    expect(pour(config, { levels: [5, 9, 0], moves: 1 }, 0, 1)).toBeNull();
  });
});

describe('puzzle schema', () => {
  it('rejects a config that does not fit the engine', () => {
    const raw = JSON.parse(fs.readFileSync(path.resolve('src/content/puzzles/p02.json'), 'utf8'));
    expect(() => parsePuzzle({ ...raw, config: { rows: 9, cols: 3 } })).toThrow();
    expect(() => parsePuzzle({ ...raw, type: 'custom', config: { component: 'nope' } })).toThrow();
  });
});

describe('hints and mentor help [PZL-4] [PZL-5]', () => {
  it('opens hints in order, super hint last', () => {
    expect(nextHint([])).toBe(1);
    expect(nextHint([1, 2])).toBe(3);
    expect(nextHint([1, 2, 3])).toBe(4);
    expect(nextHint([1, 2, 3, 4])).toBeNull();
  });
  it('offers help after 4 minutes, at once after 3 wrong attempts, 2 minutes after a "no"', () => {
    expect(helpDueAt({ attempts: 0, startedAt: 1000 })).toBe(1000 + HELP_AFTER_MS);
    expect(helpDueAt({ attempts: 3, startedAt: 1000 })).toBe(0);
    expect(helpDueAt({ attempts: 5, startedAt: 1000, helpDeclinedAt: 9000 })).toBe(9000 + HELP_REOFFER_MS);
  });
});

describe('arrange: logic grid (p06)', () => {
  const p = load('p06');
  const config = p.config as GridConfig;
  const start = arrangeLogic.initial(p) as GridState;
  // rows = treats (star, mandarin, nut, licorice, gingerbread), columns = doors 1–5
  const solved: Array<[string, number]> = [['E1', 2], ['Q1', 5], ['M1', 14], ['T1', 16], ['D1', 23]];
  const put = (moves: Array<[string, number | null]>) => moves.reduce((s, [id, cell]) => placeGrid(config, s, id, cell), start);
  it('is solvable', () => expect(arrangeLogic.check(p, put(solved))).toBe(true));
  it('rejects a placement that breaks a clue', () => {
    // Ellis and Theo swap doors
    expect(arrangeLogic.check(p, put([['E1', 1], ['Q1', 5], ['M1', 14], ['T1', 17], ['D1', 23]]))).toBe(false);
  });
  it('swaps names instead of stacking them (rule)', () => {
    const s = put([['E1', 2], ['T1', 2]]);
    expect(s.cells[2]).toBe('T1');
    expect(s.cells.includes('E1')).toBe(false);
  });
  it('the five clues allow exactly one placement and match the card', () => {
    expect(arrangeLogic.verify(p).errors).toEqual([]);
    const logic = config.logic!;
    expect(logic.clues.map((c) => clueText(c, logic.names))).toEqual(p.clues);
  });
  it('evaluates clue types', () => {
    const at = placementOf(p.solution as string[]);
    expect(clueHolds({ type: 'next_to', a: { kind: 'E' }, b: { kind: 'D' } }, at)).toBe(true);
    expect(clueHolds({ type: 'left_of', a: { kind: 'M' }, b: { kind: 'Q' } }, at)).toBe(false);
    expect(clueHolds({ type: 'is', a: { item: 3 }, door: 1 }, at)).toBe(true);
  });
});

describe('input with a trap (p07)', () => {
  const p = load('p07');
  it('is solvable', () => expect(inputLogic.check(p, '38')).toBe(true));
  it('rejects the trap 41', () => expect(inputLogic.check(p, '41')).toBe(false));
});

describe('input with house variants (p09)', () => {
  const p = load('p09');
  const forHouse = (house: string) => resolveVariant(p, { profile: { house } } as unknown as SaveDoc);
  it('each house gets its own password', () => {
    expect(inputLogic.check(forHouse('gryffindor'), 'Mistelzweig')).toBe(true);
    expect(inputLogic.check(forHouse('hufflepuff'), 'zimtstern')).toBe(true);
    expect(inputLogic.check(forHouse('ravenclaw'), 'STERN')).toBe(true);
    expect(inputLogic.check(forHouse('slytherin'), 'Silber')).toBe(true);
    expect(inputLogic.check(forHouse('slytherin'), 'Stern')).toBe(false);
  });
  it('the hidden letter rules really spell the passwords', () => {
    const first = 'Meine Igel singen tagsüber, eigentlich lieber zu Weihnachten, eher im Garten'.split(/[ ,]+/).map((w) => w[0]);
    const last = ['Salz', 'Kiwi', 'Lamm', 'Brot', 'Kürbis', 'Kompott', 'Kaffee', 'Zucker', 'Bohnen'].map((w) => w.at(-1));
    const second = ['Asche', 'Wiesel', 'Alraune', 'Ebbe', 'Regen', 'Orden'].map((w) => w[1]);
    const only = (a: string, b: string) => [...new Set(a.toLowerCase())].filter((c) => !b.toLowerCase().includes(c));
    const pairs = [['Sand', 'Hand'], ['Tor', 'Ohr'], ['Eis', 'Mais'], ['Raben', 'Gaben'], ['Nuss', 'Kuss']];
    expect(pairs.every(([a, b]) => only(a, b).length === 1)).toBe(true);
    expect(first.join('').toUpperCase()).toBe('MISTELZWEIG');
    expect(last.join('').toUpperCase()).toBe('ZIMTSTERN');
    expect(second.join('').toUpperCase()).toBe('SILBER');
    expect(pairs.map(([a, b]) => only(a, b)[0]).join('').toUpperCase()).toBe('STERN');
    for (const [house, word] of [['gryffindor', 'Igel'], ['hufflepuff', 'Kompott'], ['ravenclaw', 'Raben'], ['slytherin', 'Wiesel']]) {
      expect(forHouse(house).prompt).toContain(word);
    }
  });
});

describe('choice with a key matrix (p10)', () => {
  const p = load('p10');
  // bow, teeth, metal per hook; the last one is missing
  const board = [
    ['round', 1, 'brass'], ['square', 2, 'iron'], ['heart', 3, 'silver'],
    ['square', 3, 'iron'], ['heart', 1, 'silver'], ['round', 2, 'brass'],
    ['heart', 2, 'silver'], ['round', 3, 'brass'],
  ] as const;
  it('exactly one key completes every row and column', () => {
    const fits: string[] = [];
    for (const bow of ['round', 'square', 'heart']) for (const teeth of [1, 2, 3]) for (const metal of ['brass', 'silver', 'iron']) {
      const full = [...board, [bow, teeth, metal]];
      const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8]];
      if (lines.every((l) => [0, 1, 2].every((attr) => new Set(l.map((i) => full[i][attr])).size === 3))) fits.push(`${bow}/${teeth}/${metal}`);
    }
    expect(fits).toEqual(['square/1/iron']);
  });
  it('accepts only that card', () => {
    expect(choiceLogic.check(p, 1)).toBe(true);
    for (const wrong of [0, 2, 3]) expect(choiceLogic.check(p, wrong)).toBe(false);
  });
});
