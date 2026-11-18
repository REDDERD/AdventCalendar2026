import { describe, expect, it } from 'vitest';
import { MUSIC_IDS } from '../../src/assets/manifest';
import { noteFrequency, parseVoice, trackLength, TRACKS } from '../../src/audio/tracks';

describe('chiptune tracks [SND-1]', () => {
  it('there is a track for every music id Ink may use', () => {
    for (const id of MUSIC_IDS) expect(TRACKS[id], id).toBeDefined();
  });

  it('every note is a valid pitch in a pleasant range', () => {
    for (const [id, track] of Object.entries(TRACKS)) {
      for (const voice of track.voices) {
        for (const n of parseVoice(voice.steps)) {
          const f = noteFrequency(n.note);
          expect(f, `${id} ${n.note}`).toBeGreaterThan(60);
          expect(f, `${id} ${n.note}`).toBeLessThan(2700);
        }
      }
    }
  });

  it('all voices of a track loop together (8 bars of eighths)', () => {
    for (const [id, track] of Object.entries(TRACKS)) {
      for (const voice of track.voices) {
        expect(voice.steps.split(/\s+/).filter(Boolean).length, id).toBe(trackLength(track));
      }
      expect(trackLength(track), id).toBe(64);
    }
  });

  it('reads holds and rests', () => {
    expect(parseVoice('A4 - - . C5 -')).toEqual([
      { step: 0, length: 3, note: 'A4' },
      { step: 4, length: 2, note: 'C5' },
    ]);
    expect(noteFrequency('A4')).toBeCloseTo(440);
    expect(noteFrequency('A5')).toBeCloseTo(880);
    expect(noteFrequency('C4')).toBeCloseTo(261.63, 1);
  });
});
