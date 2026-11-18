# Storyboard: Hogwarts und die Adventsuhr

Skripte für die 24 Kapitel. **Stand: Tag 1–8 (Akt I) fertig**, Tag 9–24 folgen (Fahrplan in der Bibel). Der Prolog entsteht separat.

| Datei | Inhalt |
| --- | --- |
| [00-story-bibel.md](00-story-bibel.md) | Wahrheit, Zeitfransen-Regel für Cameos, Cameo-Katalog, Stimmen, Ellis' sieben Theorien, Türchen-Zauber, Fahrplan Tag 9–24. **Enthält Spoiler** |
| [uebersicht.md](uebersicht.md) | Tabelle Tag 1–8 mit Entscheidungen, Hinweisen, Wortzahlen |
| [tag-01.md](tag-01.md) | Referenz zum bestehenden Tag 1 inkl. optionalem Patch |
| [tag-02.md](tag-02.md) … [tag-08.md](tag-08.md) | Je Tag: Kopftabelle, Beats, **Ink-Skript**, Rätsel-Skizze, Setups und Payoffs |
| [globals-zusatz.ink](globals-zusatz.ink) | Vier neue Ton-Variablen zum Anhängen an `globals.ink` |

## So sind die Skripte gebaut

- Jeder `ink`-Block ist **1:1 nach `src/content/ink/dayNN.ink`** kopierbar und folgt den Konventionen aus CONCEPT 15.1 (Tags, `# cid`, `# choice_point: id Frage`).
- Regeln aus DECISIONS.md #16 sind eingehalten: **höchstens 500 Wörter** auf dem längsten Pfad, **mindestens 2 Entscheidungen** pro Tag, Rätsel 1–3 Minuten, mindestens ein Rückbezug auf eine frühere Entscheidung.
- Ton und Humor von Tag 1 sind Maßstab. Zeilen ≤ 90 Zeichen, Entscheidungstexte ≤ 40 Zeichen.

## Wie geprüft wurde

Ich habe die Skripte in eine **Kopie** des Repos (außerhalb des Projekts) kopiert und dort die echten Skripte laufen lassen: `content:compile`, `content:lint` und `content:simulate` (mit zusätzlich randomisierten Flags). Ergebnis für Tag 1–8: kompiliert, 0 Fehler, 0 Warnungen, 310–474 Wörter pro Pfad. Rätsel mit konkreten Zahlen sind per Brute-Force oder BFS nachgerechnet (Details je Tag). Im Repo selbst wurde nichts außerhalb von `storyboard/` angefasst.

## Offene Punkte (brauchen deine Entscheidung)

1. **Cameos widersprechen `[RB-12]`** („keine bekannten Figuren aus Büchern/Filmen“). Du hast sie ausdrücklich gewünscht, deshalb sind sie drin. Wenn du sie übernimmst, gehört ein Eintrag in `DECISIONS.md` und eine Anpassung von `[RB-12]` dazu. Jeder Cameo ist streichbar (Bibel, Abschnitt 3).
2. **Neue Sprecher-IDs** (`peeves`, `hermione`, `pince`, `slughorn`, `neville` bisher; später weitere): `CHARACTERS` und `speakers.ts` brauchen sie, sonst schlägt `content:lint` fehl (Liste in der Bibel, Abschnitt 6).
3. **Vier Zusatz-Variablen** (`globals-zusatz.ink`) für Rückbezüge auf Ton-Entscheidungen. Sie ändern keine Enden und Hinweise. Außerdem sollte `scripts/simulate.ts` sie mitrandomisieren.
4. **Optionaler Einzeiler in `day01.ink`** (`~ f_d01_watch = true`, siehe tag-01.md), damit Tag 9 auf `d01.secret.watch` anspielen kann. Ohne den Patch entfällt nur diese Anspielung.
5. **Türchen-Zählung:** CONCEPT nennt Tag 2 „Erstes Türchen“, der Kalender nummeriert Türchen nach Tagen. Ich habe im Dialog **keine Türchen-Nummern** genannt, nur „das erste Türchen“ (Tag 2) und später „das letzte“ (Tag 24). Passt das so?
6. **`personal("insideJokes")`** in Tag 7: Das Skript erwartet `""`, wenn nichts gepflegt ist (die Zeile entfällt dann). Prüfen, was `PersonalService` bei fehlenden Feldern liefert.
7. **Tag 2–5 wurden schon committet** (Commit `430bae4`, M4): Der Agent für die Rätsel hat die Dateien offenbar mit eingecheckt und nutzt p02–p05 als Beispiele. Die Rätsel dort stimmen mit meinen Skizzen überein. Tag 8 (`p08`): Ich habe nach dem ersten Entwurf die Hinweise 1 bis 3 korrigiert, die Lösung (`2 4 1 3`) ist unverändert.
