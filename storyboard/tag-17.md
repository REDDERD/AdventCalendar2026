# Tag 17 – Hogsmeade

> Akt III · Die letzte Stunde · Ort `hogsmeade` · Musik `outdoor`

| | |
| --- | --- |
| **Kurz** | Thornbury erlaubt einen Ausflug ins Dorf. Im Drei Besen trinkt eine Gruppe aus anderen Zeiten Butterbier, im Scherzladen warten zwei Zwillinge mit einem Spiel, das man nur mit Verstand gewinnt. Am Ende steht ein Geschenk: ein Schal für Ellis oder eine Spieluhr für Aldous. |
| **Entscheidungen** | `d17.treat` (`sweet` / `butterbeer`, Ton) · `d17.gift` (`ellis` → `gift_scarf`, +1 `bond_ellis` / `aldous` → `gift_music_box`, +1 `trust_aldous`) |
| **Gegenstände** | `gift_scarf` **oder** `gift_music_box` (nur eins) |
| **Cameo** | **Madam Rosmerta** (Sprecher `rosmerta`), **Fred und George** (Sprecher `fred`, `george`), Harry und Ron ohne Umhang, Hermine mit Zeitumkehrer-Uhr (nur Erzählzeilen) |
| **Persönlich** | `personal("favoriteSweet")` (Standard „Schokofrosch“) · `personal("insideJoke1")` (Ellis) · `personal("insideJoke2")` (Quill) |
| **Rätsel** | `p17` Knallbonbons (Nim, `custom:nim`, 40 Punkte) |
| **Rückbezug** | Tag 6 (Harry und Ron unter dem Umhang, jetzt ohne) · Tag 4 (Hermine in der falschen Woche) · Tag 15a (das blaue Band) · `bond_ellis` / `trust_aldous` |
| **Türchen-Zauber** | Der Schnee fällt in Bonbonfarben |
| **Wörter** | 268–292 gemessen (`content:simulate`) |

## Beats

1. Die Dorfstraße im Schnee. Ellis mit Taschengeld. Quill: Heute kauft man Geschenke für den, den man sonst vergisst.
2. Im Drei Besen: Rosmerta, Butterbier, Harry und Ron flüstern ohne Umhang über einen Fuß. Hermine mit einer Uhr, die rückwärts läuft. **Entscheidung 1:** etwas Süßes oder ein Butterbier bestellen.
3. Im Scherzladen: Fred und George (der eine aus Freitag, der andere aus Dienstag) fordern zum Nim-Spiel. Rätsel: drei Haufen Knallbonbons, wer das letzte nimmt, gewinnt.
4. Draußen schneit es in Bonbonfarben. Zwei Schaufenster, ein Taschengeld. **Entscheidung 2:** Schal für Ellis oder Spieluhr für Aldous.

## Skript

```ink
INCLUDE globals.ink

// Tag 17 – Hogsmeade (Akt III). Ort: hogsmeade. Rätsel: p17.
=== day17 ===
~ temp joke = personal("insideJoke1")
~ temp joke2 = personal("insideJoke2")
# bg: hogsmeade
# music: outdoor
# spark: d17.s1 40 160
Siebzehnter Dezember. Thornbury hat den Ausflug nach Hogsmeade erlaubt.
Mit Mütze, ohne Umweg.
# show: ellis left
# show: quill right
ellis: Hogsmeade! Zum ersten Mal mit Taschengeld und schlechtem Gewissen!
{ joke != "": ellis: {joke} }
{ joke2 != "": quill: {joke2} }
quill: Heute kaufen wir ein Geschenk. Für den, den man sonst vergisst.
# show: rosmerta center
Im Drei Besen duftet es nach Butterbier und Lebkuchen.
rosmerta: Neue Gesichter und alte Zeiten! Was darf's sein, Schätzchen?
Am Fenstertisch zischen zwei Jungen: „Das war dein Fuß!“ – „Nein, deiner!“
Ohne Umhang sehen sie jünger aus.
Ein Mädchen mit Bücherstapel blickt auf ihre Uhr. Die läuft rückwärts.
„Falsche Woche“, murmelt sie.
# choice_point: d17.treat Rosmerta zückt ihr Tablett.
* [Etwas Süßes bestellen.] # cid: d17.treat.sweet
    rosmerta: Hier. {personal("favoriteSweet")}. Ich habe es dir angesehen, Schätzchen.
* [Ein Butterbier bestellen.] # cid: d17.treat.butterbeer
    Das Butterbier schäumt bis an die Nase.
    Ellis kriegt einen Schnurrbart und hält ihn für eine Entdeckung.
- # hide: rosmerta
Im Scherzladen nebenan liegen Chaos und Zauberkram in den Regalen.
Hinter dem Tresen grinsen zwei Rothaarige.
# show: fred left
# show: george right
fred: Wir sind aus Freitag. Zumindest ich. Er ist aus Dienstag.
george: Das ist hier normal. Wir spielen eine Wette: drei Haufen Knallbonbons.
george: Drei, vier und fünf.
fred: Reihum nimmt man so viele, wie man will, aus einem Haufen.
fred: Wer das letzte nimmt, gewinnt.
george: Du fängst an. Wir sind ja keine Unmenschen.
fred: Und wer verliert, trägt das Bonbon, das singt.
quill: Das erinnert mich an ein Rätsel, bei dem gewinnt, wer weiß, wann er aufhören muss.
# puzzle: p17
{ last_puzzle_first_try: george: Wie?! Fred, hast du gesagt, es ist Glück? Er hat gewonnen. Sofort. }
{ not last_puzzle_first_try: fred: Na also. Beim Mal danach hat es geklappt. Das zählt trotzdem. }
# sfx: spark
Das singende Knallbonbon landet bei Fred. Er trägt es stolz und falsch.
# hide: fred
# hide: george
Draußen schneit es in Bonbonfarben. Rosa, Mint, Zitronengelb.
Ellis schnappt mit dem Mund nach Flocken.
Zwei Schaufenster stehen nebeneinander: Ein Wollladen mit Schals.
Ein Uhrmacher mit Spieluhren.
{ bond_ellis >= 4: ellis: Ich bekomme selten Geschenke. Meistens laminiere ich sie danach. }
quill: Ein Geschenk. Nur eins. Ich helfe beim Tragen, nicht beim Entscheiden.
# choice_point: d17.gift Zwei Schaufenster, ein Taschengeld.
* [Einen Schal für Ellis kaufen.] # cid: d17.gift.ellis
    ~ bond_ellis += 1
    # item: gift_scarf
    # toast: Neuer Gegenstand: Schal für Ellis
    Der Schal ist rot und blau und viel zu lang. Ellis liest das Etikett dreimal.
* [Eine Spieluhr für Aldous kaufen.] # cid: d17.gift.aldous
    ~ trust_aldous += 1
    # item: gift_music_box
    # toast: Neuer Gegenstand: Spieluhr
    Auf der Spieluhr liegt ein blaues Band. Dieselbe Farbe wie an Aldous' Porträt.
- quill: Das Geschenk wartet in deiner Tasche auf den richtigen Moment.
# spark: d17.s2 214 140
-> END
```

