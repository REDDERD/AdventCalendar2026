import { store } from '../core/store';
import { noteFrequency, parseVoice, trackLength, TRACKS, type Wave } from './tracks';

/**
 * [SND-1–3] Chiptune music and sound effects, synthesised with WebAudio
 * (DECISIONS.md #52). Nothing plays before the first touch; music and effects
 * follow the two switches in Truhe → Optionen.
 */

let ctx: AudioContext | null = null;
let musicGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
const waves = new Map<string, PeriodicWave>();

let current: string | null = null;
let wanted: string | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
let nextStep = 0;
let nextTime = 0;

const MUSIC_VOLUME = 0.09;
const SFX_VOLUME = 0.22;
const LOOKAHEAD = 0.15;

const settings = () => store.getState().save?.settings ?? { music: true, sfx: true, textSpeed: 'normal' as const };

function pulseWave(context: AudioContext, duty: number): PeriodicWave {
  const n = 32;
  const real = new Float32Array(n);
  const imag = new Float32Array(n);
  for (let k = 1; k < n; k++) imag[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * duty);
  return context.createPeriodicWave(real, imag);
}

function oscillator(context: AudioContext, wave: Wave, freq: number): OscillatorNode {
  const osc = context.createOscillator();
  if (wave === 'pulse25' || wave === 'pulse12') {
    if (!waves.has(wave)) waves.set(wave, pulseWave(context, wave === 'pulse25' ? 0.25 : 0.125));
    osc.setPeriodicWave(waves.get(wave)!);
  } else {
    osc.type = wave;
  }
  osc.frequency.value = freq;
  return osc;
}

function tone(out: AudioNode, wave: Wave, freq: number, start: number, length: number, volume: number): void {
  const context = ctx!;
  const osc = oscillator(context, wave, freq);
  const env = context.createGain();
  env.gain.setValueAtTime(0, start);
  env.gain.linearRampToValueAtTime(volume, start + 0.005);
  env.gain.setValueAtTime(volume, start + Math.max(0.01, length * 0.7));
  env.gain.linearRampToValueAtTime(0, start + length);
  osc.connect(env).connect(out);
  osc.start(start);
  osc.stop(start + length + 0.02);
}

function noise(out: AudioNode, start: number, length: number, volume: number): void {
  const context = ctx!;
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * length), context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = context.createBufferSource();
  src.buffer = buffer;
  const env = context.createGain();
  env.gain.value = volume;
  src.connect(env).connect(out);
  src.start(start);
}

// ---------- Music ----------

function schedule(): void {
  if (!ctx || !musicGain || !current) return;
  const track = TRACKS[current];
  const stepLength = 60 / track.bpm / 2;
  const total = trackLength(track);
  while (nextTime < ctx.currentTime + LOOKAHEAD) {
    for (const voice of track.voices) {
      for (const n of parseVoice(voice.steps)) {
        if (n.step === nextStep) tone(musicGain, voice.wave, noteFrequency(n.note), nextTime, n.length * stepLength * 0.95, voice.volume);
      }
    }
    nextStep = (nextStep + 1) % total;
    nextTime += stepLength;
  }
}

function startMusic(): void {
  if (!ctx || !musicGain) return;
  const target = settings().music ? wanted : null;
  if (target === current) return;
  if (timer) clearInterval(timer);
  timer = null;
  // short fade so tracks don't cut hard
  musicGain.gain.cancelScheduledValues(ctx.currentTime);
  musicGain.gain.setValueAtTime(0, ctx.currentTime);
  musicGain.gain.linearRampToValueAtTime(MUSIC_VOLUME, ctx.currentTime + 0.4);
  current = target && TRACKS[target] ? target : null;
  if (!current) return;
  nextStep = 0;
  nextTime = ctx.currentTime + 0.05;
  timer = setInterval(schedule, 25);
  schedule();
}

/** Ask for a music track ("castle", "puzzle" …); `null` = silence. Plays once audio is unlocked. */
export function playMusic(id: string | null): void {
  wanted = id;
  startMusic();
}

// ---------- Sound effects [SND-2] ----------

/** Pitch of the text blip per speaker; narration is a soft middle tone. */
const VOICE_PITCH: Record<string, number> = {
  quill: 620, ellis: 880, theo: 520, maren: 760, grimsby: 300, aldous: 240, thornbury: 400, hat: 200,
  peeves: 980, hagrid: 220, luna: 840, filch: 280, myrte: 1100, newt: 600, dumbledore: 260, knopf: 1400,
};

export function playSfx(id: string, speaker?: string): void {
  if (!ctx || !sfxGain || !settings().sfx) return;
  const t = ctx.currentTime + 0.01;
  const out = sfxGain;
  switch (id) {
    case 'blip':
      tone(out, 'pulse12', VOICE_PITCH[speaker ?? ''] ?? 560, t, 0.03, 0.25);
      break;
    case 'select':
      tone(out, 'pulse25', 660, t, 0.05, 0.5);
      tone(out, 'pulse25', 990, t + 0.05, 0.06, 0.5);
      break;
    case 'correct':
      ['C5', 'E5', 'G5', 'C6'].forEach((n, i) => tone(out, 'pulse25', noteFrequency(n), t + i * 0.08, 0.12, 0.6));
      break;
    case 'wrong':
      tone(out, 'square', 220, t, 0.15, 0.4);
      tone(out, 'square', 165, t + 0.16, 0.25, 0.4);
      break;
    case 'spark':
      ['E6', 'B6', 'E7'].forEach((n, i) => tone(out, 'pulse12', noteFrequency(n), t + i * 0.05, 0.08, 0.45));
      break;
    case 'door':
      noise(out, t, 0.12, 0.35);
      tone(out, 'triangle', 110, t, 0.2, 0.9);
      tone(out, 'pulse25', noteFrequency('G5'), t + 0.18, 0.15, 0.4);
      break;
    case 'stamp':
      noise(out, t, 0.08, 0.6);
      tone(out, 'triangle', 90, t, 0.12, 1);
      break;
    case 'brawl':
      // a cartoon scuffle: thumps, squeaks and screeches for about 1.5 s
      for (let i = 0; i < 12; i++) {
        const at = t + i * 0.12 + Math.random() * 0.05;
        noise(out, at, 0.07, 0.5);
        if (i % 2) tone(out, 'pulse12', 1400 + Math.random() * 900, at + 0.03, 0.05, 0.35);
        else tone(out, 'square', 160 + Math.random() * 80, at, 0.06, 0.4);
      }
      break;
  }
}

// ---------- Unlock [SND-3] ----------

/** Called on the first touch: browsers (iOS in particular) only allow audio after a gesture. */
export function unlockAudio(): void {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ctx = new Ctor();
    musicGain = ctx.createGain();
    musicGain.gain.value = MUSIC_VOLUME;
    musicGain.connect(ctx.destination);
    sfxGain = ctx.createGain();
    sfxGain.gain.value = SFX_VOLUME;
    sfxGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  startMusic();
}

// Follow the music switch while playing.
store.subscribe((state, prev) => {
  if (state.save?.settings.music !== prev.save?.settings.music) startMusic();
});
