# Tag 4 – Die Bibliothek

> Akt I · Die stehende Uhr · Ort `library` · Musik `castle`

| | |
| --- | --- |
| **Kurz** | Recherche über die Uhrmacherin Isolde Tickwell. Madam Pince wacht, Ellis klemmt auf einer Bibliotheksleiter fest, und eine Besucherin mit sehr vielen Büchern erklärt Quill, was „Zeitfransen“ sind. Am Ende stellt sich ein Hausgeist vor, der Isoldes Vornamen ein bisschen zu zärtlich ausspricht. |
| **Entscheidungen** | `d04.pince` (`quiet` / `chat`, Ton) · `d04.help` (`help` +1 `bond_ellis` / `read` → Gegenstand `bookmark`) |
| **Gegenstand** | `bookmark` Lesezeichen der Uhrmacherin (nur bei `read`) |
| **Cameo** | Madam Pince (kurz) · **Hermine Granger** (Gast aus einer anderen Woche) |
| **Rätsel** | `p04` Das Regal (`arrange`, Reihe, 30 Punkte) |
| **Rückbezug** | `d03.cold` (`k02`) und Ellis' Zimtsterne aus Tag 2 |
| **Neu eingeführt** | **Zeitfransen** (Bibel, Abschnitt 2) · **Sir Aldous** zum ersten Mal mit Sprechzeilen |
| **Türchen-Zauber** | Alle Bücher tragen Wollmützen und flüstern sich Gutenachtgeschichten zu |

## Beats

1. Madam Pince riecht Zimtsterne in Ellis' Tasche. **Entscheidung 1:** brav flüstern oder ihr ein Kompliment machen.
2. Quill stellt die Frage des Tages: Wer war Isolde Tickwell? Eine Besucherin mit einem Bücherturm schwankt vorbei und kennt die Seitenzahl.
3. Ellis kommt an das oberste Regal und kommt nicht mehr runter. **Entscheidung 2:** ihn stützen oder weiterlesen (und das Lesezeichen finden).
4. Quill erklärt die Zeitfransen und adelt Ellis' Zeitmotten-Theorie.
5. Rätsel: Isoldes Bücher in ihre Reihenfolge bringen. Ein Fach öffnet sich.
6. Ein kalter Hauch: Sir Aldous stellt sich vor. Er sagt „Isolde“ ohne Nachnamen und geht rasch.

## Skript

```ink
INCLUDE globals.ink

// Tag 4 – Die Bibliothek (Akt I). Ort: library. Rätsel: p04.
=== day04 ===
# bg: library
# music: castle
# spark: d04.s1 230 20
Die Bibliothek. Es riecht nach Pergament, Staub und gedämpfter Strenge.
# show: quill right
# show: ellis left
# show: pince center
pince: Pssst. Haben Sie da etwa Zimtsterne in der Tasche?
ellis: Nein! Ja. Ich habe sie gerettet! Sie wollten fliegen.
pince: Zimt in Büchern bedeutet Flecken. Flecken bedeuten Kummer. Meinen.
# choice_point: d04.pince Madam Pince bewacht die Bücher mit Argusaugen.
* [Brav flüstern.] # cid: d04.pince.quiet
    pince: Hm. Sie haben Anlagen. Vielleicht keine schlechten.
* [Madam Pince ein Kompliment machen.] # cid: d04.pince.chat
    # emote: pince !
    pince: Mir? Seit Jahren sagt mir niemand etwas Nettes. Außer den Büchern.
    pince: Nehmen Sie, was Sie brauchen. Aber vorsichtig. Und leise. Und sauber.
- # hide: pince
quill: Wir suchen alles über Isolde Tickwell. Sie hat die Adventsuhr gebaut. 1726.
{ clues ? k02: ellis: Und die eiskalte Stelle von gestern? Hat die etwas mit der Uhr zu tun? }
{ not (clues ? k02): ellis: Und warum hat gestern jemand die Treppe eingefroren? }
# show: hermione right
Hinter einem wankenden Bücherturm schwebt ein Mädchen. Sie sieht gehetzt aus.
hermione: Verzeihung! Isolde Tickwell? Seite 412. Fußnote neun. Das zweite Kapitel.
ellis: Du hast „Eine Geschichte von Hogwarts“ gelesen? Freiwillig? Mehrmals?
hermione: Ich habe Anmerkungen gemacht. Mit Lesezeichen. In drei Farben.
# emote: hermione sweat
hermione: Wo bin ich eigentlich? Ich hatte gleich Arithmantik. Vor drei Wochen?
quill: Es ist Dezember, Miss. Aber es ist ein sehr unsicherer Dezember.
hermione: Ach so. Dann danke. Ich muss … irgendwohin. Pünktlich. Davor.
# hide: hermione
Sie rauscht davon. Der Bücherturm folgt ihr widerwillig.
quill: Das waren die Zeitfransen. Wenn die Adventsuhr steht, leiht sich die Zeit Gäste aus.
ellis: Zeitfransen? Aber das ist Theorie eins! Zeitmotten! Ich hatte recht!
quill: Ich sage nicht, dass Sie recht hatten, Ellis. Ich sage, dass Sie nicht falsch lagen.
ellis: Das reicht mir. Das lasse ich mir in Gold prägen. Oder in Fußnoten.
# sfx: blip
Auf dem obersten Regal steht ein Buch über Tickwell. Ellis klettert hinauf.
# emote: ellis sweat
ellis: Ich hole es! Ich bin ein Mann der Tat! Und dann bin ich ein Mann auf einer Leiter …
Er hängt am Regal, bleich wie Pergament. Unten rutscht die Leiter einen halben Meter.
# choice_point: d04.help Ellis hängt zitternd an der Bibliotheksleiter.
* [Leiter festhalten und zureden.] # cid: d04.help.help
    ~ bond_ellis += 1
    # toast: Ellis wird sich das merken.
    quill: Ruhig atmen. Nicht nach unten sehen. Zählen Sie Bücher.
    ellis: Eins. Zwei. Das sind sehr viele. Ich komme runter. Sofort. Gleich.
    # emote: ellis heart
    Mit eurer Hilfe krabbelt er herab, das Buch im Arm. Er murmelt Theorien vor sich hin.
* [Weiterlesen. Er schafft das.] # cid: d04.help.read
    # item: bookmark
    # toast: Neuer Gegenstand: Lesezeichen der Uhrmacherin
    Du schlägst ein altes Notizbuch auf. Ein gesticktes Lesezeichen fällt heraus.
    Zwei Buchstaben in Goldfaden: „I. & A.“ Dahinter ein winziges Uhrwerk.
    quill: Ellis, eine Minute am Regal genügt als Lektion. Das erledige ich auf meine Art.
    Quill schwenkt den Zauberstab. Ellis segelt sanft zu Boden. Er sagt nichts. Ein Rekord.
- quill: Isoldes Bücher sind falsch einsortiert. Ordnen wir sie, wie sie es getan hat.
# emote: quill dots
quill: Das erinnert mich an ein Rätsel, das ich in der Schule hatte. Mit Tinte auf den Fingern …
# puzzle: p04
{ last_puzzle_first_try: ellis: Du kannst Bücher lesen, ohne sie zu lesen! Das ist Magie. }
{ not last_puzzle_first_try: ellis: Ein Buch hatte sich versteckt. Typisch Bücher. }
# sfx: door
Ein Fach im Regal klappt auf. Darin: ein Zahnrad-Skizzenblatt, Tinte, Eisreif am Rand.
# music: dungeon
Ein kalter Hauch. Neben dem Regal steht ein durchscheinender Ritter mit Federhelm.
# show: aldous right
aldous: Verzeiht mein Eindringen. Sir Aldous Frostbart, Hausgeist dieser Hallen.
# emote: ellis !
ellis: DU hast dich vorgestern vor der Uhr verbeugt! Ich wusste es!
aldous: Es ist Brauch. Man grüßt die Uhr. Sie verdient es.
aldous: Ihr sucht nach Isolde? Ihr … sucht nach Isolde Tickwell. Verzeihung.
# emote: quill ?
aldous: Ich muss … die Halle bewachen. Die Uhr schläft. Und sie schläft nicht gut.
# hide: aldous
# music: castle
ellis: Hast du gehört, wie er „Isolde“ sagte? So spricht man von jemandem, den man vermisst.
quill: Ein Hausgeist von dreihundert Jahren kennt die Geschichte, Ellis. Das ist alles.
quill: Aber wir sollten uns den Eisreif an der Uhr genauer ansehen. Morgen. Mit Tränken.
-> END
```

