import { expect, test, type Locator, type Page } from '@playwright/test';
import { ADMIN_UID } from '../../src/config';
import { createAccount, listEvents, resetEmulators, waitForEmulators } from './emulator';
import { login, PASSWORD, playPrologue, setDebugDate, tapUntil } from './helpers';

/** Optional: `SHOTS=<dir>` saves a screenshot of every puzzle for review. */
const SHOTS = process.env.SHOTS;

test.beforeEach(async () => {
  await waitForEmulators();
  await resetEmulators();
});

async function openWorkshop(page: Page): Promise<void> {
  await createAccount(ADMIN_UID, 'daniel', PASSWORD);
  await page.goto('./');
  await login(page, 'daniel');
  await page.getByRole('button', { name: 'Verstanden' }).click();
  await page.getByRole('button', { name: 'Truhe' }).click();
  await page.getByRole('button', { name: 'Rätsel', exact: true }).click();
}

async function play(page: Page, title: string): Promise<void> {
  await page.locator('.puzzle-row', { hasText: title }).click();
  await expect(page.getByText('Übung · ohne Punkte')).toBeVisible();
}

async function expectSolved(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Prüfen' }).click();
  await expect(page.locator('.stamp')).toHaveText('Richtig!');
  await expect(page.getByRole('button', { name: 'Nochmal' })).toBeVisible();
  await page.getByRole('button', { name: 'Zur Sammlung' }).click();
  await expect(page.locator('.puzzle-list')).toBeVisible();
}

/** Logical play-area coordinates → page coordinates. */
async function at(board: Locator, x: number, y: number, viewHeight = 256, viewY = 0): Promise<{ x: number; y: number }> {
  const box = (await board.boundingBox())!;
  const scale = box.height / viewHeight;
  return { x: box.x + x * scale, y: box.y + (y - viewY) * scale };
}

