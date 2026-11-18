import type { LocationId } from '../types';

export type RouteId = 'forest' | 'archive';

export interface RouteVariant {
  title: string;
  location: LocationId;
  puzzleId: string;
}

export interface ScheduleEntry {
  day: number; // 0 = prologue
  /** [STR-2] Single source of unlock times. ISO, UTC. */
  unlockAt: string;
  title: string;
  location: LocationId;
  puzzleIds: string[];
  /** Days 13–15: content depends on `route` [STR-1]. */
  routes?: Record<RouteId, RouteVariant>;
}

/** [DAY-1] Day N unlocks 2026-12-N 00:00 Europe/Berlin = 2026-12-(N-1) 23:00 UTC. */
function dayUnlock(day: number): string {
  const d = new Date(Date.UTC(2026, 11, day, 0, 0, 0) - 60 * 60 * 1000);
  return d.toISOString();
}

type Row = [day: number, title: string, location: LocationId, puzzleIds: string[]];

const rows: Row[] = [
  [1, 'Die stehende Uhr', 'great_hall', ['p01']],
  [2, 'Schwebende Kerzen', 'great_hall', ['p02']],
  [3, 'Die wandernden Treppen', 'staircases', ['p03']],
  [4, 'Die Bibliothek', 'library', ['p04']],
  [5, 'Der Enteisungstrank', 'potions', ['p05']],
  [6, 'Die Nikolausnacht', 'dorm_corridor', ['p06']],
  [7, 'Die Eulerei', 'owlery', ['p07']],
  [8, 'Das Gewächshaus', 'greenhouse', ['p08']],
  [9, 'Der Hausabend', 'common_room', ['p09']],
  [10, 'Das Hausmeisterbüro', 'caretaker_office', ['p10']],
  [11, 'Spuren im Schnee', 'grounds_snow', ['p11']],
  [12, 'Der Astronomieturm', 'astronomy_tower', ['p12']],
  [13, 'Zwei Wege', 'forest_edge', ['p13w', 'p13a']],
  [14, 'Tiefer hinein', 'forest_clearing', ['p14w', 'p14a']],
  [15, 'Was glänzt', 'niffler_burrow', ['p15w', 'p15a']],
  [16, 'Die Tischordnung', 'great_hall', ['p16']],
  [17, 'Hogsmeade', 'hogsmeade', ['p17']],
  [18, 'Der Raum der Wünsche', 'room_of_requirement', ['p18']],
  [19, 'Die Geisterparade', 'ghost_corridor', ['p19']],
  [20, 'Der Duellierclub', 'dueling_club', ['p20']],
  [21, 'Im Uhrturm', 'clock_tower', ['p21']],
  [22, 'Die Pendelkammer', 'pendulum_chamber', ['p22']],
  [23, 'Die Anklage', 'great_hall', ['p23']],
  [24, 'Der letzte Schlag', 'great_hall', ['p24']],
];

const routeVariants: Record<number, Record<RouteId, RouteVariant>> = {
  13: {
    forest: { title: 'Der Waldrand', location: 'forest_edge', puzzleId: 'p13w' },
    archive: { title: 'Das Archiv', location: 'archive', puzzleId: 'p13a' },
  },
  14: {
    forest: { title: 'Das goldene Zahnrad', location: 'forest_clearing', puzzleId: 'p14w' },
    archive: { title: 'Spiegelschrift', location: 'dungeon_corridor', puzzleId: 'p14a' },
  },
  15: {
    forest: { title: 'Was glänzt', location: 'niffler_burrow', puzzleId: 'p15w' },
    archive: { title: 'Das Porträt', location: 'portrait_gallery', puzzleId: 'p15a' },
  },
};

export const PROLOGUE: ScheduleEntry = {
  day: 0,
  unlockAt: '2026-11-30T17:00:00.000Z',
  title: 'Prolog – Die Einladung',
  location: 'letter',
  puzzleIds: [],
};

export const schedule: ScheduleEntry[] = [
  PROLOGUE,
  ...rows.map(([day, title, location, puzzleIds]) => ({
    day,
    unlockAt: dayUnlock(day),
    title,
    location,
    puzzleIds,
    routes: routeVariants[day],
  })),
];

export const LAST_DAY = 24;

/** What falls out of the clock's door each day (storyboard bible, section 5); shown on dayEnd. */
export const DOOR_MAGIC: Record<number, string> = {
  1: 'Ein leises Klicken im Uhrkasten. Mehr nicht. Noch nicht.',
  2: 'Zimtsterne rieseln von der Decke. Ellis fängt neun.',
  3: 'Die Treppen schaukeln im Takt eines Weihnachtslieds.',
  4: 'Alle Bücher tragen Wollmützen und flüstern Gutenachtgeschichten.',
  5: 'Die Kessel duften nach Lebkuchen.',
  6: 'Die Stiefel vor den Türen füllen sich.',
  7: 'Eulen mit roten Schleifen kreisen um den Turm.',
  8: 'Die Mistelzweige singen.',
  9: 'Die Kamine brennen in den Hausfarben.',
  10: 'Der Schlüsselbund wird zum Glöckchen.',
  11: 'Die Schneemänner winken.',
  12: 'Sternschnuppen formen Zahlen.',
  13: 'Glühwürmchen hängen wie Lichterketten in den Bäumen.',
  14: 'Eiskristalle glitzern in den Spinnweben.',
  15: 'Schokotaler regnen.',
  16: 'Der Tisch deckt sich selbst.',
  17: 'Schnee in Bonbonfarben.',
  18: 'Der Raum wünscht jedem etwas Warmes.',
  19: 'Die Geister singen im Chor.',
  20: 'Die Zauberstäbe funkeln wie Wunderkerzen.',
  21: 'Ein Glockenspiel klingt im Uhrturm.',
  22: 'Das Pendel schwingt einmal. Schneeflocken.',
  23: 'In der Halle wächst ein Tannenbaum.',
  24: 'Schnee fällt in der Großen Halle.',
};

export function getEntry(day: number): ScheduleEntry {
  const entry = schedule.find((e) => e.day === day);
  if (!entry) throw new Error(`No schedule entry for day ${day}`);
  return entry;
}

/** Title/location/puzzle for a day, resolved for the player's route on days 13–15. */
export function resolveDay(day: number, route?: string): { title: string; location: LocationId; puzzleIds: string[] } {
  const entry = getEntry(day);
  const variant = entry.routes && (route === 'forest' || route === 'archive') ? entry.routes[route] : undefined;
  if (variant) return { title: variant.title, location: variant.location, puzzleIds: [variant.puzzleId] };
  return { title: entry.title, location: entry.location, puzzleIds: entry.puzzleIds };
}
