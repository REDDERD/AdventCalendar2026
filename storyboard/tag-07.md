# Tag 7 – Die Eulerei

> Akt I · Die stehende Uhr · Ort `owlery` · Musik `outdoor`

| | |
| --- | --- |
| **Kurz** | Quill hat einen anonymen Brief bekommen: „Lasst die Uhr ruhen.“ In der Eulerei sucht die Gruppe nach der Eule, die ihn gebracht hat. Dabei wartet eine strenge weiße Eule und eine, die nur ungenau landet. Der Brief ist an den Rändern eiskalt. |
| **Entscheidungen** | `d07.letter` (`give` / `keep` → Gegenstand `anonymous_letter`) · `d07.home` (`write` → `wrote_home` / `later`, Ton) |
| **Gegenstand** | `anonymous_letter` (nur bei `keep`) |
| **Cameo** | **Hedwig** (weiße Eule) · **Errol** (graue Eule, Landetechnik: ungenau). Beide nur als Namensschilder und Erzählzeilen, keine Sprecher |
| **Persönlich** | `personal("insideJokes")` (Zeile von Ellis, entfällt, wenn leer) |
| **Rätsel** | `p07` Eulen-Nummern (`input`, 30 Punkte) |
| **Rückbezug** | `d06.theo` über `trust_theo`: Ellis fragt, ob der Brief von Theo sein könnte · `k02` (Kälte) |
| **Türchen-Zauber** | Alle Eulen tragen rote Schleifen und tauschen ihre Briefe versehentlich gegen Weihnachtskarten |

## Beats

1. Eulerei im Schnee. Namensschilder an den Sitzstangen: „Hedwig – bitte nicht streicheln“, „Errol – bitte nicht werfen“.
2. Quill zeigt den Brief. Er ist an den Rändern eiskalt. **Entscheidung 1:** Quill den Brief überlassen oder selbst behalten.
3. Ellis' Verdächtigungen (Theo?). Die Eulen sitzen nach Ringnummern, eine Stange ist leer.
4. Rätsel: Welche Nummer fehlt? Sie verrät, welche Eule den Brief aus dem Schloss geholt hat.
5. **Entscheidung 2:** Du bekommst Gelegenheit, einen Brief nach Hause zu schicken (`wrote_home`).
6. Ergebnis: Eule Nr. 38 ist die Hauspost-Eule für Gewächshaus und Große Halle. Der Brief kam aus dem Schloss. Ellis' Vermutung: Marens Eulendienst.

## Skript

```ink
INCLUDE globals.ink

// Tag 7 – Die Eulerei (Akt I). Ort: owlery. Rätsel: p07.
=== day07 ===
~ temp joke = personal("insideJokes")
# bg: owlery
# music: outdoor
# spark: d07.s1 212 140
Siebter Dezember. Die Eulerei steht offen, Schnee weht durch die Bögen.
An den Sitzstangen hängen Schilder: „Hedwig – bitte nicht streicheln“.
Daneben: „Errol – bitte nicht werfen“. Errol dreht sich im Schlaf und fällt vom Stab.
# show: quill right
# show: ellis left
{ joke != "": ellis: {joke} }
quill: Ellis, bitte. Ich habe heute Post bekommen. Ungebetene Post.
# emote: quill dots
quill: Kein Absender, kein Siegel. Nur ein Satz: „Lasst die Uhr ruhen. Ein Freund.“
{ clues ? k02: ellis: Der Brief ist so kalt wie das Geländer von der Treppe! Schaut! Reif am Rand! }
{ not (clues ? k02): ellis: Der Brief ist eiskalt! Wer schickt Post, die friert? }
quill: Eulenfedern sind feucht. Das Pergament hat dicke Winterluft eingefangen.
ellis: Das ist kein Eulenwasser. Das ist Eis. Ich studiere Eis. Seit gestern.
# choice_point: d07.letter Was geschieht mit dem anonymen Brief?
* [Quill den Brief geben.] # cid: d07.letter.give
    quill: Kluge Entscheidung, {pronoun_form("meine Liebe", "mein Lieber", "mein Gutes")}. Ich schaue ihn mir an.
    quill: Und wenn ich ihn nicht verstehe, bitte ich Schulleiterin Thornbury. Die versteht alles.
* [Den Brief selbst einstecken.] # cid: d07.letter.keep
    # item: anonymous_letter
    # toast: Neuer Gegenstand: Anonymer Brief
    quill: Ah. Sie wollen ihn behalten? Gut. Ein Rätsel ist besser in zwei Taschen als in einer.
- ellis: Der Absender ist bestimmt Theo! Pyjama, Werkzeug, nachts! Der Typ hat Motiv!
{ trust_theo >= 1: quill: Theo hat seine Hilfe angeboten, Ellis. Wer helfen will, verfasst keine Drohbriefe. }
{ trust_theo < 1: quill: Theorien ohne Beweise sind wie Eulen ohne Flügel. Sie kommen nicht weit. }
Eine große weiße Eule mustert dich streng. Sie scheint später über dich zu schreiben.
Eine zerzauste graue Eule landet kopfüber im Heu. Sie macht das nicht zum ersten Mal.
quill: Die Eulen sitzen nach Ringnummern. Eine Stange ist leer. Das ist unsere Eule.
# emote: quill dots
quill: Das erinnert mich an ein Rätsel aus meiner Zeit als Posthalterin …
# puzzle: p07
{ last_puzzle_first_try: ellis: Zahlenfolgen! Ich liebe Zahlenfolgen. Fast so sehr wie Erklärungen. }
{ not last_puzzle_first_try: ellis: Zahlen sind gemein. Eulen auch. Aber Eulen sind flauschiger. }
# sfx: spark
Auf der leeren Stange steht „38“. Das Schild daneben: „Hauspost Gewächshaus und Halle“.
quill: Der Brief kam also aus dem Schloss. Nicht von außen. Das ist ein Anfang.
Eine kleine Eule mit der Nummer 38 flattert herein. Ihr Gefieder ist weiß bepudert.
# emote: ellis !
ellis: Reif im Gefieder! Sie war an der Halle! Ich verhöre sie! Wo waren Sie in der Nacht?
Die Eule blinzelt einmal. Dann putzt sie sich in aller Ruhe eine Feder.
ellis: Aussage verweigert. Typisch Profi.
quill: Eulen sagen nichts, Ellis. Sie tragen nur. Das macht sie zu den besten Mitwissern.
ellis: Wer führt den Eulendienstplan? Maren Holloway. Hufflepuff. Überfreundlich.
# emote: ellis !
ellis: Ich sage nichts. Ich sage nur: Sie hat mir gestern ganze drei Kekse angeboten.
quill: Das ist nicht verdächtig, Ellis. Das ist Hufflepuff.
# choice_point: d07.home Die weiße Eule wartet, ob du Post hast.
* [Einen Brief nach Hause schreiben.] # cid: d07.home.write
    ~ wrote_home = true
    # toast: Hedwig übernimmt die Post.
    Du kritzelst ein paar Zeilen nach Hause. Die weiße Eule nimmt den Brief mit Würde.
    Sie wirft Errol einen Blick zu. Errol fällt wieder von der Stange.
* [Später. Die Uhr geht vor.] # cid: d07.home.later
    Die weiße Eule wartet noch einen Moment. Dann dreht sie sich um. Das war deutlich.
- quill: Wir klopfen morgen im Gewächshaus. Sie wollen sicher auch wissen, wer so etwas schreibt.
-> END
```

