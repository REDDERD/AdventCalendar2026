/** Section 8.3 – investigation clues. */
export const CLUES: Record<string, string> = {
  k01: 'Kratzspuren am Uhrkasten',
  k02: 'Eiskalte Stelle vor der Uhr',
  k03: 'Theos Notizbuch mit Zahnradskizzen',
  k04: 'Das goldene Zahnrad',
  k05: 'Knopf, der Niffler',
  k06: 'Brief der Uhrmacherin an „meinen Ritter“',
  k07: 'Porträt von 1726',
  k08: 'Grimsbys Logbuch',
  k09: 'Raureif im Uhrwerk',
  k10: 'Inschrift „CCC“ im Pendel',
};

/** Section 8.4 – items. */
export const ITEMS: Record<string, string> = {
  bookmark: 'Lesezeichen der Uhrmacherin',
  anonymous_letter: 'Anonymer Brief',
  house_token: 'Hausgegenstand',
  lantern: 'Laterne',
  archive_key: 'Archivschlüssel',
  gift_scarf: 'Schal für Ellis',
  gift_music_box: 'Spieluhr für Aldous',
  theo_wrench: 'Theos Uhrmacherschlüssel',
};

/** Trunk picture (asset id) per item. The house token looks different in every house. */
export const ITEM_ICONS: Record<string, string> = {
  bookmark: 'item.bookmark',
  anonymous_letter: 'item.anonymous_letter',
  lantern: 'item.lantern',
  archive_key: 'item.archive_key',
  gift_scarf: 'item.gift_scarf',
  gift_music_box: 'item.gift_music_box',
  theo_wrench: 'item.theo_wrench',
};

/** What the house token is, per house (day 9): picture and name. */
export const HOUSE_TOKENS: Record<string, { icon: string; name: string }> = {
  gryffindor: { icon: 'item.house_token_gryffindor', name: 'Rote Löwenfeder' },
  hufflepuff: { icon: 'item.house_token_hufflepuff', name: 'Honigtöpfchen' },
  ravenclaw: { icon: 'item.house_token_ravenclaw', name: 'Adlerbrosche' },
  slytherin: { icon: 'item.house_token_slytherin', name: 'Grüner Glücksstein' },
};

/**
 * Clues that are physical objects: the "Hinweise" tab shows them as pictures like items.
 * The others (scratches, cold spot, frost, inscription) are observations and stay text.
 */
export const CLUE_ICONS: Record<string, string> = {
  k03: 'item.clue_notebook',
  k04: 'item.clue_gear',
  k06: 'item.clue_letter',
  k07: 'item.clue_portrait',
  k08: 'item.clue_logbook',
};
