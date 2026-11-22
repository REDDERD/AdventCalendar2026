# Tag 15 – Was glänzt

> Akt II · Verdacht · **Routentag** (`route`) · Orte `niffler_burrow` (Wald) und `portrait_gallery` (Archiv) · Musik `outdoor` / `castle`

Eine Datei `day15.ink` mit drei Knoten: `day15` verzweigt nach `route`, `day15_forest` und `day15_archive` sind die beiden Wege. Am nächsten Tag (16) treffen sich beide Routen wieder.

| | Wald (`day15_forest`) | Archiv (`day15_archive`) |
| --- | --- | --- |
| **Kurz** | Die Zimtkrümel enden an einer Wurzel. Darunter liegt Knopfs Bau: ein Niffler mit einem Haufen Glänzendem, zwölf Löffeln und einem gelb-schwarzen Wollfaden. Newt Scamander steigt aus seinem Koffer und erklärt, warum Nifflers Sammler sind. | In der Porträtgalerie hängt Sir Aldous als lebender Ritter von 1726. Dumbledores Porträt bietet Zitronenbonbons an und wundert sich laut. Aldous steht selbst vor seinem Bildnis. |
| **Entscheidungen** | `d15w.knopf` (`gentle` / `chase`, Ton) · `d15w.newt` (`stay` / `take`, Ton) | `d15a.aldous` (`ask` +1 `trust_aldous` / `silent`) · `d15a.dumbledore` (`take` / `decline`, Ton) |
| **Hinweis** | `k05` Knopf, der Niffler | `k07` Porträt von 1726 mit Aldous lebend |
| **Cameo** | **Newt Scamander** (Sprecher `newt`), Knopf (Sprecher `knopf`) | **Dumbledore-Porträt** (Sprecher `dumbledore`), Aldous (`aldous`) |
| **Rätsel** | `p15w` Die falsche Galleone (`custom:weigh`, 60 Punkte) | `p15a` Das Original (`tap` mit `claims`, 60 Punkte) |
| **Rückbezug** | Tag 13w `lantern` (+1 Funke) · Tag 11 (Hagrids zwölf Löffel) · Tag 14 (Zahnrad Nr. 12) · Tag 8 (Maren, Kekse, Schuppen) | Tag 13a `archive_key` (Abkürzungs-Dialog, +1 Funke) · `k06` („Mein Ritter“) · `k02` (Kälte) |
| **Türchen-Zauber** | Schokotaler regnen vom Wurzelwerk | Schokotaler regnen in den Rahmen und werden von den Porträts aufgefangen |
| **Wörter** | beide Routen zusammen 220–296 gemessen (`content:simulate`) | |

## Beats

**Wald:** 1. Die Spur endet an einem Bau. Der Faden eines gelb-schwarzen Wollschals hängt an der Wurzel. 2. Knopf sitzt im Glitzer. `k05`. **Entscheidung 1:** sanft die Hand ausstrecken oder nach ihm greifen. 3. Newt steigt aus einem Koffer, erklärt Nifflers und die Kekse. **Entscheidung 2:** soll Knopf bei der Freundin bleiben oder mit Newt gehen? 4. Rätsel: neun Galleonen, eine ist ein Schokotaler, zwei Wägungen. 5. Schokotaler regnen. Hagrids zwölf Löffel liegen auch hier.

**Archiv:** 1. Die lange, kalte Galerie. Mit `archive_key` geht es ohne Umweg. 2. Dumbledores Porträt wundert sich laut. **Entscheidung 1:** ein Bonbon nehmen oder höflich ablehnen. 3. Das Ritterporträt von 1726. Aldous tritt davor. **Entscheidung 2:** ihn fragen oder schweigen. 4. Rätsel: acht redende Bildnisse, nur eines ist das Original. 5. `k07`.

## Skript

