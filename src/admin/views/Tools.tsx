import { useState } from 'react';
import { APP_VERSION, BUILD_DATE } from '../../config';
import { LAST_DAY } from '../../content/schedule';
import { startDay } from '../../core/flow';
import { useStore } from '../../core/store';
import { debugDateActive, now, setDebugDate } from '../../services/UnlockService';
import { exportAll } from '../data';

function toLocalInput(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Section 11.3 admin.tools: debug date and day jump for the own account, export, version. */
export function ToolsView() {
  const save = useStore((s) => s.save);
  const bumpClock = useStore((s) => s.bumpClock);
  const [value, setValue] = useState(() => toLocalInput(now()));
  const [day, setDay] = useState(1);
  const [, force] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const applyDate = (ms: number | null) => {
    setDebugDate(ms);
    bumpClock();
    force((n) => n + 1);
  };

  const jump = () => {
    location.hash = '#/';
    void startDay(day);
  };

  const download = async () => {
    setExporting(true);
    setStatus(null);
    try {
      const data = await exportAll();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `adventsuhr-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      const counts = ['users', 'saves', 'events'].map((k) => Object.keys((data[k] as object) ?? {}).length);
      setStatus({ ok: true, text: `Exportiert: ${counts[0]} Konten, ${counts[1]} Spielstände, ${counts[2]} Ereignisse.` });
    } catch (e) {
      console.error(e);
      setStatus({ ok: false, text: 'Export fehlgeschlagen.' });
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <section className="admin-card admin-form">
        <h2>Debug-Datum {debugDateActive() ? '(aktiv)' : ''}</h2>
        <p className="admin-muted">Nur für dein eigenes Konto auf diesem Gerät. Die Zeit läuft ab dem gesetzten Moment weiter.</p>
        <input type="datetime-local" aria-label="Debug-Datum" value={value} onChange={(e) => setValue(e.target.value)} />
        <div className="admin-row">
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => applyDate(new Date(value).getTime())}>
            Setzen
          </button>
          <button type="button" className="admin-btn" onClick={() => applyDate(null)}>
            Echte Zeit
          </button>
        </div>
      </section>

      <section className="admin-card admin-form">
        <h2>Ins Spiel springen</h2>
        {save?.profile ? (
          <div className="admin-row">
            <select aria-label="Tag" value={day} onChange={(e) => setDay(Number(e.target.value))}>
              {Array.from({ length: LAST_DAY }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  Tag {d}
                </option>
              ))}
            </select>
            <button type="button" className="admin-btn admin-btn-primary" onClick={jump}>
              Tag starten
            </button>
          </div>
        ) : (
          <p className="admin-muted">Spiele zuerst den Prolog in deinem eigenen Spielstand.</p>
        )}
      </section>

      <section className="admin-card admin-form">
        <h2>Export</h2>
        <p className="admin-muted">Alle Konten, Spielstände, Ereignisse und persönlichen Inhalte als JSON-Datei.</p>
        <button type="button" className="admin-btn admin-btn-primary" disabled={exporting} onClick={download}>
          {exporting ? 'Eulen sammeln alles ein …' : 'Alle Daten herunterladen'}
        </button>
        {status && <div className={status.ok ? 'admin-ok' : 'admin-error'}>{status.text}</div>}
      </section>

      <section className="admin-card">
        <p>
          App-Version <strong>{APP_VERSION}</strong>
          <br />
          Build {BUILD_DATE ? new Date(BUILD_DATE).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' }) : '–'}
        </p>
      </section>
    </>
  );
}
