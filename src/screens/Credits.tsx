import { useMusic } from '../audio/useMusic';
import { ADMIN_NAME } from '../config';
import credits from '../content/credits.generated.json';
import { TIME_GUESTS } from '../content/finale';
import { go } from '../core/ScreenMachine';
import { useStore } from '../core/store';
import { Layout } from '../ui/Layout';
import { PixelButton } from '../ui/PixelButton';

/** Every author of the LPC layers in use, once, alphabetically [GFX-3]. */
const LPC_AUTHORS = [...new Set((credits as Array<{ authors: string[] }>).flatMap((c) => c.authors))].sort((a, b) => a.localeCompare(b, 'de'));
const TILE_AUTHORS = ['Lanea Zimmerman (Sharm)', 'Daniel Armstrong (HughSpectrum)'];

/** Rolling credits after the letter; skippable [PLAN-1]. Full licence list: CREDITS.md. */
export function CreditsScreen() {
  useMusic('title');
  const name = useStore((s) => s.save?.profile?.name);
  return (
    <Layout>
      <div className="credits-screen">
        <div className="credits-roll">
          <h2>Hogwarts und die Adventsuhr</h2>
          <p>Eine Geschichte für {name ?? 'dich'}</p>
          <h3>Idee und Schulleitung</h3>
          <p>{ADMIN_NAME}</p>
          <h3>Zeitgäste</h3>
          {TIME_GUESTS.map((g) => (
            <p key={g}>{g}</p>
          ))}
          <h3>Figuren (Liberated Pixel Cup)</h3>
          {LPC_AUTHORS.map((a) => (
            <p key={a} className="credits-small">
              {a}
            </p>
          ))}
          <h3>Kacheln der Schauplätze</h3>
          {TILE_AUTHORS.map((a) => (
            <p key={a}>{a}</p>
          ))}
          <h3>Schrift</h3>
          <p>Jersey 10 – Sarah Cadigan-Fried</p>
          <h3>Musik und Klänge</h3>
          <p>Eigene Chiptune-Melodien</p>
          <p className="credits-small">Lizenzen: CC-BY-SA 3.0, GPL 3.0, OGA-BY 3.0, CC0, SIL OFL 1.1 – Details in CREDITS.md</p>
          <h2 className="credits-end">Frohe Weihnachten!</h2>
        </div>
        <PixelButton variant="wax" onClick={() => go('calendar')}>
          Zum Kalender
        </PixelButton>
      </div>
    </Layout>
  );
}
