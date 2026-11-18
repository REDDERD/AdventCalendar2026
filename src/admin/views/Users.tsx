import { useEffect, useState, type FormEvent } from 'react';
import { suggestUsername } from '../../services/password';
import { provisionPlayer, ProvisionError, type ProvisionedPlayer } from '../../services/ProvisioningService';
import { resetProgress } from '../../services/ResetService';
import { Avatar, Chip } from '../components';
import { updateUser, type AdminPlayer } from '../data';
import { canvasToFile, downloadFile, inviteUrl, renderInvite, shareOrDownload, type InviteData } from '../invite/InviteCard';
import { lastActive, relativeTime } from '../stats';

interface Props {
  players: AdminPlayer[] | null;
  onChanged: () => Promise<void>;
}

/** Section 11.3 admin.users with the actions of 11.4. */
export function UsersView({ players, onChanged }: Props) {
  const [inviting, setInviting] = useState(false);
  const [invite, setInvite] = useState<InviteData | null>(null);

  if (invite) return <InviteResult invite={invite} onClose={() => setInvite(null)} />;

  return (
    <>
      {inviting ? (
        <InviteForm
          onCancel={() => setInviting(false)}
          onCreated={async (created) => {
            setInviting(false);
            setInvite({ displayName: created.displayName, username: created.username, password: created.password });
            await onChanged();
          }}
        />
      ) : (
        <button type="button" className="admin-btn admin-btn-primary" onClick={() => setInviting(true)}>
          Neuen Spieler einladen
        </button>
      )}

      {!players && <p className="admin-muted">Lade …</p>}
      {players?.map((p) => (
        <UserRow key={p.user.uid} player={p} onChanged={onChanged} onReinvite={(data) => setInvite(data)} />
      ))}
    </>
  );
}

/** [ADM-6] Display name → suggested owl name → account → invitation. */
function InviteForm({ onCancel, onCreated }: { onCancel: () => void; onCreated: (p: ProvisionedPlayer) => Promise<void> }) {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameEdited, setUsernameEdited] = useState(false);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usernameEdited) setUsername(displayName.trim() ? suggestUsername(displayName) : '');
  }, [displayName, usernameEdited]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onCreated(await provisionPlayer({ displayName, username, note }));
    } catch (err) {
      console.error(err);
      setError(err instanceof ProvisionError ? err.message : 'Das Konto konnte nicht angelegt werden.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="admin-card admin-form" onSubmit={submit}>
      <h2>Neuer Spieler</h2>
      <label>
        Anzeigename
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="z. B. Lena" required />
      </label>
      <label>
        Eulenname
        <input
          value={username}
          onChange={(e) => {
            setUsernameEdited(true);
            setUsername(e.target.value);
          }}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
        />
      </label>
      <label>
        Notiz (nur für dich)
        <input value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-row">
        <button type="button" className="admin-btn" onClick={onCancel} disabled={busy}>
          Abbrechen
        </button>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={busy || !displayName.trim() || !username}>
          {busy ? 'Eule wird gesattelt …' : 'Einladen'}
        </button>
      </div>
    </form>
  );
}

/** [AUTH-7] Invitation image with Teilen/Speichern. The Zauberwort is only shown here [ADM-6]. */
function InviteResult({ invite, onClose }: { invite: InviteData; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const canvas = await renderInvite(invite);
      const f = await canvasToFile(canvas, `einladung-${invite.username}.png`);
      if (!alive) return;
      setFile(f);
      setPreview(canvas.toDataURL('image/png'));
    })();
    return () => {
      alive = false;
    };
  }, [invite]);

  const link = inviteUrl(invite.username, invite.password);
  const text = `Eine Einladung nach Hogwarts für ${invite.displayName}! ${link}`;

  return (
    <section className="admin-card invite-result">
      <h2>Einladung für {invite.displayName}</h2>
      {invite.password && (
        <p className="invite-secret">
          Eulenname <code>{invite.username}</code>
          <br />
          Zauberwort <code data-testid="new-password">{invite.password}</code>
          <br />
          <small>Das Zauberwort wird nur jetzt angezeigt und nirgends gespeichert.</small>
        </p>
      )}
      {/* Not a clickable link: opening it here would sign the admin in as the player. */}
      <div className="admin-form">
        <label>
          {invite.password ? 'Direktlink (loggt sofort ein)' : 'Link (Eulenname vorausgefüllt)'}
          <input readOnly value={link} data-testid="invite-link" onFocus={(e) => e.currentTarget.select()} />
        </label>
        <button
          type="button"
          className="admin-btn"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(link);
              setStatus('Link kopiert.');
            } catch {
              setStatus('Kopieren nicht möglich – bitte das Feld lange antippen.');
            }
          }}
        >
          Link kopieren
        </button>
      </div>
      {preview ? <img className="invite-preview" src={preview} alt="Einladungsbild" /> : <p className="admin-muted">Male Einladung …</p>}
      <div className="admin-row">
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          disabled={!file}
          onClick={async () => setStatus((await shareOrDownload(file!, text)) === 'shared' ? 'Geteilt.' : 'Gespeichert.')}
        >
          Teilen
        </button>
        <button type="button" className="admin-btn" disabled={!file} onClick={() => file && downloadFile(file)}>
          Speichern
        </button>
      </div>
      {status && <p className="admin-muted">{status}</p>}
      <button type="button" className="admin-btn" onClick={onClose}>
        Fertig
      </button>
    </section>
  );
}

