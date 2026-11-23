/**
 * A small orchestra synthesised with WebAudio (DECISIONS.md #77): string
 * ensemble, pizzicato, celesta, harp, flute, clarinet, horn and timpani, plus a
 * generated hall reverb. Works on any BaseAudioContext, so the same code plays
 * in the app and renders offline for `npm run music:render`.
 */

export type Instrument = 'strings' | 'pizz' | 'celesta' | 'harp' | 'flute' | 'clarinet' | 'horn' | 'timpani';

const noiseBuffers = new WeakMap<BaseAudioContext, AudioBuffer>();

function noiseBuffer(ctx: BaseAudioContext): AudioBuffer {
  let buffer = noiseBuffers.get(ctx);
  if (!buffer) {
    buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noiseBuffers.set(ctx, buffer);
  }
  return buffer;
}

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

/** Vibrato that fades in after the attack, as players do. */
function vibrato(ctx: BaseAudioContext, start: number, freq: number, depth: number, delay: number, sources: OscillatorNode[]): GainNode {
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 4.8 + Math.random() * 0.8;
  const amount = ctx.createGain();
  amount.gain.setValueAtTime(0, start);
  amount.gain.linearRampToValueAtTime(freq * depth, start + delay);
  lfo.connect(amount);
  sources.push(lfo);
  return amount;
}

function osc(ctx: BaseAudioContext, type: OscillatorType, freq: number, detune = 0): OscillatorNode {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  o.detune.value = detune;
  return o;
}

function lowpass(ctx: BaseAudioContext, cutoff: number, q = 0.6): BiquadFilterNode {
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = Math.min(cutoff, 12000);
  f.Q.value = q;
  return f;
}

/** Sustained envelope: soft attack, hold, exponential release. Returns the stop time. */
function sustain(env: GainNode, start: number, length: number, volume: number, attack: number, release: number): number {
  const a = Math.min(attack, length * 0.5);
  env.gain.setValueAtTime(0, start);
  env.gain.linearRampToValueAtTime(volume, start + a);
  env.gain.setValueAtTime(volume, start + Math.max(a, length));
  env.gain.setTargetAtTime(0, start + Math.max(a, length), release / 3);
  return start + Math.max(a, length) + release * 1.6;
}

/** Struck or plucked envelope: instant attack, exponential decay. Returns the stop time. */
function strike(env: GainNode, start: number, volume: number, decay: number, attack = 0.003): number {
  env.gain.setValueAtTime(0, start);
  env.gain.linearRampToValueAtTime(volume, start + attack);
  env.gain.setTargetAtTime(0, start + attack, decay / 3);
  return start + attack + decay * 1.8;
}

/**
 * Play one note. `length` is the written length in seconds; plucked and struck
 * instruments ring on past it. `volume` is roughly 0–1.
 */
