import { describe, expect, it } from 'vitest';
import type { AdminPlayer } from '../../src/admin/data';
import { eventSentence, formatDuration, puzzleNumber, type CatalogEntry } from '../../src/admin/eventText';
import { overviewMetrics, playerStatus, relativeTime, statusLabel } from '../../src/admin/stats';
import { WORDS } from '../../src/content/wordlist';
import { generatePassword, suggestUsername } from '../../src/services/password';
import { newSave } from '../../src/services/SaveService';
import { isValidUsername } from '../../src/services/username';
import type { EventType, SaveDoc, UserDoc } from '../../src/types';

const t = (iso: string) => Date.parse(iso);

const catalog: CatalogEntry[] = [
  { id: 'd07.letter', question: 'Was tun?', options: [{ option: 'give', text: 'Den Brief Quill geben' }, { option: 'keep', text: 'Den Brief einstecken' }] },
];

const say = (type: EventType, data: Record<string, unknown>, day: number | null = 7) => eventSentence({ type, day, data }, 'Lena', catalog);

describe('feed sentences [ADM-13] (Section 17.2)', () => {
  it('uses the catalog text for choices', () => {
    expect(say('choice', { cid: 'd07.letter', option: 'keep', label: 'alt' })).toBe('Lena hat an Tag 7 gewählt: „Den Brief einstecken“.');
  });

  it('falls back to the logged label for unknown choices', () => {
    expect(say('choice', { cid: 'd99.x', option: 'a', label: 'Etwas' })).toBe('Lena hat an Tag 7 gewählt: „Etwas“.');
    expect(say('choice', { cid: 'd00.nervous', option: 'ready', label: 'Ich bin bereit!' }, 0)).toBe('Lena hat im Prolog gewählt: „Ich bin bereit!“.');
  });

  it('describes solved puzzles', () => {
    expect(say('puzzle_solved', { puzzleId: 'p07', attempts: 2, durationSec: 102, points: 24, solvedBy: 'self' })).toBe(
      'Lena hat Rätsel 07 im 2. Versuch gelöst (1:42 min, +24 Punkte).',
    );
    expect(say('puzzle_solved', { puzzleId: 'p13w', durationSec: 250, solvedBy: 'help' })).toBe(
      'Lena hat Rätsel 13w gemeinsam mit Prof. Quill gelöst (4:10 min).',
    );
  });

  it('describes attempts, hints, sorting and progress', () => {
    expect(say('puzzle_attempt', { puzzleId: 'p01', input: '12', correct: false })).toContain('leider falsch');
    expect(say('puzzle_hint', { puzzleId: 'p01', level: 'super', free: false })).toBe('Lena hat bei Rätsel 01 den Super-Hinweis gekauft.');
    expect(say('puzzle_hint', { puzzleId: 'p05', level: 1, free: true })).toBe('Lena hat bei Rätsel 05 Hinweis 1 geschenkt bekommen.');
    expect(say('sorting_result', { suggestion: 'ravenclaw', chosen: 'slytherin', overruled: true }, 0)).toBe(
      'Lena hat dem Hut widersprochen und ist jetzt in Slytherin (statt Ravenclaw).',
    );
    expect(say('sorting_result', { suggestion: 'ravenclaw', chosen: 'ravenclaw', overruled: false }, 0)).toBe('Lena ist jetzt in Ravenclaw.');
    expect(say('day_complete', { durationSec: 245 }, 0)).toBe('Lena hat den Prolog abgeschlossen (4:05 min).');
    expect(say('day_start', {}, 3)).toBe('Lena hat Kapitel 3 begonnen.');
    expect(say('clue_found', { id: 'k02' })).toBe('Lena hat an Tag 7 einen Hinweis gefunden: Eiskalte Stelle vor der Uhr.');
    expect(say('prologue_value', { field: 'pet', value: 'toad' }, 0)).toBe('Lena hat eine Kröte als Haustier gewählt.');
    expect(say('session_start', { platform: 'ios', standalone: true }, null)).toBe('Lena hat das Spiel geöffnet (iPhone, als App).');
  });

  it('has a sentence for every event type', () => {
    const types: EventType[] = [
      'session_start', 'prologue_value', 'sorting_answer', 'sorting_result', 'day_start', 'choice', 'clue_found',
      'item_found', 'spark_found', 'puzzle_start', 'puzzle_attempt', 'puzzle_hint', 'puzzle_solved',
      'day_complete', 'ending', 'letter_opened',
    ];
    for (const type of types) expect(say(type, {})).toMatch(/^Lena /);
  });

  it('formats helpers', () => {
    expect(formatDuration(65)).toBe('1:05 min');
    expect(puzzleNumber('p13a')).toBe('13a');
  });
});

