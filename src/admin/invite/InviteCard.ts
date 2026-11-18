import QRCode from 'qrcode';

export const INVITE_W = 1080;
export const INVITE_H = 1350;

export interface InviteData {
  displayName: string;
  username: string;
  /** Omitted when re-issuing an invitation [ADM-9]. */
  password?: string;
}

const C = {
  night: '#0b1530',
  parchment: '#e8d5a6',
  parchmentLight: '#f6ead0',
  parchmentDark: '#c9a66b',
  wood: '#6b4226',
  woodDark: '#3b2414',
  ink: '#1a1423',
  gold: '#d4a73a',
  ember: '#c4512a',
};

const FONT = '"Jersey 10", monospace';

/**
 * `<app-url>/?u=<username>` prefills the owl name [AUTH-8]. With a password the
 * link logs in directly: `#z=<password>` – the fragment never reaches the
 * server and the app removes it right after reading (DECISIONS.md #31).
 */
export function inviteUrl(username: string, password?: string): string {
  const base = `${location.origin}${import.meta.env.BASE_URL}?u=${encodeURIComponent(username)}`;
  return password ? `${base}#z=${encodeURIComponent(password)}` : base;
}

function centered(ctx: CanvasRenderingContext2D, text: string, y: number, size: number, color: string): void {
  ctx.font = `${size}px ${FONT}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, INVITE_W / 2, y);
}

/** [AUTH-7] Hogwarts-letter style invitation as PNG. */
export async function renderInvite(data: InviteData): Promise<HTMLCanvasElement> {
  await document.fonts.load(`64px ${FONT}`);
  const canvas = document.createElement('canvas');
  canvas.width = INVITE_W;
  canvas.height = INVITE_H;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // night sky with a parchment letter
  ctx.fillStyle = C.night;
  ctx.fillRect(0, 0, INVITE_W, INVITE_H);
  for (let i = 0; i < 70; i++) {
    ctx.fillStyle = i % 3 ? '#a9cbe8' : '#fff1c2';
    ctx.fillRect((i * 397) % INVITE_W, (i * 211) % 260, 6, 6);
  }
  const m = 60;
  ctx.fillStyle = C.woodDark;
  ctx.fillRect(m - 12, 110 - 12, INVITE_W - 2 * m + 24, INVITE_H - 160 + 24);
  ctx.fillStyle = C.parchment;
  ctx.fillRect(m, 110, INVITE_W - 2 * m, INVITE_H - 160);
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 6;
  ctx.strokeRect(m + 24, 134, INVITE_W - 2 * m - 48, INVITE_H - 208);

  // wax seal
  ctx.fillStyle = C.ember;
  ctx.beginPath();
  ctx.arc(INVITE_W / 2, 110, 62, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6e2414';
  ctx.beginPath();
  ctx.arc(INVITE_W / 2, 110, 44, 0, Math.PI * 2);
  ctx.fill();
  centered(ctx, 'H', 134, 72, C.parchmentLight);

  centered(ctx, 'Hogwarts', 270, 104, C.woodDark);
  centered(ctx, 'und die Adventsuhr', 340, 56, C.wood);
  centered(ctx, `Eine Einladung für ${data.displayName}`, 440, 60, C.ink);
  centered(ctx, 'Ab dem 30. November, 18 Uhr, öffnet sich', 510, 40, C.ink);
  centered(ctx, 'jeden Tag ein neues Kapitel.', 556, 40, C.ink);

  // QR code: logs in directly when the invitation carries the Zauberwort
  const qr = document.createElement('canvas');
  await QRCode.toCanvas(qr, inviteUrl(data.username, data.password), {
    width: 400,
    margin: 2,
    color: { dark: C.ink, light: C.parchmentLight },
  });
  ctx.fillStyle = C.woodDark;
  ctx.fillRect(INVITE_W / 2 - 212, 600, 424, 424);
  ctx.drawImage(qr, INVITE_W / 2 - 200, 612, 400, 400);

  centered(ctx, `Eulenname: ${data.username}`, 1100, 52, C.ink);
  if (data.password) {
    centered(ctx, 'Zauberwort:', 1162, 40, C.wood);
    centered(ctx, data.password, 1222, 58, C.ink);
  } else {
    centered(ctx, 'Dein Zauberwort kennst du schon.', 1170, 40, C.wood);
  }
  return canvas;
}

export function canvasToFile(canvas: HTMLCanvasElement, name: string): Promise<File> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(new File([blob], name, { type: 'image/png' })) : reject(new Error('PNG failed'))), 'image/png'),
  );
}

/** Web Share API (e.g. WhatsApp) where available, else a download. */
export async function shareOrDownload(file: File, text: string): Promise<'shared' | 'downloaded'> {
  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: 'Einladung nach Hogwarts', text });
      return 'shared';
    } catch (e) {
      if ((e as Error).name === 'AbortError') return 'shared';
    }
  }
  downloadFile(file);
  return 'downloaded';
}

export function downloadFile(file: File): void {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
