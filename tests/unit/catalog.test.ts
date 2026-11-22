import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { assets, isCrop } from '../../src/assets/manifest';
import { CLUE_ICONS, CLUES, HOUSE_TOKENS, ITEM_ICONS, ITEMS } from '../../src/content/catalog';
import { HOUSES } from '../../src/types';

const hasPicture = (assetId: string) => {
  const def = assets[assetId];
  return !!def && !isCrop(def) && fs.existsSync(path.resolve('public', def.file));
};

describe('trunk pictures', () => {
  it('every item has a picture (the house token one per house)', () => {
    for (const id of Object.keys(ITEMS)) {
      if (id === 'house_token') continue;
      expect(ITEM_ICONS[id], `item ${id}`).toBeDefined();
      expect(hasPicture(ITEM_ICONS[id]), `picture of ${id}`).toBe(true);
    }
    for (const house of HOUSES) {
      expect(HOUSE_TOKENS[house], `house token of ${house}`).toBeDefined();
      expect(hasPicture(HOUSE_TOKENS[house].icon)).toBe(true);
    }
  });

  it('clue pictures belong to real clues and exist', () => {
    for (const [id, icon] of Object.entries(CLUE_ICONS)) {
      expect(id in CLUES).toBe(true);
      expect(hasPicture(icon), `picture of ${id}`).toBe(true);
    }
  });
});
