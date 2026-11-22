import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../../core/store';
import { resolveDay } from '../../content/schedule';
import { SPEAKER_NAMES } from '../../dialogue/speakers';

interface Chapter {
  day: number;
  entries: Array<{ speaker: string; text: string }>;
}

/** "Prolog" or "Tag 3 · Titel"; days 13–15 use the title of the player's route. */
function chapterLabel(day: number, route: string | undefined): string {
  let title = '';
  try {
    title = resolveDay(day, route).title;
  } catch {
    // a day without a schedule entry still gets its heading
  }
  if (day === 0) return 'Prolog';
  return title ? `Tag ${day} · ${title}` : `Tag ${day}`;
}

/** [DAY-5] All dialogue read so far, one chapter per day; only one chapter is open at a time. */
export function Diary() {
  const diary = useStore((s) => s.save?.diary ?? []);
  const route = useStore((s) => {
    const r = s.save?.vars.route;
    return typeof r === 'string' ? r : undefined;
  });

  const chapters = useMemo(() => {
    const byDay = new Map<number, Chapter>();
    for (const { day, speaker, text } of diary) {
      let chapter = byDay.get(day);
      if (!chapter) byDay.set(day, (chapter = { day, entries: [] }));
      chapter.entries.push({ speaker, text });
    }
    return [...byDay.values()].sort((a, b) => a.day - b.day);
  }, [diary]);

  // The newest chapter starts open: that is what the player most likely wants to reread.
  const [openDay, setOpenDay] = useState<number | null>(chapters.length ? chapters[chapters.length - 1].day : null);
  const openButton = useRef<HTMLButtonElement | null>(null);

  // Bring the opened chapter's heading to the top so its text starts in view (the
  // chapter above it just collapsed). Block body on purpose: newer browsers return
  // a Promise from scrollIntoView(), which React would try to call as cleanup and crash.
  useEffect(() => {
    if (openDay !== null) openButton.current?.scrollIntoView({ block: 'start' });
  }, [openDay]);

  if (!chapters.length) return <p className="muted">Noch keine Einträge.</p>;
  return (
    <div className="diary">
      {chapters.map((chapter) => {
        const open = chapter.day === openDay;
        const panelId = `diary-day-${chapter.day}`;
        return (
          <section key={chapter.day} className={`diary-chapter ${open ? 'open' : ''}`}>
            <button
              type="button"
              className="diary-toggle"
              aria-expanded={open}
              aria-controls={panelId}
              ref={open ? openButton : undefined}
              onClick={() => setOpenDay(open ? null : chapter.day)}
            >
              <span className="diary-toggle-title">{chapterLabel(chapter.day, route)}</span>
              <span className="diary-toggle-mark" aria-hidden="true">
                {open ? '▾' : '▸'}
              </span>
            </button>
            {open && (
              <div id={panelId} className="diary-text">
                {chapter.entries.map((entry, i) => (
                  <p key={i} className="diary-line">
                    {entry.speaker && <b>{SPEAKER_NAMES[entry.speaker] ?? entry.speaker}: </b>}
                    {entry.text}
                  </p>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
