import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { loadPlayers, type AdminPlayer } from './data';
import { FeedView } from './views/Feed';
import { MoreView } from './views/More';
import { OverviewView } from './views/Overview';
import { PlaceholderView } from './views/Placeholder';
import { ToolsView } from './views/Tools';
import { UsersView } from './views/Users';

type Route = 'overview' | 'feed' | 'decisions' | 'puzzles' | 'more' | 'users' | 'tools';

const TABS: Array<[Route, string]> = [
  ['overview', 'Übersicht'],
  ['feed', 'Eulenpost'],
  ['decisions', 'Entscheidungen'],
  ['puzzles', 'Rätsel'],
  ['more', 'Mehr'],
];

const TITLES: Record<Route, string> = {
  overview: 'Übersicht',
  feed: 'Eulenpost',
  decisions: 'Entscheidungen',
  puzzles: 'Rätsel',
  more: 'Mehr',
  users: 'Spieler verwalten',
  tools: 'Werkzeuge',
};

/** Pages under "Mehr" keep the "Mehr" tab highlighted. */
const PARENT: Partial<Record<Route, Route>> = { users: 'more', tools: 'more' };

function routeFromHash(): Route {
  const part = location.hash.replace(/^#\/admin\/?/, '').split('/')[0];
  return (part in TITLES ? part : 'overview') as Route;
}

export function adminHref(route: Route): string {
  return route === 'overview' ? '#/admin' : `#/admin/${route}`;
}

/**
 * Section 11: admin console in its own chunk under #/admin [ADM-1].
 * Players are loaded on open and on pull-to-refresh [ADM-12].
 */
export default function AdminApp() {
  const [route, setRoute] = useState<Route>(routeFromHash);
  const [players, setPlayers] = useState<AdminPlayer[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      setPlayers(await loadPlayers());
    } catch (e) {
      console.error(e);
      setError('Daten konnten nicht geladen werden.');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const active = PARENT[route] ?? route;

  return (
    <div className="admin">
      <header className="admin-header">
        <div className="admin-kicker">Büro der Schulleitung</div>
        <h1>{TITLES[route]}</h1>
      </header>
      <PullToRefresh onRefresh={refresh} disabled={route === 'feed'}>
        {error && <div className="admin-error">{error}</div>}
        {route === 'overview' && <OverviewView players={players} />}
        {route === 'feed' && <FeedView players={players} />}
        {route === 'decisions' && <PlaceholderView text="Die Auswertung aller Entscheidungen folgt in Meilenstein 6." />}
        {route === 'puzzles' && <PlaceholderView text="Die Rätsel-Statistik folgt in Meilenstein 6." />}
        {route === 'more' && <MoreView />}
        {route === 'users' && <UsersView players={players} onChanged={refresh} />}
        {route === 'tools' && <ToolsView />}
      </PullToRefresh>
      <nav className="admin-tabs">
        {TABS.map(([id, label]) => (
          <a key={id} href={adminHref(id)} className={active === id ? 'active' : ''}>
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}

const PULL_PX = 70;

/** [ADM-12] Pull-to-refresh (the browser's own is disabled game-wide). */
function PullToRefresh({ onRefresh, disabled, children }: { onRefresh: () => Promise<void>; disabled?: boolean; children: ReactNode }) {
  const [pull, setPull] = useState(0);
  const [busy, setBusy] = useState(false);
  const [start, setStart] = useState<number | null>(null);

  return (
    <main
      className="admin-main"
      onTouchStart={(e) => {
        if (!disabled && e.currentTarget.scrollTop <= 0) setStart(e.touches[0].clientY);
      }}
      onTouchMove={(e) => {
        if (start !== null) setPull(Math.max(0, Math.min(120, e.touches[0].clientY - start)));
      }}
      onTouchEnd={async () => {
        const trigger = pull >= PULL_PX;
        setStart(null);
        setPull(0);
        if (trigger && !busy) {
          setBusy(true);
          await onRefresh();
          setBusy(false);
        }
      }}
    >
      {(pull > 0 || busy) && (
        <div className="admin-pull" style={{ height: busy ? 32 : pull / 2 }}>
          {busy ? 'Eulen fliegen …' : pull >= PULL_PX ? 'Loslassen zum Aktualisieren' : 'Ziehen zum Aktualisieren'}
        </div>
      )}
      {children}
      {!disabled && (
        <button type="button" className="admin-refresh" disabled={busy} onClick={async () => {
          setBusy(true);
          await onRefresh();
          setBusy(false);
        }}>
          Aktualisieren
        </button>
      )}
    </main>
  );
}
