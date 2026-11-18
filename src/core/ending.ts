import type { EndingId } from '../types';

export const ESSENTIAL_CLUES = ['k02', 'k06', 'k07', 'k09', 'k10'] as const;

export interface EndingInput {
  accused: string;
  clues: readonly string[];
  trust_aldous: number;
  bond_ellis: number;
}

export function countEssentialClues(clues: readonly string[]): number {
  return ESSENTIAL_CLUES.filter((k) => clues.includes(k)).length;
}

/** [END-1] Evaluated in exactly this order. */
export function evaluateEnding({ accused, clues, trust_aldous, bond_ellis }: EndingInput): EndingId {
  const essential = countEssentialClues(clues);
  if (accused === 'aldous' && essential >= 3 && trust_aldous >= 1) return 'A';
  if (accused === 'aldous') return 'B';
  if (bond_ellis >= 4) return 'C_A';
  return 'C_B';
}
