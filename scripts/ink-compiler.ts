import fs from 'node:fs';
import path from 'node:path';
import { Compiler, CompilerOptions } from 'inkjs/full';

export const INK_DIR = path.resolve(import.meta.dirname, '../src/content/ink');
export const GENERATED_DIR = path.resolve(import.meta.dirname, '../src/content/generated');

export interface CatalogOption {
  option: string;
  cid: string;
  text: string;
}

export interface CatalogEntry {
  id: string;
  day: number | null;
  file: string;
  question: string;
  options: CatalogOption[];
}

export interface CompileResult {
  stories: Record<string, string>; // file stem -> compiled JSON
  catalog: CatalogEntry[];
  errors: string[];
  warnings: string[];
}

const CHOICE_RE = /^(\s*(?:[*+]\s*)+)(.*?)\[([^\]]*)\](.*)$/;
const CID_RE = /#\s*cid:\s*([\w.-]+)\s*/;
const CHOICE_POINT_RE = /^\s*#\s*choice_point:\s*(\S+)\s+(.+?)\s*$/;

/**
 * inkjs only exposes tags written *inside* the choice brackets as choice tags.
 * Authors write `* [Text] # cid: d07.letter.give` (Section 15.1), so the cid
 * tag is moved into the brackets before compiling.
 */
export function preprocessInk(source: string): string {
  return source
    .split('\n')
    .map((line) => {
      const m = line.match(CHOICE_RE);
      if (!m) return line;
      const [, bullets, before, inside, after] = m;
      const cid = after.match(CID_RE);
      if (!cid) return line;
      const rest = after.replace(CID_RE, '').trimEnd();
      return `${bullets}${before}[${inside} #cid: ${cid[1]}]${rest}`;
    })
    .join('\n');
}

export function dayFromFile(stem: string): number | null {
  if (stem === 'prologue') return 0;
  const m = stem.match(/^day(\d{2})$/);
  return m ? Number(m[1]) : null;
}

/** [INK-1] Collect all choice points and their options from an Ink source file. */
export function extractChoices(source: string, file: string): { entries: CatalogEntry[]; errors: string[] } {
  const entries: CatalogEntry[] = [];
  const errors: string[] = [];
  const byId = new Map<string, CatalogEntry>();
  const day = dayFromFile(file);
  source.split('\n').forEach((line, i) => {
    const cp = line.match(CHOICE_POINT_RE);
    if (cp) {
      const [, id, question] = cp;
      if (byId.has(id)) {
        errors.push(`${file}.ink:${i + 1}: duplicate choice_point ${id}`);
        return;
      }
      const entry: CatalogEntry = { id, day, file, question, options: [] };
      byId.set(id, entry);
      entries.push(entry);
      return;
    }
    const choice = line.match(CHOICE_RE);
    if (!choice) return;
    const cid = choice[4].match(CID_RE) ?? choice[3].match(CID_RE);
    if (!cid) return; // reported by content:lint
    const full = cid[1];
    const dot = full.lastIndexOf('.');
    const pointId = full.slice(0, dot);
    const option = full.slice(dot + 1);
    const entry = byId.get(pointId);
    if (!entry) {
      errors.push(`${file}.ink:${i + 1}: cid ${full} has no preceding choice_point ${pointId}`);
      return;
    }
    const text = (choice[2] + choice[3].replace(CID_RE, '')).replace(/\{[^}]*\}/g, '').trim();
    entry.options.push({ option, cid: full, text });
  });
  return { entries, errors };
}

export function listStoryFiles(): string[] {
  return fs
    .readdirSync(INK_DIR)
    .filter((f) => f.endsWith('.ink') && f !== 'globals.ink')
    .map((f) => f.replace(/\.ink$/, ''))
    .sort();
}

export function compileStory(stem: string): { json: string | null; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fileHandler = {
    ResolveInkFilename: (filename: string) => path.resolve(INK_DIR, filename),
    LoadInkFileContents: (filename: string) => preprocessInk(fs.readFileSync(filename, 'utf8')),
  };
  const source = preprocessInk(fs.readFileSync(path.join(INK_DIR, `${stem}.ink`), 'utf8'));
  const onMessage = (message: string, type: number) => {
    // ErrorType: 0 = Author, 1 = Warning, 2 = Error
    if (type === 2) errors.push(`${stem}.ink: ${message}`);
    else warnings.push(`${stem}.ink: ${message}`);
  };
  try {
    const compiler = new Compiler(source, new CompilerOptions(`${stem}.ink`, [], false, onMessage, fileHandler));
    const story = compiler.Compile();
    if (errors.length) return { json: null, errors, warnings };
    return { json: story.ToJson() ?? null, errors, warnings };
  } catch (e) {
    if (!errors.length) errors.push(`${stem}.ink: ${(e as Error).message}`);
    return { json: null, errors, warnings };
  }
}

export function compileAll(): CompileResult {
  const result: CompileResult = { stories: {}, catalog: [], errors: [], warnings: [] };
  for (const stem of listStoryFiles()) {
    const { json, errors, warnings } = compileStory(stem);
    result.errors.push(...errors);
    result.warnings.push(...warnings);
    if (json) result.stories[stem] = json;
    const source = fs.readFileSync(path.join(INK_DIR, `${stem}.ink`), 'utf8');
    const { entries, errors: catalogErrors } = extractChoices(source, stem);
    result.catalog.push(...entries);
    result.errors.push(...catalogErrors);
  }
  return result;
}

export function writeOutputs(result: CompileResult): void {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
  for (const [stem, json] of Object.entries(result.stories)) {
    fs.writeFileSync(path.join(GENERATED_DIR, `${stem}.json`), json);
  }
  fs.writeFileSync(
    path.join(GENERATED_DIR, 'choices.generated.json'),
    JSON.stringify(result.catalog, null, 2),
  );
}
