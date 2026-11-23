import { expect, test } from '@playwright/test';
import { ADMIN_UID } from '../../src/config';
import { createAccount, resetEmulators, waitForEmulators } from './emulator';
import { choose, openPuzzle, PASSWORD, startDayAsAdmin } from './helpers';

test.beforeEach(async () => {
  await waitForEmulators();
  await resetEmulators();
  await createAccount(ADMIN_UID, 'daniel', PASSWORD);
});

/**
 * Seconds the one playing recording has played, or 0 while none or two play
 * (crossfade). The players are not in the DOM, so play() is watched.
 */
const playedSeconds = (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    const w = window as unknown as { __players?: Set<HTMLMediaElement> };
    const playing = [...(w.__players ?? [])].filter((a) => a.currentSrc.startsWith('blob:') && !a.paused);
    return playing.length === 1 ? playing[0].currentTime : 0;
  });

test('music: scene and puzzle play their recordings without errors [SND-1]', async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { __players: Set<HTMLMediaElement> };
    w.__players = new Set();
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
      w.__players.add(this);
      return play.call(this);
    };
  });
  const loaded: string[] = [];
  page.on('request', (r) => {
    const m = /audio\/music\/(\w+)\.m4a$/.exec(r.url());
    if (m) loaded.push(m[1]);
  });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await startDayAsAdmin(page, 2);
  // the castle playlist: piano from down the corridor
  await expect.poll(() => loaded.some((id) => ['clair_de_lune', 'chopin_nocturne', 'bach_prelude'].includes(id)), { timeout: 10_000 }).toBe(true);
  await expect.poll(() => playedSeconds(page), { timeout: 15_000 }).toBeGreaterThan(1);

  await choose(page, ['Wir passen auf, versprochen.', 'Mit Peeves Kerzen auspusten.']);
  await openPuzzle(page, 2);
  // the puzzle has a piece of its own
  await expect.poll(() => loaded.includes('grieg_anitra'), { timeout: 10_000 }).toBe(true);
  await expect.poll(() => playedSeconds(page), { timeout: 15_000 }).toBeGreaterThan(1);
  expect(errors).toEqual([]);
});
