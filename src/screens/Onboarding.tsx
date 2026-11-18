import { enterGame, markOnboardingSeen } from '../core/flow';
import { detectPlatform } from '../services/EventLogger';
import { Frame } from '../ui/Frame';
import { Layout } from '../ui/Layout';
import { PixelButton } from '../ui/PixelButton';

/** [AUTH-10] One-time "add to home screen" guide, separate for iOS and Android. */
export function OnboardingScreen() {
  const { platform } = detectPlatform();
  const done = () => {
    markOnboardingSeen();
    void enterGame();
  };

  return (
    <Layout
      bare
      top={
        <div className="center-msg">
          <Frame className="msg-frame">
            <h2>Willkommen!</h2>
            <p>Leg den Kalender auf deinen Home-Bildschirm. Dann öffnet er sich wie eine App.</p>
          </Frame>
        </div>
      }
      bottom={
        <div className="onboarding">
          <Frame className="onboarding-steps">
            {platform === 'android' ? (
              <ol>
                <li>Tippe oben rechts auf ⋮ (Menü).</li>
                <li>Wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“.</li>
                <li>Öffne den Kalender ab jetzt über das neue Symbol.</li>
              </ol>
            ) : (
              <ol>
                <li>Tippe unten auf das Teilen-Symbol (□ mit Pfeil).</li>
                <li>Wähle „Zum Home-Bildschirm“.</li>
                <li>Öffne die App dort und melde dich noch einmal an – das iPhone merkt sich das dort getrennt.</li>
              </ol>
            )}
          </Frame>
          <PixelButton variant="wax" onClick={done}>
            Verstanden
          </PixelButton>
        </div>
      }
    />
  );
}
