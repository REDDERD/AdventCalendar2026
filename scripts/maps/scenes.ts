// The scene backgrounds, one function per location (256 × 512, bottom-anchored).
// Layout rules (DECISIONS.md #32): y < 88 may be cut off on short phones, characters
// stand around y 280–408, the dialogue box covers y > 412 – keep details in y 100–400.
// Walls run from about y 200 to 336, the floor from 336 down.
import { hex, Picture, random, toSnow, type RGB } from './kit';

/** House colours for banners: [main, trim]. */
const HOUSES: Array<[string, string]> = [
  ['#8e1b1b', '#d9a425'], // Gryffindor
  ['#e0b320', '#2b2620'], // Hufflepuff
  ['#1d3f8a', '#b08850'], // Ravenclaw
  ['#1e6b3a', '#c0c8d0'], // Slytherin
];

const WALL_TOP = 200;
const FLOOR = 336;

// ---------- Shared pieces ----------

/** Castle stone wall: staggered blocks in the colours of the LPC castle sheet. */
function stoneWall(p: Picture, y0 = WALL_TOP, y1 = FLOOR): void {
  const rnd = random(y0 * 7 + y1);
  p.rect(0, y0, p.w, y1 - y0, '#666d8c');
  for (let y = y0, row = 0; y < y1; y += 12, row++) {
    for (let x = row % 2 ? -14 : 0; x < p.w; ) {
      const w = 22 + Math.floor(rnd() * 12);
      const h = Math.min(11, y1 - y);
      p.rect(x + 1, y + 1, w - 1, h - 1, '#8ca899');
      p.rect(x + 1, y + 1, w - 1, 1, '#a9c2b2');
      p.rect(x + 1, y + h - 1, w - 1, 1, '#6a8d8e');
      if (rnd() < 0.15) p.rect(x + 4 + rnd() * (w - 10), y + 4, 4, 2, '#7d9a8c'); // a worn spot
      x += w;
    }
  }
  p.rect(0, y1 - 3, p.w, 3, '#5d5c72');
}

/** Red brick dungeon wall. */
function brickWall(p: Picture, y0: number, y1: number): void {
  p.fill('dungeon', 0, 0, 0, y0, p.w, y1, 3, 3);
}

function stoneFloor(p: Picture, y0 = FLOOR, y1 = 512): void {
  p.fill('castlefloors', 0, 0, 0, y0, p.w, y1, 2, 2);
}

function woodFloor(p: Picture, y0 = FLOOR, y1 = 512): void {
  p.fill('inside', 0, 4, 0, y0, p.w, y1);
}

/** Night window from the castle sheet (128 × 128 including its frame). */
function nightWindow(p: Picture, x: number, y = WALL_TOP): void {
  p.tile('castlewalls', 8, 9, x, y, 4, 4);
}
function dayWindow(p: Picture, x: number, y = WALL_TOP): void {
  p.tile('castlewalls', 8, 1, x, y, 4, 4);
}

/** Wooden planks seen from above (tables, benches). */
function planks(p: Picture, x: number, y: number, w: number, h: number, dark = false): void {
  const base = dark ? ['#4e2f18', '#5a3a20', '#3b2414'] : ['#7a4c2c', '#8a5a34', '#5a3a20'];
  p.rect(x + 2, y + 3, w, h, '#1a1423', 0.35); // shadow
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const seam = (i % 12 === 0 && i > 0) || j === 0 || j === h - 1;
      p.dot(x + i, y + j, hex(seam ? base[2] : (i * 7 + j * 3) % 23 === 0 ? base[2] : j < 2 ? base[1] : base[0]));
    }
  }
  p.rect(x, y, w, 1, dark ? '#7a4c2c' : '#c99a5c');
}

/** Long table with plates and goblets. */
function longTable(p: Picture, x: number, y: number, w: number, h: number, seed: number): void {
  planks(p, x, y, w, h);
  const rnd = random(seed);
  for (let py = y + 8; py < y + h - 6; py += 18) {
    for (const px of [x + 6, x + w - 14]) {
      p.ellipse(px + 4, py + 3, 4, 3, '#e8e4dc');
      p.ellipse(px + 4, py + 3, 2, 1.5, '#c0c8d0');
      if (rnd() < 0.5) p.rect(px + 9, py, 2, 5, '#d4a73a');
    }
  }
}

