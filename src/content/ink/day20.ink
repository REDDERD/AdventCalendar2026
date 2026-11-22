INCLUDE globals.ink

// Tag 20 – Der Duellierclub (Akt III). Ort: dueling_club. Rätsel: p20.
// Quelle: storyboard/tag-20.md.
=== day20 ===
# bg: dueling_club
# music: dungeon
# spark: d20.s1 40 160
Zwanzigster Dezember. Im Duellierclub riecht es nach Kreide und Ehrgeiz.
# show: ellis left
# show: flitwick center
Auf einem Stapel Bücher steht ein winziger Professor mit Zauberstab und Siegerlächeln.
flitwick: Filius Flitwick! Duellmeister, einst Champion.
flitwick: Ich bin Gast aus einem anderen Dezember.
flitwick: Heute lernen wir das Zauberrad.
flitwick: Jeder Spruch schlägt drei andere und verliert gegen drei.
In der Ecke signiert ein blonder Mann mit strahlendem Lächeln die Luft.
Niemand weiß, wofür.
# choice_point: d20.lockhart Der Mann in der Ecke winkt dir zu.
* [Die Luft mitunterschreiben.] # cid: d20.lockhart.sign
    Du unterschreibst die Luft. Ein Schnörkel bleibt kurz sichtbar. Dann verdunstet er.
* [Höflich abwinken.] # cid: d20.lockhart.wave
    Er nickt gnädig: „Verstehe, Sie sind schüchtern.“ Er ist es nicht, aber das sagt er nicht.
- flitwick: Ich werfe fünf Sprüche in einer festen Folge.
flitwick: Finde den sechsten und schlage ihn.
# show: quill right
quill: Das erinnert mich an ein Rätsel, das sich selbst beim Sortieren erklärt.
# puzzle: p20
{ last_puzzle_first_try: flitwick: Ausgezeichnet! Sie lesen Muster wie andere die Zeitung. }
{ not last_puzzle_first_try: flitwick: Ein kleiner Fehler. Das Rad dreht sich weiter. Und wir mit ihm. }
# sfx: spark
Alle Zauberstäbe im Raum beginnen zu funkeln wie Wunderkerzen.
# show: theo right
Aus dem Schatten tritt Theo Ashcombe. In der Tasche ein Schraubenschlüssel.
theo: Ich brauche einen Gegner. Oder einen Partner. Ich entscheide mich nicht.
{ clues ? k03: ellis: Ein Notizbuch voller Zahnräder. Ein Schlüssel. Er ist es, oder? }
theo: Ja. Ich repariere die Uhr. Jede Nacht. Und jedes Mal friert sie wieder ein.
theo: Ich bin Isoldes Nachfahre. Wenn ich es nicht schaffe, wer dann?
ellis: Das erklärt das Messingöl. Und die Ölflecken. Ich bin erleichtert. Und verwirrt.
quill: Jemand friert sie wieder ein, kaum dass sie tickt.
quill: Das ist kein Defekt, Mr. Ashcombe.
quill: Das ist ein Wille.
theo: Ein Wille. Ja. Das habe ich auch gedacht. Ich wusste nur nicht, wessen.
{ trust_theo >= 1: theo: Den Turmschlüssel habe ich auch. Geliehen. Ich gebe ihn zurück. }
# choice_point: d20.duel Theo hebt den Zauberstab.
* { trust_theo >= 1 } [An Theos Seite kämpfen.] # cid: d20.duel.ally
    # item: theo_wrench
    # toast: Neuer Gegenstand: Theos Schraubenschlüssel
    theo: Hier. Mein Schlüssel. Er passt zu keinem Schloss. Aber zu fast jedem Zahnrad.
* [Gegen Theo antreten.] # cid: d20.duel.oppose
    Ihr tauscht ein paar Funken. Theo grinst schief. Er verliert, aber nicht ohne Stolz.
* [Den eigenen Stab sprechen lassen.] # cid: d20.duel.wand
    { wand == "phoenix": Dein Phönixstab glüht warm. Selbst Lockhart hört kurz auf, sich zu bewundern. }
    { wand == "dragon": Dein Drachenstab knistert. Die Kreidestriche an der Wand tanzen. }
    { wand == "unicorn": Dein Einhornstab beruhigt den Raum. Die Kreide hört auf zu quietschen. }
- { not (clues ? k06) and trust_theo >= 2:
    theo: Der Brief aus der Akte. „Mein Ritter.“ Er gehört nicht mir. Er gehört der Uhr.
    # clue: k06
  }
flitwick: Gut gekämpft! Und beim nächsten Mal nicht gegen die Uhr, sondern mit ihr.
# spark: d20.s2 214 140
-> END
