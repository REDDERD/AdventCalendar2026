INCLUDE globals.ink

// Tag 23 – Die Anklage (Akt III). Ort: great_hall. Rätsel: p23 (custom:accuse). Setzt `accused` [END-1].
// Quelle: storyboard/tag-23.md.
=== day23 ===
# bg: great_hall
# music: dungeon
# spark: d23.s1 40 170
Dreiundzwanzigster Dezember.
Die Halle ist leer bis auf eine lange Tafel und eine Uhr, die steht.
# show: quill right
# show: ellis left
{ maren_covered: Maren trägt Knopf auf der Schulter. Er knabbert an ihrem Finger. Sie lässt ihn. }
Theo, Maren und Grimsby sitzen auf Stühlen in einer Reihe.
Der Stuhl am Kopf der Tafel bleibt leer.
quill: Zwei Defekte. Ein Zahnrad, das fehlt. Und ein Frost, der immer zurückkehrt.
quill: Heute klären wir, wer die Uhr eingefroren hat. Wer hat es getan?
theo: Ich war es nicht. Ich sage es jetzt, damit es alle gehört haben.
maren: Ich habe Kekse. Zwölf. Falls jemand Mut braucht.
grimsby: Ich war im Kerker. Ich sage es seit Tagen. Niemand schreibt es auf.
{ items ? anonymous_letter: ellis: Der Brief von Tag sieben! „Lasst die Uhr ruhen.“ Das Papier ist gefroren. Das war ein Hinweis. }
# choice_point: d23.accuse Wer hat die Uhr eingefroren?
* [Theo anklagen.] # cid: d23.accuse.theo
    ~ accused = "theo"
    # show: theo center
    theo: Ich? Ich repariere sie!
    theo: Mein Notizbuch, jede Nacht ein Zahnrad, jede Nacht wieder Eis.
* [Maren anklagen.] # cid: d23.accuse.maren
    ~ accused = "maren"
    # show: maren center
    maren: Ich habe nur Knopf versteckt. Er sammelt. Er friert nichts ein. Er ist ein Niffler!
* [Grimsby anklagen.] # cid: d23.accuse.grimsby
    ~ accused = "grimsby"
    # show: grimsby center
    grimsby: Ich? Im Kerker war ich! Rohrbruch! Ich vermisse das Ticken, ihr Schnösel!
* [Sir Aldous anklagen.] # cid: d23.accuse.aldous
    ~ accused = "aldous"
    quill: Dann lassen Sie uns die Beweise ordnen.
- quill: Alle Karten auf den Tisch. Wen entlastet welche, und worauf zeigen die anderen?
# puzzle: p23
{ last_puzzle_first_try: quill: Alles geordnet. Beim ersten Mal. Das hat etwas von Isolde. }
{ not last_puzzle_first_try: quill: Geordnet. Mit Umwegen. Das ist ehrlicher. }
# sfx: spark
Die Luft in der Halle wird eiskalt. Neben dem leeren Stuhl steht Sir Aldous.
Er hat zugehört.
# show: aldous center
{ accused == "aldous":
    Im Rahmen an der Wand lüftet ein schwarzhaariges Porträt eine Braue. Dann nickt es.
    Einmal.
    aldous: Fürwahr. Ihr habt recht. Ich habe die Uhr angehalten.
}
{ accused != "aldous":
    aldous: Ihr sucht an der falschen Stelle. Gestattet: Es war nicht dieser Mensch.
    aldous: Es war ich.
}
{ trust_aldous >= 1: aldous: Ich wollte nie, dass ihr mich so findet. Aber ich bin froh, dass ihr es seid. }
theo: Ein Geist hat meine Reparaturen gestoppt? Ich bin wütend. Und ziemlich erleichtert.
maren: Er hat sich letzte Nacht bei Knopf bedankt. Für die Gesellschaft.
maren: Ich habe nichts gesagt.
{ bond_ellis >= 4: ellis: Aldous. Ich habe dir einen Stuhl freigehalten. Das gilt noch. }
{ bond_ellis < 4: ellis: Aldous … Ich hätte dich gern früher gefragt. Ich wusste nur nicht, was. }
# choice_point: d23.speech Aldous steht vor euch, aufrecht und zitternd.
* [Danke, dass Sie es sagen.] # cid: d23.speech.gentle
    aldous: Ihr seid freundlich. Das macht es schwerer. Und leichter.
* [Warum haben Sie das getan?] # cid: d23.speech.firm
    aldous: Morgen. Morgen erzähle ich alles. Gestattet, ich muss mich sammeln.
- ellis: Einen Moment. Was ist das?
Mitten in der Halle wächst ein Tannenbaum aus dem Fußboden. Er funkelt.
Er ist noch etwas schief.
quill: Morgen früh, zur Stunde der Uhr, in dieser Halle. Wer bleiben will, bleibt.
# spark: d23.s2 214 140
-> END
