INCLUDE globals.ink

// Day 1 – Die stehende Uhr (Act I). Location: great_hall. Puzzle: p01.
=== day01 ===
# bg: great_hall
# music: castle
# show: quill right
# spark: d01.s1 36 30
Morgen in der Großen Halle. Es duftet nach Toast – und es ist seltsam still.
quill: Hörst du das? Genau. Nichts. Die Adventsuhr tickt nicht mehr.
quill: Seit 1726 öffnet sie jede Nacht im Dezember ein Türchen. Heute Nacht nicht.
# emote: quill !
quill: Aber gestern, als du hereinkamst, hat sie geschlagen. Ein einziges Mal.
quill: Ich bin Professorin Quill, Rätselkunde. Und du bist ab heute meine Assistenz.
# show: ellis left
# emote: ellis note
ellis: Professorin! Die Uhr steht! Ist das ein Fall? Bitte sagen Sie, es ist ein Fall!
quill: Ellis Wren. Ravenclaw, sechster Jahrgang. Er redet gern. Sehr gern.
{ house == "ravenclaw": ellis: Du bist auch bei Ravenclaw? Dann sind wir ja quasi Kollegen! }
{ house != "ravenclaw": ellis: {house_name()}, stimmt's? Steht dir. Ich bin trotzdem nett zu dir. }
{ hat_overruled: ellis: Stimmt es, dass du dem Hut widersprochen hast? Respekt! }
ellis: Ich habe übrigens Theorien, warum Uhren stehen bleiben. Sieben Stück.
# choice_point: d01.ellis Ellis will seine Uhren-Theorien erzählen.
* [Erzähl mir alle sieben!] # cid: d01.ellis.listen
    ~ bond_ellis += 1
    # toast: Ellis wird sich das merken.
    # emote: ellis heart
    ellis: Wirklich? Endlich hört mir jemand zu! Theorie eins: Zeitmotten …
    quill: Später, Ellis. Ich verspreche, wir hören alle sieben.
* [Vielleicht später, Ellis.] # cid: d01.ellis.hush
    # emote: ellis sweat
    ellis: Verstehe. Ich schreibe sie auf. Mit Fußnoten.
- quill: Theorien sind gut. Beweise sind besser. Seht euch die Zeiger an.
# emote: quill dots
quill: Das erinnert mich an ein Rätsel, das ich als Schülerin geliebt habe …
# puzzle: p01
{ last_puzzle_first_try: ellis: Beim ersten Versuch! Ich hätte dreimal geraten. Mindestens. }
quill: Jedes Rätsel hat eine Lösung, {pronoun_form("meine Liebe", "mein Lieber", "mein Gutes")}.
quill: Und diese Uhr ist das größte Rätsel von allen. Morgen öffnen wir das erste Türchen.
-> END
