INCLUDE globals.ink

// Tag 15 – Was glänzt (Akt II). Routen-Knoten day15_forest / day15_archive [STR-1]. Rätsel: p15w / p15a.
// Quelle: storyboard/tag-15.md. Rätsel: p15w Waage mit neun Galleonen (custom:weigh), p15a acht Porträts, ein Original (tap mit claims).
=== day15 ===
{ route == "archive": -> day15_archive }
-> day15_forest

=== day15_forest ===
# bg: niffler_burrow
# music: outdoor
# spark: d15w.s1 40 150
Fünfzehnter Dezember. Die Zimtkrümel enden an einer dicken Wurzel.
Darunter führt ein Loch in die Erde.
# show: ellis left
ellis: Ein Bau. Ein Bau mit Keksen davor. Ich schreibe: Bau mit Keksen.
ellis: Das ist ein guter Anfang.
{ items ? lantern:
    # spark: d15w.s4 200 250
    Du hältst die Laterne ins Loch. Etwas funkelt zurück. Am Eingang liegt ein Funke.
}
An einem Zweig hängt ein gelb-schwarzer Wollfaden. Ellis nimmt ihn zwischen zwei Finger.
ellis: Gelb und schwarz. Das sind die Farben von … nein. Das kann nicht sein.
ellis: Ich schweige.
Drinnen glitzert es von der Decke bis zum Boden. Knöpfe, Münzen, Löffel, ein Monokel.
Mitten im Haufen sitzt ein kleiner schwarzer Fellball mit Entenschnabel und dicken Backen.
# show: knopf right
knopf: Quiek.
# clue: k05
ellis: Ein Niffler! Ich habe darüber gelesen! Ich habe nie einen gesehen.
ellis: Er ist … so klein!
# choice_point: d15w.knopf Knopf klammert sich an einen goldenen Knopf.
* [Sanft die Hand ausstrecken.] # cid: d15w.knopf.gentle
    Knopf schnuppert, hüpft auf deine Hand und frisst einen Krümel. Er ist weich wie Samt.
* [Nach ihm greifen.] # cid: d15w.knopf.chase
    Knopf quiekt, rollt sich ein und rast zwischen deinen Beinen hindurch. Der Haufen klirrt.
    ellis: Er hat meinen Stift. Den mit dem Radiergummi. Den habe ich noch nie benutzt.
- # show: newt center
Hinter euch rumpelt ein Koffer.
Ein Mann mit Mantel und Sommersprossen steigt aus, als wäre das normal.
newt: Verzeihung! Ich habe ihn eben verloren. Oder gefunden. Die Zeit ist hier rutschig.
newt: Newt Scamander, Magizoologe. Und Nifflers sind keine Diebe. Sie sind Sammler.
newt: Ein Unterschied.
newt: Dieser hier wird gefüttert. Zimt, Haferflocken.
newt: Wer ihn füttert, hat einen warmen Ofen.
# choice_point: d15w.newt Newt streichelt Knopf mit einem Finger.
* [Er soll bei seiner Freundin bleiben.] # cid: d15w.newt.stay
    newt: Das dachte ich auch. Er schaut nicht mich an, wenn er an Kekse denkt.
* [Newt soll ihn mitnehmen.] # cid: d15w.newt.take
    newt: Ich könnte. Aber er sucht jemanden. Das sehe ich an seinen Ohren. Ich lasse ihn.
- newt: Er hat auch Galleonen gesammelt. Neun liegen hier in einer Reihe.
newt: Acht sind aus Gold. Eine ist ein Schokotaler in Goldfolie.
newt: Knopf riecht den Unterschied. Ich nicht.
newt: Meine Waage ist geliehen. Sie klemmt nach zwei Wägungen.
newt: Helft ihr mir?
ellis: Zwölf Löffel. Das sind Hagrids. Ich habe nachgezählt. Zweimal. Drei Mal.
# puzzle: p15w
{ last_puzzle_first_try: newt: Zwei Wägungen und der Schokotaler ist erwischt. Sie denken in Haufen wie ein Niffler. }
{ not last_puzzle_first_try: newt: Der Schokotaler hat sich versteckt. Das tun sie gern. Aber Sie haben ihn gefunden. }
# sfx: spark
Vom Wurzelwerk regnet es Schokotaler. Knopf fängt jeden und schmatzt zufrieden.
ellis: Wenn er sammelt und nicht stiehlt, wer hat das Zahnrad dann hingebracht?
ellis: Oder vergessen?
# spark: d15w.s2 214 140
-> END