/** Red carpet runner with gold borders (vertical). */
function carpet(p: Picture, x: number, w: number, y0 = FLOOR, y1 = 512): void {
  p.rect(x, y0, w, y1 - y0, '#a83232');
  for (let y = y0; y < y1; y++) for (let i = 2; i < w - 2; i++) if ((i + y) % 9 === 0) p.dot(x + i, y, hex('#922828'));
  p.rect(x, y0, 2, y1 - y0, '#d4a73a');
  p.rect(x + w - 2, y0, 2, y1 - y0, '#d4a73a');
  p.rect(x + 4, y0, 1, y1 - y0, '#f2d675', 0.6);
  p.rect(x + w - 5, y0, 1, y1 - y0, '#f2d675', 0.6);
}

/** A framed portrait on the wall; `who` picks a simple painted figure. */
function portrait(p: Picture, x: number, y: number, w: number, h: number, coat: string, seed: number): void {
  p.rect(x - 3, y - 3, w + 6, h + 6, '#a8802a');
  p.rect(x - 2, y - 2, w + 4, h + 4, '#f2d675');
  p.rect(x - 1, y - 1, w + 2, h + 2, '#7a5a1c');
  p.gradient(y, y + h, '#3a3440', '#1b2a4e', x, x + w);
  const rnd = random(seed);
  const skin = rnd() < 0.5 ? '#e8c39e' : '#c9956a';
  const hair = rnd() < 0.5 ? '#3b2414' : '#9aa0b0';
  const cx = x + w / 2;
  // Shoulders: the upper half of a wide ellipse, clipped to the canvas so nothing sticks out of the frame.
  const rx = w * 0.42;
  const ry = h * 0.36;
  const coatRgb = hex(coat);
  for (let py = y + h - Math.ceil(ry); py < y + h; py++) {
    for (let px = Math.floor(cx - rx); px <= cx + rx; px++) {
      if (px < x || px >= x + w) continue;
      const u = (px + 0.5 - cx) / rx;
      const v = (py + 0.5 - (y + h)) / ry;
      if (u * u + v * v <= 1) p.dot(px, py, coatRgb);
    }
  }
  const headY = y + h * 0.44;
  p.rect(Math.round(cx - w / 12), Math.round(headY), Math.round(w / 6), Math.round(y + h - ry - headY) + 2, skin); // neck
  p.ellipse(cx, headY, w / 5, w / 5, skin);
  p.rect(cx - w / 5, headY - w / 5 - 1, (w / 5) * 2, 3, hair);
}

/** Torch with flame and warm glow. */
function torch(p: Picture, x: number, y: number): void {
  p.ellipse(x + 3, y - 2, 14, 14, '#ffd27a', 0.12);
  p.tile('castle_lightsources', 2, 0, x - 13, y - 10, 1, 2);
}

/** Bookshelf full of books (32 × 80 from the cabinet sheet). */
function bookshelf(p: Picture, x: number, y: number, variant = 0): void {
  p.blit('cabinets', (1 + (variant % 2)) * 32, 0, 32, 80, x, y);
}

/** A cauldron with green brew and fire underneath. */
function cauldron(p: Picture, x: number, y: number, brew = '#7ab84a'): void {
  p.ellipse(x + 14, y + 22, 12, 4, '#ff9a3c', 0.6);
  p.ellipse(x + 14, y + 22, 7, 3, '#ffd27a', 0.8);
  p.ellipse(x + 14, y + 12, 14, 11, '#2b2a33');
  p.ellipse(x + 10, y + 9, 5, 4, '#4a4856');
  p.ellipse(x + 14, y + 3, 13, 4, '#1a1423');
  p.ellipse(x + 14, y + 3, 11, 3, brew);
  const rnd = random(x + y);
  for (let i = 0; i < 4; i++) p.ellipse(x + 6 + rnd() * 16, y - 2 - rnd() * 10, 1.5, 1.5, brew, 0.7);
}

/** Shelf with potion bottles. */
function potionShelf(p: Picture, x: number, y: number, w: number): void {
  p.rect(x, y, w, 3, '#5a3a20');
  p.rect(x, y + 3, w, 1, '#3b2414');
  const colours = ['#7ab84a', '#5d8fc7', '#c23b3b', '#d4a73a', '#a8a6b8', '#9a5ab8'];
  const rnd = random(x * 3 + y);
  for (let i = 2; i < w - 6; i += 7) {
    const c = colours[Math.floor(rnd() * colours.length)];
    const h = 6 + Math.floor(rnd() * 5);
    p.rect(x + i, y - h, 5, h, c);
    p.rect(x + i + 1, y - h - 2, 3, 2, '#e8e4dc');
    p.rect(x + i, y - h, 1, h, '#fff8ea', 0.4);
  }
}

