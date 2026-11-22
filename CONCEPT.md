# Hogwarts-Adventskalender 2026 – Konzept

Stand: 17.11.2026 · Auftraggeber: Daniel · Quelle: Claude-Doc „Hogwarts-Adventskalender 2026 – Konzept“

## 0. Lesehinweise für den umsetzenden Agenten

Dieses Dokument ist die verbindliche Spezifikation. Es ist so aufgebaut, dass ein Coding-Agent es ohne Rückfragen umsetzen kann. Lies es einmal vollständig, bevor du Code schreibst.

**Verbindlichkeit:**

- **MUSS** = Pflicht. Abweichung nur nach Rückfrage beim Auftraggeber.
- **SOLL** = Standard. Abweichung erlaubt, wenn du sie im PR/Commit begründest.
- **KANN** = optional, nur wenn Zeit bleibt.

**Anforderungs-IDs:** Wichtige Anforderungen tragen IDs wie `[AUTH-3]` oder `[ADM-5]`. Verweise in Commits, Tests und Code-Kommentaren auf diese IDs.

**Kanonische Bezeichner:** Alle Namen in `code`-Schrift (Figuren, Orte, Variablen, Rätsel, Entscheidungen) sind feste IDs. Verwende sie exakt so in Code, Ink, JSON und Datenbank. Das Glossar (Abschnitt 2) ist die Quelle.

**Vorrang bei Widersprüchen:** Abschnitt 1 (Rahmenbedingungen) > Abschnitt 3 (Nutzer) und 14 (Firebase) > übrige Abschnitte. Bei verbleibenden Unklarheiten: die einfachere Lösung wählen, in `DECISIONS.md` notieren, weitermachen.

**Arbeitsweise:**

1. Meilenstein für Meilenstein arbeiten (Abschnitt 17). Nach jedem Meilenstein die Abnahmekriterien selbst prüfen und berichten.
2. Fehlende Grafiken nie blockieren lassen: Platzhalter rendern (Abschnitt 5.4).
3. Story-Texte schreibst du selbst nach Abschnitt 7–9. Sie werden vom Auftraggeber gegengelesen.
4. Keine Inhalte oder Figuren aus Büchern/Filmen übernehmen außer Setting-Elementen (Hogwarts, Häuser, Sprechender Hut, Orte, Zaubererwährung). Keine Film-Musik.
5. Sprache der App: Deutsch. Sprache von Code, Kommentaren und Bezeichnern: Englisch.

## 1. Ziel und Rahmenbedingungen

**Produkt:** „Hogwarts und die Adventsuhr“, ein digitaler Adventskalender als Pixel-Abenteuer im Stil von Professor Layton. Vom 1. bis 24. Dezember 2026 öffnet sich täglich ein Kapitel: kurzes Text-Abenteuer mit Entscheidungen, dann ein Rätsel. Entscheidungen verändern Beziehungen, Hinweise, Gegenstände, Routen und das Ende.

**Zielgruppe:** Eine kleine, eingeladene Gruppe: die Freundin des Auftraggebers (Hauptspielerin), seine Eltern, evtl. weitere Personen. Alle spielen dieselbe Geschichte mit eigenem Spielstand. Der Auftraggeber verwaltet alles über eine Admin-Konsole und sieht alle Entscheidungen.

| ID | Rahmenbedingung | Wert |
| --- | --- | --- |
| `[RB-1]` MUSS | Gerät | **Nur Smartphone im Hochformat** (iOS Safari, Android Chrome). Desktop/Querformat wird nicht unterstützt, nur ein Hinweis-Bildschirm |
| `[RB-2]` MUSS | Spielzeit pro Tag | max. 5 Minuten, Ziel 3–4 Minuten |
| `[RB-3]` MUSS | Story pro Tag | max. 250 Wörter Dialog auf dem längsten Pfad, 1–2 Entscheidungen |
| `[RB-4]` MUSS | Rätsel pro Tag | genau 1, Lösezeit 1–3 Minuten |
| `[RB-5]` MUSS | Nie steckenbleiben | nach 3 Fehlversuchen oder 4 Minuten bietet die Mentorin die Lösung an |
| `[RB-6]` MUSS | Freischaltung | Tag N ab N. Dezember 2026, 00:00 Uhr Europe/Berlin. Prolog ab 30.11.2026, 18:00 Uhr |
| `[RB-7]` MUSS | Hosting | GitHub Pages (statisch), ein öffentliches Repository |
| `[RB-8]` MUSS | Backend | Firebase Auth + Cloud Firestore, Spark-Tarif (0 €). Kein Cloud Storage, keine Cloud Functions |
| `[RB-9]` MUSS | Inhalte | Story, Rätsel und Grafiken liegen im App-Bundle (nicht in der Datenbank). Nur Spielstände, Nutzer, Ereignisse und persönliche Inhalte liegen in Firestore |
| `[RB-10]` MUSS | Sprache | Deutsch, Anrede „du“ |
| `[RB-11]` MUSS | Grafik | Zunächst freie Pixel-Sprites. Jede Grafik muss später durch eigene ersetzbar sein, ohne Code zu ändern (Asset-Manifest) |
| `[RB-12]` MUSS | Figuren | Nur eigene Figuren. Hogwarts als Setting ja, bekannte Figuren aus Büchern/Filmen nein |
| `[RB-13]` MUSS | Go-live | 30.11.2026, 18:00 Uhr mit Prolog + Tag 1–8 + Admin-Basis. Restliche Tage werden im Dezember nachgeliefert, jeder Tag spätestens 3 Tage vor Freischaltung |

**Nicht im Umfang:** öffentliche Registrierung, Mehrsprachigkeit, Desktop-Layout, Echtzeit-Multiplayer, Bestenlisten zwischen Spielern (die Spieler sehen einander nicht).

## 2. Glossar und kanonische Bezeichner

### Begriffe

| Begriff (UI) | Bezeichner | Bedeutung |
| --- | --- | --- |
| Spieler | `player` | Eingeladene Person mit eigenem Spielstand |
| Admin | `admin` | Der Auftraggeber. Verwaltet Spieler, sieht alle Daten, kann selbst spielen |
| Zauberwort | `password` | Passwort im UI |
| Eulenname | `username` | Login-Name im UI (z. B. `lena`, `mama`) |
| Kapitel / Tag | `day` (1–24), `prologue` | Inhalt eines Kalendertags |
| Szene | `scene` | Story-Teil eines Kapitels (Ink) |
| Rätsel | `puzzle` | Interaktive Aufgabe, ID `p01` … `p24`, `p13w`, `p13a` usw. |
| Entscheidung | `choice` | Auswahlpunkt in der Story, ID `d07.letter`, Option z. B. `give` |
| Hinweis (Ermittlung) | `clue` | Beweisstück `k01` … `k10` |
| Gegenstand | `item` | Inventar-Eintrag |
| Hilfe-Hinweis | `hint` | Rätselhilfe, kostet Funken |
| Zauberfunken | `sparks` | Währung für Hilfe-Hinweise |
| Hauspunkte | `housePoints` | Punkte für gelöste Rätsel |
| Truhe | `trunk` | Hauptmenü: Tagebuch, Rätselsammlung, Inventar (Gegenstände als Bilder mit Namen), Hinweise (Gegenstands-Hinweise als Bilder, Beobachtungen als Text), Steckbrief, Einstellungen |
| Durchlauf | `runId` | Zähler pro Spieler, steigt beim Zurücksetzen des Spielstands |
| Ereignis | `event` | Protokolleintrag für die Admin-Konsole |

### Figuren

`quill` (Prof. Henrietta Quill, Mentorin) · `ellis` (Ellis Wren, Begleiter) · `theo` (Theo Ashcombe) · `maren` (Maren Holloway) · `grimsby` (Hausmeister Grimsby) · `aldous` (Sir Aldous Frostbart, Hausgeist) · `thornbury` (Schulleiterin) · `hat` (Sprechender Hut) · `knopf` (Niffler) · `wandmaker` (Zauberstabmacherin) · `player` (Spielfigur)

### Häuser

`gryffindor` · `hufflepuff` · `ravenclaw` · `slytherin`

### Orte (Hintergründe)

| ID | Ort | Tage |
| --- | --- | --- |
| `letter` | Pergament-Brief (UI-Hintergrund) | Prolog |
| `robe_shop` | Umhangladen mit Spiegel | Prolog |
| `wand_shop` | Zauberstabladen | Prolog |
| `train` | Abteil im Hogwarts-Express | Prolog |
| `great_hall` | Große Halle mit Adventsuhr | Prolog, 1, 2, 16, 23, 24 |
| `staircases` | Wandernde Treppen | 3 |
| `library` | Bibliothek | 4 |
| `potions` | Zaubertrank-Kerker | 5 |
| `dorm_corridor` | Schlafsaal-Korridor bei Nacht | 6 |
| `owlery` | Eulerei | 7 |
| `greenhouse` | Gewächshaus | 8 |
| `common_room` | Gemeinschaftsraum (ein Bild, per Palette in 4 Hausfarben) | 9 |
| `caretaker_office` | Hausmeisterbüro | 10 |
| `grounds_snow` | Schlossgelände im Schnee | 11 |
| `astronomy_tower` | Astronomieturm | 12 |
| `forest_edge`, `forest_clearing`, `niffler_burrow` | Verbotener Wald | 13w–15w |
| `archive`, `dungeon_corridor`, `portrait_gallery` | Archiv-Route | 13a–15a |
| `hogsmeade` | Dorfstraße im Schnee | 17 |
| `room_of_requirement` | Raum der Wünsche | 18 |
| `ghost_corridor` | Korridor der Geister | 19 |
| `dueling_club` | Duellierclub | 20 |
| `clock_tower` | Uhrturm innen | 21 |
| `pendulum_chamber` | Pendelkammer | 22 |
| `calendar` | Kalender-Ansicht (Adventsuhr frontal) | immer |

## 3. Nutzer, Rollen und Login

Es gibt genau zwei Rollen: `admin` (der Auftraggeber) und `player` (alle Eingeladenen). Konten werden nur vom Admin angelegt, es gibt keine öffentliche Registrierung. Login erfolgt mit **Eulenname + Zauberwort**, nicht mit E-Mail, damit es auch für die Eltern einfach ist.

### 3.1 Rollen

| Fähigkeit | `player` | `admin` |
| --- | --- | --- |
| Spielen mit eigenem Spielstand | ja | ja (eigener Test-Spielstand) |
| Eigenen Spielstand lesen/schreiben | ja | ja |
| Andere Spieler sehen | nein | ja |
| Admin-Konsole öffnen | nein | ja |
| Spieler anlegen, deaktivieren, zurücksetzen | nein | ja |
| Persönliche Inhalte bearbeiten | nein | ja |
| Debug-Datum, Tag springen | nein | ja |

### 3.2 Anforderungen

