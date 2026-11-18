import { expect, test } from '@playwright/test';
import { ADMIN_UID } from '../../src/config';
import { createAccount, listEvents, resetEmulators, waitForEmulators } from './emulator';
import { login, PASSWORD, playPrologue, setDebugDate, tapUntil } from './helpers';

test.beforeEach(async () => {
  await waitForEmulators();
  await resetEmulators();
});

test('day 3: clue k02, the portrait tip, one-way stairs and the locked door', async ({ page }) => {
  await createAccount(ADMIN_UID, 'daniel', PASSWORD);
  await page.goto('./');
  await login(page, 'daniel');
  await page.getByRole('button', { name: 'Verstanden' }).click();
  await setDebugDate(page, '2026-12-03T10:00');
  await playPrologue(page, { house: 'ravenclaw' });

  // [DAY-7] admin jump to day 3
  await page.getByRole('button', { name: 'Truhe' }).click();
  await page.getByRole('button', { name: 'Optionen' }).click();
  await page.locator('select').selectOption('3');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByText('Tippen zum Beginnen').click();

  for (const label of ['Die Kälte genau untersuchen.', 'Das Bild nach dem Weg fragen.']) {
    await tapUntil(page, page.getByRole('button', { name: label }));
    await page.getByRole('button', { name: label }).click();
  }
  await expect(page.getByText('Vom Zweiten in den Ersten', { exact: false })).toBeVisible();

  await tapUntil(page, page.getByText('Rätsel 03'));
  await page.locator('.puzzle-intro').click();
  const nodes: Record<string, [number, number]> = {
    5: [40, 32], 7: [128, 32], 6: [216, 32], 3: [40, 120], A: [128, 120], 4: [216, 120], 2: [72, 216], 1: [184, 216],
  };
  const board = page.locator('.path-board');
  const box = (await board.boundingBox())!;
  const at = (id: string) => ({ x: box.x + (nodes[id][0] * box.width) / 256, y: box.y + (nodes[id][1] * box.height) / 256 });
  const solution = ['1', '4', 'A', '7', '6', '4', '2', 'A', '3', '2', '1', 'A', '5', '7'];
  await page.mouse.move(at(solution[0]).x, at(solution[0]).y);
  await page.mouse.down();
  for (const id of solution.slice(1)) await page.mouse.move(at(id).x, at(id).y, { steps: 6 });
  await page.mouse.up();
  await page.getByRole('button', { name: 'Prüfen' }).click();
  await expect(page.getByText('+30 Hauspunkte')).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();

  await tapUntil(page, page.getByText('Auch für Sie, Henrietta.', { exact: false }));
  await tapUntil(page, page.getByText('Kapitel 3 geschafft!'));
  await expect(page.getByText('Türchen 3: Die Treppen schaukeln', { exact: false })).toBeVisible();
  await expect(page.getByText('Neuer Hinweis: Eiskalte Stelle vor der Uhr')).toBeVisible();

  await expect
    .poll(async () => JSON.stringify((await listEvents()).filter((e) => e.type === 'choice').map((e) => e.data)), { timeout: 10_000 })
    .toContain('d03.portrait');
  expect(JSON.stringify(await listEvents())).toContain('k02');
});
