import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import { describe, expect, it } from 'vitest';
import { IDLE_FRAME } from '../../src/assets/manifest';
import { NPCS } from '../../src/character/npcs';

/** Height in px of the facing-down idle frame of an NPC sheet. */
function standingHeight(id: string): number {
  const png = PNG.sync.read(fs.readFileSync(path.resolve(`public/assets/sprites/${id}.png`)));
  const x0 = (IDLE_FRAME % 9) * 64;
  const y0 = Math.floor(IDLE_FRAME / 9) * 64;
  let top = 64;
  let bottom = -1;
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      if (!png.data[((y0 + y) * png.width + x0 + x) * 4 + 3]) continue;
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }
  return bottom - top + 1;
}

describe('NPC sizes', () => {
  it('Prof. Flitwick is small: clearly shorter than a student, feet on the same line', () => {
    expect(NPCS.flitwick.small).toBe(true);
    expect(standingHeight('flitwick')).toBeLessThanOrEqual(standingHeight('ellis') - 8);
    expect(standingHeight('flitwick')).toBeGreaterThanOrEqual(30); // still a person, not a speck
  });
});
