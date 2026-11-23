import { expect, test } from '@playwright/test';
import { ADMIN_UID } from '../../src/config';
import { createAccount, getDocument, resetEmulators, setDocument, waitForEmulators } from './emulator';
import { login, PASSWORD, playPrologue, setDebugDate } from './helpers';

test.beforeEach(async () => {
  await waitForEmulators();
  await resetEmulators();
});

test('Rangliste: a real player writes the own line, house points update it', async ({ page }) => {
  await createAccount('player-lena', 'lena', PASSWORD);
  await setDocument('users/player-lena', {
    uid: 'player-lena', username: 'lena', displayName: 'Lena', role: 'player',
    active: true, isTest: false, runId: 1, createdAt: 0, lastSeenAt: null,
  });
  await page.goto('./');
  await login(page, 'lena');
  await expect.poll(() => page.evaluate(async () => {
    const url = '/AdventCalendar2026/src/core/store.ts';
    const { store } = await import(/* @vite-ignore */ url);
    return store.getState().save !== null;
  })).toBe(true);
  expect(await getDocument('leaderboard/player-lena')).toBeNull(); // no line before the sorting

  // The vite dev server serves the very module instance the app runs on.
  await page.evaluate(async () => {
    const url = '/AdventCalendar2026/src/core/store.ts';
    const { store } = await import(/* @vite-ignore */ url);
    store.getState().updateSave((s: { profile: unknown; housePoints: number }) => {
      s.profile = { name: 'Lena Funkel', house: 'ravenclaw' };
      s.housePoints = 40;
    });
  });
  await expect.poll(() => getDocument('leaderboard/player-lena')).toMatchObject({ name: 'Lena Funkel', house: 'ravenclaw', points: 40 });

  await page.evaluate(async () => {
    const url = '/AdventCalendar2026/src/core/store.ts';
    const { store } = await import(/* @vite-ignore */ url);
    store.getState().updateSave((s: { housePoints: number }) => {
      s.housePoints += 35;
    });
  });
  await expect.poll(() => getDocument('leaderboard/player-lena')).toMatchObject({ points: 75 });
});

test('Rangliste: players and houses in the trunk; the admin test account is not listed', async ({ page }) => {
  await createAccount(ADMIN_UID, 'daniel', PASSWORD);
  const lines: Array<[string, string, string, number]> = [
    ['p1', 'Ronja', 'ravenclaw', 140],
    ['p2', 'Mats', 'ravenclaw', 60],
    ['p3', 'Ida', 'gryffindor', 120],
    ['p4', 'Ole', 'hufflepuff', 60],
  ];
  for (const [uid, name, house, points] of lines) await setDocument(`leaderboard/${uid}`, { name, house, points });

  await page.goto('./');
  await login(page, 'daniel');
  await page.getByRole('button', { name: 'Verstanden' }).click();
  await setDebugDate(page, '2026-12-01T10:00');
  await playPrologue(page, { house: 'hufflepuff' });
  await page.getByRole('button', { name: 'Truhe' }).click();
  await page.getByRole('button', { name: 'Rangliste' }).click();

  await expect(page.getByText('Testkonten stehen nicht in der Rangliste.')).toBeVisible();
  const rows = page.locator('.rank-row');
  await expect(rows).toHaveCount(4);
  await expect(rows.nth(0)).toContainText('1.Ronja');
  await expect(rows.nth(1)).toContainText('2.Ida');
  await expect(rows.nth(2)).toContainText('3.Mats'); // Mats and Ole share third place
  await expect(rows.nth(3)).toContainText('3.Ole');
  await expect(page.locator('.rank-row.me')).toHaveCount(0);
  await expect(page.locator('.placeholder')).toHaveCount(0);

  await page.getByRole('button', { name: 'Häuser' }).click();
  const houses = page.locator('.rank-houses .cup-row');
  await expect(houses).toHaveCount(4);
  await expect(houses.nth(0)).toContainText('Gryffindor · 120');
  await expect(houses.nth(1)).toContainText('Ravenclaw · 100');
  await expect(houses.nth(1)).toContainText('2 Sp.');
  await expect(houses.nth(2)).toContainText('Hufflepuff · 60');
  await expect(houses.nth(3)).toContainText('Slytherin · noch niemand');
});
