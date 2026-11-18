# Übersicht Tag 1–8 (Akt I)

Wörter = längster und kürzester Pfad laut `content:simulate`-Logik (500 Zufallsdurchläufe, auch mit zufälligen Zusatz-Flags). Grenze laut DECISIONS.md #16: 500.

| Tag | Titel | Ort | Entscheidungen | Hinweis / Gegenstand | Cameo | Rätsel (Punkte) | Wörter |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [1](tag-01.md) | Die stehende Uhr | `great_hall` | `d01.ellis`, `d01.secret` | – | – | `p01` Die Zeiger (20) | 345–380 |
| [2](tag-02.md) | Das erste Türchen | `great_hall` | `d02.grimsby` (±`trust_grimsby`), `d02.peeves` (`peeves_friend`) | `k01` | Peeves | `p02` Schwebende Kerzen (20) | 413–445 |
| [3](tag-03.md) | Die wandernden Treppen | `staircases` | `d03.cold` (`k02` / +`bond_ellis`), `d03.portrait` | `k02` (optional) | – | `p03` Die Treppen (30) | 323–333 |
| [4](tag-04.md) | Die Bibliothek | `library` | `d04.pince`, `d04.help` (+`bond_ellis` / `bookmark`) | `bookmark` (optional) | Pince, Hermine | `p04` Das Regal (30) | 435–474 |
| [5](tag-05.md) | Der Enteisungstrank | `potions` | `d05.slughorn`, `d05.ingredient` (+`trust_theo`) | – | Slughorn, Snape-Porträt | `p05` Drei Flaschen (40) | 310–347 |
| [6](tag-06.md) | Die Nikolausnacht | `dorm_corridor` | `d06.boot`, `d06.theo` (±`trust_theo`) | `k03` | Harry und Ron (Tarnumhang) | `p06` Die Nikolausstiefel (30) | 371–398 |
| [7](tag-07.md) | Die Eulerei | `owlery` | `d07.letter` (`anonymous_letter`), `d07.home` (`wrote_home`) | `anonymous_letter` (optional) | Hedwig, Errol | `p07` Eulen-Nummern (30) | 340–364 |
| [8](tag-08.md) | Das Gewächshaus | `greenhouse` | `d08.neville`, `d08.maren` (+`trust_maren`) | – | Neville (+ Trevor) | `p08` Alraunen (40) | 323–387 |

**Mindestgrenzen eingehalten:** Jeder Tag hat zwei Entscheidungen. Kein Ermittlungshinweis hängt an etwas anderem als in CONCEPT Abschnitt 8.3. Jeder Tag hat mindestens einen Rückbezug (siehe Kopftabelle der Tage).

## Rätsel, die per Brute-Force geprüft sind

| Rätsel | Eindeutig? | Hinweis |
| --- | --- | --- |
| `p02` Kerzen | ja | genau eine Lösung: vier Ecken und Mitte |
| `p03` Treppen | 12 gültige Wege | Euler-Pfad 1 → 7, jede Treppe einmal |
| `p04` Regal | ja | `FEDER ZEIT RAD STUNDE PENDEL` |
| `p05` Flaschen | kürzeste Lösung 7 Züge | per BFS |
| `p06` Stiefel | ja (logisch herleitbar) | Ellis `Zimtstern`, Maren `Nuss`, Theo `Lakritz`, Quill `Mandarine` |
| `p07` Eulen | ja | `38` (zwei unabhängige Deutungen) |
| `p08` Alraunen | ja | Spalten je Reihe `2 4 1 3` |
