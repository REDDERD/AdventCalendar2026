import type { EndingId, HouseId, InkVarValue, Profile } from '../types';

/** End cards (storyboard/tag-24.md, "Abspann"). */
export const ENDING_CARDS: Record<EndingId, { title: string; text: string }> = {
  A: {
    title: 'Die dritte Lösung',
    text: 'Die Uhr tickt, die Tür bleibt einen Spalt offen, und Aldous darf bleiben, solange er will.',
  },
  B: {
    title: 'Abschied im Schnee',
    text: 'Die Uhr läuft. Aldous ist weitergezogen, unter einem Baum, im Schnee, mit einem Lächeln.',
  },
  C_A: {
    title: 'Der Geist gesteht, Ellis hat die Idee',
    text: 'Ein Irrtum führt zur Wahrheit. Ellis’ Gedanke öffnet die Tür, und Aldous bleibt.',
  },
  C_B: {
    title: 'Der Geist gesteht',
    text: 'Ein Irrtum führt zur Wahrheit. Aldous geht in Frieden, und die Uhr geht weiter.',
  },
};

/** The hat's speech for the winning house [PZL-7]. */
export const HOUSE_CUP_SPEECH: Record<HouseId, string> = {
  gryffindor: 'Mut, wenn jemand fragt.',
  hufflepuff: 'Treue, wenn alle gehen.',
  ravenclaw: 'Klugheit, die eine Tür findet.',
  slytherin: 'List, die niemanden verlieren lässt.',
};

/** [PZL-7] The other three houses end just below the player's points. */
export const RIVAL_SHARES = [0.88, 0.82, 0.75];

export function houseCup(house: HouseId, points: number, houses: readonly HouseId[]): Array<{ house: HouseId; points: number }> {
  const rivals = houses.filter((h) => h !== house);
  return [{ house, points }, ...rivals.map((h, i) => ({ house: h, points: Math.floor(points * RIVAL_SHARES[i]) }))];
}

/** Section 8.7: every epilogue line that applies, in this order. */
export function epilogueLines(vars: Record<string, InkVarValue>, profile: Profile | null): string[] {
  const n = (key: string) => Number(vars[key] ?? 0);
  const lines: string[] = [];
  if (n('bond_ellis') >= 4) lines.push('Ellis schenkt dir seinen Schal. „Beste Freunde“, sagt er, und laminiert das Wort.');
  if (n('trust_theo') >= 2) lines.push('Theo wird Uhrmacher-Lehrling. Isoldes Werkzeug liegt wieder in der Familie.');
  if (vars.maren_covered === true) lines.push('Knopf wird Schul-Niffler. Er bekommt ein eigenes Kissen und sammelt nur noch Fundsachen.');
  if (n('trust_grimsby') >= 1) lines.push('Grimsby zieht die Uhr jeden Morgen auf. Summend. Er bestreitet es.');
  if (profile?.hatOverruled) lines.push('Der Sprechende Hut: „Ich hatte recht, dich ziehen zu lassen.“');
  lines.push('Die Uhr tickt. Das Schloss schläft. Und irgendwo zählt Ellis die Stunden bis zum nächsten Dezember.');
  return lines;
}

/** Section 12: used when the admin has not written a personal letter. */
export const DEFAULT_LETTER =
  'Frohe Weihnachten!\n\n' +
  'Du hast vierundzwanzig Türchen geöffnet, eine stehende Uhr zum Ticken gebracht und einem alten Ritter die Frage gestellt, die ihm dreihundert Jahre lang niemand gestellt hat.\n\n' +
  'Danke, dass du jeden Tag dabei warst. *Hogwarts hat sich auf dich verlassen können.*';

/** Who takes a bow in the credits besides the LPC artists. */
export const TIME_GUESTS = [
  'Hermine', 'Slughorn', 'Neville und Trevor', 'Hagrid und Fang', 'Luna', 'Newt und Knopf', 'Dumbledore (Porträt)',
  'Fred und George', 'Madam Rosmerta', 'Flitwick', 'Lockhart', 'Peeves', 'Fast Kopfloser Nick', 'Die Graue Dame',
  'Der Blutige Baron', 'Der Fette Mönch', 'Die Maulende Myrte', 'Madam Pince', 'Filch und Mrs. Norris', 'Dobby (Socke)',
];
