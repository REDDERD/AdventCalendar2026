import { createReverb, playNote, type Instrument } from './orchestra';
import { noteFrequency, parseVoice, trackLength, type Track } from './tracks';

/** Turning tracks into scheduled notes; used by AudioService and the offline renderer. */

const MUSIC_VOLUME = 0.2;
const REVERB_WET = 0.55;

export interface MusicEvent {
  instrument: Instrument;
  freqs: number[];
  steps: number;
  volume: number;
}

/** Notes of a track grouped by step, worked out once per track. */
export function compileTrack(track: Track): MusicEvent[][] {
  const byStep: MusicEvent[][] = Array.from({ length: trackLength(track) }, () => []);
  for (const voice of track.voices) {
    for (const n of parseVoice(voice.bars)) {
      byStep[n.step].push({
        instrument: voice.instrument,
        freqs: n.notes.map(noteFrequency),
        steps: n.length,
        volume: voice.volume * track.level * (n.notes.length > 1 ? 0.75 : 1),
      });
    }
  }
  return byStep;
}

/** Schedule one step of a track; shared with the offline renderer. */
export function playStep(context: BaseAudioContext, out: AudioNode, events: MusicEvent[], at: number, stepLength: number): void {
  for (const e of events) {
    // a touch of human timing and dynamics so the loop doesn't sound mechanical
    const t = at + Math.random() * 0.012;
    const v = e.volume * (0.9 + Math.random() * 0.2);
    for (const f of e.freqs) playNote(context, out, e.instrument, f, t, e.steps * stepLength, v);
  }
}

/** Music chain: track bus → dry + hall → master volume → gentle limiter → speakers. */
export function createMusicChain(context: BaseAudioContext, destination: AudioNode): GainNode {
  const input = context.createGain();
  const master = context.createGain();
  master.gain.value = MUSIC_VOLUME;
  const reverb = createReverb(context);
  const wet = context.createGain();
  wet.gain.value = REVERB_WET;
  const limiter = context.createDynamicsCompressor();
  limiter.threshold.value = -10;
  limiter.knee.value = 8;
  limiter.ratio.value = 4;
  limiter.attack.value = 0.01;
  limiter.release.value = 0.3;
  input.connect(master);
  input.connect(reverb).connect(wet).connect(master);
  master.connect(limiter).connect(destination);
  return input;
}

