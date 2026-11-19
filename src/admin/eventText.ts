import { CLUES, ITEMS } from '../content/catalog';
import type { EventDoc, HouseId } from '../types';

export interface CatalogEntry {
  id: string;
  question: string;
  options: Array<{ option: string; text: string }>;
}

const HOUSE: Record<HouseId, string> = {
  gryffindor: 'Gryffindor',
  hufflepuff: 'Hufflepuff',
  ravenclaw: 'Ravenclaw',
  slytherin: 'Slytherin',
};
export const WAND: Record<string, string> = { phoenix: 'Phönixfeder', dragon: 'Drachenherz', unicorn: 'Einhornhaar' };
export const PET: Record<string, string> = { owl: 'eine Eule', cat: 'eine Katze', toad: 'eine Kröte' };
export const PRONOUN: Record<string, string> = { f: 'Hexe', m: 'Zauberer', n: 'neutral' };
const PLATFORM: Record<string, string> = { ios: 'iPhone', android: 'Android', other: 'Browser' };

export function formatDuration(sec: unknown): string {
  const s = Math.max(0, Math.round(Number(sec) || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} min`;
}

/** "p07" → "07", "p13w" → "13w" */
export function puzzleNumber(id: unknown): string {
  return String(id ?? '').replace(/^p/, '');
}

function where(day: number | null): string {
  return day === 0 ? 'im Prolog' : `an Tag ${day}`;
}

/**
 * [ADM-13] Readable feed sentences, e.g. "Lena hat an Tag 7 gewählt: „Den Brief
 * einstecken“." Choice texts come from the generated catalog, not the database.
 */
export function eventSentence(event: Pick<EventDoc, 'type' | 'day' | 'data'>, name: string, catalog: readonly CatalogEntry[] = []): string {
  const d = event.data;
  const day = event.day;
  switch (event.type) {
    case 'session_start':
      return `${name} hat das Spiel geöffnet (${PLATFORM[String(d.platform)] ?? 'Browser'}${d.standalone ? ', als App' : ''}).`;
    case 'prologue_value':
      switch (d.field) {
        case 'name':
          return `${name} hat den Brief als „${String(d.value)}“ unterschrieben.`;
        case 'pronoun':
          return `${name} möchte als ${PRONOUN[String(d.value)] ?? String(d.value)} angesprochen werden.`;
        case 'look':
          return `${name} hat sich im Spiegel eingekleidet.`;
        case 'wand':
          return `${name} hat den Zauberstab mit ${WAND[String(d.value)] ?? String(d.value)} gewählt.`;
        case 'pet':
          return `${name} hat ${PET[String(d.value)] ?? String(d.value)} als Haustier gewählt.`;
        default:
          return `${name} hat im Prolog etwas gewählt.`;
      }
    case 'sorting_answer':
      return `${name} hat dem Hut Frage ${String(d.question)} beantwortet (${HOUSE[d.house as HouseId] ?? String(d.house)}).`;
    case 'sorting_result': {
      const chosen = HOUSE[d.chosen as HouseId] ?? String(d.chosen);
      return d.overruled
        ? `${name} hat dem Hut widersprochen und ist jetzt in ${chosen} (statt ${HOUSE[d.suggestion as HouseId] ?? String(d.suggestion)}).`
        : `${name} ist jetzt in ${chosen}.`;
    }
    case 'day_start':
      return day === 0 ? `${name} hat den Prolog begonnen.` : `${name} hat Kapitel ${day} begonnen.`;
    case 'day_complete':
      return day === 0
        ? `${name} hat den Prolog abgeschlossen (${formatDuration(d.durationSec)}).`
        : `${name} hat Kapitel ${day} abgeschlossen (${formatDuration(d.durationSec)}).`;
    case 'choice': {
      const entry = catalog.find((c) => c.id === d.cid);
      const text = entry?.options.find((o) => o.option === d.option)?.text ?? String(d.label ?? d.option ?? '');
      return `${name} hat ${where(day)} gewählt: „${text}“.`;
    }
    case 'clue_found':
      return `${name} hat ${where(day)} einen Hinweis gefunden: ${CLUES[String(d.id)] ?? String(d.id)}.`;
    case 'item_found':
      return `${name} hat ${where(day)} etwas eingesteckt: ${ITEMS[String(d.id)] ?? String(d.id)}.`;
    case 'spark_found':
      return `${name} hat ${where(day)} einen Zauberfunken entdeckt.`;
    case 'puzzle_start':
      return `${name} hat Rätsel ${puzzleNumber(d.puzzleId)} begonnen.`;
    case 'puzzle_attempt':
      return d.correct
        ? `${name} hat bei Rätsel ${puzzleNumber(d.puzzleId)} „${String(d.input)}“ eingegeben – richtig!`
        : `${name} hat bei Rätsel ${puzzleNumber(d.puzzleId)} „${String(d.input)}“ versucht – leider falsch.`;
    case 'puzzle_hint': {
      const level = d.level === 'super' ? 'den Super-Hinweis' : `Hinweis ${String(d.level)}`;
      return `${name} hat bei Rätsel ${puzzleNumber(d.puzzleId)} ${level} ${d.free ? 'geschenkt bekommen' : 'gekauft'}.`;
    }
    case 'puzzle_solved':
      return d.solvedBy === 'help'
        ? `${name} hat Rätsel ${puzzleNumber(d.puzzleId)} gemeinsam mit Prof. Quill gelöst (${formatDuration(d.durationSec)}).`
        : `${name} hat Rätsel ${puzzleNumber(d.puzzleId)} im ${String(d.attempts)}. Versuch gelöst (${formatDuration(d.durationSec)}, +${String(d.points)} Punkte).`;
    case 'ending':
      return `${name} hat das Ende ${String(d.ending)} erreicht.`;
    case 'letter_opened':
      return `${name} hat den persönlichen Brief geöffnet.`;
    default:
      return `${name}: ${String(event.type)}`;
  }
}

/** Filter groups for the feed. */
export const EVENT_GROUPS: Record<string, { label: string; types: string[] }> = {
  all: { label: 'Alle', types: [] },
  choices: { label: 'Entscheidungen', types: ['choice', 'sorting_result', 'prologue_value', 'sorting_answer'] },
  puzzles: { label: 'Rätsel', types: ['puzzle_start', 'puzzle_attempt', 'puzzle_hint', 'puzzle_solved'] },
  progress: { label: 'Fortschritt', types: ['day_start', 'day_complete', 'ending', 'letter_opened'] },
  finds: { label: 'Funde', types: ['clue_found', 'item_found', 'spark_found'] },
  sessions: { label: 'Sitzungen', types: ['session_start'] },
};