```ink
INCLUDE globals.ink

// Tag 15 – Was glänzt (Akt II). Routen-Knoten day15_forest / day15_archive [STR-1]. Rätsel: p15w / p15a.
// Quelle: storyboard/tag-15.md. Rätsel: p15w Waage mit neun Galleonen (custom:weigh), p15a acht Porträts, ein Original (tap mit claims).
=== day15 ===
{ route == "archive": -> day15_archive }
-> day15_forest

=== day15_forest ===
# bg: niffler_burrow
# music: outdoor
# spark: d15w.s1 40 150
Fünfzehnter Dezember. Die Zimtkrümel enden an einer dicken Wurzel.
Darunter führt ein Loch in die Erde.
# show: ellis left
ellis: Ein Bau. Ein Bau mit Keksen davor. Ich schreibe: Bau mit Keksen.
ellis: Das ist ein guter Anfang.
{ items ? lantern:
    # spark: d15w.s4 200 250
    Du hältst die Laterne ins Loch. Etwas funkelt zurück. Am Eingang liegt ein Funke.
}
An einem Zweig hängt ein gelb-schwarzer Wollfaden. Ellis nimmt ihn zwischen zwei Finger.
ellis: Gelb und schwarz. Das sind die Farben von … nein. Das kann nicht sein.
ellis: Ich schweige.
Drinnen glitzert es von der Decke bis zum Boden. Knöpfe, Münzen, Löffel, ein Monokel.
Mitten im Haufen sitzt ein kleiner schwarzer Fellball mit Entenschnabel und dicken Backen.
# show: knopf right
knopf: Quiek.
# clue: k05
ellis: Ein Niffler! Ich habe darüber gelesen! Ich habe nie einen gesehen.
ellis: Er ist … so klein!
# choice_point: d15w.knopf Knopf klammert sich an einen goldenen Knopf.
* [Sanft die Hand ausstrecken.] # cid: d15w.knopf.gentle
    Knopf schnuppert, hüpft auf deine Hand und frisst einen Krümel. Er ist weich wie Samt.
* [Nach ihm greifen.] # cid: d15w.knopf.chase
    Knopf quiekt, rollt sich ein und rast zwischen deinen Beinen hindurch. Der Haufen klirrt.
    ellis: Er hat meinen Stift. Den mit dem Radiergummi. Den habe ich noch nie benutzt.
- # show: newt center
Hinter euch rumpelt ein Koffer.
Ein Mann mit Mantel und Sommersprossen steigt aus, als wäre das normal.
newt: Verzeihung! Ich habe ihn eben verloren. Oder gefunden. Die Zeit ist hier rutschig.
newt: Newt Scamander, Magizoologe. Und Nifflers sind keine Diebe. Sie sind Sammler.
newt: Ein Unterschied.
newt: Dieser hier wird gefüttert. Zimt, Haferflocken.
newt: Wer ihn füttert, hat einen warmen Ofen.
# choice_point: d15w.newt Newt streichelt Knopf mit einem Finger.
* [Er soll bei seiner Freundin bleiben.] # cid: d15w.newt.stay
    newt: Das dachte ich auch. Er schaut nicht mich an, wenn er an Kekse denkt.
* [Newt soll ihn mitnehmen.] # cid: d15w.newt.take
    newt: Ich könnte. Aber er sucht jemanden. Das sehe ich an seinen Ohren. Ich lasse ihn.
- newt: Er hat auch Galleonen gesammelt. Neun liegen hier in einer Reihe.
newt: Acht sind aus Gold. Eine ist ein Schokotaler in Goldfolie.
newt: Knopf riecht den Unterschied. Ich nicht.
newt: Meine Waage ist geliehen. Sie klemmt nach zwei Wägungen.
newt: Helft ihr mir?
ellis: Zwölf Löffel. Das sind Hagrids. Ich habe nachgezählt. Zweimal. Drei Mal.
# puzzle: p15w
{ last_puzzle_first_try: newt: Zwei Wägungen und der Schokotaler ist erwischt. Sie denken in Haufen wie ein Niffler. }
{ not last_puzzle_first_try: newt: Der Schokotaler hat sich versteckt. Das tun sie gern. Aber Sie haben ihn gefunden. }
# sfx: spark
Vom Wurzelwerk regnet es Schokotaler. Knopf fängt jeden und schmatzt zufrieden.
ellis: Wenn er sammelt und nicht stiehlt, wer hat das Zahnrad dann hingebracht?
ellis: Oder vergessen?
# spark: d15w.s2 214 140
-> END

=== day15_archive ===
# bg: portrait_gallery
# music: castle
# spark: d15a.s1 206 150
Fünfzehnter Dezember.
Die Galerie der Porträts ist lang, kalt und voller Leute, die zuhören.
# show: quill right
quill: Der Brief sprach von „meinem Ritter“.
quill: Laut Akte hängt sein Bildnis ganz am Ende dieses Gangs.
{ items ? archive_key:
    # spark: d15a.s4 40 240
    Du ziehst den kleinen Archivschlüssel hervor. Ein Seitengitter springt auf.
    Das spart vierzig Minuten.
    quill: Ein Schlüssel, der Zeit schenkt. Isolde hätte ihn gemocht.
}
# show: dumbledore left
dumbledore: Guten Abend. Zitronenbonbon? Ich habe sie schon seit längerer Zeit.
dumbledore: Also seit immer.
dumbledore: Ich gebe nie Rat. Ich wundere mich nur laut. Zum Beispiel:
dumbledore: Warum friert eine Uhr, die nirgends kalt ist?
# choice_point: d15a.dumbledore Das Porträt hält dir ein Bonbon entgegen.
* [Ein Zitronenbonbon nehmen.] # cid: d15a.dumbledore.take
    Es schmeckt nach Sonne.
    Das Porträt zwinkert so freundlich, dass dir fast ein Gedanke kommt.
* [Höflich ablehnen.] # cid: d15a.dumbledore.decline
    dumbledore: Gut. Ablehnen ist auch eine Antwort. Meistens sogar die ehrlichste.
- # hide: dumbledore
Am Ende des Gangs hängt ein Ritter in Silber. Mit gerader Nase und unruhigen Augen. 1726.
# show: aldous center
Davor steht, durchscheinend und sehr gerade, Sir Aldous Frostbart.
Er sieht sich selbst an.
aldous: Fürwahr. So sah ich aus. Ich weiß nicht, ob ich ihn vermisse. Oder ob er mich.
# choice_point: d15a.aldous Aldous betrachtet sein gemaltes Gesicht.
* [Ihn nach dem Ritter fragen.] # cid: d15a.aldous.ask
    ~ trust_aldous += 1
    # toast: Aldous wird sich das merken.
    aldous: Er war jung und hat geglaubt, dass Bleiben ein Verdienst ist.
    aldous: Gestattet, ich gehe nun.
* [Schweigen und warten.] # cid: d15a.aldous.silent
    Aldous verbeugt sich knapp. Er wirkt erleichtert. Und ein wenig enttäuscht.
- # hide: aldous
Ein Hauch Frost bleibt am Rahmen zurück. Der Lack knistert leise.
quill: Acht Bildnisse des Ritters hängen hier. Nur eines ist von 1726.
quill: Die Rahmen sprechen. Das Original sagt immer die Wahrheit, jede Kopie lügt.
quill: Wer lügt, sagt etwas Falsches. Man muss es nur umdrehen.
# puzzle: p15a
{ last_puzzle_first_try: quill: Bild sieben. Beim ersten Versuch. Man sieht, wie sich Ihr Blick sammelt. }
{ not last_puzzle_first_try: quill: Ein Irrtum auf dem Weg zum Original. Das ist nur menschlich. }
# sfx: spark
Das siebte Bildnis tritt im Rahmen vor. Die anderen sieben verstummen.
# clue: k07
quill: Das Band am Arm in Isoldes Farben. Der Uhrenschlüssel am Gürtel. Und das Jahr:
quill: 1726.
quill: Er war ihr Ritter. Und er hat sie nie vergessen.
Schokotaler regnen in die Rahmen.
Die Porträts fangen sie auf und tun, als sei nichts gewesen.
# spark: d15a.s2 40 140
-> END
```

