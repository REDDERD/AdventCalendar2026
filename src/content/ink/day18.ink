INCLUDE globals.ink

// Tag 18 – Der Raum der Wünsche (Akt III). Ort: room_of_requirement. Rätsel: p18.
// Quelle: storyboard/tag-18.md.
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
