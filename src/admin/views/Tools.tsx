import { APP_VERSION, BUILD_DATE } from '../../config';

/** Section 11.3 admin.tools – version now; debug date in the game's trunk; export follows in M6. */
export function ToolsView() {
  return (
    <section className="admin-card">
      <p>
        App-Version <strong>{APP_VERSION}</strong>
        <br />
        Build {BUILD_DATE ? new Date(BUILD_DATE).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' }) : '–'}
      </p>
      <p className="admin-muted">
        Debug-Datum und „Tag direkt starten“ findest du im Spiel unter Truhe → Optionen. Der Datenexport folgt in Meilenstein 6.
      </p>
    </section>
  );
}
