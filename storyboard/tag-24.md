# Tag 24 – Der letzte Schlag

> Akt III · Die letzte Stunde · Ort `great_hall` · Musik `finale` · **Enden A, B, C_A, C_B** (`[END-1]`) · Kapitel + Rätsel ≤ 5 Minuten (`[PLAN-1]`)

| | |
| --- | --- |
| **Kurz** | Die Halle ist voll. Mit `# ending` wertet die App aus, wie es ausgeht. Aldous erzählt, warum er die Uhr angehalten hat. Dann kommt die Frage, auf die niemand gekommen ist: Wer fragt ihn, was er will? Das Finale-Rätsel stellt das Getriebe so ein, dass die Uhr wieder schlägt. Danach gehen die Zeitgäste nach Hause, und der Abspann beginnt. |
| **Entscheidungen** | `d24.fate` (`third_way` nur bei `A` / `C_A`: Ihn fragen, was er will · `release`: Ihn gehen lassen) · `d24.last` (`thanks` / `listen`, Ton) |
| **Gegenstände** | `theo_wrench` (ein Schritt weniger im Finale-Rätsel) · `gift_music_box` (spielt beim Abschied) · `gift_scarf` (Epilog) |
| **Cameo** | **Alle Zeitgäste** verabschieden sich: Hermine (Zeitumkehrer), Slughorn, Neville + Trevor, Hagrid + Fang + zwölf Löffel, Luna, Newt + Knopf, Dumbledore, Fred und George, Rosmerta, Flitwick, Lockhart, Filch + Mrs. Norris, Harry und Ron, Hedwig und Errol, Peeves, Nick und die Geister, Snape (Porträt), Dobby (Socken), Fawkes (nur `phoenix`) |
| **Rätsel** | `p24` Der letzte Schlag (`custom:finale`, 100 Punkte, **vier Varianten**: `A`, `B`, `C_A` = wie A, `C_B` = wie B) |
| **Rückbezug** | fast alles: `ending` · `accused` · `kept_chair` · `maren_covered` · `peeves_friend` · `wrote_home` · `ate_rockcake` · `bond_ellis` · `trust_theo` · `trust_aldous` · `theo_wrench` · `gift_music_box` · `wand` · `k04` · Tag 1 („Kein Wort zu irgendjemandem“) · Ellis' Theorie vier (der Setzling) |
| **Türchen-Zauber** | Schnee fällt in der Halle |
| **Wörter** | 289–371 gemessen (`content:simulate`) |

## Beats

1. Die Halle, kurz vor der Stunde. Thornbury erinnert an „Kein Wort zu irgendjemandem“. Alle wissen es. `# ending` wertet die Enden aus.
2. Aldous tritt an den Kopf der Tafel (`kept_chair` schmückt den Stuhl) und erzählt: Isolde band ihn dreihundert Zyklen an die Uhr. Er wollte nicht gehen. Jedes Mal, wenn Theo reparierte, fror er sie wieder ein. Je nach Ende ein Satz von Quill oder Ellis.
3. **Entscheidung 1 (`d24.fate`):** Bei A und C_A: **ihn fragen, was er will** (die dritte Lösung) oder ihn gehen lassen (er bittet dann darum, gefragt zu werden: Es führt zur selben Lösung). Bei B und C_B: nur ihn gehen lassen.
4. Quill erinnert: „Der Fremde warst du.“ Rätsel `p24`: Zahnräder und Zeiger stellen. Bei A: Zahnrad Nr. 12 ist das Scharnier einer Tür, die einen Spalt offen bleibt. Bei B: das Getriebe läuft ohne ihn.
5. Der letzte Schlag. Schnee fällt in der Halle. Ende A/C_A: Aldous bleibt, mit offener Tür. Ende B/C_B: Er verabschiedet sich unter dem Baum. Die Zeitgäste kehren in ihre Zeit zurück.
6. **Entscheidung 2 (`d24.last`):** der Uhr ein Wort sagen oder zuhören. Sie tickt. Der Abspann beginnt.

## Skript