/** Snow lying on the top edge of an area. */
function snowCap(p: Picture, x: number, y: number, w: number, seed: number): void {
  const rnd = random(seed);
  for (let i = 0; i < w; i++) {
    const h = 2 + Math.floor(rnd() * 3);
    p.rect(x + i, y - h, 1, h, '#f4f8ff');
  }
}

/** Nikolaus boot in front of a door. */
function boot(p: Picture, x: number, y: number, colour: string): void {
  p.rect(x, y, 7, 12, colour);
  p.rect(x, y + 10, 12, 5, colour);
  p.rect(x, y, 7, 2, '#f4f8ff');
  p.rect(x + 1, y + 15, 11, 1, '#1a1423');
}

/** Armchair seen from the front. */
function armchair(p: Picture, x: number, y: number, colour: string): void {
  p.rect(x + 2, y + 4, 28, 24, '#1a1423', 0.3);
  p.rect(x, y, 30, 26, colour);
  p.rect(x + 4, y + 6, 22, 12, hexShade(colour, 0.25));
  p.rect(x, y, 30, 2, hexShade(colour, -0.2));
  p.rect(x, y + 26, 4, 3, '#3b2414');
  p.rect(x + 26, y + 26, 4, 3, '#3b2414');
}

function hexShade(colour: string, amount: number): string {
  const rgb = hex(colour).map((v) => Math.max(0, Math.min(255, Math.round(v * (1 + amount))))) as RGB;
  return `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** Fireplace with fire. */
function fireplace(p: Picture, x: number, y: number): void {
  p.rect(x, y, 80, 60, '#7a7788');
  p.rect(x - 6, y - 6, 92, 8, '#9a96a8');
  for (let j = 0; j < 60; j += 10) for (let i = (j / 10) % 2 ? 0 : 10; i < 80; i += 20) p.rect(x + i, y + j, 1, 10, '#5a5866');
  p.rect(x + 16, y + 18, 48, 42, '#1a1423');
  p.ellipse(x + 40, y + 52, 18, 10, '#c4512a');
  p.ellipse(x + 40, y + 50, 12, 9, '#ff9a3c');
  p.ellipse(x + 40, y + 50, 6, 6, '#ffd27a');
  p.ellipse(x + 40, y + 40, 40, 30, '#ffd27a', 0.08);
}

// ---------- The scenes ----------

export const SCENES: Record<string, (p: Picture) => void> = {
  letter: (p) => {
    // a room at home on a winter evening: window with the owl, desk with the letter
    p.fill('inside', 0, 4, 0, 0, 256, FLOOR);
    p.rect(0, 0, 256, FLOOR, '#3b2414', 0.3);
    p.rect(64, 130, 128, 120, '#5a3a20');
    p.gradient(136, 244, '#0b1530', '#2a3a66', 70, 186);
    p.stars(70, 136, 186, 200, 18, 31);
    p.snow(70, 136, 186, 244, 30, 32);
    p.rect(126, 136, 4, 108, '#5a3a20');
    p.rect(70, 188, 116, 4, '#5a3a20');
    p.rect(60, 248, 136, 6, '#9a6a3c');
    snowCap(p, 70, 244, 116, 33);
    p.sprite('sprites/pet_owl.png', 140, 216);
    woodFloor(p);
    p.rect(0, FLOOR - 6, 256, 6, '#3b2414'); // skirting board
    p.rect(0, FLOOR - 6, 256, 1, '#7a4c2c');
    p.ellipse(128, 430, 90, 34, '#1d3f8a');
    p.ellipse(128, 430, 80, 28, '#2b4f9a');
    planks(p, 150, 300, 96, 34);
    p.rect(176, 306, 22, 14, '#e8d5a6'); // the letter with its red seal
    p.ellipse(187, 313, 3, 3, '#a83232');
    p.candle(226, 300);
  },

  wand_shop: (p) => {
    // narrow, dusty shop: shelves full of wand boxes up to the ceiling, a counter
    p.fill('inside', 0, 4, 0, 0, 256, FLOOR);
    p.rect(0, 0, 256, FLOOR, '#1a1423', 0.35);
    p.rect(0, 92, 256, 230, '#1a1423', 0.5); // shadow inside the shelves
    const rnd = random(41);
    const boxes = ['#8a5a34', '#5a3a20', '#4a4856', '#a8802a', '#5d4a7a', '#7a2a2a', '#2b4f6a'];
    for (let y = 92; y < 320; y += 20) {
      p.rect(0, y + 14, 256, 3, '#7a4c2c');
      for (let x = 2; x < 254; ) {
        const w = 24 + Math.floor(rnd() * 10);
        if (rnd() < 0.08) {
          x += w; // a gap where a wand was sold
          continue;
        }
        const c = boxes[Math.floor(rnd() * boxes.length)];
        p.rect(x, y + 6, w - 2, 8, c);
        p.rect(x, y + 6, w - 2, 1, hexShade(c, 0.4));
        p.rect(x + w - 6, y + 8, 2, 4, '#e8d5a6'); // label
        x += w;
      }
    }
    p.rect(0, 0, 256, 120, '#1a1423', 0.25); // dust and dark up high
    p.line(200, 90, 214, 330, '#9a6a3c'); // ladder
    p.line(212, 90, 226, 330, '#9a6a3c');
    for (let y = 100; y < 330; y += 14) p.line(200 + (y - 90) / 17, y, 212 + (y - 90) / 17, y, '#c99a5c');
    woodFloor(p);
    p.rect(0, FLOOR - 6, 256, 6, '#3b2414');
    planks(p, 24, 344, 208, 26, true); // counter
    p.rect(40, 334, 30, 10, '#5a3a20'); // an open wand box
    p.rect(44, 338, 22, 2, '#e8d5a6');
    p.candle(200, 336);
    const dust = random(42);
    for (let i = 0; i < 40; i++) p.dot(dust() * 256, 100 + dust() * 260, hex('#ffd27a'), 0.4);
  },

  great_hall: (p) => {
    // enchanted ceiling: the night sky, snowing
    p.gradient(0, WALL_TOP + 8, '#070d20', '#1b2a4e');
    p.stars(0, 0, 256, 200, 90, 1);
    p.snow(0, 0, 256, 330, 140, 2);
    // back wall with two night windows and the Advent clock in the middle
    stoneWall(p, WALL_TOP + 8);
    nightWindow(p, -40, WALL_TOP + 8);
    nightWindow(p, 168, WALL_TOP + 8);
    p.sprite('ui/clock.png', 80, 212);
    HOUSES.forEach(([main, trim], i) => p.banner([6, 54, 186, 234][i], 212, 16, 40, main, trim));
    // floor: stone with the red carpet down the middle, long tables
    stoneFloor(p);
    carpet(p, 100, 56);
    longTable(p, 8, 352, 56, 150, 3);
    longTable(p, 192, 352, 56, 150, 4);
    const rnd = random(5);
    for (let i = 0; i < 22; i++) p.candle(8 + rnd() * 240, 110 + rnd() * 140);
  },

  staircases: (p) => {
    // the tall stairwell: dark depth with moving staircases and portraits
    p.gradient(0, 512, '#1b2a4e', '#2b2a33');
    p.tile('stairs', 0, 0, -16, 60, 8, 3, { alpha: 0.45 });
    p.tile('stairs', 0, 5, 40, 150, 8, 2, { alpha: 0.6 });
    portrait(p, 14, 120, 34, 44, '#8e1b1b', 1);
    portrait(p, 200, 104, 38, 50, '#1e6b3a', 2);
    portrait(p, 196, 196, 30, 38, '#5a3a6e', 3); // the lady with the poodle
    p.ellipse(203, 228, 5, 4, '#f4f8ff');
    portrait(p, 20, 220, 30, 40, '#1d3f8a', 4);
    torch(p, 70, 250);
    torch(p, 186, 250);
    // the landing and the staircase in front
    p.tile('stairs', 0, 3, 0, 256, 8, 3);
    stoneFloor(p, 352);
    p.rect(0, 352, 256, 2, '#4a4856');
  },

  library: (p) => {
    p.gradient(0, 120, '#3b2414', '#5a3a20');
    // tall shelves along the back wall
    for (let x = 0; x < 256; x += 32) {
      bookshelf(p, x, 120, x / 32);
      bookshelf(p, x, 200, x / 32 + 1);
    }
    p.rect(0, 280, 256, 56, '#5a3a20');
    for (let x = 0; x < 256; x += 32) bookshelf(p, x, 256, x / 32 + 1);
    woodFloor(p);
    // reading tables with candles
    planks(p, 12, 368, 60, 34);
    planks(p, 184, 368, 60, 34);
    for (const x of [30, 202]) p.candle(x, 362);
    p.rect(44, 372, 14, 10, '#8e1b1b'); // open book
    p.rect(51, 372, 1, 10, '#f6ead0');
    p.rect(206, 374, 18, 8, '#1d3f8a');
    // rolling ladder against the top shelf
    p.line(150, 120, 170, 330, '#9a6a3c');
    p.line(160, 120, 180, 330, '#9a6a3c');
    for (let y = 130; y < 330; y += 14) p.line(150 + (y - 120) / 10.5, y, 160 + (y - 120) / 10.5, y, '#c99a5c');
  },

  potions: (p) => {
    brickWall(p, 0, FLOOR);
    p.tile('dungeon', 7, 0, 80, 216, 3, 3); // arch to the store room
    portrait(p, 22, 150, 34, 44, '#1a1423', 7); // the portrait that says nothing
    potionShelf(p, 176, 200, 70);
    potionShelf(p, 176, 236, 70);
    potionShelf(p, 8, 236, 60);
    torch(p, 128, 180);
    p.fill('castlefloors', 5, 5, 0, FLOOR, 256, 512, 2, 2);
    p.rect(0, FLOOR, 256, 512 - FLOOR, '#2b2a33', 0.35);
    cauldron(p, 14, 350);
    cauldron(p, 212, 356, '#5d8fc7');
    cauldron(p, 112, 370, '#9a5ab8');
  },

  dorm_corridor: (p) => {
    stoneWall(p, 0);
    for (const x of [16, 112, 208]) portrait(p, x, 120, 30, 40, ['#8e1b1b', '#5a3a6e', '#1d3f8a'][x % 3], x);
    torch(p, 76, 150);
    torch(p, 172, 150);
    // doors and mirrors
    p.tile('castlewalls', 4, 1, 0, WALL_TOP, 2, 4);
    p.tile('castlewalls', 4, 1, 96, WALL_TOP, 2, 4);
    p.tile('castlewalls', 4, 1, 192, WALL_TOP, 2, 4);
    p.tile('castlewalls', 6, 1, 64, WALL_TOP, 1, 4);
    p.tile('castlewalls', 6, 1, 160, WALL_TOP, 1, 4);
    stoneFloor(p);
    // the runner along the corridor
    p.rect(0, 384, 256, 30, '#a83232');
    p.rect(0, 384, 256, 2, '#d4a73a');
    p.rect(0, 412, 256, 2, '#d4a73a');
    // five boots for St. Nicholas
    ['#8e1b1b', '#1d3f8a', '#1e6b3a', '#e0b320', '#6b4226'].forEach((c, i) => boot(p, 14 + i * 50, 344, c));
  },

  owlery: (p) => {
    p.gradient(0, 512, '#1b2a4e', '#0b1530');
    p.fill('castle_outside', 5, 3, 0, 0, 256, FLOOR, 3, 3);
    p.rect(0, 0, 256, FLOOR, '#0b1530', 0.25);
    // window arches open to the snow
    for (const x of [24, 168]) {
      p.rect(x, 130, 64, 100, '#1b2a4e');
      p.stars(x, 130, x + 64, 230, 12, x);
      p.snow(x, 130, x + 64, 230, 30, x + 1);
      p.rect(x - 4, 126, 72, 4, '#9a96a8');
      p.rect(x - 4, 230, 72, 4, '#9a96a8');
      snowCap(p, x - 4, 234, 72, x);
    }
    // perches with owls
    for (const [y, xs] of [[172, [96, 136]], [262, [10, 70, 150, 210]], [316, [40, 110, 190]]] as const) {
      p.rect(0, y + 28, 256, 4, '#6b4226');
      p.rect(0, y + 28, 256, 1, '#9a6a3c');
      for (const x of xs) p.sprite('sprites/pet_owl.png', x, y);
    }
    p.fill('dirt', 1, 3, 0, FLOOR, 256, 512);
    p.blit('dungeon', 352, 128, 64, 96, 180, 360); // straw
    p.blit('dungeon', 352, 128, 64, 96, 12, 380);
    p.snow(0, 0, 256, 512, 60, 9);
  },

  greenhouse: (p) => {
    // glass walls and roof
    p.gradient(0, FLOOR, '#a9cbe8', '#d8ecf2');
    for (let x = 0; x < 256; x += 32) p.rect(x, 0, 2, FLOOR, '#4f6b3a');
    for (let y = 40; y < FLOOR; y += 48) p.rect(0, y, 256, 2, '#4f6b3a');
    p.snow(0, 0, 256, 120, 50, 3);
    snowCap(p, 0, 42, 256, 4);
    // hanging plants and vines
    const rnd = random(11);
    for (let i = 0; i < 9; i++) {
      const x = 10 + i * 28;
      const len = 30 + rnd() * 60;
      p.line(x, 42, x + 3, 42 + len, '#4f8a3c');
      for (let y = 46; y < 42 + len; y += 6) p.ellipse(x + 2 + (y % 12 ? 2 : -2), y, 2.5, 1.8, '#7ab84a');
    }
    // potting tables with mandrakes along the back
    planks(p, 0, 268, 256, 20, true);
    for (let x = 6; x < 256; x += 36) p.sprite('puzzles/mandrake.png', x, 236, 2);
    // soil beds and a stone path
    p.fill('dirt', 1, 3, 0, FLOOR, 256, 512);
    p.fill('grass', 1, 3, 0, FLOOR, 80, 512);
    p.fill('grass', 1, 3, 176, FLOOR, 256, 512);
    p.fill('castlefloors_outside', 1, 1, 96, FLOOR, 160, 512, 1, 1);
  },

  train: (p) => {
    // compartment: wood panelling, a big window with the snowy night outside
    p.fill('inside', 0, 4, 0, 0, 256, 512);
    p.rect(0, 0, 256, 512, '#3b2414', 0.25);
    p.rect(28, 120, 200, 150, '#1a1423');
    p.gradient(124, 266, '#0b1530', '#2a3a66', 32, 224);
    p.stars(32, 124, 224, 200, 30, 6);
    for (let x = 32; x < 224; x++) {
      const h = 228 + Math.sin(x / 18) * 10 + Math.sin(x / 7) * 4;
      for (let y = Math.floor(h); y < 266; y++) p.dot(x, y, hex(y < h + 3 ? '#f4f8ff' : '#c9d6e8'));
    }
    p.ellipse(188, 150, 9, 9, '#fff8ea');
    p.snow(32, 124, 224, 266, 40, 7);
    p.rect(28, 192, 200, 4, '#5a3a20'); // window bar
    p.rect(126, 120, 4, 150, '#5a3a20');
    // luggage rack with a trunk, seats
    p.rect(20, 92, 216, 4, '#a8802a');
    p.tile('chests', 0, 0, 40, 60, 1, 1);
    p.rect(0, 282, 256, 70, '#8e1b1b');
    p.rect(0, 282, 256, 6, '#a83232');
    for (let x = 0; x < 256; x += 32) p.rect(x, 288, 1, 64, '#6e1414');
    woodFloor(p, 352);
    p.rect(0, 352, 256, 512 - 352, '#1a1423', 0.2);
  },

  robe_shop: (p) => {
    p.gradient(0, 256, '#5a3a20', '#6b4226');
    // shelves with fabric rolls and a day window
    dayWindow(p, 64, 96);
    for (const x of [0, 32, 192, 224]) p.blit('cabinets', 0, 96, 32, 96, x, 160);
    const rolls = ['#8e1b1b', '#1d3f8a', '#1e6b3a', '#e0b320', '#3a3440', '#5a3a6e', '#2b2620', '#c0c8d0'];
    rolls.forEach((c, i) => {
      const x = (i < 4 ? 4 : 196) + (i % 4) * 14;
      p.rect(x, 138, 10, 22, c);
      p.rect(x, 138, 2, 22, '#fff8ea', 0.25);
      p.ellipse(x + 5, 138, 5, 2, hexShade(c, 0.3));
    });
    stoneWall(p, 256, FLOOR);
    woodFloor(p);
    // the counter and a measuring tape
    planks(p, 150, 300, 100, 30);
    p.line(160, 296, 230, 300, '#e0b320');
  },

  common_room: (p) => {
    stoneWall(p, 0);
    fireplace(p, 88, 256);
    nightWindow(p, -72);
    nightWindow(p, 200);
    HOUSES.forEach(([main, trim], i) => p.banner([52, 70, 168, 186][i], 140, 14, 34, main, trim));
    portrait(p, 108, 150, 40, 52, '#5a3a20', 9);
    torch(p, 76, 220);
    torch(p, 176, 220);
    woodFloor(p);
    // rug and armchairs
    p.ellipse(128, 420, 100, 40, '#8e1b1b');
    p.ellipse(128, 420, 90, 34, '#a83232');
    armchair(p, 20, 350, '#6b4226');
    armchair(p, 206, 350, '#6b4226');
    for (const x of [40, 216]) p.candle(x, 250);
  },

  caretaker_office: (p) => {
    stoneWall(p, 0);
    p.rect(0, 0, 256, FLOOR, '#1a1423', 0.3); // a gloomy room
    // filing cabinets, the key board, buckets and mops
    p.blit('cabinets', 0, 96, 32, 96, 4, 236);
    p.blit('cabinets', 0, 96, 32, 96, 36, 236);
    p.rect(150, 200, 90, 80, '#9a6a3c');
    p.rect(150, 200, 90, 2, '#c99a5c');
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      p.rect(166 + c * 26, 212 + r * 22, 2, 4, '#2b2a33');
      if (r * 3 + c < 8) p.rect(162 + c * 26, 218 + r * 22, 10, 3, ['#d4a73a', '#c0c8d0', '#5a5866'][(r + c) % 3]);
    }
    p.rect(98, 140, 40, 30, '#e8d5a6'); // notice
    p.line(102, 148, 132, 148, '#3b2414');
    p.line(102, 156, 126, 156, '#3b2414');
    stoneFloor(p);
    p.tile('buckets', 0, 0, 200, 350, 2, 2);
    planks(p, 70, 360, 110, 36, true);
    p.rect(90, 366, 30, 20, '#3b2414'); // the logbook
    p.rect(92, 368, 26, 16, '#6b4226');
    p.candle(150, 360);
  },

  grounds_snow: (p) => {
    p.gradient(0, 300, '#7a8aa8', '#c9d6e8');
    // the castle on the horizon
    p.tile('castle_outside', 0, 0, -8, 40, 4, 11, { recolor: (c) => c });
    p.tile('castle_outside', 8, 0, 96, 140, 3, 5);
    p.tile('castle_outside', 0, 0, 200, 70, 4, 11);
    snowCap(p, 96, 142, 96, 12);
    p.fill('grass', 1, 3, 0, 290, 256, 512, 1, 1, { recolor: toSnow });
    // frozen lake and snowy pines
    p.ellipse(190, 330, 70, 18, '#a9cbe8');
    p.ellipse(180, 326, 40, 8, '#f4f8ff', 0.6);
    for (const [x, y] of [[-20, 250], [20, 300], [200, 240]]) p.tile('treetop', 0, 3, x, y, 3, 4, { recolor: toSnow });
    p.snow(0, 0, 256, 512, 220, 13);
  },

  forest_edge: (p) => {
    // dusk at the edge of the Forbidden Forest: dark pines behind, a snowy path to a wooden gate
    p.gradient(0, 300, '#1b2a4e', '#5d6f96');
    p.stars(0, 0, 256, 140, 40, 31);
    const rnd = random(32);
    for (let i = 0; i < 14; i++) {
      const x = rnd() * 256;
      const h = 90 + rnd() * 70;
      for (let k = 0; k < h; k++) p.rect(x - k / 4, 300 - h + k, k / 2 + 1, 1, '#16233a'); // pine silhouettes
    }
    p.fill('grass', 1, 3, 0, 292, 256, 512, 1, 1, { recolor: toSnow });
    p.rect(0, 292, 256, 220, '#9aa6c8', 0.25); // blue evening light on the snow
    // the path and the centaurs' gate
    for (let y = 300; y < 512; y++) {
      const w = 20 + (y - 300) * 0.45;
      p.rect(128 - w / 2 + Math.sin(y / 30) * 10, y, w, 1, '#c9d6e8');
    }
    p.rect(104, 250, 6, 60, '#5a3a20');
    p.rect(146, 250, 6, 60, '#5a3a20');
    for (const y of [262, 280]) p.rect(104, y, 48, 5, '#6b4226');
    p.line(108, 284, 148, 262, '#6b4226');
    snowCap(p, 104, 262, 48, 33);
    // big snowy trees left and right, paw prints and cinnamon crumbs on the path
    for (const [x, y] of [[-40, 200], [180, 190], [-10, 300], [210, 310]]) p.tile('treetop', 0, 3, x, y, 3, 4, { recolor: toSnow });
    for (let i = 0; i < 6; i++) {
      const y = 340 + i * 12;
      const x = 120 + Math.sin(y / 30) * 10 + (i % 2 ? 6 : -4);
      p.ellipse(x, y, 2, 1.5, '#7a8aa8');
      if (i % 2) p.dot(x + 9, y + 3, hex('#9a6a3c'));
    }
    p.snow(0, 0, 256, 512, 120, 34);
  },

  archive: (p) => {
    // the archive in the east wing: drawer cabinets to the ceiling, a lectern with the card box
    p.gradient(0, 120, '#2b2a33', '#3b2414');
    p.fill('inside', 0, 4, 0, 100, 256, 304);
    p.rect(0, 100, 256, 204, '#1a1423', 0.45);
    for (let x = 0; x < 256; x += 32) {
      p.blit('cabinets', 0, 96, 32, 96, x, 112);
      p.blit('cabinets', 0, 96, 32, 96, x, 208);
    }
    p.rect(0, 100, 256, 12, '#3b2414');
    p.rect(0, 0, 256, 304, '#1a1423', 0.2);
    // labels on the drawers
    const rnd = random(41);
    for (let i = 0; i < 40; i++) p.rect(Math.floor(rnd() * 8) * 32 + 12, 120 + Math.floor(rnd() * 12) * 15, 8, 3, '#e8d5a6');
    woodFloor(p, 304);
    p.rect(0, 304, 256, 4, '#3b2414');
    // ladder, the lectern with the card box and tea
    p.line(200, 112, 214, 320, '#9a6a3c');
    p.line(212, 112, 226, 320, '#9a6a3c');
    for (let y = 120; y < 320; y += 14) p.line(200 + (y - 112) / 15, y, 212 + (y - 112) / 15, y, '#c99a5c');
    planks(p, 70, 340, 116, 34);
    p.rect(104, 326, 40, 18, '#6b4226'); // the card box
    p.rect(104, 326, 40, 3, '#9a6a3c');
    for (let i = 0; i < 6; i++) p.rect(108 + i * 6, 320 - (i % 3), 4, 8, '#f6ead0');
    p.rect(156, 334, 8, 7, '#e8e4dc'); // tea cup
    p.rect(164, 336, 2, 3, '#e8e4dc');
    p.candle(80, 334);
    // light moths
    const moths = random(42);
    for (let i = 0; i < 18; i++) p.ellipse(moths() * 256, 110 + moths() * 200, 1.5, 1.5, '#fff1c2', 0.8);
  },

  astronomy_tower: (p) => {
    p.gradient(0, 360, '#03060f', '#1b2a4e');
    p.stars(0, 0, 256, 330, 220, 21);
    p.ellipse(60, 120, 16, 16, '#fff8ea');
    p.ellipse(66, 116, 14, 14, '#1b2a4e', 0.9); // crescent moon
    // a faint knight constellation
    const knight = [[150, 120], [140, 140], [160, 140], [132, 162], [170, 162], [140, 196], [160, 196]];
    for (const [x, y] of knight) p.ellipse(x, y, 1.5, 1.5, '#fff1c2');
    // battlements and the tower floor
    p.rect(0, 300, 256, 50, '#7a7788');
    for (let x = 0; x < 256; x += 32) p.rect(x, 284, 18, 18, '#7a7788');
    p.rect(0, 300, 256, 2, '#9a96a8');
    for (let x = 0; x < 256; x += 32) p.rect(x, 284, 18, 2, '#9a96a8');
    snowCap(p, 0, 300, 256, 22);
    stoneFloor(p, 350);
    // telescope on a tripod
    p.line(196, 300, 186, 346, '#3b2414');
    p.line(196, 300, 206, 346, '#3b2414');
    p.line(196, 300, 196, 346, '#3b2414');
    p.line(182, 300, 224, 270, '#a8802a');
    p.line(182, 301, 224, 271, '#d4a73a');
    p.line(182, 302, 224, 272, '#a8802a');
    p.snow(0, 0, 256, 512, 80, 22);
  },
};