## Rätsel `p17` – Knallbonbons (Nim)

> Spezifikation steht in der Bibel, Abschnitt 8. Hier nur die Anwendung für diesen Tag.

- **Engine:** `custom:nim`, Haufen **3, 4, 5** Knallbonbons. Beliebig viele aus **einem** Haufen nehmen, Spieler beginnt, wer das letzte nimmt, gewinnt (Normalspiel).
- **Gegner:** Fred und George spielen perfekt (Gewinnzug, wenn es einen gibt, sonst der kleinste Zug).
- **Per Spielbaum geprüft:** Der Beginnende gewinnt. Es gibt **genau einen Gewinnzug**: den ersten Haufen von 3 auf 1 verkleinern (Nim-Summe 3 ⊕ 4 ⊕ 5 = 2). Zufällige Züge gewinnen nur in etwa 0,7 % der Partien.
- **Intro (George):** „Wir verlieren nie. Wir lassen manchmal gewinnen. Heute eher nicht.“
- **Hinweise:** 1) Der erste Zug entscheidet alles. 2) Schreib die Haufen als Zweierpotenzen: 3 = 2 + 1, 4 = 4, 5 = 4 + 1. Nach deinem Zug soll jede Zweierpotenz gerade oft vorkommen. 3) Nimm zwei Bonbons vom ersten Haufen. Dann bleiben 1, 4 und 5.
- **Super-Hinweis:** Danach spiegelst du jeden Zug der Zwillinge so, dass wieder jede Zweierpotenz gerade oft vorkommt.
- **Lösungstext:** „Erst zwei aus dem ersten Haufen, dann immer so, dass die Nim-Summe null bleibt: 1, 4, 5 sind 1 ⊕ 4 ⊕ 5 = 0. Wer auf null spielt, kann nicht verlieren.“
- **Fehlversuch:** Verliert der Spieler, lachen die Zwillinge, die Haufen stehen wieder bei 3, 4, 5, und es zählt ein Fehlversuch (`[PZL-6]`).

## Setups und Payoffs

| Setup in Tag 17 | Payoff |
| --- | --- |
| `gift_scarf` (+1 `bond_ellis`) | Epilog: bei `bond_ellis ≥ 4` schenkt Ellis seinen Schal zurück. Tag 21: Ellis trägt ihn im Uhrturm |
| `gift_music_box` (+1 `trust_aldous`) | Tag 24: Finale-Szene, die Spieluhr spielt, als Aldous bleibt oder geht (Ende A/B) |
| Das blaue Band an der Spieluhr | Tag 18: Isoldes Erinnerung, dasselbe Band; Tag 24 |
| Harry und Ron: „Fuß“-Streit | Tag 24: Abschied der Zeitgäste, beide winken, der Streit ist nicht entschieden |
| Hermine: „Falsche Woche“ | Tag 22: Auflösung mit Hermine und dem Zeitumkehrer |
| Freds „Aus Freitag“, Georges „aus Dienstag“ | Tag 24: Abschied, die Zwillinge verlieren vor der Tür noch eine Wette |
| `favoriteSweet` und `insideJoke1/2` | Admin pflegt sie bis 27.11. (Konzept Abschnitt 12) |
