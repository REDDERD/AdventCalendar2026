# Tag 16 – Die Tischordnung

> Akt II · Verdacht (Ende) · Ort `great_hall` · Musik `castle` · **Die Routen treffen sich**

| | |
| --- | --- |
| **Kurz** | Die Halle wird für den Weihnachtsball geschmückt. Die beiden Routen tauschen ihre Funde aus, Ellis stellt die sechste Theorie auf (die Uhr hat keine Einladung bekommen), und Maren gesteht endlich, dass sie einen Niffler versteckt. Dann stehen sechs Gäste aus anderen Zeiten vor der Tafel, und Quill braucht eine Tischordnung. |
| **Entscheidungen** | `d16.maren` (`cover` +1 `trust_maren`, `maren_covered` / `report` −1 `trust_maren`) · `d16.seating` (`keep` → `kept_chair` / `peeves`, Ton) |
| **Hinweise (Nachholer, `[DEC-4]`)** | Bei `trust_maren ≥ 2` bekommt jeder, der `k04` oder `k05` noch nicht hat, sie jetzt von Maren |
| **Cameo** | **Zeitgäste beim Ball:** Hermine, Slughorn, Neville, Hagrid, Luna, Newt (Sprecher: Slughorn und Hagrid, die anderen als Erzählzeilen). Peeves nur im zweiten Entscheidungsmoment |
| **Rätsel** | `p16` Die Tischordnung (`arrange` Reihe, 50 Punkte) |
| **Rückbezug** | `ate_rockcake` (Hagrid und der Pudding) · `route` (beide Seiten berichten) · `trust_maren` (Nachholer) · Tag 8 (Kekse), Tag 13/14/15 (Zimtkrümel, Wollfaden) · Tag 12 (Ellis' Theorien, Aldous in der Nähe) |
| **Ellis' Theorie** | Sechs: „Die Uhr streikt, weil sie keine Einladung zum Ball bekam.“ Gag, rührt Aldous |
| **Türchen-Zauber** | Der Tisch deckt sich selbst |
| **Neue Variable** | `kept_chair` (in `globals-zusatz.ink`) |
| **Wörter** | 282–317 gemessen (`content:simulate`) |

## Beats

1. Die Halle im Ballschmuck. Beide Routen berichten, was die andere nicht gesehen hat. Ellis' Theorie sechs. Neben dem Kamin wird es kurz kalt: Jemand hat zugehört.
2. Maren kommt mit einem Tablett Zimtkekse und gesteht. Wer ihr vertraut (`trust_maren ≥ 2`), bekommt, was ihm noch fehlt (`k04`, `k05`). **Entscheidung 1:** decken oder melden.
3. Sechs Gäste aus anderen Zeiten stehen vor der Tafel. Slughorn und Hagrid melden Ansprüche an. Quill bittet um die Tischordnung.
4. Rätsel: sechs Gäste auf sechs Plätze nach sechs Wünschen.
5. Der Tisch deckt sich von selbst. **Entscheidung 2:** Ein siebter Stuhl am Kopf der Tafel bleibt leer. Für wen?

## Skript

```ink
INCLUDE globals.ink

// Tag 16 – Die Tischordnung (Akt II). Ort: great_hall. Rätsel: p16. Die Routen treffen sich.
=== day16 ===
# bg: great_hall
# music: castle
# spark: d16.s1 36 170
Sechzehnter Dezember. Die Große Halle wird für den Ball geschmückt.
Tannen, Kerzen, Aufregung.
# show: quill right
# show: ellis left
{ route == "forest":
    quill: Im Archiv: Isoldes Familie. Theo ist ihr Nachfahre.
    quill: Und ein Brief an „meinen Ritter“.
    ellis: Im Wald: ein Niffler. Er heißt Knopf.
    ellis: Er ist so klein, dass ich ihm ein ganzes Wort widmen möchte.
}
{ route == "archive":
    ellis: Im Wald: ein Niffler und ein goldenes Zahnrad.
    ellis: Und eine Spinne, die höflicher war als Peeves.
    quill: Im Archiv: Isoldes Brief, ein Porträt von 1726. Beide sprechen von einem Ritter.
}
ellis: Theorie sechs! Die Uhr streikt, weil sie keine Einladung zum Ball bekam.
quill: Sie ist ein Möbelstück, Ellis.
ellis: Möbel haben Gefühle. Fragt jeden Stuhl.
Neben dem Kamin wird die Luft kurz kalt. Etwas Silbernes verbeugt sich vor Ellis.
Er merkt es nicht.
# show: maren center
Maren Holloway kommt mit einem Tablett Zimtkekse. Sie zittert. Die Kekse auch.
maren: Ich muss etwas sagen. Bevor ihr es selbst herausfindet. Es geht um … einen Niffler.
maren: Knopf. Er fror im Herbst in meinem Gewächshaus. Ich nahm ihn auf.
maren: Er liebt alles, was glänzt.
maren: Und er hat ein goldenes Zahnrad genommen.
maren: Ich wusste nicht, wie ich es zurückgeben soll.
{ not (clues ? k04) and trust_maren >= 2:
    maren: Hier. Ich habe es aufgehoben. Es ist warm geblieben.
    # clue: k04
}
{ not (clues ? k05) and trust_maren >= 2:
    maren: Und das ist Knopf. Schüchtern. Schnell.
    maren: Er hat dich schon einmal gesehen, ich schwöre.
    # clue: k05
}
# choice_point: d16.maren Maren hält das Tablett wie einen Schutzschild.
* [Maren decken und schweigen.] # cid: d16.maren.cover
    ~ trust_maren += 1
    ~ maren_covered = true
    # toast: Maren wird sich das merken.
    maren: Wirklich? Du sagst es niemandem? Dann backe ich dir dein Leben lang Kekse.
* [Thornbury davon berichten.] # cid: d16.maren.report
    ~ trust_maren -= 1
    # toast: Maren wird sich das merken.
    maren: Ich verstehe. Ich wäre es auch. Aber bitte: Er ist kein Dieb. Er sammelt.
- # hide: maren
quill: Zwei unabhängige Defekte also.
quill: Eine Uhr, die nicht will, und ein Zahnrad, das gehen wollte.
Das Portal öffnet sich. Sechs Gäste treten ein.
Sie sehen sich um und tun so, als wären sie immer da gewesen.
# show: slughorn center
slughorn: Ah! Die Assistenz! Ich sitze neben den Begabten, versteht sich. Ich sammle.
# show: hagrid left
{ ate_rockcake: hagrid: Du! Der mit dem Zahn! Ich hab dir 'n Platz neben dem Pudding freigehalten. }
{ not ate_rockcake: hagrid: Ich brauch 'n Ende der Tafel. Wegen der Ellbogen. Und 'n Pudding. }
quill: Sechs Gäste, sechs Wünsche und eine Tafel.
quill: Das erinnert mich an ein Rätsel über Eitelkeit.
# puzzle: p16
{ last_puzzle_first_try: quill: Alle sechs zufrieden. Selbst Slughorn. Das ist ein Meisterstück. }
{ not last_puzzle_first_try: quill: Zwei haben sich beschwert. Das ist bei Ballordnungen ein guter Schnitt. }
# sfx: spark
Der Tisch deckt sich von selbst. Teller landen, Gläser klingeln.
Ein Pudding verbeugt sich.
Am Kopf der Tafel bleibt ein siebter Stuhl leer.
# choice_point: d16.seating Ein Stuhl ist übrig. Für wen?
* [Den Stuhl für Aldous freihalten.] # cid: d16.seating.keep
    ~ kept_chair = true
    # toast: Der Stuhl bleibt frei.
    quill: Gute Idee. Für jemanden, der nie eingeladen wurde.
    ellis: Siehst du? Die Uhr bekommt ihre Einladung doch noch. Theorie sechs bleibt gültig.
* [Peeves den Stuhl geben.] # cid: d16.seating.peeves
    Peeves lässt sich rücklings auf den Stuhl fallen und balanciert den Pudding auf dem Kopf.
    quill: Das war nicht, was ich meinte. Aber es war ehrlich.
- # spark: d16.s2 214 130
-> END
```

## Rätsel `p16` – Die Tischordnung

- **Engine:** `arrange`, Modus `row`, sechs Gäste auf sechs Plätzen einer langen Tafel (von links = Fensterseite nach rechts = Kamin). Keine neue Engine.
- **Gäste:** Neville, Hermine, Slughorn, Luna, Newt, Hagrid.
- **Sechs Hinweise** (Feld `clues` wie bei `p06`, zusätzlich als Regeln hinterlegt):
  1. Neville sitzt nicht neben Slughorn. (`not_next_to`)
  2. Neville sitzt mindestens zwei Plätze vor Newt. (`left_of`, Abstand 2)
  3. Slughorn sitzt mindestens drei Plätze vor Hagrid. (`left_of`, Abstand 3)
  4. Hagrid sitzt am rechten Ende der Tafel („wegen der Ellbogen“). (`at`, −1)
  5. Hermine sitzt mindestens vier Plätze vor Hagrid. (`left_of`, Abstand 4)
  6. Luna sitzt direkt rechts von Slughorn. (`right_of`)
- **Per Skript geprüft:** genau **eine** Reihenfolge von 720: **Neville, Hermine, Slughorn, Luna, Newt, Hagrid**.
- **Intro (Quill):** „Ein Ball besteht aus Musik, Essen und der richtigen Reihenfolge der Egos.“
- **Hinweise:** 1) Hagrid steht fest, er sitzt ganz rechts. 2) Hermine hat bis Hagrid vier Plätze Abstand, also sitzt sie ganz links oder auf dem zweiten Platz. 3) Slughorn und Luna sitzen direkt hintereinander, mit Abstand zu Neville.
- **Super-Hinweis:** Neville links außen, Hermine auf Platz 2, Slughorn auf Platz 3.
- **Lösungstext:** „Neville, Hermine, Slughorn, Luna, Newt, Hagrid. Hagrid hat sein Ende, Slughorn seine Begabte, Neville seine Ruhe vor ihm, und Luna sitzt neben dem, der alles sammelt.“

