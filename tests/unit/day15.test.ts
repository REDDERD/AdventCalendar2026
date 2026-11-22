import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { claimHolds, claimLine, consistentOriginals, type PortraitClaims } from '../../src/puzzles/logic/portraitClaims';
import { tapLogic, type TapConfig } from '../../src/puzzles/logic/tap';
import {
  balanceAnswer,
  clearPans,
  coinsOn,
  cycleCoin,
  minWeighings,
  nameCoin,
  safeFirstSplits,
  weigh,
  weighLogic,
  type WeighConfig,
  type WeighState,
} from '../../src/puzzles/logic/weigh';
import { parsePuzzle, type Puzzle } from '../../src/puzzles/schema';

const load = (id: string): Puzzle =>
  parsePuzzle(JSON.parse(fs.readFileSync(path.resolve(`src/content/puzzles/${id}.json`), 'utf8')));

describe('custom: weigh (p15w)', () => {
  const p = load('p15w');
  const config = p.config as WeighConfig;
  const start = weighLogic.initial(p);
  /** Put coins on the pans: one tap = left pan, two taps = right pan. */
  const put = (s: WeighState, left: number[], right: number[]): WeighState => {
    let next = s;
    for (const c of left) next = cycleCoin(next, c);
    for (const c of right) next = cycleCoin(cycleCoin(next, c), c);
    return next;
  };

  it('needs exactly two weighings for nine coins and has one safe first split: 3 against 3', () => {
    expect(minWeighings(9, 0)).toBe(2);
    expect(minWeighings(10, 0)).toBe(3);
    expect(safeFirstSplits(config)).toEqual([3]);
    expect(weighLogic.verify(p).errors).toEqual([]);
  });

  it('a coin cycles tray → left → right → tray', () => {
    const left = cycleCoin(start, 2);
    expect(coinsOn(left, 'left')).toEqual([2]);
    const right = cycleCoin(left, 2);
    expect(coinsOn(right, 'right')).toEqual([2]);
    expect(coinsOn(cycleCoin(right, 2), 'tray')).toContain(2);
  });

  it('refuses weighings with empty or unequal pans (rule)', () => {
    expect(weigh(config, start)).toBeNull();
    expect(weigh(config, put(start, [0, 1], [2]))).toBeNull();
  });

  it('the scale keeps the most suspects: 3 against 3 is balanced, 4 against 4 tips', () => {
    const all = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    expect(balanceAnswer(all, [0, 1, 2], [3, 4, 5])).toEqual({ result: 'even', candidates: [6, 7, 8] });
    expect(balanceAnswer(all, [0, 1, 2, 3], [4, 5, 6, 7])).toEqual({ result: 'left_up', candidates: [0, 1, 2, 3] });
  });

  it('the pans must be cleared between weighings; a spent scale refuses more', () => {
    let s = weigh(config, put(start, [0, 1, 2], [3, 4, 5]))!;
    expect(s.weighed).toBe(true);
    expect(weigh(config, s)).toBeNull();
    expect(cycleCoin(s, 6)).toBe(s);
    s = clearPans(s);
    s = weigh(config, put(s, [6], [7]))!;
    s = clearPans(s);
    expect(s.log).toHaveLength(2);
    expect(weigh(config, put(s, [0], [1]))).toBeNull();
  });

  it('a sound plan wins: 3 against 3, then 1 against 1, then the coin is named', () => {
    let s = weigh(config, put(start, [0, 1, 2], [3, 4, 5]))!;
    s = clearPans(s);
    s = weigh(config, put(s, [6], [7]))!;
    expect(s.candidates).toEqual([8]);
    const won = nameCoin(s, 8)!;
    expect(weighLogic.check(p, won)).toBe(true);
    expect(weighLogic.describe(p, won)).toContain('Münze 9 benannt: richtig');
  });

  it('guessing loses: a coin named while other suspects remain is wrong, whichever it is', () => {
    expect(weighLogic.check(p, nameCoin(start, 4)!)).toBe(false);
    let s = weigh(config, put(start, [0, 1, 2, 3], [4, 5, 6, 7]))!; // four suspects stay behind
    s = clearPans(s);
    s = weigh(config, put(s, [0], [1]))!;
    expect(s.candidates.length).toBeGreaterThan(1);
    for (const c of s.candidates) expect(nameCoin(s, c)!.outcome).toBe('lost');
  });

  it('only 3 against 3 first can lead to a sure answer, for every possible first weighing', () => {
    // every pan arrangement (each coin: tray, left, right) with equal, non-empty pans
    for (let mask = 0; mask < 3 ** 9; mask++) {
      const left: number[] = [];
      const right: number[] = [];
      let m = mask;
      for (let c = 0; c < 9; c++, m = Math.floor(m / 3)) {
        if (m % 3 === 1) left.push(c);
        if (m % 3 === 2) right.push(c);
      }
      if (!left.length || left.length !== right.length) continue;
      const first = weigh(config, put(start, left, right))!;
      // a second weighing finds the coin only if at most three suspects are left after the first
      expect(first.candidates.length <= 3).toBe(left.length === 3);
    }
  });
});

describe('tap with talking portraits (p15a)', () => {
  const p = load('p15a');
  const config = p.config as TapConfig;
  const claims = config.claims as PortraitClaims;
  const at = (n: number) => {
    const t = config.targets[n - 1];
    return { x: t.x + t.w / 2, y: t.y + t.h / 2 };
  };

  it('has exactly one possible original: frame 7', () => {
    expect(consistentOriginals(claims)).toEqual([7]);
    expect(tapLogic.verify(p).errors).toEqual([]);
  });

  it('the card says what the logic checks, frame by frame', () => {
    expect(p.clues).toEqual(claims.statements.map((c, i) => claimLine(i + 1, c)));
    expect(p.clues![7]).toBe('Bild 8: „Bild 2 ist das Original.“');
  });

  it('the original is right, every copy and an empty picture are not', () => {
    expect(tapLogic.check(p, [at(7)])).toBe(true);
    for (const n of [1, 2, 3, 4, 5, 6, 8]) expect(tapLogic.check(p, [at(n)])).toBe(false);
    expect(tapLogic.check(p, [])).toBe(false);
    expect(tapLogic.check(p, [at(7), at(3)])).toBe(false);
  });

  it('every wrong frame clashes with at least two statements', () => {
    for (let n = 1; n <= 8; n++) {
      if (n === 7) continue;
      const clashes = claims.statements.filter((s, i) => claimHolds(claims, s, i + 1, n) !== (i + 1 === n)).length;
      expect(clashes).toBeGreaterThanOrEqual(2);
    }
  });

  it('claims are read by column and row: 1 2 3 4 on top, 5 6 7 8 below', () => {
    expect(claimHolds(claims, { type: 'top_row' }, 1, 3)).toBe(true);
    expect(claimHolds(claims, { type: 'top_row' }, 1, 7)).toBe(false);
    expect(claimHolds(claims, { type: 'left_of', of: 2 }, 4, 5)).toBe(true); // 5 is in column 0, 2 in column 1
    expect(claimHolds(claims, { type: 'next_to_me' }, 4, 5)).toBe(false); // 4 ends the top row, 5 starts the next
    expect(claimHolds(claims, { type: 'next_to_me' }, 6, 7)).toBe(true);
  });
});
