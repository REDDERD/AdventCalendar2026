# Hogwarts und die Adventsuhr

Digitaler Adventskalender als Pixel-Abenteuer für das Smartphone. Spezifikation: [CONCEPT.md](CONCEPT.md). Entscheidungen bei Unklarheiten: [DECISIONS.md](DECISIONS.md). Herkunft der Assets: [CREDITS.md](CREDITS.md).

- Live: https://redderd.github.io/AdventCalendar2026/
- Firebase-Projekt: `adventskalender2026-50657`

## Entwicklung

Voraussetzungen: Node 22, Java 21 (für den Firebase-Emulator), Firebase CLI (`npm i -g firebase-tools`).

```sh
npm install
npm run emulators      # Terminal 1: Auth + Firestore lokal (Projekt demo-hogwarts)
npm run dev:emu        # Terminal 2: App gegen den Emulator
```

Die App läuft dann unter http://localhost:5173/AdventCalendar2026/. Am Rechner `?desktop` anhängen, sonst erscheint der Handy-Hinweis (nur im Dev-Modus abschaltbar). Im Emulator Konten anlegen: Emulator-UI oder die Helfer in `tests/e2e/emulator.ts`.

`npm run dev` verbindet sich mit dem **echten** Firebase-Projekt.

## Skripte

| Skript | Zweck |
| --- | --- |
| `dev`, `dev:emu` | Dev-Server (echtes Projekt bzw. Emulator); Ink wird bei Änderungen neu kompiliert |
| `build` | `content:compile` + Produktions-Build nach `dist/` |
| `lint` | TypeScript-Prüfung + `content:lint` |
| `test` | Unit-Tests (Vitest) |
| `test:rules` | Security-Rules-Tests im Firestore-Emulator `[SEC-1]` |
| `test:e2e` | Playwright (iPhone-13-Viewport) gegen Emulator + Dev-Server; vorher einmalig `npx playwright install chromium` |
| `content:compile` | Ink → JSON, Entscheidungs-Katalog `choices.generated.json` |
| `content:lint` | Statische Prüfung von Ink und Rätsel-JSON |
| `assets:check` | Fehlende/unbenutzte Assets, fehlende Lizenzen |
| `assets:import-lpc -- <lpc-repo>` | LPC-Ebenen aus `scripts/lpc/catalog.ts` importieren (Laufanimation, Paletten, Credits); `--list` zeigt die benötigten Dateien für einen Sparse-Checkout des [Generator-Repos](https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator) |
| `assets:npcs` | NPC-Sprites aus den LPC-Ebenen bauen (`src/character/npcs.ts`) |
| `assets:draw` | Eigene Sprites zeichnen (Hut, Haustiere, Zauberstäbe, Wappen, Emotes) |
| `admin:set-uid -- <uid>` | Admin-UID in `src/config.ts` und `firestore.rules` eintragen |
| `admin:set-password -- <eulenname> <zauberwort>` | Zauberwort zurücksetzen `[AUTH-11]` |

## Firebase-Einrichtung (einmalig, durch den Auftraggeber)

Die Web-App „Hogwarts Adventskalender“ ist im Projekt bereits registriert; ihre Konfiguration steht in `src/config.ts`.

1. **Firestore anlegen:** Firebase-Konsole → Firestore Database → Datenbank erstellen → Produktionsmodus, Region `europe-west3` (Frankfurt).
2. **Authentication:** Authentication → Anmeldemethode → **E-Mail/Passwort** aktivieren.
   Empfohlen: Authentication → Einstellungen → Nutzeraktionen → **E-Mail-Enumeration-Schutz deaktivieren**. Nur dann kann die App „Diese Eule kenne ich nicht.“ und „Das Zauberwort stimmt nicht.“ unterscheiden (siehe DECISIONS.md #8). Da die Adressen synthetisch sind, entsteht dadurch kein Risiko.
3. **Admin-Konto:** Authentication → Nutzer → Nutzer hinzufügen: `daniel@hogwarts.example.com` mit einem Passwort deiner Wahl. Die angezeigte **Nutzer-UID** kopieren und eintragen:
   ```sh
   npm run admin:set-uid -- <UID>
   ```
   Beim ersten Login legt die App `users/<UID>` mit `role: 'admin'` an `[AUTH-12]`.
4. **Autorisierte Domains:** Authentication → Einstellungen → Autorisierte Domains → `redderd.github.io` hinzufügen.
5. **API-Schlüssel beschränken:** Google Cloud Console → APIs & Dienste → Anmeldedaten → „Browser key“ des Projekts → Website-Einschränkungen: `https://redderd.github.io/*` und `http://localhost:*`.
6. **Service-Account (nur für `admin:set-password`):** Projekteinstellungen → Dienstkonten → Neuen privaten Schlüssel generieren → als `.secrets/service-account.json` speichern (ist in `.gitignore`).
7. **Rules und Indexe deployen** (nach Schritt 3, damit die Admin-UID drinsteht):
   ```sh
   firebase deploy --only firestore:rules,firestore:indexes
   ```

## Admin-Konsole

Mit dem Admin-Konto einloggen, dann Truhe → Optionen → „Admin-Konsole öffnen“ (oder direkt `<app-url>/#/admin`).

- **Spieler einladen:** Mehr → Spieler verwalten → „Neuen Spieler einladen“. Das Zauberwort erscheint nur in diesem Moment, zusammen mit dem Einladungsbild (Teilen/Speichern). Der QR-Code (und der Direktlink) loggt sofort ein; bei neu erzeugten Einladungen ist nur der Eulenname vorausgefüllt.
- **Zauberwort vergessen:** `npm run admin:set-password -- <eulenname> <neues-zauberwort>` (braucht den Service-Account, siehe oben), danach „Einladung erneut erzeugen“.
- **Eulenpost:** die letzten 100 Ereignisse aller Spieler, live.

## GitHub Pages

Repository → Settings → Pages → Source: **GitHub Actions**. Danach baut und veröffentlicht `.github/workflows/deploy.yml` jeden Push auf `main` (Lint, Unit-Tests, Rules-Tests, Build, Deploy).

## Inhalte schreiben

- Story: `src/content/ink/dayNN.ink`, bindet `globals.ink` ein. Konventionen: CONCEPT.md Abschnitt 15.1. Abweichung: `# choice_point: <id> <Frage>` ohne `|`.
- Rätsel: `src/content/puzzles/<id>.json` (Schema in `src/puzzles/schema.ts`).
- Freischaltzeiten und Titel: `src/content/schedule.ts`.
- Grafiken/Sounds: nur über IDs aus `src/assets/manifest.ts`; fehlende Dateien erscheinen als Platzhalter.
