import { HOUSES, type HouseId } from '../types';

export interface SortingQuestion {
  question: string;
  answers: Record<HouseId, string>;
}

/** [HAT-1] Section 6.3 – five questions, one answer per house. */
export const SORTING_QUESTIONS: SortingQuestion[] = [
  {
    question: 'Ein Weg gabelt sich im Wald. Welchen nimmst du?',
    answers: {
      gryffindor: 'Den dunklen, aus dem Geräusche kommen',
      hufflepuff: 'Den, auf dem deine Freunde schon vorgegangen sind',
      ravenclaw: 'Den mit den alten Runensteinen',
      slytherin: 'Den, der als Abkürzung zum Ziel führt',
    },
  },
  {
    question: 'Eine Freundin hat bei einer Prüfung geschummelt. Was tust du?',
    answers: {
      gryffindor: 'Sie direkt darauf ansprechen',
      hufflepuff: 'Ihr helfen, es wiedergutzumachen',
      ravenclaw: 'Herausfinden, warum sie es nötig hatte',
      slytherin: 'Schweigen – aber sie schuldet dir was',
    },
  },
  {
    question: 'Welches Geschenk würde dich am meisten freuen?',
    answers: {
      gryffindor: 'Ein Ticket ins Abenteuer',
      hufflepuff: 'Ein Festessen mit allen Freunden',
      ravenclaw: 'Ein Buch, das es nur einmal gibt',
      slytherin: 'Ein Schlüssel zu einem geheimen Raum',
    },
  },
  {
    question: 'Wofür willst du in 100 Jahren bekannt sein?',
    answers: {
      gryffindor: 'Für meinen Mut',
      hufflepuff: 'Für meine Güte',
      ravenclaw: 'Für meine Entdeckungen',
      slytherin: 'Für das, was ich erreicht habe',
    },
  },
  {
    question: 'Du findest ein Kästchen mit der Aufschrift „Nicht öffnen“.',
    answers: {
      gryffindor: 'Öffnen. Sofort.',
      hufflepuff: 'Dem Besitzer zurückbringen',
      ravenclaw: 'Erst das Schloss studieren',
      slytherin: 'Aufheben – wer weiß, wofür es gut ist',
    },
  },
];

export const POINTS_PER_ANSWER = 2;
/** Index of the tie-breaking question ("Frage 4"). */
export const TIEBREAK_QUESTION = 3;

export function scoreSorting(answers: readonly HouseId[]): Record<HouseId, number> {
  const score = Object.fromEntries(HOUSES.map((h) => [h, 0])) as Record<HouseId, number>;
  for (const house of answers) score[house] += POINTS_PER_ANSWER;
  return score;
}

/**
 * [HAT-1] Highest score wins. Tie: the answer to question 4 decides. If that
 * house is not among the tied ones, the most recent answer among them decides
 * (DECISIONS.md #19).
 */
export function evaluateSorting(answers: readonly HouseId[]): HouseId {
  if (answers.length !== SORTING_QUESTIONS.length) throw new Error('Five answers required');
  const score = scoreSorting(answers);
  const best = Math.max(...Object.values(score));
  const tied = HOUSES.filter((h) => score[h] === best);
  if (tied.length === 1) return tied[0];
  const q4 = answers[TIEBREAK_QUESTION];
  if (tied.includes(q4)) return q4;
  for (let i = answers.length - 1; i >= 0; i--) if (tied.includes(answers[i])) return answers[i];
  return tied[0];
}

/** Fisher–Yates; the answer order is random per question [HAT-1]. */
export function shuffled<T>(list: readonly T[], rand: () => number = Math.random): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** [HAT-2] What the hat says (brummig, weise, augenzwinkernd). */
export const HAT_LINES = {
  intro: [
    'Na, wen haben wir denn da? Ein Gast aus der Ferne, mitten im Winter …',
    'Setz dich. Ich beiße nicht. Ich schaue nur ein bisschen in deinen Kopf.',
  ],
  ponder: 'Hmm … schwierig, sehr schwierig …',
  traits: {
    gryffindor: 'Ich sehe Mut. Eine Menge Mut. Und ein bisschen Ungeduld.',
    hufflepuff: 'Ich sehe ein großes Herz. Und einen gesunden Appetit.',
    ravenclaw: 'Ich sehe Neugier. Du willst immer wissen, warum.',
    slytherin: 'Ich sehe Ehrgeiz. Du weißt genau, wohin du willst.',
  } satisfies Record<HouseId, string>,
  announce: 'Dann also …',
  wish: 'Oder hast du einen anderen Wunsch?',
  accepted: 'Eine gute Wahl. Ich irre mich selten. Fast nie.',
  overruled: 'Du weißt, was du willst. Das allein sagt schon viel über dich.',
};