- `[AUTH-1]` MUSS: Firebase Auth mit E-Mail/Passwort-Provider. Der Eulenname wird intern auf eine synthetische Adresse abgebildet: `<username>@hogwarts.example.com` (reservierte Domain, es werden nie Mails verschickt).
- `[AUTH-2]` MUSS: `username` = 3–16 Zeichen, `a–z`, `0–9`, `-`. Eingabe wird kleingeschrieben und getrimmt.
- `[AUTH-3]` MUSS: Zugriff auf Spieldaten nur, wenn ein Dokument `users/{uid}` mit `active == true` existiert. Wer sich anders ein Konto anlegt, hat keinen Zugriff (Security Rules, Abschnitt 14).
- `[AUTH-4]` MUSS: Sitzung bleibt dauerhaft angemeldet (`indexedDBLocalPersistence`). Abmelden nur über Truhe → Einstellungen, mit Bestätigung.
- `[AUTH-5]` MUSS: Der Admin legt Spieler in der Admin-Konsole an (Abschnitt 11). Technik ohne Server: eine **zweite Firebase-App-Instanz** (`initializeApp(config, 'provisioning')`) ruft `createUserWithEmailAndPassword` auf und meldet sich sofort wieder ab. So bleibt der Admin in der Haupt-Instanz angemeldet. Danach schreibt der Admin `users/{neueUid}`.
- `[AUTH-6]` MUSS: Beim Anlegen erzeugt die Konsole ein Zauberwort aus drei Wortbausteinen und einer Zahl, z. B. `zimt-eule-lumos-47` (Wortliste mit ca. 200 harmlosen deutschen Wörtern ohne Umlaute).
- `[AUTH-7]` MUSS: Die Konsole erzeugt pro Spieler eine **Einladung** als Bild (PNG, 1080 × 1350): Hogwarts-Brief-Optik mit Anzeigename, QR-Code auf `<app-url>/?u=<username>`, Eulenname und Zauberwort. Teilen über die Web-Share-API (z. B. WhatsApp) oder Speichern.
- `[AUTH-8]` MUSS: Login-Bildschirm im Pixel-Stil: Felder „Eulenname“ und „Zauberwort“, Knopf „Eintreten“. Der Parameter `?u=` füllt den Eulennamen vor. Freundliche Fehlermeldungen („Diese Eule kenne ich nicht.“, „Das Zauberwort stimmt nicht.“).
- `[AUTH-9]` MUSS: Deaktivierte Spieler (`active == false`) sehen „Deine Eule macht gerade Pause. Melde dich bei {adminName}.“
- `[AUTH-10]` MUSS: Nach dem ersten Login erscheint einmalig eine Anleitung „Zum Home-Bildschirm hinzufügen“ (getrennt für iOS und Android). Hinweis für den Agenten: Auf iOS hat die Home-Bildschirm-App einen eigenen Speicher, dort ist ein zweiter Login nötig. Das ist erwünscht und muss in der Anleitung stehen.
- `[AUTH-11]` MUSS: Zauberwort vergessen: Lokales Node-Skript `npm run admin:set-password -- <username> <neues-zauberwort>` mit Firebase Admin SDK und Service-Account-Schlüssel (liegt nur lokal, `.gitignore`). Die App selbst bietet kein Zurücksetzen an.
- `[AUTH-12]` MUSS: Bootstrap des Admins: Admin-Konto wird einmalig in der Firebase-Konsole angelegt. Seine UID steht als Konstante `ADMIN_UID` in `src/config.ts` und in `firestore.rules`. Beim ersten Login legt die App `users/{ADMIN_UID}` mit `role: 'admin'` an, falls es fehlt.
- `[AUTH-13]` SOLL: Der Spielstand des Admins trägt `isTest: true` und wird in Statistiken der Admin-Konsole standardmäßig ausgeblendet.

### 3.3 Nutzer-Datensatz `users/{uid}`

```ts
interface UserDoc {
  uid: string;
  username: string;          // Eulenname, eindeutig
  displayName: string;       // z. B. "Lena", "Mama"
  role: 'admin' | 'player';
  active: boolean;
  isTest: boolean;           // true für Admin und Testkonten
  runId: number;             // startet bei 1, +1 bei "Spielstand zurücksetzen"
  createdAt: Timestamp;
  lastSeenAt: Timestamp | null;
  note?: string;             // interne Notiz des Admins
}
```

Eindeutigkeit des Eulennamens: zusätzlich Dokument `usernames/{username}` mit `{ uid }`. Wird in derselben Transaktion wie `users/{uid}` angelegt.

## 4. Ablauf eines Spieltags und Freischaltung

Jeder Tag folgt demselben Ablauf aus Bildschirmen (`screen`). Die Zeitangaben sind Zielwerte für `[RB-2]`.

1. `calendar` (5 s): Die Adventsuhr frontal mit 24 Türchen. Zustände pro Türchen: `locked` (Countdown beim Antippen), `available` (leuchtet, pulsiert), `done` (Wachssiegel in Hausfarbe). Oben: Hauspunkte, Funken, Knopf zur Truhe.
2. `chapterCard` (5 s): Pergamentkarte „Kapitel 7 – Die Eulerei“ mit Jingle. Tippen geht weiter.
3. `scene` (60–90 s): Ink-Story des Tages mit Hintergrund, Figuren, Dialogbox, Entscheidungen. 1–2 versteckte Funken (`# spark`).
4. `puzzleIntro` (5 s): „Rätsel 07 · 30 Hauspunkte“ im Layton-Stil. Ausgelöst durch `# puzzle: <id>` im Ink.
5. `puzzle` (60–180 s): Aufgabe oben, Interaktion unten (Abschnitt 10).
6. `solution` (15 s): Stempel „Richtig!“, Erklärung, vergebene Punkte.
7. `scene` (30 s): Ink läuft nach dem Rätsel weiter bis `END` (Folgen, Cliffhanger).
8. `dayEnd` (10 s): Zusammenfassung: Punkte, Funken, neue Hinweise/Gegenstände, Countdown zum nächsten Kapitel.

### 4.1 Regeln

- `[DAY-1]` MUSS: Tag N ist verfügbar, wenn `jetzt >= unlockAt(N)` und Tag N−1 abgeschlossen ist. `unlockAt(N)` = 2026-12-N 00:00 Europe/Berlin = 2026-12-(N−1) 23:00 UTC. Prolog: 2026-11-30 17:00 UTC.
- `[DAY-2]` MUSS: „jetzt“ = Geräteuhr + gemessene Abweichung zur Serverzeit. Messung beim App-Start: `lastSeenAt: serverTimestamp()` in `users/{uid}` schreiben, zurücklesen, Differenz speichern. Offline: Geräteuhr.
- `[DAY-3]` MUSS: Verpasste Tage werden nacheinander nachgeholt. Kalender zeigt „3 Kapitel warten auf dich“.
- `[DAY-4]` MUSS: Spielstand wird nach jedem Schritt gespeichert (jede Entscheidung, jeder Rätselversuch, jeder Bildschirmwechsel). Ein abgebrochener Tag wird am letzten Ink-Zustand bzw. am Rätsel fortgesetzt.
- `[DAY-5]` MUSS: Entscheidungen sind endgültig. Ein Tag kann nicht neu gespielt werden. Rätsel sind in Truhe → Rätselsammlung ohne Punkte wiederholbar. Gelesene Dialoge stehen in Truhe → Tagebuch, nach Kapiteln geordnet: pro gelesenem Tag (und Prolog) eine aufklappbare Schaltfläche, es ist immer nur ein Kapitel offen, das neueste beim Öffnen.
- `[DAY-6]` MUSS: Nach dem 24.12. bleibt die App nutzbar: Truhe, Rätselsammlung, erreichtes Ende, Brief.
- `[DAY-7]` MUSS: Admin kann in der App ein Debug-Datum setzen und Tage direkt starten (nur eigener Spielstand). Debug-Funktionen sind für `player` nicht erreichbar.

## 5. Darstellung: Handy, Layout, Grafik, Sound

Der Look verbindet **Layton** (zwei Bildschirme, Rätselnummern, Hinweismünzen, Pergament) mit **Pokémon-artiger Pixelgrafik** (Top-down-Sprites, klare Konturen). Stimmung: europäisch-gotisch, Stein, Kerzenlicht, Holz, Schnee.

### 5.1 Bildschirm-Layout (nur Hochformat)

Die App rendert eine logische Fläche von **256 × 448 Pixeln**, von oben nach unten:

| Bereich | Größe (logisch) | Inhalt |
| --- | --- | --- |
| `statusBar` | 256 × 24 | Hauspunkte, Funken, Tag, Truhe-Knopf |
| `topScreen` | 256 × 192 | Szene, Figuren, Kapitelkarte, Rätseltext |
| `hinge` | 256 × 8 | Scharnier in Holzoptik |
| `bottomScreen` | 256 × 192 | Dialogbox, Entscheidungen, Rätsel-Interaktion, Menüs |
| `navBar` | 256 × 32 | Kontextknöpfe (Hinweis, Notiz, Zurück, Weiter) |

- `[UI-1]` MUSS: Skalierung: `s = floor(devicePixelWidth / 256)` in Gerätepixeln, CSS-Größe = `256 · s / devicePixelRatio`. Ist das Ergebnis schmaler als 85 % der Bildschirmbreite, darf ein nicht ganzzahliger Faktor verwendet werden (bei DPR ≥ 2 nicht sichtbar). `image-rendering: pixelated` auf allen Grafiken.
- `[UI-2]` MUSS: Fläche horizontal zentriert, vertikal oben unter der Safe-Area (`env(safe-area-inset-*)`). Restfläche mit dunklem Steinmuster.
- `[UI-3]` MUSS: Querformat oder Breite > 600 CSS-px zeigt nur „Bitte nimm dein Handy hochkant“ bzw. „Dieser Kalender lebt auf dem Handy“ mit QR-Code der aktuellen URL.
- `[UI-4]` MUSS: Touch-Ziele mindestens 20 × 20 logische Pixel. Kein Hover-abhängiges Verhalten. Kein Doppeltipp-Zoom (`touch-action: manipulation`), kein Pull-to-Refresh im Spiel (`overscroll-behavior: none`).
- `[UI-5]` MUSS: PWA mit `display: standalone`, Hochformat, App-Icon (Adventsuhr), Splash in Dunkelblau.
- `[UI-6]` SOLL: Bildschirmübergänge als Pixel-Blende, max. 300 ms. Haptisches Feedback (`navigator.vibrate`, wo verfügbar) bei richtig/falsch.

### 5.2 Grafik-Stil

| Element | Spezifikation |
| --- | --- |
| Palette | Feste Palette in `src/data/palette.ts` (ca. 32 Farben: Kerzentöne, Winterblau, Steingrau, 4 Hausfarben-Paare) |
| Hintergründe | 256 × 192 PNG pro Ort, optional Animations-Overlay (Kerzen, Schnee) als Sprite |
| Figuren | 64 × 64-Frames (LPC-Format), 4 Richtungen, Idle + Gehen |
| Porträts | 64 × 64 in der Dialogbox. Phase 1: Kopfausschnitt (32 × 32) des Figuren-Sprites, 2-fach vergrößert. Gefühle über **Emote-Blasen** (`!`, `?`, `♥`, Schweißtropfen, Note, `…`) wie in klassischen RPGs. Phase 2: gezeichnete Porträts mit Mimiken |
| UI | 9-Slice-Rahmen (Pergament, dunkles Holz), Siegelwachs-Knöpfe |
| Schrift | Pixel-Schrift mit ä ö ü Ä Ö Ü ß „ “ – … (Kandidaten: „Pixelify Sans“, „m6x11“; Zeichensatz prüfen, Lizenz OFL o. ä.) |

### 5.3 Asset-Quellen (Phase 1: frei)

- `[GFX-1]` MUSS: Figuren aus dem **Universal LPC Spritesheet Character Generator** (Liberated Pixel Cup). Spielfigur aus Ebenen zur Laufzeit zusammengesetzt (Abschnitt 6), NPCs als fertig exportierte Sheets.
- `[GFX-2]` MUSS: Hintergründe aus freien Tilesets (OpenGameArt, itch.io; Lizenz CC0, CC-BY, CC-BY-SA, OGA-BY). Erstellung: Agent schreibt Karten im **Tiled-JSON-Format** (`.tmj`) und rendert sie per Build-Skript (`scripts/render-maps.ts`, node-canvas) zu PNG. So bleiben sie editierbar.
- `[GFX-3]` MUSS: Jede fremde Datei steht mit Autor, Quelle, Lizenz in `CREDITS.md` und im Credits-Bildschirm.
- `[GFX-4]` SOLL: Sprechender Hut, Adventsuhr und Niffler als eigene kleine Pixel-Sprites (Agent zeichnet sie programmatisch oder als PNG), falls keine passende freie Grafik existiert.

### 5.4 Asset-Manifest und Platzhalter

- `[GFX-5]` MUSS: Code referenziert Grafiken und Sounds **nur über logische IDs** (`bg.great_hall`, `npc.quill`, `portrait.quill`, `ui.frame.parchment`, `sfx.correct`). Das Manifest `src/assets/manifest.ts` bildet ID → Datei, Maße, Frames, Lizenz ab. Eigene Grafiken ersetzen später nur den Manifest-Eintrag bzw. die Datei.
- `[GFX-6]` MUSS: Fehlt eine Datei, rendert die App einen Platzhalter (farbiges Rechteck mit ID-Text) und loggt eine Warnung. Ein Build-Skript `npm run assets:check` listet fehlende und unbenutzte Assets.

