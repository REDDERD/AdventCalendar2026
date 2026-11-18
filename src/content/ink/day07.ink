INCLUDE globals.ink

// Tag 7 – Die Eulerei (Akt I). Ort: owlery. Rätsel: p07.
// Quelle: storyboard/tag-07.md. Anpassungen: Funke ins 256 × 512-Raster. Rätsel p07 schwerer, die Antwort bleibt 38.
=== day07 ===
~ temp joke = personal("insideJokes")
# bg: owlery
# music: outdoor
# spark: d07.s1 212 140
Siebter Dezember. Die Eulerei steht offen, Schnee weht durch die Bögen.
An den Sitzstangen hängen Schilder: „Hedwig – bitte nicht streicheln“.
Daneben: „Errol – bitte nicht werfen“. Errol dreht sich im Schlaf und fällt vom Stab.
# show: quill right
# show: ellis left
{ joke != "": ellis: {joke} }
quill: Ellis, bitte. Ich habe heute Post bekommen. Ungebetene Post.
# emote: quill dots
quill: Kein Absender, kein Siegel. Nur ein Satz: „Lasst die Uhr ruhen. Ein Freund.“
{ clues ? k02: ellis: Der Brief ist so kalt wie das Geländer von der Treppe! Schaut! Reif am Rand! }
{ not (clues ? k02): ellis: Der Brief ist eiskalt! Wer schickt Post, die friert? }
quill: Eulenfedern sind feucht. Das Pergament hat dicke Winterluft eingefangen.
ellis: Das ist kein Eulenwasser. Das ist Eis. Ich studiere Eis. Seit gestern.
# choice_point: d07.letter Was geschieht mit dem anonymen Brief?
* [Quill den Brief geben.] # cid: d07.letter.give
    quill: Kluge Entscheidung, {pronoun_form("meine Liebe", "mein Lieber", "mein Gutes")}. Ich schaue ihn mir an.
    quill: Und wenn ich ihn nicht verstehe, bitte ich Schulleiterin Thornbury. Die versteht alles.
* [Den Brief selbst einstecken.] # cid: d07.letter.keep
    # item: anonymous_letter
    # toast: Neuer Gegenstand: Anonymer Brief
    quill: Ah. Sie wollen ihn behalten? Gut. Ein Rätsel ist besser in zwei Taschen als in einer.
- ellis: Der Absender ist bestimmt Theo! Pyjama, Werkzeug, nachts! Der Typ hat Motiv!
{ trust_theo >= 1: quill: Theo hat seine Hilfe angeboten, Ellis. Wer helfen will, verfasst keine Drohbriefe. }
{ trust_theo < 1: quill: Theorien ohne Beweise sind wie Eulen ohne Flügel. Sie kommen nicht weit. }
Eine große weiße Eule mustert dich streng. Sie scheint später über dich zu schreiben.
Eine zerzauste graue Eule landet kopfüber im Heu. Sie macht das nicht zum ersten Mal.
quill: Die Eulen sitzen nach Ringnummern. Eine Stange ist leer. Das ist unsere Eule.
# emote: quill dots
quill: Das erinnert mich an ein Rätsel aus meiner Zeit als Posthalterin …
# puzzle: p07
{ last_puzzle_first_try: ellis: Zahlenfolgen! Ich liebe Zahlenfolgen. Fast so sehr wie Erklärungen. }
{ not last_puzzle_first_try: ellis: Zahlen sind gemein. Eulen auch. Aber Eulen sind flauschiger. }
# sfx: spark
Auf der leeren Stange steht „38“. Das Schild daneben: „Hauspost Gewächshaus und Halle“.
quill: Der Brief kam also aus dem Schloss. Nicht von außen. Das ist ein Anfang.
Eine kleine Eule mit der Nummer 38 flattert herein. Ihr Gefieder ist weiß bepudert.
# emote: ellis !
ellis: Reif im Gefieder! Sie war an der Halle! Ich verhöre sie! Wo waren Sie in der Nacht?
Die Eule blinzelt einmal. Dann putzt sie sich in aller Ruhe eine Feder.
ellis: Aussage verweigert. Typisch Profi.
quill: Eulen sagen nichts, Ellis. Sie tragen nur. Das macht sie zu den besten Mitwissern.
ellis: Wer führt den Eulendienstplan? Maren Holloway. Hufflepuff. Überfreundlich.
# emote: ellis !
ellis: Ich sage nichts. Ich sage nur: Sie hat mir gestern ganze drei Kekse angeboten.
quill: Das ist nicht verdächtig, Ellis. Das ist Hufflepuff.
# choice_point: d07.home Die weiße Eule wartet, ob du Post hast.
* [Einen Brief nach Hause schreiben.] # cid: d07.home.write
    ~ wrote_home = true
    # toast: Hedwig übernimmt die Post.
    Du kritzelst ein paar Zeilen nach Hause. Die weiße Eule nimmt den Brief mit Würde.
    Sie wirft Errol einen Blick zu. Errol fällt wieder von der Stange.
* [Später. Die Uhr geht vor.] # cid: d07.home.later
    Die weiße Eule wartet noch einen Moment. Dann dreht sie sich um. Das war deutlich.
- quill: Wir klopfen morgen im Gewächshaus. Sie wollen sicher auch wissen, wer so etwas schreibt.
-> END
