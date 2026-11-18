import { CHARACTERS } from '../types';

export interface ParsedTag {
  key: string;
  value: string;
}

/** `bg: owlery` → { key: 'bg', value: 'owlery' } */
export function parseTag(raw: string): ParsedTag {
  const i = raw.indexOf(':');
  if (i < 0) return { key: raw.trim(), value: '' };
  return { key: raw.slice(0, i).trim(), value: raw.slice(i + 1).trim() };
}

export function findTag(tags: readonly ParsedTag[], key: string): ParsedTag | undefined {
  return tags.find((t) => t.key === key);
}

const SPEAKER_RE = /^([a-z_]+):\s+([\s\S]*)$/;
const SPEAKERS = new Set<string>(CHARACTERS);

/** Section 15.1: `<figur-id>: Text` is a spoken line, everything else is narration. */
export function parseSpeaker(text: string): { speaker: string | null; text: string } {
  const m = text.match(SPEAKER_RE);
  if (m && SPEAKERS.has(m[1])) return { speaker: m[1], text: m[2].trim() };
  return { speaker: null, text: text.trim() };
}

export type ActorPos = 'left' | 'center' | 'right';

export function parseShow(value: string): { id: string; pos: ActorPos } {
  const [id, pos] = value.split(/\s+/);
  return { id, pos: pos === 'left' || pos === 'right' ? pos : 'center' };
}

export function parseSpark(value: string): { id: string; x: number; y: number } {
  const [id, x, y] = value.split(/\s+/);
  return { id, x: Number(x) || 0, y: Number(y) || 0 };
}

export function parseEmote(value: string): { id: string; emote: string } {
  const [id, emote] = value.split(/\s+/);
  return { id, emote: emote ?? '!' };
}

/** `d07.letter.give` → { pointId: 'd07.letter', option: 'give' } */
export function splitCid(cid: string): { pointId: string; option: string } {
  const dot = cid.lastIndexOf('.');
  return { pointId: cid.slice(0, dot), option: cid.slice(dot + 1) };
}
