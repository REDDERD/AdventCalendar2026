import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildForPronoun, DEFAULT_LOOK, frameIndex, HOUSE_CAPE, LOOK_KEYS, OPTIONS, playerRecipe, randomLook, resolveRecipe, UNSORTED_CAPE,
} from '../../src/character/layers';
import { NPCS } from '../../src/character/npcs';
import { blendOver, colorMap, recolorPixels } from '../../src/character/recolor';
import { HOUSES, type Look } from '../../src/types';

const exists = (file: string) => fs.existsSync(path.resolve('public', file));

describe('character options [CHAR-1] (Section 6.2 minimums)', () => {
  it('offers at least the required number of options', () => {
    expect(OPTIONS.skin.length).toBeGreaterThanOrEqual(6);
    expect(OPTIONS.hair.length).toBeGreaterThanOrEqual(8);
    expect(OPTIONS.hairColor.length).toBeGreaterThanOrEqual(8);
    expect(OPTIONS.eyes.length).toBeGreaterThanOrEqual(5);
    expect(OPTIONS.glasses.length).toBeGreaterThanOrEqual(3); // none + 2
    expect(OPTIONS.accessory.length).toBeGreaterThanOrEqual(4); // none + 3
    expect(OPTIONS.sweater.length).toBeGreaterThanOrEqual(6);
  });

  it('resolves every option for both builds and every house to existing files', () => {
    for (const key of LOOK_KEYS) {
      for (const [value] of OPTIONS[key]) {
        for (const build of ['slim', 'broad']) {
          for (const house of [null, ...HOUSES]) {
            const look: Look = { ...DEFAULT_LOOK, build, [key]: value };
            const layers = resolveRecipe(playerRecipe(look, house));
            for (const layer of layers) expect(exists(layer.file), `${key}=${value} ${build}: ${layer.file}`).toBe(true);
          }
        }
      }
    }
  });

  it('draws in LPC z-order: cape back and long hair back behind the body, hat on top', () => {
    const look: Look = { ...DEFAULT_LOOK, hair: 'ponytail', accessory: 'christmas_hat' };
    const ids = resolveRecipe(playerRecipe(look, 'gryffindor')).map((l) => l.id);
    expect(ids.indexOf('cape_bg')).toBeLessThan(ids.indexOf('body'));
    expect(ids.indexOf('hair_ponytail_bg')).toBeLessThan(ids.indexOf('body'));
    expect(ids.indexOf('body')).toBeLessThan(ids.indexOf('head_female'));
    expect(ids.indexOf('sweater')).toBeLessThan(ids.indexOf('cape'));
    expect(ids.indexOf('hair_ponytail')).toBeLessThan(ids.indexOf('christmas_hat'));
    expect(ids.at(-1)).toBe('christmas_hat');
  });

  it('randomLook only picks valid options and keeps the body shape', () => {
    for (const build of ['slim', 'broad']) {
      for (let i = 0; i < 50; i++) {
        const look = randomLook(build);
        expect(look.build).toBe(build);
        for (const key of LOOK_KEYS) expect(OPTIONS[key].map(([id]) => id)).toContain(look[key]);
      }
    }
  });

  it('derives the body shape from the pronoun: Hexe → slim, Zauberer → broad', () => {
    expect(buildForPronoun('f')).toBe('slim');
    expect(buildForPronoun('m')).toBe('broad');
  });
});

describe('robe palette swap [CHAR-2]', () => {
  it('is grey before sorting and uses two house colours afterwards', () => {
    const recipe = (house: (typeof HOUSES)[number] | null) => playerRecipe(DEFAULT_LOOK, house).layers;
    expect(recipe(null).find((l) => l.id === 'cape')?.colors?.cloth).toBe(UNSORTED_CAPE.main);
    for (const house of HOUSES) {
      const layers = recipe(house);
      expect(layers.find((l) => l.id === 'cape')?.colors?.cloth).toBe(HOUSE_CAPE[house].main);
      expect(layers.find((l) => l.id === 'cape_trim')?.colors?.cloth).toBe(HOUSE_CAPE[house].trim);
    }
  });

  it('produces colour maps for recoloured layers', () => {
    const cape = resolveRecipe(playerRecipe(DEFAULT_LOOK, 'slytherin')).find((l) => l.id === 'cape')!;
    expect(cape.maps.length).toBe(1);
    expect(cape.maps[0].from.length).toBeGreaterThan(0);
  });
});

describe('NPC recipes', () => {
  it('resolve to existing layer files', () => {
    for (const [id, recipe] of Object.entries(NPCS)) {
      for (const layer of resolveRecipe(recipe)) expect(exists(layer.file), `${id}: ${layer.file}`).toBe(true);
    }
  });

  it('have built sprite sheets', () => {
    for (const id of Object.keys(NPCS)) expect(exists(`assets/sprites/${id}.png`), id).toBe(true);
  });
});

describe('recolor', () => {
  it('replaces colours within ±1 per channel and skips transparent pixels', () => {
    const px = new Uint8Array([10, 20, 30, 255, 11, 21, 29, 255, 10, 20, 30, 0, 50, 50, 50, 255]);
    recolorPixels(px, [colorMap(['#0a141e'], ['#ffffff'])]);
    expect([...px.slice(0, 4)]).toEqual([255, 255, 255, 255]);
    expect([...px.slice(4, 8)]).toEqual([255, 255, 255, 255]);
    expect([...px.slice(8, 12)]).toEqual([10, 20, 30, 0]);
    expect([...px.slice(12, 16)]).toEqual([50, 50, 50, 255]);
  });

  it('blends source-over', () => {
    const dst = new Uint8Array([0, 0, 0, 255]);
    blendOver(dst, new Uint8Array([255, 255, 255, 128]));
    expect(dst[0]).toBeGreaterThan(120);
    expect(dst[0]).toBeLessThan(136);
    expect(dst[3]).toBe(255);
  });

  it('maps directions to LPC walk rows', () => {
    expect(frameIndex('up')).toBe(0);
    expect(frameIndex('down')).toBe(18);
    expect(frameIndex('right', 3)).toBe(30);
  });
});
