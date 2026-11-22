INCLUDE globals.ink

// Tag 14 – Tiefer hinein (Akt II). Routen-Knoten day14_forest / day14_archive [STR-1]. Rätsel: p14w / p14a.
// Quelle: storyboard/tag-14.md.
=== day14 ===
{ route == "archive": -> day14_archive }
-> day14_forest

=== day14_forest ===
# bg: forest_clearing
# music: outdoor
# spark: d14w.s1 44 150
Vierzehnter Dezember. Die Lichtung ist rund wie ein Teller und still wie ein Gebet.
# show: ellis left
ellis: Die Zimtkrümel hören hier auf. Mitten auf der Lichtung. Das ist unhöflich.
{ items ? lantern: Deine Laterne wirft Licht auf ein riesiges Netz. Es funkelt wie ein Kronleuchter. }
Über der Lichtung hängt es, groß wie ein Segel.
In der Mitte ein Nest aus Zweigen und Zwirn.
Darin glänzt etwas Goldenes. Rund. Gezahnt.
ellis: Ein Zahnrad! Ein goldenes! Aus einer Uhr! Ich muss mich setzen. Es ist Schnee. Ich stehe.
# show: spider center
Von einem Ast klackt es. Eine Spinne, so groß wie ein Schaf, lässt sich am Faden herab.
spider: Aragogs Urenkelin. Ich habe keine Lust, jemanden zu essen.
spider: Nur einen Namen, der es behauptet.
# choice_point: d14w.spider Die Spinne mustert euch mit acht Augen.
* [Freundlich grüßen.] # cid: d14w.spider.greet
    spider: Höflich. Der Kleine mit dem Glitzer kommt jede Nacht. Er bringt Zimtkekse.
    ellis: Der Kleine füttert die Spinne. Mit Keksen. Die Welt ist sehr seltsam.
* [Schweigend nicken.] # cid: d14w.spider.nod
    Sie nickt zurück. Acht Augen blinzeln nicht im Gleichschritt.
    Es ist gruselig, aber höflich gemeint.
- spider: Zum Nest geht es nur über das Netz. Betretet jeden Knoten einmal.
spider: Drei Fäden sind gerissen. Dort hält das Netz niemanden.
{ pet == "owl": Deine Eule sitzt auf dem Netz. Sie läuft eine Spirale ab und blickt dich stolz an. }
{ pet == "cat": Deine Katze beäugt das Netz. Sie will hinauf. Sie weiß nicht, dass sie es sollte. }
{ pet == "toad": Deine Kröte hüpft auf einen Knoten und bleibt dort kleben. Sie nimmt das persönlich. }
ellis: Quill würde etwas über Spiralen sagen. Ich sage: Mir wird schon vom Zusehen schwindlig.
# puzzle: p14w
{ last_puzzle_first_try: spider: Selten so sauber gelaufen. }
{ not last_puzzle_first_try: spider: Du hast mein Netz zweimal berührt. Ich verzeihe dir einmal. }
# hide: spider
# sfx: spark
Im Nest liegt das Zahnrad, warm wie Brot.
Auf der Rückseite: eine 12 und ein winziges Herz.
# choice_point: d14w.gear Das goldene Zahnrad liegt vor dir.
* [Das Zahnrad vorsichtig mitnehmen.] # cid: d14w.gear.take
    Es passt in deine Hand, als hätte es auf dich gewartet.
* [Ellis zeichnen lassen und liegen lassen.] # cid: d14w.gear.watch
    Ellis zeichnet die Kontur, die 12 und das Herz.
    Im Gebüsch quiekt etwas. Goldene Augen blitzen auf.
-
# clue: k04
ellis: Zwölf Löffel bei Hagrid. Zahnrad Nummer zwölf hier. Ich sehe ein Muster.
ellis: Ich sehe zwölf Muster.
Auf den Spinnfäden bilden sich Eiskristalle und klingeln leise im Wind.
# spark: d14w.s2 214 140
-> END

=== day14_archive ===
# bg: dungeon_corridor
# music: dungeon
# spark: d14a.s1 206 150
Vierzehnter Dezember. Der Kerkergang riecht nach nassem Stein und alten Plänen.
# show: quill right
quill: Die Akte Tickwell erwähnt diesen Gang. Isoldes Werkstatt lag einmal hier.
An der Wand läuft eine Zeile in kleiner, schiefer Schrift. Sie ist spiegelverkehrt.
quill: Isolde schrieb Notizen so, dass nur ein Spiegel sie lesen kann. Oder jemand mit viel Zeit.
{ clues ? k06: quill: „Mein Ritter.“ Der Brief hat dieselbe Handschrift. Sie schrieb gern verschlüsselt. }
{ clues ? k02: quill: Und diese Kälte schon wieder. Wie auf den Treppen. Das ist kein Zufall. }
# show: myrte left
Aus einem tropfenden Rohr steigt ein Mädchen, durchscheinend, mit dicker Brille.
myrte: Ihr seid die ersten Besucher seit … ich glaube, seit 1943. Hallo.
myrte: Ich weine gleich. Das ist eine Warnung.
# choice_point: d14a.myrtle Myrte schwebt vor der Spiegelschrift.
* [Myrte um Hilfe bitten.] # cid: d14a.myrtle.ask
    myrte: Mich? Wirklich mich? Ich kenne Spiegel. Ich habe sie jahrelang von innen gesehen.
    myrte: Das hier ist ein Wort, aber es ist falsch rum und irgendwie falsch gedacht.
* [Allein entziffern.] # cid: d14a.myrtle.alone
    myrte: Ah. Niemand fragt mich. Das ist auch eine Antwort. Ich bin dann im Rohr.
- # hide: myrte
quill: Isolde zeigte ihre Entwürfe nie jemandem.
quill: Sie baute Uhren, weil Uhren nicht widersprechen.
# choice_point: d14a.tone Quill streicht über die Wand.
* [Isolde muss genial gewesen sein.] # cid: d14a.tone.admire
    quill: Genial, ja. Das Genie und die Einsamkeit teilen sich oft einen Hocker.
* [Sie klingt einsam.] # cid: d14a.tone.lonely
    quill: Ja. Du hörst gut zu, {pronoun_form("meine Liebe", "mein Lieber", "mein Gutes")}. Das ist selten.
- { pet == "owl": Deine Eule hält den Kopf schief. Sie liest die Zeile von rechts nach links und nickt. }
{ pet == "cat": Deine Katze sieht ihr Spiegelbild in einer Pfütze. Sie ist überzeugt, dass es unhöflich ist. }
{ pet == "toad": Deine Kröte springt in eine Pfütze. Das Spiegelbild springt zurück. Sie ist beeindruckt. }
quill: Das erinnert mich an ein Rätsel, das mit zwei Spiegeln und viel Geduld begann …
# puzzle: p14a
{ last_puzzle_first_try: quill: Beim ersten Versuch. Ihre Geduld wäre Isolde aufgefallen. }
{ not last_puzzle_first_try: quill: Der Weg zählt, nicht die Anzahl der Versuche. Das sagte meine Lehrerin. }
# sfx: spark
Das Wort leuchtet von allein auf der Wand. P E N D E L.
quill: Das Pendel. Das Herz jeder Uhr. Dort liegt etwas, das Isolde niemandem sagen wollte.
Die Spinnweben in den Ecken überziehen sich mit Eiskristallen und klingeln leise.
# spark: d14a.s2 40 130
-> END
