INCLUDE globals.ink

// Tag 13 – Zwei Wege (Akt II). Routen-Knoten day13_forest / day13_archive [STR-1]. Rätsel: p13w / p13a.
// Quelle: storyboard/tag-13.md.
=== day13 ===
{ route == "archive": -> day13_archive }
-> day13_forest

=== day13_forest ===
# bg: forest_edge
# music: outdoor
# spark: d13w.s1 40 150
Dreizehnter Dezember. Am Waldrand riecht der Schnee nach Tannennadeln und Abenteuer.
# show: ellis left
ellis: Ich bin ganz ruhig. Ich habe Notizen, Proviant und die Mütze meiner Cousine Hortensia.
ellis: Gegen Bären, sagt sie. Ich glaube, es sind Ohrenwärmer.
{ ate_rockcake: ellis: Wie geht es deinem Zahn? Dem von Hagrid? Ich frage nur für die Notizen. }
Die kleinen Pfotenabdrücke führen zwischen zwei Eichen hindurch. Sie glitzern leicht.
Daneben liegt ein Krümel im Schnee. Ellis hebt ihn auf und schnuppert daran.
ellis: Zimt. Ein Zimtkeks. Wer verliert mitten im Wald Gebäck?
# choice_point: d13w.lantern Im Wald wird es früh dunkel.
* [Die Laterne anzünden und mitnehmen.] # cid: d13w.lantern.on
    # item: lantern
    # toast: Neuer Gegenstand: Laterne
    Du zündest die Laterne an. Der Schnee wird warm und gelb.
    ellis: Sehr vernünftig. Das nennt man Vorsorge. Ich nenne es Angst mit Plan.
* [Im Dunkeln gehen und genau hinsehen.] # cid: d13w.lantern.off
    # spark: d13w.s3 196 250
    Nach einer Weile gewöhnen sich deine Augen. Zwischen den Wurzeln blinkt etwas auf.
    ellis: Du siehst im Dunkeln? Das ist entweder Talent oder eine Krankheit. Beides interessant.
-
{ items ? bookmark:
    # spark: d13w.s4 120 330
    Isoldes Lesezeichen in deiner Tasche wird warm. Du findest einen Funken im Moos.
}
Zwischen den Stämmen steht ein Zentaur. Er sieht nicht uns an, sondern den Himmel.
Er sagt, ohne den Kopf zu drehen: „Mars ist hell heute. Das bedeutet Besuch.“
ellis: Wir sind der Besuch. Glaube ich. Bei Zentauren weiß man es nie.
# choice_point: d13w.centaur Der Zentaur versperrt den Pfad mit seinem Bogen.
* [Ihn nach den Pfotenspuren fragen.] # cid: d13w.centaur.ask
    „Der Kleine sammelt“, sagt er. „Er stiehlt nicht. Er kann nur nicht anders.“
    ellis: Er sammelt. Das schreibe ich auf. Unterstrichen. Zweimal.
* [Höflich warten, bis er spricht.] # cid: d13w.centaur.wait
    Du wartest. Der Zentaur nickt kaum merklich. Hier zählt das als Höflichkeit.
- „Die Herde kennt viele Wege durchs Gehölz. Nenne mir ihre Zahl, und ich öffne das Gatter.“
{ pet == "owl": Deine Eule sitzt auf seinem Bogen und zählt mit den Krallen. Sie kommt auf mehr als zehn. }
{ pet == "cat": Deine Katze beobachtet die Bäume. Sie meint, drei davon seien nur Kulisse. }
{ pet == "toad": Deine Kröte quakt bei jedem Baum. Sie zählt sie als Hindernisse, nicht als Wege. }
# emote: ellis dots
ellis: Quill würde sagen: Das erinnert mich an ein Rätsel.
ellis: Mich erinnert es an Hausaufgaben.
# puzzle: p13w
{ last_puzzle_first_try: Der Zentaur verbeugt sich tief. „Die Sterne hatten recht.“ }
{ not last_puzzle_first_try: Der Zentaur seufzt. „Beinahe. Aber der Wald ist geduldig.“ }
# sfx: spark
Das Gatter schwingt auf. Über uns springen Glühwürmchen an.
Sie hängen sich wie Lichterketten in die Zweige.
ellis: Der Wald dekoriert! Ohne Genehmigung!
ellis: Die Pfoten führen tiefer hinein. Und überall Zimtkrümel.
ellis: Wer auch immer das ist, er wird gefüttert. Von jemandem mit Backofen.
# spark: d13w.s2 214 120
-> END

