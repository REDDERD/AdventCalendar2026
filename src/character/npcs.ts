import type { Recipe } from './layers';

/**
 * NPC looks (Section 7.2), composed from LPC layers by `npm run assets:npcs`
 * into public/assets/sprites/<id>.png [GFX-1]. Sorting hat and Niffler are
 * drawn separately [GFX-4]. Every ghost gets `ghost` (translucent, bluish – DECISIONS.md #47).
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
  // Peeves the poltergeist (cameo, day 2) – jester colours, Christmas hat, tinted like every ghost
  peeves: {
    body: 'male',
    ghost: 0.3,
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
  // Madam Pince – librarian (cameo, day 4): thin, grey bun, dark robe
  pince: {
    body: 'female',
    layers: [
      { id: 'body', colors: { body: 'light' } },
      { id: 'head_female_elderly', colors: { body: 'light', eye: 'gray' } },
      { id: 'shoes', colors: { cloth: 'black' } },
      { id: 'robe_black' },
      { id: 'hair_bangs_bun', colors: { hair: 'gray' } },
      { id: 'glasses' },
    ],
  },
  // Hermine (cameo, day 4): bushy brown hair, Gryffindor cape
  hermione: {
    body: 'female',
    layers: [
      { id: 'cape_bg', colors: { cloth: 'maroon' } },
      { id: 'body', colors: { body: 'light' } },
      { id: 'head_female', colors: { body: 'light', eye: 'brown' } },
      { id: 'shoes', colors: { cloth: 'black' } },
      { id: 'skirt', colors: { cloth: 'charcoal' } },
      { id: 'sweater', colors: { cloth: 'gray' } },
      { id: 'cape', colors: { cloth: 'maroon' } },
      { id: 'cape_trim', colors: { cloth: 'yellow' } },
      { id: 'hair_curly_short', colors: { hair: 'chestnut' } },
    ],
  },
  // Prof. Slughorn (cameo, day 5): round, balding, walrus whiskers, green waistcoat look
  slughorn: {
    body: 'male',
    layers: [
      { id: 'body', colors: { body: 'light' } },
      { id: 'head_male_elderly', colors: { body: 'light', eye: 'green' } },
      { id: 'shoes', colors: { cloth: 'brown' } },
      { id: 'pants', colors: { cloth: 'forest' } },
      { id: 'sweater', colors: { cloth: 'green' } },
      { id: 'vest_brown' },
      { id: 'hair_balding', colors: { hair: 'sandy' } },
      { id: 'beard_winter', colors: { hair: 'sandy' } },
    ],
  },
  // Neville (cameo, day 8): Herbology teacher from later, earthy colours, Gryffindor scarf
  neville: {
    body: 'male',
    layers: [
      { id: 'body', colors: { body: 'light' } },
      { id: 'head_male', colors: { body: 'light', eye: 'brown' } },
      { id: 'shoes', colors: { cloth: 'brown' } },
      { id: 'pants', colors: { cloth: 'walnut' } },
      { id: 'sweater', colors: { cloth: 'forest' } },
      { id: 'scarf', colors: { cloth: 'maroon' } },
      { id: 'hair_plain', colors: { hair: 'dark_brown' } },
    ],
  },
  // Fast Kopfloser Nick – Gryffindor house ghost (cameo, days 9, 19): ruff, doublet, ghost
  nick: {
    body: 'male',
    ghost: true,
    layers: [
      { id: 'body', colors: { body: 'light' } },
      { id: 'head_male', colors: { body: 'light', eye: 'gray' } },
      { id: 'shoes', colors: { cloth: 'black' } },
      { id: 'pants', colors: { cloth: 'maroon' } },
      { id: 'sweater', colors: { cloth: 'maroon' } },
      { id: 'vest_brown' },
      { id: 'bowtie', colors: { cloth: 'white' } },
      { id: 'hair_parted', colors: { hair: 'dark_brown' } },
    ],
  },
  // The Fat Friar – Hufflepuff house ghost (cameo, days 9, 19): monk's habit, tonsure, ghost
  friar: {
    body: 'male',
    ghost: true,
    layers: [
      { id: 'body', colors: { body: 'light' } },
      { id: 'head_male_elderly', colors: { body: 'light', eye: 'brown' } },
      { id: 'shoes', colors: { cloth: 'brown' } },
      { id: 'pants', colors: { cloth: 'brown' } },
      { id: 'sweater', colors: { cloth: 'brown' } },
      { id: 'scarf', colors: { cloth: 'leather' } },
      { id: 'hair_balding', colors: { hair: 'chestnut' } },
    ],
  },
  // The Grey Lady – Ravenclaw house ghost (cameo, days 9, 19): long hair, long robe, ghost
  grey_lady: {
    body: 'female',
    ghost: true,
    layers: [
      { id: 'body', colors: { body: 'light' } },
      { id: 'head_female', colors: { body: 'light', eye: 'gray' } },
      { id: 'shoes', colors: { cloth: 'gray' } },
      { id: 'robe_purple' },
      { id: 'hair_long_straight', colors: { hair: 'dark_brown' } },
    ],
  },
  // The Bloody Baron – Slytherin house ghost (cameo, days 9, 19): armour, long hair, beard, ghost
  baron: {
    body: 'male',
    ghost: true,
    layers: [
      { id: 'body', colors: { body: 'light' } },
      { id: 'head_male', colors: { body: 'light', eye: 'gray' } },
      { id: 'legs_armour' },
      { id: 'armour' },
      { id: 'hair_long', colors: { hair: 'black' } },
      { id: 'beard_winter', colors: { hair: 'black' } },
    ],
  },
  // Argus Filch – caretaker from another time (cameo, days 10, 24): gaunt, grey hair, brown coat
  filch: {
    body: 'male',
    layers: [
      { id: 'body', colors: { body: 'taupe' } },
      { id: 'head_male_elderly', colors: { body: 'taupe', eye: 'gray' } },
      { id: 'shoes', colors: { cloth: 'black' } },
      { id: 'pants', colors: { cloth: 'charcoal' } },
      { id: 'sweater', colors: { cloth: 'walnut' } },
      { id: 'vest_brown' },
      { id: 'hair_long', colors: { hair: 'gray' } },
    ],
  },
  // Hagrid – gamekeeper from another Tuesday (cameo, days 11, 16, 24): wild hair and beard, moleskin coat
  hagrid: {
    body: 'male',
    layers: [
      { id: 'body', colors: { body: 'light' } },
      { id: 'head_male', colors: { body: 'light', eye: 'brown' } },
      { id: 'shoes', colors: { cloth: 'brown' } },
      { id: 'pants', colors: { cloth: 'walnut' } },
      { id: 'sweater', colors: { cloth: 'leather' } },
      { id: 'vest_brown' },
      { id: 'hair_long', colors: { hair: 'dark_brown' } },
      { id: 'beard_winter', colors: { hair: 'dark_brown' } },
    ],
  },
  // Luna Lovegood (cameo, days 12, 16, 24): long blonde hair, radish earrings, Ravenclaw cape
  luna: {
    body: 'female',
    layers: [
      { id: 'cape_bg', colors: { cloth: 'navy' } },
      { id: 'body', colors: { body: 'light' } },
      { id: 'head_female', colors: { body: 'light', eye: 'blue' } },
      { id: 'shoes', colors: { cloth: 'blue' } },
      { id: 'skirt', colors: { cloth: 'navy' } },
      { id: 'sweater', colors: { cloth: 'sky' } },
      { id: 'cape', colors: { cloth: 'navy' } },
      { id: 'cape_trim', colors: { cloth: 'tan' } },
      { id: 'hair_long_straight', colors: { hair: 'platinum' } },
      { id: 'earrings' },
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
