import { CHARACTERS, LOCATIONS } from '../types';

/**
 * [GFX-5] Code references graphics and sounds only by logical ID.
 * Replacing art (phase 2) only changes entries here or the files in public/ [AST-1].
 */
export interface FileAsset {
  /** Path relative to public/ */
  file: string;
  w?: number;
  h?: number;
  frameW?: number;
  frameH?: number;
  anims?: Record<string, number[]>;
  nineSlice?: [number, number, number, number];
  moods?: Record<string, string>;
  license?: string;
  credit?: string;
}

/** Phase 1 portraits: a crop of another asset, scaled up. */
export interface CropAsset {
  from: string;
  crop: [x: number, y: number, w: number, h: number];
  scale?: number;
}

export type AssetDef = FileAsset | CropAsset;

export function isCrop(def: AssetDef): def is CropAsset {
  return 'from' in def;
}

const LPC_LICENSE = 'CC-BY-SA 3.0 / GPL 3.0 / OGA-BY 3.0';
const LPC_CREDIT = 'Liberated Pixel Cup contributors, composed by npm run assets:npcs (see CREDITS.md)';
const LPC_TILES_CREDIT = 'LPC Base Assets (Lanea Zimmerman, Daniel Armstrong), composed by npm run assets:maps (see CREDITS.md)';

// Backgrounds: 256 × 512, anchored to the bottom of the scene (DECISIONS.md #32), drawn
// from LPC tiles by scripts/maps/scenes.ts (DECISIONS.md #53)
const backgrounds = Object.fromEntries(
  LOCATIONS.map((id) => [
    `bg.${id}`,
    { file: `assets/bg/${id}.png`, w: 256, h: 512, license: LPC_LICENSE, credit: LPC_TILES_CREDIT } satisfies FileAsset,
  ]),
);
const OWN = { license: 'own work', credit: 'Drawn by the agent (scripts/draw-sprites.ts)' };

/** LPC walk sheets: rows up/left/down/right × 9 frames; frame 18 = facing the viewer. */
export const IDLE_FRAME = 18;
const LPC_NPCS = ['quill', 'ellis', 'theo', 'maren', 'grimsby', 'aldous', 'thornbury', 'wandmaker', 'peeves', 'pince', 'hermione', 'slughorn', 'neville', 'nick', 'friar', 'grey_lady', 'baron', 'filch', 'hagrid', 'luna', 'myrte', 'newt', 'dumbledore', 'fred', 'george', 'rosmerta'] as const;

const npcs = Object.fromEntries(
  CHARACTERS.filter((id) => id !== 'player').map((id) => [
    `npc.${id}`,
    {
      file: `assets/sprites/${id}.png`,
      frameW: 64,
      frameH: 64,
      anims: { idle: [IDLE_FRAME], walk: [19, 20, 21, 22, 23, 24, 25, 26] },
      ...((LPC_NPCS as readonly string[]).includes(id) ? { license: LPC_LICENSE, credit: LPC_CREDIT } : {}),
    } satisfies FileAsset,
  ]),
);

/** Phase 1 portraits: the head of the facing-down idle frame, ×2. */
const portraits = Object.fromEntries(
  CHARACTERS.filter((id) => id !== 'player').map((id) => [
    `portrait.${id}`,
    { from: `npc.${id}`, crop: [16, 140, 32, 32], scale: 2 } satisfies CropAsset,
  ]),
);

const PETS = ['owl', 'cat', 'toad'] as const;
const pets = Object.fromEntries(
  PETS.map((id) => [`pet.${id}`, { file: `assets/sprites/pet_${id}.png`, w: 32, h: 32, ...OWN } satisfies FileAsset]),
);
const wands = Object.fromEntries(
  ['phoenix', 'dragon', 'unicorn'].map((id) => [`ui.wand.${id}`, { file: `assets/ui/wand_${id}.png`, w: 48, h: 12, ...OWN } satisfies FileAsset]),
);
const crests = Object.fromEntries(
  ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin'].map((id) => [
    `ui.crest.${id}`,
    { file: `assets/ui/crest_${id}.png`, w: 24, h: 28, ...OWN } satisfies FileAsset,
  ]),
);

const EMOTES = ['!', '?', 'heart', 'sweat', 'note', 'dots'] as const;
const emoteFile: Record<(typeof EMOTES)[number], string> = {
  '!': 'exclaim', '?': 'question', heart: 'heart', sweat: 'sweat', note: 'note', dots: 'dots',
};
const emotes = Object.fromEntries(
  EMOTES.map((id) => [`emote.${id}`, { file: `assets/emotes/${emoteFile[id]}.png`, w: 16, h: 16, ...OWN } satisfies FileAsset]),
);

// Audio is synthesised by src/audio (DECISIONS.md #52); these ids are what Ink may name in # sfx / # music.
const SFX = ['blip', 'select', 'correct', 'wrong', 'spark', 'door', 'stamp', 'brawl'] as const;

