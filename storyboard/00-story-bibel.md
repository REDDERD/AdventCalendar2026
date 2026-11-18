# Story-Bibel

Gemeinsame Grundlage für alle Tage. Vorsicht, **Spoiler**: Abschnitt 2 verrät die Auflösung. Konzept-Grundlagen (Figuren, Hinweise, Enden) stehen in `CONCEPT.md` und werden hier nicht wiederholt, nur ergänzt.

## 1. Der Ton in einem Satz

Ein warmes, leicht verrücktes Rätselabenteuer, in dem niemand böse ist und jeder zu viel redet. Die Witze kommen aus den Figuren, nicht aus Anspielungen: Ein Cameo muss auch dann lustig sein, wenn man die Figur nicht kennt.

## 2. Die Wahrheit (nur für uns)

- **Aldous** hat die Uhr angehalten, weil er am 24.12. nach 300 Jahren an der Uhr „weiterziehen“ müsste. Isolde Tickwell hat ihn 1726 an ihr Werk gebunden, damit er bleiben konnte. Er will nicht gehen und hat Angst, es auszusprechen.
- Er hilft trotzdem bei der Suche, weil er hin- und hergerissen ist. Er **friert die Uhr jedes Mal wieder ein**, wenn jemand sie repariert (Theo, nachts). Daher: Eis kehrt zurück (Tag 5), ein einzelnes Ticken (Tag 6), Raureif im Uhrwerk (Tag 21).
- **Theo** ist Isoldes Nachfahre und will seiner Familie beweisen, dass er die Uhr reparieren kann. **Maren** versteckt den Niffler `knopf`, der Zahnrad Nr. 12 gestohlen hat. **Grimsby** tut nur so, als sei er froh über die Ruhe.
- **Zwei unabhängige Defekte** verwirren die Ermittlung: Aldous' Stillstand und das fehlende goldene Zahnrad (Knopf). Beide müssen im Finale behoben werden.
- **Die dritte Lösung (Ende A):** Weder Bann noch Abschied, sondern eine **Tür, die einen Spalt offen bleibt**. Die Uhr wird so umgebaut, dass Aldous bleiben darf, solange er will, und jederzeit gehen kann. Zahnrad Nr. 12 ist das Scharnier dieser Tür.
- **Warum schlug die Uhr bei der Ankunft?** Isolde schrieb in ihren Brief (`k06`): „Ein Fremder wird die Stunde schlagen, wenn ihr bereit seid.“ Die Spielfigur ist der Fremde. Die Uhr hat sie erkannt.

### Fair-Play-Plan: wann der Spieler was wissen kann

| Tag | Was der aufmerksame Spieler schon ahnen kann |
| --- | --- |
| 2 | Etwas Silbriges verbeugt sich vor der Uhr (Ellis sieht es) |
| 3 | Eine wandernde Kälte, die durch eine Wand verschwindet |
| 4 | Aldous sagt „Isolde“ zu zärtlich. Er geht auffällig schnell |
| 5 | Das Eis kehrt zurück, nachdem man es gelöst hat |
| 6 | Das einzelne Ticken, Zahnrad Nr. 12 mit Herz |
| 7 | Der anonyme Brief ist an den Rändern gefroren: „Ein Freund“ |
| 8 | Es gibt etwas Kleines, Glitzerndes im Schuppen (Knopf) |
| ab 13 | Isolde, der Ritter, die dreihundert Jahre (`k06`, `k07`, `k10`) |

## 3. Zeitfransen: die Cameo-Regel

Seit die Uhr steht, franst die Zeit in Hogwarts aus. Quill nennt es „Zeitfransen“ (Tag 4), Ellis' erste Theorie hieß „Zeitmotten“ (Tag 1) und lag nicht falsch. Das erklärt, warum Gäste aus anderen Jahrzehnten durchs Schloss laufen:

- **Cameos sind „Zeitgäste“.** Sie wissen oft nicht, wann sie sind („Ich unterrichte hier. Oder habe. Oder werde.“).
- **Sie dürfen nie die Handlung lösen.** Jeder Cameo hilft einmal und geht dann; keiner kennt die Wahrheit.
- **Jeder Cameo ist streichbar.** Fällt eine Figur raus (Lizenz-Bauchgefühl, Platzmangel), bleibt der Tag erzählbar. Die Spalte „Streichbar“ unten sagt, was man dafür ändern muss.
- **Tag 24:** Mit dem letzten Schlag kehren die Zeitgäste in ihre Zeit zurück. Alle winken.
- **Geister, Porträts, Tiere, Läden** sind zeitlos und brauchen keine Erklärung.

