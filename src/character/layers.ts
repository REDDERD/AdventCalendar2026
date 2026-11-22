import type { HouseId, Look, Pronoun } from '../types';
import lpc from './lpc.generated.json';
import { colorMap, type ColorMap } from './recolor';

/** Section 6.2 option lists. Labels are shown in the mirror. */
export const OPTIONS = {
  build: [['slim', 'Zierlich'], ['broad', 'Kräftig']],
  skin: [['light', 'Hell'], ['amber', 'Pfirsich'], ['olive', 'Oliv'], ['bronze', 'Bronze'], ['brown', 'Braun'], ['black', 'Dunkel']],
  hair: [
    ['plain', 'Kurz'], ['messy1', 'Zerzaust'], ['pixie', 'Pixie'], ['curly_short', 'Locken'], ['bob', 'Bob'],
    ['long_straight', 'Lang'], ['ponytail', 'Pferdeschwanz'], ['braid', 'Zopf'], ['afro', 'Afro'], ['bangs_bun', 'Dutt'],
  ],
  hairColor: [
    ['platinum', 'Platin'], ['blonde', 'Blond'], ['ginger', 'Rotblond'], ['red', 'Rot'],
    ['light_brown', 'Hellbraun'], ['chestnut', 'Kastanie'], ['dark_brown', 'Dunkelbraun'], ['black', 'Schwarz'],
  ],
  eyes: [['blue', 'Blau'], ['green', 'Grün'], ['brown', 'Braun'], ['gray', 'Grau'], ['purple', 'Violett']],
  glasses: [['none', 'Keine'], ['glasses', 'Eckig'], ['glasses_round', 'Rund']],
  accessory: [['none', 'Keins'], ['christmas_hat', 'Wintermütze'], ['scarf', 'Schal'], ['earrings', 'Ohrringe'], ['bowtie', 'Fliege']],
  sweater: [['red', 'Rot'], ['navy', 'Marine'], ['forest', 'Tanne'], ['yellow', 'Senf'], ['lavender', 'Lavendel'], ['charcoal', 'Anthrazit']],
  bottom: [['pants', 'Hose'], ['skirt', 'Rock']],
} as const satisfies Record<keyof Look, ReadonlyArray<readonly [string, string]>>;

export const LOOK_KEYS = Object.keys(OPTIONS) as Array<keyof Look>;

export const DEFAULT_LOOK: Look = {
  build: 'slim',
  skin: 'light',
  hair: 'bob',
  hairColor: 'light_brown',
  eyes: 'blue',
  glasses: 'none',
  accessory: 'none',
  sweater: 'navy',
  bottom: 'pants',
};

/** The body shape follows the pronoun: Hexe → slim, Zauberer → broad (DECISIONS.md #20). */
export function buildForPronoun(pronoun: Pronoun | undefined): Look['build'] {
  return pronoun === 'm' ? 'broad' : 'slim';
}

/** Random look for the mirror's "Zufall" button; the body shape is kept. */
export function randomLook(build: Look['build'], rand: () => number = Math.random): Look {
  const pick = <K extends keyof Look>(key: K) => {
    const list = OPTIONS[key];
    return list[Math.floor(rand() * list.length)][0];
  };
  return { ...(Object.fromEntries(LOOK_KEYS.map((k) => [k, pick(k)])) as unknown as Look), build };
}

/** [CHAR-2] Robe (cape) and trim colours per house, as ULPC cloth palette names. */
export const HOUSE_CAPE: Record<HouseId, { main: string; trim: string }> = {
  gryffindor: { main: 'maroon', trim: 'yellow' },
  hufflepuff: { main: 'yellow', trim: 'black' },
  ravenclaw: { main: 'navy', trim: 'tan' },
  slytherin: { main: 'forest', trim: 'gray' },
};
export const UNSORTED_CAPE = { main: 'gray', trim: 'charcoal' };

export type Body = 'female' | 'male';
export type Material = 'body' | 'hair' | 'cloth' | 'eye' | 'metal';

