import { BootGate } from './bootGate';
import { PROLOGUE_SCREENS, store, type Screen } from './store';

/**
 * Section 13.2: boot → login → onboarding → prologue.* → calendar → chapterCard →
 * scene → puzzleIntro → puzzle → solution → scene → dayEnd → calendar.
 * `trunk` is an overlay, not a screen.
 */
const transitions: Record<Screen, Screen[]> = {
  boot: ['login', 'blocked', 'onboarding', ...PROLOGUE_SCREENS, 'calendar', 'chapterCard', 'scene', 'puzzleIntro', 'puzzle', 'solution', 'dayEnd', 'ending', 'letter', 'credits'],
  login: ['boot', 'blocked'],
  blocked: ['login', 'boot'],
  onboarding: [...PROLOGUE_SCREENS, 'calendar'],
  'prologue.letter': ['prologue.mirror'],
  'prologue.mirror': ['prologue.wand'],
  'prologue.wand': ['prologue.pet'],
  'prologue.pet': ['prologue.train'],
  'prologue.train': ['prologue.sorting'],
  'prologue.sorting': ['prologue.reveal'],
  'prologue.reveal': ['calendar'],
  calendar: ['chapterCard', ...PROLOGUE_SCREENS, 'ending', 'letter', 'credits'],
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

const bootGate = new BootGate();

export function go(to: Screen): void {
  const from = store.getState().screen;
  if (from === to) return;
  if (!canGo(from, to)) console.warn(`[screen] unexpected transition ${from} → ${to}`);
  if (bootGate.hold(from, to)) return;
  store.getState().setScreen(to);
}

/** Screen waiting for the boot film to end (null while still loading). */
export function bootTarget(): Screen | null {
  return bootGate.target;
}

/** Called by the boot film when it has played to the end. */
export function finishBoot(): void {
  const target = bootGate.finish();
  if (target) store.getState().setScreen(target);
}
