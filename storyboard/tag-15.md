# Tag 15 – Was glänzt

> Akt II · Verdacht · **Routentag** (`route`) · Orte `niffler_burrow` (Wald) und `portrait_gallery` (Archiv) · Musik `outdoor` / `castle`

Eine Datei `day15.ink` mit drei Knoten: `day15` verzweigt nach `route`, `day15_forest` und `day15_archive` sind die beiden Wege. Am nächsten Tag (16) treffen sich beide Routen wieder.

| | Wald (`day15_forest`) | Archiv (`day15_archive`) |
| --- | --- | --- |
| **Kurz** | Die Zimtkrümel enden an einer Wurzel. Darunter liegt Knopfs Bau: ein Niffler mit einem Haufen Glänzendem, zwölf Löffeln und einem gelb-schwarzen Wollfaden. Newt Scamander steigt aus seinem Koffer und erklärt, warum Nifflers Sammler sind. | In der Porträtgalerie hängt Sir Aldous als lebender Ritter von 1726. Dumbledores Porträt bietet Zitronenbonbons an und wundert sich laut. Aldous steht selbst vor seinem Bildnis. |
| **Entscheidungen** | `d15w.knopf` (`gentle` / `chase`, Ton) · `d15w.newt` (`stay` / `take`, Ton) | `d15a.aldous` (`ask` +1 `trust_aldous` / `silent`) · `d15a.dumbledore` (`take` / `decline`, Ton) |
| **Hinweis** | `k05` Knopf, der Niffler | `k07` Porträt von 1726 mit Aldous lebend |
| **Cameo** | **Newt Scamander** (Sprecher `newt`), Knopf (Sprecher `knopf`) | **Dumbledore-Porträt** (Sprecher `dumbledore`), Aldous (`aldous`) |
| **Rätsel** | `p15w` Was glänzt? (`tap`, 50 Punkte) | `p15a` Das Porträt (`tap`, 50 Punkte) |
| **Rückbezug** | Tag 13w `lantern` (+1 Funke) · Tag 11 (Hagrids zwölf Löffel) · Tag 14 (Zahnrad Nr. 12) · Tag 8 (Maren, Kekse, Schuppen) | Tag 13a `archive_key` (Abkürzungs-Dialog, +1 Funke) · `k06` („Mein Ritter“) · `k02` (Kälte) |
| **Türchen-Zauber** | Schokotaler regnen vom Wurzelwerk | Schokotaler regnen in den Rahmen und werden von den Porträts aufgefangen |
| **Wörter** | beide Routen zusammen 220–296 gemessen (`content:simulate`) | |

## Beats

**Wald:** 1. Die Spur endet an einem Bau. Der Faden eines gelb-schwarzen Wollschals hängt an der Wurzel. 2. Knopf sitzt im Glitzer. `k05`. **Entscheidung 1:** sanft die Hand ausstrecken oder nach ihm greifen. 3. Newt steigt aus einem Koffer, erklärt Nifflers und die Kekse. **Entscheidung 2:** soll Knopf bei der Freundin bleiben oder mit Newt gehen? 4. Rätsel: unter dem Glitzerhaufen die echten Galleonen finden. 5. Schokotaler regnen. Hagrids zwölf Löffel liegen auch hier.

**Archiv:** 1. Die lange, kalte Galerie. Mit `archive_key` geht es ohne Umweg. 2. Dumbledores Porträt wundert sich laut. **Entscheidung 1:** ein Bonbon nehmen oder höflich ablehnen. 3. Das Ritterporträt von 1726. Aldous tritt davor. **Entscheidung 2:** ihn fragen oder schweigen. 4. Rätsel: fünf Unterschiede zwischen Original und Kopie. 5. `k07`.

## Skript

```ink
INCLUDE globals.ink

// Tag 15 – Was glänzt (Akt II). Routen-Knoten day15_forest / day15_archive [STR-1]. Rätsel: p15w / p15a.
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
- newt: Er hat auch echte Galleonen gesammelt. Zwischen Schokotalern und Löffeln.
newt: Helft ihr mir sortieren?
newt: Eine echte hat alles drei:
newt: goldener Glanz, geriffelter Rand und einen Drachen auf der Vorderseite.
ellis: Zwölf Löffel. Das sind Hagrids. Ich habe nachgezählt. Zweimal. Drei Mal.
# puzzle: p15w
{ last_puzzle_first_try: newt: Vier von vier. Sie haben ein Händchen für Gold. Und für Zurückhaltung. }
{ not last_puzzle_first_try: newt: Fast. Ein Schokotaler hat sich als Galleone verkleidet. Das tun sie gern. }
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
quill: Zwei Bildnisse hängen hier. Das Original von 1726 und eine Kopie aus späterer Zeit.
quill: Jemand hat an der Kopie Dinge verändert. Fünf.
quill: Finde sie, bevor der Lack wieder taut.
# puzzle: p15a
{ last_puzzle_first_try: quill: Fünf von fünf. Man sieht, wie sich Ihr Blick sammelt. }
{ not last_puzzle_first_try: quill: Sie haben einen halben Unterschied übersehen. Das ist nur menschlich. }
# sfx: spark
# clue: k07
quill: Das Band am Arm in Isoldes Farben. Der Uhrenschlüssel am Gürtel. Und das Jahr:
quill: 1726.
quill: Er war ihr Ritter. Und er hat sie nie vergessen.
Schokotaler regnen in die Rahmen.
Die Porträts fangen sie auf und tun, als sei nichts gewesen.
# spark: d15a.s2 40 140
-> END
```