### Cameo-Katalog

Die Sprecher-ID ist eine **neue** ID, die in `src/types/index.ts` (`CHARACTERS`) und `src/dialogue/speakers.ts` ergänzt werden muss (siehe Abschnitt 6). Figuren ohne ID kommen nur als Erzählzeile oder Schild vor.

| Cameo | Sprecher-ID | Tage | Rolle und Gag | Streichbar? |
| --- | --- | --- | --- | --- |
| Peeves | `peeves` | 2 ✅, 19 | Bläst die Kerzen aus. Mit `peeves_friend` hält er sich später zurück | ja, durch eine Original-Spuk-Figur ersetzbar |
| Madam Pince | `pince` | 4 ✅ | Bücherwächterin, riecht Zimtsterne | ja |
| Hermine Granger | `hermione` | 4 ✅, 17 (Hintergrund), 22 | Kennt jede Seitenzahl, ist „in der falschen Woche“, verliert später einen Zeitumkehrer im Pendelraum | Tag 4 und 22 hängen aneinander |
| Horace Slughorn | `slughorn` | 5 ✅, 16 | Sammelt begabte Menschen. Duft-Probe mit persönlichen Düften | ja |
| Snape (Porträt) | – | 5 ✅, 23 | Sagt nichts, sagt es laut. Nickt in Tag 23 einmal | ja |
| Harry und Ron (unter dem Tarnumhang) | – | 6 ✅, 17 | Zanken leise über einen Fuß. In Hogsmeade ohne Umhang | ja |
| Hedwig und Errol | – | 7 ✅, 24 | Namensschilder in der Eulerei. Hedwig strenger Blick, Errol landet falsch | ja |
| Neville Longbottom | `neville` | 8 ✅, 24 | Pflanzt Alraunen um, sucht „Trevor“ (nur mit Kröte) | ja |
| Filch und Mrs. Norris | `filch` | 10 | Hausmeister-Duett mit Grimsby: zwei Griesgrame, ein Seufzer | ja |
| Hagrid, Fang, Seidenschnabel und zwei Hippogreife, drei Frettchen | `hagrid` | 11 ✅, 16, 24 | Felsenkuchen (`ate_rockcake`), Zweier-Boot über den See, Rätsel „Das Boot“ (Wolves and Chicks mit Hippogreifen und Frettchen). Ein Frettchen ist blasiert (streichbar) | ja, aber das Rätsel braucht dann neue Wesen |
| Luna Lovegood | `luna` | 12 | Sternbilder mit eigenen Namen. Beruhigt Ellis' Höhenangst | ja |
| Newt Scamander | `newt` | 15w | Nifflers sind keine Diebe, sondern Sammler | ja |
| Dumbledore (Porträt) | `dumbledore` | 15a | Zitronenbonbons, ein Augenzwinkern, kein Rat | ja |
| Zeitgäste beim Ball (Hermine, Slughorn, Neville, Hagrid, Luna, Newt) | – | 16 | Das Rätsel „Tischordnung“ besteht aus den Cameos der Tage 4–15. Eine Belohnung für aufmerksame Spieler | nur als Gruppe |
| Rosmerta, Fred und George | `rosmerta`, `fred`, `george` | 17 | Butterbier, Scherzartikel, Trio im Hintergrund. Fred und George spielen im Scherzladen Nim um Knallbonbons (Rätsel „Knallbonbons“, Abschnitt 8) und spielen perfekt | ja, aber das Rätsel braucht dann einen anderen Spielpartner |
| Dobby | – | 18 | Sockengeschenk im Raum der Wünsche (nur Erzählzeile) | ja |
| Fast Kopfloser Nick, Graue Dame, Blutiger Baron, Fetter Mönch | `nick`, `grey_lady`, `baron`, `friar` | 19 | Geisterparade. Die Graue Dame sagt Aldous den klügsten Satz | Nick und Graue Dame wichtig, andere streichbar |
| Flitwick, Lockhart | `flitwick` | 20 | Duell-Champion als Trainer. Lockhart signiert Luft (nur Erzählzeile) | ja |
| Fawkes | – | 21 | Nur bei Zauberstab `phoenix`: Feder als Funke | ja |
| Zeitumkehrer (Hermine) | – | 22 | Auflösung des Zeitfransen-Gags | hängt an Tag 4 |

