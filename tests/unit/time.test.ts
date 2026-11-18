import { describe, expect, it } from 'vitest';
import { getEntry, resolveDay, schedule } from '../../src/content/schedule';
import { doorState, isPlayable, isUnlocked, nextPlayableDay, waitingChapters } from '../../src/core/time';

const t = (iso: string) => Date.parse(iso);

describe('schedule [STR-2]', () => {
  it('has the prologue and 24 days', () => {
    expect(schedule.map((e) => e.day)).toEqual(Array.from({ length: 25 }, (_, i) => i));
  });

  it('unlocks day N at 2026-12-N 00:00 Europe/Berlin', () => {
    expect(getEntry(1).unlockAt).toBe('2026-11-30T23:00:00.000Z');
    expect(getEntry(7).unlockAt).toBe('2026-12-06T23:00:00.000Z');
    expect(getEntry(24).unlockAt).toBe('2026-12-23T23:00:00.000Z');
    expect(getEntry(0).unlockAt).toBe('2026-11-30T17:00:00.000Z');
  });

  it('resolves route variants for days 13–15', () => {
    expect(resolveDay(13, 'archive')).toMatchObject({ location: 'archive', puzzleIds: ['p13a'] });
    expect(resolveDay(14, 'forest')).toMatchObject({ location: 'forest_clearing', puzzleIds: ['p14w'] });
    expect(resolveDay(13).puzzleIds).toEqual(['p13w', 'p13a']);
  });
});

describe('UnlockService boundaries [DAY-1]', () => {
  it('day 7 is locked at 22:59:59 UTC and unlocked at 23:00:00 UTC', () => {
    expect(isUnlocked(7, t('2026-12-06T22:59:59.999Z'))).toBe(false);
    expect(isUnlocked(7, t('2026-12-06T23:00:00.000Z'))).toBe(true);
  });

  it('day 1 unlocks at 2026-11-30 23:00 UTC', () => {
    expect(isUnlocked(1, t('2026-11-30T22:59:59Z'))).toBe(false);
    expect(isUnlocked(1, t('2026-11-30T23:00:00Z'))).toBe(true);
  });

  it('prologue is locked at 16:59:59 UTC and unlocked at 17:00:00 UTC', () => {
    expect(isUnlocked(0, t('2026-11-30T16:59:59Z'))).toBe(false);
    expect(isUnlocked(0, t('2026-11-30T17:00:00Z'))).toBe(true);
  });

  it('requires the previous day to be completed', () => {
    const now = t('2026-12-10T12:00:00Z');
    expect(isPlayable(5, now, [0, 1, 2, 3])).toBe(false);
    expect(isPlayable(5, now, [0, 1, 2, 3, 4])).toBe(true);
    expect(isPlayable(1, now, [])).toBe(false);
    expect(isPlayable(1, now, [0])).toBe(true);
  });

  it('does not offer completed days again [DAY-5]', () => {
    expect(isPlayable(1, t('2026-12-10T12:00:00Z'), [0, 1])).toBe(false);
    expect(doorState(1, t('2026-12-10T12:00:00Z'), [0, 1])).toBe('done');
  });

  it('reports door states', () => {
    const now = t('2026-12-03T08:00:00Z');
    const done = [0, 1];
    expect(doorState(1, now, done)).toBe('done');
    expect(doorState(2, now, done)).toBe('available');
    expect(doorState(3, now, done)).toBe('locked');
    expect(doorState(4, now, done)).toBe('locked');
  });

  it('counts waiting chapters and finds the next playable day [DAY-3]', () => {
    const now = t('2026-12-03T08:00:00Z'); // days 1–3 unlocked
    expect(waitingChapters(now, [0])).toBe(3);
    expect(nextPlayableDay(now, [0])).toBe(1);
    expect(nextPlayableDay(now, [0, 1, 2, 3])).toBeNull();
    expect(nextPlayableDay(t('2026-11-30T18:00:00Z'), [])).toBe(0);
  });
});
