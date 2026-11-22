import type { Screen } from './store';

/**
 * The boot film always plays to its end (the owl reaches the Owlery), even when
 * loading is quicker. A screen change away from `boot` is held back here until
 * the film calls `finish()`; a later change overrides an earlier one.
 */
export class BootGate {
  private pending: Screen | null = null;
  private done = false;

  /** True if the change has to wait for the film. */
  hold(from: Screen, to: Screen): boolean {
    if (to === 'boot') {
      this.pending = null;
      this.done = false;
      return false;
    }
    if (from !== 'boot' || this.done) return false;
    this.pending = to;
    return true;
  }

  /** The screen waiting behind the film, if loading has finished. */
  get target(): Screen | null {
    return this.pending;
  }

  /** The film is over: let changes through and return the waiting screen. */
  finish(): Screen | null {
    this.done = true;
    const target = this.pending;
    this.pending = null;
    return target;
  }
}