✅ = bereits in `tag-0X.md` geschrieben.

## 4. Figuren: Stimmen und Dauer-Gags

| Figur | Stimme | Dauer-Gag |
| --- | --- | --- |
| `quill` | Trocken, geduldig, Tee statt Panik | Jedes Rätsel beginnt mit „Das erinnert mich an ein Rätsel …“. Teelöffel als Hutnadel, Tee wird immer eingeschenkt |
| `ellis` | Redet zu viel, übertreibt, Höhenangst | Sieben Theorien (Tabelle unten), Cousine Hortensia, laminiert Zettel |
| `grimsby` | „Schüler! Dreck! Ticken!“ | Behauptet Ruhe zu mögen, vermisst das Ticken |
| `thornbury` | Wenige Worte, trocken | „Kein Wort zu irgendjemandem.“ Alle wissen es spätestens am 3. Tag |
| `theo` | Knapp, ironisch, ausweichend | Riecht nach Öl und Messing, lügt schlecht |
| `maren` | Überfreundlich | Bietet Kekse an, wenn sie nervös wird. Immer |
| `aldous` | Ritterlich, altmodisch, melancholisch | „Fürwahr“, „Gestattet“, sagt „Isolde“ zu zärtlich |
| `knopf` | Quiekt | Alles, was glänzt, gehört ihm |

### Ellis' sieben Theorien (roter Faden)

| # | Tag | Theorie | Wahrheitsgehalt |
| --- | --- | --- | --- |
| 1 | 1 | Zeitmotten fressen Sekunden | Zeitfransen: nicht ganz falsch |
| 2 | 2 | Die Uhr hat einen Frosch im Hals | Gag |
| 3 | 5 | Die Uhr streikt: 300 Jahre ohne Urlaub | Tag 22 macht daraus Wahrheit (die „300“) |
| 4 | 8 | Die Uhr ist ein Setzling und wächst, wenn man mit ihr redet | Tag 24: Du redest mit ihr, sie tickt |
| 5 | 11 | Die Uhr hat sich eingeschneit | Gag |
| 6 | 16 | Die Uhr streikt, weil sie keine Einladung zum Ball bekam | Gag, rührt Aldous |
| 7 | 22 | **Eine Uhr bleibt stehen, wenn jemand nicht will, dass die Zeit weitergeht.** | **Die Wahrheit.** Quill: „Das ist die beste Theorie.“ |

## 5. Türchen-Zauber (kleine Weihnachtswunder je Tag)

Jedes Rätsel öffnet ein Türchen, aus dem ein kleines Weihnachtswunder fällt. Der Text steht im Kopf jeder Tagesdatei und gehört in `dayEnd`.

| Tag | Zauber | Tag | Zauber |
| --- | --- | --- | --- |
| 1 | Das erste Türchen springt auf – leer | 13 | Glühwürmchen-Lichterketten im Wald |
| 2 | Zimtsterne | 14 | Eiskristalle in Spinnweben |
| 3 | Treppen schaukeln im Takt | 15 | Schokotaler regnen |
| 4 | Bücher in Wollmützen | 16 | Der Tisch deckt sich selbst |
| 5 | Kessel duften nach Lebkuchen | 17 | Schnee in Bonbonfarben |
| 6 | Fünf Stiefel füllen sich | 18 | Der Raum wünscht jedem etwas Warmes |
| 7 | Eulen mit roten Schleifen | 19 | Geister singen im Chor |
| 8 | Mistelzweige singen | 20 | Zauberstäbe funkeln wie Wunderkerzen |
| 9 | Kamine in den Hausfarben | 21 | Glockenspiel im Uhrturm |
| 10 | Schlüsselbund wird zum Glöckchen | 22 | Das Pendel schwingt einmal, Schneeflocken |
| 11 | Schneemänner winken | 23 | Ein Tannenbaum wächst in der Halle |
| 12 | Sternschnuppen formen Zahlen | 24 | Schnee fällt in der Halle |

