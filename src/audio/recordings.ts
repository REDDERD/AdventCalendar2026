/**
 * Real recordings of classical pieces (DECISIONS.md #81): the corridors of the
 * castle sound like Hogwarts Legacy, where someone is always playing piano in
 * a room down the hall. Every recording is public domain or CC licensed;
 * `npm run music:import` downloads them from `source`, trims, levels and
 * encodes them to public/audio/music/<id>.m4a.
 */

export interface Recording {
  /** file name in public/audio/music/ */
  id: string;
  /** the piece, as shown in the credits */
  title: string;
  composer: string;
  performer: string;
  /** year of the recording */
  year: string;
  licence: 'Gemeinfrei' | 'CC0';
  /** page that documents performer and licence */
  page: string;
  /** file that music:import downloads */
  source: string;
  /** seconds [from, to] to cut from the source when it holds more than the piece (an LP side) */
  clip?: [number, number];
}

/** An item on archive.org: its page and one of its files. */
function archive(item: string, file: string): Pick<Recording, 'page' | 'source'> {
  return { page: `https://archive.org/details/${item}`, source: `https://archive.org/download/${item}/${encodeURIComponent(file).replace(/%2F/g, '/')}` };
}

const MUSOPEN = 'https://archive.org/download/MusopenCollectionAsFlac/';
const MUSOPEN_PAGE = 'https://archive.org/details/MusopenCollectionAsFlac';
const MUSOPEN_CHOPIN = 'https://archive.org/download/musopen-chopin/';

