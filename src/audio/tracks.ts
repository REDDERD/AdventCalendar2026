/**
 * Original chiptune loops [SND-1], played by the WebAudio synth in AudioService
 * (DECISIONS.md #52). Each voice is a string of steps (one step = one eighth
 * note): a pitch like "F#5" starts a note, "-" holds it, "." is a rest. All
 * voices of a track have the same number of steps and loop together.
 */
export type Wave = 'pulse25' | 'pulse12' | 'square' | 'triangle';

export interface Voice {
  wave: Wave;
  volume: number;
  steps: string;
}

export interface Track {
  bpm: number;
  voices: Voice[];
}

const bars = (...b: string[]) => b.join(' ');

export const TRACKS: Record<string, Track> = {
  // Title / calendar: festive, G major
  title: {
    bpm: 100,
    voices: [
      { wave: 'pulse25', volume: 0.5, steps: bars(
        'D5 . G5 . G5 - A5 .', 'B5 - A5 . G5 - E5 .', 'C6 - B5 . A5 - G5 .', 'A5 - - - - - D5 .',
        'G5 . B5 . D6 - C6 .', 'B5 - A5 . G5 - E5 .', 'F#5 . A5 . D6 - F#5 .', 'G5 - - - - - . .',
      ) },
      { wave: 'triangle', volume: 0.8, steps: bars(
        'G2 - D3 - G2 - D3 -', 'E2 - B2 - E2 - B2 -', 'C3 - G2 - C3 - G2 -', 'D3 - A2 - D3 - A2 -',
        'G2 - D3 - G2 - D3 -', 'E2 - B2 - E2 - B2 -', 'D3 - A2 - D3 - A2 -', 'G2 - - - G2 - . .',
      ) },
    ],
  },
  // Castle: cosy and a little mysterious, D major
  castle: {
    bpm: 96,
    voices: [
      { wave: 'pulse25', volume: 0.45, steps: bars(
        'F#5 . A5 . D6 - A5 .', 'B5 - A5 . F#5 . D5 .', 'G5 . B5 . D6 - B5 .', 'A5 - G5 . E5 . C#5 .',
        'D5 . F#5 . A5 - F#5 .', 'D6 - C#6 . B5 . F#5 .', 'G5 . E5 . B5 - G5 .', 'A5 - - - E5 . C#5 .',
      ) },
      { wave: 'triangle', volume: 0.8, steps: bars(
        'D3 - - - A2 - - -', 'B2 - - - F#2 - - -', 'G2 - - - D3 - - -', 'A2 - - - E2 - - -',
        'D3 - - - A2 - - -', 'B2 - - - F#2 - - -', 'E2 - - - B2 - - -', 'A2 - - - A2 - . .',
      ) },
    ],
  },
  // Outdoors in the snow: bright, G major
  outdoor: {
    bpm: 120,
    voices: [
      { wave: 'pulse12', volume: 0.4, steps: bars(
        'B5 . D6 . G6 - D6 .', 'C6 . E6 . G6 - E6 .', 'D6 . F#6 . A6 - F#6 .', 'G6 - - . D6 - B5 .',
        'E6 . G6 . B6 - G6 .', 'C6 . E6 . A6 - E6 .', 'D6 . C6 . B5 . A5 .', 'D6 - - - - - . .',
      ) },
      { wave: 'triangle', volume: 0.75, steps: bars(
        'G2 . D3 . G2 . D3 .', 'C3 . G2 . C3 . G2 .', 'D3 . A2 . D3 . A2 .', 'G2 . D3 . G2 . D3 .',
        'E2 . B2 . E2 . B2 .', 'C3 . G2 . C3 . G2 .', 'D3 . A2 . D3 . A2 .', 'D3 - - - D3 - . .',
      ) },
    ],
  },
  // Dungeon, forest, cold: slow, A minor
  dungeon: {
    bpm: 84,
    voices: [
      { wave: 'pulse25', volume: 0.4, steps: bars(
        'A4 - - . C5 - B4 .', 'A4 - - . F4 - - .', 'G4 - B4 . D5 - C5 .', 'B4 - - - G#4 - - .',
        'E5 - - . D5 - C5 .', 'A4 - - . F4 - A4 .', 'G4 - F4 . E4 - D4 .', 'E4 - - - - - - .',
      ) },
      { wave: 'triangle', volume: 0.85, steps: bars(
        'A2 - - - A2 - - -', 'F2 - - - F2 - - -', 'G2 - - - G2 - - -', 'E2 - - - E2 - - -',
        'A2 - - - A2 - - -', 'F2 - - - F2 - - -', 'G2 - - - G2 - - -', 'E2 - - - E2 - . .',
      ) },
    ],
  },
  // Puzzle: thinking music with a walking bass, D minor
  puzzle: {
    bpm: 110,
    voices: [
      { wave: 'pulse25', volume: 0.35, steps: bars(
        'D5 . F5 . A5 . F5 .', 'G5 . A#5 . D6 . A#5 .', 'A5 . C#6 . E6 . C#6 .', 'D6 - A5 . F5 - D5 .',
        'F5 . E5 . D5 . C#5 .', 'D5 . E5 . F5 . G5 .', 'A5 . G5 . F5 . E5 .', 'D5 - - - - - . .',
      ) },
      { wave: 'triangle', volume: 0.8, steps: bars(
        'D3 . A2 . D3 . F3 .', 'G2 . D3 . G2 . A#2 .', 'A2 . E3 . A2 . C#3 .', 'D3 . A2 . D3 . . .',
        'A#2 . F3 . A#2 . F3 .', 'G2 . D3 . G2 . D3 .', 'A2 . E3 . A2 . C#3 .', 'D3 - - - D3 - . .',
      ) },
    ],
  },
  // Finale: heroic, C major
  finale: {
    bpm: 128,
    voices: [
      { wave: 'square', volume: 0.3, steps: bars(
        'G5 . C6 . E6 - C6 .', 'D6 . B5 . G5 - D6 .', 'E6 . C6 . A5 - C6 .', 'F6 - E6 . D6 - C6 .',
        'G5 . C6 . E6 - G6 .', 'F6 - E6 . D6 - B5 .', 'A5 . C6 . F6 - A5 .', 'G5 - - - B5 - D6 .',
      ) },
      { wave: 'triangle', volume: 0.85, steps: bars(
        'C3 . G2 . C3 . G2 .', 'G2 . D3 . G2 . D3 .', 'A2 . E3 . A2 . E3 .', 'F2 . C3 . F2 . C3 .',
        'C3 . G2 . C3 . G2 .', 'G2 . D3 . G2 . D3 .', 'F2 . C3 . F2 . C3 .', 'G2 - - - G2 - . .',
      ) },
    ],
  },
  // The letter: gentle, F major
  letter: {
    bpm: 72,
    voices: [
      { wave: 'pulse12', volume: 0.35, steps: bars(
        'A4 - C5 . F5 - - .', 'D5 - F5 . A5 - - .', 'A#4 - D5 . F5 - D5 .', 'C5 - - - - - . .',
        'A4 - C5 . F5 - A5 .', 'G5 - F5 . D5 - F5 .', 'E5 - G5 . C6 - A#5 .', 'A5 - - - - - . .',
      ) },
      { wave: 'triangle', volume: 0.7, steps: bars(
        'F2 - - - C3 - - -', 'D2 - - - A2 - - -', 'A#2 - - - F2 - - -', 'C3 - - - G2 - - -',
        'F2 - - - C3 - - -', 'D2 - - - A2 - - -', 'C3 - - - G2 - - -', 'F2 - - - F2 - . .',
      ) },
    ],
  },
};

