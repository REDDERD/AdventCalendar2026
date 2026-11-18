import { InkList, Story } from 'inkjs';
import type { InkVarValue } from '../types';
import { findTag, parseSpeaker, parseTag, splitCid, type ParsedTag } from './tags';

export const HOUSE_NAMES: Record<string, string> = {
  gryffindor: 'Gryffindor',
  hufflepuff: 'Hufflepuff',
  ravenclaw: 'Ravenclaw',
  slytherin: 'Slytherin',
};

/** Section 8.1: values outside these ranges are clamped. */
export const VAR_RANGES: Record<string, [number, number]> = {
  bond_ellis: [0, 5],
  trust_theo: [-2, 3],
  trust_maren: [-2, 3],
  trust_grimsby: [-2, 3],
  trust_aldous: [-2, 3],
};

const LIST_VARS = ['clues', 'items'] as const;

export interface Found {
  clues: string[];
  items: string[];
}

export interface ChoiceOption {
  index: number;
  text: string;
  cid: string | null;
}

export interface ChoicePoint {
  id: string;
  question: string;
}

interface StepBase {
  /** Tags of every Ink line consumed for this step, in order. */
  tags: ParsedTag[];
  /** Clues/items that appeared in Ink state during this step. */
  found: Found;
}

export type Step =
  | (StepBase & { kind: 'line'; speaker: string | null; text: string })
  | (StepBase & { kind: 'choices'; choicePoint: ChoicePoint | null; options: ChoiceOption[] })
  | (StepBase & { kind: 'puzzle'; puzzleId: string })
  | (StepBase & { kind: 'ending' })
  | (StepBase & { kind: 'end' });

export interface ChoiceMade {
  cid: string | null;
  pointId: string | null;
  option: string | null;
  label: string;
}

export interface RunnerHooks {
  /** [ARC-4] personal(key) */
  personal: (key: string) => string;
  /** Puzzle tags are only acted on once; resolved puzzles are skipped [ARC-3]. */
  isPuzzleResolved: (puzzleId: string) => boolean;
}

/**
 * Runs one day's Ink story [ARC-2] [ARC-3].
 *
 * Before every Continue() the Ink state is snapshotted. When a line carries a
 * tag the app must act on *before* the line is evaluated (`# puzzle`,
 * `# ending`), the snapshot is restored so that conditions such as
 * `last_puzzle_first_try` are evaluated after the app has updated them.
 */
export class DialogueRunner {
  readonly story: Story;
  private hooks: RunnerHooks;
  private known: Found = { clues: [], items: [] };
  private choicePoint: ChoicePoint | null = null;
  /** Ink state from which the current step can be reproduced exactly. */
  checkpoint: string;

  constructor(storyJson: string | object, hooks: RunnerHooks) {
    this.story = new Story(storyJson as string);
    this.hooks = hooks;
    this.story.onError = (message) => console.error(`[ink] ${message}`);
    this.bindExternals();
    this.checkpoint = this.story.state.toJson();
  }

  /** Start a day at its knot with the saved variables of previous days. */
  start(knot: string, vars: Record<string, InkVarValue>): void {
    this.setVars(vars);
    this.story.ChoosePathString(knot);
    this.known = this.readFound();
    this.checkpoint = this.story.state.toJson();
  }

  /**
   * Resume an interrupted day. `knownVars` are the variables saved after the
   * last step, used as baseline so found clues are not reported twice.
   */
  resume(inkState: string, knownVars: Record<string, InkVarValue>): void {
    this.story.state.LoadJson(inkState);
    this.known = {
      clues: asList(knownVars.clues),
      items: asList(knownVars.items),
    };
    this.checkpoint = inkState;
  }

  next(): Step {
    const story = this.story;
    const tags: ParsedTag[] = [];
    this.checkpoint = story.state.toJson();

    while (story.canContinue) {
      const before = story.state.toJson();
      const raw = story.Continue() ?? '';
      const lineTags = (story.currentTags ?? []).map(parseTag);

      const puzzle = findTag(lineTags, 'puzzle');
      if (puzzle && !this.hooks.isPuzzleResolved(puzzle.value)) {
        story.state.LoadJson(before);
        return { kind: 'puzzle', puzzleId: puzzle.value, tags, found: this.diffFound() };
      }
      if (findTag(lineTags, 'ending') && !this.getVar('ending')) {
        story.state.LoadJson(before);
        return { kind: 'ending', tags, found: this.diffFound() };
      }

      this.clamp();
      this.applyTagEffects(lineTags);
      tags.push(...lineTags.filter((t) => t.key !== 'puzzle' && t.key !== 'ending'));

      const cp = findTag(lineTags, 'choice_point');
      if (cp) {
        const space = cp.value.indexOf(' ');
        this.choicePoint = space < 0
          ? { id: cp.value, question: '' }
          : { id: cp.value.slice(0, space), question: cp.value.slice(space + 1).trim() };
      }

      const text = raw.trim();
      if (text) {
        const { speaker, text: body } = parseSpeaker(text);
        return { kind: 'line', speaker, text: body, tags, found: this.diffFound() };
      }
    }

    if (story.currentChoices.length > 0) {
      const options = story.currentChoices.map((c, index) => {
        const cid = (c.tags ?? []).map(parseTag).find((t) => t.key === 'cid');
        return { index, text: c.text, cid: cid?.value ?? null };
      });
      return { kind: 'choices', choicePoint: this.choicePoint, options, tags, found: this.diffFound() };
    }
    return { kind: 'end', tags, found: this.diffFound() };
  }

