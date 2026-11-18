import type { Recipe } from './layers';

/**
 * NPC looks (Section 7.2), composed from LPC layers by `npm run assets:npcs`
 * into public/assets/sprites/<id>.png [GFX-1]. Sorting hat and Niffler are
 * drawn separately [GFX-4].
 */
export const NPCS: Record<string, Recipe> = {
  // Prof. Henrietta Quill – pointed hat, round glasses, purple robe
  quill: {
    body: 'female',
    layers: [
      { id: 'body', colors: { body: 'amber' } },
      { id: 'head_female', colors: { body: 'amber', eye: 'green' } },
      { id: 'shoes', colors: { cloth: 'black' } },
      { id: 'robe_purple' },
      { id: 'hair_bangs_bun', colors: { hair: 'dark_gray' } },
      { id: 'glasses_round' },
      { id: 'wizard_hat_purple' },
      { id: 'wizard_hat_belt_teal' },
    ],
  },
  // Ellis Wren – Ravenclaw, 6th year
  ellis: {
    body: 'male',
    layers: [
      { id: 'cape_bg', colors: { cloth: 'navy' } },
      { id: 'body', colors: { body: 'light' } },
      { id: 'head_male', colors: { body: 'light', eye: 'blue' } },
      { id: 'shoes', colors: { cloth: 'black' } },
      { id: 'pants', colors: { cloth: 'charcoal' } },
      { id: 'sweater', colors: { cloth: 'blue' } },
      { id: 'cape', colors: { cloth: 'navy' } },
      { id: 'cape_trim', colors: { cloth: 'tan' } },
      { id: 'scarf', colors: { cloth: 'navy' } },
      { id: 'hair_messy1', colors: { hair: 'sandy' } },
    ],
  },
  // Theo Ashcombe – Slytherin
  theo: {
    body: 'male',
    layers: [
      { id: 'cape_bg', colors: { cloth: 'forest' } },
      { id: 'body', colors: { body: 'olive' } },
      { id: 'head_male', colors: { body: 'olive', eye: 'gray' } },
      { id: 'shoes', colors: { cloth: 'black' } },
      { id: 'pants', colors: { cloth: 'black' } },
      { id: 'sweater', colors: { cloth: 'charcoal' } },
      { id: 'cape', colors: { cloth: 'forest' } },
      { id: 'cape_trim', colors: { cloth: 'gray' } },
      { id: 'hair_parted', colors: { hair: 'black' } },
    ],
  },
  // Maren Holloway – Hufflepuff prefect
  maren: {
    body: 'female',
    layers: [
      { id: 'cape_bg', colors: { cloth: 'yellow' } },
      { id: 'body', colors: { body: 'bronze' } },
      { id: 'head_female', colors: { body: 'bronze', eye: 'brown' } },
      { id: 'shoes', colors: { cloth: 'black' } },
      { id: 'skirt', colors: { cloth: 'black' } },
      { id: 'sweater', colors: { cloth: 'tan' } },
      { id: 'cape', colors: { cloth: 'yellow' } },
      { id: 'cape_trim', colors: { cloth: 'black' } },
      { id: 'hair_ponytail', colors: { hair: 'carrot' } },
      { id: 'hair_ponytail_bg', colors: { hair: 'carrot' } },
    ],
  },
  // Caretaker Grimsby
  grimsby: {
    body: 'male',
    layers: [
      { id: 'body', colors: { body: 'taupe' } },
      { id: 'head_male_elderly', colors: { body: 'taupe', eye: 'brown' } },
      { id: 'shoes', colors: { cloth: 'brown' } },
      { id: 'pants', colors: { cloth: 'walnut' } },
      { id: 'sweater', colors: { cloth: 'leather' } },
      { id: 'vest_brown' },
      { id: 'hair_balding', colors: { hair: 'gray' } },
      { id: 'beard_winter', colors: { hair: 'gray' } },
    ],
  },
  // Sir Aldous Frostbart – ghost knight
  aldous: {
    body: 'male',
    ghost: true,
    layers: [
      { id: 'body', colors: { body: 'light' } },
      { id: 'head_male', colors: { body: 'light', eye: 'gray' } },
      { id: 'legs_armour' },
      { id: 'armour' },
      { id: 'hair_long', colors: { hair: 'white' } },
      { id: 'beard_winter', colors: { hair: 'white' } },
    ],
  },
  // Headmistress Thornbury
  thornbury: {
    body: 'female',
    layers: [
      { id: 'body', colors: { body: 'light' } },
      { id: 'head_female_elderly', colors: { body: 'light', eye: 'gray' } },
      { id: 'shoes', colors: { cloth: 'black' } },
      { id: 'robe_black' },
      { id: 'hair_bangs_bun', colors: { hair: 'white' } },
      { id: 'wizard_hat_black' },
      { id: 'wizard_hat_belt_maroon' },
    ],
  },
  // Peeves the poltergeist (cameo, day 2) – jester colours, Christmas hat
  peeves: {
    body: 'male',
    layers: [
      { id: 'body', colors: { body: 'light' } },
      { id: 'head_male', colors: { body: 'light', eye: 'orange' } },
      { id: 'shoes', colors: { cloth: 'orange' } },
      { id: 'pants', colors: { cloth: 'purple' } },
      { id: 'sweater', colors: { cloth: 'orange' } },
      { id: 'bowtie', colors: { cloth: 'purple' } },
      { id: 'hair_messy1', colors: { hair: 'red' } },
      { id: 'christmas_hat' },
    ],
  },
  // The wandmaker
  wandmaker: {
    body: 'female',
    layers: [
      { id: 'body', colors: { body: 'brown' } },
      { id: 'head_female_elderly', colors: { body: 'brown', eye: 'brown' } },
      { id: 'shoes', colors: { cloth: 'brown' } },
      { id: 'robe_brown' },
      { id: 'hair_long', colors: { hair: 'platinum' } },
      { id: 'glasses_round' },
    ],
  },
};
