# Tag 3 – Die wandernden Treppen

> Akt I · Die stehende Uhr · Ort `staircases` · Musik `castle`

| | |
| --- | --- |
| **Kurz** | Der Weg zum Uhrturm führt über Treppen, die beleidigt sind, wenn man sie auslässt. Mitten im Treppenhaus wandert eine eiskalte Stelle. Oben wartet eine verschlossene Tür mit einem Zettel der Schulleiterin. |
| **Entscheidungen** | `d03.cold` (`inspect` → `k02` / `follow` +1 `bond_ellis`) · `d03.portrait` (`ask` / `guess`, Ton) |
| **Hinweis** | `k02` Eiskalte Stelle (nur bei `inspect`) |
| **Cameo** | keins (bewusst ein ruhiger Tag; die Porträts sind eigene Figuren) |
| **Rätsel** | `p03` Die Treppen (`path`, 30 Punkte) |
| **Rückbezug** | `d02.grimsby` über `trust_grimsby`: Grimsby hat einen Zettel an den Treppenpfosten geklebt, dessen Ton davon abhängt |
| **Türchen-Zauber** | Die Treppen halten eine Minute lang still und schaukeln dabei im Takt eines Weihnachtslieds |

## Beats

1. Ellis erklärt, dass Treppen beleidigt sein können (Cousine Hortensia). Grimsbys Zettel am Pfosten.
2. Die Treppe schwingt ins Leere. Ellis' Höhenangst taucht zum ersten Mal auf (Setup für Tag 12 und Tag 21).
3. Eine eiskalte Stelle wandert das Geländer entlang. **Entscheidung 1:** untersuchen (→ `k02`) oder hinterherrennen (→ Bindung).
4. Ein Porträt kennt den Treppenplan. **Entscheidung 2:** fragen oder nach Gefühl gehen.
5. Rätsel: alle Treppen genau einmal, dann in den 7. Stock.
6. Oben: Tür zum Uhrturm zu. Zettel von Thornbury: „Auch für Sie, Henrietta.“ Quill braucht einen Schlüssel oder eine Ausrede.

## Skript

```ink
INCLUDE globals.ink

// Tag 3 – Die wandernden Treppen (Akt I). Ort: staircases. Rätsel: p03.
=== day03 ===
# bg: staircases
# music: castle
# spark: d03.s1 30 150
Der Weg zum Uhrturm führt über die Wandernden Treppen. Heute wandern sie besonders gern.
# show: quill right
# show: ellis left
quill: Wichtigste Regel: Jede Treppe genau einmal nehmen. Sonst sind sie beleidigt.
ellis: Beleidigte Treppen? Wie meine Cousine Hortensia! Die schweigt mich seit Jahren an.
quill: Was haben Sie ihr getan?
ellis: Ich habe ihr meine Theorien erklärt. Alle sieben. Ohne Pause.
{ trust_grimsby >= 1: Am Treppenpfosten klebt ein Zettel in krakeliger Schrift: „Dritte Stufe knarzt. G.“ }
{ trust_grimsby <= -1: Am Treppenpfosten klebt ein Zettel in krakeliger Schrift: „Für Frechdachse keine Hilfe. G.“ }
{ trust_grimsby == 0: Am Treppenpfosten klebt ein Zettel in krakeliger Schrift: „Bitte nicht streicheln. G.“ }
quill: Mr. Grimsby kümmert sich sogar um die Treppen. Wer hätte das gedacht.
# sfx: door
Plötzlich rumpelt es. Die Treppe unter euren Füßen schwingt hinaus ins Leere.
# emote: ellis sweat
ellis: Ich liebe Treppen. Ich mag sie nur nicht, wenn sie hoch sind. Oder wenn sie sich bewegen.
quill: Ellis, Sie wohnen im Ravenclaw-Turm.
ellis: Ich gehe nachts mit geschlossenen Augen. Und mit Gesang. Das beruhigt mich.
# music: dungeon
Da wird es kalt. Euer Atem zieht in weißen Wölkchen davon.
Das Geländer überzieht sich mit Raureif, an genau einer Stelle. Und die Stelle wandert.
# emote: ellis !
ellis: Eine Kälte, die allein spazieren geht! Das ist Theorie … ach, das ist eine neue!
# choice_point: d03.cold Auf der Treppe wandert eine eiskalte Stelle.
* [Die Kälte genau untersuchen.] # cid: d03.cold.inspect
    # clue: k02
    quill: Eiskalt, mitten im Schloss, bei geschlossenen Fenstern. Das merken wir uns.
    quill: Ich mag Dinge, die nicht dorthin passen, wo sie gerade sind.
* [Der Kälte hinterherrennen.] # cid: d03.cold.follow
    ~ bond_ellis += 1
    # toast: Ellis wird sich das merken.
    # emote: ellis heart
    ellis: Ein Wettlauf mit einem Luftzug! Das wollte ich schon immer!
    Ihr rennt über drei Treppen, bis die Kälte in einer Wand verschwindet.
    quill: Luftzüge dürfen Wände nicht durchqueren. Eigentlich. Interessant.
- # music: castle
Die Treppen drehen sich weiter. Vor euch hängt ein Gemälde: eine Dame mit einem Pudel.
# choice_point: d03.portrait Eine Dame im Porträt kennt den Treppenplan.
* [Das Bild nach dem Weg fragen.] # cid: d03.portrait.ask
    Die Dame sagt, ohne aufzusehen: „Immer links, dreimal rauf, dann beten.“
    Der Pudel auf ihrem Schoß gähnt. Er hat das schon oft gehört.
* [Nach Gefühl gehen.] # cid: d03.portrait.guess
    # emote: ellis note
    ellis: Mein Gefühl sagt links! Wobei mein Gefühl auch Pudding bestellt hat.
    Die Dame im Bild schnaubt. Der Pudel kläfft. Beide haben Meinungen.
- quill: Dann wollen wir den Treppen mal zeigen, dass wir ihre Wege respektieren.
# emote: quill dots
quill: Das erinnert mich an ein Rätsel, das ich mit sieben auf einem Bierdeckel löste …
# puzzle: p03
{ last_puzzle_first_try: ellis: Keine einzige Treppe beleidigt! Hortensia wäre stolz. }
{ not last_puzzle_first_try: ellis: Eine Treppe hat gemault. Ich habe mich entschuldigt. }
# sfx: spark
Alle Treppen stehen still, zum ersten Mal heute. Eine beginnt leise zu summen.
# bg: staircases
# spark: d03.s2 220 90
Im siebten Stock endet der Weg vor einer schweren Tür. Ein Zettel klebt daran.
quill: „Zutritt zum Uhrturm verboten. Auch für Sie, Henrietta. Thornbury.“
# emote: quill !
ellis: Sie hat Ihren Vornamen benutzt. Das ist ernst.
quill: Dann brauchen wir einen Schlüssel. Oder eine Ausrede. Ich besitze beides nicht.
quill: Aber ich kenne jemanden, der alles über den Uhrmacher weiß: die Bibliothek.
-> END
```

