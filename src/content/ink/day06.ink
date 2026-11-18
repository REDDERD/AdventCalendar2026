INCLUDE globals.ink

// Tag 6 – Die Nikolausnacht (Akt I). Ort: dorm_corridor. Rätsel: p06.
// Quelle: storyboard/tag-06.md. Anpassungen: Funke ins 256 × 512-Raster; fünf Stiefel (einer ist deiner) für das schwerere Logikrätsel p06.
=== day06 ===
~ temp gift = ""
# bg: dorm_corridor
# music: dungeon
# spark: d06.s1 40 160
Sechster Dezember, kurz nach Mitternacht. Nikolausnacht.
Im Korridor stehen fünf Stiefel vor fünf Türen. Einer ist deiner. Alle leer. Alle wartend.
# show: ellis left
ellis: Ich fange den Nikolaus. Für die Wissenschaft. Und für Süßigkeiten.
ellis: Meine Falle: ein Faden aus Socken. Er stolpert, und wir stellen ihm Fragen.
ellis: Quill hat uns die Nachtwache gegeben. Wer nachts zur Halle will, muss hier vorbei.
Die Zeitfransen haben alle Betten durcheinandergewürfelt. Wer wo schläft, weiß keiner.
ellis: Mein Stiefel steht angeblich irgendwo da. Er riecht bestimmt nach Optimismus.
# choice_point: d06.boot Du willst Ellis eine kleine Freude machen.
* [Einen Zimtstern in seinen Stiefel legen.] # cid: d06.boot.star
    ~ gift = "star"
    Du schiebst einen Zimtstern aus der Tasche in einen der Stiefel. Er knistert leise.
* [Einen Zettel: „Danke für die Theorien.“] # cid: d06.boot.note
    ~ gift = "note"
    Du schreibst „Danke für die Theorien“ auf einen Zettel und faltest ihn in den Stiefel.
- # sfx: blip
Etwas klirrt. Die Rüstung neben euch wackelt. Niemand steht dort.
Eine Stimme flüstert: „Harry, du stehst auf meinem Fuß!“
Eine zweite: „Das ist DEIN Fuß, Ron! Ich habe nur den Umhang festgehalten!“
# emote: ellis !
ellis: Zwei Gespenster! Mit Streitkultur! Das gab es noch nie!
Im Staub entstehen zwei Paar Fußspuren. Sie wandern leise zankend Richtung Bibliothek.
# show: theo right
Danach wird es still. Dann: ein Schatten. Theo Ashcombe, Umhang über dem Pyjama.
Er trägt eine Ledertasche, aus der es leise klappert. Er schleicht zur Halle.
Beim Abbiegen rutscht ihm ein Notizbuch aus der Tasche. Er merkt es nicht.
# clue: k03
ellis: Zahnräder! Zahnräder! Und Formeln! Und neben Zahnrad Nummer zwölf ein kleines Herz!
quill: (Aus der Ferne, im Halbschlaf) Ist jemand wach? Brennt etwas an?
# hide: theo
{ trust_theo >= 1: ellis: Theo hat doch die Messingöl-Hilfe angeboten. Aber was macht er mit Zahnrädern? }
{ trust_theo < 1: ellis: Verdächtig. Sehr. Wobei … ich wäre in Pyjama auch verdächtig. }
# choice_point: d06.theo Theo ist mit einer Werkzeugtasche zur Halle geschlichen.
* [Quill alles melden.] # cid: d06.theo.report
    ~ trust_theo -= 1
    # toast: Theo wird davon erfahren.
    Du schickst Quill eine kurze Notiz per Eule. Sie lautet: „Theo. Halle. Werkzeug.“
    ellis: Kurz und effizient. Ich hätte drei Absätze geschrieben. Und Fußnoten.
* [Theo zur Rede stellen.] # cid: d06.theo.confront
    ~ trust_theo += 1
    # toast: Theo wird sich das merken.
    # show: theo right
    { trust_theo >= 2: theo: Von dir hätte ich nichts anderes erwartet. Du fragst, bevor du urteilst. }
    { trust_theo < 2: theo: Du folgst mir? Wie originell. Das war kaum ein Wort. }
    theo: Ich sehe nach der Uhr. Mehr nicht. Das Buch behalte ich, wenn du es nicht petzt.
    # hide: theo
    ellis: Er hat „wenn du es nicht petzt“ gesagt. Das ist die höflichste Drohung, die ich kenne.
- # sfx: spark
Von irgendwoher kommt kein Glockenschlag. Es gibt ja keine Uhr, die schlagen könnte.
Der Nikolaus kommt trotzdem. Er ist ein Mann mit Prinzipien.
Ein Schneewirbel. Die Stiefel hüpfen, tauschen Plätze, die Namensschilder wehen fort.
# emote: ellis note
ellis: Jetzt weiß niemand mehr, wem was gehört! Das ist ein Fall!
quill: (Aus dem Dunkel) Dann löst ihn bitte leise.
# emote: quill dots
Neben den Stiefeln liegt eine Karte. Quills Handschrift, ganz sicher.
# puzzle: p06
{ last_puzzle_first_try: ellis: Beim ersten Versuch! Der Nikolaus weint vor Rührung. Vielleicht. }
{ not last_puzzle_first_try: ellis: Wer hätte gedacht, dass Lakritz so viel Streit auslöst? }
Als ihr zurückkehrt, wartet die Morgendämmerung auf den Fensterbänken.
{ gift == "star": ellis: In meinem Stiefel war ein Zimtstern! Ich habe ihn noch nicht gegessen. Ich sehe ihn an. }
{ gift == "note": ellis: Du hast mir einen Zettel geschrieben! Ich laminiere ihn. Mit Zauberei. }
# emote: ellis heart
# spark: d06.s2 220 140
# sfx: blip
Und dann, ganz leise, aus der Richtung der Halle: Tick.
Nur ein einziges. Dann wieder Stille.
# emote: ellis !
ellis: Die Uhr hat getickt! Ich schwöre, sie hat getickt!
quill: Dann hören wir morgen weiter. Ich habe Post bekommen, und sie ist ausgesprochen unhöflich.
-> END
