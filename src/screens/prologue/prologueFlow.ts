import { DaySession } from '../../core/DaySession';
import { go } from '../../core/ScreenMachine';
import { isPrologueScreen, store, type PrologueScreen } from '../../core/store';
import { logEvent } from '../../services/EventLogger';
import { now } from '../../services/UnlockService';
import type { HouseId, PrologueDraft, Profile, SaveDoc } from '../../types';

/** Open the letter, or continue an interrupted prologue at its last step [DAY-4]. */
export async function startPrologue(): Promise<void> {
  const { save, updateSave } = store.getState();
  if (!save) return;
  const current = save.progress.current;
  if (current?.day === 0) {
    await resumePrologue(current.screen);
    return;
  }
  updateSave(
    (s) => {
      s.progress.dayStartedAt['0'] = now();
      s.progress.current = { day: 0, screen: 'prologue.letter', inkState: '' };
      s.prologueDraft = {};
    },
    { immediate: true },
  );
  logEvent('day_start', 0);
  go('prologue.letter');
}

export async function resumePrologue(screen: string): Promise<void> {
  const target: PrologueScreen = isPrologueScreen(screen) ? screen : screen === 'scene' ? 'prologue.train' : 'prologue.letter';
  if (target === 'prologue.train') await DaySession.begin(0);
  go(target);
}

/** Save the step's result and move on (every step is saved immediately [DAY-4]). */
export async function advancePrologue(next: PrologueScreen, mutate: (draft: PrologueDraft, save: SaveDoc) => void): Promise<void> {
  store.getState().updateSave(
    (s) => {
      s.prologueDraft = s.prologueDraft ?? {};
      mutate(s.prologueDraft, s);
      s.vars = { ...s.vars, ...draftVars(s.prologueDraft) };
      s.progress.current = { day: 0, screen: next, inkState: '' };
    },
    { immediate: true },
  );
  if (next === 'prologue.train') await DaySession.begin(0);
  go(next);
}

export function useDraft(): PrologueDraft {
  return store((s) => s.save?.prologueDraft) ?? {};
}

/** Reveal done: the draft becomes the profile, the prologue counts as day 0. */
export function finishPrologue(): void {
  const { save, updateSave } = store.getState();
  const draft = save?.prologueDraft;
  if (!save || !draft?.house || !draft.look || !draft.wand || !draft.pet || !draft.hatSuggestion) {
    console.error('Prologue incomplete', draft);
    return;
  }
  const profile: Profile = {
    name: draft.name ?? save.uid,
    pronoun: draft.pronoun ?? 'n',
    look: draft.look,
    wand: draft.wand,
    pet: draft.pet,
    hatSuggestion: draft.hatSuggestion,
    house: draft.house,
    hatOverruled: draft.hatOverruled ?? false,
    sortingAnswers: draft.sortingAnswers ?? [],
  };
  const startedAt = save.progress.dayStartedAt['0'];
  const finishedAt = now();
  updateSave(
    (s) => {
      s.profile = profile;
      delete s.prologueDraft;
      s.vars = {
        ...s.vars,
        name: profile.name,
        pronoun: profile.pronoun,
        house: profile.house,
        hat_overruled: profile.hatOverruled,
        wand: profile.wand,
        pet: profile.pet,
      };
      if (!s.progress.completedDays.includes(0)) s.progress.completedDays.push(0);
      s.progress.dayCompletedAt['0'] = finishedAt;
      s.progress.current = null;
    },
    { immediate: true },
  );
  logEvent('day_complete', 0, { durationSec: startedAt ? Math.round((finishedAt - startedAt) / 1000) : null });
  go('calendar');
}

/** Ink variables the train scene needs before the profile exists. */
export function draftVars(draft: PrologueDraft): Record<string, string> {
  const vars: Record<string, string> = {};
  if (draft.name) vars.name = draft.name;
  if (draft.pronoun) vars.pronoun = draft.pronoun;
  if (draft.wand) vars.wand = draft.wand;
  if (draft.pet) vars.pet = draft.pet;
  return vars;
}

export const HOUSE_LABEL: Record<HouseId, string> = {
  gryffindor: 'Gryffindor',
  hufflepuff: 'Hufflepuff',
  ravenclaw: 'Ravenclaw',
  slytherin: 'Slytherin',
};