## Rätsel `p04` – Das Regal

- **Engine:** `arrange`, Modus `row`, fünf Bücher (je ein Rücken mit Titel): `ZEIT`, `RAD`, `FEDER`, `STUNDE`, `PENDEL`. Per Ziehen in fünf Fächer sortieren.
- **Hinweise auf der Regalkarte (alle drei nötig, Brute-Force-Check: genau eine Lösung):**
  1. `PENDEL` steht ganz rechts.
  2. `RAD` steht direkt rechts von `ZEIT`.
  3. `FEDER` steht links von `STUNDE`, aber nicht direkt daneben.
- **Lösung:** `FEDER`, `ZEIT`, `RAD`, `STUNDE`, `PENDEL`.
- **Intro (Quill):** „Isolde ordnete ihre Bücher in der Reihenfolge, in der sie arbeitete. Von der Feder bis zum Pendel.“
- **Hinweise:** 1) Fang mit dem Buch an, das ganz rechts steht. 2) `ZEIT` und `RAD` bilden ein Paar. 3) `FEDER` braucht mindestens ein Buch Abstand zu `STUNDE`.
- **Super-Hinweis:** Das Paar `ZEIT`–`RAD` steht in der Mitte.
- **Lösungstext:** „Feder, Zeit, Rad, Stunde, Pendel: von der ersten Skizze bis zur letzten Schraube. Das Pendel ist immer das Letzte, was sich bewegt.“

## Setups und Payoffs

| Setup in Tag 4 | Payoff |
| --- | --- |
| Zeitfransen (die Gäste aus anderen Zeiten) | Tag 5–22: jede Cameo-Figur ist ein Zeitgast; Tag 24: sie kehren zurück in ihre Zeit |
| Hermine ist „in der falschen Woche“ | Tag 22: sie sucht ihren Zeitumkehrer, den sie im Pendelraum verloren hat |
| Lesezeichen „I. & A.“ mit Uhrwerk | Tag 13: +1 Funke; Tag 18: Raum der Wünsche zeigt es; Tag 24: Aldous erkennt es |
| Eisreif an dem Skizzenblatt | Tag 5: Enteisungstrank; Tag 21: `k09` |
| Aldous sagt „Isolde“ zu zärtlich, Ellis merkt es sofort | Tag 15a, 17, 19 (Vertrauenskette) |
| Madam Pince hat „seit Jahren nichts Nettes“ gehört | Tag 16: sie sitzt bei der Tischordnung, falls das Kompliment fiel (optional) |