**Entschieden (DECISIONS.md #42):** Tag 1 = 1. Dezember = erstes Türchen; der Prolog ist kein Tag. Am Ende von Tag 1 springt das erste (leere) Türchen auf, an Tag 2 das zweite. Der Tagesend-Bildschirm zeigt den Zauber als „Türchen N: …“.

## 6. Technische Ergänzungen zum Konzept (zur Übernahme)

### Zusatz-Variablen

Siehe `globals-zusatz.ink`. Vier Ton-Flags, die nichts an Hinweisen oder Enden ändern:

| Variable | Gesetzt in | Wird gebraucht in |
| --- | --- | --- |
| `f_d01_watch` | `d01.secret.watch` (Patch in `day01.ink`) | Tag 9 |
| `peeves_friend` | `d02.peeves.join` ✅ | Tag 19 |
| `wrote_home` | `d07.home.write` ✅ | Tag 24 |
| `ate_rockcake` | `d11.hagrid.eat` | Tag 16 |

`content:simulate` muss sie in `randomState()` mitrandomisieren, sonst werden Zweige mit Flags nie gezählt (in meiner Prüfumgebung geschehen).

### Neue Sprecher

`src/types/index.ts`: `CHARACTERS` und `CharacterId` ergänzen. `src/dialogue/speakers.ts`:

```ts
peeves: 'Peeves',
hermione: 'Hermine',
pince: 'Madam Pince',
slughorn: 'Prof. Slughorn',
neville: 'Neville',
// geplant (Tag 10 ff.)
filch: 'Filch',
hagrid: 'Hagrid',
luna: 'Luna',
newt: 'Newt Scamander',
dumbledore: 'Dumbledore (Porträt)',
rosmerta: 'Madam Rosmerta',
fred: 'Fred',
george: 'George',
flitwick: 'Prof. Flitwick',
nick: 'Fast Kopfloser Nick',
grey_lady: 'Die Graue Dame',
baron: 'Der Blutige Baron',
friar: 'Der Fette Mönch',
```

Portraits und Sprites erscheinen als Platzhalter, bis Grafik da ist `[GFX-6]`.

## 7. Fahrplan Tag 9–24 (noch nicht geschrieben)

Kurz-Skizze, damit die nächsten Tage dieselbe Linie halten. Jeder Tag bekommt eine Zweitentscheidung (Mindestgrenze: 2 Entscheidungen).

| Tag | Beat | Cameo | Zweitentscheidung (Idee) |
| --- | --- | --- | --- |
| 9 | Hausabend. Vier Hauseingänge, vier Varianten. Tratsch über die Verdächtigen. Ellis hat natürlich alles herumerzählt (`f_d01_watch`) | Fette Dame nur als Erzählzeile | `d09.ghost` |
| 10 | Grimsbys Büro. Er gibt zu, das Ticken zu vermissen. `k08` | Filch und Mrs. Norris | `d10.cat` |
| 11 ✅ [tag-11.md](tag-11.md) | Das Boot. Zwei Fährten (Pfoten mit Glitzer Richtung Wald, Schuhe Richtung Archiv) als Erzählung, am See Hagrids Herde im Zweier-Boot: Rätsel „Wolves and Chicks“ | Hagrid, Fang, Seidenschnabel | `d11.snow` + `d11.hagrid` (`ate_rockcake`) |
| 12 | Astronomieturm. Sternbild „Der Ritter“. Ellis' Höhenangst. Routenwahl. Quills Leitspruch Akt II | Luna | `d12.courage` + `d12.route` |
| 13w/13a | Wald mit Ellis bzw. Archiv mit Quill. Theo ist Isoldes Nachfahre (13a); Rätsel dort: der Stammbaum von Isolde bis Theo (Abschnitt 8) | Zentaur (Erzählzeile) / – | `d13w.centaur` / `d13a.archivist` |
| 14w/14a | Das goldene Zahnrad im Nest / Isoldes Spiegelschrift ("Pendel") | Aragogs Urenkelin (Erzählzeile) / Myrte als Option | `d14w.spider` / `d14a.myrtle` |
| 15w/15a | Knopf gefunden / Porträt von 1726 (`k07`) | Newt / Dumbledore (Porträt) | `d15w.newt` / `d15a.dumbledore` |
| 16 | Ball-Vorbereitung. Maren gesteht. Routen treffen sich. Tischordnung mit den Cameos | alle Zeitgäste | `d16.seating` |
| 17 | Hogsmeade. Geschenke für Ellis oder Aldous. Im Scherzladen Nim um Knallbonbons gegen Fred und George (Abschnitt 8) | Rosmerta, Fred und George, Trio im Hintergrund | `d17.treat` |
| 18 | Raum der Wünsche. Isoldes Erinnerung, persönliches Foto | Dobby (Erzählzeile) | `d18.wish` |
| 19 | Geisterparade. Aldous ist traurig, die Graue Dame spricht mit ihm | Nick, Graue Dame, Baron, Mönch, Peeves | `d19.parade` |
| 20 | Duell-Training. Theo verbündet sich oder nicht | Flitwick, Lockhart | `d20.lockhart` |
| 21 | Uhrturm. `k09`. Ellis klettert (Höhenangst) | Fawkes (bei `phoenix`) | `d21.climb` |
| 22 | Pendelkammer. `k10` „CCC“. Ellis' siebte Theorie | Hermine mit Zeitumkehrer | `d22.hermione` |
| 23 | Anklage mit Hinweiskarten. Alle Verdächtigen | Snape (Porträt) nickt | `d23.speech` |
| 24 | Geständnis, Finale je Ende, Abschied der Zeitgäste, Abspann | alle | `d24.last` |

## 8. Rätselplan (Stand 18.11.2026)

Gilt zusammen mit CONCEPT Abschnitt 9 und DECISIONS #50/#51. ✅ = Storyboard geschrieben. `cross` ist gebaut (Tag 11); `nim` und die Stammbaum-Konfiguration folgen mit Tag 17 und 13a.

| Tag | Rätsel | Engine | Stand |
| --- | --- | --- | --- |
| 1 | `p01` Die Zeiger | `input` | ✅ |
| 2 | `p02` Schwebende Kerzen | `toggle` | ✅ |
| 3 | `p03` Die Treppen | `path` | ✅ |
| 4 | `p04` Das Regal | `arrange` Reihe | ✅ |
| 5 | `p05` Drei Flaschen | `custom:pour` | ✅ |
| 6 | `p06` Die Nikolausstiefel | `arrange` Raster | ✅ |
| 7 | `p07` Eulen-Nummern | `input` | ✅ |
| 8 | `p08` Alraunen | `arrange` Raster | ✅ |
| 9 | `p09` Das Passwort (4 Hausvarianten) | `input` | Konzept |
| 10 | `p10` Der Schlüsselbund | `choice` | Konzept |
| 11 | `p11` **Das Boot** (Wolves and Chicks) | `custom:cross` | ✅ [tag-11.md](tag-11.md) |
| 12 | `p12` Das Sternbild | `path` | Konzept |
| 13w | `p13w` Zentaurenpfeile | `input` | Konzept |
| 13a | `p13a` **Der Stammbaum** | `arrange` Reihe | Konzept, Spezifikation unten |
| 14w | `p14w` Das Spinnennetz | `path` | Konzept |
| 14a | `p14a` Spiegelschrift | `input` | Konzept |
| 15w | `p15w` Was glänzt? | `tap` | Konzept |
| 15a | `p15a` Das Porträt | `tap` | Konzept |
| 16 | `p16` Die Tischordnung | `arrange` Reihe | Konzept |
| 17 | `p17` **Knallbonbons** (Nim) | `custom:nim` | Konzept, Spezifikation unten |
| 18 | `p18` Die Tür, die erscheint | `slide` | Konzept |
| 19 | `p19` Die Parade | `arrange` Reihe | Konzept |
| 20 | `p20` Zauberduell (bleibt unverändert) | `choice` | Konzept |
| 21 | `p21` Zahnräder | `choice` | Konzept |
| 22 | `p22` Römische Stäbe | `arrange` Stäbe | Konzept |
| 23 | `p23` Wer war es? | `custom:accuse` | Konzept |
| 24 | `p24` Der letzte Schlag | `custom:finale` | Konzept |

`input` nutzen danach nur noch Tag 1, 7, 9, 13w, 14a.

### `p17` Knallbonbons (Nim, `custom:nim`)

- **Rahmen:** Im Scherzladen in Hogsmeade. Fred und George legen drei Haufen Knallbonbons aus: **3, 4 und 5**. Abwechselnd nimmt man beliebig viele Bonbons aus **einem** Haufen. Wer das letzte nimmt, gewinnt. Der Spieler beginnt. Die Zwillinge spielen perfekt und necken beim Verlieren („Das war Absicht!“).
- **Per Spielbaum geprüft (Scratchpad `nim.mjs`):** Der beginnende Spieler gewinnt. Es gibt **genau einen Gewinnzug**: den ersten Haufen von 3 auf 1 verkleinern (Nim-Summe 3 ⊕ 4 ⊕ 5 = 2). Danach muss man bei jedem Zug wieder die Haufen „aufgehen lassen“. Ein Spieler mit Zufallszügen gewinnt nur in etwa **0,7 %** der Partien.
- **Ablauf in der App:** Verliert man, startet die Partie neu (zählt als Fehlversuch im Punktesystem). Die Zwillinge nehmen im Gewinnstand den Gewinnzug, sonst den kleinsten legalen Zug, damit `puzzles:verify` beweisen kann, dass es gegen jede Antwort einen Siegweg gibt.
- **Hinweise (Entwurf):** 1) Der erste Zug entscheidet alles. 2) Schreib die Haufen als Zweierpotenzen auf: 3 = 2 + 1, 4 = 4, 5 = 4 + 1. Nach deinem Zug soll jede Zweierpotenz gerade oft vorkommen. 3) Nimm zwei Bonbons vom ersten Haufen. Dann bleiben 1, 4, 5.
- **Super-Hinweis:** Nach den Haufen 1, 4, 5 spiegelst du jeden Zug der Zwillinge so, dass wieder jede Zweierpotenz gerade oft vorkommt.
- **Engine-Spezifikation:** Aufbau wie `pour.ts` (`pourLogic`): `nimConfig` (Haufen, Regel „Normalspiel“, Spieler beginnt), Zustand `{ heaps, turn }`, Zug `take(heap, count)`, KI-Funktion, `verify` mit Spielbaum über alle (hier 120) Stellungen. Tests: Gewinnzug, verbotene Züge (leerer Haufen, mehr als vorhanden), KI-Antwort, Sieg und Niederlage.