const MUSIC = ['title', 'castle', 'outdoor', 'dungeon', 'puzzle', 'finale', 'letter'] as const;

export const assets: Record<string, AssetDef> = {
  ...backgrounds,
  ...npcs,
  ...portraits,
  ...pets,
  ...wands,
  ...crests,
  // The sorting hat is a single 64 × 64 image (no walk sheet) [GFX-4]
  'npc.hat': { file: 'assets/sprites/hat.png', w: 64, h: 64, ...OWN },
  'portrait.hat': { from: 'npc.hat', crop: [16, 20, 32, 32], scale: 2 },
  // Knopf the niffler, a single 64 × 64 image as well
  'npc.knopf': { file: 'assets/sprites/knopf.png', w: 64, h: 64, ...OWN },
  'portrait.knopf': { from: 'npc.knopf', crop: [16, 32, 32, 32], scale: 2 },
  ...emotes,
  'ui.clock': { file: 'assets/ui/clock.png', w: 96, h: 120, ...OWN },
  'ui.frame.parchment': { file: 'assets/ui/parchment.png', nineSlice: [8, 8, 8, 8] },
  'ui.frame.wood': { file: 'assets/ui/wood.png', nineSlice: [8, 8, 8, 8] },
  'ui.seal': { file: 'assets/ui/seal.png', w: 24, h: 24 },
  // Puzzle images: 256 × 64 (shown below the prompt)
  'puzzle.p01': { file: 'assets/puzzles/p01.png', w: 256, h: 64, ...OWN },
  // Engine pictures and pieces (own sprites, scripts/draw-sprites.ts)
  'puzzle.candle_on': { file: 'assets/puzzles/candle_on.png', w: 32, h: 32, ...OWN },
  'puzzle.candle_off': { file: 'assets/puzzles/candle_off.png', w: 32, h: 32, ...OWN },
  'puzzle.mandrake': { file: 'assets/puzzles/mandrake.png', w: 16, h: 16, ...OWN },
  'puzzle.p18.door': { file: 'assets/puzzles/p18_door.png', w: 105, h: 105, frameW: 35, frameH: 35, ...OWN },
  'puzzle.p21.gears': { file: 'assets/puzzles/p21_gears.png', w: 256, h: 132, ...OWN },
  'puzzle.treat.star': { file: 'assets/puzzles/treat_star.png', w: 16, h: 16, ...OWN },
  'puzzle.treat.mandarin': { file: 'assets/puzzles/treat_mandarin.png', w: 16, h: 16, ...OWN },
  'puzzle.treat.nut': { file: 'assets/puzzles/treat_nut.png', w: 16, h: 16, ...OWN },
  'puzzle.treat.licorice': { file: 'assets/puzzles/treat_licorice.png', w: 16, h: 16, ...OWN },
  'puzzle.treat.gingerbread': { file: 'assets/puzzles/treat_gingerbread.png', w: 16, h: 16, ...OWN },
  'puzzle.p07': { file: 'assets/puzzles/p07.png', w: 256, h: 72, ...OWN },
  'puzzle.p13w': { file: 'assets/puzzles/p13w.png', w: 256, h: 96, ...OWN },
  'puzzle.p14a': { file: 'assets/puzzles/p14a.png', w: 256, h: 80, ...OWN },
  'puzzle.p15w': { file: 'assets/puzzles/p15w.png', w: 256, h: 192, ...OWN },
  'puzzle.p15a': { file: 'assets/puzzles/p15a.png', w: 256, h: 232, ...OWN },
  'puzzle.cracker.red': { file: 'assets/puzzles/cracker_red.png', w: 32, h: 16, ...OWN },
  'puzzle.cracker.green': { file: 'assets/puzzles/cracker_green.png', w: 32, h: 16, ...OWN },
  'puzzle.cracker.blue': { file: 'assets/puzzles/cracker_blue.png', w: 32, h: 16, ...OWN },
  'puzzle.p10': { file: 'assets/puzzles/p10.png', w: 256, h: 120, ...OWN },
  'puzzle.p10.key_a': { file: 'assets/puzzles/p10_key_a.png', w: 24, h: 24, ...OWN },
  'puzzle.p10.key_b': { file: 'assets/puzzles/p10_key_b.png', w: 24, h: 24, ...OWN },
  'puzzle.p10.key_c': { file: 'assets/puzzles/p10_key_c.png', w: 24, h: 24, ...OWN },
  'puzzle.p10.key_d': { file: 'assets/puzzles/p10_key_d.png', w: 24, h: 24, ...OWN },
  'puzzle.hippogriff': { file: 'assets/puzzles/hippogriff.png', w: 16, h: 16, ...OWN },
  'puzzle.ferret': { file: 'assets/puzzles/ferret.png', w: 16, h: 16, ...OWN },
  // Phase 2 overrides go below, e.g.
  // 'portrait.quill': { file: 'assets/portraits/quill.png', moods: { happy: '...' } },
};

export const MUSIC_IDS = MUSIC;
export const SFX_IDS = SFX;
