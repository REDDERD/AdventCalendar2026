import { describe, expect, it } from 'vitest';
import { evaluateEnding } from '../../src/core/ending';
import { computeScale } from '../../src/core/PixelStage';
import { matchesAnswer, normalizeAnswer } from '../../src/puzzles/normalize';
import { pointsFor, rivalScores } from '../../src/puzzles/scoring';
import { emailToUsername, isValidUsername, normalizeUsername, usernameToEmail } from '../../src/services/username';

describe('username → email [AUTH-1] [AUTH-2]', () => {
  it('maps to the synthetic domain', () => {
    expect(usernameToEmail('lena')).toBe('lena@hogwarts.example.com');
  });

  it('trims and lowercases input', () => {
    expect(normalizeUsername('  Mama ')).toBe('mama');
    expect(usernameToEmail(' LeNa ')).toBe('lena@hogwarts.example.com');
  });

  it('accepts 3–16 chars of a–z, 0–9 and -', () => {
    expect(isValidUsername('abc')).toBe(true);
    expect(isValidUsername('oma-2')).toBe(true);
    expect(isValidUsername('a'.repeat(16))).toBe(true);
    expect(isValidUsername('ab')).toBe(false);
    expect(isValidUsername('a'.repeat(17))).toBe(false);
    expect(isValidUsername('jürgen')).toBe(false);
    expect(isValidUsername('a b')).toBe(false);
    expect(isValidUsername('a_b')).toBe(false);
  });

  it('rejects invalid names', () => {
    expect(() => usernameToEmail('x')).toThrow();
  });

  it('maps back', () => {
    expect(emailToUsername('papa@hogwarts.example.com')).toBe('papa');
    expect(emailToUsername('papa@example.com')).toBeNull();
  });
});

describe('input normalisation [PZL-1]', () => {
  it('lowercases, transliterates umlauts and strips spaces/punctuation', () => {
    expect(normalizeAnswer('  Große Übung! ')).toBe('grosseuebung');
    expect(normalizeAnswer('Ä-ö, ü.')).toBe('aeoeue');
    expect(normalizeAnswer('11')).toBe('11');
  });

  it('compares against every normalised solution', () => {
    expect(matchesAnswer('Grosse Uebung', ['große Übung'])).toBe(true);
    expect(matchesAnswer('11', ['elf', '11'])).toBe(true);
    expect(matchesAnswer('12', ['11'])).toBe(false);
    expect(matchesAnswer('  ', [''])).toBe(false);
  });
});

describe('house points (Section 10.3)', () => {
  it('awards 100 / 80 / 60 % by attempt', () => {
    expect(pointsFor(50, 1, 'self')).toBe(50);
    expect(pointsFor(50, 2, 'self')).toBe(40);
    expect(pointsFor(50, 3, 'self')).toBe(30);
    expect(pointsFor(50, 7, 'self')).toBe(30);
  });

  it('awards 25 % when Quill helped', () => {
    expect(pointsFor(40, 1, 'help')).toBe(10);
    expect(pointsFor(100, 5, 'help')).toBe(25);
  });

  it('keeps rival houses just below the player [PZL-7]', () => {
    const rivals = rivalScores(1000);
    expect(rivals).toEqual([880, 820, 750]);
    for (const r of rivals) expect(r).toBeLessThan(1000);
  });
});

describe('ending evaluation [END-1]', () => {
  const base = { clues: ['k02', 'k06', 'k07'], trust_aldous: 1, bond_ellis: 0 };

  it('A: aldous accused, ≥ 3 essential clues, trust_aldous ≥ 1', () => {
    expect(evaluateEnding({ ...base, accused: 'aldous' })).toBe('A');
  });

  it('B: aldous accused but too few essential clues', () => {
    expect(evaluateEnding({ ...base, accused: 'aldous', clues: ['k02', 'k06', 'k01', 'k03'] })).toBe('B');
  });

  it('B: aldous accused but trust_aldous too low', () => {
    expect(evaluateEnding({ ...base, accused: 'aldous', trust_aldous: 0 })).toBe('B');
  });

  it('C_A: someone else accused, bond_ellis ≥ 4', () => {
    expect(evaluateEnding({ ...base, accused: 'theo', bond_ellis: 4 })).toBe('C_A');
  });

  it('C_B: someone else accused, bond_ellis < 4', () => {
    expect(evaluateEnding({ ...base, accused: 'grimsby', bond_ellis: 3 })).toBe('C_B');
  });

  it('checks A before C even with a strong bond', () => {
    expect(evaluateEnding({ ...base, accused: 'aldous', bond_ellis: 5 })).toBe('A');
  });
});

describe('stage scaling [UI-1]', () => {
  it('uses an integer device-pixel factor when wide enough', () => {
    // iPhone 13: 390 CSS px, DPR 3 → s = 4 → 341.3 CSS px (87.5 %)
    expect(computeScale(390, 800, 3)).toBeCloseTo(4 / 3);
  });

  it('falls back to a fractional factor below 85 % of the width', () => {
    // 375 CSS px, DPR 2 → s = 2 → 256 px = 68 % → fill width
    expect(computeScale(375, 2000, 2)).toBeCloseTo(375 / 256);
  });

  it('never exceeds the available height', () => {
    expect(448 * computeScale(375, 600, 2)).toBeLessThanOrEqual(600);
  });
});