=== day13_archive ===
# bg: archive
# music: castle
# spark: d13a.s1 200 150
Das Archiv liegt im Ostflügel. Aktenschränke bis zur Decke und eine Stille, die zuhört.
# show: quill right
quill: Dreizehnter Dezember. Die Schuhe führten hierher. Tee? Er ist noch warm.
quill: Ellis ist im Wald. Er trägt eine Mütze mit Ohrenklappen. Ich habe nichts gesagt.
Auf dem Pult steht ein Karteikasten, der sich verbeugt wie ein sehr alter Butler.
# choice_point: d13a.archivist Der Karteikasten wartet auf eine Anfrage.
* [Höflich um die Tickwell-Akte bitten.] # cid: d13a.archivist.polite
    Eine Schublade gleitet auf. „Sehr wohl.“
    Der Kasten klingt zufrieden, soweit Kästen das können.
* [Selbst in den Schubladen wühlen.] # cid: d13a.archivist.search
    Schubladen knallen, Zettel regnen. Der Kasten sagt: „Das wird vermerkt.“
    quill: Es wurde vermerkt. Wir sehen es später.
- # show: theo left
Hinter einem Regal klappert es. Theo Ashcombe, Ölfleck auf der Nase, drei Ordner im Arm.
theo: Ich suche … Hausaufgaben. Dringend. Im Archiv. Nachts. Wie jeder.
quill: Mr. Ashcombe, die Ordner sind die Familienakte Tickwell.
{ items ? bookmark:
    # spark: d13a.s3 120 320
    theo: Das Lesezeichen! Es hing früher am Pult. Wo habt ihr es her?
}
# emote: theo dots
# choice_point: d13a.theo Theo drückt die Ordner an sich.
* [Theo offen fragen.] # cid: d13a.theo.ask
    ~ trust_theo += 1
    # toast: Theo wird sich das merken.
    theo: Na gut. Isolde war meine Vorfahrin. Siebte Generation. Das wusste ich nicht immer.
    { trust_theo >= 1: theo: Und den Turmschlüssel habe ich geliehen. Nur zum Reparieren. Ich bringe ihn zurück. }
* [Allein weitersuchen.] # cid: d13a.theo.alone
    # item: archive_key
    # toast: Neuer Gegenstand: Archivschlüssel
    Während Theo seine Ordner rettet, findest du im Pult einen kleinen Schlüssel.
    theo: Hey! Der gehört … niemandem. Behaltet ihn.
- quill: Der Kasten hat die Karten der Familie durcheinandergebracht. Sieben Generationen.
{ pet == "owl": Deine Eule sitzt auf dem Pult und blättert mit dem Schnabel. Sie fängt hinten an. }
{ pet == "cat": Deine Katze legt sich auf die Karten. Eine ganz bestimmte. Dann schläft sie ein. }
{ pet == "toad": Deine Kröte hüpft auf die letzte Karte. Sie scheint zu wissen, wohin es führt. }
quill: Das erinnert mich an ein Rätsel aus meiner eigenen Familie. Sie war schlecht sortiert.
# puzzle: p13a
{ last_puzzle_first_try: theo: Die Reihenfolge stimmt. Beim ersten Mal. Ich habe sie nie so schnell gesehen. }
{ not last_puzzle_first_try: theo: Fast. Die Karten werden nicht gern umsortiert. Sie sind von 1726. }
# sfx: spark
Aus der letzten Karte fällt ein gefalteter Brief. Das Siegel ist gesprungen.
# clue: k06
quill: „Mein Ritter.“ Nicht an Theos Familie. An einen Ritter.
quill: „Dreihundert Winter lang wird die Uhr deine Wache sein.
quill: Ein Fremder wird die Stunde schlagen, wenn ihr bereit seid.“
quill: Unterschrieben mit I.
# emote: theo !
theo: Der Fremde. Die Uhr hat geschlagen, als ihr kamt. Ich stand daneben.
Im Archiv tanzen Leuchtmotten wie Lichterketten durch die Regale.
# spark: d13a.s2 214 130
-> END
