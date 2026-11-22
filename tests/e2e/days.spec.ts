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

test('day 14 (forest): the spider web spiral and the golden gear', async ({ page }) => {
  await startDayAsAdmin(page, 14, undefined, 'forest');
  await choose(page, ['Freundlich grüßen.']);
  await openPuzzle(page, 14);
  const nodes: Record<string, [number, number]> = {
    m: [128, 128], a1: [104, 104], a2: [152, 104], a3: [152, 152], a4: [104, 152], b1: [81, 81], b2: [175, 81],
    b3: [175, 175], b4: [81, 175], c1: [59, 59], c2: [197, 59], c3: [197, 197], c4: [59, 197],
  };
  const box = (await page.locator('.path-board').boundingBox())!;
  const at = (id: string) => ({ x: box.x + (nodes[id][0] * box.width) / 256, y: box.y + (nodes[id][1] * box.height) / 256 });
  const spiral = ['c1', 'c2', 'c3', 'c4', 'b4', 'b1', 'b2', 'b3', 'a3', 'a4', 'a1', 'a2', 'm'];
  await page.mouse.move(at('c1').x, at('c1').y);
  await page.mouse.down();
  for (const id of spiral.slice(1)) await page.mouse.move(at(id).x, at(id).y, { steps: 6 });
  await page.mouse.up();
  await page.getByRole('button', { name: 'Prüfen' }).click();
  await expect(page.getByText('+50 Hauspunkte')).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await choose(page, ['Das Zahnrad vorsichtig mitnehmen.']);
  await tapUntil(page, page.getByText('Kapitel 14 geschafft!'));
  await expect(page.locator('.dayend-frame')).toContainText('Das goldene Zahnrad');
  await choicesLogged('d14w.spider.greet', 'd14w.gear.take');
});

test('day 14 (archive): Moaning Myrtle and the mirrored PENDEL', async ({ page }) => {
  await startDayAsAdmin(page, 14, undefined, 'archive');
  await choose(page, ['Myrte um Hilfe bitten.', 'Sie klingt einsam.']);
  await openPuzzle(page, 14);
  await expect(page.locator('.input-figure')).toBeVisible();
  for (const key of 'PENDEL') await page.getByRole('button', { name: key, exact: true }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('+50 Hauspunkte')).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await tapUntil(page, page.getByText('Kapitel 14 geschafft!'));
  await choicesLogged('d14a.myrtle.ask', 'd14a.tone.lonely');
});

/** Tap points given in picture coordinates (256 wide). */
async function tapPicture(page: Page, points: Array<[number, number]>): Promise<void> {
  const box = (await page.locator('.tap-picture').boundingBox())!;
  for (const [x, y] of points) await page.mouse.click(box.x + (x * box.width) / 256, box.y + (y * box.width) / 256);
}

test('day 15 (forest): Knopf, Newt and the four real galleons', async ({ page }) => {
  await startDayAsAdmin(page, 15, undefined, 'forest');
  await choose(page, ['Sanft die Hand ausstrecken.', 'Er soll bei seiner Freundin bleiben.']);
  await openPuzzle(page, 15);
  await tapPicture(page, [[96, 34], [34, 96], [220, 96], [158, 158]]);
  await finishDay(page, 15, 50);
  await expect(page.locator('.dayend-frame')).toContainText('Knopf, der Niffler');
  await choicesLogged('d15w.knopf.gentle', 'd15w.newt.stay');
});

test('day 15 (archive): Dumbledore, Aldous and five differences in the portrait', async ({ page }) => {
  await startDayAsAdmin(page, 15, undefined, 'archive');
  await choose(page, ['Ein Zitronenbonbon nehmen.', 'Ihn nach dem Ritter fragen.']);
  await openPuzzle(page, 15);
  await tapPicture(page, [[128, 154], [95, 191], [168, 214], [80, 218], [128, 222]]);
  await finishDay(page, 15, 50);
  await expect(page.locator('.dayend-frame')).toContainText('Porträt von 1726');
  await choicesLogged('d15a.dumbledore.take', 'd15a.aldous.ask');
});

test('day 16: Maren confesses, the seating plan and the empty chair', async ({ page }) => {
  await startDayAsAdmin(page, 16, undefined, 'archive');
  await choose(page, ['Maren decken und schweigen.']);
  await openPuzzle(page, 16);
  await tapSwap(page, 'HAGRID', 'NEVILLE');
  await tapSwap(page, 'LUNA', 'HERMINE');
  await tapSwap(page, 'NEWT', 'SLUGHORN');
  await tapSwap(page, 'HAGRID', 'NEWT');
  await page.getByRole('button', { name: 'Prüfen' }).click();
  await expect(page.getByText('+50 Hauspunkte')).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await choose(page, ['Den Stuhl für Aldous freihalten.']);
  await tapUntil(page, page.getByText('Kapitel 16 geschafft!'));
  await choicesLogged('d16.maren.cover', 'd16.seating.keep');
});

