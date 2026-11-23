import { useState } from 'react';
import { CHARACTER_CARDS } from '../../content/characters';
import { resolveDay } from '../../content/schedule';
import { metCharacters } from '../../core/encounters';
import { useStore } from '../../core/store';
import { SPEAKER_NAMES } from '../../dialogue/speakers';
import { AssetImage } from '../../ui/AssetImage';

/** Trunk → Figuren (DECISIONS.md #80): everyone met so far; the rest are silhouettes. */
export function Figures() {
  const save = useStore((s) => s.save);
  const [open, setOpen] = useState<string | null>(null);
  if (!save) return null;
  const met = metCharacters(save);
  const route = typeof save.vars.route === 'string' ? save.vars.route : undefined;
  const count = CHARACTER_CARDS.filter((c) => met.has(c.id)).length;
  const card = CHARACTER_CARDS.find((c) => c.id === open);
  const firstDay = card ? met.get(card.id) : undefined;

  return (
    <div className="figures">
      <p className="figures-count">
        Getroffen: <strong>{count}</strong> von {CHARACTER_CARDS.length}
      </p>
      <ul className="figure-grid">
        {CHARACTER_CARDS.map((c) => {
          const known = met.has(c.id);
          return (
            <li key={c.id}>
              <button
                type="button"
                className={`figure ${known ? 'known' : 'unknown'}`}
                aria-label={known ? SPEAKER_NAMES[c.id] : 'Unbekannte Figur'}
                onClick={() => setOpen(c.id)}
              >
                <AssetImage id={`portrait.${c.id}`} w={64} h={64} className="figure-portrait" />
                <span className="figure-name">{known ? SPEAKER_NAMES[c.id] : '???'}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {card && (
        <div className="figure-card-overlay" onClick={() => setOpen(null)}>
          <div className={`figure-card ${firstDay === undefined ? 'unknown' : 'known'}`}>
            <AssetImage id={`portrait.${card.id}`} w={64} h={64} className="figure-portrait" />
            {firstDay === undefined ? (
              <>
                <h3>???</h3>
                <p>Noch nicht getroffen.</p>
              </>
            ) : (
              <>
                <h3>{SPEAKER_NAMES[card.id]}</h3>
                <p>{card.text}</p>
                <p className="figure-met">
                  Zuerst getroffen: {firstDay === 0 ? 'im Prolog' : `Tag ${firstDay} · ${resolveDay(firstDay, route).title}`}
                </p>
              </>
            )}
            <span className="figure-close">Tippen zum Schließen</span>
          </div>
        </div>
      )}
    </div>
  );
}