## Rätsel `p03` – Die Treppen

- **Engine:** `path`. Sieben Stockwerke als Punkte, neun Treppen als Linien. Man zieht eine Linie von Stockwerk 1 zu Stockwerk 7 und benutzt dabei **jede Treppe genau einmal** (Euler-Pfad). Gerade Stockwerke werden mehrfach besucht.
- **Karte (Vorschlag):** 1–2, 1–5, 1–7, 2–6, 3–5, 3–6, 4–5, 4–6, 5–6. Nur die Stockwerke 1 und 7 haben eine ungerade Anzahl Treppen, deshalb ist ein solcher Weg von 1 nach 7 möglich. Per Brute-Force: 12 gültige Wege, z. B. 1 → 5 → 3 → 6 → 5 → 4 → 6 → 2 → 1 → 7.
- **Falle:** Der direkte Weg 1 → 7 ist kein Treffer, denn er lässt sieben Treppen aus. Das ist der Aha-Moment.
- **Intro (Quill):** „Eine Treppe, die man auslässt, trägt es einem nach. Nehmt sie alle, und zwar nur einmal.“
- **Hinweise:** 1) Die Treppe 1–7 geht nicht zuerst. 2) Welche Stockwerke haben eine ungerade Zahl an Treppen? 3) Ein Weg, der in 1 oder 7 begonnen oder beendet wird, muss die Treppe 1–7 als letzte nehmen.
- **Super-Hinweis:** Beginne mit 1 → 5.
- **Lösungstext:** „Nur in den Stockwerken 1 und 7 hängen drei Treppen zusammen. Alle anderen haben gerade viele. Also müsst ihr dort beginnen und dort aufhören.“

## Setups und Payoffs

| Setup in Tag 3 | Payoff |
| --- | --- |
| Ellis hat Höhenangst („Ich mag Treppen nur nicht, wenn sie hoch sind“) | Tag 12 (Astronomieturm), Tag 21 (Uhrturm: Ellis klettert) |
| Wandernde Kälte, verschwindet durch eine Wand (`k02`) | Tag 4 (Aldous wird eingeführt), Tag 15a, Tag 21 |
| Grimsbys Zettel (hängt von `d02.grimsby` ab) | Tag 10 |
| Verschlossene Uhrturm-Tür, Thornburys Zettel | Tag 21: Quill hat am Ende doch einen Schlüssel (von Theo?) |
| Ellis' Cousine Hortensia | Wiederkehrender Gag; Tag 22 (Epilog-Gag: Hortensia schreibt) |
