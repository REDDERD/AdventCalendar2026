INCLUDE globals.ink

// Tag 11 – Das Boot (Akt II). Ort: grounds_snow. Rätsel: p11.
=== day11 ===
# bg: grounds_snow
# music: outdoor
# spark: d11.s1 30 140
Es hat die ganze Nacht geschneit. Der Uhrturm trägt eine Zipfelmütze aus Schnee.
Von ihm führen zwei Fährten weg. Kleine Pfoten, die glitzern, zum Wald.
Feste Schuhe zum Archiv.
# show: quill right
# show: ellis left
ellis: Theorie fünf! Die Uhr hat sich eingeschneit. Das erklärt alles. Auch das Wetter.
quill: Es erklärt gar nichts, aber es klingt gemütlich.
# choice_point: d11.snow Ellis schaut sehnsüchtig auf den frischen Schnee.
* [Eine Schneeballschlacht anfangen.] # cid: d11.snow.play
    ~ bond_ellis += 1
    # toast: Ellis lacht zum ersten Mal ohne Theorie.
    ellis: Du triffst mit links! Ich dachte, das können nur Meisterduellanten!
* [Die Fährten genauer ansehen.] # cid: d11.snow.search
    # spark: d11.s3 120 150
    Zwischen den Pfotenabdrücken liegt ein glitzernder Krümel. Sonst nichts.
    quill: Sorgfältig. Und der Schnee darf es nicht haben.
- # sfx: blip
# hide: ellis
# show: hagrid center
Am Seeufer fuchtelt jemand Riesiges mit den Armen. Neben ihm ein Hund, groß wie ein Sofa.
hagrid: Ihr da! Gut! Ich brauch Hände! Rubeus Hagrid, Wildhüter. Das is Fang.
hagrid: Er is feige. Aber treu.
quill: Ein Gast aus einer anderen Zeit, nehme ich an?
hagrid: Dienstag, glaub ich. Oder 'n anderer.
Hinter ihm warten drei Hippogreife und drei Frettchen. Alle sechs sehen einander an.
Eins der Frettchen reckt die Nase. Blasiert. Es sieht aus, als wüsste sein Vater davon.
hagrid: Meine Herde muss rüber ins Winterquartier. Ich hab nur ein Boot. Zwei passen rein.
hagrid: Es rudert allein, sobald einer drinsitzt. Aber: Hippogreife sind einzeln höflich.
hagrid: In der Überzahl vergessen sie ihre Manieren. Auf einem Ufer, wo ein Frettchen steht,
hagrid: dürfen nie mehr Hippogreife stehen als Frettchen. Wo keins steht, is es egal.
ellis: Und wenn doch?
hagrid: Dann hab ich ein Frettchen weniger. Und Seidenschnabel ein schlechtes Gewissen.
# choice_point: d11.hagrid Hagrid hält dir einen Teller hin.
* [Einen Felsenkuchen essen.] # cid: d11.hagrid.eat
    ~ ate_rockcake = true
    # sfx: blip
    # toast: Ein Zahn wackelt. Ein bisschen.
    hagrid: Selbst gebacken! Zweiter Versuch. Der erste hat die Tür getroffen.
* [Höflich ablehnen.] # cid: d11.hagrid.decline
    hagrid: Is gut. Fang isst ihn. Fang is hart im Nehmen.
- { ate_rockcake: ellis: Du hast ihn gegessen. Ich schreibe das unter „Mut“. }
{ not ate_rockcake: ellis: Sehr vernünftig. Ich schreibe das unter „Zähne“. }
hagrid: Vorhin im Schnee: zwei Paar Stiefel, aber keiner drin. Nur so'n Schimmern drüber.
quill: Es ist ein merkwürdiges Jahr, Mr. Hagrid.
quill: Das erinnert mich an ein Rätsel über Wölfe und Küken …
hagrid: Wölfe? Hier gibt's nur Hippogreife. Die sind besser erzogen. Meistens.
# puzzle: p11
{ last_puzzle_first_try: hagrid: Alle sechs drüben, keine Feder zu viel! Gleich beim ersten Mal! }
{ not last_puzzle_first_try: hagrid: Ein paar Federn sind geflogen. Aber alle sind drüben. Das zählt. }
# sfx: spark
Im Schnee springt ein Schneemann auf. Er winkt mit einem Stock.
hagrid: Die kleine Fährte mit Glitzer, Richtung Wald? Die kenn ich.
hagrid: Ein winziger Kerl. Hat mir die Löffel geklaut. Alle zwölf.
# emote: quill dots
Quill greift an ihre Hutnadel. Der Teelöffel steckt noch. Sie atmet auf.
quill: Morgen der Astronomieturm. Von oben sehen wir, welche Fährte weiter reicht.
ellis: Von oben. Hoch. Mit Treppen.
# spark: d11.s2 220 120
-> END
