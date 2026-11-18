import { APP_VERSION, BUILD_DATE } from '../config';

/**
 * Section 11: admin console, loaded as its own chunk under #/admin.
 * Views follow in M3 (users, overview, feed) and M6 (evaluation).
 */
export default function AdminApp() {
  return (
    <div className="admin">
      <header className="admin-header">
        <h1>Büro der Schulleitung</h1>
      </header>
      <main className="admin-main">
        <section className="admin-card">
          <p>Die Admin-Konsole entsteht in Meilenstein 3.</p>
          <p>
            <a href="#/">Zurück zum Spiel</a>
          </p>
        </section>
      </main>
      <footer className="admin-footer">
        Version {APP_VERSION} · Build {BUILD_DATE.slice(0, 16).replace('T', ' ')}
      </footer>
    </div>
  );
}
