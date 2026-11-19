import { expect, test } from '@playwright/test';
import { ADMIN_UID } from '../../src/config';
import { createAccount, resetEmulators, waitForEmulators } from './emulator';
import { choose, openPuzzle, PASSWORD, startDayAsAdmin, tapUntil } from './helpers';

test.beforeEach(async () => {
  await waitForEmulators();
  await resetEmulators();
  await createAccount(ADMIN_UID, 'daniel', PASSWORD);
});

/** M6 acceptance: all decisions and puzzle data of a test player are visible and correct. */
test('M6: decisions, puzzle statistics and the player page show what was played', async ({ page }) => {
  await startDayAsAdmin(page, 7);
  await choose(page, ['Den Brief selbst einstecken.']);
  await openPuzzle(page, 7);
  for (const key of ['4', '1']) await page.getByRole('button', { name: key, exact: true }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('Leider falsch')).toBeVisible();
  await page.waitForTimeout(1000);
  for (const key of ['3', '8']) await page.getByRole('button', { name: key, exact: true }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('+24 Hauspunkte')).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await choose(page, ['Einen Brief nach Hause schreiben.']);
  await tapUntil(page, page.getByText('Kapitel 7 geschafft!'));

  // Entscheidungen: the admin account is a test account [AUTH-13]
  await page.goto('./#/admin/decisions');
  await page.getByLabel('Testkonten zeigen').check();
  await expect(page.locator('.summary-table')).toContainText('Hufflepuff');
  await page.getByRole('button', { name: /Tag 7/ }).click();
  const keep = page.locator('.decision-option', { hasText: 'Den Brief selbst einstecken.' });
  await expect(keep.locator('.avatar')).toHaveCount(1);
  await expect(page.locator('.decision-option', { hasText: 'Einen Brief nach Hause schreiben.' }).locator('.avatar')).toHaveCount(1);

  // Rätsel: p07 solved by 1 in 2 attempts
  await page.getByRole('link', { name: 'Rätsel' }).click();
  await page.getByLabel('Testkonten zeigen').check();
  const row = page.locator('.puzzle-table tr', { hasText: 'Eulen-Nummern' });
  await expect(row.locator('td').nth(1)).toHaveText('1');
  await expect(row.locator('td').nth(2)).toHaveText('2,0');

  // Spieler-Detail: timeline with the choices and both inputs
  await page.getByRole('link', { name: 'Übersicht' }).click();
  await page.getByLabel('Testkonten zeigen').check();
  await page.locator('.player-card').first().click();
  await expect(page.locator('.player-profile')).toContainText('Hufflepuff');
  await expect(page.locator('.clue-badge')).toHaveCount(10);
  await expect(page.locator('.find-list')).toContainText('Anonymer Brief');
  await page.getByRole('button', { name: /Tag 7/ }).click();
  await expect(page.locator('.timeline-body')).toContainText('Den Brief selbst einstecken.');
  await expect(page.locator('.attempts li')).toHaveText(['✗ 41', '✓ 38']);
  await expect(page.locator('.timeline-puzzle')).toContainText('+24 P.');

  // Werkzeuge: the export contains the events
  await page.goto('./#/admin/tools');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Alle Daten herunterladen' }).click();
  expect((await download).suggestedFilename()).toMatch(/^adventsuhr-export-\d{4}-\d{2}-\d{2}\.json$/);
  await expect(page.getByText(/Exportiert: 1 Konten, 1 Spielstände, \d+ Ereignisse\./)).toBeVisible();
});
