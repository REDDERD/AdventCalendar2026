import { useEffect, useRef, useState } from 'react';
import { useMusic } from '../audio/useMusic';
import { ADMIN_NAME } from '../config';
import { DEFAULT_LETTER } from '../content/finale';
import { go } from '../core/ScreenMachine';
import { useStore } from '../core/store';
import { logEvent } from '../services/EventLogger';
import { getPersonal, loadPersonal } from '../services/PersonalService';
import { Layout } from '../ui/Layout';
import { PixelButton } from '../ui/PixelButton';

/** Seconds between two paragraphs fading in. */
const STEP_S = 1.6;

/** "*kursiv*" → <em>, blank lines → paragraphs (Section 12). */
function paragraphs(text: string): string[] {
  return text.trim().split(/\n\s*\n/);
}
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/).map((part, j) =>
        part.length > 2 && part.startsWith('*') && part.endsWith('*') ? <em key={j}>{part.slice(1, -1)}</em> : part,
      )}
    </>
  );
}

/** The personal letter on parchment, paragraph by paragraph [PRS-2]. Used after the finale and in the trunk. */
export function LetterView({ animate = true }: { animate?: boolean }) {
  const uid = useStore((s) => s.user?.uid);
  const [, setLoaded] = useState(0);
  useEffect(() => {
    if (uid) void loadPersonal(uid).then(() => setLoaded((n) => n + 1));
  }, [uid]);
  const personal = getPersonal();
  const parts = paragraphs(personal.letter || DEFAULT_LETTER);
  return (
    <div className="letter-paper">
      {parts.map((p, i) => (
        <p key={i} className={animate ? 'letter-in' : ''} style={animate ? { animationDelay: `${0.6 + i * STEP_S}s` } : undefined}>
          {p.split('\n').map((line, k) => (
            <span key={k}>
              {k > 0 && <br />}
              <Inline text={line} />
            </span>
          ))}
        </p>
      ))}
      <p className={`letter-sign ${animate ? 'letter-in' : ''}`} style={animate ? { animationDelay: `${0.6 + parts.length * STEP_S}s` } : undefined}>
        {personal.letterSignature || ADMIN_NAME}
      </p>
      {personal.surprise && (
        <p className={`letter-surprise ${animate ? 'letter-in' : ''}`} style={animate ? { animationDelay: `${1.6 + parts.length * STEP_S}s` } : undefined}>
          {personal.surprise}
        </p>
      )}
    </div>
  );
}

/** [PRS-2] The letter after the finale (not skippable); afterwards the credits. */
export function PersonalLetterScreen() {
  useMusic('letter');
  const logged = useRef(false);
  useEffect(() => {
    if (logged.current) return;
    logged.current = true;
    logEvent('letter_opened', 24, {});
  }, []);
  return (
    <Layout>
      <div className="center-msg letter-screen">
        <LetterView />
        <PixelButton variant="wax" onClick={() => go('credits')}>
          Weiter
        </PixelButton>
      </div>
    </Layout>
  );
}