## Rätsel `p15w` – Die falsche Galleone

Ersetzt am 22.11.2026 das Antipp-Rätsel „Was glänzt?“ (zu leicht, DECISIONS #44 und #71). Layton-Klassiker mit der Waage.

- **Engine:** `custom:weigh`. Neun Galleonen sehen gleich aus, eine ist Newts Schokotaler in Goldfolie und damit leichter. Die Waage klemmt nach **zwei Wägungen**. In beiden Schalen müssen gleich viele Münzen liegen. Danach nennt man den Schokotaler („Benennen“).
- **Bedienung:** Eine Münze antippen setzt sie von der Ablage nach links, dann nach rechts, dann zurück. „Wiegen“ lässt den Balken kippen (die leichtere Schale geht hoch), „Abräumen“ leert die Schalen. Unter der Waage steht ein Protokoll der Wägungen.
- **Fairness:** Der Schokotaler steht nicht vorab fest. Die Waage antwortet so, dass möglichst viele Münzen verdächtig bleiben (bei Gleichstand: Gleichgewicht, dann links, dann rechts). Wer rät, verliert; eine falsch benannte Münze zählt als Fehlversuch und die Waage setzt sich zurück.
- **Lösung:** Erst 3 gegen 3. Kippt es, liegt der Schokotaler in der leichteren Schale, bleibt es gerade, unter den drei übrigen. Dann 1 gegen 1 aus der verdächtigen Gruppe. Der einzige sichere erste Zug ist 3 gegen 3 (`solution: [3, 3]`); `puzzles:verify` beweist per Suche, dass zwei Wägungen reichen und eine weniger nicht.
- **Bilder:** `puzzle.coin` (48 × 48), `puzzle.scale.stand`, `puzzle.scale.beam`, `puzzle.scale.pan`, gezeichnet in `scripts/draw-sprites.ts`.
- **Intro (Newt):** „Gold ist schwer. Schokolade nicht. Das ist der ganze Trick.“
- **Hinweise:** 1) Nicht jede Münze einzeln wiegen; auch „Gleichgewicht“ verrät etwas. 2) Drei Haufen zu drei, zwei kommen auf die Waage. 3) Drei gegen drei, dann zwei der drei verdächtigen gegeneinander.
- **Lösungstext:** Jede Wägung kennt drei Ausgänge (links leichter, rechts leichter, gleich), also reichen zwei Wägungen für neun Münzen.

