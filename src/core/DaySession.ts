import { resolveDay } from '../content/schedule';
import { DialogueRunner, type Step } from '../dialogue/DialogueRunner';
import { parseEmote, parseShow, parseSpark, type ParsedTag } from '../dialogue/tags';
import { loadStory, storyStem } from '../services/ContentService';
import { logEvent } from '../services/EventLogger';
import { loadPersonal, personalValue } from '../services/PersonalService';
import { now } from '../services/UnlockService';
import type { SaveDoc, StageState } from '../types';
import { evaluateEnding, countEssentialClues } from './ending';
import { store, type Screen } from './store';

export interface StepEffects {
  toasts: string[];
  emotes: Array<{ id: string; emote: string }>;
  sfx: string[];
}

export interface DaySummary {
  clues: string[];
  items: string[];
  sparks: number;
}

function screenForStep(step: Step): Screen {
  return step.kind === 'puzzle' ? 'puzzleIntro' : 'scene';
}

/** Controller for the day being played: Ink runner, stage, saving and events. */
export class DaySession {
  static current: DaySession | null = null;
  /** Summary of the day just completed, for the dayEnd screen. */
  static lastSummary: (DaySummary & { day: number }) | null = null;

  readonly day: number;
  readonly runner: DialogueRunner;
  stage: StageState;
  summary: DaySummary = { clues: [], items: [], sparks: 0 };
  lastStep: Step | null = null;

  private constructor(day: number, runner: DialogueRunner, stage: StageState) {
    this.day = day;
    this.runner = runner;
    this.stage = stage;
  }

  /** Start or resume a day. Resumes exactly from `progress.current` [DAY-4]. */
  static async begin(day: number): Promise<DaySession> {
    const { save } = store.getState();
    if (!save) throw new Error('No save loaded');
    const [storyJson] = await Promise.all([loadStory(day), loadPersonal(save.uid)]);
    const runner = new DialogueRunner(storyJson, {
      personal: personalValue,
      isPuzzleResolved: (id) => store.getState().save?.puzzles[id]?.solved === true,
    });

    const current = save.progress.current;
    let session: DaySession;
    // The prologue's non-Ink steps keep `current` with an empty inkState.
    if (current && current.day === day && current.inkState) {
      runner.resume(current.inkState, save.vars);
      session = new DaySession(day, runner, current.stage ?? defaultStage(day, save.vars.route));
    } else {
      runner.start(storyStem(day), save.vars);
      session = new DaySession(day, runner, defaultStage(day, save.vars.route));
      const alreadyStarted = String(day) in save.progress.dayStartedAt;
      const startedAt = now();
      store.getState().updateSave(
        (s) => {
          if (!alreadyStarted) s.progress.dayStartedAt[String(day)] = startedAt;
          s.progress.current = {
            day,
            screen: day === 0 ? 'prologue.train' : 'chapterCard',
            inkState: runner.checkpoint,
            stage: session.stage,
          };
        },
        { immediate: true },
      );
      if (!alreadyStarted) logEvent('day_start', day);
    }
    DaySession.current = session;
    store.getState().setActiveDay(day);
    return session;
  }

  advance(): { step: Step; effects: StepEffects } {
    const step = this.runner.next();
    this.lastStep = step;
    const effects = this.applyTags(step.tags);

    for (const id of step.found.clues) {
      logEvent('clue_found', this.day, { id });
      this.summary.clues.push(id);
    }
    for (const id of step.found.items) {
      logEvent('item_found', this.day, { id });
      this.summary.items.push(id);
    }

    store.getState().updateSave((s) => {
      if (step.kind === 'line') {
        const last = s.diary[s.diary.length - 1];
        const entry = { day: this.day, speaker: step.speaker ?? '', text: step.text };
        if (!last || last.day !== entry.day || last.text !== entry.text) s.diary.push(entry);
      }
      this.persistInto(s, screenForStep(step), step.kind === 'puzzle' ? step.puzzleId : undefined);
    });
    return { step, effects };
  }

  choose(index: number): void {
    const made = this.runner.choose(index);
    // [DEC-5] [EVT-1]
    logEvent('choice', this.day, { cid: made.pointId, option: made.option, label: made.label });
    store.getState().updateSave((s) => this.persistInto(s, 'scene'), { immediate: true });
  }

  /** [ARC-3] Called before the story continues after a puzzle. */
  resolvePuzzle(firstTry: boolean): void {
    this.runner.setVar('last_puzzle_first_try', firstTry);
    this.runner.checkpoint = this.runner.story.state.toJson();
    store.getState().updateSave((s) => this.persistInto(s, 'scene'), { immediate: true });
  }

