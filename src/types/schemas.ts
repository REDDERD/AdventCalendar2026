import { z } from 'zod';

const house = z.enum(['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin']);

export const userDocSchema = z.object({
  uid: z.string(),
  username: z.string(),
  displayName: z.string(),
  role: z.enum(['admin', 'player']),
  active: z.boolean(),
  isTest: z.boolean().default(false),
  runId: z.number().int().min(1).default(1),
  createdAt: z.number().default(0),
  lastSeenAt: z.number().nullable().default(null),
  note: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string(),
  pronoun: z.enum(['f', 'm', 'n']),
  look: z.object({
    build: z.string().default('slim'),
    skin: z.string(),
    hair: z.string(),
    hairColor: z.string(),
    eyes: z.string(),
    glasses: z.string(),
    accessory: z.string(),
    sweater: z.string(),
    bottom: z.string().default('pants'),
  }),
  wand: z.enum(['phoenix', 'dragon', 'unicorn']),
  pet: z.enum(['owl', 'cat', 'toad']),
  hatSuggestion: house,
  house,
  hatOverruled: z.boolean(),
  sortingAnswers: z.array(house),
});

const inkVar = z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]);

const prologueDraftSchema = profileSchema.partial();

export const saveDocSchema = z.object({
  uid: z.string(),
  runId: z.number(),
  schemaVersion: z.literal(1),
  profile: profileSchema.nullable(),
  prologueDraft: prologueDraftSchema.optional(),
  vars: z.record(z.string(), inkVar),
  progress: z.object({
    completedDays: z.array(z.number()),
    current: z
      .object({
        day: z.number(),
        screen: z.string(),
        inkState: z.string(),
        puzzleId: z.string().optional(),
        stage: z
          .object({
            bg: z.string().nullable(),
            music: z.string().nullable(),
            actors: z.array(z.object({ id: z.string(), pos: z.enum(['left', 'center', 'right']) })),
            sparks: z.array(z.object({ id: z.string(), x: z.number(), y: z.number() })),
          })
          .optional(),
      })
      .nullable(),
    dayStartedAt: z.record(z.string(), z.number()),
    dayCompletedAt: z.record(z.string(), z.number()),
  }),
  puzzles: z.record(
    z.string(),
    z.object({
      solved: z.boolean(),
      solvedBy: z.enum(['self', 'help']).optional(),
      attempts: z.number(),
      hintsBought: z.array(z.number()),
      points: z.number(),
      durationSec: z.number().optional(),
      startedAt: z.number().optional(),
      helpDeclinedAt: z.number().optional(),
    }),
  ),
  housePoints: z.number(),
  sparks: z.number(),
  foundSparks: z.array(z.string()),
  diary: z.array(z.object({ day: z.number(), speaker: z.string(), text: z.string() })),
  ending: z.enum(['A', 'B', 'C_A', 'C_B']).nullable(),
  settings: z.object({
    textSpeed: z.enum(['slow', 'normal', 'instant']),
    music: z.boolean(),
    sfx: z.boolean(),
  }),
  updatedAt: z.number(),
});
