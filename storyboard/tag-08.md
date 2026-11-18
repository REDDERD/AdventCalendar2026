# Tag 8 – Das Gewächshaus

> Akt I · Die stehende Uhr · Ort `greenhouse` · Musik `outdoor` · **Ende von Akt I**

| | |
| --- | --- |
| **Kurz** | Im Gewächshaus untersucht die Gruppe Marens Eulendienst. Maren bietet Kekse an, schwitzt dabei und lenkt jedes Mal ab. Aus dem Schuppen raschelt es. Ein Gast aus einer anderen Zeit pflanzt Alraunen um. Und Ellis' vierte Theorie führt ausgerechnet zu etwas Schönem. |
| **Entscheidungen** | `d08.neville` (`help` / `watch`, Ton) · `d08.maren` (`ask` +1 / `leave`, Ton, jeweils `trust_maren`) |
| **Cameo** | **Neville Longbottom** (Gast-Lehrer aus der Zukunft) · mit Kröte als Haustier: **Trevor**-Gag |
| **Rätsel** | `p08` Alraunen (`arrange`, Raster, 40 Punkte) |
| **Rückbezug** | `d07.letter` über `anonymous_letter`: Maren reagiert auf den Brief · `trust_theo` aus `d06.theo`/`d05` (Ellis' Dauerverdacht) |
| **Türchen-Zauber** | Mistelzweige blühen in allen Beeten und singen leise, aber unmelodisch. Die Alraunen tragen Schals |
| **Cliffhanger** | Aus dem Schuppen rollt eine goldene Galleone. Dann ein Quieken. |

## Beats

1. Morgen im Treibhaus. Neville topft Alraunen um (Ohrenschützer, Gequäke). Ellis' Theorie vier: Die Uhr ist ein Setzling.
2. Maren Holloway erscheint, bietet Kekse an und wird mit jedem Satz nervöser. Ein Rascheln im Gartenschuppen.
3. **Entscheidung 1:** Neville beim Umtopfen helfen oder zusehen.
4. Wenn du den anonymen Brief hast, wird Maren bleich: „Das war ich nicht!“
5. **Entscheidung 2:** Maren auf das Rascheln ansprechen oder es lassen.
6. Rätsel: sechs Töpfe so ins Beet stellen, dass Alraunen sich nicht anschreien (kein Topf neben dem anderen, Steine im Weg).
7. Nach dem Rätsel rollt eine Galleone aus dem Schuppen. Maren überspielt es mit Keksen. Quill fasst Akt I zusammen.

## Skript

```ink
INCLUDE globals.ink

// Tag 8 – Das Gewächshaus (Akt I, Ende). Ort: greenhouse. Rätsel: p08.
=== day08 ===
# bg: greenhouse
# music: outdoor
# spark: d08.s1 30 140
Das Gewächshaus. Es ist dampfig, grün und ziemlich laut.
Ein Mann in dicken Ohrenschützern pflanzt kleine, kreischende Wurzeln in Töpfe.
# show: neville center
neville: Entschuldigung! Alraunen! Sie sind heute etwas … ausdrucksstark!
neville: Neville Longbottom. Ich unterrichte Kräuterkunde. Später. Glaube ich.
{ pet == "toad": neville: Moment, ist das Trevor? Nein. Falsche Kröte. Ich suche ihn seit meiner Schulzeit. }
# show: ellis left
# show: quill right
ellis: Ein Zeit-Gast für Pflanzen! Theorie vier: Die Uhr ist ein Setzling.
ellis: Sie wächst nur, wenn man mit ihr redet. Dreihundert Jahre Schweigen, und jetzt: Blattlaus.
neville: Pflanzen reagieren auf Zuspruch. Bei Uhren weiß ich es nicht. Aber ich würde es probieren.
quill: Das merken wir uns. Wir suchen Maren Holloway, Mr. Longbottom. Ist sie hier?
# choice_point: d08.neville Neville muss die Alraunen in neue Töpfe setzen.
* [Beim Umtopfen helfen.] # cid: d08.neville.help
    neville: Danke! Ohrenschützer auf. Jetzt kitzeln wir sie, bis sie ruhig sind.
    # sfx: wrong
    Die Alraune kreischt. Du hörst nichts. Dein Zauberstab vibriert noch eine Minute.
    neville: Ich habe auch einmal etwas Wichtiges verheimlicht. Es wurde nur schlimmer.
* [Lieber zusehen.] # cid: d08.neville.watch
    neville: Verständlich. Es ist ein anstrengendes Hobby. Aber die Alraunen mögen Zuschauer.
- # show: maren center
maren: Hallo! Willkommen! Kekse? Ich habe immer Kekse. Falls jemand traurig wird.
# emote: maren sweat
maren: Ich führe nur den Eulendienstplan. Das ist alles. Gar nichts weiter.
{ items ? anonymous_letter: maren: Dieser Brief … nein. Das war ich nicht! Ich schwöre! Auf alle meine Kekse! }
{ items ? anonymous_letter: quill: Sie haben ihn erkannt, Miss Holloway? }
{ items ? anonymous_letter: maren: Nur das Papier. Es ist Eulenpost-Papier. Es gibt einfach … viel davon. }
{ not (items ? anonymous_letter): quill: Es geht um einen Brief, den ich bekam. Die Eule trug die Nummer 38. }
{ not (items ? anonymous_letter): maren: Das ist die Hauseule. Sie trägt alles. Sie kann nichts dafür. }
# sfx: door
Hinter euch raschelt es. Im Gartenschuppen. Etwas Kleines. Etwas Schnelles.
maren: Wind! Das ist Wind. Oder Mäuse. Oder Mäusewind. Kekse?
# choice_point: d08.maren Aus dem Schuppen raschelt es auffällig.
* [Maren darauf ansprechen.] # cid: d08.maren.ask
    ~ trust_maren += 1
    # toast: Maren wird sich das merken.
    maren: Du fragst, und du schaust mich dabei nett an. Das ist schlimmer als Anschreien.
    maren: Ich kann es dir nicht sagen. Noch nicht. Aber ich lüge nicht. Ich … backe nur viel.
* [Das Rascheln auf sich beruhen lassen.] # cid: d08.maren.leave
    # emote: maren dots
    maren: Danke. Wirklich. Hier, nimm drei Kekse. Sie sind gegen alles.
- quill: Dann lösen wir lieber etwas, das uns sicher gehorcht. Töpfe zum Beispiel.
neville: Alraunen schreien, wenn sie nebeneinanderstehen. Keine zwei Töpfe in Nachbarschaft!
# emote: quill dots
quill: Das erinnert mich an ein Rätsel aus dem Botanischen Garten meiner Kindheit …
# puzzle: p08
{ last_puzzle_first_try: neville: Beim ersten Versuch? Sie haben ein Händchen für Wurzeln! }
{ not last_puzzle_first_try: neville: Eine Alraune hat gemault. Aber sie wird es überstehen. }
# sfx: spark
Mit einem Plopp springt im Beet ein Mistelzweig auf. Er singt. Falsch, aber mit Inbrunst.
# sfx: blip
Dann kullert etwas aus dem Schuppen. Rund. Golden. Es bleibt vor Ellis' Füßen liegen.
# emote: ellis !
ellis: Eine Galleone! Eine echte! Wer lässt eine Galleone im Schuppen liegen?
Aus der Dunkelheit kommt ein winziges Quieken. Maren erstarrt.
maren: Hast du … Hunger? Ich meine: Hast du Hunger? Kekse! Ich hole Kekse!
# hide: maren
quill: Akt eins endet, wie sie meistens enden: Mit mehr Fragen als Antworten.
quill: Ein Notizbuch voller Zahnräder. Ein Brief aus dem Schloss. Ein Schuppen mit Quieken.
quill: Und eine Kälte, die durch Wände geht. Morgen beginnt der Teil, in dem die Leute lügen.
-> END
```

## Rätsel `p08` – Alraunen

> Schwerer als die erste Skizze (DECISIONS.md #44). Umgesetzt in `src/content/puzzles/p08.json` (dort steht bis zur Umsetzung von Tag 8 noch ein Intro von Maren; bei der Umsetzung kommt Nevilles Intro hinein).

- **Engine:** `arrange`, Modus `grid`, **6 × 6-Beet mit 8 Steinen** (dort kann nichts stehen). Sechs Töpfe: in **jeder Reihe und jeder Spalte genau einer**, **keine zwei berühren sich** (auch nicht diagonal). Feld antippen setzt einen Topf, Topf antippen nimmt ihn zurück.
- **Beet** (`#` = Stein): `....#.` · `....##` · `......` · `.##...` · `.##...` · `..#...`
- **Per Backtracking geprüft:** genau **eine** Lösung. Spalten je Reihe von oben nach unten: **6, 3, 5, 1, 4, 2**.
- **Intro (Neville):** „Alraunen sind sehr gesellig, aber nur auf Abstand. Wenn sie nebeneinander stehen, streiten sie.“
- **Hinweise:** 1) Mit der Notiz markieren, wo in jeder Reihe noch Platz ist. 2) In der obersten Reihe steht die Alraune ganz rechts. 3) In der vierten Reihe ganz links.
- **Super-Hinweis:** Die Spalten von oben nach unten: 6, 3, 5, 1, 4, 2.
- **Lösungstext:** „Von oben nach unten in den Spalten 6, 3, 5, 1, 4, 2. Jede andere Anordnung bringt zwei Alraunen zu nah zusammen oder stellt eine auf einen Stein.“

