import { useState } from 'react';
import { APP_VERSION } from '../../config';
import { startDay } from '../../core/flow';
import { useStore } from '../../core/store';
import { logout } from '../../services/AuthService';
import { flushSave } from '../../services/SaveService';
import { resetProgress } from '../../services/ResetService';
import { debugDateActive, now, setDebugDate } from '../../services/UnlockService';
import type { Settings } from '../../types';
import { PixelButton } from '../../ui/PixelButton';

const SPEEDS: Array<[Settings['textSpeed'], string]> = [
  ['slow', 'Langsam'],
  ['normal', 'Normal'],
  ['instant', 'Sofort'],
];

export function SettingsPanel() {
  const save = useStore((s) => s.save);
  const user = useStore((s) => s.user);
  const updateSave = useStore((s) => s.updateSave);
  const [confirmLogout, setConfirmLogout] = useState(false);
  if (!save) return null;
  const settings = save.settings;
  const set = (patch: Partial<Settings>) => updateSave((s) => Object.assign(s.settings, patch));

  return (
    <div className="settings">
      <h3>Text-Tempo</h3>
      <div className="segmented">
        {SPEEDS.map(([id, label]) => (
          <button key={id} type="button" className={settings.textSpeed === id ? 'active' : ''} onClick={() => set({ textSpeed: id })}>
            {label}
          </button>
        ))}
      </div>
      <h3>Ton</h3>
      <label className="check">
        <input type="checkbox" checked={settings.music} onChange={(e) => set({ music: e.target.checked })} /> Musik
      </label>
      <label className="check">
        <input type="checkbox" checked={settings.sfx} onChange={(e) => set({ sfx: e.target.checked })} /> Effekte
      </label>

      {user?.role === 'admin' && <AdminDebug />}

      <h3>Konto</h3>
      {/* [AUTH-4] Logout only here, with confirmation. */}
      {confirmLogout ? (
        <div className="confirm">
          <span>Wirklich abmelden?</span>
          <PixelButton small onClick={() => { flushSave(); void logout(); }}>Ja</PixelButton>
          <PixelButton small onClick={() => setConfirmLogout(false)}>Nein</PixelButton>
        </div>
      ) : (
        <PixelButton small onClick={() => setConfirmLogout(true)}>Abmelden</PixelButton>
      )}
      <p className="muted version">Version {APP_VERSION}</p>
    </div>
  );
}

function toLocalInput(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** [DAY-7] Debug date and day jump – admin only, own save only. */
function AdminDebug() {
  const user = useStore((s) => s.user)!;
  const bumpClock = useStore((s) => s.bumpClock);
  const setTrunkOpen = useStore((s) => s.setTrunkOpen);
  const [value, setValue] = useState(() => toLocalInput(now()));
  const [day, setDay] = useState(1);
  const [, force] = useState(0);

  const apply = (ms: number | null) => {
    setDebugDate(ms);
    bumpClock();
    force((n) => n + 1);
  };

  return (
    <>
      <h3>Büro der Schulleitung</h3>
      <PixelButton small onClick={() => { setTrunkOpen(false); location.hash = '#/admin'; }}>
        Admin-Konsole öffnen
      </PixelButton>
      <h3>Debug-Datum {debugDateActive() ? '(aktiv)' : ''}</h3>
      <input type="datetime-local" value={value} onChange={(e) => setValue(e.target.value)} />
      <div className="row">
        <PixelButton small onClick={() => apply(new Date(value).getTime())}>Setzen</PixelButton>
        <PixelButton small onClick={() => apply(null)}>Echte Zeit</PixelButton>
      </div>
      <h3>Tag direkt starten</h3>
      <div className="row">
        <select value={day} onChange={(e) => setDay(Number(e.target.value))}>
          {Array.from({ length: 24 }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>Tag {d}</option>
          ))}
        </select>
        <PixelButton small onClick={() => { setTrunkOpen(false); void startDay(day); }}>Start</PixelButton>
      </div>
      <h3>Eigener Spielstand</h3>
      <PixelButton
        small
        onClick={async () => {
          if (!confirm('Eigenen Spielstand wirklich zurücksetzen?')) return;
          await resetProgress(user.uid);
          location.reload();
        }}
      >
        Zurücksetzen
      </PixelButton>
    </>
  );
}
