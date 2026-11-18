INCLUDE globals.ink

// Tag 12 – Der Astronomieturm (Akt II). Ort: astronomy_tower. Rätsel: p12. Routenwahl.
=== day12 ===
# bg: astronomy_tower
# music: outdoor
# spark: d12.s1 36 150
Zwölfter Dezember, kurz vor Mitternacht. Die Treppe zum Astronomieturm hat 284 Stufen.
# show: ellis left
# show: quill right
ellis: Hundertzwölf. Hundertdreizehn. Ich zähle nur. Ich schaue nicht runter. Hundertvierzehn.
quill: Von oben sehen wir, wohin die Fährten führen. Die Pfoten und die Schuhe.
{ bond_ellis >= 3: ellis: Wenn du vorgehst, gehe ich hinterher. Glaube ich. Ziemlich sicher. }
{ bond_ellis < 3: ellis: Geht ruhig vor. Ich komme nach. Irgendwann. Im Frühling. }
# choice_point: d12.courage Ellis klammert sich ans Geländer.
* [Ihm Mut machen.] # cid: d12.courage.encourage
    ~ bond_ellis += 1
    # toast: Ellis wird sich das merken.
    Du nimmst Ellis' Hand und zählst mit ihm weiter. Laut. Mit Betonung auf jeder Zahl.
    ellis: Zweihundertachtzig … zweihundertvierundachtzig! Ich bin oben! Ich bin ein Turm!
* [Vorausgehen. Er schafft das.] # cid: d12.courage.alone
    Du steigst voraus. Unten zählt Ellis weiter, ganz allein, aber immer lauter.
    Nach einer Weile taucht er auf, bleich, aber oben. Er sagt drei Minuten nichts.
- # show: luna center
Oben sitzt ein Mädchen im Schnee. Radieschen als Ohrringe, den Blick im Himmel.
luna: Oh, hallo. Ich benenne gerade die Sternbilder neu. Die alten Namen waren so ernst.
luna: Das dort ist die Verlegene Teekanne. Und das da drüben ist der Ritter.
# emote: quill ?
quill: Miss … Lovegood, nehme ich an? Aus einer anderen Zeit?
luna: Ich glaube, aus einer anderen Woche. Die Zeit hier hat Löcher. Wie ein guter Käse.
luna: Du hast Angst vor der Höhe, Ellis? Das ist vernünftig. Die Höhe hat auch Angst vor dir.
ellis: Wirklich?
luna: Nein. Aber jetzt geht es dir besser, oder?
# emote: ellis heart
luna: Und dein Patronus, {name}, wäre {personal("patronus")}. Das sieht man an den Augenbrauen.
luna: Der Ritter ist ganz dunkel. Man muss ihn in einem Zug nachzeichnen, sonst schläft er.
# emote: quill dots
quill: Das erinnert mich an ein Rätsel, das ich auf einer Sternwarte in Prag fand …
# puzzle: p12
{ last_puzzle_first_try: luna: Er ist wach! Und du hast ihn nicht einmal gekitzelt. }
{ not last_puzzle_first_try: luna: Er ist wach. Er hat ein bisschen geschnarcht, aber jetzt ist er wach. }
# sfx: spark
Der Ritter leuchtet auf. Sternschnuppen fallen und bilden für einen Moment Zahlen.
ellis: Eine Drei! Eine Null! Noch eine Null! Was soll das heißen?
luna: Sternschnuppen rechnen gern. Meistens falsch.
# hide: luna
Unten im Schnee glitzern die beiden Fährten im Mondlicht.
Die kleinen Pfoten führen in den Verbotenen Wald. Die Schuhe zum Ostflügel, zum Archiv.
quill: Jedes Rätsel hat eine Lösung, {pronoun_form("meine Liebe", "mein Lieber", "mein Gutes")}. Aber nicht jede liegt am selben Ort.
quill: Wir teilen uns auf. Eine Fährte für jeden Weg.
# spark: d12.s2 214 140
# choice_point: d12.route Welcher Fährte folgst du?
* [Mit Ellis den Pfoten in den Wald.] # cid: d12.route.forest
    ~ route = "forest"
    # toast: Morgen geht es in den Wald.
    ellis: Der Wald! Dunkel, unheimlich, voller Kreaturen. Und wenigstens ebenerdig.
* [Mit Quill den Schuhen ins Archiv.] # cid: d12.route.archive
    ~ route = "archive"
    # toast: Morgen geht es ins Archiv.
    quill: Das Archiv. Staub, Akten, Stille. Mein liebster Ort nach der Teeküche.
- quill: Morgen früh an der großen Eiche. Und Ellis: Hinunter sind es genauso viele Stufen.
ellis: Das hättest du mir nicht sagen müssen.
-> END
