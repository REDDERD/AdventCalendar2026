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

test('day 9: house evening, the Hufflepuff password, house token and the house ghost', async ({ page }) => {
  await startDayAsAdmin(page, 9);
  await openPuzzle(page, 9);
  await expect(page.locator('.puzzle-prompt')).toContainText('Neun Fässer');
  for (const key of 'ZIMTSTERN') await page.getByRole('button', { name: key, exact: true }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('+30 Hauspunkte')).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await choose(page, ['Erzählen, was wir wissen.', 'Nach Sir Aldous fragen.']);
  await expect(page.getByText('Der arme Aldous', { exact: false })).toBeVisible();
  await tapUntil(page, page.getByText('Kapitel 9 geschafft!'));
  await expect(page.locator('.dayend-frame')).toContainText('Neuer Gegenstand: Hausgegenstand');
  await choicesLogged('d09.secret.share', 'd09.ghost.ask');
});

test('day 10: Filch, clue k08 and the key board', async ({ page }) => {
  await startDayAsAdmin(page, 10);
  await choose(page, ['Mrs. Norris streicheln.', 'Freundlich nachfragen.']);
  await openPuzzle(page, 10);
  await expect(page.locator('.choice-figure')).toBeVisible();
  await page.getByRole('button', { name: /eckig · 1 · Eisen/ }).click();
  await finishDay(page, 10, 40);
  await expect(page.locator('.dayend-frame')).toContainText('Neuer Hinweis: Grimsbys Logbuch');
  await choicesLogged('d10.cat.pet', 'd10.grimsby.kind');
});

test('day 11: Hagrid, the rock cake and the boat (11 crossings)', async ({ page }) => {
  await startDayAsAdmin(page, 11);
  await choose(page, ['Die Fährten genauer ansehen.', 'Einen Felsenkuchen essen.']);
  await openPuzzle(page, 11);
  // A rule-breaking crossing is carried out, the scuffle plays, then the move is taken back
  const bank = page.locator('.cross-bank.boat-here');
  for (let i = 0; i < 2; i++) await bank.getByRole('button', { name: 'Frettchen einsteigen' }).first().click();
  await page.getByRole('button', { name: 'Ablegen' }).click();
  await expect(page.locator('.brawl')).toBeVisible();
  await page.getByRole('button', { name: 'Zug rückgängig machen' }).click();
  await expect(page.locator('.engine-status')).toContainText('Fahrten: 0');
  for (let i = 0; i < 2; i++) await page.getByRole('button', { name: 'Frettchen aussteigen' }).first().click();
  const route: Array<[number, number]> = [[2, 0], [1, 0], [2, 0], [1, 0], [0, 2], [1, 1], [0, 2], [1, 0], [2, 0], [1, 0], [2, 0]];
  for (const [h, f] of route) {
    for (let i = 0; i < h; i++) await page.locator('.cross-bank.boat-here').getByRole('button', { name: 'Hippogreife einsteigen' }).first().click();
    for (let i = 0; i < f; i++) await page.locator('.cross-bank.boat-here').getByRole('button', { name: 'Frettchen einsteigen' }).first().click();
    await page.getByRole('button', { name: 'Ablegen' }).click();
  }
  await expect(page.locator('.engine-status')).toContainText('Fahrten: 11');
  await finishDay(page, 11, 40);
  await choicesLogged('d11.snow.search', 'd11.hagrid.eat');
});

test('day 12: Luna, the knight in one stroke and the route choice', async ({ page }) => {
  await startDayAsAdmin(page, 12);
  await choose(page, ['Ihm Mut machen.']);

  await openPuzzle(page, 12);
  const nodes: Record<string, [number, number]> = {
    A: [118, 22], B: [96, 56], C: [140, 56], D: [78, 98], E: [158, 98], F: [96, 162], G: [140, 162],
    H: [86, 228], I: [150, 228], J: [200, 100], K: [236, 26], L: [32, 112], M: [48, 176],
  };
  const box = (await page.locator('.path-board').boundingBox())!;
  const at = (id: string) => ({ x: box.x + (nodes[id][0] * box.width) / 256, y: box.y + (nodes[id][1] * box.height) / 256 });
  const stroke = ['B', 'A', 'C', 'B', 'D', 'F', 'G', 'D', 'L', 'M', 'F', 'H', 'I', 'G', 'E', 'J', 'K', 'E', 'C'];
  await page.mouse.move(at(stroke[0]).x, at(stroke[0]).y);
  await page.mouse.down();
  for (const id of stroke.slice(1)) await page.mouse.move(at(id).x, at(id).y, { steps: 6 });
  await page.mouse.up();
  await page.getByRole('button', { name: 'Prüfen' }).click();
  await expect(page.getByText('+40 Hauspunkte')).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await choose(page, ['Mit Ellis den Pfoten in den Wald.']);
  await tapUntil(page, page.getByText('Kapitel 12 geschafft!'));
  await choicesLogged('d12.courage.encourage', 'd12.route.forest');
});

test('day 13 (forest): lantern, the centaur and 46 paths', async ({ page }) => {
  await startDayAsAdmin(page, 13, undefined, 'forest');
  await choose(page, ['Die Laterne anzünden und mitnehmen.', 'Ihn nach den Pfotenspuren fragen.']);
  await openPuzzle(page, 13);
  await expect(page.locator('.hint-open')).toContainText('Am Start steht eine 1'); // [PLAN-2] pet hint
  await page.getByRole('button', { name: 'Hinweise schließen' }).click();
  for (const key of ['4', '6']) await page.getByRole('button', { name: key, exact: true }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('+40 Hauspunkte')).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await tapUntil(page, page.getByText('Kapitel 13 geschafft!'));
  await expect(page.getByText('Neuer Gegenstand: Laterne')).toBeVisible();
  await choicesLogged('d13w.lantern.on', 'd13w.centaur.ask');
});

test('day 13 (archive): Theo, the family tree and the letter to "my knight"', async ({ page }) => {
  await startDayAsAdmin(page, 13, undefined, 'archive');
  await choose(page, ['Höflich um die Tickwell-Akte bitten.', 'Theo offen fragen.']);
  await openPuzzle(page, 13);
  await page.getByRole('button', { name: 'Hinweise schließen' }).click();
  await tapSwap(page, 'CORA', 'ISOLDE');
  await tapSwap(page, 'HUGO', 'MABEL');
  await tapSwap(page, 'THEO', 'HUGO');
  await tapSwap(page, 'THEO', 'OTTILIE');
  await finishDay(page, 13, 40);
  await expect(page.getByText('Brief der Uhrmacherin an „meinen Ritter“')).toBeVisible();
  await choicesLogged('d13a.archivist.polite', 'd13a.theo.ask');
});
