# Tag 10 – Das Hausmeisterbüro

> Akt II · Verdacht · Ort `caretaker_office` · Musik `castle`

| | |
| --- | --- |
| **Kurz** | Quill hat Unterricht, also ermitteln Ellis und die Spielfigur allein: Verhör bei Grimsby. Im Büro steht ein zweiter Hausmeister aus einer anderen Zeit und sortiert Grimsbys Schlüssel um. Wer freundlich fragt, bekommt Grimsbys Logbuch und ein Geständnis: Er vermisst das Ticken. Am Ende fehlt am Schlüsselbrett genau ein Schlüssel – der zum Uhrturm. |
| **Entscheidungen** | `d10.cat` (`pet` / `keep`, Ton) · `d10.grimsby` (`kind` → `k08`, +1 `trust_grimsby` / `strict` −1 `trust_grimsby`) |
| **Hinweis** | `k08` Grimsbys Logbuch: In der Nacht war er wegen eines Rohrbruchs im Kerker (nur bei `kind`; entlastet Grimsby) |
| **Cameo** | **Argus Filch** (Hausmeister aus einer anderen Zeit) und **Mrs. Norris** (nur Erzählzeilen) |
| **Rätsel** | `p10` Der Schlüsselbund (`choice` mit Bild, 40 Punkte) |
| **Rückbezug** | `d02.grimsby` und Tag 3 über `trust_grimsby` (Begrüßung) · Tag 9: Grimsby pfeift im Takt der Uhr · `k03` Theos Notizbuch (Ellis' Verdacht) |
| **Türchen-Zauber** | Der Schlüsselbund wird zum Glöckchen |

## Beats

1. Grimsbys Büro. Ellis und die Spielfigur ermitteln allein, Quill hat Unterricht. Grimsby begrüßt je nach `trust_grimsby`.
2. Filch tritt aus dem Schatten, Mrs. Norris auf dem Arm. **Entscheidung 1:** die Katze streicheln oder Abstand halten.
3. Das Verhör. **Entscheidung 2:** freundlich (→ `k08`, Grimsby gesteht, dass er das Ticken vermisst) oder streng.
4. Filch hat das Schlüsselbrett umsortiert. Rätsel: Welcher Schlüssel gehört an den leeren Haken?
5. Der fehlende Schlüssel ist der zum Uhrturm. Seit der Nacht, in der die Uhr stehen blieb.
6. Die Schlüssel klingeln wie Glöckchen. Ellis verdächtigt Theo.

## Skript

```ink
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
```

## Rätsel `p10` – Der Schlüsselbund

- **Engine:** `choice` mit Bild (`figure`). Das Bild zeigt Grimsbys Schlüsselbrett: **3 × 3 Haken**, einer (unten rechts) ist leer. Darunter vier Antwortkarten mit je einem Schlüssel.
- **Merkmale jedes Schlüssels:** Bart (rund, eckig, Herz), Zähne (1, 2, 3), Metall (Messing, Silber, Eisen). Die Karten nennen die Merkmale auch als Text (nie nur über Farbe, Konzept 5.7).
- **Das System (nicht verraten):** In jeder Reihe und jeder Spalte kommt jeder Bart, jede Zahnzahl und jedes Metall genau einmal vor.

| | Spalte 1 | Spalte 2 | Spalte 3 |
| --- | --- | --- | --- |
| Reihe 1 | rund · 1 · Messing | eckig · 2 · Eisen | Herz · 3 · Silber |
| Reihe 2 | eckig · 3 · Eisen | Herz · 1 · Silber | rund · 2 · Messing |
| Reihe 3 | Herz · 2 · Silber | rund · 3 · Messing | **?** |

- **Antworten:** A) eckig · 1 · Messing · **B) eckig · 1 · Eisen** · C) rund · 1 · Eisen · D) eckig · 2 · Eisen. Jede falsche Antwort ist in genau einem Merkmal falsch. Per Skript geprüft: Von allen 27 denkbaren Schlüsseln passt nur „eckig · 1 · Eisen“; alle neun Schlüssel am Brett sind verschieden.
- **Intro (Grimsby):** „Dreißig Jahre, ein System. Und dann kommt einer aus einer anderen Zeit und hängt um.“
- **Hinweise:** 1) Schau dir nicht die Schlüssel an, sondern die Reihen. 2) In jeder Reihe gibt es jeden Bart genau einmal. Bei den Zähnen auch. 3) Und beim Metall. In der dritten Reihe fehlen also: eckig, ein Zahn, Eisen.
- **Super-Hinweis:** Der fehlende Schlüssel hat einen eckigen Bart und ist aus Eisen.
- **Lösungstext:** „Eckiger Bart, ein Zahn, Eisen. Grimsbys System: In jeder Reihe und jeder Spalte kommt jede Bartform, jede Zahnzahl und jedes Metall genau einmal vor.“

## Setups und Payoffs

| Setup in Tag 10 | Payoff |
| --- | --- |
| Der Uhrturm-Schlüssel fehlt seit der Nacht des Stillstands | Tag 13a/20: Theo gibt zu, ihn „geliehen“ zu haben, um nachts zu reparieren. Tag 21: Quill öffnet den Uhrturm trotzdem mit ihrem Teelöffel |
| `k08` Grimsbys Logbuch (Rohrbruch im Kerker) | Tag 23: entlastet Grimsby bei der Anklage |
| Grimsby gesteht, dass er das Ticken vermisst (nur `kind`) | Epilog: `trust_grimsby ≥ 1` → Grimsby zieht die Uhr summend auf |
| Mrs. Norris mag dich (nur `pet`) | Tag 24: Filch winkt beim Abschied der Zeitgäste, die Katze im Arm |
| Die Schlüssel klingeln wie Glöckchen | Tag 24: Alle Schlüssel des Schlosses läuten zum letzten Schlag |
