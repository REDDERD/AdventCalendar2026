INCLUDE globals.ink

// Tag 4 – Die Bibliothek (Akt I). Ort: library. Rätsel: p04.
// Quelle: storyboard/tag-04.md. Anpassungen: Funke ins 256 × 512-Raster; Quill erscheint wieder, nachdem Hermine und Aldous ihren Platz verlassen.
=== day04 ===
# bg: library
# music: castle
# spark: d04.s1 230 130
Die Bibliothek. Es riecht nach Pergament, Staub und gedämpfter Strenge.
# show: quill right
# show: ellis left
# show: pince center
pince: Pssst. Haben Sie da etwa Zimtsterne in der Tasche?
ellis: Nein! Ja. Ich habe sie gerettet! Sie wollten fliegen.
pince: Zimt in Büchern bedeutet Flecken. Flecken bedeuten Kummer. Meinen.
# choice_point: d04.pince Madam Pince bewacht die Bücher mit Argusaugen.
* [Brav flüstern.] # cid: d04.pince.quiet
    pince: Hm. Sie haben Anlagen. Vielleicht keine schlechten.
* [Madam Pince ein Kompliment machen.] # cid: d04.pince.chat
    # emote: pince !
    pince: Mir? Seit Jahren sagt mir niemand etwas Nettes. Außer den Büchern.
    pince: Nehmen Sie, was Sie brauchen. Aber vorsichtig. Und leise. Und sauber.
- # hide: pince
quill: Wir suchen alles über Isolde Tickwell. Sie hat die Adventsuhr gebaut. 1726.
{ clues ? k02: ellis: Und die eiskalte Stelle von gestern? Hat die etwas mit der Uhr zu tun? }
{ not (clues ? k02): ellis: Und warum hat gestern jemand die Treppe eingefroren? }
# show: hermione right
Hinter einem wankenden Bücherturm schwebt ein Mädchen. Sie sieht gehetzt aus.
hermione: Verzeihung! Isolde Tickwell? Seite 412. Fußnote neun. Das zweite Kapitel.
ellis: Du hast „Eine Geschichte von Hogwarts“ gelesen? Freiwillig? Mehrmals?
hermione: Ich habe Anmerkungen gemacht. Mit Lesezeichen. In drei Farben.
# emote: hermione sweat
hermione: Wo bin ich eigentlich? Ich hatte gleich Arithmantik. Vor drei Wochen?
quill: Es ist Dezember, Miss. Aber es ist ein sehr unsicherer Dezember.
hermione: Ach so. Dann danke. Ich muss … irgendwohin. Pünktlich. Davor.
# hide: hermione
# show: quill right
Sie rauscht davon. Der Bücherturm folgt ihr widerwillig.
quill: Das waren die Zeitfransen. Wenn die Adventsuhr steht, leiht sich die Zeit Gäste aus.
ellis: Zeitfransen? Aber das ist Theorie eins! Zeitmotten! Ich hatte recht!
quill: Ich sage nicht, dass Sie recht hatten, Ellis. Ich sage, dass Sie nicht falsch lagen.
ellis: Das reicht mir. Das lasse ich mir in Gold prägen. Oder in Fußnoten.
# sfx: blip
Auf dem obersten Regal steht ein Buch über Tickwell. Ellis klettert hinauf.
# emote: ellis sweat
ellis: Ich hole es! Ich bin ein Mann der Tat! Und dann bin ich ein Mann auf einer Leiter …
Er hängt am Regal, bleich wie Pergament. Unten rutscht die Leiter einen halben Meter.
# choice_point: d04.help Ellis hängt zitternd an der Bibliotheksleiter.
* [Leiter festhalten und zureden.] # cid: d04.help.help
    ~ bond_ellis += 1
    # toast: Ellis wird sich das merken.
    quill: Ruhig atmen. Nicht nach unten sehen. Zählen Sie Bücher.
    ellis: Eins. Zwei. Das sind sehr viele. Ich komme runter. Sofort. Gleich.
    # emote: ellis heart
    Mit eurer Hilfe krabbelt er herab, das Buch im Arm. Er murmelt Theorien vor sich hin.
* [Weiterlesen. Er schafft das.] # cid: d04.help.read
    # item: bookmark
    # toast: Neuer Gegenstand: Lesezeichen der Uhrmacherin
    Du schlägst ein altes Notizbuch auf. Ein gesticktes Lesezeichen fällt heraus.
    Zwei Buchstaben in Goldfaden: „I. & A.“ Dahinter ein winziges Uhrwerk.
    quill: Ellis, eine Minute am Regal genügt als Lektion. Das erledige ich auf meine Art.
    Quill schwenkt den Zauberstab. Ellis segelt sanft zu Boden. Er sagt nichts. Ein Rekord.
- quill: Isoldes Bücher sind falsch einsortiert. Ordnen wir sie, wie sie es getan hat.
# emote: quill dots
quill: Das erinnert mich an ein Rätsel, das ich in der Schule hatte. Mit Tinte auf den Fingern …
# puzzle: p04
{ last_puzzle_first_try: ellis: Du kannst Bücher lesen, ohne sie zu lesen! Das ist Magie. }
{ not last_puzzle_first_try: ellis: Ein Buch hatte sich versteckt. Typisch Bücher. }
# sfx: door
Ein Fach im Regal klappt auf. Darin: ein Zahnrad-Skizzenblatt, Tinte, Eisreif am Rand.
# music: dungeon
Ein kalter Hauch. Neben dem Regal steht ein durchscheinender Ritter mit Federhelm.
# show: aldous right
aldous: Verzeiht mein Eindringen. Sir Aldous Frostbart, Hausgeist dieser Hallen.
# emote: ellis !
ellis: DU hast dich vorgestern vor der Uhr verbeugt! Ich wusste es!
aldous: Es ist Brauch. Man grüßt die Uhr. Sie verdient es.
aldous: Ihr sucht nach Isolde? Ihr … sucht nach Isolde Tickwell. Verzeihung.
# emote: quill ?
aldous: Ich muss … die Halle bewachen. Die Uhr schläft. Und sie schläft nicht gut.
# hide: aldous
# show: quill right
# music: castle
ellis: Hast du gehört, wie er „Isolde“ sagte? So spricht man von jemandem, den man vermisst.
quill: Ein Hausgeist von dreihundert Jahren kennt die Geschichte, Ellis. Das ist alles.
quill: Aber wir sollten uns den Eisreif an der Uhr genauer ansehen. Morgen. Mit Tränken.
-> END
