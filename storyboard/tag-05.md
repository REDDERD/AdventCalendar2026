# Tag 5 – Der Enteisungstrank

> Akt I · Die stehende Uhr · Ort `potions` · Musik `dungeon`

| | |
| --- | --- |
| **Kurz** | Im Kerker braut die Gruppe einen Enteisungstrank, um den Eisreif an Isoldes Skizze zu lösen. Ein berühmter Tränkemeister aus einer anderen Zeit macht den Unterricht, Theo steht verdächtig nah am Messingöl, und der Duft-Test verrät mehr, als ihm lieb ist. |
| **Entscheidungen** | `d05.slughorn` (`flatter` / `modest`, Ton) · `d05.ingredient` (`accept` +1 `trust_theo` / `decline`, Ton) |
| **Cameo** | **Horace Slughorn** (Gast aus einer anderen Zeit) · ein Porträt von **Snape**, das nichts sagt, aber sehr deutlich |
| **Persönlich** | `personal("amortentiaScents")` (CONCEPT Abschnitt 12, Standard „Zimt, frisches Pergament, Kaminfeuer“) |
| **Rätsel** | `p05` Drei Flaschen (`custom:pour`, 40 Punkte) |
| **Haustier** | Haustier-Hinweis 1 (Kommentar im Skript, Hinweis 1 gratis durch die App, `[PLAN-2]`) |
| **Rückbezug** | Gegenstand `bookmark` aus `d04.help` ändert, wie Theo auf die Skizze reagiert |
| **Türchen-Zauber** | Alle Kessel duften nach Lebkuchen. Der Kerker riecht zum ersten Mal in 300 Jahren gemütlich |

## Beats

1. Der Kerker. Slughorn begrüßt die „neue Assistenz“ wie einen Neuzugang in seiner Sammlung. Theo steht hinten und tut so, als wäre er nicht da.
2. **Entscheidung 1:** Slughorn schmeicheln oder bescheiden bleiben.
3. Duft-Probe mit dem Amortentia-Fläschchen. Du riechst deine persönlichen Düfte. Ellis auch. Theo riecht Öl und Messing und lügt.
4. Theo sieht die Skizze (Tag 4). Mit `bookmark` wird er blass. **Entscheidung 2:** sein Messingöl annehmen oder ablehnen.
5. Das Haustier kommentiert. Rätsel: Zutaten abmessen (14/9/5).
6. Probe: Der Trank taut das Eis. Es kommt zurück. Ellis' Theorie drei: Die Uhr streikt, nach 300 Jahren ohne Urlaub.

## Skript

```ink
INCLUDE globals.ink

// Tag 5 – Der Enteisungstrank (Akt I). Ort: potions. Rätsel: p05.
=== day05 ===
# bg: potions
# music: dungeon
# spark: d05.s1 22 140
Der Zaubertrank-Kerker. Kessel blubbern. Es riecht nach Schwefel und alten Socken.
An der Wand hängt ein Porträt: schwarze Haare, schmale Lippen, ein Naserümpfen.
Es sagt nichts. Es sagt es sehr laut.
# show: quill right
# show: slughorn center
slughorn: Die neue Assistenz! Wie reizend. Ich sammle begabte Menschen, wie andere Briefmarken.
slughorn: Professor Horace Slughorn. Ich unterrichte hier. Oder habe. Oder werde. Zeitformen.
quill: Horace, wir brauchen einen Enteisungstrank. Für Eis, das nicht dorthin gehört.
# show: ellis left
ellis: Er ist übrigens Gast aus … irgendwann. Zeitfransen. Das Wort habe ich selbst erfunden.
quill: Habe ich erfunden, Ellis.
ellis: Wir haben das gemeinsam erfunden. Mit Fußnote.
# choice_point: d05.slughorn Slughorn mustert dich wie ein Sammlerstück.
* [Ihm ein wenig schmeicheln.] # cid: d05.slughorn.flatter
    slughorn: Wunderbar! Charme und Talent! Sie sind für meinen Weihnachtsclub vorgemerkt.
* [Bescheiden bleiben.] # cid: d05.slughorn.modest
    slughorn: Bescheiden! Noch seltener als Talent. Ich bin entzückt.
- slughorn: Zur Auflockerung: eine Duftprobe. Amortentia, der Trank der stärksten Düfte.
quill: Duftkunde, Horace. Keine Herzensangelegenheiten.
slughorn: Natürlich, natürlich. Jeder riecht, was ihn glücklich macht.
Du schnupperst am Fläschchen. Es duftet nach {personal("amortentiaScents")}.
ellis: Bei mir: Tinte, frischer Toast und Theorien. Ich wusste nicht, dass Theorien duften.
# show: theo right
Hinten wird jemand ganz still. Theo Ashcombe hält den Atem an. Zu spät.
Der Trank duftet nach Maschinenöl und warmem Messing.
theo: Kerzenwachs. Es riecht nach Kerzenwachs. Schreibt das auf.
slughorn: Natürlich, mein Junge. Sehr … wachsig.
# emote: theo dots
{ items ? bookmark: Theo sieht das gestickte Lesezeichen in deiner Hand. Sein Gesicht wird weiß. }
{ items ? bookmark: theo: Wo habt ihr das her? Das gehört euch nicht. }
{ items ? bookmark: quill: Es gehörte Isolde Tickwell. Kennen Sie es, Mr. Ashcombe? }
{ items ? bookmark: theo: Nein. Doch. Ich meine: Nein. Sie müssen es wissen. }
{ not (items ? bookmark): theo: Das ist die Skizze von Isolde Tickwell, nicht wahr? Spannende Lektüre. }
theo: Ihr braut gegen Eis. Mit der alten Rezeptur? Die versagt ohne Messingöl.
# choice_point: d05.ingredient Theo bietet an, Messingöl beizusteuern.
* [Das Messingöl annehmen.] # cid: d05.ingredient.accept
    ~ trust_theo += 1
    # toast: Theo wird sich das merken.
    theo: Nur ein Tropfen. Den Rest behalte ich. Aus Prinzip.
* [Wir kommen allein klar.] # cid: d05.ingredient.decline
    theo: Wie ihr wollt. Ich bin nur ein Slytherin mit Messingöl. Nichts weiter.
- # hide: theo
# show: quill right
quill: Dann los. Wir brauchen genau sieben Maß und noch einmal sieben.
{ pet == "owl": Deine Eule sitzt auf dem Kesselrand und schüttelt den Kopf. Dreimal: vierzehn ist zu viel. }
{ pet == "cat": Deine Katze patscht gegen die mittlere Flasche. Sie meint die kleine. Oder die große. }
{ pet == "toad": Deine Kröte quakt bei Zahlen. Bei neun besonders laut. Sie kennt sich aus. }
# emote: quill dots
quill: Das erinnert mich an ein Rätsel aus meiner ersten Brauprüfung …
# puzzle: p05
{ last_puzzle_first_try: slughorn: Makellos! Gleich im ersten Anlauf. Ich merke mir das. }
{ not last_puzzle_first_try: slughorn: Fehler sind das Gewürz der Tränke! Aber nicht zu viel Gewürz. }
Quill tropft die klare Flüssigkeit auf Isoldes Skizze. Der Eisreif knistert und taut.
Dann schiebt sich ein neuer Reif über das Blatt. Schnell, wie ein Atemzug.
# sfx: spark
# emote: ellis !
quill: Das Eis kehrt zurück. Als wollte jemand nicht, dass wir es sehen.
ellis: Theorie drei! Die Uhr streikt! Dreihundert Jahre ohne Urlaub. Nicht einmal Wochenenden!
quill: Eine gewerkschaftlich organisierte Uhr. Gar nicht so unplausibel.
# spark: d05.s2 200 150
-> END
```

