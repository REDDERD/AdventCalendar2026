# Storyboard: Hogwarts und die Adventsuhr

Skripte für die 24 Kapitel. **Stand: Tag 1–8 (Akt I) fertig**, Tag 9–24 folgen (Fahrplan in der Bibel). Der Prolog entsteht separat.

| Datei | Inhalt |
| --- | --- |
| [00-story-bibel.md](00-story-bibel.md) | Wahrheit, Zeitfransen-Regel für Cameos, Cameo-Katalog, Stimmen, Ellis' sieben Theorien, Türchen-Zauber, Fahrplan Tag 9–24. **Enthält Spoiler** |
| [uebersicht.md](uebersicht.md) | Tabelle Tag 1–8 mit Entscheidungen, Hinweisen, Wortzahlen |
| [tag-01.md](tag-01.md) | Referenz zum bestehenden Tag 1 inkl. optionalem Patch |
| [tag-02.md](tag-02.md) … [tag-08.md](tag-08.md) | Je Tag: Kopftabelle, Beats, **Ink-Skript**, Rätsel-Skizze, Setups und Payoffs |
| [tag-11.md](tag-11.md) | **Einzeln vorgezogen:** Tag 11 „Das Boot“ mit dem Rätsel „Wolves and Chicks“ (Hippogreife und Frettchen), Ink-Skript, Rätsel-Entwurf und Spezifikation der Engine `custom:cross` |
| [globals-zusatz.ink](globals-zusatz.ink) | Vier neue Ton-Variablen zum Anhängen an `globals.ink` |

## So sind die Skripte gebaut

- Jeder `ink`-Block ist **1:1 nach `src/content/ink/dayNN.ink`** kopierbar und folgt den Konventionen aus CONCEPT 15.1 (Tags, `# cid`, `# choice_point: id Frage`).
- Regeln aus DECISIONS.md #16 sind eingehalten: **höchstens 500 Wörter** auf dem längsten Pfad, **mindestens 2 Entscheidungen** pro Tag, Rätsel 1–3 Minuten, mindestens ein Rückbezug auf eine frühere Entscheidung.
- Ton und Humor von Tag 1 sind Maßstab. Zeilen ≤ 90 Zeichen, Entscheidungstexte ≤ 40 Zeichen.

## Wie geprüft wurde

Ich habe die Skripte in eine **Kopie** des Repos (außerhalb des Projekts) kopiert und dort die echten Skripte laufen lassen: `content:compile`, `content:lint` und `content:simulate` (mit zusätzlich randomisierten Flags). Ergebnis für Tag 1–8: kompiliert, 0 Fehler, 0 Warnungen, 310–474 Wörter pro Pfad. Rätsel mit konkreten Zahlen sind per Brute-Force oder BFS nachgerechnet (Details je Tag). Im Repo selbst wurde nichts außerhalb von `storyboard/` angefasst.

## Offene Punkte (brauchen deine Entscheidung)

1. **Cameos widersprechen `[RB-12]`** („keine bekannten Figuren aus Büchern/Filmen“). Du hast sie ausdrücklich gewünscht, deshalb sind sie drin. Wenn du sie übernimmst, gehört ein Eintrag in `DECISIONS.md` und eine Anpassung von `[RB-12]` dazu. Jeder Cameo ist streichbar (Bibel, Abschnitt 3).
2. ~~Neue Sprecher-IDs~~ **Erledigt** für Tag 1–8: `peeves`, `pince`, `hermione`, `slughorn`, `neville` mit eigenen Figuren. Geister sind durchscheinend und bläulich (DECISIONS.md #47).
3. **Zusatz-Variablen:** `f_d01_watch`, `peeves_friend` und `wrote_home` sind in `globals.ink` und werden in `content:simulate` mitgewürfelt. `ate_rockcake` kommt mit Tag 11.
4. ~~Einzeiler in `day01.ink`~~ **Erledigt:** `d01.secret.watch` setzt `f_d01_watch`.
5. ~~Türchen-Zählung~~ **Entschieden:** Tag 1 = erstes Türchen, der Prolog ist kein Tag (DECISIONS.md #42). Tag 1 und 2 sind entsprechend angepasst.
6. ~~`personal("insideJokes")`~~ **Geprüft:** `PersonalService` liefert `""`, wenn nichts gepflegt ist; die Zeile entfällt dann.
8. **Tag 11 ersetzt den Entwurf `p11`** („Spuren im Schnee“, DECISIONS #40) durch „Das Boot“ (Wolves and Chicks). Die Engine `custom:cross` fehlt noch in `src/`; Spezifikation und `p11.json`-Entwurf stehen in tag-11.md. CONCEPT (Abschnitt 9/10) und DECISIONS (#50) sind angepasst. Mit umzuziehen: `schedule.ts` (Titel), Sprecher `hagrid`, Pixel-Assets, `puzzle.p11.snow` entfällt. Geprüft: 11 Überfahrten minimal, 4 kürzeste Lösungen; das Skript kompiliert, Lint 0/0, 330–339 Wörter. Das Rätsel ist mit nur 16 sicheren Zuständen eher leichter als `p05`; die knackigere Variante 5 + 5 mit Boot für 3 steht in tag-11.md.
9. **Rätselplan geändert** (DECISIONS #51, Bibel Abschnitt 8): `p17` Wechselgeld wird **Nim** gegen Fred und George (`custom:nim`, Haufen 3/4/5, genau ein Gewinnzug), `p13a` Katalogcode wird der **Stammbaum** (`arrange` Reihe, 7 Karten, genau eine Reihenfolge, beides per Skript geprüft). Das Zauberduell von Tag 20 bleibt. `input` nutzen nur noch Tag 1, 7, 9, 13w, 14a. Neue Sprecher `fred`, `george`. Noch nicht in `src/`: Engines `cross` und `nim`, Rätsel-JSON von `p11`, `p13a`, `p17`.
7. **Rätsel schwerer gemacht** (DECISIONS.md #44): Die Rätsel-Abschnitte von Tag 2, 3, 4, 5 und 8 beschreiben jetzt die schwereren Fassungen aus `src/content/puzzles/`; in Tag 5 sind die Mengen im Dialog angepasst (14/9/5, zweimal sieben Maß). Tag 1–8 sind umgesetzt; die Skripte hier entsprechen `src/content/ink/`. Auch `p06` (Logikraster mit Karte) und `p07` (Summe der drei davor) sind jetzt schwerer.

## Fragen an dich (gesammelt beim Schreiben ab Tag 9)

Ich habe überall eine sinnvolle Annahme getroffen und weitergemacht. Bitte kurz bestätigen oder korrigieren.

1. **Tag 9, Hausgegenstände:** Gryffindor eine Löwenfeder, Hufflepuff ein Honigtöpfchen, Ravenclaw eine Adlerbrosche, Slytherin ein grüner Glücksstein. Passen die? (Tag 18 baut darauf eine Bonus-Szene.)
2. **Tag 9, Hausgeister:** Jeder Spieler sieht nur den Geist seines Hauses (Nick, Mönch, Graue Dame, Baron). Ellis ist nur am Anfang dabei. In Ordnung?