### 5.5 Layton-Elemente

Rätselnummer + Punktwert vor jedem Rätsel · versteckte Zauberfunken in Szenen (statt Hinweismünzen) · Notiz-Zeichenfläche im Rätsel · große Stempel „Richtig!“/„Leider falsch“ · Truhe als Hauptmenü · Figuren leiten Rätsel ein („Das erinnert mich an ein Rätsel …“).

### 5.6 Sound

- `[SND-1]` MUSS: Chiptune-Musik, nur CC0/CC-BY: Titelthema, Schloss, Draußen/Schnee, Verlies/Wald, Rätsel, Finale. Keine Film-Melodien.
- `[SND-2]` MUSS: SFX: Textpiepen (pro Figur andere Tonhöhe), Auswahl, richtig, falsch, Funke, Türchen, Stempel.
- `[SND-3]` MUSS: Ton startet erst nach erster Berührung. Schalter Musik/Effekte getrennt in den Einstellungen.

### 5.7 Komfort

Text-Tempo (langsam/normal/sofort), Tippen beschleunigt bzw. überspringt · Rätsel nie nur über Farbe unterscheidbar · Schriftgröße im Dialog mindestens 8 logische Pixel Zeilenhöhe · Wiederholen der letzten Dialogzeile per Tagebuch.

## 6. Prolog: Charaktererstellung und Sprechender Hut

Der Prolog ist ab 30.11.2026, 18:00 Uhr spielbar, dauert ca. 4 Minuten und endet mit der Einteilung in ein Haus. Story-Rahmen: Die Spielfigur ist **Austauschschüler/in** und kommt am 1. Dezember mitten im Schuljahr nach Hogwarts.

### 6.1 Ablauf (`screen`-Folge)

1. `prologue.letter` (20 s): Pergament mit Wachssiegel fällt ins Bild, Tippen bricht das Siegel. Kurzer Brieftext. Unterschriftenzeile: **Name** eingeben (`name`, 1–12 Zeichen, Umlaute erlaubt, vorbelegt mit `displayName`). Darunter **Anrede**: Hexe / Zauberer / neutral (`pronoun`: `f` / `m` / `n`).
2. `prologue.mirror` (60–90 s): Aussehen wählen. Figur oben groß (Frame ×2), dreht sich per Wischgeste. Unten Kategorien als Reiter, Optionen als Pfeile links/rechts. Knopf „Zufall“.
3. `prologue.wand` (30 s): Drei Stäbe auf Samt. Antippen → Funken → bestätigen (`wand`).
4. `prologue.pet` (15 s): Eule, Katze oder Kröte (`pet`).
5. `prologue.train` (20 s): kurze Fahrt-Szene (Ink), Ankunft, `quill` holt die Figur ab.
6. `prologue.sorting` (90 s): Sprechender Hut, 5 Fragen, Ergebnis, Annehmen/Widersprechen.
7. `prologue.reveal` (10 s): Grauer Umhang färbt sich in Hausfarben (Palette-Swap), Wappen erscheint, Jubel. Danach `calendar`.

### 6.2 Optionen der Charaktererstellung

`[CHAR-1]` MUSS: Die Spielfigur besteht aus LPC-Ebenen in dieser Reihenfolge: `body` → `eyes` → `hair_back` → `clothes` → `robe` → `hair_front` → `glasses` → `accessory`. Der `CharacterComposer` setzt sie zur Laufzeit zusammen und cached das Ergebnis.

| Kategorie | Feld | Mindestanzahl Optionen | Wirkung |
| --- | --- | --- | --- |
| Hautton | `look.skin` | 6 | Optik |
| Frisur | `look.hair` | 8 | Optik |
| Haarfarbe | `look.hairColor` | 8 | Optik |
| Augenfarbe | `look.eyes` | 5 | Optik |
| Brille | `look.glasses` | keine + 2 | Optik |
| Accessoire | `look.accessory` | keins + 3 (z. B. Mütze, Schleife, Ohrringe) | Optik |
| Pullover | `look.sweater` | 6 Farben | Optik |
| Zauberstab | `wand` | `phoenix` · `dragon` · `unicorn` | Tag 20: eigene Duell-Option |
| Haustier | `pet` | `owl` · `cat` · `toad` | Gratis-Hinweis an Tag 5, 13, 21; eigene Szenenzeilen |
| Haus | `house` | per Hut, überstimmbar | Tag 9, Passwort-Rätsel, Hauspokal |

Welche Frisuren/Accessoires es konkret gibt, richtet sich nach den verfügbaren LPC-Ebenen. Die Mindestanzahlen gelten.

`[CHAR-2]` MUSS: Der Umhang ist vor der Einteilung grau. Hausfarben entstehen per Palette-Swap (2 Farben pro Haus), keine eigenen Grafiken pro Haus.

### 6.3 Der Sprechende Hut

`[HAT-1]` MUSS: 5 Fragen mit je 4 Antworten, Reihenfolge der Antworten zufällig. Jede Antwort gibt einem Haus 2 Punkte. Gleichstand: Antwort auf Frage 4 entscheidet. Daten in `src/content/sortingQuiz.ts`.

| # | Frage | `gryffindor` | `hufflepuff` | `ravenclaw` | `slytherin` |
| --- | --- | --- | --- | --- | --- |
| 1 | Ein Weg gabelt sich im Wald. Welchen nimmst du? | Den dunklen, aus dem Geräusche kommen | Den, auf dem deine Freunde schon vorgegangen sind | Den mit den alten Runensteinen | Den, der als Abkürzung zum Ziel führt |
| 2 | Eine Freundin hat bei einer Prüfung geschummelt. Was tust du? | Sie direkt darauf ansprechen | Ihr helfen, es wiedergutzumachen | Herausfinden, warum sie es nötig hatte | Schweigen – aber sie schuldet dir was |
| 3 | Welches Geschenk würde dich am meisten freuen? | Ein Ticket ins Abenteuer | Ein Festessen mit allen Freunden | Ein Buch, das es nur einmal gibt | Ein Schlüssel zu einem geheimen Raum |
| 4 | Wofür willst du in 100 Jahren bekannt sein? | Für meinen Mut | Für meine Güte | Für meine Entdeckungen | Für das, was ich erreicht habe |
| 5 | Du findest ein Kästchen mit der Aufschrift „Nicht öffnen“. | Öffnen. Sofort. | Dem Besitzer zurückbringen | Erst das Schloss studieren | Aufheben – wer weiß, wofür es gut ist |

`[HAT-2]` MUSS: Nach der Auswertung murmelt der Hut („Hmm … schwierig, sehr schwierig …“), ruft das Haus aus und fragt: „Oder hast du einen anderen Wunsch?“

- Annehmen → `house` gesetzt, `hatOverruled = false`.
- Widersprechen → Auswahl der drei anderen Häuser. Hut: „Du weißt, was du willst. Das allein sagt schon viel über dich.“ → `hatOverruled = true`.

`[HAT-3]` MUSS: Alle Prolog-Ergebnisse (Name, Anrede, Look, Stab, Haustier, Hut-Vorschlag, gewähltes Haus, alle 5 Antworten) werden als Ereignisse protokolliert (Abschnitt 14.3).

Optik des Huts: alter, geflickter Zauberhut mit einer Falte als Mund, auf einem Hocker. Tiefes, brummiges Textpiepen.

## 7. Story und Figuren

**Prämisse:** In der Großen Halle steht seit 1726 die **Adventsuhr**, eine riesige Standuhr mit 24 Türchen. Jede Nacht im Dezember öffnet sich ein Türchen und gibt Weihnachtszauber frei (Schnee an der verzauberten Decke, singende Rüstungen, Zimtduft). Sind am 24. alle Türchen offen, ist Hogwarts für ein weiteres Jahr vor dem „Grauen Winter“ geschützt.

In der Nacht der Ankunft **bleibt die Uhr stehen**. Die Türchen lassen sich nur noch mit Rätseln öffnen, ein Notfallzauber der Uhrmacherin Isolde Tickwell. `quill` macht die Spielfigur zur Assistentin, weil die Uhr bei ihrem Eintreten ein einziges Mal geschlagen hat. Jeden Tag öffnen sie ein Türchen. Die durchgehende Frage: **Wer hat die Uhr angehalten – und warum?**

### 7.1 Schreibregeln für den Agenten

- `[STY-1]` MUSS: Ton warm, leicht humorvoll, gemütlich-geheimnisvoll wie bei Layton. Niemand ist böse, jedes Geheimnis hat einen menschlichen Grund. Familienfreundlich (auch Eltern spielen).
- `[STY-2]` MUSS: Dialogzeilen max. 2 Zeilen in der Dialogbox (ca. 90 Zeichen). Lieber mehr kurze Zeilen.
- `[STY-3]` MUSS: Die Spielfigur spricht nur über Entscheidungen. Entscheidungstexte max. 40 Zeichen.
- `[STY-4]` MUSS: Jede Figur hat eine erkennbare Stimme (siehe Tabelle). `quill` sagt in jedem Akt einmal ihren Leitspruch.
- `[STY-5]` MUSS: Keine Romantik in der Story selbst. Persönliches kommt nur über Abschnitt 12.

### 7.2 Figuren

| ID | Name | Rolle | Stimme / Merkmale | Wahrheit (geheim) |
| --- | --- | --- | --- | --- |
| `quill` | Prof. Henrietta Quill | Mentorin (Layton-Rolle) | Rätselkunde & Arithmantik. Spitzer Hut mit Teelöffel als Hutnadel, immer Tee. Leitspruch: „Jedes Rätsel hat eine Lösung, meine Liebe.“ (bzw. „mein Lieber“ / „mein Gutes“ je `pronoun`) | – |
| `ellis` | Ellis Wren | Begleiter (Luke-Rolle), Ravenclaw, 6. Jahrgang | Neugierig, redet zu viel, Höhenangst, Wortwitze | – |
| `theo` | Theo Ashcombe | Verdächtiger, Slytherin | Knapp, ironisch, ausweichend | Nachfahre der Uhrmacherin, repariert heimlich, will seiner Familie etwas beweisen |
| `maren` | Maren Holloway | Verdächtige, Hufflepuff-Vertrauensschülerin | Überfreundlich, nervös | Versteckt den Niffler `knopf`, der ein goldenes Zahnrad gestohlen hat |
| `grimsby` | Hausmeister Grimsby | Verdächtiger | Grummelig, schimpft seit 30 Jahren auf das Ticken | Vermisst das Ticken schon am zweiten Tag |
| `aldous` | Sir Aldous Frostbart | Hausgeist, hilfsbereit | Ritterlich, altmodisch, melancholisch | **Hat die Uhr angehalten** |
| `thornbury` | Schulleiterin Thornbury | Rahmen (Tag 1, 24) | Würdevoll, trocken | – |
| `hat` | Der Sprechende Hut | Prolog, Finale | Brummig, weise, augenzwinkernd | – |
| `knopf` | Knopf | Niffler | Quiekt, liebt Glänzendes | Hat das Zahnrad |

### 7.3 Auflösung (nur für Entwickler)

`aldous` ist seit 300 Jahren an die Uhr gebunden. Isolde Tickwell, seine große Liebe, koppelte seinen Geist an ihr Werk, damit er bleiben konnte. Der Zauber gilt für 300 Zyklen, also bis 24.12.2026. Öffnet sich das letzte Türchen, zieht er weiter. Er will Hogwarts nicht verlassen und hat die Uhr angehalten. Er hilft bei der Suche, weil er hin- und hergerissen ist. Das gestohlene Zahnrad von `knopf` ist ein zweiter, unabhängiger Defekt, der die Ermittlung verwirrt.

### 7.4 Drei Akte

| Akt | Tage | Titel | Inhalt |
| --- | --- | --- | --- |
| I | 1–8 | Die stehende Uhr | Ankunft, Auftrag, Schloss erkunden, erste Spuren |
| II | 9–16 | Verdacht | Verdächtige befragen, Routenwahl an Tag 12 (Wald oder Archiv), Wiedervereinigung an Tag 16 |
| III | 17–24 | Die letzte Stunde | Hogsmeade, Erinnerung der Uhrmacherin, Duell, Uhrturm, Anklage (23), Finale (24) |

