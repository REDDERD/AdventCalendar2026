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
} from '../../src/puzzles/logic/arrange';
import { choiceLogic } from '../../src/puzzles/logic/choice';
import { inputLogic } from '../../src/puzzles/logic/input';
import { extendPath, pathLogic, type PathConfig, type PathState } from '../../src/puzzles/logic/path';
import { pour, pourLogic, type PourConfig, type PourState } from '../../src/puzzles/logic/pour';
import { slideLogic, slideTile } from '../../src/puzzles/logic/slide';
import { tapLogic, toggleMark, type TapState } from '../../src/puzzles/logic/tap';
import { toggleCell, toggleLogic, type ToggleConfig } from '../../src/puzzles/logic/toggle';
import { parsePuzzle, type Puzzle } from '../../src/puzzles/schema';
import { helpDueAt, HELP_AFTER_MS, HELP_REOFFER_MS, nextHint } from '../../src/puzzles/scoring';

const load = (id: string): Puzzle =>
  parsePuzzle(JSON.parse(fs.readFileSync(path.resolve(`src/content/puzzles/${id}.json`), 'utf8')));

// [PZL-2] every engine: solvable, wrong input, rule violation

describe('input (p01)', () => {
  const p = load('p01');
  it('is solvable', () => expect(inputLogic.check(p, '11')).toBe(true));
  it('rejects a wrong answer', () => expect(inputLogic.check(p, '12')).toBe(false));
  it('rejects empty input', () => expect(inputLogic.check(p, '  ')).toBe(false));
  it('verifies', () => expect(inputLogic.verify(p).errors).toEqual([]));
});

describe('choice (p21)', () => {
  const p = load('p21');
  it('is solvable', () => expect(choiceLogic.check(p, 3)).toBe(true));
  it('rejects a wrong card', () => expect(choiceLogic.check(p, 0)).toBe(false));
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
  it('is solvable: corners and centre', () => expect(toggleLogic.check(p, tap([0, 2, 4, 6, 8]))).toBe(true));
  it('rejects a wrong pattern', () => {
    expect(toggleLogic.check(p, tap([4]))).toBe(false);
    expect(toggleLogic.check(p, tap([0, 2, 4, 6, 8, 8]))).toBe(false);
  });
  it('ignores cells outside the grid (rule)', () => {
    const start = toggleLogic.initial(p);
    expect(toggleCell(config, start, 9)).toBe(start);
    expect(toggleCell(config, start, -1)).toBe(start);
  });
  it('has exactly one solution', () => expect(toggleLogic.verify(p).errors).toEqual([]));
});

describe('path (p03)', () => {
  const p = load('p03');
  const config = p.config as PathConfig;
  const draw = (nodes: string[]) => nodes.reduce<PathState | null>((s, n) => (s ? extendPath(config, s, n) : null), []);
  it('is solvable: every stair once', () => {
    expect(pathLogic.check(p, draw(['1', '5', '3', '6', '5', '4', '6', '2', '1', '7'])!)).toBe(true);
  });
  it('rejects an incomplete line (the direct stair)', () => {
    expect(pathLogic.check(p, draw(['1', '7'])!)).toBe(false);
  });
  it('refuses rule violations', () => {
    expect(extendPath(config, [], '5')).toBeNull(); // must start at 1
    expect(extendPath(config, ['1'], '3')).toBeNull(); // no stair 1–3
    expect(extendPath(config, ['1', '5', '1'], '5')).toBeNull(); // stair 1–5 twice
    expect(pathLogic.check(p, ['1', '5', '1'])).toBe(false);
  });
  it('verifies (12 lines, as in the storyboard)', () => {
    const { errors, info } = pathLogic.verify(p);
    expect(errors).toEqual([]);
    expect(info).toContain('12 valid lines');
  });
});

describe('arrange: row (p04)', () => {
  const p = load('p04');
  const start = arrangeLogic.initial(p) as RowState;
  it('is solvable by swapping', () => {
    // pendel stunde rad feder zeit → feder zeit rad stunde pendel
    let s = swapRow(start, 0, 4); // zeit … pendel
    s = swapRow(s, 0, 3); // feder stunde rad zeit pendel
    s = swapRow(s, 1, 3); // feder zeit rad stunde pendel
    expect(arrangeLogic.check(p, s)).toBe(true);
  });
  it('rejects the start order', () => expect(arrangeLogic.check(p, start)).toBe(false));
  it('ignores invalid places (rule)', () => {
    expect(swapRow(start, 0, 5)).toBe(start);
    expect(swapRow(start, 2, 2)).toBe(start);
  });
  it('the clues allow exactly one order', () => expect(arrangeLogic.verify(p).errors).toEqual([]));
});

