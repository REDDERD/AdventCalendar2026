// LPC layers imported from the Universal LPC Spritesheet Character Generator [GFX-1].
// Only the walk animation (4 directions × 9 frames, 576 × 256) is used.

/** LPC body types we import. `slim` / `broad` are the player's build options. */
export const BODIES = ['female', 'male'] as const;
export type LpcBody = (typeof BODIES)[number];

export interface LayerSpec {
  /** Our layer id (file name in public/assets/lpc). */
  id: string;
  /** Sheet definition, relative to sheet_definitions/. */
  def: string;
  /** Which layer of the definition (layer_2 = behind the body for capes/long hair). */
  layer?: 'layer_1' | 'layer_2';
  /** Body-specific files are imported per body; otherwise one shared file. */
  bodies?: readonly LpcBody[];
  /** For definitions with fixed colour files instead of a palette. */
  variant?: string;
  /** Override the definition's zPos (needed when a layer is reused out of context). */
  z?: number;
}

const both = BODIES;

export const LAYERS: LayerSpec[] = [
  // Player base
  { id: 'body', def: 'body/body.json', bodies: both },
  { id: 'head_female', def: 'head/heads/human/heads_human_female.json' },
  { id: 'head_male', def: 'head/heads/human/heads_human_male.json' },
  { id: 'head_female_elderly', def: 'head/heads/human/heads_human_female_elderly.json' },
  { id: 'head_male_elderly', def: 'head/heads/human/heads_human_male_elderly.json' },

  // Hair (player options + NPC styles)
  { id: 'hair_plain', def: 'hair/short/hair_plain.json' },
  { id: 'hair_messy1', def: 'hair/short/hair_messy1.json' },
  { id: 'hair_pixie', def: 'hair/short/hair_pixie.json' },
  { id: 'hair_curly_short', def: 'hair/curly/hair_curly_short.json' },
  { id: 'hair_bob', def: 'hair/bob/hair_bob.json' },
  { id: 'hair_long_straight', def: 'hair/long/hair_long_straight.json' },
  { id: 'hair_ponytail', def: 'hair/braids/hair_ponytail.json' },
  { id: 'hair_ponytail_bg', def: 'hair/braids/hair_ponytail.json', layer: 'layer_2' },
  { id: 'hair_braid', def: 'hair/braids/hair_braid.json' },
  { id: 'hair_braid_bg', def: 'hair/braids/hair_braid.json', layer: 'layer_2' },
  { id: 'hair_afro', def: 'hair/afro/hair_afro.json' },
  { id: 'hair_bangs_bun', def: 'hair/braids/hair_bangs_bun.json' },
  { id: 'hair_parted', def: 'hair/short/hair_parted.json' },
  { id: 'hair_balding', def: 'hair/bald/hair_balding.json' },
  { id: 'hair_long', def: 'hair/long/hair_long.json' },
  { id: 'beard_winter', def: 'hair/beards/beards_winter.json', bodies: ['male'] },

  // Clothes (palette "cloth")
  { id: 'sweater', def: 'torso/shirts/longsleeve/torso_clothes_longsleeve.json', bodies: both },
  { id: 'pants', def: 'legs/pants/legs_pants.json', bodies: both },
  { id: 'skirt', def: 'legs/skirts/legs_skirts_plain.json', bodies: both },
  { id: 'shoes', def: 'feet/shoes/feet_shoes_basic.json', bodies: both },
  { id: 'cape', def: 'torso/cape/cape_solid.json' },
  { id: 'cape_bg', def: 'torso/cape/cape_solid.json', layer: 'layer_2' },
  { id: 'cape_trim', def: 'torso/cape/cape_trim.json' },
  { id: 'scarf', def: 'headwear/neck/neck_scarf.json' },
  { id: 'bowtie', def: 'headwear/neck/neck_bowtie.json' },

  // Accessories with fixed colours
  { id: 'glasses', def: 'headwear/accessories/glasses/facial_glasses.json', variant: 'black' },
  { id: 'glasses_round', def: 'headwear/accessories/glasses/facial_glasses_round.json', variant: 'gold' },
  { id: 'christmas_hat', def: 'headwear/hats/holiday/hat_holiday_christmas.json', variant: 'red' },
  { id: 'earrings', def: 'headwear/accessories/earrings/facial_earrings_stud.json', variant: 'gold', bodies: both },

  // NPC-only
  { id: 'robe_purple', def: 'torso/shirts/torso_clothes_robe.json', variant: 'purple', bodies: ['female'] },
  { id: 'robe_black', def: 'torso/shirts/torso_clothes_robe.json', variant: 'black', bodies: ['female'] },
  { id: 'robe_brown', def: 'torso/shirts/torso_clothes_robe.json', variant: 'dark brown', bodies: ['female'] },
  { id: 'wizard_hat_purple', def: 'headwear/hats/magic/hat_magic_wizard.json', variant: 'purple' },
  { id: 'wizard_hat_black', def: 'headwear/hats/magic/hat_magic_wizard.json', variant: 'black' },
  { id: 'wizard_hat_belt_teal', def: 'headwear/hats/magic/hat_magic_wizard_belt.json', variant: 'teal' },
  { id: 'wizard_hat_belt_maroon', def: 'headwear/hats/magic/hat_magic_wizard_belt.json', variant: 'maroon' },
  { id: 'vest_brown', def: 'torso/vest/torso_clothes_vest.json', variant: 'brown', bodies: ['male'] },
  { id: 'armour', def: 'torso/armour/torso_armour_plate.json', bodies: ['male'] },
  { id: 'legs_armour', def: 'legs/legs_armour.json', bodies: ['male'] },
];

/** Palettes copied from palette_definitions (ULPC variants). */
export const PALETTES = {
  body: 'body/body_ulpc.json',
  hair: 'hair/hair_ulpc.json',
  cloth: 'cloth/cloth_ulpc.json',
  eye: 'eye/eye_ulpc.json',
  metal: 'metal/metal_ulpc.json',
} as const;
