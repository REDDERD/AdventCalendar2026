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
    for (let i = 0; i < (await rows.count()); i++) {
      const label = (await rows.nth(i).locator('.puzzle-row-number').textContent())!.trim();
      await rows.nth(i).click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${SHOTS}/puzzle-${label}.png` });
      await page.getByRole('button', { name: 'Übung beenden' }).click();
    }
  }

  // toggle: corners and centre
  await play(page, 'Schwebende Kerzen');
  for (const n of [1, 3, 5, 7, 9]) await page.getByRole('button', { name: `Feld ${n}`, exact: true }).click();
  await expectSolved(page);

  // path: one continuous drag along the stairs
  await play(page, 'Die Treppen');
  const nodes: Record<string, [number, number]> = {
    1: [40, 220], 2: [216, 220], 3: [128, 80], 4: [128, 176], 5: [80, 128], 6: [176, 128], 7: [40, 36],
  };
  const board = page.locator('.path-board');
  const route = ['1', '5', '3', '6', '5', '4', '6', '2', '1', '7'];
  const first = await at(board, ...nodes[route[0]]);
  await page.mouse.move(first.x, first.y);
  await page.mouse.down();
  for (const id of route.slice(1)) {
    const p = await at(board, ...nodes[id]);
    await page.mouse.move(p.x, p.y, { steps: 6 });
  }
  await page.mouse.up();
  await expectSolved(page);

  // arrange row: drag books onto each other (swap)
  await play(page, 'Das Regal');
  const drag = async (from: string, to: string) => {
    const a = (await page.getByRole('button', { name: from, exact: true }).boundingBox())!;
    const b = (await page.getByRole('button', { name: to, exact: true }).boundingBox())!;
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
    await page.mouse.down();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 });
    await page.mouse.up();
  };
  await drag('PENDEL', 'ZEIT'); // zeit stunde rad feder pendel
  await drag('ZEIT', 'FEDER'); // feder stunde rad zeit pendel
  // tap-to-swap works as well
  await page.getByRole('button', { name: 'STUNDE', exact: true }).click();
  await page.getByRole('button', { name: 'ZEIT', exact: true }).click(); // feder zeit rad stunde pendel
  await expectSolved(page);

  // custom pour: 7 moves
  await play(page, 'Drei Flaschen');
  const bottle = (i: number) => page.locator('.bottle-btn').nth(i);
  for (const [a, b] of [[0, 1], [1, 2], [2, 0], [1, 2], [0, 1], [1, 2], [2, 0]]) {
    await bottle(a).click();
    await bottle(b).click();
  }
  await expect(page.locator('.engine-status')).toContainText('Züge: 7');
  await expectSolved(page);

  // arrange grid: tap a pot, then a cell
  await play(page, 'Alraunen');
  for (const cell of ['2-4', '3-1', '4-3']) {
    await page.locator('.grid-tray .grid-piece').first().click();
    await page.getByLabel(`Feld ${cell}`).click();
  }
  await expectSolved(page);

  // tap: mark the greenhouse
  await play(page, 'Spuren im Schnee');
  const picture = page.locator('.tap-picture');
  const greenhouse = await at(picture, 222, 205, 232);
  await page.mouse.click(greenhouse.x, greenhouse.y);
  await expect(page.locator('.tap-mark')).toHaveCount(1);
  await expectSolved(page);

  // choice
  await play(page, 'Zahnräder');
  await page.getByRole('button', { name: /der Ring klemmt/ }).click();
  await expectSolved(page);

  // sticks: move the right I behind the V
  await play(page, 'Römische Stäbe');
  await page.getByRole('button', { name: 'Stab r1' }).click({ force: true });
  await page.getByRole('button', { name: 'Stab r2' }).click({ force: true });
  await expectSolved(page);

  // slide: a tile next to the gap moves, a wrong check stamps "Leider falsch"
  await play(page, 'Die Tür, die erscheint');
  const tile = page.getByRole('button', { name: 'Teil 1', exact: true });
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
