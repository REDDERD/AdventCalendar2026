/** "Mehr" tab [ADM-4]: player management, personal content, tools. */
export function MoreView() {
  return (
    <nav className="more-list">
      <a className="admin-card more-item" href="#/admin/users">
        <strong>Spieler verwalten</strong>
        <span className="admin-muted">Einladen, pausieren, zurücksetzen</span>
      </a>
      <a className="admin-card more-item" href="#/admin/personal">
        <strong>Persönliches</strong>
        <span className="admin-muted">Düfte, Witze, Patronus, Spiegelfoto, Brief</span>
      </a>
      <a className="admin-card more-item" href="#/admin/tools">
        <strong>Werkzeuge</strong>
        <span className="admin-muted">Debug-Datum, ins Spiel springen, Export, Version</span>
      </a>
      <a className="admin-card more-item" href="#/">
        <strong>Zurück ins Spiel</strong>
        <span className="admin-muted">Dein eigener Test-Spielstand</span>
      </a>
    </nav>
  );
}
