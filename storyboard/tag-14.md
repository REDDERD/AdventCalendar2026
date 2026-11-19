# Tag 14 – Tiefer hinein

> Akt II · Verdacht · **Routentag** (`route`) · Orte `forest_clearing` (Wald) und `dungeon_corridor` (Archiv) · Musik `outdoor` / `dungeon`

Eine Datei `day14.ink` mit drei Knoten: `day14` verzweigt nach `route`, `day14_forest` und `day14_archive` sind die beiden Wege.

| | Wald (`day14_forest`) | Archiv (`day14_archive`) |
| --- | --- | --- |
| **Kurz** | Auf der Lichtung hängt ein riesiges Spinnennetz, in dessen Mitte ein goldenes Zahnrad glänzt. Eine Spinne, Aragogs Urenkelin, erlaubt den Weg, wenn man jeden Knoten nur einmal betritt. | Im Kerkerkorridor steht eine Zeile in Spiegelschrift an der Wand: Isoldes Werkstatt. Myrte aus dem Rohr kennt sich mit Spiegeln aus. |
| **Entscheidungen** | `d14w.spider` (`greet` / `nod`, Ton) · `d14w.gear` (`take` / `watch`, Ton, **beide** bringen `k04`) | `d14a.myrtle` (`ask` / `alone`, Ton) · `d14a.tone` (`admire` / `lonely`, Ton) |
| **Hinweis** | `k04` Das goldene Zahnrad | – (setzt „Pendel“ für Tag 22) |
| **Cameo** | **Aragogs Urenkelin** (nur Erzählzeilen) | **Die Maulende Myrte** (Geist, Sprecher `myrte`, durchscheinend) |
| **Rätsel** | `p14w` Das Spinnennetz (`path`, 50 Punkte) | `p14a` Spiegelschrift (`input`, 50 Punkte) |
| **Rückbezug** | Tag 13w `lantern` (Netz funkelt) · Tag 11 (Hagrids zwölf Löffel ↔ Zahnrad Nr. 12) · Tag 8 (Schuppen) | `k06` (dieselbe Handschrift) · `k02` (die Kälte aus Tag 3) · `trust_theo` (Theos Akte) |
| **Türchen-Zauber** | Eiskristalle in den Spinnweben | dito, in den Ecken des Korridors |
| **Wörter** | beide Routen zusammen 194–259 gemessen (`content:simulate`) | |

## Beats

**Wald:** 1. Die Zimtkrümel enden auf der Lichtung. Über ihr hängt das Netz. In der Mitte ein Nest, darin etwas Goldenes. 2. Aragogs Urenkelin lässt sich herab. **Entscheidung 1:** grüßen oder nicken. 3. Rätsel: Jeder Knoten genau einmal, drei Fäden sind gerissen. 4. Im Nest: das Zahnrad mit der Nr. 12 und einem Herz. **Entscheidung 2:** mitnehmen oder zeichnen lassen. Beides gibt `k04`.

**Archiv:** 1. Der Korridor, in dem Isolde einst gearbeitet hat. Spiegelschrift an der Wand. 2. Myrte taucht aus einem Rohr auf. **Entscheidung 1:** sie um Hilfe bitten oder allein entziffern. 3. Quill spricht über Isolde. **Entscheidung 2:** sie bewundern oder bemitleiden. 4. Rätsel: Das gespiegelte Wort entziffern. 5. Es lautet „Pendel“.

## Skript