## Rätsel `p07` – Eulen-Nummern

> Schwerer als die erste Skizze (DECISIONS.md #44, #49). Umgesetzt in `src/content/puzzles/p07.json`. Die Antwort bleibt **38**, weil das Skript sie braucht.

- **Engine:** `input` (Zahl, Pixel-Tastatur) mit Bild: fünf Eulen auf einer Stange mit den Ringnummern **1, 4, 6, 11, 21**, der sechste Platz ist leer („?“).
- **Regel:** Jede Nummer ist die **Summe der drei davor** (1 + 4 + 6 = 11, 4 + 6 + 11 = 21, 6 + 11 + 21 = **38**).
- **Falle:** „Verdoppeln und eins abziehen“ passt bei 6 → 11 → 21 und ergibt 41 – scheitert aber schon bei 4 → 6.
- **Intro (Quill):** „Eulen sind ordentliche Wesen. Sie sitzen nach Ringnummer. Nur eine fehlt, und das war ihre Eule.“
- **Hinweise:** 1) Verdoppeln und eins abziehen passt bei 6 → 11 → 21, aber nicht bei 4 → 6. 2) Schau nicht nur auf die Nummer davor. 3) 1 + 4 + 6 = 11.
- **Super-Hinweis:** Jede Nummer ist die Summe der drei Nummern davor.
- **Lösungstext:** „38 = 6 + 11 + 21. Jede Ringnummer ist die Summe der drei davor. Wer verdoppelt und eins abzieht, landet bei 41 – das passt aber schon bei 4 und 6 nicht.“

## Rückbezüge und Hinweise für die Umsetzung

- **`personal("insideJokes")`:** Der Wert ist ein Satz oder leer. Wenn die App keinen Wert liefert, gibt sie `""` zurück, dann entfällt die Zeile (`{ joke != "": … }`). Der Admin pflegt das Feld bis 27.11. `[PRS-3]`.
- **Hedwig und Errol** brauchen keine Sprites und keine Sprecher-IDs. Sie erscheinen als Schilder und Erzählzeilen. Falls Grafik übrig ist: eine weiße und eine graue Eule als Hintergrundsprite der Eulerei.

## Setups und Payoffs

| Setup in Tag 7 | Payoff |
| --- | --- |
| Der Brief ist an den Rändern eiskalt („Ein Freund“) | Tag 23: `anonymous_letter` + Reif = Beweis für Aldous (er schrieb ihn, weil er die Uhr schützen wollte) |
| Eule 38, Hauspost für Gewächshaus und Halle | Tag 8: Maren steht unter Verdacht (falsche Fährte); Tag 16: Maren hat die Eulenpläne nur geführt |
| `wrote_home` (Brief nach Hause) | Tag 24: Antwort von zu Hause im Abspann-Brief |
| Namensschilder „Hedwig“ / „Errol“ | Tag 24: die Eulen tragen Weihnachtskarten durch die Halle |
| Ellis' Verdacht auf Theo | Tag 13a: Theo wird entlastet; Tag 20: Theo verbündet sich |