## 8. Zustände, Entscheidungen und Enden

Entscheidungen wirken auf **Beziehungen**, **Hinweise**, **Gegenstände** und **Routen**. Zusammen bestimmen sie eines von drei Enden und den Epilog. Jede Wirkung wird sofort sichtbar (Toast: „Ellis wird sich das merken.“) und später im Dialog wieder aufgegriffen.

### 8.1 Zustandsvariablen (`globals.ink`)

| Variable | Ink-Typ / Bereich | Gesetzt in |
| --- | --- | --- |
| `name` | string | Prolog |
| `pronoun` | string `f` · `m` · `n` | Prolog |
| `house` | string (Haus-ID) | Prolog |
| `hat_overruled` | bool | Prolog |
| `wand` | string `phoenix` · `dragon` · `unicorn` | Prolog |
| `pet` | string `owl` · `cat` · `toad` | Prolog |
| `bond_ellis` | int 0–5, Start 1 | Tage 1, 3, 4, 11, 12, 17, 22 |
| `trust_theo` | int −2…+3, Start 0 | Tage 5, 6, 13a, 20 |
| `trust_maren` | int −2…+3, Start 0 | Tage 8, 16 |
| `trust_grimsby` | int −2…+3, Start 0 | Tage 2, 10 |
| `trust_aldous` | int −2…+3, Start 0 | Tage 15a, 17, 19 |
| `clues` | LIST `k01` … `k10` | siehe 8.3 |
| `items` | LIST (siehe 8.4) | siehe 8.4 |
| `route` | string `forest` · `archive` | Tag 12 |
| `accused` | string (Figuren-ID) | Tag 23 |
| `ending` | string `A` · `B` · `C_A` · `C_B` | Tag 24 |
| `maren_covered` | bool, Start false | Tag 16 (d16.maren = cover) |

`housePoints`, `sparks` und Rätselergebnisse verwaltet die App, nicht Ink. Ink kann sie über die Variable `last_puzzle_first_try` (bool) abfragen. Werte außerhalb des Bereichs werden geklemmt.

### 8.2 Entscheidungsarten und Regeln

1. **Ton** – ändert nur Dialog und spätere Anspielungen.
2. **Beziehung** – ändert `bond_*`/`trust_*` um ±1.
3. **Hinweis/Gegenstand** – nur eine Option bringt einen Hinweis oder Gegenstand.
4. **Route** – ändert Tag 13–15 komplett.

- `[DEC-1]` MUSS: Jede Entscheidung hat eine stabile ID (`d07.letter`) und jede Option eine Options-ID (`give`). Format im Ink: Choice-Tag `# cid: d07.letter.give`. Ohne ID schlägt `content:lint` fehl.
- `[DEC-2]` MUSS: Jeder Tag hat mindestens eine Entscheidung vom Typ 2–4 und mindestens einen Rückbezug auf eine frühere Entscheidung.
- `[DEC-3]` MUSS: Kein Game Over. Kein Rätsel wird durch Entscheidungen gesperrt.
- `[DEC-4]` MUSS: Kein Ermittlungshinweis ist nur auf einem Weg erreichbar: `trust_maren ≥ 2` bringt `k04`/`k05` an Tag 16 auch auf der Archiv-Route; `trust_theo ≥ 2` bringt `k06` an Tag 20 auch auf der Wald-Route; `k07` gibt es an Tag 18 für alle, die es noch nicht haben.
- `[DEC-5]` MUSS: Jede gewählte Option wird als Ereignis protokolliert (Abschnitt 14.3).

### 8.3 Ermittlungshinweise

| ID | Hinweis | Fundort | Zeigt auf |
| --- | --- | --- | --- |
| `k01` | Kratzspuren am Uhrkasten | Tag 2, automatisch | `knopf` |
| `k02` | Eiskalte Stelle vor der Uhr | Tag 3, Option „Kälte untersuchen“ | `aldous` |
| `k03` | Theos Notizbuch mit Zahnradskizzen | Tag 6, automatisch | `theo` (falsche Fährte) |
| `k04` | Das goldene Zahnrad | Tag 14w / Tag 16 bei `trust_maren ≥ 2` | `knopf` |
| `k05` | Knopf, der Niffler | Tag 15w / Tag 16 bei `trust_maren ≥ 2` | `knopf` |
| `k06` | Brief der Uhrmacherin an „meinen Ritter“ | Tag 13a / Tag 20 bei `trust_theo ≥ 2` | `aldous` |
| `k07` | Porträt von 1726 mit Aldous lebend | Tag 15a / Tag 18 | `aldous` |
| `k08` | Grimsbys Logbuch: woanders zur Tatzeit | Tag 10, bei freundlicher Option | entlastet `grimsby` |
| `k09` | Raureif im Uhrwerk | Tag 21, automatisch | `aldous` |
| `k10` | Inschrift „CCC“ im Pendel | Tag 22, automatisch | `aldous` |

### 8.4 Gegenstände

| ID | Gegenstand | Tag | Nutzen |
| --- | --- | --- | --- |
| `bookmark` | Lesezeichen der Uhrmacherin | 4 | +1 Funke an Tag 13a/13w |
| `anonymous_letter` | Anonymer Brief | 7 | Dialog-Bonus an Tag 23 |
| `house_token` | Hausgegenstand (je Haus anders) | 9 | Bonus-Szene an Tag 18 |
| `lantern` | Laterne | 13w | Funke an Tag 15w |
| `archive_key` | Archivschlüssel | 13a | Abkürzung-Dialog an Tag 15a |
| `gift_scarf` | Schal für Ellis | 17 | `bond_ellis` +1, Epilog |
| `gift_music_box` | Spieluhr für Aldous | 17 | `trust_aldous` +1, Finale-Szene |
| `theo_wrench` | Theos Uhrmacherschlüssel | 20 (wenn verbündet) | Finale A: ein Schritt weniger |

### 8.5 Wichtige Weichen

| Tag | Entscheidungs-ID | Optionen → Wirkung |
| --- | --- | --- |
| 6 | `d06.theo` | `report` → `trust_theo` −1 · `confront` → `trust_theo` +1 |
| 9 | `d09.secret` | `share` → `house_token` · `keep` → Ton |
| 12 | `d12.route` | `forest` · `archive` → `route` |
| 16 | `d16.maren` | `cover` → `trust_maren` +1, maren\_covered = true · `report` → `trust_maren` −1 |
| 20 | `d20.duel` | `ally` (nur bei `trust_theo ≥ 1`) → `theo_wrench` · `oppose` → Ton; Stab-Sonderoption |
| 23 | `d23.accuse` | `theo` · `maren` · `grimsby` · `aldous` → `accused` |
| 24 | `d24.fate` | `release` · `third_way` (nur wenn Bedingung A erfüllt) |

### 8.6 Enden

`[END-1]` MUSS: Auswertung an Tag 24 in genau dieser Reihenfolge:

```
essential = |clues ∩ {k02, k06, k07, k09, k10}|
if accused == aldous and essential >= 3 and trust_aldous >= 1: ending = A
elif accused == aldous:                                        ending = B
elif bond_ellis >= 4:                                          ending = C_A
else:                                                          ending = C_B
```

| Ende | Bezeichnung | Inhalt |
| --- | --- | --- |
| `A` | Die dritte Lösung (wahres Ende) | Finale-Rätsel in Variante A: Die Uhr wird so umgebaut, dass der Bund sich erneuert. Aldous bleibt, Schnee fällt in der Halle |
| `B` | Abschied im Schnee | Aldous gesteht, Uhr läuft, er verabschiedet sich unter dem Baum. Rührend, nicht traurig |
| `C_A` | Der Geist gesteht + Ellis' Idee | Falsch beschuldigte Person widerlegt den Verdacht, Aldous gesteht freiwillig, Ellis findet die Lösung → weiter wie A |
| `C_B` | Der Geist gesteht | wie C\_A, aber weiter wie B |

Alle Enden sind schön und keines bestraft.

### 8.7 Epilog-Bausteine

`bond_ellis ≥ 4` → Ellis schenkt seinen Schal, „beste Freunde“ · `trust_theo ≥ 2` → Theo wird Uhrmacher-Lehrling · `maren_covered` → Knopf wird Schul-Niffler · `trust_grimsby ≥ 1` → Grimsby zieht die Uhr summend auf · Hauspokal: eigenes Haus gewinnt, Rede je Haus · `hat_overruled` → Hut: „Ich hatte recht, dich ziehen zu lassen.“ · danach immer: persönlicher Brief (Abschnitt 12).

## 9. Tagesplan 1–24

24 Kapitel, 27 Rätsel (Tag 13–15 je Route eigene Rätsel: Suffix `w` = Wald, `a` = Archiv). Schwierigkeit: leicht (1–4), mittel (5–16), knifflig (17–24), Lösezeit immer ≤ 3 Minuten. Der Agent schreibt daraus die vollständigen Ink-Dateien `day01.ink` … `day24.ink`.

