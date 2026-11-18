# Entscheidungen bei Unklarheiten

Abweichungen von SOLL-Anforderungen und Auslegungen offener Punkte (Abschnitt 0).

| # | Datum | Thema | Entscheidung | Grund |
| --- | --- | --- | --- | --- |
| 1 | 18.11.2026 | Repository-Name | `REDDERD/AdventCalendar2026` statt `hogwarts-advent`; Vite-`base` ist `/AdventCalendar2026/` | Bestehendes Repo des Auftraggebers |
| 2 | 18.11.2026 | `# choice_point`-Format | `# choice_point: d07.letter Frage …` (erstes Wort = ID, Rest = Frage) statt `… \| Frage` | `\|` ist in Ink-Tags ein Sonderzeichen und lässt sich nicht escapen; der Compiler bricht ab |
| 3 | 18.11.2026 | Choice-Tags | Autoren schreiben `* [Text] # cid: …` wie spezifiziert; `content:compile` verschiebt den Tag automatisch in die Klammer | inkjs liefert nur Tags *innerhalb* der Klammer als Choice-Tags |
| 4 | 18.11.2026 | `# puzzle` / `# ending` | Der Runner macht vor jedem `Continue()` einen Snapshot. Trägt eine Zeile `# puzzle` oder `# ending`, wird der Snapshot zurückgeladen, die App handelt, dann wird die Zeile neu ausgewertet | Ink wertet die Zeile nach dem Tag im selben Schritt aus; `last_puzzle_first_try` wäre sonst vor dem Rätsel gelesen worden |
| 5 | 18.11.2026 | Zeitstempel im Speicher | `SaveDoc`/`UserDoc`/`EventDoc` halten im Client Millisekunden; in Firestore stehen `Timestamp`s (Umwandlung in `SaveService`/`AuthService`) | Einfacher zu rechnen und zu serialisieren |
| 6 | 18.11.2026 | Zusatzfelder im Spielstand | `progress.current.stage` (Hintergrund, Figuren, Funken) und `puzzles[id].startedAt` | Exakte Fortsetzung inkl. Bild `[DAY-4]`; Rätseldauer über Neuladen hinweg `[PZL-8]` |
| 7 | 18.11.2026 | Skalierung `[UI-1]` | Zusätzlich auf die verfügbare Höhe begrenzt | Kleine Handys (z. B. iPhone SE) würden sonst unten abschneiden |
| 8 | 18.11.2026 | Login-Fehlermeldungen `[AUTH-8]` | Bei aktivem E-Mail-Enumeration-Schutz meldet Firebase nur `invalid-credential`; dann erscheint „Eulenname oder Zauberwort stimmen nicht.“ Für getrennte Meldungen den Schutz in der Firebase-Konsole abschalten (README, Schritt 2) | Firebase-Verhalten, im Client nicht anders lösbar ohne `usernames` öffentlich lesbar zu machen |
| 9 | 18.11.2026 | Lint | `npm run lint` = TypeScript-Typprüfung + `content:lint`, kein ESLint | Einfachste Lösung; strikte Typen decken das Wesentliche ab |
| 10 | 18.11.2026 | Firebase-Version | `firebase@12` statt 13 und `overrides` auf eine einzige `@firebase/app` | `@firebase/rules-unit-testing` verlangt 12; `firebase-admin` zog eine zweite `@firebase/app` herein, die Firestore zur Laufzeit bricht (Test wacht darüber) |
| 11 | 18.11.2026 | Rules-Tests | Modulares SDK mit Emulator-Mock-Tokens statt `RulesTestEnvironment.firestore()` | Dessen Compat-Schicht lässt sich mit Vitest/ESM nicht zuverlässig laden |
| 12 | 18.11.2026 | Admin-Spielstand zurücksetzen | Zusätzlich zum späteren `admin.users` gibt es in Truhe → Optionen (nur Admin) „Eigener Spielstand zurücksetzen“ (`runId + 1`, `saves` löschen) | Zum Testen von M1 nötig, bevor die Konsole existiert |
| 13 | 18.11.2026 | Desktop-Sperre im Dev-Modus | `?desktop` hebt `[UI-3]` nur in Dev-Builds auf | Entwicklung am Rechner |
| 14 | 18.11.2026 | Emulator-Projekt | Im Emulator-Modus nutzt die App die Projekt-ID `demo-hogwarts` | Lokale Daten können so nie das echte Projekt berühren |
| 15 | 18.11.2026 | Prolog in M1 | Platzhalter-Bildschirm: Name + Hauswahl, Standardfigur | Echter Prolog ist M2; Tag 1 braucht ein Profil |
