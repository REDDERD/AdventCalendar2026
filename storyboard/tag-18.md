# Tag 18 – Der Raum der Wünsche

> Akt III · Die letzte Stunde · Ort `room_of_requirement` · Musik `castle`

| | |
| --- | --- |
| **Kurz** | Im siebten Stock gibt es eine Wand, die nur erscheint, wenn man nichts sucht. Dahinter erscheint eine Tür, die erst zusammengesetzt werden will. Hinter ihr zeigt der Raum eine Erinnerung: Isolde Tickwell in ihrer Werkstatt, Aldous als junger Ritter, ein Zahnrad mit einer 12 und einem Herz. Am Ende wartet ein Spiegel, der zeigt, was man sich wünscht. |
| **Entscheidungen** | `d18.token` (`use` nur mit `house_token`, Bonus-Szene je Haus / `skip`) · `d18.wish` (`table` / `clock` / `stay`, Ton) |
| **Hinweis (Nachholer, `[DEC-4]`)** | `k07` für alle, die das Porträt von 1726 noch nicht kennen (Archiv-Route hat es schon) |
| **Cameo** | **Dobby** (nur Erzählzeile: ein Socken mit Zettel „D.“) |
| **Persönlich** | `mirrorPhoto` (96 × 72, Standard: Spielfigur mit Ellis und Quill) im Spiegel (Konzept Abschnitt 12, `[PRS-1]`) |
| **Rätsel** | `p18` Die Tür, die erscheint (`slide` 3 × 3, 50 Punkte): **bereits umgesetzt** in `src/content/puzzles/p18.json` |
| **Rückbezug** | `house_token` (Tag 9) · `bond_ellis` · `k04` (die 12 mit Herz) · `k06` („Ein Fremder wird die Stunde schlagen“) · `gift_music_box` (das blaue Band) · `k07` (Tag 15a) |
| **Türchen-Zauber** | Der Raum stellt jedem etwas Warmes hin: einen Becher heiße Schokolade |
| **Wörter** | 321–361 gemessen (`content:simulate`) |

## Beats

1. Die Wand im siebten Stock, Ellis' Sandwich-Wunsch (es kam ein Kamin), Dobbys Socken. Mitten im Raum erscheint eine Tür, die in neun Platten zerfällt.
2. Rätsel: die Tür zusammensetzen.
3. Hinter der Tür: Isoldes Werkstatt, eine Erinnerung. Isolde und der junge Ritter. „Dreihundert Zyklen. Mehr kann ich nicht binden.“ Sie graviert die 12 mit dem Herz. `k07` für alle, die ihn noch nicht haben.
4. **Entscheidung 1:** Wer einen Hausgegenstand hat, kann ihn ziehen: je Haus ein Satz, der auf die dritte Lösung vorausweist. Wer keinen hat, geht weiter.
5. Der Spiegel am Ende des Raums. **Entscheidung 2:** ein Wunsch.
6. Heiße Schokolade für alle.

## Skript

```ink
INCLUDE globals.ink

// Tag 18 – Der Raum der Wünsche (Akt III). Ort: room_of_requirement. Rätsel: p18.
=== day18 ===
# bg: room_of_requirement
# music: castle
# spark: d18.s1 40 160
Achtzehnter Dezember. Im siebten Stock gibt es eine Wand.
Sie erscheint nur, wenn man nichts sucht.
# show: quill right
# show: ellis left
quill: Der Raum der Wünsche. Er gibt, was man braucht. Selten das, was man will.
ellis: Ich habe mir ein Sandwich gewünscht. Es kam ein Kamin.
ellis: Der Raum hat Humor oder Hunger.
In einer Ecke liegt ein einzelner Socken mit Bommel. Auf dem Zettel:
„Für den, der Socken braucht. D.“
{ bond_ellis >= 3: ellis: Bleib bei mir, ja? Räume, die sich ändern, mag ich nur mit Begleitung. }
Mitten im Raum erscheint eine Tür.
Sofort zerfällt sie in neun Platten und lässt eine Lücke.
quill: Das erinnert mich an ein Rätsel aus einer Werkstatt für Türen.
# puzzle: p18
{ last_puzzle_first_try: ellis: Beim ersten Mal! Der Raum ist beeindruckt. Er sagt nur nichts. }
{ not last_puzzle_first_try: quill: Auch Türen brauchen Geduld. Selten auch Ellis, aber das ist anders. }
# sfx: door
Die Tür schwingt auf. Dahinter liegt eine Werkstatt: Messing, Öl, ein Fenster mit Schnee.
Am Tisch feilt eine Frau mit Brille und Schürze an einem Zahnrad. Isolde Tickwell.
Im Türrahmen lehnt ein durchscheinender Ritter in Silber. Sehr jung.
Er hält ein blaues Band.
„Dreihundert Zyklen“, sagt Isolde, ohne aufzusehen. „Mehr kann ich nicht binden.
Es ist ein Anfang.“
„Und danach?“, fragt der Ritter.
„Das weiß ich nicht. Ich konnte dich nur an die Uhr knüpfen.
Vielleicht weiß es jemand besser.“
Sie ritzt eine 12 und ein winziges Herz in das letzte Zahnrad. Dann sieht sie auf.
Direkt zu euch.
„Ein Fremder wird die Stunde schlagen“, sagt sie. „Gebt ihm Zeit.“
Die Erinnerung zerfällt zu Messingstaub.
{ not (clues ? k07):
    # clue: k07
    quill: Dasselbe Gesicht wie auf dem Porträt von 1726. Aldous, als er noch lebte.
}
ellis: Er war so jung. Ich schreibe nichts auf. Das ist neu für mich.
quill: Dreihundert Jahre. Die Uhr ist seine Wache und sein Käfig zugleich.
# choice_point: d18.token Etwas in deiner Tasche summt leise.
* { items ? house_token } [Den Hausgegenstand hervorholen.] # cid: d18.token.use
    { house == "gryffindor": Die Löwenfeder glüht. Eine Stimme ohne Mund: „Mut heißt, Abschied nicht zu verbieten.“ }
    { house == "hufflepuff": Das Honigtöpfchen duftet. „Treue heißt, die Tür offen zu halten.“ }
    { house == "ravenclaw": Die Adlerbrosche summt. „Klugheit heißt, eine dritte Lösung zu suchen.“ }
    { house == "slytherin": Der Glücksstein wird warm. „List heißt, Regeln so zu biegen, dass keiner verliert.“ }
    quill: Der Raum hat zugehört. Manche Räume tun das.
* [Weitergehen.] # cid: d18.token.skip
    Du ziehst die Tasche zu. Der Raum nickt, als hätte er verstanden.
- Am Ende des Raums steht ein hoher Spiegel.
Er zeigt nicht dich, sondern was du dir wünschst.
# photo: mirror
Im Glas siehst du ein Bild aus deinem Leben. Es gehört nur dir.
# choice_point: d18.wish Der Spiegel wartet auf einen Wunsch.
* [Alle Freunde an einem Tisch.] # cid: d18.wish.table
    Im Glas wird es voller und wärmer. Ellis winkt aus dem Spiegel.
    Das ist nicht ganz vernünftig.
* [Dass die Uhr wieder tickt.] # cid: d18.wish.clock
    Im Glas hörst du für einen Atemzug ein Ticken. Dann ist es wieder still. Es war aber da.
* [Dass niemand gehen muss.] # cid: d18.wish.stay
    Der Spiegel wird kurz beschlagen. Dann sagt er nichts mehr. Auch eine Antwort.
- # photo: off
Der Raum stellt jedem einen Becher heiße Schokolade hin. Auf Ellis' steht:
„Für den Laminierer.“
ellis: Der Raum kennt mich. Das ist schlimmer, als ich dachte.
# spark: d18.s2 214 140
-> END
```