## Akt-I-Bilanz (für die Umsetzung)

| Spur | Stand nach Tag 8 | Wird aufgelöst |
| --- | --- | --- |
| Kratzspuren, Galleone, Quieken | `k01`, Schuppen. Maren verbirgt etwas Kleines | Tag 15w/16 (`knopf`, goldenes Zahnrad) |
| Kälte, Reif, „Ein Freund“ | `k02` (optional), kalter Brief, Eis, das zurückkehrt | Tag 21–23 (`aldous`) |
| Theo, Messingöl, Zahnräder | `k03`, Theo repariert nachts | Tag 13a, 20 |
| Grimsby | Vermisst das Ticken, sagt es nicht | Tag 10 (`k08`) |
| Aldous | Zweimal gesehen, sagt Isolde zu zärtlich | Tag 15a, 17, 19 |

## Setups und Payoffs

| Setup in Tag 8 | Payoff |
| --- | --- |
| Neville: „Ich habe auch einmal etwas verheimlicht. Es wurde nur schlimmer.“ (nur bei `help`) | Tag 16: Maren gesteht. Ellis zitiert ihn |
| Theorie vier: „Die Uhr ist ein Setzling, sie wächst, wenn man mit ihr redet“ | Tag 24: Du sprichst zur Uhr. Sie antwortet mit einem Tick |
| Maren reagiert auf den anonymen Brief (`anonymous_letter`) | Tag 16: Sie wusste, dass er von jemand anderem war; sie hatte Angst, dass es um `knopf` ging |
| Kekse als Stressreaktion | Tag 16: Maren backt für den Ball und gesteht beim Backen |
| Singende Mistel | Tag 17: Sie wird in Hogsmeade als „Schreihals-Zweig“ verkauft |
| Neville und Trevor-Kröte | Tag 24: Zeitgäste kehren zurück. Neville winkt mit einer Kröte, die auffällig Trevor ähnelt |
