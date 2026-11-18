import { store, type Screen } from './store';

/**
 * Section 13.2: boot → login → onboarding → prologue → calendar → chapterCard →
 * scene → puzzleIntro → puzzle → solution → scene → dayEnd → calendar.
 * `trunk` is an overlay, not a screen.
 */
const transitions: Record<Screen, Screen[]> = {
  boot: ['login', 'blocked', 'onboarding', 'prologue', 'calendar', 'chapterCard', 'scene', 'puzzleIntro', 'puzzle', 'solution', 'dayEnd', 'ending', 'letter', 'credits'],
  login: ['boot', 'blocked'],
  blocked: ['login', 'boot'],
  onboarding: ['prologue', 'calendar'],
  prologue: ['calendar'],
  calendar: ['chapterCard', 'prologue', 'ending', 'letter', 'credits'],
  chapterCard: ['scene'],
  scene: ['puzzleIntro', 'dayEnd', 'ending'],
  puzzleIntro: ['puzzle'],
  puzzle: ['solution'],
  solution: ['scene'],
  dayEnd: ['calendar', 'ending'],
  ending: ['letter', 'credits', 'calendar'],
  letter: ['credits', 'calendar'],
  credits: ['calendar'],
};

/** Screens reachable from anywhere (logout, deactivation, admin jumps). */
const ALWAYS: Screen[] = ['login', 'blocked', 'boot', 'calendar', 'chapterCard'];

export function canGo(from: Screen, to: Screen): boolean {
  return ALWAYS.includes(to) || transitions[from].includes(to);
}

export function go(to: Screen): void {
  const from = store.getState().screen;
  if (from === to) return;
  if (!canGo(from, to)) console.warn(`[screen] unexpected transition ${from} → ${to}`);
  store.getState().setScreen(to);
}