  choose(index: number): ChoiceMade {
    const choice = this.story.currentChoices[index];
    if (!choice) throw new Error(`No choice with index ${index}`);
    const cidTag = (choice.tags ?? []).map(parseTag).find((t) => t.key === 'cid');
    this.story.ChooseChoiceIndex(index);
    const made: ChoiceMade = { cid: null, pointId: null, option: null, label: choice.text };
    if (cidTag) {
      const { pointId, option } = splitCid(cidTag.value);
      Object.assign(made, { cid: cidTag.value, pointId, option });
    }
    this.choicePoint = null;
    this.checkpoint = this.story.state.toJson();
    return made;
  }

  getVar(name: string): InkVarValue | undefined {
    const value = this.story.variablesState.$(name);
    if (value instanceof InkList) return listNames(value);
    if (value === null || value === undefined) return undefined;
    return value as InkVarValue;
  }

  setVar(name: string, value: InkVarValue): void {
    if (!this.hasVar(name)) return;
    if (Array.isArray(value)) {
      const current = this.story.variablesState.$(name) as InkList;
      let list = current.Without(current);
      for (const item of value) list = list.Union(InkList.FromString(item, this.story));
      this.story.variablesState.$(name, list);
    } else {
      this.story.variablesState.$(name, value);
    }
  }

  getVars(): Record<string, InkVarValue> {
    const vars: Record<string, InkVarValue> = {};
    for (const name of this.varNames()) {
      const value = this.getVar(name);
      if (value !== undefined) vars[name] = value;
    }
    return vars;
  }

  setVars(vars: Record<string, InkVarValue>): void {
    for (const [name, value] of Object.entries(vars)) this.setVar(name, value);
    this.clamp();
  }

  private varNames(): string[] {
    // inkjs keeps globals in a private map; it is the only way to enumerate them.
    const globals = (this.story.variablesState as unknown as { _globalVariables: Map<string, unknown> })
      ._globalVariables;
    return [...globals.keys()];
  }

  private hasVar(name: string): boolean {
    return this.varNames().includes(name);
  }

  private clamp(): void {
    for (const [name, [min, max]] of Object.entries(VAR_RANGES)) {
      const value = this.getVar(name);
      if (typeof value !== 'number') continue;
      const clamped = Math.min(max, Math.max(min, value));
      if (clamped !== value) this.story.variablesState.$(name, clamped);
    }
  }

  /** `# clue: k01` / `# item: lantern` add to the Ink lists (Section 15.1). */
  private applyTagEffects(tags: ParsedTag[]): void {
    for (const tag of tags) {
      const list = tag.key === 'clue' ? 'clues' : tag.key === 'item' ? 'items' : null;
      if (!list || !tag.value) continue;
      const current = asList(this.getVar(list));
      if (!current.includes(tag.value)) this.setVar(list, [...current, tag.value]);
    }
  }

  private readFound(): Found {
    return { clues: asList(this.getVar('clues')), items: asList(this.getVar('items')) };
  }

  private diffFound(): Found {
    const now = this.readFound();
    const found: Found = { clues: [], items: [] };
    for (const key of LIST_VARS) {
      found[key] = now[key].filter((id) => !this.known[key].includes(id));
    }
    this.known = now;
    return found;
  }

  private bindExternals(): void {
    const s = this.story;
    s.BindExternalFunction('personal', (key: string) => this.hooks.personal(String(key)), true);
    s.BindExternalFunction('house_name', () => HOUSE_NAMES[String(this.getVar('house'))] ?? '', true);
    s.BindExternalFunction(
      'pronoun_form',
      (f: string, m: string, n: string) => {
        const p = this.getVar('pronoun');
        return p === 'f' ? f : p === 'm' ? m : n;
      },
      true,
    );
    s.BindExternalFunction('has_clue', (id: string) => asList(this.getVar('clues')).includes(String(id)), true);
  }
}

function listNames(list: InkList): string[] {
  return list.orderedItems.map((kv) => kv.Key.itemName ?? '').filter(Boolean);
}

function asList(value: InkVarValue | undefined): string[] {
  return Array.isArray(value) ? value : [];
}
