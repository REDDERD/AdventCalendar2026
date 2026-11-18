# Übersicht Tag 1–8 (Akt I)

Wörter = längster und kürzester Pfad laut `content:simulate`-Logik (500 Zufallsdurchläufe, auch mit zufälligen Zusatz-Flags). Grenze laut DECISIONS.md #16: 500.

| Tag | Titel | Ort | Entscheidungen | Hinweis / Gegenstand | Cameo | Rätsel (Punkte) | Wörter |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [1](tag-01.md) | Die stehende Uhr | `great_hall` | `d01.ellis`, `d01.secret` | – | – | `p01` Die Zeiger (20) | 345–380 |
| [2](tag-02.md) | Schwebende Kerzen | `great_hall` | `d02.grimsby` (±`trust_grimsby`), `d02.peeves` (`peeves_friend`) | `k01` | Peeves | `p02` Schwebende Kerzen (20) | 413–445 |
| [3](tag-03.md) | Die wandernden Treppen | `staircases` | `d03.cold` (`k02` / +`bond_ellis`), `d03.portrait` | `k02` (optional) | – | `p03` Die Treppen (30) | 337–351 |
| [4](tag-04.md) | Die Bibliothek | `library` | `d04.pince`, `d04.help` (+`bond_ellis` / `bookmark`) | `bookmark` (optional) | Pince, Hermine | `p04` Das Regal (30) | 435–474 |
| [5](tag-05.md) | Der Enteisungstrank | `potions` | `d05.slughorn`, `d05.ingredient` (+`trust_theo`) | – | Slughorn, Snape-Porträt | `p05` Drei Flaschen (40) | 310–347 |
| [6](tag-06.md) | Die Nikolausnacht | `dorm_corridor` | `d06.boot`, `d06.theo` (±`trust_theo`) | `k03` | Harry und Ron (Tarnumhang) | `p06` Die Nikolausstiefel (30) | 374–401 |
| [7](tag-07.md) | Die Eulerei | `owlery` | `d07.letter` (`anonymous_letter`), `d07.home` (`wrote_home`) | `anonymous_letter` (optional) | Hedwig, Errol | `p07` Eulen-Nummern (30) | 340–364 |
| [8](tag-08.md) | Das Gewächshaus | `greenhouse` | `d08.neville`, `d08.maren` (+`trust_maren`) | – | Neville (+ Trevor) | `p08` Alraunen (40) | 323–387 |
| [9](tag-09.md) | Der Hausabend | `common_room` | `d09.secret` (`house_token`), `d09.ghost` | `house_token` (optional) | Hausgeister (je Haus einer), Fette Dame | `p09` Das Passwort (30, 4 Varianten) | 297–333 |

**Mindestgrenzen eingehalten:** Jeder Tag hat zwei Entscheidungen. Kein Ermittlungshinweis hängt an etwas anderem als in CONCEPT Abschnitt 8.3. Jeder Tag hat mindestens einen Rückbezug (siehe Kopftabelle der Tage).

## Rätsel, die per Skript geprüft sind (`npm run puzzles:verify`)

| Rätsel | Stand | Geprüft |
| --- | --- | --- |
| `p01` Zeiger | rechte Winkel statt Überdeckungen | Lösung `22` (Falle 24) |
| `p02` Kerzen | 4 × 5 mit Startmuster | genau eine Lösung, 11 Berührungen (GF(2)) |
| `p03` Treppen | 13 Treppen, 6 Einbahn, Absatz A | 28 Wege, ~6 % Trefferquote beim Raten |
| `p04` Regal | 6 Bücher, 5 indirekte Hinweise | genau eine Reihenfolge |
| `p05` Flaschen | 14/9/5 → 7/7 | kürzeste Lösung 13 Züge (BFS) |
| `p06` Stiefel | Logikraster 5 × 5, 5 Hinweise auf der Karte | genau eine von 14 400 Anordnungen |
| `p07` Eulen | 1, 4, 6, 11, 21 → Summe der drei davor | `38` (Falle 41) |
| `p08` Alraunen | 6 × 6 mit Steinen | genau eine Lösung: 6 3 5 1 4 2 |

Tag 11 liegt einzeln vor ([tag-11.md](tag-11.md)): „Das Boot“, Rätsel `p11` (`custom:cross`, 40 Punkte), 330–339 Wörter, Cameo Hagrid.

Geänderter Rätselplan ab Tag 13a und 17 (kein Skript, nur Spezifikation in Bibel Abschnitt 8): `p13a` Der Stammbaum (`arrange` Reihe, 7 Karten, 1 Lösung von 120) und `p17` Knallbonbons (Nim 3/4/5, `custom:nim`, 1 Gewinnzug, Zufall gewinnt ca. 0,7 %).

Alle Rätsel sind knackiger als in der ersten Fassung (Vorgabe Auftraggeber, DECISIONS.md #44). Tag 1–8 sind umgesetzt.
