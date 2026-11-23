import type { Room } from './recordings';

/**
 * The room the music is heard in (DECISIONS.md #81): a low-pass for walls and
 * distance plus a generated hall reverb. `distant` is the Hogwarts Legacy
 * corridor: someone plays in a room further down.
 */
export const ROOMS: Record<Room, { cutoff: number; dry: number; wet: number; volume: number }> = {
  distant: { cutoff: 3200, dry: 0.75, wet: 0.6, volume: 0.6 },
  hall: { cutoff: 14000, dry: 1, wet: 0.25, volume: 0.55 },
  near: { cutoff: 20000, dry: 1, wet: 0.12, volume: 0.8 },
};

/** A hall: exponentially decaying stereo noise, slightly darker towards the tail. */
export function createReverb(ctx: BaseAudioContext, seconds = 2.8): ConvolverNode {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const t = i / length;
      // one-pole low-pass that closes over time: the tail loses its highs like a real room
      const smooth = 0.2 + 0.75 * t;
      last = last * smooth + (Math.random() * 2 - 1) * (1 - smooth);
      data[i] = last * (1 - t) ** 2.6 * (i < ctx.sampleRate * 0.012 ? i / (ctx.sampleRate * 0.012) : 1);
    }
  }
  const convolver = ctx.createConvolver();
  convolver.buffer = buffer;
  return convolver;
}

export interface RoomChain {
  /** connect the music here */
  input: GainNode;
  /** glide into another room */
  set(room: Room, seconds?: number): void;
}

export function createRoom(ctx: BaseAudioContext, out: AudioNode): RoomChain {
  const input = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.Q.value = 0.5;
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const reverb = createReverb(ctx);
  const volume = ctx.createGain();
  // a gentle limiter: old recordings have the odd loud crackle
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -6;
  limiter.knee.value = 6;
  limiter.ratio.value = 8;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.25;
  input.connect(filter);
  filter.connect(dry).connect(volume);
  filter.connect(reverb).connect(wet).connect(volume);
  volume.connect(limiter).connect(out);

  const set = (room: Room, seconds = 1.5) => {
    const r = ROOMS[room];
    const t = ctx.currentTime;
    const glide = (p: AudioParam, v: number) => {
      p.cancelScheduledValues(t);
      if (seconds <= 0) {
        p.setValueAtTime(v, t);
        return;
      }
      p.setValueAtTime(p.value, t);
      p.linearRampToValueAtTime(v, t + seconds);
    };
    glide(filter.frequency, r.cutoff);
    glide(dry.gain, r.dry);
    glide(wet.gain, r.wet);
    glide(volume.gain, r.volume);
  };
  set('hall', 0);
  return { input, set };
}