function UserRow({ player, onChanged, onReinvite }: { player: AdminPlayer; onChanged: () => Promise<void>; onReinvite: (d: InviteData) => void }) {
  const { user } = player;
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.displayName);
  const [note, setNote] = useState(user.note ?? '');
  const [confirmReset, setConfirmReset] = useState('');
  const [busy, setBusy] = useState(false);
  const isAdmin = user.role === 'admin';

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
      await onChanged();
    } catch (e) {
      console.error(e);
      alert('Das hat nicht geklappt.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="admin-card user-row">
      <button type="button" className="user-summary" onClick={() => setOpen(!open)} aria-expanded={open}>
        <Avatar player={player} size={40} />
        <span className="user-names">
          <strong>{user.displayName}</strong>
          <span className="admin-muted">
            @{user.username} · {relativeTime(lastActive(player), Date.now())}
          </span>
        </span>
        <span className="user-chips">
          {isAdmin && <Chip tone="gold">Admin</Chip>}
          {user.isTest && <Chip>Test</Chip>}
          <Chip tone={user.active ? 'good' : 'bad'}>{user.active ? 'aktiv' : 'pausiert'}</Chip>
        </span>
      </button>

      {open && (
        <div className="user-actions">
          {user.note && !editing && <p className="admin-muted">Notiz: {user.note}</p>}
          <p className="admin-muted">Durchlauf {user.runId}</p>

          {editing ? (
            <div className="admin-form">
              <label>
                Anzeigename
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                Notiz
                <input value={note} onChange={(e) => setNote(e.target.value)} />
              </label>
              <div className="admin-row">
                <button type="button" className="admin-btn" onClick={() => setEditing(false)}>
                  Abbrechen
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  disabled={busy || !name.trim()}
                  onClick={() => run(async () => {
                    await updateUser(user.uid, { displayName: name.trim(), note: note.trim() });
                    setEditing(false);
                  })}
                >
                  Speichern
                </button>
              </div>
            </div>
          ) : (
            <div className="admin-row admin-row-wrap">
              <button type="button" className="admin-btn" onClick={() => setEditing(true)}>
                Bearbeiten
              </button>
              <button type="button" className="admin-btn" onClick={() => onReinvite({ displayName: user.displayName, username: user.username })}>
                Einladung erneut erzeugen
              </button>
              {!isAdmin && (
                <button type="button" className="admin-btn" disabled={busy} onClick={() => run(() => updateUser(user.uid, { active: !user.active }))}>
                  {user.active ? 'Deaktivieren' : 'Aktivieren'}
                </button>
              )}
            </div>
          )}

          {/* [ADM-8] confirm by typing the display name */}
          <div className="danger-zone">
            <label>
              Spielstand zurücksetzen – zur Bestätigung „{user.displayName}“ eintippen:
              <input value={confirmReset} onChange={(e) => setConfirmReset(e.target.value)} />
            </label>
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              disabled={busy || confirmReset.trim() !== user.displayName}
              onClick={() => run(async () => {
                await resetProgress(user.uid);
                setConfirmReset('');
              })}
            >
              Zurücksetzen
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
