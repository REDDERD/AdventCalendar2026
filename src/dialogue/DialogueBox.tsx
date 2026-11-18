import { useEffect, useRef, useState } from 'react';
import type { Settings } from '../types';
import { AssetImage } from '../ui/AssetImage';
import { SPEAKER_NAMES } from './speakers';

const CHARS_PER_SEC: Record<Settings['textSpeed'], number> = { slow: 25, normal: 50, instant: Infinity };

interface Props {
  speaker: string | null;
  text: string;
  textSpeed: Settings['textSpeed'];
  emote?: string;
  /** Called on tap once the line is fully shown. */
  onAdvance: () => void;
}

/**
 * Dialogue overlay at the bottom of the screen: portrait inside the box,
 * typewriter text. A tap completes the line, the next tap advances (Section 5.7).
 */
export function DialogueBox({ speaker, text, textSpeed, emote, onAdvance }: Props) {
  const [shown, setShown] = useState(textSpeed === 'instant' ? text.length : 0);
  const done = shown >= text.length;
  const raf = useRef(0);

  useEffect(() => {
    const cps = CHARS_PER_SEC[textSpeed];
    if (cps === Infinity) {
      setShown(text.length);
      return;
    }
    setShown(0);
    const start = performance.now();
    const tick = (t: number) => {
      const n = Math.min(text.length, Math.floor(((t - start) / 1000) * cps));
      setShown(n);
      if (n < text.length) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [text, textSpeed]);

  const onTap = () => {
    if (!done) {
      cancelAnimationFrame(raf.current);
      setShown(text.length);
    } else {
      onAdvance();
    }
  };

  return (
    <div className="dialogue" onClick={onTap}>
      <div className={`dialogue-box ${speaker ? '' : 'dialogue-narration'}`}>
        {speaker && (
          <div className="dialogue-portrait">
            <AssetImage id={`portrait.${speaker}`} w={64} h={64} />
            {emote && (
              <div className="emote emote-portrait">
                <AssetImage id={`emote.${emote}`} w={16} h={16} />
              </div>
            )}
          </div>
        )}
        <div className="dialogue-content">
          {speaker && <div className="dialogue-name">{SPEAKER_NAMES[speaker] ?? speaker}</div>}
          <p className="dialogue-text">{text.slice(0, shown)}</p>
        </div>
        {done && <span className="dialogue-more">▼</span>}
      </div>
    </div>
  );
}
