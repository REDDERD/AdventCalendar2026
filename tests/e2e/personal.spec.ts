import { expect, test } from '@playwright/test';
import { ADMIN_UID } from '../../src/config';
import { createAccount, resetEmulators, waitForEmulators } from './emulator';
import { choose, PASSWORD, startDayAsAdmin, tapUntil } from './helpers';

test.beforeEach(async () => {
  await waitForEmulators();
  await resetEmulators();
  await createAccount(ADMIN_UID, 'daniel', PASSWORD);
});

test('M5: personal content from the console appears in the game (Section 12)', async ({ page }) => {
  await startDayAsAdmin(page, 5, async () => {
    await page.goto('./#/admin/personal');
    await page.locator('.personal-pick').first().click();
    await page.getByLabel('Duft 1').fill('Regen');
    await page.getByLabel('Duft 2').fill('Kakao');
    await page.getByLabel('Duft 3').fill('Bratäpfel');
    await expect(page.getByText('Es duftet nach Regen, Kakao und Bratäpfel.')).toBeVisible();
    await page.getByLabel('Witz 1 (Tag 7, sagt Ellis)').fill('Pinguine!');
    await page.getByRole('button', { name: 'Speichern' }).click();
    await expect(page.getByText('Gespeichert.', { exact: false })).toBeVisible();
    // reload: the values come back from Firestore
    await page.reload();
    await page.locator('.personal-pick').first().click();
    await expect(page.getByLabel('Duft 2')).toHaveValue('Kakao');
    await expect(page.getByLabel('Duft 3')).toHaveValue('Bratäpfel');
  });
  await choose(page, ['Bescheiden bleiben.']);
  await tapUntil(page, page.getByText('Es duftet nach Regen, Kakao und Bratäpfel.'));
});
