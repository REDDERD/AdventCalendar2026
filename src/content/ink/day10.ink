INCLUDE globals.ink

// Tag 10 – Das Hausmeisterbüro (Akt II). Ort: caretaker_office. Rätsel: p10.
=== day10 ===
# bg: caretaker_office
# music: castle
# spark: d10.s1 40 150
Zehnter Dezember. Grimsbys Büro riecht nach Bohnerwachs, Katzenfutter und Laune.
# show: ellis left
ellis: Quill hat Unterricht. Heute sind wir die Ermittler. Ich habe einen Notizblock. Zwei.
# show: grimsby right
grimsby: Klopfen! Man klopft! Auch wenn die Tür offen steht. Gerade dann.
{ trust_grimsby >= 1: grimsby: Ach, du bist es. Mit Manieren. Setz dich. Nicht auf den Eimer. }
{ trust_grimsby <= -1: grimsby: Ach, du. Der mit dem Ticken. Setz dich. Gern auf den Eimer. }
{ trust_grimsby == 0: grimsby: Ihr wollt was. Alle wollen was. Keiner will mal nur Tee. }
ellis: Wir haben Kekse mitgebracht. Ich habe gehört, das wirkt bei Hausmeistern.
# show: filch center
Aus dem Schatten tritt ein zweiter Hausmeister. Hager, eine magere Katze im Arm.
filch: Argus Filch. Hausmeister. Hier nur zu Gast. Die Zeit hat mich ausgespuckt.
filch: Und das ist Mrs. Norris. Sie merkt sich Gesichter. Und Krümel.
grimsby: Er sortiert meine Schlüssel um. Seit drei Tagen. Zwei Hausmeister, ein Brett.
# choice_point: d10.cat Mrs. Norris mustert dich mit gelben Augen.
* [Mrs. Norris streicheln.] # cid: d10.cat.pet
    # emote: filch heart
    Die Katze schnurrt. Filch sieht aus, als wolle er weinen. Vor Rührung oder vor Neid.
    filch: Sie mag niemanden. Sie mag dich. Ich weiß nicht, was ich davon halten soll.
* [Lieber Abstand halten.] # cid: d10.cat.keep
    filch: Klug. Sie beißt nicht. Sie meldet nur.
- # hide: filch
Filch schlurft hinaus. Die Katze sieht sich in der Tür noch einmal um. Sehr lange.
ellis: Mr. Grimsby, wo waren Sie in der Nacht, als die Uhr stehen blieb?
grimsby: Im Bett. Wie jeder anständige Mensch. Mit Ohrstöpseln. Wegen des Tickens.
ellis: Und warum pfeifen Sie seit Tagen im Takt einer Uhr?
# emote: grimsby sweat
# choice_point: d10.grimsby Grimsby verschränkt die Arme.
* [Freundlich nachfragen.] # cid: d10.grimsby.kind
    ~ trust_grimsby += 1
    # toast: Grimsby wird sich das merken.
    Grimsby schweigt lange. Dann zieht er ein dickes Buch aus der Schublade.
    # clue: k08
    grimsby: Mein Logbuch. In der Nacht war ich im Kerker. Rohrbruch. Bis zum Morgengrauen.
    grimsby: Und ja. Ich vermisse das Ticken. Dreißig Jahre schläft man damit ein.
    { trust_grimsby >= 2: grimsby: Ohne Ticken höre ich mein eigenes Herz. Das ist kein Vergnügen. }
* [Streng auf Antworten drängen.] # cid: d10.grimsby.strict
    ~ trust_grimsby -= 1
    # toast: Grimsby wird sich das merken.
    # emote: grimsby !
    grimsby: Ein Verhör? In meinem Büro? Raus! Gleich. Erst nach dem Brett.
    ellis: Er sagt „gleich“. Das ist bei Hausmeistern fast schon herzlich.
- grimsby: Filch hat mein Schlüsselbrett durcheinandergebracht. Ich hänge nach System!
grimsby: Drei Reihen, drei Haken. Ein Haken ist leer. Welcher Schlüssel gehört dahin?
# emote: ellis dots
ellis: Quill würde jetzt sagen: Das erinnert mich an ein Rätsel. Also: Es erinnert mich!
# puzzle: p10
{ last_puzzle_first_try: grimsby: Gleich beim ersten Mal. Du hättest Hausmeister werden können. }
{ not last_puzzle_first_try: grimsby: Na also. Ein System sieht man nicht beim ersten Blick. }
# sfx: spark
Grimsby greift nach dem leeren Haken. Eckiger Bart, ein Zahn, Eisen. Er wird blass.
grimsby: Der Schlüssel zum Uhrturm. Weg. Seit der Nacht, in der die Uhr stehen blieb.
# emote: ellis !
ellis: Jemand hat ihn genommen! Jemand mit Händen! Das schränkt die Geister schon mal ein.
# sfx: blip
Da beginnen die übrigen Schlüssel zu klingeln. Hell, wie kleine Glöckchen.
# spark: d10.s2 210 180
grimsby: Das hat er seit dreißig Jahren nicht gemacht. Raus jetzt. Ich muss … putzen.
{ clues ? k03: ellis: Theo hat ein Notizbuch voller Zahnräder. Wer repariert, braucht einen Schlüssel. }
{ not (clues ? k03): ellis: Wer nachts zur Uhr will, braucht einen Schlüssel. Oder sehr viel Mut. }
-> END
