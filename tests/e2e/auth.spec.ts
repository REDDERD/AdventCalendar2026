import { expect, test } from '@playwright/test';
import { createAccount, resetEmulators, setDocument, waitForEmulators } from './emulator';
import { login, PASSWORD } from './helpers';

test.beforeEach(async () => {
  await waitForEmulators();
  await resetEmulators();
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

test('a link with a wrong Zauberwort ends on the login screen with a notice', async ({ page }) => {
  await createAccount('player-lena', 'lena', PASSWORD);
  await page.goto('./?u=lena#z=falsch-falsch-falsch-11');
  await expect(page.getByLabel('Eulenname')).toHaveValue('lena');
  await expect(page.locator('.login .error')).toContainText(/Zauberwort|Eulenname/);
  expect(page.url()).not.toContain('#z=');
});