  /** [END-1] `# ending` tag on day 24. */
  resolveEnding(): void {
    const vars = this.runner.getVars();
    const clues = Array.isArray(vars.clues) ? vars.clues : [];
    const accused = String(vars.accused ?? '');
    const ending = evaluateEnding({
      accused,
      clues,
      trust_aldous: Number(vars.trust_aldous ?? 0),
      bond_ellis: Number(vars.bond_ellis ?? 0),
    });
    this.runner.setVar('ending', ending);
    this.runner.checkpoint = this.runner.story.state.toJson();
    logEvent('ending', this.day, { ending, essentialClues: countEssentialClues(clues), accused });
    store.getState().updateSave(
      (s) => {
        s.ending = ending;
        this.persistInto(s, 'scene');
      },
      { immediate: true },
    );
  }

  collectSpark(id: string): void {
    this.stage = { ...this.stage, sparks: this.stage.sparks.filter((s) => s.id !== id) };
    if (store.getState().save?.foundSparks.includes(id)) return;
    this.summary.sparks++;
    logEvent('spark_found', this.day, { id });
    store.getState().updateSave((s) => {
      s.sparks += 1;
      s.foundSparks.push(id);
      if (s.progress.current) s.progress.current.stage = this.stage;
    });
  }

  setScreen(screen: Screen, puzzleId?: string): void {
    store.getState().updateSave((s) => this.persistInto(s, screen, puzzleId));
  }

  /**
   * End the Ink part without completing the day (prologue: the train scene is
   * followed by the sorting and reveal screens).
   */
  leaveScene(next: Screen): void {
    store.getState().updateSave(
      (s) => {
        s.vars = this.runner.getVars();
        s.progress.current = { day: this.day, screen: next, inkState: '' };
      },
      { immediate: true },
    );
    DaySession.current = null;
  }

  complete(): void {
    const { save } = store.getState();
    const startedAt = save?.progress.dayStartedAt[String(this.day)];
    const finishedAt = now();
    const durationSec = startedAt ? Math.round((finishedAt - startedAt) / 1000) : null;
    store.getState().updateSave(
      (s) => {
        s.vars = this.runner.getVars();
        if (!s.progress.completedDays.includes(this.day)) s.progress.completedDays.push(this.day);
        s.progress.dayCompletedAt[String(this.day)] = finishedAt;
        s.progress.current = null;
      },
      { immediate: true },
    );
    logEvent('day_complete', this.day, { durationSec });
    DaySession.lastSummary = { ...this.summary, day: this.day };
    DaySession.current = null;
    store.getState().setActiveDay(null);
  }

  private persistInto(s: SaveDoc, screen: Screen, puzzleId?: string): void {
    const inPuzzle = screen === 'puzzleIntro' || screen === 'puzzle' || screen === 'solution';
    s.vars = this.runner.getVars();
    s.progress.current = {
      day: this.day,
      screen: this.day === 0 && screen === 'scene' ? 'prologue.train' : screen,
      inkState: this.runner.checkpoint,
      stage: this.stage,
      puzzleId: puzzleId ?? (inPuzzle ? s.progress.current?.puzzleId : undefined),
    };
  }

  private applyTags(tags: ParsedTag[]): StepEffects {
    const effects: StepEffects = { toasts: [], emotes: [], sfx: [] };
    let stage = this.stage;
    const found = store.getState().save?.foundSparks ?? [];
    for (const { key, value } of tags) {
      switch (key) {
        case 'bg':
          stage = { ...stage, bg: value, actors: [], sparks: [], photo: null };
          break;
        case 'music':
          stage = { ...stage, music: value };
          break;
        case 'show': {
          const actor = parseShow(value);
          const actors = stage.actors.filter((a) => a.id !== actor.id && a.pos !== actor.pos);
          stage = { ...stage, actors: [...actors, actor] };
          break;
        }
        case 'hide':
          stage = { ...stage, actors: stage.actors.filter((a) => a.id !== value) };
          break;
        case 'spark': {
          const spark = parseSpark(value);
          if (!found.includes(spark.id) && !stage.sparks.some((s) => s.id === spark.id)) {
            stage = { ...stage, sparks: [...stage.sparks, spark] };
          }
          break;
        }
        case 'emote':
          effects.emotes.push(parseEmote(value));
          break;
        case 'photo':
          stage = { ...stage, photo: value === 'off' ? null : value };
          break;
        case 'toast':
          effects.toasts.push(value);
          break;
        case 'sfx':
          effects.sfx.push(value);
          break;
      }
    }
    this.stage = stage;
    return effects;
  }
}

function defaultStage(day: number, route: unknown): StageState {
  const location = day === 0 ? 'letter' : resolveDay(day, typeof route === 'string' ? route : undefined).location;
  return { bg: location, music: null, actors: [], sparks: [] };
}
