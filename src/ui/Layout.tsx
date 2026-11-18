import type { ReactNode } from 'react';
import { useStore } from '../core/store';

interface Props {
  children?: ReactNode;
  /** Hide the status bar (login, prologue). */
  bare?: boolean;
  className?: string;
}

/**
 * One big screen (DECISIONS.md #32): status bar (24) on top, the screen body
 * fills the rest of the stage height.
 */
export function Layout({ children, bare, className }: Props) {
  return (
    <div className="layout">
      {!bare && <StatusBar />}
      <div className={`screen-body ${className ?? ''}`}>
        {children}
        <Toasts />
      </div>
    </div>
  );
}

function StatusBar() {
  const save = useStore((s) => s.save);
  const activeDay = useStore((s) => s.activeDay);
  const setTrunkOpen = useStore((s) => s.setTrunkOpen);
  return (
    <div className="statusbar">
      {save && (
        <>
          <span className="stat" aria-label="Hauspunkte">
            <span className="stat-icon stat-points" /> {save.housePoints}
          </span>
          <span className="stat" aria-label="Zauberfunken">
            <span className="stat-icon stat-sparks" /> {save.sparks}
          </span>
          <span className="stat-day">{activeDay ? `Tag ${activeDay}` : ''}</span>
          <button type="button" className="trunk-btn" onClick={() => setTrunkOpen(true)}>
            Truhe
          </button>
        </>
      )}
    </div>
  );
}

function Toasts() {
  const toasts = useStore((s) => s.toasts);
  return (
    <div className="toasts">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.text}
        </div>
      ))}
    </div>
  );
}