```ink
INCLUDE globals.ink

// Tag 24 – Der letzte Schlag (Akt III). Ort: great_hall. Rätsel: p24 (custom:finale). `# ending` wertet [END-1] aus.
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
```

## Rätsel `p24` – Der letzte Schlag (`custom:finale`)

> **Neue Engine.** Haupträtsel des Kalenders, 100 Punkte. Zahnräder und Zeiger. Die Variante hängt von `save.ending` ab (`variants` in `p24.json`, Schlüssel `A`, `B`, `C_A`, `C_B`). Spezifikation, damit die App sie bauen kann.

- **Aufbau:** Ein Getriebe aus zwei Stufen. Das **Ritzel P** (8 Zähne) am Minutenzeiger treibt das Rad **W1**. Auf derselben Achse sitzt das Ritzel **P2**, das das Rad **W2** am Stundenzeiger treibt. Das Übersetzungsverhältnis Minutenzeiger : Stundenzeiger muss **12 : 1** sein, sonst schlägt die Uhr nicht zur vollen Stunde.
- **Rechnung:** (W1 ÷ 8) × (W2 ÷ P2) = 12.
- **Zeigerteil:** Hat der Spieler das Getriebe richtig gebaut, stellt er den Minutenzeiger auf Zwölf: Der Stundenzeiger folgt, das Schlagwerk löst aus. Bei falschem Getriebe dreht sich der Stundenzeiger zu weit und die Glocke schlägt schief.
- **Variante B / C_B (Abschied):** Alle drei Räder sind frei wählbar (fünf Zahnräder je Platz): W1 ∈ {18, 30, 36, 54, 60}, P2 ∈ {16, 18, 20, 27, 30}, W2 ∈ {27, 40, 54, 60, 72}. **Lösung (genau eine, per Skript):** W1 = 36, P2 = 27, W2 = 72. (36 ÷ 8) × (72 ÷ 27) = 4,5 × 2,666… = 12. 125 Kombinationen, 44 davon liegen zwischen 9 und 15, aber nur eine trifft 12.
- **Variante A / C_A (die dritte Lösung):** P2 ist **festgelegt: das goldene Zahnrad Nr. 12 (12 Zähne)**. Es ist das Scharnier der Tür, die offen bleibt. W1 ∈ {12, 27, 30, 32, 40, 45}, W2 ∈ {24, 30, 32, 36, 40, 45}. **Lösung (genau eine, per Skript):** W1 = 32, W2 = 36. (32 ÷ 8) × (36 ÷ 12) = 4 × 3 = 12. 36 Kombinationen, 20 liegen zwischen 9 und 15.
- **Mit `theo_wrench`:** Ein Schritt weniger: Das Rad W1 sitzt schon an seinem Platz (B: 36, A: 32). Es bleiben 25 bzw. 6 Möglichkeiten.
- **Intro (Quill):** „Das letzte Rätsel besteht aus Zahnrädern und Zeigern. Und einer Frage, die niemand gestellt hat.“
- **Hinweise:** 1) Der Minutenzeiger muss sich zwölfmal drehen, bis sich der Stundenzeiger einmal gedreht hat. 2) Jede Stufe hat ihr eigenes Verhältnis: Rad geteilt durch Ritzel. Die beiden Verhältnisse werden multipliziert. 3) Variante A: Das goldene Zahnrad hat 12 Zähne. Dann muss W1 mal W2 genau 1152 ergeben. Variante B: Rechne W1 mal W2 gleich 96 mal P2.
- **Super-Hinweis:** A: 32 und 36. B: 36, 27 und 72.
- **Lösungstext A:** „32 und 36: (32 ÷ 8) × (36 ÷ 12) = 4 × 3 = 12. Das goldene Zahnrad Nr. 12 sitzt als Scharnier mitten im Werk. So bleibt die Tür einen Spalt offen.“
- **Lösungstext B:** „36, 27 und 72: (36 ÷ 8) × (72 ÷ 27) = 12. Die Uhr schlägt Zwölf, und der Zeiger folgt den Rädern.“
- **Punkte:** 100. Hinweise und Hilfe wie bei allen Rätseln (`[PZL-4]`, `[PZL-5]`).

## Zusätze für die Umsetzung

- **Der Abspann** liegt nicht im Ink (`ending` → `letter` → `credits`). Er besteht aus: Endkarte, Hauspokal, Epilog-Bausteine, Brief, Credits. Texte unten.
- **`# ending`:** hängt an der Zeile „Die Uhr steht. Der Stuhl wartet. Dann wird es kalt.“ Die App wertet `[END-1]` aus, setzt `ending` und macht ab dieser Zeile weiter. Alle Texte davor gelten für jedes Ende.
- **`d24.fate.third_way`** erscheint nur bei `A` und `C_A` (bedingte Auswahl). Bei den anderen Enden steht nur `release` zur Wahl.
- **`release` bei A/C_A:** Aldous bittet darum, gefragt zu werden. Beide Optionen führen zum selben Rätsel (Variante A). Das hält die Enden beliebig, aber nie falsch („Alle Enden sind schön und keines bestraft“).
- **Zeitgäste-Abschied:** fünf Zeilen im Skript (Hermine, Hagrid, Slughorn, Neville, Peeves), damit die 500-Wörter-Grenze hält. Ein Abschiedsbild (Sprites winken) kann der Kalender-Bildschirm zeigen, die Namen stehen in der Cameo-Liste.

