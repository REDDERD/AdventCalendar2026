import { describe, expect, it } from 'vitest';
import {
  currentRunEvents,
  decisionStats,
  FLAG_DURATION_SEC,
  playerSummary,
  playerTimeline,
  puzzleStats,
  type AnyEvent,
  type DayCatalogEntry,
} from '../../src/admin/analysis';
import type { AdminPlayer } from '../../src/admin/data';
import { cropRect, ditherToPalette, PALETTE_RGB, PHOTO_H, PHOTO_W } from '../../src/admin/photo';
import { newSave } from '../../src/services/SaveService';
import type { EventType, PuzzleResult, SaveDoc, UserDoc } from '../../src/types';

const catalog: DayCatalogEntry[] = [
  { id: 'd07.letter', day: 7, question: 'Der Brief?', options: [{ option: 'give', text: 'Quill geben' }, { option: 'keep', text: 'Einstecken' }] },
  { id: 'd07.home', day: 7, question: 'Nach Hause schreiben?', options: [{ option: 'write', text: 'Ja' }, { option: 'skip', text: 'Nein' }] },
  { id: 'd08.mandrake', day: 8, question: 'Die Alraune?', options: [{ option: 'sing', text: 'Singen' }, { option: 'pot', text: 'Umtopfen' }] },
];

function player(uid: string, runId: number, save: Partial<SaveDoc> | null = {}): AdminPlayer {
  const user: UserDoc = {
    uid, username: uid, displayName: uid, role: 'player', active: true, isTest: false, runId, createdAt: 0, lastSeenAt: null,
  };
  return { user, save: save ? { ...newSave(uid, runId), ...save } : null };
}

let n = 0;
const ev = (uid: string, runId: number, type: EventType, day: number | null, data: Record<string, unknown>): AnyEvent => ({
  uid, runId, type, day, data, at: ++n * 1000, clientAt: n * 1000, appVersion: 't',
});

const result = (r: Partial<PuzzleResult>): PuzzleResult => ({ solved: true, attempts: 1, hintsBought: [], points: 30, solvedBy: 'self', ...r });

describe('admin.decisions (Section 11.3)', () => {
  const lena = player('lena', 2);
  const mama = player('mama', 1);
  const events = [
    ev('lena', 1, 'choice', 7, { cid: 'd07.letter', option: 'give' }), // old run → ignored [ADM-8]
    ev('lena', 2, 'choice', 7, { cid: 'd07.letter', option: 'keep' }),
    ev('mama', 1, 'choice', 7, { cid: 'd07.letter', option: 'keep' }),
    ev('mama', 1, 'choice', 8, { cid: 'd08.mandrake', option: 'sing' }),
    ev('ghost', 1, 'choice', 8, { cid: 'd08.mandrake', option: 'pot' }), // unknown player → ignored
  ];

  it('counts each player once per point, current run only', () => {
    const days = decisionStats(catalog, currentRunEvents([lena, mama], events));
    const letter = days.get(7)![0];
    expect(letter.total).toBe(2);
    expect(letter.options.find((o) => o.option === 'keep')!.uids.sort()).toEqual(['lena', 'mama']);
    expect(letter.options.find((o) => o.option === 'give')!.uids).toEqual([]);
    expect(days.get(7)![1].total).toBe(0); // nobody wrote home yet
    expect(days.get(8)![0].options.map((o) => o.uids)).toEqual([['mama'], []]);
  });

  it('summarises house, route, accused and ending per player', () => {
    const save = newSave('x', 1);
    save.profile = {
      name: 'Lena', pronoun: 'f', look: {} as never, wand: 'phoenix', pet: 'cat',
      hatSuggestion: 'ravenclaw', house: 'slytherin', hatOverruled: true, sortingAnswers: [],
    };
    save.vars = { route: 'archive', accused: 'aldous' };
    save.ending = 'A';
    expect(playerSummary(save)).toEqual({ hatSuggestion: 'ravenclaw', house: 'slytherin', overruled: true, route: 'archive', accused: 'aldous', ending: 'A' });
    expect(playerSummary(null).house).toBeNull();
  });
});