/** A layer to draw, with the palette variant to use per material. */
export interface LayerUse {
  id: string;
  colors?: Partial<Record<Material, string>>;
}

export interface Recipe {
  body: Body;
  layers: LayerUse[];
  /**
   * Every ghost is drawn translucent and bluish (DECISIONS.md #47): `true` = pale blue
   * all over (Sir Aldous), a number 0–1 = how much of the own colours stays visible.
   */
  ghost?: boolean | number;
  /**
   * Short stature (Prof. Flitwick): the head keeps its size, the body is squashed (see
   * `shrinkBody` in scripts/build-npcs.ts), so the figure stays LPC-sharp but is clearly smaller.
   */
  small?: boolean;
}

type LayerInfo = { z: number; recolor: Array<{ material: string; base: string }>; files: Partial<Record<Body | 'any', string>> };
const LAYERS = lpc.layers as Record<string, LayerInfo>;
const PALETTES = lpc.palettes as Record<Material, Record<string, string[]>>;

/** [CHAR-1] Player layers: body → eyes (in head) → hair_back → clothes → robe → hair_front → glasses → accessory. */
export function playerRecipe(look: Look, house: HouseId | null): Recipe {
  const body: Body = look.build === 'broad' ? 'male' : 'female';
  const cape = house ? HOUSE_CAPE[house] : UNSORTED_CAPE;
  const skin = { body: look.skin };
  const hair = { hair: look.hairColor };
  const layers: LayerUse[] = [
    { id: 'cape_bg', colors: { cloth: cape.main } },
    { id: 'body', colors: skin },
    { id: `head_${body}`, colors: { ...skin, eye: look.eyes } },
    { id: 'shoes', colors: { cloth: 'black' } },
    { id: look.bottom === 'skirt' ? 'skirt' : 'pants', colors: { cloth: 'charcoal' } },
    { id: 'sweater', colors: { cloth: look.sweater } },
    { id: 'cape', colors: { cloth: cape.main } },
    { id: 'cape_trim', colors: { cloth: cape.trim } },
    { id: `hair_${look.hair}`, colors: hair },
  ];
  if (LAYERS[`hair_${look.hair}_bg`]) layers.push({ id: `hair_${look.hair}_bg`, colors: hair });
  if (look.glasses !== 'none') layers.push({ id: look.glasses });
  if (look.accessory === 'scarf') layers.push({ id: 'scarf', colors: { cloth: cape.main } });
  else if (look.accessory === 'bowtie') layers.push({ id: 'bowtie', colors: { cloth: cape.trim === 'charcoal' ? 'red' : cape.trim } });
  else if (look.accessory !== 'none') layers.push({ id: look.accessory });
  return { body, layers };
}

export interface ResolvedLayer {
  id: string;
  file: string;
  z: number;
  maps: ColorMap[];
}

/** Files, draw order and colour maps for a recipe. */
export function resolveRecipe(recipe: Recipe): ResolvedLayer[] {
  return recipe.layers
    .map((use) => {
      const info = LAYERS[use.id];
      if (!info) throw new Error(`Unknown LPC layer ${use.id}`);
      const file = info.files[recipe.body] ?? info.files.any;
      if (!file) throw new Error(`LPC layer ${use.id} has no file for body ${recipe.body}`);
      const maps = info.recolor.flatMap(({ material, base }) => {
        const target = use.colors?.[material as Material];
        const palette = PALETTES[material as Material];
        if (!target || !palette?.[base] || !palette[target]) return [];
        return [colorMap(palette[base], palette[target])];
      });
      return { id: use.id, file, z: info.z, maps };
    })
    .sort((a, b) => a.z - b.z);
}

/** Sprite sheet geometry: LPC walk = 9 frames × 4 rows (up, left, down, right). */
export const FRAME = 64;
export const SHEET_COLS = 9;
export const DIRECTIONS = ['up', 'left', 'down', 'right'] as const;
export type Direction = (typeof DIRECTIONS)[number];

export function frameIndex(direction: Direction, step = 0): number {
  return DIRECTIONS.indexOf(direction) * SHEET_COLS + step;
}
