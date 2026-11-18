INCLUDE globals.ink

// Day 1 – Die stehende Uhr (Act I). Location: great_hall. Puzzle: p01.
=== day01 ===
# bg: great_hall
# music: castle
# spark: d01.s1 36 300
Der erste Dezembermorgen in der Großen Halle. Es duftet nach Toast und Zimt.
Und doch ist etwas falsch. Es ist still. Viel zu still.
# show: quill right
quill: Hörst du das? Genau. Nichts. Die Adventsuhr tickt nicht mehr.
quill: Seit 1726 öffnet sie jede Nacht im Dezember ein Türchen. Heute Nacht nicht.
quill: Kein Schnee an der Decke. Keine singenden Rüstungen. Nicht einmal Zimtsterne.
# emote: quill !
quill: Aber gestern, als du hereinkamst, hat sie geschlagen. Ein einziges Mal.
quill: Uhren schlagen nicht ohne Grund. Und Neuankömmlinge kommen nicht ohne Grund.
quill: Henrietta Quill, Rätselkunde und Arithmantik. Ab heute bist du meine Assistenz.
quill: Widerspruch ist zwecklos. Ich habe schon zwei Tassen Tee eingeschenkt.
{ pet == "owl": Deine Eule landet auf Quills Hut und begutachtet den Teelöffel darin. }
{ pet == "cat": Deine Katze streicht um Quills Teekanne. Sie scheint Earl Grey zu mögen. }
{ pet == "toad": Deine Kröte hüpft auf den Tisch und quakt. Quill quakt höflich zurück. }
# show: ellis left
# emote: ellis note
ellis: Professorin! Die Uhr steht! Ist das ein Fall? Bitte sagen Sie, es ist ein Fall!
quill: Ellis Wren. Ravenclaw, sechster Jahrgang. Er redet gern. Sehr gern.
ellis: Das ist üble Nachrede! … Aber zutreffend.
{ house == "ravenclaw": ellis: Du bist auch bei Ravenclaw? Dann sind wir ja quasi Kollegen! }
{ house != "ravenclaw": ellis: {house_name()}, stimmt's? Steht dir. Ich bin trotzdem nett zu dir. }
{ hat_overruled: ellis: Du hast dem Hut widersprochen? Respekt. Ich habe mich nie getraut. }
ellis: Ich habe übrigens Theorien, warum Uhren stehen bleiben. Sieben Stück.
# choice_point: d01.ellis Ellis will seine Uhren-Theorien erzählen.
* [Erzähl mir alle sieben!] # cid: d01.ellis.listen
    ~ bond_ellis += 1
    # toast: Ellis wird sich das merken.
    # emote: ellis heart
    ellis: Wirklich? Endlich hört mir jemand zu! Theorie eins: Zeitmotten.
    ellis: Sie fressen Sekunden. Deshalb fühlen sich Montage auch so lang an.
    quill: Theorie zwei bis sieben hören wir beim Abendessen. Versprochen.
* [Vielleicht später, Ellis.] # cid: d01.ellis.hush
    # emote: ellis sweat
    ellis: Verstehe. Ich schreibe sie auf. Mit Fußnoten. Und farbigen Pfeilen.
- Hinter euch räuspert sich jemand. Die Schulleiterin. # show: thornbury center
Ihr Blick könnte Butterbier gefrieren lassen.
thornbury: Professorin Quill. Ich nehme an, Sie kümmern sich um … das da.
quill: Selbstverständlich, Schulleiterin. Gemeinsam mit meiner neuen Assistenz.
thornbury: Gut. Die Schüler sollen sich keine Sorgen machen. Kein Wort zu irgendjemandem.
# emote: thornbury dots
thornbury: Das gilt auch für Sie, Mr. Wren. Kein. Wort.
# emote: ellis sweat
ellis: Ich bin verschwiegen wie ein Grab. Ein sehr gesprächiges Grab, aber trotzdem.
# choice_point: d01.secret Die Schulleiterin bittet, das Geheimnis zu wahren.
* [Ich passe auf Ellis auf.] # cid: d01.secret.watch
    ~ f_d01_watch = true
    thornbury: Ausgezeichnet. Das ist eine Lebensaufgabe, aber ich glaube an Sie.
    # emote: ellis !
    ellis: Hey!
* [Hogwarts kann sich auf mich verlassen.] # cid: d01.secret.promise
    thornbury: Das hoffe ich. Austauschschüler sind meist für Überraschungen gut.
- Mit wehendem Umhang rauscht die Schulleiterin davon. # hide: thornbury
quill: Nun denn. Theorien sind gut, Beweise sind besser. Seht euch die Zeiger an.
quill: Beide stehen genau übereinander. Auf Mitternacht. Als wollten sie uns etwas sagen.
# emote: quill dots
quill: Das erinnert mich an ein Rätsel, das ich als Schülerin geliebt habe …
# puzzle: p01
{ last_puzzle_first_try: ellis: Beim ersten Versuch! Ich hätte dreimal geraten. Mindestens. }
{ not last_puzzle_first_try: ellis: Uhren sind gemein. Ich hätte die Zeiger einfach gefragt. }
quill: Jedes Rätsel hat eine Lösung, {pronoun_form("meine Liebe", "mein Lieber", "mein Gutes")}.
quill: Und diese Uhr ist das größte Rätsel von allen.
# spark: d01.s2 212 250
Da – ein leises Klicken. Im Uhrkasten springt ein winziges Türchen auf. Leer.
# emote: ellis !
ellis: Habt ihr das gehört? Sie lebt noch!
quill: Das erste Türchen. Leer, aber offen. Morgen nehmen wir uns das nächste vor.
-> END
