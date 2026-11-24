import type { Instrument } from './orchestra';

/**
 * Original orchestral loops [SND-1] (DECISIONS.md #77), played by the WebAudio
 * orchestra in orchestra.ts. Music in the spirit of a magic castle — strings,
 * celesta, harp, woodwinds — but every melody here is our own; no film or game
 * themes.
 *
 * A voice is a list of bars; each bar is a string of steps (one step = one
 * eighth note): a pitch like "F#5" starts a note, "D3+F#3+A3" a chord, "-"
 * holds, "." rests. Every bar of a track has `bar` steps (6 = 3/4, 8 = 4/4),
 * and all voices loop together.
 */

export interface Voice {
  instrument: Instrument;
  volume: number;
  bars: string[];
}

export interface Track {
  /** quarter notes per minute */
  bpm: number;
  /** eighth-note steps per bar */
  bar: number;
  /** loudness correction so all tracks sit at the same level */
  level: number;
  voices: Voice[];
}

// ---------- helpers for writing parts ----------

const SEMITONES: Record<string, number> = { C: -9, 'C#': -8, D: -7, 'D#': -6, E: -5, F: -4, 'F#': -3, G: -2, 'G#': -1, A: 0, 'A#': 1, B: 2 };
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function transpose(note: string, semis: number): string {
  const m = note.match(/^([A-G]#?)(\d)$/);
  if (!m) throw new Error(`bad note ${note}`);
  const midi = (Number(m[2]) + 1) * 12 + NAMES.indexOf(m[1]) + semis;
  return `${NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

/** Shift every note of some bars by `semis` semitones. */
function shift(bars: string[], semis: number): string[] {
  return bars.map((b) => b.replace(/[A-G]#?\d/g, (n) => transpose(n, semis)));
}

/** `n` empty bars. */
function rest(n: number, bar: number): string[] {
  return Array.from({ length: n }, () => Array(bar).fill('.').join(' '));
}

/**
 * Accompaniment from chords: each chord ("E3 B3 G4") fills one bar following
 * `pattern`, whose tokens are "." / "-", "c" (the whole chord) or a digit
 * picking a chord note (digits past the top repeat the chord an octave up).
 */
function comp(chords: string[], pattern: string): string[] {
  const tokens = pattern.split(' ');
  return chords.map((chord) => {
    const notes = chord.split(' ');
    return tokens
      .map((t) => {
        if (t === '.' || t === '-') return t;
        if (t === 'c') return notes.join('+');
        const i = Number(t);
        return transpose(notes[i % notes.length], 12 * Math.floor(i / notes.length));
      })
      .join(' ');
  });
}

/** Each chord held for the whole bar. */
const pad = (chords: string[], bar: number) => comp(chords, ['c', ...Array(bar - 1).fill('-')].join(' '));

// ---------- castle: wandering the corridors, E minor, 3/4 ----------

const castleChords = ['E3 B3 G4', 'E3 C4 G4', 'D3 B3 G4', 'D3 A3 F#4', 'E3 B3 G4', 'E3 C4 A4', 'D#3 A3 F#4', 'E3 B3 G4',
  'E3 C4 G4', 'D3 B3 G4', 'E3 C4 A4', 'E3 B3 G4', 'E3 C4 G4', 'E3 C4 A4', 'E3 C4 A4', 'D#3 A3 F#4'];
const castleBass = ['E2', 'C2', 'G2', 'D2', 'E2', 'A2', 'B2', 'E2', 'C2', 'B2', 'A2', 'G2', 'C2', 'A2', 'F#2', 'B2'];
const castleHarp = ['E3 B3 E4 G4', 'C3 G3 C4 E4', 'G2 D3 G3 B3', 'D3 A3 D4 F#4', 'E3 B3 E4 G4', 'A2 E3 A3 C4', 'B2 F#3 A3 D#4', 'E3 B3 E4 G4',
  'C3 G3 C4 E4', 'B2 D3 G3 B3', 'A2 E3 A3 C4', 'G2 E3 G3 B3', 'C3 G3 C4 E4', 'A2 E3 A3 C4', 'F#2 C3 E3 A3', 'B2 F#3 A3 D#4'];

const castle: Track = {
  bpm: 80,
  bar: 6,
  level: 1,
  voices: [
    { instrument: 'strings', volume: 0.45, bars: pad(castleChords, 6) },
    { instrument: 'strings', volume: 0.55, bars: comp(castleBass, '0 - - - - -') },
    { instrument: 'harp', volume: 0.5, bars: [...comp(castleHarp.slice(0, 8), '0 . 2 . 3 .'), ...comp(castleHarp.slice(8), '0 1 2 3 2 1')] },
    { instrument: 'clarinet', volume: 0.9, bars: [
      'B4 - - - E5 F#5', 'G5 - - - F#5 E5', 'D5 - - - G4 B4', 'A4 - - - - -',
      'G4 - B4 - E5 -', 'C5 - - - B4 A4', 'F#5 - - - D#5 B4', 'E5 - - - - .',
      ...rest(8, 6),
    ] },
    { instrument: 'strings', volume: 0.85, bars: [
      ...rest(8, 6),
      'E5 - - - G5 C6', 'B5 - - - G5 D5', 'E5 - - - A5 C6', 'B5 - - - - -',
      'G5 - C6 - E6 -', 'D6 - - - C6 B5', 'C6 - - - A5 F#5', 'D#5 - - - - .',
    ] },
    { instrument: 'celesta', volume: 0.55, bars: [
      '. . . . . .', '. . . . B5 E6', '. . . . . .', '. . . . D6 A6', '. . . . . .', '. . . . C6 E6', '. . . . . .', '. . . . B5 G6',
      '. . . . . .', '. . . . D6 G6', '. . . . . .', '. . . . E6 B6', '. . . . . .', '. . . . C6 A6', '. . . . . .', '. . . . F#6 B6',
    ] },
  ],
};

// ---------- title / calendar: a festive waltz, D major, 3/4 ----------

const titleChords = ['F#3 A3 D4', 'F#3 B3 D4', 'G3 B3 D4', 'E3 A3 C#4', 'F#3 A3 D4', 'F#3 A3 D#4', 'G3 B3 E4', 'E3 G3 C#4',
  'F#3 B3 D4', 'G3 B3 D4', 'F#3 A3 D4', 'E3 A3 C#4', 'G3 B3 D4', 'G3 A#3 D4', 'F#3 A3 D4', 'E3 G3 C#4'];
const titleBass = ['D2', 'B2', 'G2', 'A2', 'D2', 'B2', 'E2', 'A2', 'B2', 'G2', 'D2', 'A2', 'G2', 'G2', 'D2', 'A2'];
const titleTune = [
  'A4 - D5 - F#5 -', 'F#5 - - - E5 D5', 'B4 - D5 - G5 -', 'G5 - - - F#5 E5',
  'A5 - - - F#5 A5', 'A5 - - - F#5 D#5', 'E5 - - - G5 B5', 'A5 - - - G5 E5',
];

const title: Track = {
  bpm: 92,
  bar: 6,
  level: 1,
  voices: [
    { instrument: 'pizz', volume: 0.8, bars: comp(titleBass, '0 - . . . .') },
    { instrument: 'pizz', volume: 0.45, bars: comp(titleChords, '. . c . c .') },
    { instrument: 'strings', volume: 0.3, bars: pad(titleChords, 6) },
    { instrument: 'flute', volume: 0.75, bars: [...titleTune, ...rest(8, 6)] },
    { instrument: 'celesta', volume: 0.5, bars: [...shift(titleTune, 12), ...rest(8, 6)] },
    { instrument: 'strings', volume: 0.8, bars: [
      ...rest(8, 6),
      'F#5 - - - D5 F#5', 'B5 - - - A5 G5', 'A5 - - - F#5 D5', 'E5 - - - - -',
      'D5 - G5 - B5 -', 'D6 - - - A#5 G5', 'F#5 - - - E5 D5', 'G5 - - - E5 C#5',
    ] },
  ],
};

// ---------- outdoors in the snow: bright and airy, G major, 4/4 ----------

const outdoorHarp = ['G3 B3 D4 G4', 'F#3 A3 D4 F#4', 'E3 G3 B3 E4', 'E3 G3 C4 E4', 'G3 B3 D4 G4', 'E3 A3 C4 E4', 'F#3 A3 D4 F#4', 'F#3 A3 C4 D4',
  'E3 G3 C4 E4', 'D3 G3 B3 D4', 'E3 A3 C4 E4', 'E3 G3 B3 E4', 'E3 G3 C4 E4', 'F#3 A3 D4 F#4', 'G3 B3 D4 G4', 'F#3 A3 D4 F#4'];
const outdoorBass = ['G2 D3', 'F#2 D3', 'E2 B2', 'C2 G2', 'G2 D3', 'A2 E3', 'D2 A2', 'D2 A2',
  'C2 G2', 'G2 D3', 'A2 E3', 'E2 B2', 'C2 G2', 'D2 A2', 'G2 D3', 'D2 A2'];
const outdoorB = [
  'E5 - - - G5 - C6 -', 'B5 - - - G5 - D5 -', 'E5 - - - A5 - C6 -', 'B5 - - - - - G5 -',
  'E6 - - - D6 - C6 -', 'D6 - - - C6 - A5 -', 'B5 - - - A5 - G5 -', 'A5 - - - - - . .',
];

const outdoor: Track = {
  bpm: 100,
  bar: 8,
  level: 0.8,
  voices: [
    { instrument: 'pizz', volume: 0.75, bars: comp(outdoorBass, '0 . . . 1 . . .') },
    { instrument: 'harp', volume: 0.45, bars: comp(outdoorHarp, '0 1 2 3 4 3 2 1') },
    { instrument: 'strings', volume: 0.3, bars: pad(outdoorHarp.map((c) => c.split(' ').slice(0, 3).join(' ')), 8) },
    { instrument: 'flute', volume: 0.75, bars: [
      'D5 - - - G5 - A5 -', 'B5 - - - A5 - F#5 -', 'G5 - - - E5 - B4 -', 'C5 - - - - - . .',
      'D5 - G5 - B5 - D6 -', 'C6 - - - B5 - A5 -', 'A5 - - - F#5 - D5 -', 'F#5 - - - - - . .',
      ...outdoorB,
    ] },
    { instrument: 'strings', volume: 0.5, bars: [...rest(8, 8), ...shift(outdoorB, -12)] },
    { instrument: 'celesta', volume: 0.5, bars: [
      ...rest(3, 8), '. . . . G6 E6 C6 G5', ...rest(3, 8), '. . . . A6 F#6 D6 A5',
      ...rest(3, 8), '. . . . B6 G6 E6 B5', ...rest(3, 8), '. . . . A6 F#6 D6 A5',
    ] },
  ],
};

// ---------- dungeon, forest, cold: slow and dark, A minor, 4/4 ----------

const dungeonChords = ['E3 A3 C4', 'F3 A3 C4', 'F3 A3 D4', 'E3 G#3 B3', 'E3 A3 C4', 'F3 A3 C4', 'F3 A#3 D4', 'E3 G#3 B3',
  'F3 A3 D4', 'E3 A3 C4', 'F3 A3 D4', 'E3 G#3 B3', 'F3 A3 C4', 'F3 A3 D4', 'F3 A#3 D4', 'E3 G#3 D4'];
const dungeonBass = ['A2', 'F2', 'D2', 'E2', 'A2', 'F2', 'A#2', 'E2', 'D2', 'A2', 'D2', 'E2', 'F2', 'D2', 'A#2', 'E2'];

const dungeon: Track = {
  bpm: 66,
  bar: 8,
  level: 1,
  voices: [
    { instrument: 'strings', volume: 0.4, bars: pad(dungeonChords, 8) },
    { instrument: 'strings', volume: 0.6, bars: comp(dungeonBass, '0 - - - - - - -') },
    { instrument: 'harp', volume: 0.5, bars: comp(dungeonBass.map((b, i) => `${b} ${dungeonChords[i]}`), '0 . . 1 . . 2 .') },
    { instrument: 'strings', volume: 0.8, bars: [
      'A3 - - - C4 - B3 -', 'A3 - - - - - . .', 'F3 - - - A3 - D4 -', 'C4 - - - B3 - - .',
      'E4 - - - D4 - C4 -', 'A3 - - - C4 - F4 -', 'F4 - - - D4 - A#3 -', 'G#3 - - - - - . .',
      ...rest(8, 8),
    ] },
    { instrument: 'clarinet', volume: 0.85, bars: [
      ...rest(8, 8),
      'D5 - - - F5 - E5 -', 'C5 - - - - - A4 -', 'F5 - - - E5 - D5 -', 'B4 - - - G#4 - B4 -',
      'A5 - - - F5 - C5 -', 'D5 - - - F5 - A5 -', 'F5 - - - D5 - A#4 -', 'B4 - - - D5 - - .',
    ] },
    { instrument: 'celesta', volume: 0.4, bars: [
      ...rest(3, 8), '. . . . . . E6 .', ...rest(3, 8), '. . . . . . G#5 .',
      ...rest(3, 8), '. . . . . . B5 .', ...rest(3, 8), '. . . . . . D6 .',
    ] },
  ],
};

// ---------- puzzle: curious, tiptoeing pizzicato, D minor, 4/4 ----------

const puzzleChords = ['D3 F3 A3', 'G2 D3 A#3', 'A2 E3 G3', 'D3 F3 A3', 'D3 F3 A3', 'G2 D3 A#3', 'C3 E3 G3', 'F2 C3 A3',
  'A#2 F3 D4', 'G2 D3 A#3', 'D3 F3 A3', 'A2 E3 C#4', 'A#2 F3 D4', 'G2 D3 A#3', 'E2 A#2 G3', 'A2 E3 C#4'];

const puzzle: Track = {
  bpm: 96,
  bar: 8,
  level: 1.1,
  voices: [
    { instrument: 'pizz', volume: 0.75, bars: comp(puzzleChords, '0 . 2 . 1 . 2 .') },
    { instrument: 'strings', volume: 0.25, bars: pad(puzzleChords, 8) },
    { instrument: 'clarinet', volume: 0.8, bars: [
      'A4 . D5 . F5 - E5 .', 'D5 - . . A#4 . G4 .', 'A4 . C#5 . E5 - G5 .', 'F5 - - - D5 . . .',
      'A5 . . A5 G5 . F5 .', 'G5 - . . D5 . A#4 .', 'E5 . G5 . C6 - A#5 .', 'A5 - - - . . . .',
      ...rest(8, 8),
    ] },
    { instrument: 'flute', volume: 0.7, bars: [
      ...rest(8, 8),
      'D6 - . . A#5 . F5 .', 'G5 - . . A#5 . D6 .', 'A5 - - - F5 . D5 .', 'E5 - . . C#5 . A4 .',
      'F5 - . . D5 . A#4 .', 'A#4 - . . D5 . G5 .', 'E5 . G5 . A#5 - G5 .', 'C#5 - - - E5 . . .',
    ] },
    { instrument: 'celesta', volume: 0.5, bars: [
      ...rest(3, 8), '. . . . . A5 D6 F6', ...rest(3, 8), '. . . . . C6 F6 A6',
      ...rest(3, 8), '. . . . . E6 C#6 A5', ...rest(3, 8), '. . . . . G5 A5 C#6',
    ] },
  ],
};

// ---------- finale: heroic horns and full strings, C major, 4/4 ----------

const finaleChords = ['C4 E4 G4', 'C4 E4 A4', 'C4 F4 A4', 'B3 D4 G4', 'C4 E4 G4', 'B3 E4 G#4', 'C4 E4 A4', 'B3 D4 G4',
  'C4 F4 A4', 'C4 E4 G4', 'D4 F4 A4', 'B3 D4 G4', 'C4 F4 A4', 'C4 F4 G#4', 'C4 E4 G4', 'B3 D4 G4'];
const finaleBass = ['C2', 'A2', 'F2', 'G2', 'C2', 'E2', 'A2', 'G2', 'F2', 'E2', 'D2', 'G2', 'F2', 'F2', 'C2', 'G2'];
const finaleTimpani = ['C3', 'A2', 'F2', 'G2', 'C3', 'E2', 'A2', 'G2', 'F2', 'E2', 'D2', 'G2', 'F2', 'F2', 'C3', 'G2'];

const finale: Track = {
  bpm: 100,
  bar: 8,
  level: 1.1,
  voices: [
    { instrument: 'strings', volume: 0.45, bars: pad(finaleChords, 8) },
    { instrument: 'strings', volume: 0.6, bars: comp(finaleBass, '0 - - 0 - - 0 -') },
    { instrument: 'timpani', volume: 0.7, bars: finaleTimpani.map((n, i) => (i % 4 === 3 ? `${n} . . . ${n} . ${n} ${n}` : `${n} . . . . . . .`)) },
    { instrument: 'harp', volume: 0.4, bars: [...rest(8, 8), ...comp(finaleChords.slice(8), '0 1 2 3 4 5 4 3')] },
    { instrument: 'horn', volume: 0.9, bars: [
      'G4 - - - C5 - D5 -', 'E5 - - - D5 - C5 -', 'A4 - - - C5 - F5 -', 'D5 - - - - - . .',
      'E5 - - - G5 - - -', 'G#4 - - - B4 - E5 -', 'A4 - - - C5 - E5 -', 'D5 - - - B4 - G4 -',
      ...comp(['A4', 'G4', 'A4', 'B4', 'A4', 'G#4', 'G4', 'B4'], '0 - - - - - - -'),
    ] },
    { instrument: 'strings', volume: 0.85, bars: [
      ...rest(8, 8),
      'A5 - - - C6 - - -', 'G5 - - - - - E5 -', 'F5 - - - A5 - D6 -', 'D6 - - - B5 - - -',
      'C6 - - - A5 - F5 -', 'G#5 - - - F5 - C5 -', 'E5 - - - G5 - C6 -', 'B5 - - - - - . .',
    ] },
  ],
};

// ---------- the letter: tender, F major, 3/4 ----------

const letterHarp = ['F2 C3 F3 A3', 'E2 C3 G3 C4', 'D2 A2 D3 F3', 'A#2 F3 A#3 D4', 'F2 C3 F3 A3', 'G2 D3 G3 A#3', 'C3 G3 C4 E4', 'C3 G3 A#3 E4',
  'D3 A3 D4 F4', 'A#2 F3 A#3 D4', 'F2 C3 F3 A3', 'C3 G3 C4 E4', 'A#2 F3 A#3 D4', 'A#2 F3 A#3 C#4', 'F2 C3 F3 A3', 'C3 G3 A#3 E4'];
const letterChords = ['A3 C4 F4', 'G3 C4 E4', 'A3 D4 F4', 'A#3 D4 F4', 'A3 C4 F4', 'A#3 D4 G4', 'G3 C4 E4', 'G3 A#3 E4',
  'A3 D4 F4', 'A#3 D4 F4', 'A3 C4 F4', 'G3 C4 E4', 'A#3 D4 F4', 'A#3 C#4 F4', 'A3 C4 F4', 'G3 A#3 E4'];
const letterTune = [
  'A4 - - - C5 F5', 'E5 - - - D5 C5', 'D5 - - - F5 A5', 'G5 - - - F5 -',
  'A5 - - - G5 F5', 'A#5 - - - A5 G5', 'G5 - - - E5 C5', 'C5 - - - - .',
  'F5 - - - A5 D6', 'D6 - - - C6 A#5', 'A5 - - - G5 F5', 'G5 - - - - -',
  'F5 - - - A#5 D6', 'C#6 - - - A#5 F5', 'C6 - - - A5 F5', 'G5 - - - E5 C5',
];

const letter: Track = {
  bpm: 66,
  bar: 6,
  level: 1.15,
  voices: [
    { instrument: 'harp', volume: 0.55, bars: comp(letterHarp, '0 1 2 3 2 1') },
    { instrument: 'strings', volume: 0.35, bars: pad(letterChords, 6) },
    { instrument: 'strings', volume: 0.8, bars: letterTune },
    { instrument: 'celesta', volume: 0.45, bars: [...rest(12, 6), ...shift(letterTune.slice(12), 12)] },
  ],
};

export const TRACKS: Record<string, Track> = { title, castle, outdoor, dungeon, puzzle, finale, letter };

// ---------- reading the notation ----------

/** "F#5" → frequency in Hz (A4 = 440). */
export function noteFrequency(note: string): number {
  const m = note.match(/^([A-G]#?)(\d)$/);
  if (!m) throw new Error(`bad note ${note}`);
  return 440 * 2 ** ((SEMITONES[m[1]] + (Number(m[2]) - 4) * 12) / 12);
}

/** Notes of a voice as { step, length, notes } (for the scheduler and the tests). */
export function parseVoice(bars: string[]): Array<{ step: number; length: number; notes: string[] }> {
  const tokens = bars.join(' ').split(/\s+/).filter(Boolean);
  const out: Array<{ step: number; length: number; notes: string[] }> = [];
  tokens.forEach((t, i) => {
    if (t === '.' || t === '-') {
      const last = out[out.length - 1];
      if (t === '-' && last && last.step + last.length === i) last.length++;
      return;
    }
    out.push({ step: i, length: 1, notes: t.split('+') });
  });
  return out;
}

/** Steps in one loop of the track. */
export function trackLength(track: Track): number {
  return track.voices[0].bars.length * track.bar;
}
