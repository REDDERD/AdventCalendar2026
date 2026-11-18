import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/** Section 12 */
export interface PersonalDoc {
  amortentiaScents?: string[];
  insideJokes?: string[];
  patronus?: string;
  favoriteSweet?: string;
  mirrorPhoto?: string;
  letter?: string;
  letterSignature?: string;
  surprise?: string;
}

/** Neutral defaults used when a field is missing. */
export const PERSONAL_DEFAULTS: Record<string, string> = {
  amortentiaScents: 'Zimt, frisches Pergament, Kaminfeuer',
  insideJokes: '',
  insideJoke1: '',
  insideJoke2: '',
  patronus: 'ein Fuchs',
  favoriteSweet: 'Schokofrosch',
  surprise: '',
};

let cache: PersonalDoc | null = null;

/** [PRS-3] Loaded when a day starts. Missing access or offline → defaults. */
export async function loadPersonal(uid: string): Promise<PersonalDoc> {
  try {
    const snap = await getDoc(doc(db, 'personal', uid));
    cache = snap.exists() ? (snap.data() as PersonalDoc) : {};
  } catch (e) {
    console.warn('Personal content unavailable', e);
    cache = cache ?? {};
  }
  return cache;
}

export function getPersonal(): PersonalDoc {
  return cache ?? {};
}

/** String value for Ink's `personal(key)` [ARC-4]. */
export function personalValue(key: string): string {
  const p = getPersonal();
  switch (key) {
    case 'amortentiaScents':
      return p.amortentiaScents?.filter(Boolean).length
        ? joinGerman(p.amortentiaScents.filter(Boolean))
        : PERSONAL_DEFAULTS.amortentiaScents;
    case 'insideJoke1':
      return p.insideJokes?.[0] ?? '';
    case 'insideJoke2':
      return p.insideJokes?.[1] ?? '';
    case 'patronus':
    case 'favoriteSweet':
    case 'surprise':
    case 'letterSignature':
      return p[key] || PERSONAL_DEFAULTS[key] || '';
    default:
      return PERSONAL_DEFAULTS[key] ?? '';
  }
}

function joinGerman(parts: string[]): string {
  if (parts.length <= 1) return parts.join('');
  return `${parts.slice(0, -1).join(', ')} und ${parts[parts.length - 1]}`;
}
