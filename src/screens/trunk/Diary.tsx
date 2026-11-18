import { useEffect, useRef } from 'react';
import { useStore } from '../../core/store';
import { SPEAKER_NAMES } from '../../dialogue/speakers';

/** [DAY-5] All dialogue read so far; newest at the bottom. */
export function Diary() {
  const diary = useStore((s) => s.save?.diary ?? []);
  const end = useRef<HTMLDivElement>(null);
  // Block body on purpose: newer browsers return a Promise from scrollIntoView(),
  // which React would try to call as cleanup and crash.
  useEffect(() => {
    end.current?.scrollIntoView();
  }, []);

  if (!diary.length) return <p className="muted">Noch keine Einträge.</p>;
  let lastDay = -1;
  return (
    <div className="diary">
      {diary.map((entry, i) => {
        const header = entry.day !== lastDay ? <h3 key={`h${i}`}>Kapitel {entry.day}</h3> : null;
        lastDay = entry.day;
        return (
          <div key={i}>
            {header}
            <p className="diary-line">
              {entry.speaker && <b>{SPEAKER_NAMES[entry.speaker] ?? entry.speaker}: </b>}
              {entry.text}
            </p>
          </div>
        );
      })}
      <div ref={end} />
    </div>
  );
}
