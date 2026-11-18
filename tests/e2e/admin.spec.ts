import { devices, expect, test } from '@playwright/test';
import { ADMIN_UID } from '../../src/config';
import { createAccount, resetEmulators, waitForEmulators } from './emulator';
import { login, PASSWORD } from './helpers';

test.beforeEach(async () => {
  await waitForEmulators();
  await resetEmulators();
});

test('M3: admin invites a player, the player logs in, the feed shows it live [ADM-6] [AUTH-5]', async ({ page, browser, baseURL }) => {
  await createAccount(ADMIN_UID, 'daniel', PASSWORD);
  await page.goto('./');
  await login(page, 'daniel');
  await page.getByRole('button', { name: 'Verstanden' }).click();
  await page.goto('./#/admin');
  await expect(page.getByText('Büro der Schulleitung')).toBeVisible();

  // Invite
  await page.getByRole('link', { name: 'Mehr' }).click();
  await page.getByRole('link', { name: /Spieler verwalten/ }).click();
  await page.getByRole('button', { name: 'Neuen Spieler einladen' }).click();
  await page.getByLabel('Anzeigename').fill('Lena Müller');
  await expect(page.getByLabel('Eulenname')).toHaveValue('lena-mueller');
  await page.getByLabel('Eulenname').fill('lena');
  await page.getByRole('button', { name: 'Einladen' }).click();
  const password = (await page.getByTestId('new-password').textContent())!.trim();
  expect(password).toMatch(/^[a-z]+-[a-z]+-[a-z]+-\d{2}$/); // [AUTH-6]
  await expect(page.getByAltText('Einladungsbild')).toBeVisible(); // [AUTH-7]
  await page.getByRole('button', { name: 'Fertig' }).click();
  await expect(page.getByText('@lena')).toBeVisible();

  // The admin is still signed in after provisioning (second app instance)
  await page.getByRole('link', { name: 'Eulenpost' }).click();
  await expect(page.getByRole('heading', { name: 'Eulenpost' })).toBeVisible();

  // The new player logs in on another "phone"
  const player = await browser.newContext({ ...devices['iPhone 13'], baseURL });
  const phone = await player.newPage();
  await phone.goto('./?u=lena');
  await expect(phone.getByLabel('Eulenname')).toHaveValue('lena');
  await phone.getByLabel('Zauberwort').fill(password);
  await phone.getByRole('button', { name: 'Eintreten' }).click();
  await expect(phone.getByRole('button', { name: 'Verstanden' })).toBeVisible();

  // [ADM-12] live feed without reloading
  await expect(page.getByText(/Lena Müller hat das Spiel geöffnet/)).toBeVisible({ timeout: 15_000 });

  // Overview card
  await page.getByRole('link', { name: 'Übersicht' }).click();
  await expect(page.locator('.player-card', { hasText: 'Lena Müller' })).toContainText('noch nicht gestartet');

  // [ADM-7] deactivate → the player sees the pause message
  await page.getByRole('link', { name: 'Mehr' }).click();
  await page.getByRole('link', { name: /Spieler verwalten/ }).click();
  await page.locator('.user-row', { hasText: '@lena' }).locator('.user-summary').click();
  await page.getByRole('button', { name: 'Deaktivieren' }).click();
  await expect(page.locator('.user-row', { hasText: '@lena' })).toContainText('pausiert');
  await phone.reload();
  await expect(phone.getByText('Deine Eule macht gerade Pause.', { exact: false })).toBeVisible();

  // [ADM-8] reset requires typing the display name; runId + 1
  const row = page.locator('.user-row', { hasText: '@lena' });
  const resetButton = row.getByRole('button', { name: 'Zurücksetzen' });
  await expect(resetButton).toBeDisabled();
  await row.locator('.danger-zone input').fill('Lena Müller');
  await resetButton.click();
  await expect(row).toContainText('Durchlauf 2');

  await player.close();
});

test('non-admins are sent from #/admin back to the game [ADM-1]', async ({ page }) => {
  await createAccount(ADMIN_UID, 'daniel', PASSWORD);
  await page.goto('./');
  await login(page, 'daniel');
  await page.getByRole('button', { name: 'Verstanden' }).click();
  // Use the console to create a player, then log in as that player
  await page.goto('./#/admin/users');
  await page.getByRole('button', { name: 'Neuen Spieler einladen' }).click();
  await page.getByLabel('Anzeigename').fill('Papa');
  await page.getByRole('button', { name: 'Einladen' }).click();
  const password = (await page.getByTestId('new-password').textContent())!.trim();

  const ctx = await page.context().browser()!.newContext({ ...devices['iPhone 13'], baseURL: page.url().split('#')[0] });
  const phone = await ctx.newPage();
  await phone.goto('./#/admin');
  await phone.getByLabel('Eulenname').fill('papa');
  await phone.getByLabel('Zauberwort').fill(password);
  await phone.getByRole('button', { name: 'Eintreten' }).click();
  await expect(phone.getByRole('button', { name: 'Verstanden' })).toBeVisible();
  await expect(phone.getByText('Büro der Schulleitung')).toHaveCount(0);
  expect(phone.url()).not.toContain('#/admin');
  await ctx.close();
});
