INCLUDE globals.ink

// Tag 24 – Der letzte Schlag (Akt III). Ort: great_hall. Rätsel: p24 (custom:finale). `# ending` wertet [END-1] aus.
// Quelle: storyboard/tag-24.md.
=== day24 ===
# bg: great_hall
# music: finale
# spark: d24.s1 40 170
Vierundzwanzigster Dezember, kurz vor der Stunde. Die Halle ist voll:
Lehrer, Schüler, Geister, Gäste.
# show: thornbury center
# show: ellis left
# show: quill right
thornbury: Ich hatte gesagt: Kein Wort zu irgendjemandem.
thornbury: Das hat genau acht Tage gehalten.
ellis: Ich habe mitgezählt, Frau Direktorin. Es waren eher acht Stunden.
{ kept_chair: Am Kopf der Tafel steht ein Stuhl, mit einem blauen Band geschmückt. }
Die Uhr steht. Der Stuhl wartet. Dann wird es kalt. # ending
# show: aldous center
aldous: Fürwahr. Es ist an der Zeit. Isolde band mich an die Uhr. Dreihundert Zyklen.
aldous: Heute endet der letzte.
aldous: Ich habe sie angehalten, weil ich nicht gehen wollte.
aldous: Und jedes Mal, wenn Theo sie reparierte, fror ich sie wieder ein.
theo: Das war nicht schön. Aber ich verstehe es. Ich habe nur nie gewusst, wer da friert.
ellis: Ich habe dich nie gefragt, ob du bleiben willst.
ellis: Ich habe nur gefragt, was kaputt ist.
{ trust_grimsby >= 1: grimsby: Ich werde die Uhr aufziehen. Summend. Das sage ich nur einmal. }
{ ending == "A": quill: Beweise und Mitgefühl. Beides hat uns bis hierher gebracht. }
{ ending == "B": quill: Sie hatten recht, aber nicht alles gesehen. Das ist selten anders. }
{ ending == "C_A": ellis: Wir haben falsch angeklagt. Aber dann kam mir ein Gedanke. Er ist gar nicht schlecht. }
{ ending == "C_B": quill: Ein Irrtum, der zum Ziel führt. Das ist die beste Art von Irrtum. }
aldous: Was tut man mit einem Geist, der bleiben will und gehen muss?
# choice_point: d24.fate Aldous sieht dich an. Alle sehen dich an.
* { ending == "A" or ending == "C_A" } [Ihn fragen, was er will.] # cid: d24.fate.third_way
    aldous: Gefragt? Mich? Seit dreihundert Jahren hat mich niemand gefragt.
    aldous: Ich will bleiben. Und gehen dürfen, wenn ich es will.
    quill: Eine Tür, die einen Spalt offen bleibt. Das Zahnrad Nr. 12 wird das Scharnier.
* [Ihn gehen lassen.] # cid: d24.fate.release
    { ending == "A" or ending == "C_A":
        aldous: Ihr lasst mich gehen. Dann bitte ich um eins: Fragt mich, ob ich es will.
        quill: Dann fragen wir. Wer bleiben will, bleibt. Das ist die dritte Lösung.
    - else:
        aldous: Danke. Ich habe dreihundert Jahre gewartet, dass es jemand sagt.
    }
- quill: Isolde schrieb: Ein Fremder wird die Stunde schlagen. Der Fremde warst du.
{ ending == "A" or ending == "C_A": Knopf springt auf den Tisch und legt das goldene Zahnrad in deine Hand. Nur geliehen, quiekt er. }
quill: Das erinnert mich an das letzte Rätsel meiner Laufbahn.
quill: Es besteht aus Zahnrädern und Zeigern.
# puzzle: p24
# sfx: spark
Das Pendel schwingt. Die Zeiger stehen auf Zwölf. Und die Uhr schlägt.
Zum letzten Mal und zum ersten.
Schnee fällt von der verzauberten Decke, weich, groß, überall.
{ ending == "A" or ending == "C_A":
    { items ? gift_music_box: Aus Aldous' Tasche spielt eine Spieluhr. Ein blaues Band tanzt im Takt. }
    aldous: Ich bleibe. Und wenn ich gehen will, öffne ich die Tür.
    { kept_chair: Er setzt sich an den Kopf der Tafel. Der Stuhl ist ihm nicht zu klein. }
- else:
    { items ? gift_music_box: Aus Aldous' Tasche spielt eine Spieluhr. Ein blaues Band tanzt im Takt. }
    aldous: Isolde, ich komme. Gestattet, ein letztes Mal.
    Er verbeugt sich vor der Uhr. Dann wird er durchsichtiger. Dann Schnee.
}
Mit dem letzten Schlag kehren die Zeitgäste heim.
hermione: Bis in der richtigen Woche. Ich schreibe es auf. Rückwärts.
hagrid: War 'ne Ehre. Und 'n Kuchen is auch noch da. { ate_rockcake: Für dich: der ganze Teller. }
slughorn: Weihnachtsclub! Ich schreibe Ihnen! Irgendwann! Oder gestern!
Neville winkt mit einer Kröte, die sehr nach Trevor aussieht. Peeves wirft Konfetti.
{ wrote_home: Auf deiner Schulter landet eine Eule. Sie hat einen Brief von zu Hause dabei. }
# choice_point: d24.last Die Uhr tickt. Leise, regelmäßig.
* [„Danke“ sagen.] # cid: d24.last.thanks
    ellis: Theorie vier! Sie ist ein Setzling! Sie antwortet, wenn man mit ihr redet!
* [Einfach zuhören.] # cid: d24.last.listen
    Tick. Tack. Ellis hält den Atem an. Dann lacht er leise und laminiert den Moment im Kopf.
- quill: Das letzte Türchen. Offen.
-> END
