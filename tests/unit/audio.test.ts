import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { MUSIC_IDS } from '../../src/assets/manifest';
import { gapSeconds, MAX_GAP, nextPiece, PLAYLISTS, RECORDINGS } from '../../src/audio/recordings';

const file = (id: string) => path.resolve('public/audio/music', `${id}.m4a`);

describe('music from recordings [SND-1]', () => {
  it('there is a playlist for every music id Ink may use, and no other', () => {
    expect(Object.keys(PLAYLISTS).sort()).toEqual([...MUSIC_IDS].sort());
  });

  it('every playlist plays known recordings, and every recording is played', () => {
    const ids = new Set(RECORDINGS.map((r) => r.id));
    const used = new Set<string>();
    for (const [list, p] of Object.entries(PLAYLISTS)) {
      expect(p.pieces.length, list).toBeGreaterThan(0);
      for (const piece of p.pieces) {
        expect(ids.has(piece), `${list}: ${piece}`).toBe(true);
        used.add(piece);
      }
    }
    expect([...ids].filter((id) => !used.has(id))).toEqual([]);
  });

  it('the puzzle music plays only in puzzles', () => {
    const puzzle = PLAYLISTS.puzzle.pieces;
    for (const [list, p] of Object.entries(PLAYLISTS)) {
      if (list !== 'puzzle') expect(p.pieces.filter((x) => puzzle.includes(x)), list).toEqual([]);
    }
  });

  it('every recording is credited, licensed and encoded small enough', () => {
    for (const r of RECORDINGS) {
      expect(r.id, r.id).toMatch(/^[a-z0-9_]+$/);
      for (const field of [r.title, r.composer, r.performer, r.year, r.licence, r.page, r.source]) expect(field, r.id).toBeTruthy();
      expect(fs.existsSync(file(r.id)), `public/audio/music/${r.id}.m4a – run npm run music:import`).toBe(true);
      expect(fs.statSync(file(r.id)).size, r.id).toBeLessThan(7_000_000);
    }
  });

  it('never plays the same piece twice in a row when there is a choice', () => {
    for (const p of Object.values(PLAYLISTS)) {
      for (const last of p.pieces) {
        for (const r of [0, 0.3, 0.5, 0.99]) {
          const next = nextPiece(p, last, () => r);
          expect(p.pieces).toContain(next);
          if (p.pieces.length > 1) expect(next).not.toBe(last);
        }
      }
    }
  });

  it('pauses between pieces are short: at most five seconds', () => {
    expect(MAX_GAP).toBeLessThanOrEqual(5);
    for (const r of [0, 0.5, 0.999]) {
      expect(gapSeconds(() => r)).toBeGreaterThan(0);
      expect(gapSeconds(() => r)).toBeLessThanOrEqual(5);
    }
  });
});
