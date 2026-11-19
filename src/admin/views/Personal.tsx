import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { joinGerman, PERSONAL_DEFAULTS } from '../../services/PersonalService';
import { Avatar } from '../components';
import { loadPersonalDoc, saveMirrorPhoto, savePersonalDoc, type AdminPlayer } from '../data';
import { LETTER_MAX, toForm, type PersonalForm } from '../personal';
import { PHOTO_MAX_CHARS, PHOTO_W, renderPhoto } from '../photo';

/** Section 12 / admin.personal: per player the text fields, the mirror photo [PRS-1] and previews in the game look [PRS-4]. */
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
  const [photo, setPhoto] = useState<string | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const uid = player.user.uid;

  useEffect(() => {
    let alive = true;
    loadPersonalDoc(uid)
      .then((doc) => {
        if (!alive) return;
        setForm(toForm(doc));
        setPhoto(doc.mirrorPhoto ?? null);
      })
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

      <Section title="Tag 5 · Amortentia" preview={{ text: `Es duftet nach ${scents.length ? joinGerman(scents) : PERSONAL_DEFAULTS.amortentiaScents}.` }}>
        {form.scents.map((s, i) => (
          <label key={i}>
            Duft {i + 1}
            <input value={s} onChange={(e) => setAt('scents', i, e.target.value)} placeholder={PERSONAL_DEFAULTS.amortentiaScents.split(', ')[i]} />
          </label>
        ))}
      </Section>

      <Section title="Tag 7 und 17 · Insider-Witze" preview={form.jokes[0].trim() ? { speaker: 'Ellis', text: form.jokes[0].trim() } : { text: 'Ohne Witz entfällt die Zeile.' }}>
        <label>
          Witz 1 (Tag 7, sagt Ellis)
          <input value={form.jokes[0]} onChange={(e) => setAt('jokes', 0, e.target.value)} maxLength={140} />
        </label>
        <label>
          Witz 2 (Tag 17, sagt Quill)
          <input value={form.jokes[1]} onChange={(e) => setAt('jokes', 1, e.target.value)} maxLength={140} />
        </label>
      </Section>

      <Section title="Tag 12 · Patronus" preview={{ speaker: 'Luna', text: `Und dein Patronus wäre ${form.patronus.trim() || PERSONAL_DEFAULTS.patronus}.` }}>
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

      <MirrorPhoto uid={uid} photo={photo} onSaved={setPhoto} />

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
        {form.letter.trim() && <LetterPreview text={form.letter} signature={form.letterSignature.trim() || player.user.displayName} />}
      </Section>

      {status && <div className={status.ok ? 'admin-ok' : 'admin-error'}>{status.text}</div>}
      <button type="submit" className="admin-btn admin-btn-primary" disabled={busy}>
        {busy ? 'Speichere …' : 'Speichern'}
      </button>
    </form>
  );
}

interface Preview {
  speaker?: string;
  text: string;
}

function Section({ title, preview, children }: { title: string; preview?: Preview; children: ReactNode }) {
  return (
    <section className="admin-card admin-form">
      <h2>{title}</h2>
      {children}
      {preview && (
        <div className="game-preview" aria-label="Vorschau im Spiel">
          {preview.speaker && <span className="game-preview-name">{preview.speaker}</span>}
          <p>{preview.text}</p>
        </div>
      )}
    </section>
  );
}

/** "*kursiv*" → <em>, blank lines → paragraphs (Section 12). */
function LetterPreview({ text, signature }: { text: string; signature: string }) {
  return (
    <div className="letter-preview" aria-label="Vorschau des Briefs">
      {text
        .trim()
        .split(/\n\s*\n/)
        .map((para, i) => (
          <p key={i}>
            {para.split(/(\*[^*]+\*)/).map((part, j) =>
              part.length > 2 && part.startsWith('*') && part.endsWith('*') ? <em key={j}>{part.slice(1, -1)}</em> : part,
            )}
          </p>
        ))}
      <p className="letter-signature">{signature}</p>
    </div>
  );
}

/** [PRS-1] Pick a picture → crop to 96 × 72 → game palette (Floyd–Steinberg) → preview → save. */
function MirrorPhoto({ uid, photo, onSaved }: { uid: string; photo: string | null; onSaved: (p: string | null) => void }) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const draft = useMemo(() => (image ? renderPhoto(image, zoom, panX, panY) : null), [image, zoom, panX, panY]);
  const shown = draft ?? photo;
  const tooBig = !!draft && draft.length > PHOTO_MAX_CHARS;

  const pick = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImage(img);
      setZoom(1);
      setPanX(0);
      setPanY(0);
      setStatus(null);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => setStatus({ ok: false, text: 'Das Bild konnte nicht gelesen werden.' });
    img.src = url;
  };

  const save = async (value: string | null) => {
    setBusy(true);
    try {
      await saveMirrorPhoto(uid, value);
      onSaved(value);
      setImage(null);
      setStatus({ ok: true, text: value ? 'Foto gespeichert.' : 'Foto entfernt – der Spiegel zeigt die Spielfigur mit Ellis und Quill.' });
    } catch (e) {
      console.error(e);
      setStatus({ ok: false, text: 'Speichern fehlgeschlagen.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="admin-card admin-form">
      <h2>Tag 18 · Spiegel Nerhegeb</h2>
      <div className="mirror-frame">
        {shown ? (
          <img src={shown} alt="Spiegelfoto" width={PHOTO_W * 3} className="pixelated" />
        ) : (
          <span className="admin-muted">Ohne Foto: Spielfigur mit Ellis und Quill</span>
        )}
      </div>
      <label>
        Foto wählen
        <input type="file" accept="image/*" onChange={(e) => pick(e.target.files?.[0])} />
      </label>
      {image && (
        <>
          <label>
            Zoom
            <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
          </label>
          <label>
            Links ↔ rechts
            <input type="range" min={-1} max={1} step={0.02} value={panX} onChange={(e) => setPanX(Number(e.target.value))} />
          </label>
          <label>
            Oben ↕ unten
            <input type="range" min={-1} max={1} step={0.02} value={panY} onChange={(e) => setPanY(Number(e.target.value))} />
          </label>
          <span className="admin-muted">
            96 × 72 Pixel in den Spielfarben · {Math.ceil((draft?.length ?? 0) / 1024)} KB{tooBig ? ' – zu groß, bitte näher heranzoomen' : ''}
          </span>
        </>
      )}
      {status && <div className={status.ok ? 'admin-ok' : 'admin-error'}>{status.text}</div>}
      <div className="admin-row">
        {image && (
          <button type="button" className="admin-btn admin-btn-primary" disabled={busy || tooBig} onClick={() => save(draft)}>
            Foto speichern
          </button>
        )}
        {photo && !image && (
          <button type="button" className="admin-btn" disabled={busy} onClick={() => save(null)}>
            Foto entfernen
          </button>
        )}
      </div>
    </section>
  );
}
