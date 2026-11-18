import { create } from 'zustand';
import { saveNow, scheduleSave } from '../services/SaveService';
import type { SaveDoc, UserDoc } from '../types';

export type Screen =
  | 'boot' | 'login' | 'blocked' | 'onboarding' | 'prologue'
  | 'calendar' | 'chapterCard' | 'scene' | 'puzzleIntro' | 'puzzle' | 'solution' | 'dayEnd'
  | 'ending' | 'letter' | 'credits';

export type BlockedReason = 'inactive' | 'unknown_user';

export interface Toast {
  id: number;
  text: string;
}

interface GameStore {
  screen: Screen;
  user: UserDoc | null;
  save: SaveDoc | null;
  blocked: BlockedReason | null;
  trunkOpen: boolean;
  toasts: Toast[];
  /** Day currently being played, null outside of a day. */
  activeDay: number | null;
  /** Bumped on every debug-date change so countdowns re-render. */
  clockVersion: number;

  setScreen: (screen: Screen) => void;
  setUser: (user: UserDoc | null) => void;
  setSave: (save: SaveDoc | null) => void;
  setBlocked: (reason: BlockedReason | null) => void;
  setTrunkOpen: (open: boolean) => void;
  setActiveDay: (day: number | null) => void;
  bumpClock: () => void;
  /** Mutate a copy of the save and persist it [DAY-4]. */
  updateSave: (mutate: (save: SaveDoc) => void, opts?: { immediate?: boolean }) => void;
  showToast: (text: string) => void;
  dismissToast: (id: number) => void;
}

let toastId = 0;

export const useStore = create<GameStore>((set, get) => ({
  screen: 'boot',
  user: null,
  save: null,
  blocked: null,
  trunkOpen: false,
  toasts: [],
  activeDay: null,
  clockVersion: 0,

  setScreen: (screen) => set({ screen }),
  setUser: (user) => set({ user }),
  setSave: (save) => set({ save }),
  setBlocked: (blocked) => set({ blocked }),
  setTrunkOpen: (trunkOpen) => set({ trunkOpen }),
  setActiveDay: (activeDay) => set({ activeDay }),
  bumpClock: () => set({ clockVersion: get().clockVersion + 1 }),
  updateSave: (mutate, opts) => {
    const current = get().save;
    if (!current) return;
    const next = structuredClone(current);
    mutate(next);
    next.updatedAt = Date.now();
    set({ save: next });
    if (opts?.immediate) saveNow(next);
    else scheduleSave(next);
  },
  showToast: (text) => {
    const id = ++toastId;
    set({ toasts: [...get().toasts, { id, text }] });
    setTimeout(() => get().dismissToast(id), 2600);
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

export const store = useStore;