test('M4: the workshop lists every puzzle and each engine can be played', async ({ page }) => {
  await openWorkshop(page);
  await expect(page.locator('.puzzle-list')).toContainText('Werkstatt');

  if (SHOTS) {
    const rows = page.locator('.puzzle-row');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toBeVisible();
      const label = (await rows.nth(i).locator('.puzzle-row-number').textContent())!.trim();
      await rows.nth(i).click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${SHOTS}/puzzle-${label}.png` });
      await page.getByRole('button', { name: 'Übung beenden' }).click();
    }
  }

  // toggle: 4 × 5 candles, 11 taps
  await play(page, 'Schwebende Kerzen');
  for (const n of [1, 2, 3, 4, 6, 7, 9, 10, 14, 15, 16]) await page.getByRole('button', { name: `Feld ${n}`, exact: true }).click();
  await expectSolved(page);

  // path: one continuous drag along the stairs, respecting the one-way stairs
  await play(page, 'Die Treppen');
  const nodes: Record<string, [number, number]> = {
    5: [40, 32], 7: [128, 32], 6: [216, 32], 3: [40, 120], A: [128, 120], 4: [216, 120], 2: [72, 216], 1: [184, 216],
  };
  const board = page.locator('.path-board');
  const route = ['1', '4', 'A', '7', '6', '4', '2', 'A', '3', '2', '1', 'A', '5', '7'];
  const first = await at(board, ...nodes[route[0]]);
  await page.mouse.move(first.x, first.y);
  await page.mouse.down();
  for (const id of route.slice(1)) {
    const p = await at(board, ...nodes[id]);
    await page.mouse.move(p.x, p.y, { steps: 6 });
  }
  await page.mouse.up();
  await expectSolved(page);

  // arrange row: drag books onto each other (swap), then tap to swap
  await play(page, 'Das Regal');
  const drag = async (from: string, to: string) => {
    const a = (await page.getByRole('button', { name: from, exact: true }).boundingBox())!;
    const b = (await page.getByRole('button', { name: to, exact: true }).boundingBox())!;
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
    await page.mouse.down();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 });
    await page.mouse.up();
  };
  await drag('PENDEL', 'FEDER'); // feder anker stunde zeit pendel rad
  await drag('ANKER', 'ZEIT'); // feder zeit stunde anker pendel rad
  const swapByTap = async (a: string, b: string) => {
    await page.getByRole('button', { name: a, exact: true }).click();
    await page.getByRole('button', { name: b, exact: true }).click();
  };
  await swapByTap('STUNDE', 'RAD'); // feder zeit rad anker pendel stunde
  await swapByTap('PENDEL', 'STUNDE'); // feder zeit rad anker stunde pendel
  await expectSolved(page);

  // custom pour: 13 moves, always round the circle big → middle → small → big
  await play(page, 'Drei Flaschen');
  const bottle = (i: number) => page.locator('.bottle-btn').nth(i);
  for (const [a, b] of [[0, 1], [1, 2], [2, 0], [1, 2], [0, 1], [1, 2], [2, 0], [1, 2], [2, 0], [1, 2], [0, 1], [1, 2], [2, 0]]) {
    await bottle(a).click();
    await bottle(b).click();
  }
  await expect(page.locator('.engine-status')).toContainText('Züge: 13');
  await expectSolved(page);

  // arrange grid with one kind: tap a cell to place a pot
  await play(page, 'Alraunen');
  for (const cell of ['1-6', '2-3', '3-5', '4-1', '5-4', '6-2']) await page.getByLabel(`Feld ${cell}`).click();
  await expect(page.locator('.engine-status')).toContainText('noch 0');
  await expectSolved(page);

  // choice with the gear picture
  await play(page, 'Zahnräder');
  await expect(page.locator('.choice-figure')).toBeVisible();
  await page.getByRole('button', { name: /Gegen den Uhrzeigersinn/ }).click();
  await expectSolved(page);

  // Roman sticks: take the upright stick of the plus and add it to the II
  await play(page, 'Römische Stäbe');
  const sticks = page.locator('.sticks-board');
  const plus = await at(sticks, 84, 120, 180, 40);
  await page.mouse.click(plus.x, plus.y);
  await expect(page.locator('.engine-status')).toContainText('Wohin damit?');
  const place = await at(sticks, 106, 104, 180, 40);
  await page.mouse.click(place.x, place.y);
  await expectSolved(page);

  // slide: a tile next to the gap moves, a wrong check stamps "Leider falsch"
  await play(page, 'Die Tür, die erscheint');
  const tile = page.getByRole('button', { name: 'Teil 3', exact: true });
  const before = await tile.boundingBox();
  await tile.click();
  await expect.poll(async () => (await tile.boundingBox())!.y).not.toBe(before!.y);
  await page.getByRole('button', { name: 'Prüfen' }).click();
  await expect(page.locator('.stamp')).toHaveText('Leider falsch');
  // practice hints are free and open in order
  await page.getByRole('button', { name: 'Hinweis', exact: true }).click();
  await page.getByRole('button', { name: 'Hinweis 1 öffnen' }).click();
  await expect(page.locator('.hint-open')).toContainText('obere Reihe');
});

test('M4: after 3 wrong attempts Quill offers help; accepting solves for 25 % [PZL-5]', async ({ page }) => {
  await createAccount(ADMIN_UID, 'daniel', PASSWORD);
  await page.goto('./');
  await login(page, 'daniel');
  await page.getByRole('button', { name: 'Verstanden' }).click();
  await setDebugDate(page, '2026-12-01T10:00');
  await playPrologue(page, { house: 'ravenclaw' });

  await page.locator('.door-available', { hasText: '1' }).click();
  await page.getByText('Tippen zum Beginnen').click();
  for (const label of ['Erzähl mir alle sieben!', 'Ich passe auf Ellis auf.']) {
    await tapUntil(page, page.getByRole('button', { name: label }));
    await page.getByRole('button', { name: label }).click();
  }
  await tapUntil(page, page.getByText('Rätsel 01'));
  await page.locator('.puzzle-intro').click();

  for (const guess of ['5', '7', '9']) {
    await expect(page.locator('.stamp')).toHaveCount(0);
    await page.getByRole('button', { name: guess, exact: true }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await expect(page.locator('.stamp')).toHaveText('Leider falsch');
  }
  const offer = page.getByText('Sollen wir es gemeinsam durchgehen?');
  await expect(offer).toBeVisible();
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/help-offer.png` });

  // Declining hides the offer (it returns after 2 minutes, see the unit test)
  await page.getByRole('button', { name: 'Noch nicht' }).click();
  await expect(offer).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('Rätsel 01')).toBeVisible();
  await expect(offer).toHaveCount(0);

  // Notes layer: draw a stroke, then switch it off again
  await page.getByRole('button', { name: 'Notiz' }).click();
  const area = (await page.locator('.puzzle-area').boundingBox())!;
  await page.mouse.move(area.x + 40, area.y + 40);
  await page.mouse.down();
  await page.mouse.move(area.x + 120, area.y + 80, { steps: 5 });
  await page.mouse.up();
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/notes.png` });
  await page.getByRole('button', { name: 'Notiz' }).click();

  // A fourth wrong attempt does not bring the offer back before 2 minutes are over
  await page.getByRole('button', { name: '3', exact: true }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.locator('.stamp')).toHaveCount(0, { timeout: 3000 });
  await expect(offer).toHaveCount(0);

  // Debug clock 2 minutes ahead → offer again; accept
  await setDebugDate(page, '2026-12-01T10:30');
  await page.reload();
  await expect(offer).toBeVisible();
  await page.getByRole('button', { name: 'Ja, gern' }).click();
  await expect(page.getByText('+5 Hauspunkte')).toBeVisible(); // 25 % of 20
  await expect(page.getByText('Gemeinsam mit Prof. Quill gelöst.')).toBeVisible();

  await expect
    .poll(async () => JSON.stringify((await listEvents()).filter((e) => e.type === 'puzzle_solved').map((e) => e.data)))
    .toContain('"help"');
});