| Tag | Ort | Story-Beat | Entscheidung → Wirkung | Rätsel (Engine) | Punkte |
| --- | --- | --- | --- | --- | --- |
| 1 | `great_hall` | Uhr bleibt stehen, `quill` rekrutiert, `ellis` stellt sich vor | `d01.ellis`: `listen` +bond · `hush` Ton | `p01` Die Zeiger: Wie oft decken sich Stunden- und Minutenzeiger zwischen 12 und 24 Uhr? Lösung `11` (`input`) | 20 |
| 2 | `great_hall` | Erstes Türchen. `grimsby` schimpft. `k01` | `d02.grimsby`: `polite` +trust · `cheeky` −trust | `p02` Schwebende Kerzen: 3×3, Tippen schaltet Kerze + Nachbarn, alle an (`toggle`) | 20 |
| 3 | `staircases` | Weg zum Uhrturm, plötzliche Kälte | `d03.cold`: `inspect` → `k02` · `follow` +bond | `p03` Die Treppen: Weg ins 7. Stockwerk, jede Treppe nur einmal (`path`) | 30 |
| 4 | `library` | Recherche: Uhrmacherin Isolde Tickwell | `d04.help`: `help` +bond · `read` → `bookmark` | `p04` Das Regal: 5 Bücher nach Hinweisen ordnen (`arrange` Reihe) | 30 |
| 5 | `potions` | Enteisungstrank. Haustier-Hinweis 1 | `d05.ingredient`: `accept` +trust\_theo · `decline` Ton | `p05` Drei Flaschen: 8/5/3 Liter, Ziel 4 + 4 (`custom:pour`) | 40 |
| 6 | `dorm_corridor` | Nikolausnacht, Stiefel vor Türen. `theo` schleicht zur Uhr. `k03` | `d06.theo`: `report` · `confront` | `p06` Die Nikolausstiefel: Logikgitter, 4 Personen (`arrange` Raster) | 30 |
| 7 | `owlery` | Anonymer Brief: „Lasst die Uhr ruhen.“ | `d07.letter`: `give` Ton · `keep` → `anonymous_letter` | `p07` Eulen-Nummern: Zahlenfolge fortsetzen (`input`) | 30 |
| 8 | `greenhouse` | `maren` nervös, Rascheln im Schuppen. Ende Akt I | `d08.maren`: `ask` +trust · `leave` Ton | `p08` Alraunen: 4 Töpfe in 4×4, keine zwei in Reihe/Spalte/Nachbarschaft (`arrange` Raster) | 40 |
| 9 | `common_room` | Hausabend, Tratsch über Verdächtige | `d09.secret`: `share` → `house_token` · `keep` | `p09` Das Passwort: hausspezifisches Worträtsel, 4 Varianten (`input`) | 30 |
| 10 | `caretaker_office` | `grimsby` befragen | `d10.grimsby`: `kind` → `k08` +trust · `strict` −trust | `p10` Der Schlüsselbund: Musterlogik (`choice`) | 40 |
| 11 | `grounds_snow` | Zwei Fährten führen vom Uhrturm weg; am See braucht Hagrid Hilfe mit seiner Herde | `d11.snow`: `play` +bond · `search` +1 Funke; `d11.hagrid`: `eat` → `ate_rockcake` · `decline` | `p11` Das Boot: 3 Hippogreife und 3 Frettchen über den See, Boot für 2, Überzahl verboten („Wolves and Chicks“, `custom:cross`) | 40 |
| 12 | `astronomy_tower` | `ellis` hat Höhenangst. Zwei Spuren | `d12.courage`: `encourage` +bond · `alone`; `d12.route`: `forest` · `archive` | `p12` Das Sternbild: in einem Zug nachzeichnen (`path`) | 40 |
| 13w | `forest_edge` | Mit `ellis` in den Wald. Haustier-Hinweis 2 | `d13w.lantern`: `on` → `lantern` · `off` +1 Funke | `p13w` Zentaurenpfeile: Zahlenlogik an Bäumen (`input`) | 40 |
| 13a | `archive` | Mit `quill` ins Archiv. `k06`. Haustier-Hinweis 2 | `d13a.theo`: `ask` +trust\_theo · `alone` → `archive_key` | `p13a` Der Stammbaum: sieben Karteikarten nach Hinweisen von der ältesten bis zur jüngsten Generation ordnen, bis Theo (`arrange` Reihe) | 40 |
| 14w | `forest_clearing` | Goldenes Zahnrad im Nest. `k04` | `d14w.gear`: `take` · `watch` Ton | `p14w` Das Spinnennetz: Weg ohne Fäden zu kreuzen (`path`) | 50 |
| 14a | `dungeon_corridor` | Notizen in Spiegelschrift | `d14a.tone`: Ton | `p14a` Spiegelschrift entziffern (`input`) | 50 |
| 15w | `niffler_burrow` | `knopf` gefunden. `k05`. Spur zu `maren` | `d15w.knopf`: `gentle` · `chase` | `p15w` Die falsche Galleone: Schokotaler mit zwei Wägungen finden (`custom:weigh`) | 60 |
| 15a | `portrait_gallery` | Porträt 1726: `aldous` lebend. `k07` | `d15a.aldous`: `ask` +trust\_aldous · `silent` | `p15a` Das Original: Wahrheit und Lüge unter acht Bildnissen (`tap`) | 60 |
| 16 | `great_hall` | Ballvorbereitung, Routen treffen sich, `maren` gesteht | `d16.maren`: `cover` · `report` | `p16` Die Tischordnung: 6 Gäste nach Bedingungen (`arrange` Reihe) | 50 |
| 17 | `hogsmeade` | Geschenke kaufen | `d17.gift`: `ellis` → `gift_scarf` · `aldous` → `gift_music_box` | `p17` Knallbonbons: Nim mit drei Haufen (3, 4, 5) gegen Fred und George, wer das letzte nimmt, gewinnt (`custom:nim`) | 40 |
| 18 | `room_of_requirement` | Erinnerung der Uhrmacherin, `k07` falls fehlend, persönliches Foto (Abschnitt 12) | `d18.token`: `use` (nur mit `house_token`) Bonus-Szene · `skip` | `p18` Die Tür, die erscheint: Schiebepuzzle 3×3 (`slide`) | 50 |
| 19 | `ghost_corridor` | Geisterparade, `aldous` traurig | `d19.aldous`: `comfort` +trust\_aldous · `press` Ton | `p19` Die Parade: Geister nach Jahrhundert ordnen (`arrange` Reihe) | 50 |
| 20 | `dueling_club` | Duelltraining, ggf. `k06` von Theo | `d20.duel`: `ally` · `oppose` (+ Stab-Option) | `p20` Zauberduell: Spruch-Logik wie Schere-Stein-Papier (`choice`) | 50 |
| 21 | `clock_tower` | Raureif im Uhrwerk. `k09`. Haustier-Hinweis 3 | `d21.tone`: Ton | `p21` Zahnräder: Drehrichtung des letzten Rads (`choice`) | 60 |
| 22 | `pendulum_chamber` | Inschrift „CCC“. `k10` | `d22.ellis`: `tell` +bond · `protect` Ton | `p22` Römische Stäbe: ein Stab umlegen, Gleichung stimmt (`arrange` Stab) | 60 |
| 23 | `great_hall` | Alle Verdächtigen versammelt | `d23.accuse` + 3 Hinweiskarten | `p23` Wer war es? Deduktion mit gesammelten Hinweisen (`custom:accuse`) | 70 |
| 24 | `great_hall` | Geständnis, Finale je Ende | `d24.fate`: `release` · `third_way` | `p24` Der letzte Schlag: Zeiger + Zahnräder stellen, Variante A/B (`custom:finale`) | 100 |

- `[PLAN-1]` MUSS: Tag 24: Kapitel + Rätsel ≤ 5 Minuten. Danach Abspann (Ende, Hauspokal, Epilog, Brief, Credits) 3–4 Minuten, überspringbar außer dem Brief.
- `[PLAN-2]` MUSS: Haustier-Hinweise an Tag 5, 13 und 21: Das Haustier kommentiert das Rätsel und schaltet Hinweis 1 gratis frei.
- `[PLAN-3]` MUSS: Alle Rätsel müssen eindeutig lösbar sein. Der Agent löst jedes Rätsel per Skript/Test, bevor es als fertig gilt (z. B. BFS für `slide`, `pour` und `cross`, Spielbaum für `nim`).

## 10. Rätsel-Engine

Alle 27 Rätsel laufen über **8 Engine-Typen**, die nur per JSON konfiguriert werden. Jede Engine wird einmal gebaut und getestet.

| Typ | Interaktion | Prüfung | Tage |
| --- | --- | --- | --- |
| `choice` | 2–6 Antwortkarten antippen | Index | 10, 20, 21 |
| `input` | Zahl oder Wort über eigene Pixel-Tastatur (keine System-Tastatur) | normalisierter Textvergleich | 1, 7, 9, 13w, 14a |
| `tap` | Stellen im Bild antippen | Menge der Ziel-Hotspots | 15w, 15a |
| `arrange` | Ziehen & Ablegen; Modi `row`, `grid`, `sticks` | Zielzustand oder Regelfunktion | 4, 6, 8, 13a, 16, 19, 22 |
| `slide` | Schiebepuzzle | Zielzustand | 18 |
| `toggle` | Felder an/aus, Nachbarn schalten mit | alle an | 2 |
| `path` | Linie Punkt zu Punkt ziehen | Regelfunktion | 3, 12, 14w |
| `custom` | Eigene Komponente: `pour`, `cross`, `nim`, `accuse`, `finale` | eigene Logik | 5, 11, 17, 23, 24 |

### 10.1 Datenformat

Rätsel liegen als `src/content/puzzles/<id>.json` und werden gegen dieses TypeScript-Schema validiert (zod):

```ts
interface Puzzle {
  id: string;                 // "p01", "p13w"
  number: number;             // Anzeige "Rätsel 01"
  title: string;
  points: number;             // Basis-Hauspunkte
  type: 'choice' | 'input' | 'tap' | 'arrange' | 'slide' | 'toggle' | 'path' | 'custom';
  prompt: string;             // Aufgabentext (oberer Screen), max. 280 Zeichen
  image?: string;             // Asset-ID, z. B. "puzzle.p01"
  config: Record<string, unknown>;  // typ-spezifisch, je Engine eigenes zod-Schema
  solution: unknown;          // typ-spezifisch (z. B. string[] bei input, Zielzustand bei slide)
  hints: [string, string, string];
  superHint: string;
  solutionText: string;       // Erklärung nach dem Lösen
  intro: { speaker: string; text: string };
  variants?: Record<string, Partial<Puzzle>>; // z. B. je Haus (p09) oder Ende (p24)
}
```

Beispiel `p01.json`:

```json
{
  "id": "p01", "number": 1, "title": "Die Zeiger", "points": 20, "type": "input",
  "prompt": "Zwischen 12 Uhr mittags und Mitternacht: Wie oft liegen Stunden- und Minutenzeiger genau übereinander?",
  "image": "puzzle.p01",
  "config": { "inputMode": "number", "maxLength": 2 },
  "solution": ["11"],
  "hints": [
    "Um 12:00 liegen sie schon übereinander. Zählst du das mit?",
    "Der Minutenzeiger überholt den Stundenzeiger etwa einmal pro Stunde …",
    "… aber nicht genau einmal. Zwischen 11 und 12 Uhr klappt es nicht."
  ],
  "superHint": "Es ist eine Zahl kleiner als 12.",
  "solutionText": "11 Mal. Der Minutenzeiger braucht etwas mehr als eine Stunde, um den Stundenzeiger einzuholen.",
  "intro": { "speaker": "quill", "text": "Eine Uhr, die steht, ist immer noch zweimal am Tag richtig. Aber dies hier …" }
}
```

- `[PZL-1]` MUSS: Normalisierung bei `input`: Kleinschreibung, Leerzeichen und Satzzeichen entfernen, ä→ae, ö→oe, ü→ue, ß→ss. Vergleich mit jedem Eintrag in `solution` (ebenfalls normalisiert).
- `[PZL-2]` MUSS: Jede Engine hat Vitest-Tests für „lösbar“, „falsche Eingabe“ und „Regelverletzung“.

### 10.2 Hilfe-Hinweise und Zauberfunken

- `[PZL-3]` MUSS: Start mit 3 Funken. Pro Szene 1–2 versteckte Funken (`# spark: x y`), alle 3–4 s kurzes Glitzern, Antippen sammelt.
- `[PZL-4]` MUSS: Hinweis 1–3 kosten je 1 Funken, Super-Hinweis 2. Gekaufte Hinweise bleiben sichtbar. Hinweise reduzieren die Punkte **nicht**.

### 10.3 Hauspunkte

| Situation | Anteil der Basispunkte |
| --- | --- |
| Richtig im 1. Versuch | 100 % |
| Richtig im 2. Versuch | 80 % |
| Richtig ab dem 3. Versuch | 60 % |
| Lösung von `quill` angenommen | 25 % |

- `[PZL-5]` MUSS: Nach 3 Fehlversuchen oder 4 Minuten fragt `quill`: „Sollen wir es gemeinsam durchgehen?“ Annehmen zeigt die Lösung + Erklärung und markiert das Rätsel als gelöst (`solvedBy: 'help'`). Ablehnen ist erlaubt, die Frage kommt nach 2 weiteren Minuten erneut.
- `[PZL-6]` MUSS: Bei `tap`, `arrange`, `slide`, `toggle`, `path` gibt es einen Knopf „Prüfen“; erst dieser zählt als Versuch. Zurücksetzen kostet nichts.
- `[PZL-7]` MUSS: Hauspokal an Tag 24: die anderen drei Häuser haben feste Punktstände knapp unter dem Spielerwert (z. B. −12 %, −18 %, −25 %).
- `[PZL-8]` MUSS: Folgende Werte werden als Ereignisse protokolliert: Rätsel gestartet, jeder Versuch (mit Eingabe), jeder Hinweis, gelöst (Versuche, Dauer in Sekunden, Punkte, `solvedBy`).

## 11. Admin-Konsole

Die Admin-Konsole ist Teil derselben App, liegt unter `#/admin`, ist nur für `role == 'admin'` sichtbar und wird als eigener Code-Chunk nachgeladen. Sie zeigt alle Spieler, jede Entscheidung, Rätsel-Statistiken und verwaltet Konten und persönliche Inhalte. Auch sie ist für das Handy gebaut.

### 11.1 Zugang

- `[ADM-1]` MUSS: Zugang über den normalen Login mit dem Admin-Konto. In der Truhe des Admins erscheint zusätzlich der Eintrag „Büro der Schulleitung“. Direktaufruf `#/admin` für Nicht-Admins leitet zum Kalender um.
- `[ADM-2]` MUSS: Die Sicherheit kommt aus den Security Rules (Abschnitt 14.4), nicht aus dem Ausblenden im Client.

### 11.2 Gestaltung

- `[ADM-3]` MUSS: Thema „Büro der Schulleitung“: dunkles Nachtblau als Grund, Pergament-Karten, Goldakzente, Hauswappen als Farbmarker. Überschriften in der Pixel-Schrift, Fließtext und Zahlen in einer gut lesbaren Schrift (System-UI-Stack). Kein Pixel-Canvas, normales responsives Layout für 360–430 CSS-px Breite.
- `[ADM-4]` MUSS: Navigation über eine Tab-Leiste unten: **Übersicht · Eulenpost · Entscheidungen · Rätsel · Mehr** (Mehr = Spieler verwalten, Persönliches, Werkzeuge).
- `[ADM-5]` MUSS: Spieler werden überall mit ihrem Avatar (Kopfausschnitt der eigenen Spielfigur aus dem `CharacterComposer`), Anzeigenamen und Hausfarbe dargestellt.