## Rätsel `p05` – Drei Flaschen

> Schwerer als die erste Skizze (DECISIONS.md #44). Umgesetzt in `src/content/puzzles/p05.json`.

- **Engine:** `custom:pour` (Umfüllen). Drei Flaschen mit **14, 9 und 5 Maß**. Die große ist randvoll, die anderen leer. Ziel: in der großen und der mittleren je genau **7** Maß, die kleine leer. Umfüllen läuft, bis der Empfänger voll oder der Spender leer ist.
- **Per BFS geprüft:** kürzeste Lösung in **13** Zügen: 14/0/0 → 5/9/0 → 5/4/5 → 10/4/0 → 10/0/4 → 1/9/4 → 1/8/5 → 6/8/0 → 6/3/5 → 11/3/0 → 11/0/3 → 2/9/3 → 2/7/5 → 7/7/0. Man gießt immer nur in eine Kreisrichtung (groß → mittel → klein → groß).
- **Haustier `[PLAN-2]`:** Hinweis 1 ist gratis, das Hinweis-Panel öffnet sich mit einem Satz des Haustiers (`petHint` im Rätsel-JSON).
- **Intro (Quill):** „Der Enteisungstrank braucht zweimal sieben Maß. Und wir haben nur Flaschen, die dafür völlig ungeeignet sind. Wie immer.“
- **Hinweise:** 1) Fülle zuerst die mittlere Flasche (9) aus der großen. 2) Gieß nur in eine Kreisrichtung: groß → mittel, mittel → klein, klein → groß. 3) Nach sechs Zügen stehen 1/8/5 da.
- **Super-Hinweis:** Nach neun Zügen stehen 11/3/0 da. Noch vier Züge.
- **Lösungstext:** „13 Züge, immer im Kreis groß → mittel → klein → groß: 14/0/0, 5/9/0, 5/4/5, 10/4/0, 10/0/4, 1/9/4, 1/8/5, 6/8/0, 6/3/5, 11/3/0, 11/0/3, 2/9/3, 2/7/5, 7/7/0.“

## Setups und Payoffs

| Setup in Tag 5 | Payoff |
| --- | --- |
| Theos Duft: Maschinenöl und Messing | Tag 6 (Theo schleicht zur Uhr, `k03`), Tag 20 (`theo_wrench`) |
| Theo wird blass beim Lesezeichen („Nein. Doch.“) | Tag 13a (er ist Isoldes Nachfahre), Tag 20 |
| Das Eis kehrt zurück | Tag 21 (`k09` Raureif im Uhrwerk: dort wird das Rätsel gelöst) |
| Ellis' Theorie drei (Uhr streikt, 300 Jahre ohne Urlaub) | Tag 22: die „300“ in `k10` macht aus dem Scherz die Wahrheit |
| Slughorns „Weihnachtsclub“ | Tag 16: Er sitzt bei der Tischordnung und freut sich, falls `flatter` |
| Amortentia mit persönlichen Düften | Admin-Konsole pflegt `personal.amortentiaScents` bis 27.11. |
| Snapes Porträt | Tag 23: das Porträt nickt ein einziges Mal, wenn jemand die richtige Anklage ausspricht (Easter Egg) |
