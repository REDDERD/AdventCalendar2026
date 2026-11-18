INCLUDE globals.ink

// Tag 2 – Schwebende Kerzen (Akt I). Ort: great_hall. Rätsel: p02.
// Quelle: storyboard/tag-02.md. Abweichungen: Funken im 256 × 512-Raster (DECISIONS.md #32),
// Türchen-Zählung wie im Kalender (Tag 1 = erstes Türchen).
=== day02 ===
# bg: great_hall
# music: castle
# spark: d02.s1 214 150
Zweiter Dezember. Die Große Halle ist still, nur ein Eimer klappert.
# show: grimsby right
grimsby: Ruhe! Herrlich! Dreißig Jahre Tick, Tick, Tick. Und jetzt: nichts.
grimsby: Ich bin kein bisschen traurig. Ich putze nur. Stille staubt furchtbar.
# show: quill left
quill: Guten Morgen, Mr. Grimsby. Wir würden die Uhr gern untersuchen.
grimsby: Die Uhr gehört dem Schloss. Das Schloss gehört mir. Praktisch, oder?
# show: ellis center
{ bond_ellis >= 2: ellis: Theorie zwei! Du hast ja gesagt, du hörst zu. Also: }
{ bond_ellis < 2: ellis: Ich wollte Theorie zwei eigentlich nicht erzählen. Aber: }
ellis: Die Uhr hat einen Frosch im Hals. Deshalb hustet sie nicht mehr.
quill: Ellis. Eine Uhr hat keinen Hals.
ellis: Die Standuhr hat sogar einen sehr langen. Das ist ein Argument.
# emote: grimsby sweat
grimsby: Und was glotzt ihr so? Wollt ihr etwa Fußspuren auf meinem Boden hinterlassen?
# choice_point: d02.grimsby Grimsby schimpft über Dreck und Lärm.
* [Wir passen auf, versprochen.] # cid: d02.grimsby.polite
    ~ trust_grimsby += 1
    # toast: Grimsby wird sich das merken.
    grimsby: Hm. Manieren. Das gibt es noch? Man lernt nie aus.
* [Sie vermissen das Ticken sicher.] # cid: d02.grimsby.cheeky
    ~ trust_grimsby -= 1
    # toast: Grimsby wird sich das merken.
    # emote: grimsby !
    grimsby: Ich? Das Ticken? Pah! Wer sagt das? Wer hat das gesagt? Ellis?
    ellis: Ich habe nichts gesagt! Ich habe nur sehr laut gedacht!
- quill: Wenn Sie erlauben, Mr. Grimsby. Ich schaue mir nur das Gehäuse an.
# clue: k01
quill: Kratzer. Viele, kleine, in zwei Reihen. Mit Krallen, würde ich sagen.
grimsby: Mäuse. Haben wir hier. Seit Jahrhunderten. Sie zahlen keine Miete.
ellis: Mäuse mit Krallen aus Messing? Das ist die zweite Theorie wert!
# sfx: door
Mit einem Poltern kracht die Saaltür auf. Etwas Durchsichtiges schießt hinein.
# show: peeves center
peeves: Tick, tack, tuck, die Uhr hat Pech! Grimsby, wisch den Boden weg!
# emote: peeves note
Peeves, der Poltergeist, saust durch die Halle und pustet Kerze für Kerze aus.
Die schwebenden Weihnachtskerzen sacken zur Decke. Es wird gespenstisch dunkel.
grimsby: PEEVES! Das war die Weihnachtsbeleuchtung! Ich hänge dich an einen Haken!
peeves: Haken? Ich bin durchsichtig, Grimsby. Ich kann nicht hängen. Nur blubbern.
# choice_point: d02.peeves Peeves hängt kichernd an einem Kerzenleuchter.
* [Peeves anbrüllen.] # cid: d02.peeves.scare
    # emote: peeves !
    peeves: Huch! Ein Schreihals! Dann geh ich eben. Aber aus Prinzip nicht leise!
    # hide: peeves
    Peeves verschwindet laut quietschend in der Wand. Das Echo hört man noch lange.
* [Mit Peeves Kerzen auspusten.] # cid: d02.peeves.join
    ~ peeves_friend = true
    # toast: Peeves wird sich das merken.
    # emote: peeves heart
    peeves: Endlich! Jemand mit Humor! Du bist ab jetzt mein liebster Neuer!
    grimsby: Das wird ein sehr langer Dezember.
    peeves: Ich schulde dir was. Ich vergesse nie, wem ich was schulde. Fast nie.
    # hide: peeves
    Peeves wirbelt davon. Zurück bleiben ein leises Kichern und sehr viel Dunkelheit.
- quill: Nun denn. Ohne Licht sehen wir nichts, und mit Sehen löst man Rätsel.
quill: Die Kerzen reagieren, wenn man ihre Nachbarn berührt. Das kenne ich gut.
# emote: quill dots
quill: Das erinnert mich an ein Rätsel aus meiner Referendarszeit …
# puzzle: p02
{ last_puzzle_first_try: quill: Beim ersten Versuch. Ich merke mir Ihren Namen, {name}. }
{ not last_puzzle_first_try: ellis: Eine Kerze war gemein. Ich nenne sie Kevin. }
# sfx: door
Kaum brennt die letzte Kerze, klickt es im Uhrkasten. Das zweite Türchen springt auf.
Heraus rieseln Zimtsterne. Hunderte. Sie prasseln auf die Köpfe und die Tische.
# emote: ellis heart
ellis: ZIMTSTERNE! Ich fange alle! Ich wusste, dass Schnee ein Anfang ist!
grimsby: Zimtsterne im Haar. Das dauert Wochen, das rauszukämmen.
# emote: grimsby note
Er sammelt einen Stern auf, sieht sich um und steckt ihn in die Tasche.
# spark: d02.s2 40 230
# hide: grimsby
quill: Gestern ein Klicken, heute Gebäck. Ein Fortschritt. Aber die Uhr bleibt stehen.
ellis: Habt ihr das gesehen? Da hinten! Etwas Silbriges hat sich vor der Uhr verbeugt!
# emote: quill ?
quill: Die Halle ist siebenhundert Jahre alt, Ellis. Da spukt es mal.
ellis: Aber es hat sich VERBEUGT. Gespenster verbeugen sich nicht. Die glotzen nur.
quill: Dann hat es Manieren. Das schadet in diesem Schloss selten. Bis morgen.
-> END
