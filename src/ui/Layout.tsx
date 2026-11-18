import type { ReactNode } from 'react';
import { useStore } from '../core/store';

interface Props {
  top?: ReactNode;
  bottom?: ReactNode;
  nav?: ReactNode;
  /** Hide points/sparks (login, prologue). */
  bare?: boolean;
}

/** Section 5.1: statusBar 24 · topScreen 192 · hinge 8 · bottomScreen 192 · navBar 32. */
export function Layout({ top, bottom, nav, bare }: Props) {
  return (
    <>
      <div className="region region-status">{!bare && <StatusBar />}</div>
      <div className="region region-top">
        {top}
        <Toasts />
      </div>
      <div className="region region-hinge" />
      <div className="region region-bottom">{bottom}</div>
      <div className="region region-nav">{nav}</div>
    </>
  );
}

function StatusBar() {
  const save = useStore((s) => s.save);
  const activeDay = useStore((s) => s.activeDay);
  const setTrunkOpen = useStore((s) => s.setTrunkOpen);
  if (!save) return null;
  return (
    <div className="statusbar">
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
