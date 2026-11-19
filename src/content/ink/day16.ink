INCLUDE globals.ink

// Tag 16 – Die Tischordnung (Akt II). Ort: great_hall. Rätsel: p16. Die Routen treffen sich.
// Quelle: storyboard/tag-16.md.
=== day16 ===
# bg: great_hall
# music: castle
# spark: d16.s1 36 170
Sechzehnter Dezember. Die Große Halle wird für den Ball geschmückt.
Tannen, Kerzen, Aufregung.
# show: quill right
# show: ellis left
{ route == "forest":
    quill: Im Archiv: Isoldes Familie. Theo ist ihr Nachfahre.
    quill: Und ein Brief an „meinen Ritter“.
    ellis: Im Wald: ein Niffler. Er heißt Knopf.
    ellis: Er ist so klein, dass ich ihm ein ganzes Wort widmen möchte.
}
{ route == "archive":
    ellis: Im Wald: ein Niffler und ein goldenes Zahnrad.
    ellis: Und eine Spinne, die höflicher war als Peeves.
    quill: Im Archiv: Isoldes Brief, ein Porträt von 1726. Beide sprechen von einem Ritter.
}
ellis: Theorie sechs! Die Uhr streikt, weil sie keine Einladung zum Ball bekam.
quill: Sie ist ein Möbelstück, Ellis.
ellis: Möbel haben Gefühle. Fragt jeden Stuhl.
Neben dem Kamin wird die Luft kurz kalt. Etwas Silbernes verbeugt sich vor Ellis.
Er merkt es nicht.
# show: maren center
Maren Holloway kommt mit einem Tablett Zimtkekse. Sie zittert. Die Kekse auch.
maren: Ich muss etwas sagen. Bevor ihr es selbst herausfindet. Es geht um … einen Niffler.
maren: Knopf. Er fror im Herbst in meinem Gewächshaus. Ich nahm ihn auf.
maren: Er liebt alles, was glänzt.
maren: Und er hat ein goldenes Zahnrad genommen.
maren: Ich wusste nicht, wie ich es zurückgeben soll.
{ not (clues ? k04) and trust_maren >= 2:
    maren: Hier. Ich habe es aufgehoben. Es ist warm geblieben.
    # clue: k04
}
{ not (clues ? k05) and trust_maren >= 2:
    maren: Und das ist Knopf. Schüchtern. Schnell.
    maren: Er hat dich schon einmal gesehen, ich schwöre.
    # clue: k05
}
# choice_point: d16.maren Maren hält das Tablett wie einen Schutzschild.
* [Maren decken und schweigen.] # cid: d16.maren.cover
    ~ trust_maren += 1
    ~ maren_covered = true
    # toast: Maren wird sich das merken.
    maren: Wirklich? Du sagst es niemandem? Dann backe ich dir dein Leben lang Kekse.
* [Thornbury davon berichten.] # cid: d16.maren.report
    ~ trust_maren -= 1
    # toast: Maren wird sich das merken.
    maren: Ich verstehe. Ich wäre es auch. Aber bitte: Er ist kein Dieb. Er sammelt.
- # hide: maren
quill: Zwei unabhängige Defekte also.
quill: Eine Uhr, die nicht will, und ein Zahnrad, das gehen wollte.
Das Portal öffnet sich. Sechs Gäste treten ein.
Sie sehen sich um und tun so, als wären sie immer da gewesen.
# show: slughorn center
slughorn: Ah! Die Assistenz! Ich sitze neben den Begabten, versteht sich. Ich sammle.
# show: hagrid left
{ ate_rockcake: hagrid: Du! Der mit dem Zahn! Ich hab dir 'n Platz neben dem Pudding freigehalten. }
{ not ate_rockcake: hagrid: Ich brauch 'n Ende der Tafel. Wegen der Ellbogen. Und 'n Pudding. }
quill: Sechs Gäste, sechs Wünsche und eine Tafel.
quill: Das erinnert mich an ein Rätsel über Eitelkeit.
# puzzle: p16
{ last_puzzle_first_try: quill: Alle sechs zufrieden. Selbst Slughorn. Das ist ein Meisterstück. }
{ not last_puzzle_first_try: quill: Zwei haben sich beschwert. Das ist bei Ballordnungen ein guter Schnitt. }
# sfx: spark
Der Tisch deckt sich von selbst. Teller landen, Gläser klingeln.
Ein Pudding verbeugt sich.
Am Kopf der Tafel bleibt ein siebter Stuhl leer.
# choice_point: d16.seating Ein Stuhl ist übrig. Für wen?
* [Den Stuhl für Aldous freihalten.] # cid: d16.seating.keep
    ~ kept_chair = true
    # toast: Der Stuhl bleibt frei.
    quill: Gute Idee. Für jemanden, der nie eingeladen wurde.
    ellis: Siehst du? Die Uhr bekommt ihre Einladung doch noch. Theorie sechs bleibt gültig.
* [Peeves den Stuhl geben.] # cid: d16.seating.peeves
    Peeves lässt sich rücklings auf den Stuhl fallen und balanciert den Pudding auf dem Kopf.
    quill: Das war nicht, was ich meinte. Aber es war ehrlich.
- # spark: d16.s2 214 130
-> END
