import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { assets } from '../../src/assets/manifest';
import { CHARACTER_CARDS } from '../../src/content/characters';
import { metCharacters } from '../../src/core/encounters';
import { SPEAKER_NAMES } from '../../src/dialogue/speakers';
import { newSave } from '../../src/services/SaveService';

describe('Figuren (DECISIONS.md #80)', () => {
  it('lists every character who speaks in Ink exactly once, each with name and portrait', () => {
    const dir = path.resolve('src/content/ink');
    const speakers = new Set<string>();
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.ink'))) {
      for (const m of fs.readFileSync(path.join(dir, file), 'utf8').matchAll(/(?:^|[-*{:]\s*)([a-z_]+):\s/gm)) {
        if (SPEAKER_NAMES[m[1]] && m[1] !== 'player') speakers.add(m[1]);
      }
    }
    const ids = CHARACTER_CARDS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of speakers) expect(ids, id).toContain(id);
    for (const id of ids) {
      expect(SPEAKER_NAMES[id], id).toBeTruthy();
      expect(assets[`portrait.${id}`], id).toBeDefined();
    }
    expect(ids).toEqual(expect.arrayContaining(['wandmaker', 'hat']));
  });

  it('a character is met from the first diary line they speak; narration and the player do not count', () => {
    const save = newSave('u', 1);
    save.diary = [
      { day: 0, speaker: 'quill', text: 'a' },
      { day: 1, speaker: '', text: 'b' },
      { day: 1, speaker: 'ellis', text: 'c' },
      { day: 1, speaker: 'player', text: 'd' },
      { day: 4, speaker: 'aldous', text: 'e' },
      { day: 5, speaker: 'ellis', text: 'f' },
    ];
    expect([...metCharacters(save)]).toEqual([['quill', 0], ['ellis', 1], ['aldous', 4]]);
  });

  it('the wandmaker and the Sorting Hat count once their prologue screen is done', () => {
    const save = newSave('u', 1);
    expect(metCharacters(save).size).toBe(0);
    save.prologueDraft = { wand: 'phoenix' };
    expect([...metCharacters(save).keys()]).toEqual(['wandmaker']);
    save.prologueDraft = { wand: 'phoenix', sortingAnswers: ['ravenclaw'] };
    expect([...metCharacters(save).keys()]).toEqual(['wandmaker', 'hat']);
  });
});