```ink
INCLUDE globals.ink

// Tag 14 – Tiefer hinein (Akt II). Routen-Knoten day14_forest / day14_archive [STR-1]. Rätsel: p14w / p14a.
=== day14 ===
{ route == "archive": -> day14_archive }
-> day14_forest

=== day14_forest ===
# bg: forest_clearing
# music: outdoor
# spark: d14w.s1 44 150
Vierzehnter Dezember. Die Lichtung ist rund wie ein Teller und still wie ein Gebet.
# show: ellis left
ellis: Die Zimtkrümel hören hier auf. Mitten auf der Lichtung. Das ist unhöflich.
{ items ? lantern: Deine Laterne wirft Licht auf ein riesiges Netz. Es funkelt wie ein Kronleuchter. }
Über der Lichtung hängt es, groß wie ein Segel.
In der Mitte ein Nest aus Zweigen und Zwirn.
Darin glänzt etwas Goldenes. Rund. Gezahnt.
ellis: Ein Zahnrad! Ein goldenes! Aus einer Uhr! Ich muss mich setzen. Es ist Schnee. Ich stehe.
Von einem Ast klackt es. Eine Spinne, so groß wie ein Schaf, lässt sich am Faden herab.
„Aragogs Urenkelin“, klackt sie. „Ich habe keine Lust, jemanden zu essen.
„Nur einen Namen, der es behauptet.“
# choice_point: d14w.spider Die Spinne mustert euch mit acht Augen.
* [Freundlich grüßen.] # cid: d14w.spider.greet
    „Höflich“, klackt sie. „Der Kleine mit dem Glitzer kommt jede Nacht. Er bringt Zimtkekse.“
    ellis: Der Kleine füttert die Spinne. Mit Keksen. Die Welt ist sehr seltsam.
* [Schweigend nicken.] # cid: d14w.spider.nod
    Sie nickt zurück. Acht Augen blinzeln nicht im Gleichschritt.
    Es ist gruselig, aber höflich gemeint.
- „Zum Nest geht es nur über das Netz. Betretet jeden Knoten einmal. Drei Fäden sind gerissen.“
{ pet == "owl": Deine Eule sitzt auf dem Netz. Sie läuft eine Spirale ab und blickt dich stolz an. }
{ pet == "cat": Deine Katze beäugt das Netz. Sie will hinauf. Sie weiß nicht, dass sie es sollte. }
{ pet == "toad": Deine Kröte hüpft auf einen Knoten und bleibt dort kleben. Sie nimmt das persönlich. }
ellis: Quill würde etwas über Spiralen sagen. Ich sage: Mir wird schon vom Zusehen schwindlig.
# puzzle: p14w
{ last_puzzle_first_try: Die Spinne klackt anerkennend. „Selten so sauber gelaufen.“ }
{ not last_puzzle_first_try: Die Spinne klackt. „Du hast mein Netz zweimal berührt. Ich verzeihe dir einmal.“ }
# sfx: spark
Im Nest liegt das Zahnrad, warm wie Brot.
Auf der Rückseite: eine 12 und ein winziges Herz.
# choice_point: d14w.gear Das goldene Zahnrad liegt vor dir.
* [Das Zahnrad vorsichtig mitnehmen.] # cid: d14w.gear.take
    Es passt in deine Hand, als hätte es auf dich gewartet.
* [Ellis zeichnen lassen und liegen lassen.] # cid: d14w.gear.watch
    Ellis zeichnet die Kontur, die 12 und das Herz.
    Im Gebüsch quiekt etwas. Goldene Augen blitzen auf.
-
# clue: k04
ellis: Zwölf Löffel bei Hagrid. Zahnrad Nummer zwölf hier. Ich sehe ein Muster.
ellis: Ich sehe zwölf Muster.
Auf den Spinnfäden bilden sich Eiskristalle und klingeln leise im Wind.
# spark: d14w.s2 214 140
-> END

=== day14_archive ===
# bg: dungeon_corridor
# music: dungeon
# spark: d14a.s1 206 150
Vierzehnter Dezember. Der Kerkergang riecht nach nassem Stein und alten Plänen.
# show: quill right
quill: Die Akte Tickwell erwähnt diesen Gang. Isoldes Werkstatt lag einmal hier.
An der Wand läuft eine Zeile in kleiner, schiefer Schrift. Sie ist spiegelverkehrt.
quill: Isolde schrieb Notizen so, dass nur ein Spiegel sie lesen kann. Oder jemand mit viel Zeit.
{ clues ? k06: quill: „Mein Ritter.“ Der Brief hat dieselbe Handschrift. Sie schrieb gern verschlüsselt. }
{ clues ? k02: quill: Und diese Kälte schon wieder. Wie auf den Treppen. Das ist kein Zufall. }
# show: myrte left
Aus einem tropfenden Rohr steigt ein Mädchen, durchscheinend, mit dicker Brille.
myrte: Ihr seid die ersten Besucher seit … ich glaube, seit 1943. Hallo.
myrte: Ich weine gleich. Das ist eine Warnung.
# choice_point: d14a.myrtle Myrte schwebt vor der Spiegelschrift.
* [Myrte um Hilfe bitten.] # cid: d14a.myrtle.ask
    myrte: Mich? Wirklich mich? Ich kenne Spiegel. Ich habe sie jahrelang von innen gesehen.
    myrte: Das hier ist ein Wort, aber es ist falsch rum und irgendwie falsch gedacht.
* [Allein entziffern.] # cid: d14a.myrtle.alone
    myrte: Ah. Niemand fragt mich. Das ist auch eine Antwort. Ich bin dann im Rohr.
- # hide: myrte
quill: Isolde zeigte ihre Entwürfe nie jemandem.
quill: Sie baute Uhren, weil Uhren nicht widersprechen.
# choice_point: d14a.tone Quill streicht über die Wand.
* [Isolde muss genial gewesen sein.] # cid: d14a.tone.admire
    quill: Genial, ja. Das Genie und die Einsamkeit teilen sich oft einen Hocker.
* [Sie klingt einsam.] # cid: d14a.tone.lonely
    quill: Ja. Du hörst gut zu, {pronoun_form("meine Liebe", "mein Lieber", "mein Gutes")}. Das ist selten.
- { pet == "owl": Deine Eule hält den Kopf schief. Sie liest die Zeile von rechts nach links und nickt. }
{ pet == "cat": Deine Katze sieht ihr Spiegelbild in einer Pfütze. Sie ist überzeugt, dass es unhöflich ist. }
{ pet == "toad": Deine Kröte springt in eine Pfütze. Das Spiegelbild springt zurück. Sie ist beeindruckt. }
quill: Das erinnert mich an ein Rätsel, das mit zwei Spiegeln und viel Geduld begann …
# puzzle: p14a
{ last_puzzle_first_try: quill: Beim ersten Versuch. Ihre Geduld wäre Isolde aufgefallen. }
{ not last_puzzle_first_try: quill: Der Weg zählt, nicht die Anzahl der Versuche. Das sagte meine Lehrerin. }
# sfx: spark
Das Wort leuchtet von allein auf der Wand. P E N D E L.
quill: Das Pendel. Das Herz jeder Uhr. Dort liegt etwas, das Isolde niemandem sagen wollte.
Die Spinnweben in den Ecken überziehen sich mit Eiskristallen und klingeln leise.
# spark: d14a.s2 40 130
-> END
```