=== day15_archive ===
# bg: portrait_gallery
# music: castle
# spark: d15a.s1 206 150
Fünfzehnter Dezember.
Die Galerie der Porträts ist lang, kalt und voller Leute, die zuhören.
# show: quill right
quill: Der Brief sprach von „meinem Ritter“.
quill: Laut Akte hängt sein Bildnis ganz am Ende dieses Gangs.
{ items ? archive_key:
    # spark: d15a.s4 40 240
    Du ziehst den kleinen Archivschlüssel hervor. Ein Seitengitter springt auf.
    Das spart vierzig Minuten.
    quill: Ein Schlüssel, der Zeit schenkt. Isolde hätte ihn gemocht.
}
# show: dumbledore left
dumbledore: Guten Abend. Zitronenbonbon? Ich habe sie schon seit längerer Zeit.
dumbledore: Also seit immer.
dumbledore: Ich gebe nie Rat. Ich wundere mich nur laut. Zum Beispiel:
dumbledore: Warum friert eine Uhr, die nirgends kalt ist?
# choice_point: d15a.dumbledore Das Porträt hält dir ein Bonbon entgegen.
* [Ein Zitronenbonbon nehmen.] # cid: d15a.dumbledore.take
    Es schmeckt nach Sonne.
    Das Porträt zwinkert so freundlich, dass dir fast ein Gedanke kommt.
* [Höflich ablehnen.] # cid: d15a.dumbledore.decline
    dumbledore: Gut. Ablehnen ist auch eine Antwort. Meistens sogar die ehrlichste.
- # hide: dumbledore
Am Ende des Gangs hängt ein Ritter in Silber. Mit gerader Nase und unruhigen Augen. 1726.
# show: aldous center
Davor steht, durchscheinend und sehr gerade, Sir Aldous Frostbart.
Er sieht sich selbst an.
aldous: Fürwahr. So sah ich aus. Ich weiß nicht, ob ich ihn vermisse. Oder ob er mich.
# choice_point: d15a.aldous Aldous betrachtet sein gemaltes Gesicht.
* [Ihn nach dem Ritter fragen.] # cid: d15a.aldous.ask
    ~ trust_aldous += 1
    # toast: Aldous wird sich das merken.
    aldous: Er war jung und hat geglaubt, dass Bleiben ein Verdienst ist.
    aldous: Gestattet, ich gehe nun.
* [Schweigen und warten.] # cid: d15a.aldous.silent
    Aldous verbeugt sich knapp. Er wirkt erleichtert. Und ein wenig enttäuscht.
- # hide: aldous
Ein Hauch Frost bleibt am Rahmen zurück. Der Lack knistert leise.
quill: Acht Bildnisse des Ritters hängen hier. Nur eines ist von 1726.
quill: Die Rahmen sprechen. Das Original sagt immer die Wahrheit, jede Kopie lügt.
quill: Wer lügt, sagt etwas Falsches. Man muss es nur umdrehen.
# puzzle: p15a
{ last_puzzle_first_try: quill: Bild sieben. Beim ersten Versuch. Man sieht, wie sich Ihr Blick sammelt. }
{ not last_puzzle_first_try: quill: Ein Irrtum auf dem Weg zum Original. Das ist nur menschlich. }
# sfx: spark
Das siebte Bildnis tritt im Rahmen vor. Die anderen sieben verstummen.
# clue: k07
quill: Das Band am Arm in Isoldes Farben. Der Uhrenschlüssel am Gürtel. Und das Jahr:
quill: 1726.
quill: Er war ihr Ritter. Und er hat sie nie vergessen.
Schokotaler regnen in die Rahmen.
Die Porträts fangen sie auf und tun, als sei nichts gewesen.
# spark: d15a.s2 40 140
-> END
