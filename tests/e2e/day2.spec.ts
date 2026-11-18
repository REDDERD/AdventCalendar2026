import { expect, test } from '@playwright/test';
import { ADMIN_UID } from '../../src/config';
import { createAccount, listEvents, resetEmulators, waitForEmulators } from './emulator';
import { login, PASSWORD, playPrologue, setDebugDate, tapUntil } from './helpers';

test.beforeEach(async () => {
  await waitForEmulators();
  await resetEmulators();
});

test('day 2: both choices, clue k01, the candles and the door magic', async ({ page }) => {
  await createAccount(ADMIN_UID, 'daniel', PASSWORD);
  await page.goto('./');
  await login(page, 'daniel');
  await page.getByRole('button', { name: 'Verstanden' }).click();
  await setDebugDate(page, '2026-12-02T10:00');
  await playPrologue(page, { house: 'gryffindor' });

  // [DAY-7] admin jump to day 2
  await page.getByRole('button', { name: 'Truhe' }).click();
  await page.getByRole('button', { name: 'Optionen' }).click();
  await page.locator('select').selectOption('2');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.getByText('Kapitel 2')).toBeVisible();
  await page.getByText('Tippen zum Beginnen').click();

  for (const label of ['Wir passen auf, versprochen.', 'Mit Peeves Kerzen auspusten.']) {
    await tapUntil(page, page.getByRole('button', { name: label }));
    await page.getByRole('button', { name: label }).click();
  }
  await expect(page.getByText('Endlich! Jemand mit Humor!', { exact: false })).toBeVisible();

  await tapUntil(page, page.getByText('Rätsel 02'));
  await page.locator('.puzzle-intro').click();
  for (const n of [1, 2, 3, 4, 6, 7, 9, 10, 14, 15, 16]) await page.getByRole('button', { name: `Feld ${n}`, exact: true }).click();
  await page.getByRole('button', { name: 'Prüfen' }).click();
  await expect(page.getByText('+20 Hauspunkte')).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();

  // first try → Quill remembers the name
  await tapUntil(page, page.getByText('Ich merke mir Ihren Namen, Lena.', { exact: false }));
  await tapUntil(page, page.getByText('Kapitel 2 geschafft!'));
  await expect(page.getByText('Türchen 2: Zimtsterne', { exact: false })).toBeVisible();
  await expect(page.getByText('Neuer Hinweis: Kratzspuren am Uhrkasten')).toBeVisible();

  await expect
    .poll(async () => JSON.stringify((await listEvents()).filter((e) => e.type === 'choice').map((e) => e.data)), { timeout: 10_000 })
    .toContain('d02.peeves');
  const events = JSON.stringify(await listEvents());
  expect(events).toContain('d02.grimsby');
  expect(events).toContain('k01');
});