### 11.3 Ansichten

| ID | Ansicht | Inhalt |
| --- | --- | --- |
| `admin.overview` | Übersicht | Kennzahlen oben: aktive Spieler, heute gespielt, Ø Spielzeit heute. Darunter eine Karte pro Spieler: Avatar, Name, Haus, Fortschrittsbalken „Tag 7 / 24“, zuletzt aktiv („vor 2 Std.“), Hauspunkte, Status-Chip (`spielt gerade` · `auf dem Laufenden` · `2 Tage zurück` · `noch nicht gestartet` · `fertig`), erreichtes Ende. Tippen öffnet `admin.player` |
| `admin.feed` | Eulenpost (Live) | Die letzten 100 Ereignisse aller Spieler in Echtzeit (`onSnapshot`), als ganze Sätze: „Lena hat an Tag 7 den Brief behalten.“ · „Mama hat Rätsel 07 im 2. Versuch gelöst (1:42 min).“ Filter nach Spieler und Ereignistyp |
| `admin.decisions` | Entscheidungen | Pro Tag aufklappbar, pro Entscheidungspunkt: Frage, alle Optionen mit Text, darunter die Avatare der Spieler, die sie gewählt haben, und ein Verteilungsbalken. Oben eine Übersichtszeile pro Spieler: Haus (Hut-Vorschlag → gewählt), Route, Angeklagte/r, Ende |
| `admin.player` | Spieler-Detail | Steckbrief (Aussehen, Name, Anrede, Haus inkl. Hut-Vorschlag und 5 Hut-Antworten, Stab, Haustier). Beziehungswerte als Balken (`bond_ellis`, `trust_*`). Gefundene Hinweise (10 Symbole, fehlende grau). Inventar. Zeitstrahl pro Tag: gestartet/beendet, Spielzeit, Entscheidungen, Rätsel (Versuche, Eingaben, Hinweise, Dauer, Punkte). Aktionen siehe 11.4 |
| `admin.puzzles` | Rätsel-Statistik | Tabelle pro Rätsel: gelöst von x Spielern, Ø Versuche, Ø Dauer, Hinweis-Quote, Hilfe-Quote. Rätsel mit Ø Dauer > 3 min oder Hilfe-Quote > 30 % rot markiert |
| `admin.users` | Spieler verwalten | Liste aller Konten mit Status. Knopf „Neuen Spieler einladen“ (11.4) |
| `admin.personal` | Persönliches | Pro Spieler: Brief und persönliche Bausteine bearbeiten (Abschnitt 12), Vorschau im Spiel-Look |
| `admin.tools` | Werkzeuge | Debug-Datum für das eigene Konto, „Ins Spiel springen“ (Tag wählen), Export aller Daten als JSON-Download, App-Version und Build-Datum |

### 11.4 Aktionen

- `[ADM-6]` MUSS: **Spieler einladen:** Formular (Anzeigename, Eulenname mit Vorschlag aus dem Anzeigenamen, Notiz) → Zauberwort wird generiert `[AUTH-6]` → Konto anlegen `[AUTH-5]` → `users/{uid}` + `usernames/{username}` schreiben → Einladungsbild anzeigen `[AUTH-7]` mit „Teilen“ und „Speichern“. Das Zauberwort wird nur in diesem Moment angezeigt und nicht gespeichert.
- `[ADM-7]` MUSS: **Deaktivieren/Aktivieren** (setzt `active`).
- `[ADM-8]` MUSS: **Spielstand zurücksetzen:** Bestätigung durch Eintippen des Anzeigenamens. Setzt `runId + 1` und löscht `saves/{uid}`. Alte Ereignisse bleiben erhalten, die Konsole zeigt standardmäßig nur den aktuellen Durchlauf (Umschalter „alle Durchläufe“).
- `[ADM-9]` MUSS: **Einladung erneut erzeugen** ohne Zauberwort (nur Eulenname + QR-Code), für den Fall, dass jemand den Link verloren hat.
- `[ADM-10]` SOLL: **Anzeigename und Notiz** bearbeiten.

### 11.5 Datenbeschaffung

- `[ADM-11]` MUSS: Die Konsole liest `users`, alle `saves` und `events` (gefiltert nach `runId` des jeweiligen Spielers). Statistiken werden im Client aus den Ereignissen berechnet. Erwartete Menge: < 10 Spieler × ca. 40 Ereignisse/Tag × 25 Tage ≈ 10.000 Dokumente, im Spark-Limit.
- `[ADM-12]` MUSS: Echtzeit-Listener nur in `admin.feed` (letzte 100). Alle anderen Ansichten laden beim Öffnen und per Pull-to-Refresh.
- `[ADM-13]` MUSS: Lesbare Sätze und Optionstexte kommen aus dem generierten Entscheidungs-Katalog `choices.generated.json` (Abschnitt 15.1), nicht aus der Datenbank.

## 12. Persönliche Inhalte pro Spieler

Jeder Spieler kann eigene persönliche Momente bekommen: die Freundin andere als die Eltern. Sie werden in der Admin-Konsole gepflegt und liegen in Firestore unter `personal/{uid}`, lesbar nur für diesen Spieler und den Admin. Fehlt ein Feld, verwendet das Spiel einen neutralen Standardtext.

| Feld | Typ | Tag | Verwendung | Standard |
| --- | --- | --- | --- | --- |
| `amortentiaScents` | string\[3\] | 5 | Der Liebestrank riecht nach drei Dingen | „Zimt, frisches Pergament, Kaminfeuer“ |
| `insideJokes` | string\[0–2\] | 7, 17 | Eine Zeile von `ellis` bzw. `quill` | entfällt |
| `patronus` | string | 12 | Patronus-Tier im Sternbild-Dialog | „ein Fuchs“ |
| `favoriteSweet` | string | 17 | Geschenk-Dialog in Hogsmeade | „Schokofrosch“ |
| `mirrorPhoto` | string (PNG als Data-URL, 96 × 72) | 18 | Der Spiegel zeigt, was man sich wünscht | Spielfigur mit `ellis` und `quill` |
| `letter` | string (max. 4.000 Zeichen, Absätze, `*kursiv*`) | 24 | Persönlicher Brief nach dem Abspann | kurzer Weihnachtsgruß vom Admin |
| `letterSignature` | string | 24 | Unterschrift | Anzeigename des Admins |
| `surprise` | string, optional | 24 | Zusatzzeile nach dem Brief (z. B. Hinweis auf ein echtes Geschenk) | entfällt |

- `[PRS-1]` MUSS: Foto-Upload in der Konsole: Bild wählen → im Browser auf 96 × 72 zuschneiden → auf die Spielpalette quantisieren (Floyd-Steinberg) → Vorschau → als PNG-Data-URL speichern (< 30 KB). Kein Cloud Storage `[RB-8]`.
- `[PRS-2]` MUSS: Der Brief wird im Spiel als Pergament dargestellt, Zeile für Zeile eingeblendet, mit ruhiger Musik, und ist danach in der Truhe dauerhaft lesbar.
- `[PRS-3]` MUSS: Persönliche Inhalte werden beim Start eines Tages geladen, an dem sie gebraucht werden. Ink greift über externe Funktionen darauf zu (`personal("patronus")`).
- `[PRS-4]` SOLL: Vorschau-Knopf in der Konsole zeigt die betroffene Szene mit den eingetragenen Werten.

Der Admin befüllt die Felder für die Freundin bis 27.11. (Tag 5 + 7) bzw. 14.12. (Brief).

## 13. Tech-Stack und Architektur

Statische Single-Page-App auf GitHub Pages. Story, Rätsel und Grafiken sind Teil des Builds. Firebase speichert nur Nutzer, Spielstände, Ereignisse und persönliche Inhalte.

### 13.1 Stack

| Bereich | Wahl (MUSS) | Begründung |
| --- | --- | --- |
| Sprache | TypeScript, `strict: true` | Zustandslogik sicher |
| Build | Vite, `base: '/<repo-name>/'` | GitHub Pages |
| UI | React (aktuelle stabile Version) | Menüs, Formulare, Admin-Konsole |
| State | Zustand | kleiner globaler Spielzustand |
| Routing | Hash-basiert, minimal: `#/` (Spiel) und `#/admin/...` | kein 404 auf GitHub Pages |
| Validierung | zod | Rätsel-JSON, Firestore-Dokumente |
| Story | Ink + `inkjs` (Compiler im Build, Runtime im Client) | Verzweigte Dialoge mit Variablen |
| Backend | Firebase JS SDK (modular): Auth + Firestore mit `persistentLocalCache` | Login, Spielstände, Offline |
| Audio | Howler.js | zuverlässig auf iOS |
| QR-Codes | `qrcode` (npm) | Einladungen, Desktop-Hinweis |
| PWA | `vite-plugin-pwa` | Home-Bildschirm, Asset-Cache |
| Tests | Vitest, Playwright (mobile Viewport), Firebase Emulator Suite | Logik, Rules, Smoke-Test |
| CI/CD | GitHub Actions: Lint + Test + Content-Prüfung + Build + Deploy auf Pages | Push auf `main` = live |

**Bewusst nicht:** Phaser oder andere Game-Engines (das Spiel ist Szenen + Dialoge + Rätsel-UI), Server, Cloud Functions, Cloud Storage.

### 13.2 Module

| Modul | Verantwortung |
| --- | --- |
| `ScreenMachine` | Zustände: `boot → login → onboarding → prologue.* → calendar → chapterCard → scene → puzzleIntro → puzzle → solution → scene → dayEnd → calendar`, Overlay `trunk`, Sonderzustände `ending`, `letter`, `credits`, `blocked` (deaktiviert/Querformat) |
| `PixelStage` | 256 × 448-Fläche, Skalierung `[UI-1]`, Safe-Area, Umrechnung von Touch-Koordinaten in logische Pixel |
| `SceneRenderer` | Hintergrund, Sprites (Position, Richtung, Animation), Hotspots, Wetter-Overlay |
| `DialogueRunner` | Führt die Ink-Story des Tages aus, verarbeitet Tags (Abschnitt 15.1), zeigt Text/Wahlen, meldet Entscheidungen an `EventLogger` |
| `PuzzleHost` | Lädt Rätsel, rendert Engine, verwaltet Versuche, Hinweise, Timer, Punkte, Hilfe |
| `CharacterComposer` | Setzt LPC-Ebenen zusammen, Palette-Swap für Hausfarben, liefert Sprite-Sheet, Porträt und Avatar |
| `ContentService` | Lädt Tagesinhalte (Ink-JSON + Rätsel) per dynamischem `import()` aus dem Bundle, ein Chunk pro Tag |
| `SaveService` | Liest/schreibt `saves/{uid}` nach jedem Schritt (debounced 500 ms, sofort bei Entscheidungen) |
| `EventLogger` | Schreibt Ereignisse nach `events` (Abschnitt 14.3), puffert offline |
| `PersonalService` | Lädt `personal/{uid}`, stellt Werte mit Standardwerten bereit |
| `UnlockService` | Serverzeit-Abweichung `[DAY-2]`, verfügbare Tage, Countdown, Debug-Datum für Admin |
| `AuthService` | Login per Eulenname, Sitzung, Rolle, Provisionierung neuer Spieler `[AUTH-5]` |
| `AudioService` | Musik pro Ort, SFX, Freigabe nach erster Berührung |
| `AssetRegistry` | Asset-Manifest, Vorladen pro Tag, Platzhalter `[GFX-6]` |
| `admin/*` | Admin-Konsole, eigener lazy Chunk |

### 13.3 Ink und Spielzustand

