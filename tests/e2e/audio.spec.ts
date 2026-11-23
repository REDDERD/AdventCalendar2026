import { expect, test } from '@playwright/test';
import { ADMIN_UID } from '../../src/config';
import { createAccount, resetEmulators, waitForEmulators } from './emulator';
import { choose, openPuzzle, PASSWORD, startDayAsAdmin } from './helpers';

test.beforeEach(async () => {
  await waitForEmulators();
  await resetEmulators();
  await createAccount(ADMIN_UID, 'daniel', PASSWORD);
});

test('music: the orchestra keeps playing from scene to puzzle without errors [SND-1]', async ({ page }) => {
  // count the notes the synthesiser schedules
  await page.addInitScript(() => {
    const w = window as unknown as { __oscillators: number };
    w.__oscillators = 0;
    const proto = BaseAudioContext.prototype;
    const create = proto.createOscillator;
    proto.createOscillator = function (this: BaseAudioContext) {
      w.__oscillators++;
      return create.call(this);
    };
  });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const oscillators = () => page.evaluate(() => (window as unknown as { __oscillators: number }).__oscillators);

  await startDayAsAdmin(page, 2);
  await expect.poll(oscillators, { timeout: 10_000 }).toBeGreaterThan(40);

  await choose(page, ['Wir passen auf, versprochen.', 'Mit Peeves Kerzen auspusten.']);
  await openPuzzle(page, 2);
  const before = await oscillators();
  await expect.poll(oscillators, { timeout: 10_000 }).toBeGreaterThan(before + 40);
  expect(errors).toEqual([]);
});
