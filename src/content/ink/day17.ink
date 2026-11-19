INCLUDE globals.ink

// Tag 17 – Hogsmeade (Akt III). Ort: hogsmeade. Rätsel: p17.
// Quelle: storyboard/tag-17.md.
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