function player(save: Partial<SaveDoc> | null, user: Partial<UserDoc> = {}): AdminPlayer {
  const base: UserDoc = {
    uid: 'u1', username: 'lena', displayName: 'Lena', role: 'player', active: true, isTest: false,
    runId: 1, createdAt: 0, lastSeenAt: null, ...user,
  };
  return { user: base, save: save ? { ...newSave('u1', 1), ...save } : null };
}

describe('overview status chip (Section 11.3)', () => {
  const now = t('2026-12-07T18:00:00Z'); // days 1–7 unlocked

  it('not started / playing / behind / up to date / finished', () => {
    expect(playerStatus(null, now).status).toBe('not_started');
    expect(playerStatus(player({}).save, now).status).toBe('not_started');

    const playing = player({ progress: { completedDays: [0, 1], current: { day: 2, screen: 'scene', inkState: 'x' }, dayStartedAt: {}, dayCompletedAt: {} }, updatedAt: now - 60_000 });
    expect(playerStatus(playing.save, now).status).toBe('playing');

    const behind = player({ progress: { completedDays: [0, 1, 2, 3, 4, 5], current: null, dayStartedAt: {}, dayCompletedAt: {} } });
    expect(playerStatus(behind.save, now)).toEqual({ status: 'behind', behind: 2 });
    expect(statusLabel(playerStatus(behind.save, now))).toBe('2 Tage zurück');

    const upToDate = player({ progress: { completedDays: [0, 1, 2, 3, 4, 5, 6, 7], current: null, dayStartedAt: {}, dayCompletedAt: {} } });
    expect(playerStatus(upToDate.save, now).status).toBe('up_to_date');

    const all = Array.from({ length: 25 }, (_, i) => i);
    expect(playerStatus(player({ progress: { completedDays: all, current: null, dayStartedAt: {}, dayCompletedAt: {} } }).save, now).status).toBe('finished');
  });

  it('computes today metrics in Europe/Berlin', () => {
    const now2 = t('2026-12-07T22:30:00Z'); // 23:30 in Berlin
    const p = player({
      progress: {
        completedDays: [0, 7],
        current: null,
        dayStartedAt: { '7': t('2026-12-07T22:00:00Z') },
        dayCompletedAt: { '7': t('2026-12-07T22:04:00Z') },
      },
    });
    const inactive = player(null, { active: false, uid: 'u2' });
    expect(overviewMetrics([p, inactive], now2)).toEqual({ activePlayers: 1, playedToday: 1, avgSecondsToday: 240 });
    // 00:30 Berlin on the next day: no longer "today"
    expect(overviewMetrics([p], t('2026-12-07T23:30:00Z')).playedToday).toBe(0);
  });

  it('formats relative times', () => {
    expect(relativeTime(null, now)).toBe('nie');
    expect(relativeTime(now - 2 * 3600_000, now)).toBe('vor 2 Std.');
    expect(relativeTime(now - 26 * 3600_000, now)).toBe('gestern');
  });
});

describe('Zauberwort and owl name [AUTH-6] [AUTH-2]', () => {
  it('builds three distinct words and a number from the word list', () => {
    for (let i = 0; i < 100; i++) {
      const pw = generatePassword();
      const parts = pw.split('-');
      expect(parts).toHaveLength(4);
      expect(new Set(parts.slice(0, 3)).size).toBe(3);
      for (const w of parts.slice(0, 3)) expect(WORDS).toContain(w);
      expect(Number(parts[3])).toBeGreaterThanOrEqual(10);
      expect(Number(parts[3])).toBeLessThan(100);
    }
  });

  it('has about 200 words without umlauts', () => {
    expect(WORDS.length).toBeGreaterThanOrEqual(190);
    for (const w of WORDS) expect(w).toMatch(/^[a-z]+$/);
  });

  it('suggests valid owl names', () => {
    expect(suggestUsername('Lena')).toBe('lena');
    expect(suggestUsername('Jürgen Müller-Groß')).toBe('juergen-mueller');
    expect(suggestUsername('Oma & Opa')).toBe('oma-opa');
    expect(suggestUsername('Ö')).toBe('oex');
    for (const n of ['Lena', 'Jürgen Müller-Groß', 'Ö', '  Mama  ', 'René']) expect(isValidUsername(suggestUsername(n))).toBe(true);
  });
});
