/** "Mehr" tab [ADM-4]: player management, personal content, tools. */
export function MoreView() {
  return (
    <nav className="more-list">
      <a className="admin-card more-item" href="#/admin/users">
        <strong>Spieler verwalten</strong>
        <span className="admin-muted">Einladen, pausieren, zurücksetzen</span>
      </a>
      <div className="admin-card more-item disabled">
        <strong>Persönliches</strong>
        <span className="admin-muted">Briefe, Foto und persönliche Bausteine – folgt in Meilenstein 6</span>
      </div>
      <a className="admin-card more-item" href="#/admin/tools">
        <strong>Werkzeuge</strong>
        <span className="admin-muted">Version, Debug-Datum, Export</span>
      </a>
      <a className="admin-card more-item" href="#/">
        <strong>Zurück ins Spiel</strong>
        <span className="admin-muted">Dein eigener Test-Spielstand</span>
      </a>
    </nav>
  );
}
