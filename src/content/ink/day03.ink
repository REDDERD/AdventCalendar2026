INCLUDE globals.ink

// Tag 3 – Die wandernden Treppen (Akt I). Ort: staircases. Rätsel: p03.
// Quelle: storyboard/tag-03.md. Das Rätsel hat Einbahntreppen (DECISIONS.md #44):
// Grimsby hat Pfeile gemalt, und die Dame im Porträt verrät bei „fragen“ eine echte Regel.
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
