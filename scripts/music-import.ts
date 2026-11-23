// Downloads every recording in src/audio/recordings.ts, trims the silence at both
// ends, levels it to the same loudness (two-pass EBU R128, linear gain so the
// dynamics stay) and encodes AAC into public/audio/music/<id>.m4a (DECISIONS.md #81).
//   FFMPEG=<path to ffmpeg> npm run music:import [-- <id> …] [--force]
// Downloads are kept in music-src/ (git-ignored), so re-encoding needs no network.
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { RECORDINGS } from '../src/audio/recordings';

const FFMPEG = process.env.FFMPEG ?? 'ffmpeg';
const SRC = resolve('music-src');
const OUT = resolve('public/audio/music');
const LOUDNESS = -20; // LUFS, quiet enough to sit under the dialogue blips
const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));

/** `commons:<file>` → its URL on upload.wikimedia.org (path = md5 of the file name). */
function resolveSource(source: string): string {
  if (!source.startsWith('commons:')) return source;
  const name = source.slice('commons:'.length).replace(/ /g, '_');
  const md5 = createHash('md5').update(name, 'utf8').digest('hex');
  return `https://upload.wikimedia.org/wikipedia/commons/${md5[0]}/${md5.slice(0, 2)}/${encodeURIComponent(name)}`;
}

async function download(source: string, file: string): Promise<void> {
  if (existsSync(file) && statSync(file).size > 0) return;
  const url = resolveSource(source);
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': 'AdventCalendarMusicImport/1.0' } });
    if (res.ok) {
      writeFileSync(file, Buffer.from(await res.arrayBuffer()));
      return;
    }
    if (attempt >= 6 || (res.status !== 429 && res.status < 500)) throw new Error(`${url}: HTTP ${res.status}`);
    // Wikimedia answers 429 with Retry-After (often 600 s) after too many requests
    const wait = Math.min(900, Number(res.headers.get('retry-after')) || attempt * 30);
    console.log(`  HTTP ${res.status}, retrying in ${wait} s`);
    await new Promise((r) => setTimeout(r, wait * 1000));
  }
}

function ffmpeg(argv: string[]): string {
  const r = spawnSync(FFMPEG, ['-hide_banner', '-nostdin', ...argv], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${r.stderr.slice(-2000)}`);
  return r.stderr;
}

/** Trim leading/trailing silence and fade the edges. */
const TRIM =
  'silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.3,areverse,' +
  'silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.8,areverse';

/** True when both channels carry the same signal (mono recordings released as stereo). */
function isMono(file: string): boolean {
  const log = ffmpeg(['-i', file, '-t', '120', '-af', 'pan=mono|c0=c0-c1,astats=metadata=0:measure_overall=RMS_level', '-f', 'null', '-']);
  const side = Number(/RMS level dB: (-?[\d.]+|-inf)/.exec(log)?.[1] ?? '-inf');
  const full = ffmpeg(['-i', file, '-t', '120', '-af', 'pan=mono|c0=c0+c1,astats=metadata=0:measure_overall=RMS_level', '-f', 'null', '-']);
  const mid = Number(/RMS level dB: (-?[\d.]+|-inf)/.exec(full)?.[1] ?? '0');
  return !Number.isFinite(side) || mid - side > 30;
}

/** Cut the piece out of a longer source (an LP side) and fade out where the cut ends. */
function clipFilter(clip?: [number, number]): string {
  if (!clip) return '';
  const [from, to] = clip;
  return `atrim=start=${from}:end=${to},asetpts=PTS-STARTPTS,afade=t=out:st=${to - from - 1.5}:d=1.5,`;
}

function encode(input: string, output: string, clip?: [number, number]): string {
  const mono = isMono(input);
  const cut = clipFilter(clip);
  // pass 1: measure
  const log = ffmpeg(['-i', input, '-af', `${cut}${TRIM},loudnorm=I=${LOUDNESS}:TP=-1.5:LRA=20:print_format=json`, '-f', 'null', '-']);
  const m = JSON.parse(log.slice(log.lastIndexOf('{'), log.lastIndexOf('}') + 1)) as Record<string, string>;
  // pass 2: linear gain to the target, short fades, AAC
  const norm = `loudnorm=I=${LOUDNESS}:TP=-1.5:LRA=20:linear=true:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}`;
  ffmpeg([
    '-y', '-i', input, '-vn', '-map_metadata', '-1',
    '-af', `${cut}${TRIM},afade=t=in:d=0.3,${norm},aresample=44100`,
    '-ac', mono ? '1' : '2', '-c:a', 'aac', '-b:a', mono ? '64k' : '96k', '-movflags', '+faststart',
    output,
  ]);
  return `${mono ? 'mono  ' : 'stereo'} in ${Number(m.input_i).toFixed(1)} LUFS`;
}

async function main() {
  mkdirSync(SRC, { recursive: true });
  mkdirSync(OUT, { recursive: true });
  execFileSync(FFMPEG, ['-version'], { stdio: 'ignore' });
  for (const r of RECORDINGS) {
    if (only.length && !only.includes(r.id)) continue;
    const out = join(OUT, `${r.id}.m4a`);
    if (existsSync(out) && !force) {
      console.log(`${r.id.padEnd(20)} exists (use --force to re-encode)`);
      continue;
    }
    const ext = /\.(\w+)$/.exec(r.source)?.[1] ?? 'bin';
    const src = join(SRC, `${r.id}.${ext}`);
    await download(r.source, src);
    const info = encode(src, out, r.clip);
    console.log(`${r.id.padEnd(20)} ${info}  → ${(statSync(out).size / 1e6).toFixed(1)} MB`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