const SEMITONES: Record<string, number> = { C: -9, 'C#': -8, D: -7, 'D#': -6, E: -5, F: -4, 'F#': -3, G: -2, 'G#': -1, A: 0, 'A#': 1, B: 2 };

/** "F#5" → frequency in Hz (A4 = 440). */
export function noteFrequency(note: string): number {
  const m = note.match(/^([A-G]#?)(\d)$/);
  if (!m) throw new Error(`bad note ${note}`);
  return 440 * 2 ** ((SEMITONES[m[1]] + (Number(m[2]) - 4) * 12) / 12);
}

/** Notes of a voice as { step, length, note } (for the scheduler and the tests). */
export function parseVoice(steps: string): Array<{ step: number; length: number; note: string }> {
  const tokens = steps.split(/\s+/).filter(Boolean);
  const notes: Array<{ step: number; length: number; note: string }> = [];
  tokens.forEach((t, i) => {
    if (t === '.' || t === '-') {
      if (t === '-' && notes.length && notes[notes.length - 1].step + notes[notes.length - 1].length === i) notes[notes.length - 1].length++;
      return;
    }
    notes.push({ step: i, length: 1, note: t });
  });
  return notes;
}

export function trackLength(track: Track): number {
  return track.voices[0].steps.split(/\s+/).filter(Boolean).length;
}
