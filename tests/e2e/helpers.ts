import { expect, type Locator, type Page } from '@playwright/test';
import { SORTING_QUESTIONS } from '../../src/content/sortingQuiz';
import type { HouseId } from '../../src/types';

export const PASSWORD = 'zimt-eule-lumos-47';

export async function login(page: Page, username: string, password = PASSWORD): Promise<void> {
  await page.getByLabel('Eulenname').fill(username);
  await page.getByLabel('Zauberwort').fill(password);
  await page.getByRole('button', { name: 'Eintreten' }).click();
}

/** Tap the dialogue until `target` is visible. */
export async function tapUntil(page: Page, target: Locator, maxTaps = 60): Promise<void> {
  for (let i = 0; i < maxTaps; i++) {
    if (await target.isVisible()) return;
    const dialogue = page.locator('.dialogue');
    if (await dialogue.isVisible()) await dialogue.click();
    await page.waitForTimeout(80);
  }
  await expect(target).toBeVisible();
}

/** [DAY-7] Admin debug date (and instant text) via Truhe → Optionen. */
export async function setDebugDate(page: Page, value: string): Promise<void> {
  await page.getByRole('button', { name: 'Truhe' }).click();
  await page.getByRole('button', { name: 'Optionen' }).click();
  await page.getByRole('button', { name: 'Sofort' }).click();
  await page.locator('input[type="datetime-local"]').fill(value);
  await page.getByRole('button', { name: 'Setzen', exact: true }).click();
  await page.getByRole('button', { name: '✕' }).click();
}

export interface PrologueOptions {
  house: HouseId;
  /** Reload after the mirror to check exact resumption [DAY-4]. */
  reloadAfterMirror?: boolean;
}

/** Play the whole prologue from the calendar (Section 6.1). */
export async function playPrologue(page: Page, { house, reloadAfterMirror }: PrologueOptions): Promise<void> {
  await page.getByRole('button', { name: 'Brief öffnen' }).click();

  // Letter
  await page.getByRole('button', { name: 'Siegel brechen' }).click();
  await page.getByLabel('Unterschrift (dein Name)').fill('Lena');
  await expect(page.getByRole('button', { name: 'Neutral' })).toHaveCount(0); // DECISIONS.md #20
  await page.getByRole('button', { name: 'Hexe' }).click();
  await page.getByRole('button', { name: 'Unterschreiben' }).click();

  // Mirror – the body shape follows the pronoun, no "Statur" tab
  await expect(page.getByRole('button', { name: 'Statur' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Frisur' }).click();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page.getByRole('button', { name: 'Fertig' }).click();
  await expect(page.getByText('Probier sie ruhig aus.')).toBeVisible();

  if (reloadAfterMirror) {
    await page.reload();
    await expect(page.getByText('Probier sie ruhig aus.')).toBeVisible();
  }

  // Wand
  await page.getByRole('button', { name: 'Weide & Phönixfeder' }).click();
  await page.getByRole('button', { name: 'Diesen nehme ich' }).click();

  // Pet
  await page.getByRole('button', { name: 'Katze' }).first().click();
  await page.getByRole('button', { name: 'Das ist meins!' }).click();

  // Train (Ink)
  await tapUntil(page, page.getByRole('button', { name: 'Ich bin bereit!' }));
  await page.getByRole('button', { name: 'Ich bin bereit!' }).click();

  // Sorting hat [HAT-1]
  for (const q of SORTING_QUESTIONS) {
    const answer = page.getByRole('button', { name: q.answers[house] });
    await tapUntil(page, answer);
    await answer.click();
  }
  const accept = page.getByRole('button', { name: /passt perfekt!/ });
  await tapUntil(page, accept);
  await accept.click();

  // Reveal
  await tapUntil(page, page.getByRole('button', { name: 'Zum Kalender' }));
  await page.getByRole('button', { name: 'Zum Kalender' }).click();
}

/** Admin with a finished prologue jumps straight into `day` [DAY-7]. */
/** `beforeStart` runs right after the login, e.g. to edit personal content in the console. */
export async function startDayAsAdmin(page: Page, day: number, beforeStart?: () => Promise<void>): Promise<void> {
  await page.goto('./');
  await login(page, 'daniel');
  await page.getByRole('button', { name: 'Verstanden' }).click();
  if (beforeStart) {
    await beforeStart();
    await page.goto('./');
  }
  await setDebugDate(page, `2026-12-${String(day).padStart(2, '0')}T10:00`);
  await playPrologue(page, { house: 'hufflepuff' });
  await page.getByRole('button', { name: 'Truhe' }).click();
  await page.getByRole('button', { name: 'Optionen' }).click();
  await page.locator('select').selectOption(String(day));
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByText('Tippen zum Beginnen').click();
}

/** Tap through the dialogue and take each choice in turn. */
export async function choose(page: Page, labels: string[]): Promise<void> {
  for (const label of labels) {
    const button = page.getByRole('button', { name: label });
    await tapUntil(page, button);
    await button.click();
  }
}

/** Open the puzzle from its intro card. */
export async function openPuzzle(page: Page, number: number): Promise<void> {
  await tapUntil(page, page.getByText(`Rätsel ${String(number).padStart(2, '0')}`));
  await page.locator('.puzzle-intro').click();
}

/** Check, accept the solution and play to the end of the day. */
export async function finishDay(page: Page, day: number, points: number): Promise<void> {
  await page.getByRole('button', { name: 'Prüfen' }).click();
  await expect(page.getByText(`+${points} Hauspunkte`)).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await tapUntil(page, page.getByText(`Kapitel ${day} geschafft!`));
}
