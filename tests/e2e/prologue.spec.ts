import { expect, test } from '@playwright/test';
import { ADMIN_UID } from '../../src/config';
import { createAccount, listEvents, resetEmulators, waitForEmulators } from './emulator';
import { login, playPrologue, setDebugDate } from './helpers';

test.beforeEach(async () => {
  await waitForEmulators();
  await resetEmulators();
});

test('M2: prologue from letter to house, resumable, all events logged [HAT-3]', async ({ page }) => {
  await createAccount(ADMIN_UID, 'daniel', 'zimt-eule-lumos-47');
  await page.goto('./');
  await login(page, 'daniel');
  await page.getByRole('button', { name: 'Verstanden' }).click();

  // Before the unlock the calendar only shows a countdown [RB-6]
  await setDebugDate(page, '2026-11-30T17:59');
  await expect(page.getByText('Der Prolog beginnt am 30. November um 18 Uhr.', { exact: false })).toBeVisible();
  await setDebugDate(page, '2026-11-30T18:00');

  const started = Date.now();
  await playPrologue(page, { house: 'ravenclaw', reloadAfterMirror: true });
  const seconds = (Date.now() - started) / 1000;
  expect(seconds).toBeLessThan(240); // automated run; a human needs ≤ 4 min

  await expect(page.getByText('Dein Brief ist angekommen!')).toHaveCount(0);
  await page.getByRole('button', { name: 'Truhe' }).click();
  await page.getByRole('button', { name: 'Steckbrief' }).click();
  await expect(page.locator('.profile')).toContainText('Lena');
  await expect(page.locator('.profile')).toContainText('Ravenclaw');
  await expect(page.locator('.profile')).toContainText('Phönixfeder');
  await expect(page.locator('.profile')).toContainText('Katze');

  await expect
    .poll(async () => (await listEvents()).filter((e) => e.day === 0).map((e) => e.type).sort(), { timeout: 10_000 })
    .toEqual(
      [
        'day_start',
        ...Array(5).fill('prologue_value'),
        'choice',
        ...Array(5).fill('sorting_answer'),
        'sorting_result',
        'day_complete',
      ].sort(),
    );
  const events = await listEvents();
  const fields = events.filter((e) => e.type === 'prologue_value').map((e) => JSON.stringify(e.data));
  for (const field of ['name', 'pronoun', 'look', 'wand', 'pet']) {
    expect(fields.some((f) => f.includes(`"stringValue":"${field}"`))).toBe(true);
  }
  const result = JSON.stringify(events.find((e) => e.type === 'sorting_result')!.data);
  expect(result).toContain('ravenclaw');
});
