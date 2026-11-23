import { expect, test } from '@playwright/test';
import { ADMIN_UID } from '../../src/config';
import { createAccount, resetEmulators, waitForEmulators } from './emulator';
import { login, PASSWORD, playPrologue, setDebugDate, startDayAsAdmin, tapUntil } from './helpers';

test.beforeEach(async () => {
  await waitForEmulators();
  await resetEmulators();
});

test('trunk: items and object clues are pictures with their names, observations stay text', async ({ page }) => {
  await createAccount(ADMIN_UID, 'daniel', PASSWORD);
  await page.goto('./');
  await login(page, 'daniel');
  await page.getByRole('button', { name: 'Verstanden' }).click();
  await setDebugDate(page, '2026-12-01T10:00');
  await playPrologue(page, { house: 'hufflepuff' });

  await page.getByRole('button', { name: 'Truhe' }).click();
  await page.getByRole('button', { name: 'Inventar' }).click();
  await expect(page.locator('.trunk-body')).toContainText('Deine Truhe ist noch leer.');
  await page.getByRole('button', { name: 'Hinweise' }).click();
  await expect(page.locator('.item-card.missing')).toHaveCount(5); // five object clues, none found yet
  await expect(page.locator('.item-card')).toHaveCount(5);
  await page.getByRole('button', { name: '✕' }).click();

  // The vite dev server serves the very module instance the app runs on.
  await page.evaluate(async () => {
    const url = '/AdventCalendar2026/src/core/store.ts';
    const { store } = await import(/* @vite-ignore */ url);
    store.getState().updateSave((s: { vars: Record<string, string[]> }) => {
      s.vars.items = ['bookmark', 'house_token', 'theo_wrench'];
      s.vars.clues = ['k01', 'k04', 'k07'];
    });
  });

  await page.getByRole('button', { name: 'Truhe' }).click();
  await page.getByRole('button', { name: 'Inventar' }).click();
  const items = page.locator('.item-card');
  await expect(items).toHaveCount(3);
  await expect(items.nth(0)).toContainText('Lesezeichen der Uhrmacherin');
  await expect(items.nth(1)).toContainText('Honigtöpfchen'); // the house token of a Hufflepuff
  await expect(items.nth(2)).toContainText('Theos Uhrmacherschlüssel');
  await expect(page.locator('.item-picture')).toHaveCount(3);
  await expect(page.locator('.placeholder')).toHaveCount(0); // every picture was found

  await page.getByRole('button', { name: 'Hinweise' }).click();
  await expect(page.locator('.item-card:not(.missing)')).toHaveCount(2); // k04 gear and k07 portrait
  await expect(page.locator('.item-card:not(.missing)').first()).toContainText('Das goldene Zahnrad');
  await expect(page.locator('.item-card.missing')).toHaveCount(3);
  await expect(page.locator('.collection')).toContainText('Kratzspuren am Uhrkasten'); // observation k01 as text
  await expect(page.locator('.placeholder')).toHaveCount(0);
});

test('trunk diary: one collapsible chapter per day, only one open at a time', async ({ page }) => {
  await createAccount(ADMIN_UID, 'daniel', PASSWORD);
  await startDayAsAdmin(page, 1);
  await tapUntil(page, page.getByRole('button', { name: 'Erzähl mir alle sieben!' }));
  // [DAY-7] admin jump on to day 2 and read a few lines there
  await page.getByRole('button', { name: 'Truhe' }).click();
  await page.getByRole('button', { name: 'Optionen' }).click();
  await page.getByLabel('Tag', { exact: true }).selectOption('2');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByText('Tippen zum Beginnen').click();
  await tapUntil(page, page.getByRole('button', { name: 'Wir passen auf, versprochen.' }));

  await page.getByRole('button', { name: 'Truhe' }).click();
  await page.getByRole('button', { name: 'Tagebuch' }).click();
  const toggles = page.locator('.diary-toggle');
  // prologue, day 1, day 2
  await expect(toggles).toHaveCount(3);
  await expect(toggles.nth(0)).toContainText('Prolog');
  await expect(toggles.nth(1)).toContainText('Tag 1 · ');
  await expect(toggles.nth(2)).toContainText('Tag 2 · ');
  // the newest chapter starts open, the older ones are closed
  await expect(toggles.nth(2)).toHaveAttribute('aria-expanded', 'true');
  await expect(toggles.nth(1)).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.diary-text')).toHaveCount(1);
  // opening another chapter closes the first one
  await toggles.nth(1).click();
  await expect(toggles.nth(1)).toHaveAttribute('aria-expanded', 'true');
  await expect(toggles.nth(2)).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.diary-text')).toHaveCount(1);
  await expect(page.locator('.diary-text')).toContainText('Ellis');
  // tapping the open chapter folds it shut
  await toggles.nth(1).click();
  await expect(page.locator('.diary-text')).toHaveCount(0);
});

test('Steckbrief: student ID with progress and badges', async ({ page }) => {
  await createAccount(ADMIN_UID, 'daniel', PASSWORD);
  await page.goto('./');
  await login(page, 'daniel');
  await page.getByRole('button', { name: 'Verstanden' }).click();
  await setDebugDate(page, '2026-12-01T10:00');
  await playPrologue(page, { house: 'hufflepuff' });

  await page.evaluate(async () => {
    const url = '/AdventCalendar2026/src/core/store.ts';
    const { store } = await import(/* @vite-ignore */ url);
    store.getState().updateSave((s: { foundSparks: string[]; progress: { completedDays: number[] }; housePoints: number }) => {
      s.foundSparks = Array.from({ length: 11 }, (_, i) => `d0${(i % 7) + 1}.s${i}`);
      s.progress.completedDays = [1, 2, 3, 4, 5, 6, 7, 8];
      s.housePoints = 230;
    });
  });

  await page.getByRole('button', { name: 'Truhe' }).click();
  await page.getByRole('button', { name: 'Steckbrief' }).click();
  const card = page.locator('.student-id');
  await expect(card).toContainText('Schülerausweis');
  await expect(card).toContainText('Hufflepuff');
  await expect(page.locator('.student-stats')).toContainText('230 Hauspunkte');
  await expect(page.locator('.student-place')).toHaveCount(0); // the admin test account has no place
  await expect(page.locator('.student-progress').first()).toContainText('8/24');
  await expect(page.locator('.badge.earned')).toHaveCount(2); // Funkenfinder, Erste Woche
  await expect(page.locator('.placeholder')).toHaveCount(0);

  await page.getByRole('button', { name: 'Funkenjäger' }).click();
  await expect(page.locator('.badge-caption')).toContainText('Funkenjäger – 30 versteckte Funken gefunden (11/30)');
  await page.getByRole('button', { name: 'Geheimes Abzeichen' }).click();
  await expect(page.locator('.badge-caption')).toContainText('Ein Geheimnis.');
  if (process.env.SHOTS) await page.screenshot({ path: `${process.env.SHOTS}/steckbrief.png` });
});