describe('admin.puzzles (Section 11.3)', () => {
  it('averages over the solvers and flags long or helped puzzles', () => {
    const players = [
      player('a', 1, { puzzles: { p01: result({ attempts: 1, durationSec: 60 }), p02: result({ solvedBy: 'help', durationSec: 700, hintsBought: [1, 2, 3, 4] }) } }),
      player('b', 1, { puzzles: { p01: result({ attempts: 3, durationSec: 120, hintsBought: [1] }), p02: { solved: false, attempts: 4, hintsBought: [], points: 0 } } }),
      player('c', 1, null),
    ];
    const [p01, p02, p03] = puzzleStats(['p01', 'p02', 'p03'], players);
    expect(p01).toMatchObject({ started: 2, solved: 2, avgAttempts: 2, avgDurationSec: 90, hintRate: 0.5, helpRate: 0, flagged: false });
    expect(p02).toMatchObject({ started: 2, solved: 1, helpRate: 1, flagged: true });
    expect(p02.avgDurationSec).toBeGreaterThan(FLAG_DURATION_SEC);
    expect(p03).toMatchObject({ started: 0, solved: 0, avgAttempts: null, hintRate: null, flagged: false });
  });
});

describe('admin.player timeline (Section 11.3)', () => {
  it('collects choices, attempts with inputs, hints and finds per day', () => {
    const save = newSave('lena', 1);
    save.progress.dayStartedAt = { '7': 1000 };
    save.progress.completedDays = [7];
    save.puzzles.p07 = result({ attempts: 2, points: 24, durationSec: 102 });
    const events = [
      ev('lena', 1, 'day_start', 7, {}),
      ev('lena', 1, 'choice', 7, { cid: 'd07.letter', option: 'keep' }),
      ev('lena', 1, 'puzzle_start', 7, { puzzleId: 'p07' }),
      ev('lena', 1, 'puzzle_hint', 7, { puzzleId: 'p07', level: 1, free: true }),
      ev('lena', 1, 'puzzle_attempt', 7, { puzzleId: 'p07', input: '41', correct: false }),
      ev('lena', 1, 'puzzle_attempt', 7, { puzzleId: 'p07', input: '38', correct: true }),
      ev('lena', 1, 'clue_found', 7, { id: 'k02' }),
      ev('lena', 1, 'day_complete', 7, { durationSec: 431 }),
      ev('lena', 1, 'session_start', null, {}),
    ];
    const [day] = playerTimeline(save, events, catalog);
    expect(day.day).toBe(7);
    expect(day.durationSec).toBe(431);
    expect(day.choices).toEqual([{ question: 'Der Brief?', text: 'Einstecken' }]);
    expect(day.puzzles).toHaveLength(1);
    expect(day.puzzles[0].attempts.map((a) => [a.input, a.correct])).toEqual([['41', false], ['38', true]]);
    expect(day.puzzles[0].hints).toEqual(['1 (frei)']);
    expect(day.puzzles[0].result?.points).toBe(24);
    expect(day.finds).toEqual([{ type: 'clue_found', id: 'k02' }]);
  });

  it('lists started days without events and computes the duration from the save', () => {
    const save = newSave('lena', 1);
    save.progress.dayStartedAt = { '3': 10_000 };
    save.progress.dayCompletedAt = { '3': 70_000 };
    expect(playerTimeline(save, [], catalog)).toMatchObject([{ day: 3, durationSec: 60 }]);
  });
});

describe('mirror photo [PRS-1]', () => {
  it('crops 4:3 from the middle and keeps the crop inside the picture', () => {
    expect(cropRect(400, 300)).toEqual({ sx: 0, sy: 0, sw: 400, sh: 300 });
    expect(cropRect(400, 600)).toEqual({ sx: 0, sy: 150, sw: 400, sh: 300 });
    const r = cropRect(800, 600, 2, 1, -1);
    expect(r).toEqual({ sx: 400, sy: 0, sw: 400, sh: 300 });
  });

  it('dithers every pixel onto the game palette', () => {
    const data = new Uint8ClampedArray(PHOTO_W * PHOTO_H * 4);
    for (let i = 0; i < PHOTO_W * PHOTO_H; i++) data.set([(i * 7) % 256, (i * 13) % 256, (i * 3) % 256, 128], i * 4);
    ditherToPalette(data, PHOTO_W, PHOTO_H);
    const keys = new Set(PALETTE_RGB.map((c) => c.join()));
    for (let i = 0; i < PHOTO_W * PHOTO_H; i++) {
      expect(keys.has([data[i * 4], data[i * 4 + 1], data[i * 4 + 2]].join())).toBe(true);
      expect(data[i * 4 + 3]).toBe(255);
    }
  });
});
