import type { HouseId } from '../types';

/** Section 5.2: fixed game palette (candle tones, winter blue, stone grey, 4 house pairs). */
export const palette = {
  night: '#0b1530',
  nightLight: '#1b2a4e',
  ink: '#1a1423',
  stoneDark: '#2b2a33',
  stone: '#4a4856',
  stoneLight: '#7a7788',
  parchmentDark: '#c9a66b',
  parchment: '#e8d5a6',
  parchmentLight: '#f6ead0',
  woodDark: '#3b2414',
  wood: '#6b4226',
  woodLight: '#9a6a3c',
  candle: '#ffd27a',
  candleLight: '#fff1c2',
  flame: '#ff9a3c',
  ember: '#c4512a',
  winterDark: '#2e5a8f',
  winter: '#5d8fc7',
  winterLight: '#a9cbe8',
  snow: '#f4f8ff',
  gold: '#d4a73a',
  goldLight: '#f2d675',
  silver: '#b8c0cc',
  green: '#4f8a3c',
  red: '#c23b3b',
  gryffindor: '#8e1b1b',
  gryffindorAlt: '#d9a425',
  hufflepuff: '#e0b320',
  hufflepuffAlt: '#2b2620',
  ravenclaw: '#1d3f8a',
  ravenclawAlt: '#9a7b4a',
  slytherin: '#1e6b3a',
  slytherinAlt: '#a8b2b8',
} as const;

export type PaletteColor = keyof typeof palette;

/** [CHAR-2] Two colours per house for the robe palette swap. */
export const HOUSE_COLORS: Record<HouseId, [string, string]> = {
  gryffindor: [palette.gryffindor, palette.gryffindorAlt],
  hufflepuff: [palette.hufflepuff, palette.hufflepuffAlt],
  ravenclaw: [palette.ravenclaw, palette.ravenclawAlt],
  slytherin: [palette.slytherin, palette.slytherinAlt],
};

export const PALETTE_HEX: string[] = Object.values(palette);
