import type { SaveDoc } from '../types';

/**
 * Who the player has met and on which day (0 = prologue), DECISIONS.md #80.
 * Someone counts as met once they have spoken to the player: every line lands
 * in the diary with its speaker. The wandmaker and the Sorting Hat speak on
 * prologue screens outside Ink, so they count once their choice is made.
 * Characters of the route not taken never speak, so they stay unmet for good.
 */
export function metCharacters(save: SaveDoc): Map<string, number> {
  const met = new Map<string, number>();
  const draft = save.prologueDraft;
  if (save.profile || draft?.wand) met.set('wandmaker', 0);
  if (save.profile || draft?.sortingAnswers?.length) met.set('hat', 0);
  for (const line of save.diary) {
    if (line.speaker && line.speaker !== 'player' && !met.has(line.speaker)) met.set(line.speaker, line.day);
  }
  return met;
}
