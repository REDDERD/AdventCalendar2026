import type { SaveDoc } from '../types';

/** Steckbrief badges (DECISIONS.md #79); icons are `ui.badge.<id>`. */
export interface Badge {
  id: string;
  name: string;
  /** what earns it */
  text: string;
  goal: number;
  /** hidden name and text until earned */
  secret?: boolean;
  value: (save: SaveDoc) => number;
}

const solved = (save: SaveDoc) => Object.values(save.puzzles).filter((p) => p.solved && p.solvedBy !== 'help');

export const BADGES: Badge[] = [
  { id: 'sparks10', name: 'Funkenfinder', text: '10 versteckte Funken gefunden', goal: 10, value: (s) => s.foundSparks.length },
  { id: 'sparks30', name: 'Funkenjäger', text: '30 versteckte Funken gefunden', goal: 30, value: (s) => s.foundSparks.length },
  { id: 'firsttry', name: 'Auf Anhieb', text: '5 Rätsel beim ersten Versuch gelöst', goal: 5, value: (s) => solved(s).filter((p) => p.attempts <= 1).length },
  { id: 'nohint', name: 'Eigene Idee', text: '10 Rätsel ohne Hinweis gelöst', goal: 10, value: (s) => solved(s).filter((p) => p.hintsBought.length === 0).length },
  { id: 'week', name: 'Erste Woche', text: '7 Tage geschafft', goal: 7, value: (s) => s.progress.completedDays.length },
  { id: 'half', name: 'Halbzeit', text: '12 Tage geschafft', goal: 12, value: (s) => s.progress.completedDays.length },
  { id: 'all', name: 'Adventsuhr', text: 'Alle 24 Tage geschafft', goal: 24, value: (s) => s.progress.completedDays.length },
  { id: 'ownway', name: 'Eigener Kopf', text: 'Dem Sprechenden Hut widersprochen', goal: 1, secret: true, value: (s) => (s.profile?.hatOverruled ? 1 : 0) },
];

export interface BadgeState {
  badge: Badge;
  earned: boolean;
  /** progress towards the goal, capped */
  value: number;
}

export function badgeStates(save: SaveDoc): BadgeState[] {
  return BADGES.map((badge) => {
    const value = Math.min(badge.goal, badge.value(save));
    return { badge, earned: value >= badge.goal, value };
  });
}
