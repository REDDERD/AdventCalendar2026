import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ADMIN_NAME } from '../config';
import { useStore } from '../core/store';
import { logout } from '../services/AuthService';
import { Frame } from '../ui/Frame';
import { Layout } from '../ui/Layout';
import { PixelButton } from '../ui/PixelButton';

/** [AUTH-9] Deactivated player, or an account without `users/{uid}` [AUTH-3]. */
export function BlockedScreen() {
  const reason = useStore((s) => s.blocked);
  const text =
    reason === 'inactive'
      ? `Deine Eule macht gerade Pause. Melde dich bei ${ADMIN_NAME}.`
      : 'Diese Eule kenne ich nicht.';
  return (
    <Layout bare>
      <div className="center-msg">
        <Frame className="msg-frame">{text}</Frame>
        <PixelButton onClick={() => void logout()}>Abmelden</PixelButton>
      </div>
    </Layout>
  );
}

/** [UI-3] Landscape or desktop: only a hint, outside the pixel stage. */
export function OrientationBlock({ desktop }: { desktop: boolean }) {
  const [qr, setQr] = useState<string | null>(null);
  useEffect(() => {
    if (!desktop) return;
    QRCode.toDataURL(location.href, { margin: 1, width: 240, color: { dark: '#0b1530', light: '#f6ead0' } })
      .then(setQr)
      .catch(() => setQr(null));
  }, [desktop]);

  return (
    <div className="orientation-block">
      <div className="orientation-card">
        {desktop ? (
          <>
            <p>Dieser Kalender lebt auf dem Handy.</p>
            {qr && <img src={qr} alt="QR-Code zur Seite" width={240} height={240} />}
          </>
        ) : (
          <p>Bitte nimm dein Handy hochkant.</p>
        )}
      </div>
    </div>
  );
}
