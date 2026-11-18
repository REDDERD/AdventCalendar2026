import { expect, test, type Page } from '@playwright/test';
import { ADMIN_UID } from '../../src/config';
import { createAccount, listEvents, resetEmulators, setDocument, waitForEmulators } from './emulator';

const PASSWORD = 'zimt-eule-lumos-47';

async function login(page: Page, username: string): Promise<void> {
  await page.getByLabel('Eulenname').fill(username);
  await page.getByLabel('Zauberwort').fill(PASSWORD);
  await page.getByRole('button', { name: 'Eintreten' }).click();
}

/** Tap the dialogue until `target` is visible. */
async function tapUntil(page: Page, target: ReturnType<Page['locator']>, maxTaps = 40): Promise<void> {
  for (let i = 0; i < maxTaps; i++) {
    if (await target.isVisible()) return;
    const dialogue = page.locator('.dialogue');
    if (await dialogue.isVisible()) await dialogue.click();
    await page.waitForTimeout(80);
  }
  await expect(target).toBeVisible();
}

test.beforeEach(async () => {
  await waitForEmulators();
  await resetEmulators();
});

test('M1: admin plays day 1 with choice and puzzle, reload resumes exactly, events are logged', async ({ page }) => {
  await createAccount(ADMIN_UID, 'daniel', PASSWORD);

  await page.goto('./');
  await login(page, 'daniel');

  // [AUTH-10] onboarding once, then the prologue placeholder
  await page.getByRole('button', { name: 'Verstanden' }).click();
  await page.getByRole('button', { name: 'Hufflepuff' }).click();

  // [DAY-7] debug date + instant text via the trunk
  await page.getByRole('button', { name: 'Truhe' }).click();
  await page.getByRole('button', { name: 'Optionen' }).click();
  await page.getByRole('button', { name: 'Sofort' }).click();
  await page.locator('input[type="datetime-local"]').fill('2026-12-01T10:00');
  await page.getByRole('button', { name: 'Setzen', exact: true }).click();
  await page.getByRole('button', { name: '✕' }).click();

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
  await page.getByRole('button', { name: '1', exact: true }).click();
  await page.getByRole('button', { name: '2', exact: true }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('Leider falsch')).toBeVisible();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: '1', exact: true }).click();
  await page.getByRole('button', { name: '1', exact: true }).click();
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
      'session_start', 'day_start', 'choice', 'puzzle_start', 'puzzle_attempt', 'puzzle_solved', 'day_complete',
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
  for (const tab of ['Tagebuch', 'Inventar', 'Hinweise', 'Steckbrief', 'Optionen']) {
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
