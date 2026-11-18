import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { joinGerman, PERSONAL_DEFAULTS } from '../../services/PersonalService';
import { Avatar } from '../components';
import { loadPersonalDoc, savePersonalDoc, type AdminPlayer } from '../data';
import { LETTER_MAX, toForm, type PersonalForm } from '../personal';

/** Section 12 / admin.personal: per player the text fields; photo and scene preview follow in M6. */
export function PersonalView({ players }: { players: AdminPlayer[] | null }) {
  const [uid, setUid] = useState<string | null>(null);
  if (!players) return <p className="admin-muted">Lade …</p>;
  const player = players.find((p) => p.user.uid === uid);
  if (player) return <PersonalEditor player={player} onClose={() => setUid(null)} />;

  return (
    <>
      <p className="admin-muted">
        Fehlt ein Feld, nimmt das Spiel einen neutralen Standardtext. Tag 5 und 7 bis 27.11., der Brief bis 14.12.
      </p>
      {players.map((p) => (
        <button key={p.user.uid} type="button" className="admin-card personal-pick" onClick={() => setUid(p.user.uid)}>
          <Avatar player={p} size={32} />
          <strong>{p.user.displayName}</strong>
          <span className="admin-muted">{p.user.username}</span>
        </button>
      ))}
    </>
  );
}

function PersonalEditor({ player, onClose }: { player: AdminPlayer; onClose: () => void }) {
  const [form, setForm] = useState<PersonalForm | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const uid = player.user.uid;

  useEffect(() => {
    let alive = true;
    loadPersonalDoc(uid)
      .then((doc) => alive && setForm(toForm(doc)))
      .catch((e) => {
        console.error(e);
        if (alive) setStatus({ ok: false, text: 'Konnte nicht geladen werden.' });
      });
    return () => {
      alive = false;
    };
  }, [uid]);

  if (!form) return status ? <div className="admin-error">{status.text}</div> : <p className="admin-muted">Lade …</p>;

  const set = <K extends keyof PersonalForm>(key: K, value: PersonalForm[K]) => {
    setForm({ ...form, [key]: value });
    setStatus(null);
  };
  const setAt = (key: 'scents' | 'jokes', i: number, value: string) => {
    const list = [...form[key]] as PersonalForm[typeof key];
    list[i] = value;
    set(key, list);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await savePersonalDoc(uid, form);
      setStatus({ ok: true, text: 'Gespeichert. Gilt ab dem nächsten Tagesstart.' });
    } catch (err) {
      console.error(err);
      setStatus({ ok: false, text: 'Speichern fehlgeschlagen.' });
    } finally {
      setBusy(false);
    }
  };

  const scents = form.scents.map((s) => s.trim()).filter(Boolean);

  return (
    <form className="admin-form" onSubmit={submit}>
      <button type="button" className="admin-btn" onClick={onClose}>
        ← Alle Spieler
      </button>
      <h2 className="personal-title">{player.user.displayName}</h2>

      <Section title="Tag 5 · Amortentia" preview={`Es duftet nach ${scents.length ? joinGerman(scents) : PERSONAL_DEFAULTS.amortentiaScents}.`}>
        {form.scents.map((s, i) => (
          <label key={i}>
            Duft {i + 1}
            <input value={s} onChange={(e) => setAt('scents', i, e.target.value)} placeholder={PERSONAL_DEFAULTS.amortentiaScents.split(', ')[i]} />
          </label>
        ))}
      </Section>

      <Section title="Tag 7 und 17 · Insider-Witze" preview={form.jokes[0].trim() ? `Ellis: ${form.jokes[0].trim()}` : 'Ohne Witz entfällt die Zeile.'}>
        <label>
          Witz 1 (Tag 7, sagt Ellis)
          <input value={form.jokes[0]} onChange={(e) => setAt('jokes', 0, e.target.value)} maxLength={140} />
        </label>
        <label>
          Witz 2 (Tag 17, sagt Quill)
          <input value={form.jokes[1]} onChange={(e) => setAt('jokes', 1, e.target.value)} maxLength={140} />
        </label>
      </Section>

      <Section title="Tag 12 · Patronus" preview={`Luna: Und dein Patronus wäre ${form.patronus.trim() || PERSONAL_DEFAULTS.patronus}.`}>
        <label>
          Tier mit Artikel
          <input value={form.patronus} onChange={(e) => set('patronus', e.target.value)} placeholder={PERSONAL_DEFAULTS.patronus} />
        </label>
      </Section>

      <Section title="Tag 17 · Lieblingssüßigkeit">
        <label>
          Süßigkeit
          <input value={form.favoriteSweet} onChange={(e) => set('favoriteSweet', e.target.value)} placeholder={PERSONAL_DEFAULTS.favoriteSweet} />
        </label>
      </Section>

      <Section title="Tag 24 · Brief">
        <label>
          Brief (Absätze mit Leerzeile, *kursiv*)
          <textarea
            className="personal-letter"
            value={form.letter}
            onChange={(e) => set('letter', e.target.value)}
            maxLength={LETTER_MAX}
            rows={10}
            placeholder="Ohne Brief: kurzer Weihnachtsgruß"
          />
        </label>
        <span className="admin-muted">
          {form.letter.length} / {LETTER_MAX} Zeichen
        </span>
        <label>
          Unterschrift
          <input value={form.letterSignature} onChange={(e) => set('letterSignature', e.target.value)} placeholder="Dein Anzeigename" />
        </label>
        <label>
          Überraschung (Zeile nach dem Brief, optional)
          <input value={form.surprise} onChange={(e) => set('surprise', e.target.value)} />
        </label>
      </Section>

      {status && <div className={status.ok ? 'admin-ok' : 'admin-error'}>{status.text}</div>}
      <button type="submit" className="admin-btn admin-btn-primary" disabled={busy}>
        {busy ? 'Speichere …' : 'Speichern'}
      </button>
    </form>
  );
}

function Section({ title, preview, children }: { title: string; preview?: string; children: ReactNode }) {
  return (
    <section className="admin-card admin-form">
      <h2>{title}</h2>
      {children}
      {preview && <p className="personal-preview">{preview}</p>}
    </section>
  );
}