/** A file on Wikimedia Commons; music:import resolves `commons:` to the upload server. */
function commons(file: string): Pick<Recording, 'page' | 'source'> {
  return { page: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`, source: `commons:${file}` };
}

const CZECH = 'Tschechisches Nationalsinfonieorchester (Musopen)';

export const RECORDINGS: Recording[] = [
  {
    id: 'clair_de_lune',
    title: 'Suite bergamasque, L. 75: III. Clair de lune',
    composer: 'Claude Debussy',
    performer: 'Victor Borge',
    year: '1947',
    licence: 'Gemeinfrei',
    // 78 rpm (Columbia 38184); Laurens Goedhart's 2011 recording on Commons
    // (commons('Clair_de_lune_(Claude_Debussy)_Suite_bergamasque.ogg')) is the better-sounding alternative
    ...archive('JV-26158-1947-QmZxCF5R4RNSnaZ4CHrtxysvqFYEw1Yj4RoSf9i1TpBQS4.mp3', 'DH494805.mp3'),
  },
  {
    id: 'chopin_nocturne',
    title: 'Nocturne Es-Dur, op. 9 Nr. 2',
    composer: 'Frédéric Chopin',
    performer: 'Frank Lévy (Musopen)',
    year: '2014',
    licence: 'Gemeinfrei',
    // same recording as on Commons (identical length), from Musopen's CC0 Chopin set on archive.org
    page: commons('Chopin_-_Nocturne_No._2_in_E-flat_major,_Op._9_No._2_(Frank_Levy).flac').page,
    source: `${MUSOPEN_CHOPIN}NocturneOp9No2.mp3`,
  },
  {
    id: 'bach_prelude',
    title: 'Präludium C-Dur, BWV 846',
    composer: 'Johann Sebastian Bach',
    performer: 'Kimiko Ishizaka',
    year: '2015',
    licence: 'CC0',
    // the Open Well-Tempered Clavier, also on Commons
    ...archive('bach-well-tempered-clavier-book-1', 'Kimiko Ishizaka - Bach- Well-Tempered Clavier, Book 1 - 01 Prelude No. 1 in C major, BWV 846.ogg'),
  },
  {
    id: 'chopin_waltz',
    title: 'Walzer cis-Moll, op. 64 Nr. 2',
    composer: 'Frédéric Chopin',
    performer: 'Olga Gurevich (Musopen)',
    year: '2014',
    licence: 'Gemeinfrei',
    page: commons('Chopin_-_Waltz_No._7_in_C-sharp_minor,_Op._64_No._2_(Olga_Gurevich).flac').page,
    source: `${MUSOPEN_CHOPIN}Waltz%20Op.%2064%20no.%202%20in%20C%20sharp%20minor.mp3`,
  },
  {
    id: 'tchaikovsky_waltz',
    title: 'Dornröschen, op. 66: Walzer',
    composer: 'Pjotr Iljitsch Tschaikowsky',
    performer: 'Marek Weber und sein Orchester',
    year: '1938',
    licence: 'Gemeinfrei',
    // 78 rpm, Great 78 Project
    ...archive(
      '78_waltz-from-the-sleeping-beauty_marek-weber-and-his-orchestra-tchaikovsky_gbia3042385a',
      'WALTZ FROM THE "SLEEPING B - MAREK WEBER AND HIS ORCHESTRA.mp3',
    ),
  },
  {
    id: 'boccherini_minuet',
    title: 'Streichquintett E-Dur, op. 13 Nr. 5: Menuett',
    composer: 'Luigi Boccherini',
    performer: 'Philadelphia Orchestra, Leopold Stokowski',
    year: '1929',
    licence: 'Gemeinfrei',
    // 78 rpm (RCA Victor 7256-A), restored
    ...archive('boccherini-minuet', 'Boccherini Minuet.mp3'),
  },
  {
    id: 'pachelbel_canon',
    title: 'Kanon D-Dur',
    composer: 'Johann Pachelbel',
    performer: 'Collegium musicum, Hermann Diener',
    year: '1939',
    licence: 'Gemeinfrei',
    // 78 rpm (HMV EH 1231); the Strolling Strings of the US Air Force Band (2004, Commons:
    // commons('Canon_(2004)_-_Strolling_Strings_-_United_States_Air_Force_Band.mp3')) are the modern alternative
    ...archive(
      'hmv-eh-1231-torelli-concerto-op6-no10-pachelbel-canon-collegium-musicum-diener',
      'HMV EH 1231 [2RA 3244] Pachelbel Canon in D Collegium musicum, Diener.mp3',
    ),
  },
  {
    id: 'grieg_morning',
    title: 'Peer Gynt, Suite Nr. 1: Morgenstimmung',
    composer: 'Edvard Grieg',
    performer: CZECH,
    year: '2012',
    licence: 'Gemeinfrei',
    page: MUSOPEN_PAGE,
    source: `${MUSOPEN}Greig_PeerGynt/EdvardGrieg-PeerGyntSuiteNo.1Op.46-01-Morning.mp3`,
  },
  {
    id: 'mozart_lacrimosa',
    title: 'Requiem d-Moll, KV 626: Lacrimosa',
    composer: 'Wolfgang Amadeus Mozart',
    performer: 'Wiener Hofmusikkapelle, Josef Krips',
    year: '1950',
    licence: 'Gemeinfrei',
    // side 2 of the LP opens with the Lacrimosa; the Domine Jesu follows after the Amen
    ...archive(
      'lp_requiem-k626_wolfgang-amadeus-mozart-hofmusikkapelle-wi',
      'disc1/02.01. Lacrymosa (Larghetto); Domine Jesu (Andante Con Moto); Hostias (Andante) - Quam Olim Abrahae (Andante Con Moto); Sanctus (Adagio) - Hosanna In Excelsis (Allegro);p Benedictus (Andante) - Hosanna In Excelsis (Allegro); Agnus Dei...mp3',
    ),
    clip: [0, 242.2],
  },
  {
    id: 'grieg_ase',
    title: 'Peer Gynt, Suite Nr. 1: Åses Tod',
    composer: 'Edvard Grieg',
    performer: CZECH,
    year: '2012',
    licence: 'Gemeinfrei',
    page: MUSOPEN_PAGE,
    source: `${MUSOPEN}Greig_PeerGynt/EdvardGrieg-PeerGyntSuiteNo.1Op.46-02-AasesDeath.mp3`,
  },
  {
    id: 'grieg_anitra',
    title: 'Peer Gynt, Suite Nr. 1: Anitras Tanz',
    composer: 'Edvard Grieg',
    performer: CZECH,
    year: '2012',
    licence: 'Gemeinfrei',
    page: MUSOPEN_PAGE,
    source: `${MUSOPEN}Greig_PeerGynt/EdvardGrieg-PeerGyntSuiteNo.1Op.46-03-AnitrasDream.mp3`,
  },
  {
    id: 'mozart_magic_flute',
    title: 'Die Zauberflöte, KV 620: Ouvertüre',
    composer: 'Wolfgang Amadeus Mozart',
    performer: CZECH,
    year: '2012',
    licence: 'Gemeinfrei',
    page: MUSOPEN_PAGE,
    source: `${MUSOPEN}Mozart_MagicFluteOverture/WolfgangAmadeusMozart-MagicFluteOverture.mp3`,
  },
  {
    id: 'bach_aria',
    title: 'Goldberg-Variationen, BWV 988: Aria',
    composer: 'Johann Sebastian Bach',
    performer: 'Kimiko Ishizaka (Open Goldberg Variations)',
    year: '2012',
    licence: 'Gemeinfrei',
    page: MUSOPEN_PAGE,
    source: `${MUSOPEN}Bach_GoldbergVariations/JohannSebastianBach-01-GoldbergVariationsBwv.988-Aria.mp3`,
  },
];

/**
 * How far away the music sounds: `distant` = through the walls from a room down
 * the corridor (muffled, lots of hall), `hall` = in the same room, `near` = right
 * next to the piano.
 */
export type Room = 'distant' | 'hall' | 'near';

export interface Playlist {
  /** recordings in rotation, played in random order */
  pieces: string[];
  room: Room;
}

/** What plays for each music id that screens and Ink ask for. */
export const PLAYLISTS: Record<string, Playlist> = {
  // the corridors: piano from somewhere in the castle
  castle: { pieces: ['clair_de_lune', 'chopin_nocturne', 'bach_prelude'], room: 'distant' },
  // calendar, title, chapter cards: a ballroom
  title: { pieces: ['chopin_waltz', 'tchaikovsky_waltz', 'boccherini_minuet'], room: 'hall' },
  // grounds in the snow: strings from the castle windows
  outdoor: { pieces: ['pachelbel_canon', 'grieg_morning'], room: 'distant' },
  // dungeons, forest, cold
  dungeon: { pieces: ['mozart_lacrimosa', 'grieg_ase'], room: 'distant' },
  // every puzzle, and only puzzles
  puzzle: { pieces: ['grieg_anitra'], room: 'hall' },
  finale: { pieces: ['mozart_magic_flute'], room: 'hall' },
  letter: { pieces: ['bach_aria'], room: 'hall' },
  // day 19: Sir Aldous at the piano
  aldous: { pieces: ['clair_de_lune'], room: 'near' },
};

export const recording = (id: string): Recording | undefined => RECORDINGS.find((r) => r.id === id);

/** Longest pause between two pieces, in seconds (the app is open ~5 min a day). */
export const MAX_GAP = 5;
export const MIN_GAP = 2;

/** Seconds of silence before the next piece. */
export function gapSeconds(rand: () => number = Math.random): number {
  return MIN_GAP + rand() * (MAX_GAP - MIN_GAP);
}

/**
 * The next piece of a playlist: random, but never the one that just played
 * (unless the playlist has only one).
 */
export function nextPiece(list: Playlist, last: string | null, rand: () => number = Math.random): string {
  const choices = list.pieces.length > 1 ? list.pieces.filter((p) => p !== last) : list.pieces;
  return choices[Math.min(choices.length - 1, Math.floor(rand() * choices.length))];
}
