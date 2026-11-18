import { expect, test, type Page } from '@playwright/test';
import { ADMIN_UID } from '../../src/config';
import { createAccount, listEvents, resetEmulators, waitForEmulators } from './emulator';
import { choose, finishDay, openPuzzle, PASSWORD, startDayAsAdmin, tapUntil } from './helpers';

test.beforeEach(async () => {
  await waitForEmulators();
  await resetEmulators();
  await createAccount(ADMIN_UID, 'daniel', PASSWORD);
});

/** Every "point.option" appears as a choice event [EVT-1]. */
async function choicesLogged(...choices: string[]): Promise<void> {
  const logged = async () =>
    (await listEvents())
      .filter((e) => e.type === 'choice')
      .map((e) => {
        const f = (e.data as { mapValue: { fields: Record<string, { stringValue: string }> } }).mapValue.fields;
        return `${f.cid.stringValue}.${f.option.stringValue}`;
      });
  await expect.poll(logged, { timeout: 10_000 }).toEqual(expect.arrayContaining(choices));
}

const tapSwap = async (page: Page, a: string, b: string) => {
  await page.getByRole('button', { name: a, exact: true }).click();
  await page.getByRole('button', { name: b, exact: true }).click();
};

test('day 4: Madam Pince, Hermine, the bookmark, six books and Sir Aldous', async ({ page }) => {
  await startDayAsAdmin(page, 4);
  await choose(page, ['Madam Pince ein Kompliment machen.', 'Weiterlesen. Er schafft das.']);
  await openPuzzle(page, 4);
  await tapSwap(page, 'PENDEL', 'FEDER');
  await tapSwap(page, 'ANKER', 'ZEIT');
  await tapSwap(page, 'STUNDE', 'RAD');
  await tapSwap(page, 'PENDEL', 'STUNDE');
  await finishDay(page, 4, 30);
  await expect(page.getByText('Neuer Gegenstand: Lesezeichen der Uhrmacherin')).toBeVisible();
  await choicesLogged('d04.pince.chat', 'd04.help.read');
});

test('day 5: Slughorn, the pet unlocks hint 1, pouring 14/9/5', async ({ page }) => {
  await startDayAsAdmin(page, 5);
  await choose(page, ['Ihm ein wenig schmeicheln.', 'Das Messingöl annehmen.']);
  await openPuzzle(page, 5);
  // [PLAN-2] the cat's comment, hint 1 open for free
  await expect(page.getByText('Deine Katze stupst die mittlere Flasche an.')).toBeVisible();
  await expect(page.locator('.hint-open')).toContainText('mittlere Flasche (9)');
  await page.getByRole('button', { name: 'Hinweise schließen' }).click();
  const bottle = (i: number) => page.locator('.bottle-btn').nth(i);
  for (const [a, b] of [[0, 1], [1, 2], [2, 0], [1, 2], [0, 1], [1, 2], [2, 0], [1, 2], [2, 0], [1, 2], [0, 1], [1, 2], [2, 0]]) {
    await bottle(a).click();
    await bottle(b).click();
  }
  await finishDay(page, 5, 40);
  await choicesLogged('d05.slughorn.flatter', 'd05.ingredient.accept');
  expect(JSON.stringify(await listEvents())).toContain('"free"');
});

test('day 6: Nikolausnacht, clue k03 and the logic grid with the clue card', async ({ page }) => {
  await startDayAsAdmin(page, 6);
  await choose(page, ['Einen Zimtstern in seinen Stiefel legen.', 'Theo zur Rede stellen.']);
  await openPuzzle(page, 6);
  await page.getByRole('button', { name: 'Karte', exact: true }).click();
  await expect(page.locator('.clue-card')).toContainText('In Quills Stiefel liegt keine Nuss.');
  await page.getByRole('button', { name: 'Karte schließen' }).click();
  for (const [name, cell] of [['Ellis', '1-3'], ['Quill', '2-1'], ['Maren', '3-5'], ['Theo', '4-2'], ['Du', '5-4']]) {
    await page.locator('.grid-tray').getByRole('button', { name, exact: true }).click();
    await page.getByLabel(`Feld ${cell}`).click();
  }
  await finishDay(page, 6, 30);
  await expect(page.getByText('Neuer Hinweis: Theos Notizbuch mit Zahnradskizzen')).toBeVisible();
  await choicesLogged('d06.boot.star', 'd06.theo.confront');
});

test('day 7: the anonymous letter, owl 38 and a letter home', async ({ page }) => {
  await startDayAsAdmin(page, 7);
  await choose(page, ['Den Brief selbst einstecken.']);
  await openPuzzle(page, 7);
  await expect(page.locator('.input-figure')).toBeVisible();
  for (const key of ['3', '8']) await page.getByRole('button', { name: key, exact: true }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('+30 Hauspunkte')).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await choose(page, ['Einen Brief nach Hause schreiben.']);
  await tapUntil(page, page.getByText('Kapitel 7 geschafft!'));
  await expect(page.getByText('Neuer Gegenstand: Anonymer Brief')).toBeVisible();
  await choicesLogged('d07.letter.keep', 'd07.home.write');
});

test('day 8: Neville, Maren and the 6 × 6 mandrake bed', async ({ page }) => {
  await startDayAsAdmin(page, 8);
  await choose(page, ['Beim Umtopfen helfen.', 'Maren darauf ansprechen.']);
  await openPuzzle(page, 8);
  for (const cell of ['1-6', '2-3', '3-5', '4-1', '5-4', '6-2']) await page.getByLabel(`Feld ${cell}`).click();
  await finishDay(page, 8, 40);
  await choicesLogged('d08.neville.help', 'd08.maren.ask');
});
