// Renders every music track offline in headless Chromium (same WebAudio code as the
// app) and writes one WAV per track, plus loudness figures, so the mix can be
// checked and listened to without a phone.
//   npm run music:render [-- <outDir>] [--seconds 40]
import { build } from 'esbuild';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const secIdx = args.indexOf('--seconds');
const seconds = secIdx >= 0 ? Number(args.splice(secIdx, 2)[1]) : 0;
const outDir = resolve(args[0] ?? 'music-preview');
const RATE = 44100;

const entry = `
import { TRACKS, trackLength } from './src/audio/tracks';
import { compileTrack, createMusicChain, playStep } from './src/audio/music';
window.renderTrack = async (id, seconds) => {
  const track = TRACKS[id];
  const stepLength = 60 / track.bpm / 2;
  const loop = trackLength(track) * stepLength;
  const length = seconds || loop + 3;
  const ctx = new OfflineAudioContext(2, Math.ceil(${RATE} * length), ${RATE});
  const input = createMusicChain(ctx, ctx.destination);
  const steps = compileTrack(track);
  for (let t = 0, i = 0; t < length - 0.5; t += stepLength, i++) playStep(ctx, input, steps[i % steps.length], t + 0.05, stepLength);
  const buf = await ctx.startRendering();
  const pack = (a) => { const b = new Uint8Array(a.buffer); let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000)); return btoa(s); };
  return { loop, left: pack(buf.getChannelData(0)), right: pack(buf.getChannelData(1)) };
};
window.trackIds = Object.keys(TRACKS);
`;

function wav(left: Float32Array, right: Float32Array): Buffer {
  const n = left.length;
  const out = Buffer.alloc(44 + n * 4);
  out.write('RIFF', 0);
  out.writeUInt32LE(36 + n * 4, 4);
  out.write('WAVEfmt ', 8);
  out.writeUInt32LE(16, 16);
  out.writeUInt16LE(1, 20);
  out.writeUInt16LE(2, 22);
  out.writeUInt32LE(RATE, 24);
  out.writeUInt32LE(RATE * 4, 28);
  out.writeUInt16LE(4, 32);
  out.writeUInt16LE(16, 34);
  out.write('data', 36);
  out.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, left[i])) * 32767), 44 + i * 4);
    out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, right[i])) * 32767), 46 + i * 4);
  }
  return out;
}

const unpack = (b64: string) => {
  const bytes = Buffer.from(b64, 'base64');
  return new Float32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 4);
};

async function main() {
  const bundle = await build({ stdin: { contents: entry, resolveDir: process.cwd(), loader: 'ts' }, bundle: true, write: false, format: 'iife' });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent('<html><body></body></html>');
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  const ids = await page.evaluate(() => (window as unknown as { trackIds: string[] }).trackIds);
  mkdirSync(outDir, { recursive: true });
  console.log('track      loop    peak   rms(dBFS)');
  for (const id of ids) {
    const r = await page.evaluate(
      ([i, s]) => (window as unknown as { renderTrack: (i: string, s: number) => Promise<{ loop: number; left: string; right: string }> }).renderTrack(i, s),
      [id, seconds] as [string, number],
    );
    const left = unpack(r.left);
    const right = unpack(r.right);
    let peak = 0;
    let sum = 0;
    for (let i = 0; i < left.length; i++) {
      peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
      sum += left[i] * left[i] + right[i] * right[i];
    }
    const rms = Math.sqrt(sum / (left.length * 2));
    writeFileSync(join(outDir, `${id}.wav`), wav(left, right));
    console.log(`${id.padEnd(10)} ${r.loop.toFixed(1).padStart(5)}s  ${peak.toFixed(2)}   ${(20 * Math.log10(rms)).toFixed(1)}`);
  }
  await browser.close();
  console.log(`WAV files in ${outDir}`);
}

void main();