describe('arrange: grid (p08)', () => {
  const p = load('p08');
  const config = p.config as GridConfig;
  const start = arrangeLogic.initial(p) as GridState;
  const put = (moves: Array<[string, number | null]>) => moves.reduce((s, [id, cell]) => placeGrid(config, s, id, cell), start);
  it('is solvable', () => expect(arrangeLogic.check(p, put([['M1', 7], ['M2', 8], ['M3', 14]]))).toBe(true));
  it('rejects a wrong placement', () => expect(arrangeLogic.check(p, put([['M1', 4], ['M2', 11], ['M3', 14]]))).toBe(false));
  it('refuses fixed cells and unknown pieces (rule)', () => {
    expect(placeGrid(config, start, 'M1', 1)).toBe(start); // the given pot
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

describe('arrange: sticks (p22)', () => {
  const p = load('p22');
  const config = p.config as SticksConfig;
  const start = arrangeLogic.initial(p) as SticksState;
  const tap = (slots: string[]) => slots.reduce<ArrangeState>((s, id) => tapStick(config, s as SticksState, id), start);
  it('is solvable both ways', () => {
    expect(arrangeLogic.check(p, tap(['r1', 'r2']))).toBe(true); // V + I = VI
    expect(arrangeLogic.check(p, tap(['r1', 'a1']))).toBe(true); // IV + I = V
  });
  it('rejects a wrong move and a stick still in hand', () => {
    expect(arrangeLogic.check(p, tap(['i1', 'a1']))).toBe(false);
    expect(arrangeLogic.check(p, tap(['r1']))).toBe(false);
  });
  it('refuses a second stick and occupied places (rule)', () => {
    const moved = tap(['r1', 'r2']) as SticksState;
    expect(tapStick(config, moved, 'v1')).toBe(moved); // only one stick may move
    const holding = tap(['r1']) as SticksState;
    expect(tapStick(config, holding, 'v1')).toBe(holding); // occupied
    // the moved stick itself may move again
    expect(tapStick(config, moved, 'r2').held).toBe('r2');
  });
});

describe('slide (p18)', () => {
  const p = load('p18');
  it('is solvable (BFS, 18 moves)', () => {
    const { errors, info } = slideLogic.verify(p);
    expect(errors).toEqual([]);
    expect(info).toContain('18 moves minimum');
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
  it('is solvable: mark the greenhouse', () => expect(tapLogic.check(p, [{ x: 222, y: 205 }])).toBe(true));
  it('rejects a wrong place and an empty picture', () => {
    expect(tapLogic.check(p, [{ x: 160, y: 208 }])).toBe(false);
    expect(tapLogic.check(p, [{ x: 128, y: 100 }])).toBe(false);
    expect(tapLogic.check(p, [])).toBe(false);
  });
  it('refuses more marks than allowed (rule) and removes a mark when tapped again', () => {
    const one = toggleMark(p, [], 222, 205);
    expect(toggleMark(p, one, 30, 200)).toBe(one);
    expect(toggleMark(p, one, 224, 207)).toEqual([] as TapState);
  });
});

describe('custom: pour (p05)', () => {
  const p = load('p05');
  const config = p.config as PourConfig;
  it('is solvable in 7 moves', () => {
    const moves: Array<[number, number]> = [[0, 1], [1, 2], [2, 0], [1, 2], [0, 1], [1, 2], [2, 0]];
    const end = moves.reduce<PourState | null>((s, [a, b]) => (s ? pour(config, s, a, b) : null), pourLogic.initial(p));
    expect(end?.levels).toEqual([4, 4, 0]);
    expect(pourLogic.check(p, end!)).toBe(true);
  });
  it('rejects other levels', () => expect(pourLogic.check(p, { levels: [3, 5, 0], moves: 1 })).toBe(false));
  it('refuses pouring from empty, into full or into itself (rule)', () => {
    const start = pourLogic.initial(p);
    expect(pour(config, start, 1, 0)).toBeNull();
    expect(pour(config, start, 0, 0)).toBeNull();
    expect(pour(config, { levels: [3, 5, 0], moves: 1 }, 0, 1)).toBeNull();
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
