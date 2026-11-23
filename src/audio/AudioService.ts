import { store } from '../core/store';
import { gapSeconds, nextPiece, PLAYLISTS } from './recordings';
import { createRoom, type RoomChain } from './room';

/**
 * [SND-1–3] Music from real recordings of classical pieces (DECISIONS.md #81),
 * chiptune sound effects synthesised with WebAudio (#52). Nothing plays before
 * the first touch; music and effects follow the two switches in Truhe → Optionen.
 */

type Wave = 'pulse25' | 'pulse12' | 'square' | 'triangle';

let ctx: AudioContext | null = null;
let room: RoomChain | null = null;
let sfxGain: GainNode | null = null;
const waves = new Map<string, PeriodicWave>();

const SFX_VOLUME = 0.22;
const FADE_IN = 1.5;
const FADE_OUT = 1.2;

const settings = () => store.getState().save?.settings ?? { music: true, sfx: true, textSpeed: 'normal' as const };

// ---------- Music: playlists of recordings ----------

/** One player; two of them crossfade when the music changes. */
interface Deck {
  el: HTMLAudioElement;
  gain: GainNode;
  list: string | null;
  piece: string | null;
}

let decks: Deck[] = [];
let active: Deck | null = null;
let current: string | null = null;
let wanted: string | null = null;
/** bumps on every change of music, so stale async work drops out */
let generation = 0;
let gapTimer: ReturnType<typeof setTimeout> | null = null;
let failures = 0;
/** where each playlist was left, to carry on from there on return */
const positions = new Map<string, { piece: string; time: number }>();
const lastPiece = new Map<string, string>();
const upcoming = new Map<string, string>();

const MUSIC_CACHE = 'music-v1';
const KEEP_URLS = 3;
const objectUrls = new Map<string, Promise<string>>();

const fileUrl = (piece: string) => `${import.meta.env.BASE_URL}audio/music/${piece}.m4a`;

async function download(url: string): Promise<Response> {
  // Cache Storage keeps each file after its first download (not available on plain http)
  try {
    const cache = await caches.open(MUSIC_CACHE);
    const hit = await cache.match(url);
    if (hit) return hit;
    const res = await fetch(url);
    if (res.ok) await cache.put(url, res.clone());
    return res;
  } catch {
    return fetch(url);
  }
}

/** A blob URL for a piece; at most a few are kept in memory. */
function pieceUrl(piece: string): Promise<string> {
  let url = objectUrls.get(piece);
  if (!url) {
    url = download(fileUrl(piece)).then(async (res) => {
      if (!res.ok) throw new Error(`music ${piece}: HTTP ${res.status}`);
      return URL.createObjectURL(await res.blob());
    });
    url.catch(() => objectUrls.delete(piece));
    objectUrls.set(piece, url);
  }
  // forget the oldest ones that no deck is holding
  const busy = new Set(decks.map((d) => d.piece));
  for (const [id, old] of objectUrls) {
    if (objectUrls.size <= KEEP_URLS) break;
    if (busy.has(id) || id === piece) continue;
    objectUrls.delete(id);
    void old.then((u) => URL.revokeObjectURL(u), () => undefined);
  }
  return url;
}

function rampGain(gain: GainNode, to: number, seconds: number): void {
  const t = ctx!.currentTime;
  gain.gain.cancelScheduledValues(t);
  gain.gain.setValueAtTime(gain.gain.value, t);
  gain.gain.linearRampToValueAtTime(to, t + seconds);
}

function clearGap(): void {
  if (gapTimer) clearTimeout(gapTimer);
  gapTimer = null;
}

function remember(deck: Deck): void {
  if (!deck.list || !deck.piece || deck.el.ended || !deck.el.currentSrc) return;
  positions.set(deck.list, { piece: deck.piece, time: Math.max(0, deck.el.currentTime - 1.5) });
}

function fadeOut(deck: Deck): void {
  remember(deck);
  rampGain(deck.gain, 0, FADE_OUT);
  setTimeout(() => {
    if (deck !== active) deck.el.pause();
  }, FADE_OUT * 1000 + 100);
}

async function play(deck: Deck, list: string, piece: string, at: number, gen: number): Promise<void> {
  deck.list = list;
  deck.piece = piece;
  lastPiece.set(list, piece);
  const after = nextPiece(PLAYLISTS[list], piece);
  upcoming.set(list, after);
  let src: string;
  try {
    src = await pieceUrl(piece);
  } catch {
    if (gen === generation) next(deck, list, gen, true);
    return;
  }
  if (gen !== generation || deck !== active) return;
  const el = deck.el;
  el.src = src;
  if (at > 0) el.addEventListener('loadedmetadata', () => (el.currentTime = at), { once: true });
  deck.gain.gain.cancelScheduledValues(ctx!.currentTime);
  deck.gain.gain.setValueAtTime(0, ctx!.currentTime);
  try {
    await el.play();
  } catch {
    if (gen === generation) next(deck, list, gen, true);
    return;
  }
  if (gen !== generation) return;
  failures = 0;
  rampGain(deck.gain, 1, at > 0 ? FADE_IN : 0.3);
  // fetch the following piece while this one plays, so the gap stays short
  if (after !== piece) void pieceUrl(after).catch(() => undefined);
}