### `p13a` Der Stammbaum (`arrange` Reihe)

- **Rahmen:** Im Archiv liegen sieben Karteikarten aus Isoldes Familie, durcheinander. Quill und der Spieler ordnen sie von der ältesten bis zur jüngsten Generation. Am Ende steht Theo: Er ist Isoldes Nachfahre (Enthüllung des Tages, `k06` bleibt in der Szene).
- **Karten:** Isolde Tickwell (Uhrmacherin), Mabel, Hugo, Ottilie, Barnaby, Cora, Theo Ashcombe. Die Reihe ist eine Generationenkette (Eltern → Kind).
- **Feste Plätze:** Isolde ist die Älteste (Platz 1), Theo der Jüngste (Platz 7).
- **Sechs Hinweise** (Regeln für `arrange row`, per Brute-Force geprüft, **genau eine** Reihenfolge von 120 möglichen für die fünf mittleren Karten):
  1. Hugo ist Mabels Sohn. (`right_of`: Hugo direkt nach Mabel)
  2. Cora ist weder Mabels Elternteil noch ihr Kind. (`not_next_to`)
  3. Cora ist weder Hugos Elternteil noch sein Kind. (`not_next_to`)
  4. Mabel ist älter als Ottilie. (`left_of`, Abstand ≥ 1)
  5. Ottilie ist weder Coras Elternteil noch ihr Kind. (`not_next_to`)
  6. Barnaby lebte mindestens zwei Generationen nach Mabel. (`left_of`, Abstand ≥ 2)
- **Lösung:** Isolde, Mabel, Hugo, Ottilie, Barnaby, Cora, Theo. Jeder einzelne Hinweis lässt allein viele Reihenfolgen zu; erst alle zusammen ergeben genau eine.
- **Hinweise (Entwurf):** 1) Isolde steht ganz vorn, Theo ganz hinten. Hugo steht direkt hinter seiner Mutter Mabel. 2) Cora darf nur neben Barnaby oder Theo stehen, nicht neben Mabel, Hugo oder Ottilie. 3) Cora steht direkt vor Theo, davor Barnaby.
- **Super-Hinweis:** Isolde, Mabel, Hugo, Ottilie, Barnaby, Cora, Theo.
- **Haustier `[PLAN-2]`:** Tag 13 schaltet Hinweis 1 gratis frei (`petHint` im JSON).
- **Umsetzung:** nur Konfiguration (`arrange`, Modus `row`, Regeltypen `at`, `right_of`, `left_of`, `not_next_to` gibt es bereits in `src/puzzles/logic/arrange.ts`), keine neue Engine. Anzeigetexte der Karten und die Karteikarten-Hinweise gehören in die Rätsel-Oberfläche (wie die Hinweiskarte von `p06`).