## Rätsel `p18` – Die Tür, die erscheint

> **Bereits umgesetzt** (`src/content/puzzles/p18.json`, Entwurf von M4); das Storyboard übernimmt ihn unverändert.

- **Engine:** `slide` 3 × 3, Bild `puzzle.p18.door`, Start `8 3 4 2 0 6 5 7 1`, Ziel `1 2 3 4 5 6 7 8 _`. Kürzester Weg laut `puzzles:verify`: **26 Züge**.
- **Intro (Quill):** „Ein Raum, der erscheint, wenn man ihn braucht. Und eine Tür, die erst gebraucht werden will.“
- **Hinweise:** 1) Bring zuerst die obere Reihe in Ordnung. 2) Die linke Spalte als Nächstes, danach bleiben vier Platten. 3) Die letzten drei kreisen um die Lücke.
- **Super-Hinweis:** Das Fenster liegt anfangs links in der Mitte, die Ecke oben links ganz unten rechts.

## Zusätze für die Umsetzung

- **Tag `# photo: mirror`** (umgesetzt): Über der Szene erscheint ein goldener Spiegel mit dem Bild aus `personal/{uid}.mirrorPhoto` (96 × 72, doppelt groß). Fehlt es, zeigt der Spiegel die Köpfe von Ellis, der Spielfigur und Quill. `# photo: off` (nach dem Wunsch) oder ein neues `# bg` blendet ihn aus.
- **Conditional choice:** `* { items ? house_token } [...]` blendet die Option für Spieler ohne Gegenstand aus. Sie sehen dort nur „Weitergehen“.
- **Bonus-Szene `d18.token`:** Vier einzeilige Sätze, je Haus einer. Sie schicken **Hinweise auf Ende A** mit (offene Tür, dritte Lösung), ohne die Lösung zu verraten.

## Setups und Payoffs

| Setup in Tag 18 | Payoff |
| --- | --- |
| Isolde: „Mehr kann ich nicht binden. Vielleicht weiß es jemand besser.“ | Tag 24: Die dritte Lösung. Ende A |
| Die 12 mit Herz, die Isolde ins letzte Zahnrad ritzt | Tag 21 und 24: Zahnrad Nr. 12 ist das Scharnier der Tür |
| `d18.token` (Haus-Sätze) | Tag 24: Wer hier zugehört hat, erkennt die Idee vom offenen Spalt schneller (Quill sagt: „Ein guter Spiegel wiederholt sich nicht“) |
| „Ein Fremder wird die Stunde schlagen. Gebt ihm Zeit.“ | Tag 24: Quill nennt den Fremden |
| `d18.wish.stay` („Dass niemand gehen muss“) | Tag 24: Aldous erinnert sich an den beschlagenen Spiegel, wenn er die Bindung löst |
| Dobbys Socke | Tag 24: Der Socken hängt am Kamin in der Großen Halle (Zeitgäste gehen, Dobby nicht) |
| `mirrorPhoto` | Admin pflegt es bis 14.12. (Konzept Abschnitt 12) |