## Rätsel `p15a` – Das Original

Ersetzt am 22.11.2026 das Rätsel „Das Porträt“ (fünf Unterschiede, zu leicht). Layton-Klassiker mit Wahrheitssagern und Lügnern.

- **Engine:** `tap` mit dem neuen Feld `claims`. Bild `puzzle.p15a` (256 × 232): acht gleich aussehende Bildnisse des Ritters, 4 × 2, nummeriert 1 bis 8 (erst die obere Reihe, dann die untere). Getippt wird das **Original**.
- **Regel:** Genau ein Bildnis ist das Original von 1726 und sagt immer die Wahrheit. Jede Kopie sagt immer etwas Falsches. Die acht Aussagen stehen auf der „Karte“ (`clues`) und sind in `claims.statements` maschinenlesbar hinterlegt. Daraus erzeugt `portraitClaims.ts` den Text. `puzzles:verify` prüft, dass der Kartentext zur Regel passt und genau ein Bild möglich ist.
- **Aussagen** (das Original ist Bild 7):
  1. Das Original ist Bild 4 oder Bild 8.
  2. Das Original hängt in der oberen Reihe.
  3. Bild 2 und Bild 7 sind Kopien.
  4. Das Original hängt weiter links als Bild 2.
  5. Das Original hängt direkt neben mir.
  6. Das Original ist Bild 3 oder Bild 8.
  7. Das Original hängt weiter rechts als Bild 1.
  8. Bild 2 ist das Original.
- **Weg zur Lösung:** Bild 8 kann nicht stimmen (wäre es das Original, wäre es auch Bild 2), also ist Bild 2 eine Kopie und seine Aussage falsch: Das Original hängt unten. Damit lügt auch Bild 3, und weil Bild 2 keines ist, bleibt nur Bild 7. Jede falsche Annahme widerspricht mindestens zwei Aussagen.
- **Targets:** Je Bildnis 56 × 100 (`b1` bis `b8`), `maxMarks` 3, damit die Zahl der Lösungen nicht verraten wird.
- **Intro (Quill):** „Ein Bild, das immer die Wahrheit sagt, ist selten. Ein Bild, das immer lügt, ist ein Gewinn: Man muss nur umdrehen, was es sagt.“
- **Hinweise:** 1) Annahme „Bild X ist das Original“ prüfen, mit einem Bild anfangen, dessen Aussage sich selbst verrät. 2) Bild 8 lügt, Bild 2 ist eine Kopie. 3) Das Original hängt nicht oben, also lügt Bild 3.
- **Nach dem Rätsel:** Das siebte Bildnis tritt vor und die anderen verstummen. Quill nennt, was das Original zeigt: das Band in Isoldes Farben, den Uhrenschlüssel, das Jahr 1726 (`k07`).

## Setups und Payoffs

| Setup in Tag 15 | Payoff |
| --- | --- |
| `k05` Knopf, der Niffler (Newt: „Sammler, keine Diebe“) | Tag 16: Maren gesteht. Epilog: `maren_covered` → Knopf wird Schul-Niffler |
| Gelb-schwarzer Wollfaden an der Wurzel | Tag 16: Marens Hufflepuff-Schal hat ein Loch |
| Hagrids zwölf Löffel in Knopfs Bau | Tag 16: Hagrid bekommt sie zurück; Tag 24: Knopf überreicht dir das zwölfte Zahnrad |
| Newt: „Er sucht jemanden“ | Tag 24: Knopf sitzt auf Marens Schulter beim Abschied der Zeitgäste; Newt tippt an den Hut |
| `k07` Porträt von 1726, Band in Isoldes Farbe | Tag 17: Das Band in der Spieluhr (`gift_music_box`); Tag 18: Isoldes Erinnerung; Tag 23: Beweis gegen `aldous` |
| Aldous: „Bleiben als Verdienst“ (`ask`) | Tag 19: Die Graue Dame widerspricht ihm; Tag 24: Ende A |
| Dumbledore: „Warum friert eine Uhr, die nirgends kalt ist?“ | Tag 21: Raureif im Uhrwerk; Tag 22: Ellis' siebte Theorie |
| `archive_key` | Tag 21: Quill erwähnt, dass Theo auch einen Schlüssel hatte |
