export type Route = 'overview' | 'feed' | 'decisions' | 'puzzles' | 'more' | 'users' | 'personal' | 'tools' | 'player';

export const TITLES: Record<Route, string> = {
  overview: 'Übersicht',
  feed: 'Eulenpost',
  decisions: 'Entscheidungen',
  puzzles: 'Rätsel',
  more: 'Mehr',
  users: 'Spieler verwalten',
  personal: 'Persönliches',
  tools: 'Werkzeuge',
  player: 'Spieler',
};

/** "#/admin/player/<uid>" → { route: 'player', param: '<uid>' } */
export function routeFromHash(hash = location.hash): { route: Route; param: string | null } {
  const [part, param] = hash.replace(/^#\/admin\/?/, '').split('/');
  const route = (part in TITLES ? part : 'overview') as Route;
  return { route, param: param ? decodeURIComponent(param) : null };
}

export function adminHref(route: Route, param?: string): string {
  if (route === 'overview') return '#/admin';
  return param ? `#/admin/${route}/${encodeURIComponent(param)}` : `#/admin/${route}`;
}
