INCLUDE globals.ink

// Tag 8 – Das Gewächshaus (Akt I, Ende). Ort: greenhouse. Rätsel: p08.
// Quelle: storyboard/tag-08.md. Anpassungen: Funke ins 256 × 512-Raster. Rätsel p08 auf 6 × 6 mit Steinen.
=== day08 ===
# bg: greenhouse
# music: outdoor
# spark: d08.s1 30 140
Das Gewächshaus. Es ist dampfig, grün und ziemlich laut.
Ein Mann in dicken Ohrenschützern pflanzt kleine, kreischende Wurzeln in Töpfe.
# show: neville center
neville: Entschuldigung! Alraunen! Sie sind heute etwas … ausdrucksstark!
neville: Neville Longbottom. Ich unterrichte Kräuterkunde. Später. Glaube ich.
{ pet == "toad": neville: Moment, ist das Trevor? Nein. Falsche Kröte. Ich suche ihn seit meiner Schulzeit. }
# show: ellis left
# show: quill right
ellis: Ein Zeit-Gast für Pflanzen! Theorie vier: Die Uhr ist ein Setzling.
ellis: Sie wächst nur, wenn man mit ihr redet. Dreihundert Jahre Schweigen, und jetzt: Blattlaus.
neville: Pflanzen reagieren auf Zuspruch. Bei Uhren weiß ich es nicht. Aber ich würde es probieren.
quill: Das merken wir uns. Wir suchen Maren Holloway, Mr. Longbottom. Ist sie hier?
# choice_point: d08.neville Neville muss die Alraunen in neue Töpfe setzen.
* [Beim Umtopfen helfen.] # cid: d08.neville.help
    neville: Danke! Ohrenschützer auf. Jetzt kitzeln wir sie, bis sie ruhig sind.
    # sfx: wrong
    Die Alraune kreischt. Du hörst nichts. Dein Zauberstab vibriert noch eine Minute.
    neville: Ich habe auch einmal etwas Wichtiges verheimlicht. Es wurde nur schlimmer.
* [Lieber zusehen.] # cid: d08.neville.watch
    neville: Verständlich. Es ist ein anstrengendes Hobby. Aber die Alraunen mögen Zuschauer.
- # show: maren center
maren: Hallo! Willkommen! Kekse? Ich habe immer Kekse. Falls jemand traurig wird.
# emote: maren sweat
maren: Ich führe nur den Eulendienstplan. Das ist alles. Gar nichts weiter.
{ items ? anonymous_letter: maren: Dieser Brief … nein. Das war ich nicht! Ich schwöre! Auf alle meine Kekse! }
{ items ? anonymous_letter: quill: Sie haben ihn erkannt, Miss Holloway? }
{ items ? anonymous_letter: maren: Nur das Papier. Es ist Eulenpost-Papier. Es gibt einfach … viel davon. }
{ not (items ? anonymous_letter): quill: Es geht um einen Brief, den ich bekam. Die Eule trug die Nummer 38. }
{ not (items ? anonymous_letter): maren: Das ist die Hauseule. Sie trägt alles. Sie kann nichts dafür. }
# sfx: door
Hinter euch raschelt es. Im Gartenschuppen. Etwas Kleines. Etwas Schnelles.
maren: Wind! Das ist Wind. Oder Mäuse. Oder Mäusewind. Kekse?
# choice_point: d08.maren Aus dem Schuppen raschelt es auffällig.
* [Maren darauf ansprechen.] # cid: d08.maren.ask
    ~ trust_maren += 1
    # toast: Maren wird sich das merken.
    maren: Du fragst, und du schaust mich dabei nett an. Das ist schlimmer als Anschreien.
    maren: Ich kann es dir nicht sagen. Noch nicht. Aber ich lüge nicht. Ich … backe nur viel.
* [Das Rascheln auf sich beruhen lassen.] # cid: d08.maren.leave
    # emote: maren dots
    maren: Danke. Wirklich. Hier, nimm drei Kekse. Sie sind gegen alles.
- quill: Dann lösen wir lieber etwas, das uns sicher gehorcht. Töpfe zum Beispiel.
neville: Alraunen schreien, wenn sie nebeneinanderstehen. Keine zwei Töpfe in Nachbarschaft!
# emote: quill dots
quill: Das erinnert mich an ein Rätsel aus dem Botanischen Garten meiner Kindheit …
# puzzle: p08
{ last_puzzle_first_try: neville: Beim ersten Versuch? Sie haben ein Händchen für Wurzeln! }
{ not last_puzzle_first_try: neville: Eine Alraune hat gemault. Aber sie wird es überstehen. }
# sfx: spark
Mit einem Plopp springt im Beet ein Mistelzweig auf. Er singt. Falsch, aber mit Inbrunst.
# sfx: blip
Dann kullert etwas aus dem Schuppen. Rund. Golden. Es bleibt vor Ellis' Füßen liegen.
# emote: ellis !
ellis: Eine Galleone! Eine echte! Wer lässt eine Galleone im Schuppen liegen?
Aus der Dunkelheit kommt ein winziges Quieken. Maren erstarrt.
maren: Hast du … Hunger? Ich meine: Hast du Hunger? Kekse! Ich hole Kekse!
# hide: maren
quill: Akt eins endet, wie sie meistens enden: Mit mehr Fragen als Antworten.
quill: Ein Notizbuch voller Zahnräder. Ein Brief aus dem Schloss. Ein Schuppen mit Quieken.
quill: Und eine Kälte, die durch Wände geht. Morgen beginnt der Teil, in dem die Leute lügen.
-> END