## Setups und Payoffs

| Setup in Tag 16 | Payoff |
| --- | --- |
| `maren_covered` (nur `cover`) | Epilog: Knopf wird Schul-Niffler (Abspann, Bibel Abschnitt 9) |
| `trust_maren` ± 1 | Tag 23: Marens Reaktion bei der Anklage |
| Marens Zwölf-Kekse-Tablett, Wollfaden-Loch | Tag 24: Maren backt für den Ball und Knopf sitzt auf ihrer Schulter |
| `kept_chair` (nur `keep`) | Tag 24: Aldous sitzt am freien Platz; sonst steht der Stuhl nur im Hintergrund |
| Ellis' Theorie sechs, Aldous verbeugt sich | Tag 19: Aldous erinnert Ellis, dass Möbel Gefühle haben; Tag 22: Theorie sieben, die Wahrheit |
| „Zwei unabhängige Defekte“ (Quill) | Tag 21/22: Zahnrad und Raureif sind getrennte Probleme; Tag 24: Zahnrad 12 als Scharnier |
| Hagrid: der Pudding, die Löffel | Tag 24: Hagrid verabschiedet sich mit zwölf Löffeln, die er endlich wiederhat |
| Alle sechs Zeitgäste an der Tafel | Tag 24: Abschied der Zeitgäste, jeder in seinen Dezember |