## Rätsel `p15w` – Was glänzt?

- **Engine:** `tap`, Bild `puzzle.p15w.hoard` (256 × 192): ein Haufen aus zwölf Fundstücken in 4 Spalten × 3 Reihen, alle gut erkennbar groß gezeichnet. Der Spieler tippt die **echten Galleonen** an (`maxMarks` 4, „Prüfen“ nach `[PZL-6]`).
- **Regel** (Newts Satz im Dialog): Echt ist, was **alle drei** hat: goldener Glanz, geriffelter Rand und einen Drachen auf der Vorderseite.

| Platz | Fundstück | Glanz | Rand | Wappen | echt? |
| --- | --- | --- | --- | --- | --- |
| c1 | Münze | Gold | glatt | Drache | nein (Rand) |
| c2 | Münze | Gold | geriffelt | Drache | **ja** |
| c3 | Löffel | – | – | – | nein |
| c4 | Schokotaler (Goldfolie) | Gold | glatt | Drache | nein (Rand) |
| c5 | Münze | Gold | geriffelt | Drache | **ja** |
| c6 | Sickel | Silber | geriffelt | Drache | nein (Glanz) |
| c7 | Knopf | Gold | geriffelt | keins | nein (Wappen) |
| c8 | Münze | Gold | geriffelt | Drache | **ja** |
| c9 | Münze | Gold | geriffelt | Greif | nein (Wappen) |
| c10 | Löffel | – | – | – | nein |
| c11 | Münze | Gold | geriffelt | Drache | **ja** |
| c12 | Münze | Messing, stumpf | geriffelt | Drache | nein (Glanz) |

- **Geprüft:** Genau **vier** Stücke erfüllen die Regel (c2, c5, c8, c11). Jede Fälschung verletzt mindestens eine der drei Bedingungen, die meisten genau eine. Wer nur auf Gold achtet, tippt zu viele an.
- **Targets** (Raster, je 56 × 56 mit 6 px Abstand): c2 (68, 6) · c5 (6, 68) · c8 (192, 68) · c11 (130, 130). Alle zwölf Felder sind antippbar, nur diese vier sind richtig.
- **Intro (Newt):** „Er sammelt alles, was glänzt. Das ist keine Eigenschaft. Das ist ein Beruf.“
- **Hinweise:** 1) Echt ist, was alle drei Merkmale hat. Prüfe bei jedem Stück jedes Merkmal einzeln. 2) Gold allein reicht nicht: Ein Schokotaler glänzt auch. 3) Drache, geriffelter Rand und Goldglanz zugleich. Zähl die Münzen, bei denen eins fehlt.
- **Super-Hinweis:** Die echten Galleonen liegen in der ersten Reihe an zweiter Stelle, in der zweiten Reihe links und rechts außen, in der dritten Reihe in der Mitte rechts.
- **Lösungstext:** „Vier echte Galleonen: Gold, geriffelter Rand und Drache. Der Schokotaler hat einen glatten Rand, der Sickel ist silbern, das Messingstück stumpf, der Greif ist kein Drache.“

## Rätsel `p15a` – Das Porträt

- **Engine:** `tap`, Bild `puzzle.p15a.portraits` (256 × 232): oben das **Original** (1726), unten die **Kopie**. Fünf Stellen unterscheiden sich, getippt werden die **Abweichungen auf der Kopie**.
- **Die fünf Unterschiede:**

| Id | Original | Kopie | Bedeutung |
| --- | --- | --- | --- |
| `ribbon` | blaues Band am Schwertarm (Isoldes Farbe) | rotes Band | Isolde schenkte es ihm |
| `key` | Uhrenschlüssel am Gürtel | kein Schlüssel | Er war an die Uhr gebunden |
| `plate` | Messingschild „1726“ | Schild „1826“ | Das Original ist dreihundert Jahre alt |
| `smile` | ein leichtes Lächeln | geschlossener Mund | Er war glücklich |
| `gear` | ein winziges Zahnrad im Schwertgriff | ein glatter Griff | Isoldes Handwerk |

- **Targets** (auf der Kopie, Raster 256 × 232, untere Hälfte ab y 120): `ribbon` (84, 168, 30, 24) · `key` (180, 186, 28, 28) · `plate` (100, 208, 56, 20) · `smile` (116, 148, 24, 14) · `gear` (60, 196, 22, 22). `maxMarks` 5.
- **Intro (Quill):** „Ein Restaurator hat die Kopie geglättet. Wer glättet, nimmt etwas weg. Finde, was.“
- **Hinweise:** 1) Fang mit dem Gesicht an, dann geh nach unten. 2) Zwei der Unterschiede liegen am Gürtel und am Schwertarm. 3) Auch das Schild und der Mund sind anders.
- **Super-Hinweis:** Band, Schlüssel, Schild, Mund und ein Zahnrad im Schwertgriff fehlen oder sind verändert.
- **Lösungstext:** „Band, Schlüssel, Jahr, Lächeln, Zahnrad: Der Restaurator hat alles Persönliche wegretuschiert. Das Original ist 1726 gemalt, der Ritter trägt Isoldes Farbe, den Uhrenschlüssel und ein Zahnrad im Schwertgriff.“

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