- `[ARC-1]` MUSS: Jeder Tag ist eine eigene Ink-Datei, die `globals.ink` einbindet. Build-Schritt kompiliert jede Datei zu JSON (`src/content/generated/day07.json`).
- `[ARC-2]` MUSS: Vor dem Start schreibt der `DialogueRunner` alle gespeicherten Variablen in die Ink-Story, nach jedem Schritt liest er sie zurück in `saves/{uid}.vars`. Der Ink-Zwischenstand (`story.state.toJson()`) wird bei jedem Speichern mitgespeichert, damit abgebrochene Tage exakt fortgesetzt werden.
- `[ARC-3]` MUSS: `# puzzle: <id>` pausiert die Story, startet das Rätsel und setzt danach `last_puzzle_first_try`, bevor die Story fortgesetzt wird.
- `[ARC-4]` MUSS: Externe Ink-Funktionen: `personal(key)`, `house_name()`, `pronoun_form(f, m, n)`, `has_clue(id)`.

## 14. Firebase: Datenmodell, Ereignisse, Security Rules

### 14.1 Collections

| Pfad | Inhalt | Schreibt | Liest |
| --- | --- | --- | --- |
| `users/{uid}` | `UserDoc` (Abschnitt 3.3) | Admin; Spieler nur `lastSeenAt` | Admin, Spieler selbst |
| `usernames/{username}` | `{ uid }` | Admin | Admin |
| `saves/{uid}` | `SaveDoc` (14.2) | Spieler selbst, Admin | Spieler selbst, Admin |
| `personal/{uid}` | Persönliche Inhalte (Abschnitt 12) | Admin | Spieler selbst, Admin |
| `events/{autoId}` | `EventDoc` (14.3) | Spieler selbst (nur anlegen) | Admin |

### 14.2 Spielstand `saves/{uid}`

```ts
interface SaveDoc {
  uid: string;
  runId: number;                       // muss users/{uid}.runId entsprechen
  schemaVersion: 1;
  profile: {
    name: string; pronoun: 'f' | 'm' | 'n';
    look: { skin: string; hair: string; hairColor: string; eyes: string;
            glasses: string; accessory: string; sweater: string };
    wand: 'phoenix' | 'dragon' | 'unicorn';
    pet: 'owl' | 'cat' | 'toad';
    hatSuggestion: HouseId; house: HouseId; hatOverruled: boolean;
    sortingAnswers: HouseId[];         // 5 Einträge
  } | null;                            // null bis Prolog fertig
  vars: Record<string, string | number | boolean | string[]>; // alle Ink-Variablen
  progress: {
    completedDays: number[];           // 0 = Prolog
    current: null | { day: number; screen: string; inkState: string; puzzleId?: string };
    dayStartedAt: Record<string, Timestamp>;
    dayCompletedAt: Record<string, Timestamp>;
  };
  puzzles: Record<string, {
    solved: boolean; solvedBy?: 'self' | 'help';
    attempts: number; hintsBought: number[]; points: number; durationSec?: number;
  }>;
  housePoints: number;
  sparks: number;
  foundSparks: string[];               // "d07.s1"
  diary: Array<{ day: number; speaker: string; text: string }>; // für das Tagebuch
  ending: null | 'A' | 'B' | 'C_A' | 'C_B';
  settings: { textSpeed: 'slow' | 'normal' | 'instant'; music: boolean; sfx: boolean };
  updatedAt: Timestamp;
}
```

### 14.3 Ereignisse `events/{autoId}`

Ereignisse sind das Protokoll für die Admin-Konsole. Sie werden nur angelegt, nie geändert.

```ts
interface EventDoc {
  uid: string;
  runId: number;
  type: EventType;
  day: number | null;          // 0 = Prolog, null = außerhalb eines Tages
  data: Record<string, unknown>;
  at: Timestamp;               // serverTimestamp()
  clientAt: number;            // Date.now() des Geräts
  appVersion: string;
}
```

| `type` | `data` |
| --- | --- |
| `session_start` | `{ platform: 'ios' \| 'android' \| 'other', standalone: boolean }` |
| `prologue_value` | `{ field: 'name' \| 'pronoun' \| 'look' \| 'wand' \| 'pet', value }` |
| `sorting_answer` | `{ question: 1–5, house }` |
| `sorting_result` | `{ suggestion, chosen, overruled }` |
| `day_start` | `{ }` |
| `choice` | `{ cid: 'd07.letter', option: 'keep', label: 'Den Brief einstecken' }` |
| `clue_found` / `item_found` | `{ id }` |
| `spark_found` | `{ id }` |
| `puzzle_start` | `{ puzzleId }` |
| `puzzle_attempt` | `{ puzzleId, attempt, input, correct }` |
| `puzzle_hint` | `{ puzzleId, level: 1 \| 2 \| 3 \| 'super', free: boolean }` |
| `puzzle_solved` | `{ puzzleId, attempts, durationSec, points, solvedBy }` |
| `day_complete` | `{ durationSec }` |
| `ending` | `{ ending, essentialClues, accused }` |
| `letter_opened` | `{ }` |

- `[EVT-1]` MUSS: Jede Entscheidung, jedes Prolog-Ergebnis und jeder Rätselversuch erzeugt ein Ereignis.
- `[EVT-2]` MUSS: Offline werden Ereignisse durch den Firestore-Offline-Cache automatisch nachgereicht. Keine eigene Warteschlange.
- `[EVT-3]` MUSS: Composite-Index `events (uid ASC, runId ASC, at DESC)` in `firestore.indexes.json`.

### 14.4 Security Rules (`firestore.rules`)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null; }
    function isAdmin()  { return signedIn() && request.auth.uid == 'ADMIN_UID'; }
    function isSelf(uid) { return signedIn() && request.auth.uid == uid; }
    function isActiveMember() {
      return signedIn()
        && exists(/databases/$(database)/documents/users/$(request.auth.uid))
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.active == true;
    }

    match /users/{uid} {
      allow read: if isAdmin() || isSelf(uid);
      allow create, delete: if isAdmin();
      allow update: if isAdmin()
        || (isSelf(uid)
            && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['lastSeenAt'])
            && request.resource.data.lastSeenAt == request.time);
    }
    match /usernames/{username} {
      allow read, write: if isAdmin();
    }
    match /saves/{uid} {
      allow read, write: if isAdmin() || (isSelf(uid) && isActiveMember());
    }
    match /personal/{uid} {
      allow read: if isAdmin() || (isSelf(uid) && isActiveMember());
      allow write: if isAdmin();
    }
    match /events/{eventId} {
      allow create: if isActiveMember()
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.at == request.time;
      allow read: if isAdmin();
      allow update, delete: if false;
    }
  }
}
```

- `[SEC-1]` MUSS: Rules-Tests mit dem Emulator: fremder Spielstand = verweigert; deaktivierter Spieler = verweigert; Konto ohne `users`-Dokument = verweigert; Spieler liest Ereignisse = verweigert; Admin liest alles = erlaubt; Spieler ändert eigene Rolle = verweigert.
- `[SEC-2]` MUSS: Die Firebase-Web-Konfiguration steht öffentlich im Code (`src/config.ts`). Das ist bei Firebase vorgesehen; die Sicherheit kommt aus den Rules.

### 14.5 Einrichtung (durch den Auftraggeber, Agent liefert Anleitung im README)

1. Firebase-Projekt anlegen (Spark), Firestore im Produktionsmodus, Region `europe-west3`.
2. Authentication → E-Mail/Passwort aktivieren. Admin-Konto `<eulenname>@hogwarts.example.com` von Hand anlegen, UID in `src/config.ts` und `firestore.rules` eintragen.
3. Authentication → Einstellungen → Autorisierte Domains: `<github-user>.github.io` hinzufügen.
4. Google Cloud Console: Web-API-Schlüssel auf HTTP-Referrer `https://<github-user>.github.io/*` und `http://localhost:*` beschränken.
5. Service-Account-Schlüssel für `[AUTH-11]` lokal ablegen (`.secrets/service-account.json`, in `.gitignore`).
6. `firebase deploy --only firestore:rules,firestore:indexes`.

## 15. Content-Formate

### 15.1 Ink-Konventionen

```ink
INCLUDE globals.ink

=== day07 ===
# bg: owlery
# music: castle
# show: ellis left
# show: quill right
# spark: d07.s1 212 40
ellis: Hier oben riecht es nach Eule. Und nach … noch mehr Eule.
{ bond_ellis >= 2: ellis: Gut, dass du mitgekommen bist, {name}. }
# emote: quill !
quill: Seht mal. Ein Brief ohne Absender.
# choice_point: d07.letter | Was tun mit dem anonymen Brief?
* [Den Brief Quill geben] # cid: d07.letter.give
    # toast: Quill wird sich das merken.
    quill: Kluge Entscheidung, {pronoun_form("meine Liebe", "mein Lieber", "mein Gutes")}.
* [Den Brief einstecken] # cid: d07.letter.keep
    ~ items += anonymous_letter
    # toast: Neuer Gegenstand: Anonymer Brief
- quill: Das erinnert mich an ein Rätsel …
# puzzle: p07
{ last_puzzle_first_try: ellis: Beim ersten Versuch! Unglaublich. }
quill: Ausgezeichnet. Morgen sehen wir weiter.
-> END
```

| Element | Format | Bedeutung |
| --- | --- | --- |
| Sprecherzeile | `<figur-id>: Text` | Dialogzeile mit Porträt der Figur. Ohne Präfix = Erzähltext |
| `# bg: <ort-id>` | Tag | Hintergrund wechseln (mit Blende) |
| `# music: <id>` / `# sfx: <id>` | Tag | Musik / Geräusch |
| `# show: <figur> <left\|center\|right>` / `# hide: <figur>` | Tag | Sprite ein-/ausblenden |
| `# emote: <figur> <! \| ? \| heart \| sweat \| note \| dots>` | Tag | Emote-Blase über Figur/Porträt |
| `# toast: <text>` | Tag | Konsequenz-Hinweis oben |
| `# spark: <id> <x> <y>` | Tag | Funken-Hotspot in der aktuellen Szene (logische Pixel im `topScreen`) |
| `# clue: <k-id>` | Tag | Hinweis überreichen (Animation + `clues += ...` + Ereignis) |
| `# item: <id>` | Tag | Gegenstand überreichen (Animation + Ereignis) |
| `# puzzle: <p-id>` | Tag | Story pausieren, Rätsel starten |
| `# choice_point: <d-id> \| <Frage für Admin>` | Tag vor den Wahlen | Entscheidungspunkt mit lesbarer Frage |
| `# cid: <d-id>.<option>` | Choice-Tag | Stabile Options-ID |
| `# ending` | Tag (nur Tag 24) | App wertet `[END-1]` aus und setzt `ending` |

- `[INK-1]` MUSS: Der Build erzeugt `src/content/generated/choices.generated.json`: Liste aller Entscheidungspunkte mit Tag, Frage und Optionen (ID + Text). Grundlage für `[ADM-13]`.

### 15.2 Asset-Manifest

```ts
// src/assets/manifest.ts
export const assets = {
  'bg.great_hall':   { file: 'bg/great_hall.png', w: 256, h: 192, license: 'CC-BY-SA-3.0', credit: 'LPC tiles, ...' },
  'npc.quill':       { file: 'sprites/quill.png', frameW: 64, frameH: 64, anims: { idle: [0], walk: [1,2,3,4] } },
  'portrait.quill':  { from: 'npc.quill', crop: [16, 8, 32, 32], scale: 2 },  // Phase 1: Kopfausschnitt
  'ui.frame.parchment': { file: 'ui/parchment.png', nineSlice: [8, 8, 8, 8] },
  'sfx.correct':     { file: 'audio/sfx/correct.ogg' },
} satisfies Record<string, AssetDef>;
```

- `[AST-1]` MUSS: Phase 2 (eigene Grafiken) ändert nur Manifest-Einträge, z. B. `'portrait.quill': { file: 'portraits/quill.png', moods: {...} }`. Der Code unterstützt beide Varianten (`from`+`crop` und `file`) von Anfang an.

### 15.3 Skripte (`package.json`)

