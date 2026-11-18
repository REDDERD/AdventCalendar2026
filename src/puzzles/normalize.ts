/** [PZL-1] Lowercase, umlauts transliterated, whitespace and punctuation removed. */
export function normalizeAnswer(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^\p{L}\p{N}]/gu, '');
}

export function matchesAnswer(input: string, solutions: readonly string[]): boolean {
  const normalized = normalizeAnswer(input);
  return normalized.length > 0 && solutions.some((s) => normalizeAnswer(s) === normalized);
}
