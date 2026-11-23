import { describe, expect, it } from 'vitest';
import { MUSIC_IDS } from '../../src/assets/manifest';
import { compileTrack } from '../../src/audio/music';
import { noteFrequency, parseVoice, trackLength, TRACKS } from '../../src/audio/tracks';

describe('orchestral tracks [SND-1]', () => {
  it('there is a track for every music id Ink may use', () => {
    for (const id of MUSIC_IDS) expect(TRACKS[id], id).toBeDefined();
  });

  it('every note is a valid pitch in a pleasant range', () => {
    for (const [id, track] of Object.entries(TRACKS)) {
      for (const voice of track.voices) {
        for (const n of parseVoice(voice.bars)) {
          for (const note of n.notes) {
            const f = noteFrequency(note);
            expect(f, `${id} ${note}`).toBeGreaterThan(60);
            expect(f, `${id} ${note}`).toBeLessThan(2700);
          }
        }
      }
    }
  });

  it('every bar has the right number of steps and all voices loop together', () => {
    for (const [id, track] of Object.entries(TRACKS)) {
      expect([6, 8], id).toContain(track.bar);
      for (const [v, voice] of track.voices.entries()) {
        expect(voice.bars.length, `${id} voice ${v}`).toBe(track.voices[0].bars.length);
        voice.bars.forEach((bar, b) => {
          expect(bar.split(/\s+/).filter(Boolean).length, `${id} voice ${v} bar ${b + 1}: ${bar}`).toBe(track.bar);
        });
      }
      expect(trackLength(track), id).toBeGreaterThanOrEqual(8 * track.bar);
    }
  });

  it('every track has a melody voice that actually plays', () => {
    for (const [id, track] of Object.entries(TRACKS)) {
      const steps = compileTrack(track);
      expect(steps.length, id).toBe(trackLength(track));
      expect(steps.filter((s) => s.length > 0).length, id).toBeGreaterThan(trackLength(track) / 4);
    }
  });

  it('reads holds, rests and chords', () => {
    expect(parseVoice(['A4 - - . C5 -', 'D3+F#3+A3 - . . . .'])).toEqual([
      { step: 0, length: 3, notes: ['A4'] },
      { step: 4, length: 2, notes: ['C5'] },
      { step: 6, length: 2, notes: ['D3', 'F#3', 'A3'] },
    ]);
    expect(noteFrequency('A4')).toBeCloseTo(440);
    expect(noteFrequency('A5')).toBeCloseTo(880);
    expect(noteFrequency('C4')).toBeCloseTo(261.63, 1);
  });
});
