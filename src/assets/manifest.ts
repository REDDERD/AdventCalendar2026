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

const backgrounds = Object.fromEntries(
  LOCATIONS.map((id) => [`bg.${id}`, { file: `assets/bg/${id}.png`, w: 256, h: 192 } satisfies FileAsset]),
);

const npcs = Object.fromEntries(
  CHARACTERS.filter((id) => id !== 'player').map((id) => [
    `npc.${id}`,
    { file: `assets/sprites/${id}.png`, frameW: 64, frameH: 64, anims: { idle: [0], walk: [1, 2, 3, 4] } } satisfies FileAsset,
  ]),
);

const portraits = Object.fromEntries(
  CHARACTERS.filter((id) => id !== 'player').map((id) => [
    `portrait.${id}`,
    { from: `npc.${id}`, crop: [16, 8, 32, 32], scale: 2 } satisfies CropAsset,
  ]),
);

const EMOTES = ['!', '?', 'heart', 'sweat', 'note', 'dots'] as const;
const emoteFile: Record<(typeof EMOTES)[number], string> = {
  '!': 'exclaim', '?': 'question', heart: 'heart', sweat: 'sweat', note: 'note', dots: 'dots',
};
const emotes = Object.fromEntries(
  EMOTES.map((id) => [`emote.${id}`, { file: `assets/emotes/${emoteFile[id]}.png`, w: 16, h: 16 } satisfies FileAsset]),
);

const SFX = ['blip', 'select', 'correct', 'wrong', 'spark', 'door', 'stamp'] as const;
const sfx = Object.fromEntries(SFX.map((id) => [`sfx.${id}`, { file: `audio/sfx/${id}.ogg` } satisfies FileAsset]));

const MUSIC = ['title', 'castle', 'outdoor', 'dungeon', 'puzzle', 'finale', 'letter'] as const;
const music = Object.fromEntries(MUSIC.map((id) => [`music.${id}`, { file: `audio/music/${id}.ogg` } satisfies FileAsset]));

export const assets: Record<string, AssetDef> = {
  ...backgrounds,
  ...npcs,
  ...portraits,
  ...emotes,
  ...sfx,
  ...music,
  'ui.clock': { file: 'assets/ui/clock.png', w: 128, h: 160 },
  'ui.frame.parchment': { file: 'assets/ui/parchment.png', nineSlice: [8, 8, 8, 8] },
  'ui.frame.wood': { file: 'assets/ui/wood.png', nineSlice: [8, 8, 8, 8] },
  'ui.seal': { file: 'assets/ui/seal.png', w: 24, h: 24 },
  'puzzle.p01': { file: 'assets/puzzles/p01.png', w: 256, h: 120 },
  // Phase 2 overrides go below, e.g.
  // 'portrait.quill': { file: 'assets/portraits/quill.png', moods: { happy: '...' } },
};

export const MUSIC_IDS = MUSIC;
export const SFX_IDS = SFX;