/** After a piece (or a failed one): a short pause, then the next. */
function next(deck: Deck, list: string, gen: number, failed = false): void {
  if (failed && ++failures >= PLAYLISTS[list].pieces.length + 1) return; // nothing plays here; stay silent
  clearGap();
  gapTimer = setTimeout(() => {
    gapTimer = null;
    if (gen !== generation || deck !== active) return;
    const piece = upcoming.get(list) ?? nextPiece(PLAYLISTS[list], lastPiece.get(list) ?? null);
    void play(deck, list, piece, 0, gen);
  }, gapSeconds() * 1000);
}

/** Fade the playing music out and start the wanted playlist on the other deck. */
function startMusic(): void {
  if (!ctx || !room || !decks.length) return;
  const target = settings().music && wanted && PLAYLISTS[wanted] ? wanted : null;
  if (target === current) return;
  generation++;
  failures = 0;
  clearGap();
  if (active) fadeOut(active);
  current = target;
  if (!current) {
    active = null;
    return;
  }
  const list = PLAYLISTS[current];
  room.set(list.room);
  const deck = decks.find((d) => d !== active) ?? decks[0];
  active = deck;
  const resume = positions.get(current);
  positions.delete(current);
  const piece = resume?.piece ?? nextPiece(list, lastPiece.get(current) ?? null);
  void play(deck, current, piece, resume?.time ?? 0, generation);
}

/** Ask for music ("castle", "puzzle" …); `null` = silence. Plays once audio is unlocked. */
export function playMusic(id: string | null): void {
  wanted = id;
  startMusic();
}

/** A few samples of silence: playing it inside the first touch unlocks the players on iOS. */
function silence(): string {
  const samples = 64;
  const bytes = new Uint8Array(44 + samples * 2);
  const v = new DataView(bytes.buffer);
  const text = (at: number, s: string) => [...s].forEach((c, i) => v.setUint8(at + i, c.charCodeAt(0)));
  text(0, 'RIFF');
  v.setUint32(4, 36 + samples * 2, true);
  text(8, 'WAVEfmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true);
  v.setUint32(28, 16000, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  text(36, 'data');
  v.setUint32(40, samples * 2, true);
  return `data:audio/wav;base64,${btoa(String.fromCharCode(...bytes))}`;
}

function createDecks(context: AudioContext, out: AudioNode): Deck[] {
  const blank = silence();
  return [0, 1].map(() => {
    const el = new Audio();
    el.preload = 'auto';
    const gain = context.createGain();
    gain.gain.value = 0;
    context.createMediaElementSource(el).connect(gain).connect(out);
    const deck: Deck = { el, gain, list: null, piece: null };
    el.addEventListener('ended', () => {
      if (deck === active && deck.list === current && current) next(deck, current, generation);
    });
    el.src = blank;
    void el.play().catch(() => undefined);
    return deck;
  });
}

// ---------- Sound effects [SND-2] ----------

const NOTE_INDEX: Record<string, number> = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };

/** "E6" → Hz (A4 = 440); naturals are enough for the effects. */
function note(name: string): number {
  return 440 * 2 ** ((NOTE_INDEX[name[0]] + (Number(name.slice(1)) - 4) * 12) / 12);
}

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

/** Pitch of the text blip per speaker; narration is a soft middle tone. */
const VOICE_PITCH: Record<string, number> = {
  quill: 620, ellis: 880, theo: 520, maren: 760, grimsby: 300, aldous: 240, thornbury: 400, hat: 200,
  peeves: 980, hagrid: 220, luna: 840, filch: 280, myrte: 1100, newt: 600, dumbledore: 260, knopf: 1400, fred: 700, george: 680, rosmerta: 760, flitwick: 920, spider: 150,
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
      ['C5', 'E5', 'G5', 'C6'].forEach((n, i) => tone(out, 'pulse25', note(n), t + i * 0.08, 0.12, 0.6));
      break;
    case 'wrong':
      tone(out, 'square', 220, t, 0.15, 0.4);
      tone(out, 'square', 165, t + 0.16, 0.25, 0.4);
      break;
    case 'spark':
      ['E6', 'B6', 'E7'].forEach((n, i) => tone(out, 'pulse12', note(n), t + i * 0.05, 0.08, 0.45));
      break;
    case 'door':
      noise(out, t, 0.12, 0.35);
      tone(out, 'triangle', 110, t, 0.2, 0.9);
      tone(out, 'pulse25', note('G5'), t + 0.18, 0.15, 0.4);
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
    room = createRoom(ctx, ctx.destination);
    decks = createDecks(ctx, room.input);
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

/**
 * Sound only while the app is in the foreground: switching tabs or apps, turning
 * the screen off or closing the page pauses everything; coming back fades the
 * music in again where it stopped.
 */
function pause(): void {
  if (!ctx) return;
  generation++;
  clearGap();
  if (active) remember(active);
  for (const d of decks) {
    d.el.pause();
    d.gain.gain.cancelScheduledValues(ctx.currentTime);
    d.gain.gain.setValueAtTime(0, ctx.currentTime);
  }
  active = null;
  current = null; // so startMusic() picks the playlist up again on return
  void ctx.suspend();
}
function resume(): void {
  if (!ctx || document.hidden) return;
  void ctx.resume().then(startMusic);
}
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : resume()));
  window.addEventListener('pagehide', pause);
  window.addEventListener('pageshow', resume);
}
