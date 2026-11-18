import { WORDS } from '../content/wordlist';

const UNIQUE_WORDS = [...new Set(WORDS)];

function randomInt(max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

/** [AUTH-6] Three words and a number, e.g. "zimt-eule-lumos-47". */
export function generatePassword(): string {
  const words: string[] = [];
  while (words.length < 3) {
    const word = UNIQUE_WORDS[randomInt(UNIQUE_WORDS.length)];
    if (!words.includes(word)) words.push(word);
  }
  return `${words.join('-')}-${10 + randomInt(90)}`;
}

/** Owl-name suggestion from a display name: "Jürgen M." → "juergen-m". */
export function suggestUsername(displayName: string): string {
  let name = displayName
    .trim()
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 16)
    .replace(/-+$/g, '');
  while (name.length < 3) name += 'x';
  return name;
}
