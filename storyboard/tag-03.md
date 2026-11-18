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
4. Ein Porträt kennt den Treppenplan. **Entscheidung 2:** fragen (die Dame verrät eine echte Regel fürs Rätsel) oder nach Gefühl gehen.
5. Rätsel: alle Treppen genau einmal, manche nur in eine Richtung (Grimsby hat Pfeile gemalt), dann in den 7. Stock.
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
    Die Dame sagt, ohne aufzusehen: „Vom Zweiten in den Ersten. Nie umgekehrt.“
    „Und im Siebten klopft man zweimal.“ Der Pudel gähnt. Er hat das schon oft gehört.
* [Nach Gefühl gehen.] # cid: d03.portrait.guess
    # emote: ellis note
    ellis: Mein Gefühl sagt links! Wobei mein Gefühl auch Pudding bestellt hat.
    Die Dame im Bild schnaubt. Der Pudel kläfft. Beide haben Meinungen.
- quill: Dann wollen wir den Treppen mal zeigen, dass wir ihre Wege respektieren.
quill: Mr. Grimsby hat Pfeile ans Geländer gemalt. Manche fahren heute nur in eine Richtung.
# emote: quill dots
quill: Das erinnert mich an ein Rätsel, das ich mit sieben auf einem Bierdeckel löste …
# puzzle: p03
{ last_puzzle_first_try: ellis: Keine einzige Treppe beleidigt! Hortensia wäre stolz. }
{ not last_puzzle_first_try: ellis: Eine Treppe hat gemault. Ich habe mich entschuldigt. }
# sfx: spark
Alle Treppen stehen still, zum ersten Mal heute. Eine beginnt leise zu summen.
# bg: staircases
# show: quill right
# show: ellis left
# spark: d03.s2 220 160
Im siebten Stock endet der Weg vor einer schweren Tür. Ein Zettel klebt daran.
quill: „Zutritt zum Uhrturm verboten. Auch für Sie, Henrietta. Thornbury.“
# emote: quill !
ellis: Sie hat Ihren Vornamen benutzt. Das ist ernst.
quill: Dann brauchen wir einen Schlüssel. Oder eine Ausrede. Ich besitze beides nicht.
quill: Aber ich kenne jemanden, der alles über den Uhrmacher weiß: die Bibliothek.
-> END
```

## Rätsel `p03` – Die Treppen

> Schwerer als die erste Skizze (DECISIONS.md #44). Umgesetzt in `src/content/puzzles/p03.json`.

- **Engine:** `path`. Sieben Stockwerke und ein Absatz **A** als Punkte, **13 Treppen**, davon **6 Einbahntreppen** (Pfeil). Man zieht eine Linie von Stockwerk 1 in den 7. Stock und benutzt **jede Treppe genau einmal**, Pfeiltreppen nur in Pfeilrichtung.
- **Karte:** 1→4, 1→A, 1–2, 2–3, 2–4, 2–A, A→3, A→5, A–4, A–7, 6→4, 7→6, 5–7 (→ = Einbahn).
- **Geprüft:** 28 gültige Wege, aber nur etwa 6 % aller zufällig gezogenen Wege kommen an. In **allen** gültigen Wegen gilt: Die Treppe 1–2 wird nur abwärts genommen (2 → 1), der 7. Stock wird zweimal besucht, der Absatz A dreimal.
- **Rückbezug im Skript:** Wer das Porträt fragt, hört „Vom Zweiten in den Ersten. Nie umgekehrt. Und im Siebten klopft man zweimal.“ – zwei dieser Regeln.
- **Intro (Quill):** „Eine Treppe, die man auslässt, trägt es einem nach. Nehmt sie alle, und zwar nur einmal.“
- **Hinweise:** 1) Wer sich festläuft, darf zurück: auf den vorigen Punkt tippen. 2) Der 7. Stock ist nicht nur das Ziel, man kommt unterwegs schon einmal vorbei. 3) Die Treppe 1–2 nur abwärts, und A wird dreimal besucht.
- **Super-Hinweis:** Beginne mit 1 → 4 → A → 7 → 6.
- **Lösungstext:** „Zum Beispiel 1, 4, A, 7, 6, 4, 2, A, 3, 2, 1, A, 5, 7. Der Trick: Der 7. Stock ist auch ein Umsteigebahnhof, und der Absatz A wird dreimal besucht.“

## Setups und Payoffs

| Setup in Tag 3 | Payoff |
| --- | --- |
| Ellis hat Höhenangst („Ich mag Treppen nur nicht, wenn sie hoch sind“) | Tag 12 (Astronomieturm), Tag 21 (Uhrturm: Ellis klettert) |
| Wandernde Kälte, verschwindet durch eine Wand (`k02`) | Tag 4 (Aldous wird eingeführt), Tag 15a, Tag 21 |
| Grimsbys Zettel (hängt von `d02.grimsby` ab) | Tag 10 |
| Verschlossene Uhrturm-Tür, Thornburys Zettel | Tag 21: Quill öffnet das Schloss mit ihrem Teelöffel (Hutnadel). Ausrede inklusive |
| Ellis' Cousine Hortensia | Wiederkehrender Gag; Tag 22 (Epilog-Gag: Hortensia schreibt) |