## Rätsel `p14w` – Das Spinnennetz

> Hamiltonpfad auf einem Spinnennetz, per Skript geprüft (alle Pfade durchprobiert).

- **Engine:** `path`, Regel `simple` mit `visitAll`, Stil `stars` (Tautropfen). Start **c1** (Rand oben links), Ziel **m** (Mitte, das Nest).
- **Netz:** 13 Knoten: Mitte `m`, innerer Ring `a1`–`a4`, mittlerer Ring `b1`–`b4`, äußerer Ring `c1`–`c4`. Vier Speichen (`aᵢ–bᵢ–cᵢ`) und je Ring vier Fäden, die Mitte ist mit den inneren Knoten verbunden. **Drei Fäden sind gerissen:** `m–a4`, `a1–b1`, `b2–c2`. Es bleiben 21 Fäden.
- **Koordinaten** (Raster 256 × 256, Mitte bei 128/128): `m` (128,128) · `a1` (104,104) · `a2` (152,104) · `a3` (152,152) · `a4` (104,152) · `b1` (81,81) · `b2` (175,81) · `b3` (175,175) · `b4` (81,175) · `c1` (59,59) · `c2` (197,59) · `c3` (197,197) · `c4` (59,197).
- **Lösung:** genau **ein** Weg: c1 → c2 → c3 → c4 → b4 → b1 → b2 → b3 → a3 → a4 → a1 → a2 → m. Er ist eine **Spirale von außen nach innen**. Zufälliges Laufen schafft ihn in etwa **0,45 %** der Fälle.
- **Intro (Spinne):** „Meine Fäden sind empfindlich. Wer zweimal an derselben Stelle steht, bekommt Ärger. Und Netz.“
- **Hinweise:** 1) Die Mitte erreichst du nur über die inneren Knoten, aber nicht von a4 aus, dort ist der Faden gerissen. 2) Läuft man den äußeren Ring ganz ab, bleibt nichts am Rand zurück. 3) Spirale: außen rechts herum, dann der mittlere Ring, dann der innere.
- **Super-Hinweis:** Beginne c1, c2, c3, c4 und steig dann bei c4 zu b4 ab.
- **Lösungstext:** „Eine Spirale von außen nach innen: erst der ganze äußere Ring, dann der mittlere, dann der innere, am Ende die Mitte. Wo die Fäden gerissen sind, zwingt das Netz zu genau diesem Weg.“
- **Haustier:** Tag 14 hat keinen Pflicht-Hinweis, das Haustier kommentiert nur.