test('day 17: Hogsmeade, Nim against Fred and George, a scarf for Ellis', async ({ page }) => {
  await startDayAsAdmin(page, 17, undefined, 'forest');
  await choose(page, ['Etwas Süßes bestellen.']);
  await expect(page.getByText('Schokofrosch', { exact: false })).toBeVisible(); // personal("favoriteSweet") default
  await openPuzzle(page, 17);
  const takeFrom = async (heap: number, from: number) => {
    await page.getByRole('button', { name: `Haufen ${heap}, ab Bonbon ${from} nehmen` }).click();
    await page.getByRole('button', { name: 'Nehmen', exact: true }).click();
  };
  await takeFrom(1, 2); // 3 → 1: the only winning move
  for (let i = 0; i < 5; i++) {
    // mirror the twins: always take the last cracker of the third heap
    const last = page.locator('.nim-heap').nth(2).locator('.nim-cracker').last();
    await expect(last).toBeEnabled();
    await last.click();
    await page.getByRole('button', { name: 'Nehmen', exact: true }).click();
  }
  await expect(page.getByText('+40 Hauspunkte')).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await choose(page, ['Einen Schal für Ellis kaufen.']);
  await tapUntil(page, page.getByText('Kapitel 17 geschafft!'));
  await expect(page.locator('.dayend-frame')).toContainText('Schal für Ellis');
  await choicesLogged('d17.treat.sweet', 'd17.gift.ellis');
});

test('day 18: the door that appears, Isolde\'s memory and the mirror', async ({ page }) => {
  await startDayAsAdmin(page, 18, undefined, 'forest');
  await openPuzzle(page, 18);
  for (const tile of [7, 1, 6, 4, 3, 8, 2, 5, 1, 7, 8, 2, 5, 1, 7, 8, 4, 3, 2, 5, 1, 4, 5, 2, 3, 6]) {
    await page.getByRole('button', { name: `Teil ${tile}`, exact: true }).click();
  }
  await finishDay18(page);
});

async function finishDay18(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Prüfen' }).click();
  await expect(page.getByText('+50 Hauspunkte')).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await choose(page, ['Weitergehen.']); // no house token when jumping straight to day 18
  // # photo: mirror – without a personal photo the mirror shows the player with Ellis and Quill
  await tapUntil(page, page.locator('.mirror-photo-default'));
  await choose(page, ['Dass niemand gehen muss.']);
  for (let i = 0; i < 20 && (await page.locator('.mirror-photo').count()); i++) {
    await page.locator('.dialogue').click();
    await page.waitForTimeout(80);
  }
  await expect(page.locator('.mirror-photo')).toHaveCount(0); // # photo: off
  await tapUntil(page, page.getByText('Kapitel 18 geschafft!'));
  await expect(page.locator('.dayend-frame')).toContainText('Porträt von 1726'); // [DEC-4] catch-up clue
  await choicesLogged('d18.token.skip', 'd18.wish.stay');
}

test('day 19: the ghost parade in order of age, the Grey Lady and Aldous', async ({ page }) => {
  await startDayAsAdmin(page, 19, undefined, 'forest');
  await choose(page, ['Nick führt die Parade an.']);
  await openPuzzle(page, 19);
  // start: Myrte, Nick, Baron, Aldous, Graue Dame, Mönch
  await tapSwap(page, 'MYRTE', 'GRAUE DAME'); // Dame, Nick, Baron, Aldous, Myrte, Mönch
  await tapSwap(page, 'NICK', 'BARON'); // Dame, Baron, Nick, Aldous, Myrte, Mönch
  await tapSwap(page, 'NICK', 'MÖNCH'); // Dame, Baron, Mönch, Aldous, Myrte, Nick
  await tapSwap(page, 'ALDOUS', 'NICK'); // Dame, Baron, Mönch, Nick, Myrte, Aldous
  await tapSwap(page, 'MYRTE', 'ALDOUS'); // Dame, Baron, Mönch, Nick, Aldous, Myrte
  await page.getByRole('button', { name: 'Prüfen' }).click();
  await expect(page.getByText('+50 Hauspunkte')).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await choose(page, ['Aldous trösten.']);
  await tapUntil(page, page.getByText('Kapitel 19 geschafft!'));
  await choicesLogged('d19.parade.nick', 'd19.aldous.comfort');
});

test('day 20: Flitwick\'s spell wheel and Theo\'s confession', async ({ page }) => {
  await startDayAsAdmin(page, 20, undefined, 'forest');
  await choose(page, ['Die Luft mitunterschreiben.']);
  await openPuzzle(page, 20);
  await page.getByRole('button', { name: 'Karte', exact: true }).click();
  await expect(page.getByText('Flitwicks Würfe', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Karte schließen' }).click();
  await page.locator('.answer-card', { hasText: 'Lichtsplitter' }).click();
  await page.getByRole('button', { name: 'Prüfen' }).click();
  await expect(page.getByText('+50 Hauspunkte')).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();
  // without trust_theo the "ally" option stays hidden
  await tapUntil(page, page.getByRole('button', { name: 'Den eigenen Stab sprechen lassen.' }));
  await expect(page.getByRole('button', { name: 'An Theos Seite kämpfen.' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Den eigenen Stab sprechen lassen.' }).click();
  await tapUntil(page, page.getByText('Kapitel 20 geschafft!'));
  await choicesLogged('d20.lockhart.sign', 'd20.duel.wand');
});

test('day 21: the clock tower, frost in the works and the gears', async ({ page }) => {
  await startDayAsAdmin(page, 21, undefined, 'forest');
  await choose(page, ['Ihm die Hand reichen.', 'Still zuhören.']);
  await openPuzzle(page, 21);
  await expect(page.locator('.hint-open')).toContainText('gegensinnig'); // [PLAN-2] pet hint 3
  await page.getByRole('button', { name: 'Hinweise schließen' }).click();
  await page.locator('.answer-card', { hasText: 'Gegen den Uhrzeigersinn' }).click();
  await finishDay(page, 21, 60);
  await expect(page.locator('.dayend-frame')).toContainText('Raureif im Uhrwerk');
  await choicesLogged('d21.climb.hand', 'd21.tone.listen');
});