| Skript | Zweck |
| --- | --- |
| `content:compile` | Ink → JSON, Entscheidungs-Katalog erzeugen. Läuft vor `build` und im Dev-Server (Watch) |
| `content:lint` | Alle Variablen deklariert; jede Wahl hat `cid`; jeder `cid` hat einen `choice_point`; alle Orts-, Figuren-, Rätsel-, Hinweis-, Gegenstands-IDs existieren; ≤ 250 Wörter Dialog auf jedem Pfad; Rätsel-JSON valide |
| `content:simulate` | Pro Tag 500 zufällige Durchläufe mit zufälligem Startzustand: kein Pfad ohne `END`, Wortzahl und Lesezeit (200 Wörter/min) pro Pfad. Dazu 2.000 Komplettdurchläufe Tag 1–24: alle vier `ending`-Werte erreichbar, Verteilung ausgeben |
| `puzzles:verify` | Löst jedes Rätsel automatisch bzw. prüft die hinterlegte Lösung gegen die Engine-Regeln `[PLAN-3]` |
| `assets:check` | Fehlende und unbenutzte Assets, fehlende Lizenzangaben |
| `maps:render` | Tiled-Karten (`.tmj`) zu Hintergrund-PNGs rendern `[GFX-2]` |
| `admin:set-password` | Zauberwort zurücksetzen `[AUTH-11]` |
| `test`, `test:rules`, `test:e2e` | Vitest, Rules-Tests im Emulator, Playwright |

## 16. Projektstruktur

Ein einziges öffentliches Repository `hogwarts-advent`.

```
hogwarts-advent/
├─ .github/workflows/deploy.yml      Lint, Tests, content:lint, Build, Deploy auf Pages
├─ .secrets/                          (gitignored) service-account.json
├─ CONCEPT.md                         dieses Dokument
├─ DECISIONS.md                       Entscheidungen des Agenten bei Unklarheiten
├─ CREDITS.md                         Herkunft und Lizenz aller Assets
├─ README.md                          Setup, Firebase-Einrichtung, Skripte
├─ firebase.json, firestore.rules, firestore.indexes.json
├─ maps/                              Tiled-Karten (.tmj) + Tilesets
├─ public/
│  ├─ assets/{bg,sprites,lpc,ui,puzzles,emotes}/
│  ├─ audio/{music,sfx}/
│  └─ fonts/
├─ scripts/                           compile-ink.ts, lint-content.ts, simulate.ts,
│                                     verify-puzzles.ts, check-assets.ts, render-maps.ts,
│                                     set-password.ts
├─ src/
│  ├─ main.tsx, App.tsx, config.ts
│  ├─ core/            ScreenMachine, PixelStage, store.ts, time.ts
│  ├─ services/        firebase.ts, AuthService, SaveService, EventLogger,
│  │                   PersonalService, UnlockService, ContentService, AudioService
│  ├─ assets/          manifest.ts, AssetRegistry.ts, palette.ts
│  ├─ character/       CharacterComposer.ts, layers.ts, recolor.ts
│  ├─ dialogue/        DialogueRunner.ts, tags.ts, DialogueBox.tsx, ChoiceList.tsx, Toast.tsx
│  ├─ scene/           SceneRenderer.tsx, Hotspot.tsx, Weather.tsx
│  ├─ puzzles/         PuzzleHost.tsx, schema.ts, scoring.ts,
│  │                   engines/{Choice,Input,Tap,Arrange,Slide,Toggle,Path}.tsx,
│  │                   custom/{Pour,Cross,Nim,Accuse,Finale}.tsx, NotesOverlay.tsx
│  ├─ screens/         Login, Onboarding, prologue/*, Calendar, ChapterCard, Scene,
│  │                   PuzzleIntro, Puzzle, Solution, DayEnd, trunk/*, Ending,
│  │                   Letter, Credits, Blocked
│  ├─ admin/           AdminApp.tsx, views/{Overview,Feed,Decisions,Player,Puzzles,
│  │                   Users,Personal,Tools}.tsx, invite/InviteCard.ts, stats.ts
│  ├─ ui/              PixelButton, Frame9, PixelText, PixelKeyboard, ProgressBar
│  ├─ content/
│  │  ├─ ink/         globals.ink, prologue.ink, day01.ink … day24.ink (13w/13a usw. als Knoten in day13.ink)
│  │  ├─ puzzles/     p01.json … p24.json, p13w.json, p13a.json …
│  │  ├─ sortingQuiz.ts, schedule.ts, wordlist.ts
│  │  └─ generated/   (gitignored) kompilierte Ink-JSONs, choices.generated.json
│  └─ types/           gemeinsame Typen (UserDoc, SaveDoc, EventDoc, Puzzle, HouseId …)
└─ tests/             unit/, rules/, e2e/
```

- `[STR-1]` MUSS: Routen-Varianten (13w/13a, 14w/14a, 15w/15a) liegen jeweils in einer Ink-Datei pro Tag als zwei Knoten (`day13_forest`, `day13_archive`); der Einstiegsknoten `day13` verzweigt nach `route`.
- `[STR-2]` MUSS: `src/content/schedule.ts` enthält pro Tag: `day`, `unlockAt` (ISO, UTC), Titel, Ort-ID, Rätsel-ID(s). Einzige Quelle für Freischaltzeiten.

## 17. Meilensteine und Abnahmekriterien

Bis zum 30.11., 18:00 Uhr müssen M0–M5 fertig sein. Danach folgen Admin-Auswertung und Akt II/III mit mindestens 3 Tagen Puffer vor der jeweiligen Freischaltung.

| ID | Meilenstein | Fertig bis | Umfang | Abnahmekriterien |
| --- | --- | --- | --- | --- |
| M0 | Fundament | 19.11. | Repo, Vite + TS + React, Firebase-Anbindung, Rules + Indexes, CI-Deploy, Login per Eulenname, Admin-Bootstrap | Login auf iPhone und Android über die github.io-URL; alle `[SEC-1]`-Tests grün |
| M1 | Engine | 22.11. | PixelStage, ScreenMachine, SceneRenderer, Ink-Pipeline + DialogueRunner, SaveService, EventLogger, UnlockService, Asset-Manifest + Platzhalter, Debug-Datum | Ein Test-Tag mit Szene, Wahl, Dummy-Rätsel läuft; Neuladen setzt exakt fort; Ereignisse erscheinen in Firestore |
| M2 | Prolog | 24.11. | Brief, Spiegel (LPC-Compositing), Stab, Haustier, Zug, Hut, Enthüllung | Prolog ≤ 4 min; alle Optionen sichtbar; `[HAT-1]`-Tests grün; Prolog-Ereignisse vollständig |
| M3 | Admin-Basis | 25.11. | `admin.users` mit Einladung, `admin.overview`, `admin.feed` | Neuer Spieler kann mit Einladungsbild auf fremdem Handy einloggen; Feed zeigt seine Ereignisse live |
| M4 | Rätsel | 27.11. | 8 Engines, Hinweise, Funken, Punkte, Quill-Hilfe, Truhe (Tagebuch, Sammlung, Inventar, Hinweise, Steckbrief, Einstellungen) | Je ein Beispielrätsel pro Engine auf dem Handy bedienbar; `[PZL-2]`-Tests grün |
| M5 | Akt I + Go-live | 29.11. | Tag 1–8 (Ink, Rätsel, Hintergründe, NPCs), Musik/SFX, PWA, Onboarding, `personal`-Felder für Tag 5 + 7 | `content:lint`, `content:simulate`, `puzzles:verify` grün; Tag 1–8 per Debug-Datum auf dem Handy durchgespielt |
| – | **Go-live** | **30.11., 18:00** | Einladungen verschicken | – |
| M6 | Admin-Auswertung | 3.12. | `admin.decisions`, `admin.player`, `admin.puzzles`, `admin.personal` inkl. Foto, `admin.tools` inkl. Export | Alle Entscheidungen und Rätseldaten eines Testspielers vollständig und korrekt sichtbar |
| M7 | Akt II | 6.12. | Tag 9–16 inkl. beider Routen und 4 Hausvarianten (Tag 9) | wie M5 |
| M8 | Akt III | 14.12. | Tag 17–24, Endauswertung, 4 Endvarianten, Epilog, Hauspokal, Brief, Credits | Alle `ending`-Werte per Simulation erreicht und je einmal manuell gespielt |
| M9 | Politur | 18.12. | Bugfixes, Lesezeit-Balancing, Komplettdurchlauf 1–24 | Kein Tag über 5 min (gemessen mit `day_complete.durationSec` eines Testdurchlaufs) |

### 17.1 Definition of Done pro Tag

- [ ] Ink kompiliert; `content:lint`, `content:simulate`, `puzzles:verify` grün
- [ ] Längster Pfad ≤ 250 Wörter, Rätsel von einer unbeteiligten Person in ≤ 3 min lösbar
- [ ] Mindestens eine Entscheidung mit Zustandswirkung, mindestens ein Rückbezug
- [ ] Alle Entscheidungen erscheinen lesbar in `admin.decisions`
- [ ] Alle Assets vorhanden oder bewusst als Platzhalter markiert, Lizenzen in `CREDITS.md`
- [ ] Per Debug-Datum auf iOS Safari und Android Chrome durchgespielt
- [ ] Eintrag in `schedule.ts` mit korrektem `unlockAt`

### 17.2 Pflicht-Tests

- Vitest: Hut-Auswertung inkl. Gleichstand; Punkteberechnung; `input`-Normalisierung; Endauswertung `[END-1]` (alle Zweige); jede Rätsel-Engine; `UnlockService` an Zeitgrenzen (22:59:59 / 23:00:00 UTC, Prolog 16:59:59 / 17:00:00 UTC); Username → E-Mail-Abbildung; Ereignis-Texte für den Feed.
- Rules-Tests (Emulator): `[SEC-1]`.
- Playwright (Viewport iPhone 13, Firebase-Emulator): Login → Prolog → Tag 1 komplett → Neuladen → Fortsetzen; Admin lädt ein → neuer Spieler loggt ein.

### 17.3 Startauftrag für den Agenten (Vorschlag)

> Lies `CONCEPT.md` vollständig. Setze M0 und M1 um. Halte dich an alle MUSS-Anforderungen und die kanonischen Bezeichner. Notiere Abweichungen von SOLL-Anforderungen in `DECISIONS.md`. Schreibe die Pflicht-Tests der betroffenen Bereiche. Berichte am Ende: erfüllte Abnahmekriterien, offene Punkte, was ich manuell testen soll und welche Firebase-Schritte ich selbst erledigen muss.

## 18. Annahmen und offene Punkte

### 18.1 Getroffene Annahmen

| Annahme | Folge, falls falsch |
| --- | --- |
| Alle Spieler spielen dieselbe Geschichte, nur persönliche Inhalte unterscheiden sich | Eigene Story-Varianten pro Person wären ein eigener Meilenstein |
| Spieler sehen einander nicht (keine Bestenliste) | KANN später als „Hauspokal aller Spieler“ ergänzt werden |
| Inhalte im öffentlichen Bundle sind kein Problem, weil die Zielgruppe nicht auf GitHub stöbert | Sonst Inhalte wieder nach Firestore mit zeitgesteuerten Rules verlagern |
| Persönliche Inhalte (Brief, Foto) liegen nicht im Bundle, sondern geschützt in `personal/{uid}` | – |
| Das Admin-Konto spielt mit eigenem Test-Spielstand | – |
| LPC-Lizenz (CC-BY-SA/GPL) ist für ein privates Projekt mit Namensnennung in Ordnung | – |

### 18.2 Vom Auftraggeber zu liefern

- [ ] GitHub-Nutzername und Repository-Name
- [ ] Firebase-Projekt mit Web-Config, Admin-UID, Service-Account-Schlüssel (Abschnitt 14.5)
- [ ] Liste der Spieler (Anzeigename, gewünschter Eulenname) bis 28.11.
- [ ] Persönliche Inhalte der Hauptspielerin für Tag 5, 7, 12, 17, 18 bis 27.11., Brief bis 14.12.
- [ ] Optional: persönliche Inhalte und Briefe für weitere Spieler

### 18.3 Offene Fragen

- Sollen die Eltern einen eigenen, kleinen Brief am 24. bekommen? (Standard: kurzer Weihnachtsgruß vom Admin, sonst in `admin.personal` pflegen.)
- Sollen Spieler eine Benachrichtigung bekommen, wenn ein neues Kapitel offen ist? Web-Push auf iOS geht nur für installierte PWAs und braucht einen Server; nicht im Umfang. Alternative: der Admin schickt selbst eine Nachricht.
