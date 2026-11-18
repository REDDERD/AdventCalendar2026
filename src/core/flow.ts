import { detectPlatform } from '../services/EventLogger';
import { DaySession } from './DaySession';
import { go } from './ScreenMachine';
import { store, type Screen } from './store';

const ONBOARDING_KEY = 'hogwarts.onboardingSeen';

export function onboardingSeen(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === '1';
  } catch {
    return true;
  }
}

export function markOnboardingSeen(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, '1');
  } catch {
    // ignore
  }
}

const RESUMABLE: Screen[] = ['chapterCard', 'scene', 'puzzleIntro', 'puzzle', 'solution'];

/** After login (or reload): onboarding, resume an interrupted day, or the calendar. */
export async function routeAfterLogin(): Promise<void> {
  const { save } = store.getState();
  if (!save) return;
  // [AUTH-10] once after the first login; not inside the installed app.
  if (!onboardingSeen() && !detectPlatform().standalone) {
    go('onboarding');
    return;
  }
  await enterGame();
}

export async function enterGame(): Promise<void> {
  const { save } = store.getState();
  if (!save) return;
  const current = save.progress.current;
  if (current) {
    try {
      await DaySession.begin(current.day);
      const screen = RESUMABLE.includes(current.screen as Screen) ? (current.screen as Screen) : 'scene';
      go(screen);
      return;
    } catch (e) {
      console.error('Could not resume day', e);
    }
  }
  go(save.profile ? 'calendar' : 'prologue');
}

/** Start a day from the calendar (or the admin's debug jump [DAY-7]). */
export async function startDay(day: number): Promise<void> {
  const { save, updateSave } = store.getState();
  if (!save) return;
  if (save.progress.current && save.progress.current.day !== day) {
    // Admin jump while another day is open: abandon it.
    updateSave((s) => {
      s.progress.current = null;
    });
  }
  await DaySession.begin(day);
  go('chapterCard');
}