export function playNote(ctx: BaseAudioContext, out: AudioNode, instrument: Instrument, freq: number, start: number, length: number, volume: number): void {
  const env = ctx.createGain();
  env.connect(out);
  const sources: OscillatorNode[] = [];
  let stop: number;

  switch (instrument) {
    case 'strings': {
      // section of three slightly detuned saws, bowed: slow attack, warm filter
      const filter = lowpass(ctx, freq * 4 + 700, 0.5);
      filter.connect(env);
      const vib = vibrato(ctx, start, freq, 0.0045, 0.45, sources);
      for (const d of [-9, 0, 8]) {
        const o = osc(ctx, 'sawtooth', freq, d + (Math.random() - 0.5) * 3);
        vib.connect(o.frequency);
        o.connect(filter);
        sources.push(o);
      }
      stop = sustain(env, start, length, volume * 0.16, 0.28, 0.55);
      break;
    }
    case 'pizz': {
      const filter = lowpass(ctx, freq * 6, 1);
      filter.frequency.setValueAtTime(freq * 8, start);
      filter.frequency.exponentialRampToValueAtTime(freq * 1.5, start + 0.18);
      filter.connect(env);
      const saw = osc(ctx, 'sawtooth', freq);
      const tri = osc(ctx, 'triangle', freq);
      saw.connect(filter);
      tri.connect(filter);
      sources.push(saw, tri);
      stop = strike(env, start, volume * 0.32, 0.38);
      break;
    }
    case 'celesta': {
      // soft bell: fundamental plus quickly fading upper partials
      const partials: Array<[number, number, number]> = [[1, 1, 1.1], [2, 0.28, 0.35], [3.01, 0.1, 0.18], [4.02, 0.06, 0.1]];
      for (const [ratio, gain, decay] of partials) {
        const o = osc(ctx, 'sine', freq * ratio);
        const g = ctx.createGain();
        strike(g, start, gain, decay);
        o.connect(g).connect(env);
        sources.push(o);
      }
      env.gain.value = volume * 0.3;
      stop = start + 2.2;
      break;
    }
    case 'harp': {
      const filter = lowpass(ctx, freq * 5, 0.7);
      filter.frequency.setValueAtTime(freq * 9, start);
      filter.frequency.exponentialRampToValueAtTime(freq * 2.5, start + 0.25);
      filter.connect(env);
      const tri = osc(ctx, 'triangle', freq);
      const octave = osc(ctx, 'sine', freq * 2);
      const og = ctx.createGain();
      og.gain.value = 0.25;
      tri.connect(filter);
      octave.connect(og).connect(filter);
      sources.push(tri, octave);
      stop = strike(env, start, volume * 0.42, 1.6, 0.004);
      break;
    }
    case 'flute': {
      const filter = lowpass(ctx, freq * 3, 0.5);
      filter.connect(env);
      const vib = vibrato(ctx, start, freq, 0.004, 0.35, sources);
      const sine = osc(ctx, 'sine', freq);
      const tri = osc(ctx, 'triangle', freq);
      const tg = ctx.createGain();
      tg.gain.value = 0.3;
      vib.connect(sine.frequency);
      vib.connect(tri.frequency);
      sine.connect(filter);
      tri.connect(tg).connect(filter);
      sources.push(sine, tri);
      // breath at the start of the note
      const air = ctx.createBufferSource();
      air.buffer = noiseBuffer(ctx);
      const band = ctx.createBiquadFilter();
      band.type = 'bandpass';
      band.frequency.value = freq * 2;
      band.Q.value = 1.5;
      const ag = ctx.createGain();
      strike(ag, start, 0.12, 0.12, 0.02);
      air.connect(band).connect(ag).connect(env);
      air.start(start);
      air.stop(start + 0.3);
      stop = sustain(env, start, length, volume * 0.38, 0.07, 0.18);
      break;
    }
    case 'clarinet': {
      // odd harmonics (square) through a dark filter: woody and round
      const filter = lowpass(ctx, freq * 2.6 + 300, 0.8);
      filter.connect(env);
      const vib = vibrato(ctx, start, freq, 0.0025, 0.5, sources);
      const sq = osc(ctx, 'square', freq);
      const sine = osc(ctx, 'sine', freq);
      vib.connect(sq.frequency);
      vib.connect(sine.frequency);
      sq.connect(filter);
      sine.connect(filter);
      sources.push(sq, sine);
      stop = sustain(env, start, length, volume * 0.16, 0.06, 0.16);
      break;
    }
    case 'horn': {
      // brass swell: the filter opens during the attack
      const filter = lowpass(ctx, freq * 2, 0.9);
      filter.frequency.setValueAtTime(freq * 1.2, start);
      filter.frequency.linearRampToValueAtTime(Math.min(freq * 3.2, 2600), start + Math.min(0.18, length * 0.5));
      filter.connect(env);
      const vib = vibrato(ctx, start, freq, 0.002, 0.6, sources);
      for (const d of [-5, 5]) {
        const o = osc(ctx, 'sawtooth', freq, d);
        vib.connect(o.frequency);
        o.connect(filter);
        sources.push(o);
      }
      stop = sustain(env, start, length, volume * 0.2, 0.1, 0.3);
      break;
    }
    case 'timpani': {
      const body = osc(ctx, 'sine', freq * 1.03);
      body.frequency.exponentialRampToValueAtTime(freq, start + 0.12);
      const over = osc(ctx, 'triangle', freq * 1.5);
      const og = ctx.createGain();
      og.gain.value = 0.2;
      body.connect(env);
      over.connect(og).connect(env);
      sources.push(body, over);
      const hit = ctx.createBufferSource();
      hit.buffer = noiseBuffer(ctx);
      const lp = lowpass(ctx, 500, 0.7);
      const hg = ctx.createGain();
      strike(hg, start, 0.5, 0.08);
      hit.connect(lp).connect(hg).connect(env);
      hit.start(start);
      hit.stop(start + 0.3);
      stop = strike(env, start, volume * 0.7, 1.1, 0.005);
      break;
    }
  }

  for (const s of sources) {
    s.start(start);
    s.stop(stop);
  }
}