## Abspann (App, nicht Ink)

**Endkarten** (je ein Satz, Pergamentstil):

| Ende | Titel | Text |
| --- | --- | --- |
| `A` | Die dritte Lösung | „Die Uhr tickt, die Tür bleibt einen Spalt offen, und Aldous darf bleiben, solange er will.“ |
| `B` | Abschied im Schnee | „Die Uhr läuft. Aldous ist weitergezogen, unter einem Baum, im Schnee, mit einem Lächeln.“ |
| `C_A` | Der Geist gesteht, Ellis hat die Idee | „Ein Irrtum führt zur Wahrheit. Ellis' Gedanke öffnet die Tür, und Aldous bleibt.“ |
| `C_B` | Der Geist gesteht | „Ein Irrtum führt zur Wahrheit. Aldous geht in Frieden, und die Uhr geht weiter.“ |

**Epilog-Bausteine** (alle zutreffenden, in dieser Reihenfolge): `bond_ellis ≥ 4`: Ellis schenkt dir seinen Schal, „beste Freunde“ · `trust_theo ≥ 2`: Theo wird Uhrmacher-Lehrling · `maren_covered`: Knopf wird Schul-Niffler · `trust_grimsby ≥ 1`: Grimsby zieht die Uhr summend auf · `hat_overruled`: Der Hut: „Ich hatte recht, dich ziehen zu lassen.“ · danach immer: persönlicher Brief (Konzept Abschnitt 12).

**Hauspokal** (je Haus ein kurzer Satz des Hutes, `[PZL-7]`): Gryffindor: „Mut, wenn jemand fragt.“ · Hufflepuff: „Treue, wenn alle gehen.“ · Ravenclaw: „Klugheit, die eine Tür findet.“ · Slytherin: „List, die niemanden verlieren lässt.“

## Setups und Payoffs

| Setup (früher) | Payoff in Tag 24 |
| --- | --- |
| Tag 1: „Kein Wort zu irgendjemandem“ | Thornbury und Ellis (acht Tage, acht Stunden) |
| Tag 13a / 18: „Ein Fremder wird die Stunde schlagen“ | Quill: „Der Fremde warst du.“ |
| Tag 19: „Niemand fragt, ob du willst“ | Die dritte Lösung ist die Frage |
| Tag 18: Zahnrad Nr. 12 mit Herz, Tag 14w: `k04` | Das goldene Zahnrad ist das Scharnier (Variante A) |
| Tag 17: `gift_music_box` | Die Spieluhr spielt, das blaue Band tanzt |
| Tag 16: `kept_chair` | Aldous setzt sich an den Kopf der Tafel |
| Tag 20: `theo_wrench` | Ein Schritt weniger im Finale-Rätsel |
| Tag 8: Ellis' Theorie vier (Setzling) | `d24.last.thanks`: Die Uhr tickt, als sie angesprochen wird |
| Tag 7: `wrote_home` | Die Eule mit dem Brief von zu Hause |
| Tag 8: Neville und Trevor | Neville winkt mit der Kröte |
| Tag 11: Hagrids zwölf Löffel | Hagrid schultert sie |
| Tag 2: Peeves | Konfetti statt Kerzen |