## Rätsel `p14a` – Spiegelschrift

- **Engine:** `input` (Text, 6 Buchstaben). Bild `puzzle.p14a`: eine Zeile an der Wand, die als **Spiegelbild** (links/rechts vertauscht) das Wort **QFOEFM** zeigt. Dazu steht ein kleiner Messingspiegel am Bildrand.
- **Zwei Schichten:** 1. Spiegelt man das Bild, liest man QFOEFM. Das ist kein Wort. 2. Isolde schrieb jeden Buchstaben **einen Schritt weiter im Alphabet** (Q statt P, F statt E, O statt N, E statt D, F statt E, M statt L). Zurückgerechnet ergibt sich **PENDEL**.
- **Lösung:** `PENDEL` (Eingabe normalisiert, Groß/Klein egal).
- **Intro (Quill):** „Isolde schrieb für zwei Leser: einen Spiegel und einen, der sie ernst nimmt.“
- **Hinweise:** 1) Halte die Zeile an einen Spiegel oder lies sie von rechts nach links, und jeder Buchstabe ist gespiegelt. 2) Das Wort ergibt keinen Sinn. Isolde schrieb jeden Buchstaben einen Schritt weiter im Alphabet. 3) Q ist P, F ist E. Geh jeden Buchstaben einen Schritt zurück.
- **Super-Hinweis:** Das Wort hat sechs Buchstaben und beginnt mit P. Es gehört zu jeder Uhr.
- **Lösungstext:** „QFOEFM, einen Schritt zurück im Alphabet: PENDEL. Das Pendel ist das Herz jeder Uhr. Und der Ort, an dem Isolde ihr Geheimnis versteckt hat.“

## Setups und Payoffs

| Setup in Tag 14 | Payoff |
| --- | --- |
| `k04` das goldene Zahnrad mit Nr. 12 und Herz | Tag 15w: Knopf wollte es nur ansehen; Tag 16: Maren gibt es zurück; Tag 24: es wird das Scharnier der Tür (Ende A) |
| Die Spinne: „Der Kleine bringt Zimtkekse“ (nur `greet`) | Tag 15w: Newt erklärt, warum Nifflers füttern lassen; Tag 16: Maren gesteht das Backen |
| Hagrids zwölf Löffel und Zahnrad Nr. 12 (Ellis' „zwölf Muster“) | Tag 15w: Die Löffel liegen in Knopfs Bau; Tag 16: alles zurück an Hagrid |
| Aragogs Urenkelin | Tag 24: Sie winkt beim Abschied der Zeitgäste mit vier von acht Beinen |
| Isoldes Spiegelschrift, „PENDEL“ | Tag 22: Pendelkammer, Inschrift CCC (`k10`) |
| Myrte: „seit 1943“ | Tag 19: Myrte ist Teil der Geisterparade (Rätsel `p19`), auch für Spieler ohne Archiv-Route |
| Quill: „Genie und Einsamkeit teilen sich einen Hocker“ | Tag 18: Isoldes Erinnerung im Raum der Wünsche; Tag 22: Quill erzählt, warum sie Rätsel liebt |
