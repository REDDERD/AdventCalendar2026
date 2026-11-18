export type HouseId = 'gryffindor' | 'hufflepuff' | 'ravenclaw' | 'slytherin';
export const HOUSES: HouseId[] = ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin'];

export type Pronoun = 'f' | 'm' | 'n';
export type WandId = 'phoenix' | 'dragon' | 'unicorn';
export type PetId = 'owl' | 'cat' | 'toad';
export type EndingId = 'A' | 'B' | 'C_A' | 'C_B';
export type Role = 'admin' | 'player';

export type CharacterId =
  | 'quill' | 'ellis' | 'theo' | 'maren' | 'grimsby' | 'aldous'
  | 'thornbury' | 'hat' | 'knopf' | 'wandmaker' | 'player'
  // Cameos ("Zeitgäste", DECISIONS.md #41)
  | 'peeves' | 'pince' | 'hermione' | 'slughorn' | 'neville' | 'nick' | 'friar' | 'grey_lady' | 'baron' | 'filch' | 'hagrid' | 'luna';

export const CHARACTERS: CharacterId[] = [
  'quill', 'ellis', 'theo', 'maren', 'grimsby', 'aldous',
  'thornbury', 'hat', 'knopf', 'wandmaker', 'player',
  'peeves', 'pince', 'hermione', 'slughorn', 'neville',
  'nick', 'friar', 'grey_lady', 'baron',
  'filch',
  'hagrid',
  'luna',
];

export type LocationId =
  | 'letter' | 'robe_shop' | 'wand_shop' | 'train' | 'great_hall' | 'staircases'
  | 'library' | 'potions' | 'dorm_corridor' | 'owlery' | 'greenhouse' | 'common_room'
  | 'caretaker_office' | 'grounds_snow' | 'astronomy_tower' | 'forest_edge'
  | 'forest_clearing' | 'niffler_burrow' | 'archive' | 'dungeon_corridor'
  | 'portrait_gallery' | 'hogsmeade' | 'room_of_requirement' | 'ghost_corridor'
  | 'dueling_club' | 'clock_tower' | 'pendulum_chamber' | 'calendar';

export const LOCATIONS: LocationId[] = [
  'letter', 'robe_shop', 'wand_shop', 'train', 'great_hall', 'staircases',
  'library', 'potions', 'dorm_corridor', 'owlery', 'greenhouse', 'common_room',
  'caretaker_office', 'grounds_snow', 'astronomy_tower', 'forest_edge',
  'forest_clearing', 'niffler_burrow', 'archive', 'dungeon_corridor',
  'portrait_gallery', 'hogsmeade', 'room_of_requirement', 'ghost_corridor',
  'dueling_club', 'clock_tower', 'pendulum_chamber', 'calendar',
];

/** Firestore-side timestamps are converted to epoch milliseconds in memory. */
export type Millis = number;

// Section 3.3
export interface UserDoc {
  uid: string;
  username: string;
  displayName: string;
  role: Role;
  active: boolean;
  isTest: boolean;
  runId: number;
  createdAt: Millis;
  lastSeenAt: Millis | null;
  note?: string;
}

export interface Look {
  /** 'slim' | 'broad' – LPC female/male body (DECISIONS.md) */
  build: string;
  skin: string;
  hair: string;
  hairColor: string;
  eyes: string;
  glasses: string;
  accessory: string;
  sweater: string;
  /** 'pants' | 'skirt' */
  bottom: string;
}

export interface Profile {
  name: string;
  pronoun: Pronoun;
  look: Look;
  wand: WandId;
  pet: PetId;
  hatSuggestion: HouseId;
  house: HouseId;
  hatOverruled: boolean;
  sortingAnswers: HouseId[];
}

/** Prologue choices made so far; becomes `profile` when the prologue ends [DAY-4]. */
export interface PrologueDraft {
  name?: string;
  pronoun?: Pronoun;
  look?: Look;
  wand?: WandId;
  pet?: PetId;
  sortingAnswers?: HouseId[];
  hatSuggestion?: HouseId;
  house?: HouseId;
  hatOverruled?: boolean;
}

export type InkVarValue = string | number | boolean | string[];

/** Visual state of the stage, persisted so an interrupted scene resumes with the same picture. */
export interface StageState {
  bg: string | null;
  music: string | null;
  actors: Array<{ id: string; pos: 'left' | 'center' | 'right' }>;
  sparks: Array<{ id: string; x: number; y: number }>;
}

export interface CurrentDay {
  day: number;
  screen: string;
  inkState: string;
  puzzleId?: string;
  stage?: StageState;
}

export interface PuzzleResult {
  solved: boolean;
  solvedBy?: 'self' | 'help';
  attempts: number;
  hintsBought: number[];
  points: number;
  durationSec?: number;
  /** When the puzzle was first opened; basis for durationSec across reloads. */
  startedAt?: Millis;
  /** [PZL-5] Last time the player declined Quill's help. */
  helpDeclinedAt?: Millis;
}

export interface Settings {
  textSpeed: 'slow' | 'normal' | 'instant';
  music: boolean;
  sfx: boolean;
}

// Section 14.2
export interface SaveDoc {
  uid: string;
  runId: number;
  schemaVersion: 1;
  profile: Profile | null;
  prologueDraft?: PrologueDraft;
  vars: Record<string, InkVarValue>;
  progress: {
    completedDays: number[];
    current: CurrentDay | null;
    dayStartedAt: Record<string, Millis>;
    dayCompletedAt: Record<string, Millis>;
  };
  puzzles: Record<string, PuzzleResult>;
  housePoints: number;
  sparks: number;
  foundSparks: string[];
  diary: Array<{ day: number; speaker: string; text: string }>;
  ending: EndingId | null;
  settings: Settings;
  updatedAt: Millis;
}

// Section 14.3
export type EventType =
  | 'session_start' | 'prologue_value' | 'sorting_answer' | 'sorting_result'
  | 'day_start' | 'choice' | 'clue_found' | 'item_found' | 'spark_found'
  | 'puzzle_start' | 'puzzle_attempt' | 'puzzle_hint' | 'puzzle_solved'
  | 'day_complete' | 'ending' | 'letter_opened';

export interface EventDoc {
  uid: string;
  runId: number;
  type: EventType;
  day: number | null;
  data: Record<string, unknown>;
  at: Millis;
  clientAt: number;
  appVersion: string;
}
