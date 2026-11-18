import { expect, test } from '@playwright/test';
import { ADMIN_UID } from '../../src/config';
import { createAccount, listEvents, resetEmulators, setDocument, waitForEmulators } from './emulator';
import { login, PASSWORD, playPrologue, setDebugDate, tapUntil } from './helpers';

test.beforeEach(async () => {
  await waitForEmulators();
  await resetEmulators();
});

test('M1: admin plays day 1 with choice and puzzle, reload resumes exactly, events are logged', async ({ page }) => {
  await createAccount(ADMIN_UID, 'daniel', PASSWORD);

  await page.goto('./');
  await login(page, 'daniel');

  // [AUTH-10] onboarding once; [DAY-7] debug date; then the prologue (M2)
  await page.getByRole('button', { name: 'Verstanden' }).click();
  await setDebugDate(page, '2026-12-01T10:00');
  await playPrologue(page, { house: 'hufflepuff' });

  await expect(page.getByText('Ein Kapitel wartet auf dich')).toBeVisible();
  await page.locator('.door-available', { hasText: '1' }).click();
  await expect(page.getByText('Kapitel 1')).toBeVisible();
  await page.getByText('Tippen zum Beginnen').click();

  await tapUntil(page, page.getByRole('button', { name: 'Erzähl mir alle sieben!' }));
  await page.getByRole('button', { name: 'Erzähl mir alle sieben!' }).click();
  const line = page.getByText('Wirklich? Endlich hört mir jemand zu!', { exact: false });
  await expect(line).toBeVisible();

  // [DAY-4] reload mid-scene resumes on the same line
  await page.waitForTimeout(700); // debounced save
  await page.reload();
  await expect(line).toBeVisible();

  await tapUntil(page, page.getByRole('button', { name: 'Ich passe auf Ellis auf.' }));
  await page.getByRole('button', { name: 'Ich passe auf Ellis auf.' }).click();
  await tapUntil(page, page.getByText('Rätsel 01'));
  await page.locator('.puzzle-intro').click();
  await page.getByRole('button', { name: '2', exact: true }).click();
  await page.getByRole('button', { name: '4', exact: true }).click(); // the trap: 24
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('Leider falsch')).toBeVisible();
  await page.waitForTimeout(1000);
  // [PZL-4] hint 1 costs one spark (3 → 2) and does not lower the points
  await page.getByRole('button', { name: 'Hinweis', exact: true }).click();
  await page.getByRole('button', { name: 'Hinweis 1 öffnen · 1 Funke' }).click();
  await expect(page.locator('.hint-open')).toContainText('Es sind nicht 24');
  await expect(page.getByLabel('Zauberfunken')).toHaveText('2');
  await page.getByRole('button', { name: 'Hinweise schließen' }).click();
  await page.getByRole('button', { name: '2', exact: true }).click();
  await page.getByRole('button', { name: '2', exact: true }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('+16 Hauspunkte')).toBeVisible(); // 80 % of 20 in the 2nd attempt
  await page.getByRole('button', { name: 'Weiter' }).click();

  // not first try → Ellis' first-try line must not appear
  await tapUntil(page, page.getByText('Kapitel 1 geschafft!'));
  await page.getByRole('button', { name: 'Zum Kalender' }).click();
  await expect(page.locator('.door-done', { hasText: '1' })).toBeVisible();

  // Events reach Firestore [EVT-1]
  await expect
    .poll(async () => (await listEvents()).map((e) => e.type), { timeout: 10_000 })
    .toEqual(expect.arrayContaining([
      'session_start', 'day_start', 'choice', 'puzzle_start', 'puzzle_attempt', 'puzzle_hint', 'puzzle_solved', 'day_complete',
    ]));
  const events = await listEvents();
  const choices = JSON.stringify(events.filter((e) => e.type === 'choice').map((e) => e.data));
  expect(choices).toContain('d01.ellis');
  expect(choices).toContain('d01.secret');
  expect(events.filter((e) => e.type === 'puzzle_attempt')).toHaveLength(2);

  // Regression: every trunk tab works after a completed day
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.getByRole('button', { name: 'Truhe' }).click();
  for (const tab of ['Tagebuch', 'Rätsel', 'Inventar', 'Hinweise', 'Steckbrief', 'Optionen']) {
    await page.getByRole('button', { name: tab }).click();
    await expect(page.locator('.trunk')).toBeVisible();
  }
  await expect(page.locator('.trunk-body')).toContainText('Text-Tempo');
  await page.getByRole('button', { name: '✕' }).click();
  await expect(page.locator('.door-done', { hasText: '1' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('a deactivated player sees the pause message [AUTH-9]', async ({ page }) => {
  await createAccount('player-paused', 'oma', PASSWORD);
  await setDocument('users/player-paused', {
    uid: 'player-paused', username: 'oma', displayName: 'Oma', role: 'player',
    active: false, isTest: false, runId: 1, createdAt: 0, lastSeenAt: null,
  });
  await page.goto('./?u=oma');
  await expect(page.getByLabel('Eulenname')).toHaveValue('oma'); // [AUTH-8] ?u= prefill
  await page.getByLabel('Zauberwort').fill(PASSWORD);
  await page.getByRole('button', { name: 'Eintreten' }).click();
  await expect(page.getByText('Deine Eule macht gerade Pause.', { exact: false })).toBeVisible();
});

test('an account without users document gets no access [AUTH-3]', async ({ page }) => {
  await createAccount('stranger', 'fremd', PASSWORD);
  await page.goto('./');
  await login(page, 'fremd');
  await expect(page.getByText('Diese Eule kenne ich nicht.')).toBeVisible();
});
