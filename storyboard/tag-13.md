# Tag 13 – Zwei Wege

> Akt II · Verdacht · **Routentag** (`route`) · Orte `forest_edge` (Wald) und `archive` (Archiv) · Musik `outdoor` / `castle`

Eine Datei `day13.ink` mit drei Knoten (`[STR-1]`): `day13` verzweigt nach `route`, `day13_forest` und `day13_archive` sind die beiden Wege. Jeder Weg hat seine **zwei** Entscheidungen, sein Rätsel und bleibt unter 500 Wörtern.

| | Wald (`day13_forest`) | Archiv (`day13_archive`) |
| --- | --- | --- |
| **Kurz** | Mit Ellis und Hortensias Mütze in den Verbotenen Wald. Auf dem Pfad liegen Zimtkrümel. Ein Zentaur versperrt das Gatter und will eine Zahl hören. | Mit Quill ins Archiv. Der Karteikasten ist beleidigt, Theo trägt heimlich die Familienakte Tickwell. Aus dem Stammbaum fällt ein Brief. |
| **Entscheidungen** | `d13w.lantern` (`on` → Gegenstand `lantern` / `off` +1 Funke) · `d13w.centaur` (`ask` / `wait`, Ton) | `d13a.archivist` (`polite` / `search`, Ton) · `d13a.theo` (`ask` +1 `trust_theo` / `alone` → Gegenstand `archive_key`) |
| **Hinweis** | – | `k06` Brief der Uhrmacherin an „meinen Ritter“ |
| **Cameo** | Ein Zentaur (nur Erzählzeilen, kein Sprecher) | – |
| **Rätsel** | `p13w` Zentaurenpfeile (`input`, 40 Punkte) | `p13a` Der Stammbaum (`arrange` Reihe, 40 Punkte) |
| **Haustier** | Haustier-Hinweis 2 (`[PLAN-2]`): Das Haustier kommentiert, Hinweis 1 gratis | dito |
| **Rückbezug** | Tag 11 `ate_rockcake` (Ellis fragt nach dem Zahn) · Tag 4 `bookmark` (+1 Funke) · Tag 12 `route` | Tag 4 `bookmark` (Theo erkennt es, +1 Funke) · Tag 6 `trust_theo` (Theo antwortet offener) · Tag 10 (fehlender Turmschlüssel) |
| **Wörter** | beide Routen zusammen 226–279 gemessen (`content:simulate`). Die Lint-Warnung „… words in total“ erscheint, weil zwei Routen in einer Datei liegen | |
| **Türchen-Zauber** | Glühwürmchen hängen sich als Lichterketten in den Wald | Leuchtmotten tanzen als Lichterketten durch die Regale (Abwandlung des Zaubers) |

## Beats

**Wald:** 1. Waldrand, Ellis mit Hortensias Mütze („gegen Bären“). Zimtkrümel im Schnee. 2. **Entscheidung 1:** Laterne anzünden oder im Dunkeln gehen. 3. Ein Zentaur steht zwischen den Stämmen und sieht in den Himmel. **Entscheidung 2:** ihn fragen oder höflich warten. 4. Haustier-Kommentar, Rätsel: Er öffnet das Gatter nur, wenn man die Zahl der Wege der Herde nennt. 5. Das Gatter öffnet sich. Die Spur führt tiefer in den Wald.

**Archiv:** 1. Ostflügel, Quill mit Tee. Der Karteikasten ist ein sehr alter Butler. **Entscheidung 1:** höflich bitten oder wühlen. 2. Theo schleicht mit drei Ordnern aus der Familienakte. **Entscheidung 2:** ihn offen fragen oder allein weitersuchen. 3. Haustier-Kommentar, Rätsel: Die Karteikarten von Isolde bis Theo in die richtige Generationenfolge bringen. 4. Aus der letzten Karte fällt der Brief an „meinen Ritter“ (`k06`).

## Skript

```ink
INCLUDE globals.ink

// Tag 13 – Zwei Wege (Akt II). Routen-Knoten day13_forest / day13_archive [STR-1]. Rätsel: p13w / p13a.
=== day13 ===
{ route == "archive": -> day13_archive }
-> day13_forest

=== day13_forest ===
# bg: forest_edge
# music: outdoor
# spark: d13w.s1 40 150
Dreizehnter Dezember. Am Waldrand riecht der Schnee nach Tannennadeln und Abenteuer.
# show: ellis left
ellis: Ich bin ganz ruhig. Ich habe Notizen, Proviant und die Mütze meiner Cousine Hortensia.
ellis: Gegen Bären, sagt sie. Ich glaube, es sind Ohrenwärmer.
{ ate_rockcake: ellis: Wie geht es deinem Zahn? Dem von Hagrid? Ich frage nur für die Notizen. }
Die kleinen Pfotenabdrücke führen zwischen zwei Eichen hindurch. Sie glitzern leicht.
Daneben liegt ein Krümel im Schnee. Ellis hebt ihn auf und schnuppert daran.
ellis: Zimt. Ein Zimtkeks. Wer verliert mitten im Wald Gebäck?
# choice_point: d13w.lantern Im Wald wird es früh dunkel.
* [Die Laterne anzünden und mitnehmen.] # cid: d13w.lantern.on
    # item: lantern
    # toast: Neuer Gegenstand: Laterne
    Du zündest die Laterne an. Der Schnee wird warm und gelb.
    ellis: Sehr vernünftig. Das nennt man Vorsorge. Ich nenne es Angst mit Plan.
* [Im Dunkeln gehen und genau hinsehen.] # cid: d13w.lantern.off
    # spark: d13w.s3 196 250
    Nach einer Weile gewöhnen sich deine Augen. Zwischen den Wurzeln blinkt etwas auf.
    ellis: Du siehst im Dunkeln? Das ist entweder Talent oder eine Krankheit. Beides interessant.
-
{ items ? bookmark:
    # spark: d13w.s4 120 330
    Isoldes Lesezeichen in deiner Tasche wird warm. Du findest einen Funken im Moos.
}
Zwischen den Stämmen steht ein Zentaur. Er sieht nicht uns an, sondern den Himmel.
Er sagt, ohne den Kopf zu drehen: „Mars ist hell heute. Das bedeutet Besuch.“
ellis: Wir sind der Besuch. Glaube ich. Bei Zentauren weiß man es nie.
# choice_point: d13w.centaur Der Zentaur versperrt den Pfad mit seinem Bogen.
* [Ihn nach den Pfotenspuren fragen.] # cid: d13w.centaur.ask
    „Der Kleine sammelt“, sagt er. „Er stiehlt nicht. Er kann nur nicht anders.“
    ellis: Er sammelt. Das schreibe ich auf. Unterstrichen. Zweimal.
* [Höflich warten, bis er spricht.] # cid: d13w.centaur.wait
    Du wartest. Der Zentaur nickt kaum merklich. Hier zählt das als Höflichkeit.
- „Die Herde kennt viele Wege durchs Gehölz. Nenne mir ihre Zahl, und ich öffne das Gatter.“
{ pet == "owl": Deine Eule sitzt auf seinem Bogen und zählt mit den Krallen. Sie kommt auf mehr als zehn. }
{ pet == "cat": Deine Katze beobachtet die Bäume. Sie meint, drei davon seien nur Kulisse. }
{ pet == "toad": Deine Kröte quakt bei jedem Baum. Sie zählt sie als Hindernisse, nicht als Wege. }
# emote: ellis dots
ellis: Quill würde sagen: Das erinnert mich an ein Rätsel.
ellis: Mich erinnert es an Hausaufgaben.
# puzzle: p13w
{ last_puzzle_first_try: Der Zentaur verbeugt sich tief. „Die Sterne hatten recht.“ }
{ not last_puzzle_first_try: Der Zentaur seufzt. „Beinahe. Aber der Wald ist geduldig.“ }
# sfx: spark
Das Gatter schwingt auf. Über uns springen Glühwürmchen an.
Sie hängen sich wie Lichterketten in die Zweige.
ellis: Der Wald dekoriert! Ohne Genehmigung!
ellis: Die Pfoten führen tiefer hinein. Und überall Zimtkrümel.
ellis: Wer auch immer das ist, er wird gefüttert. Von jemandem mit Backofen.
# spark: d13w.s2 214 120
-> END

=== day13_archive ===
# bg: archive
# music: castle
# spark: d13a.s1 200 150
Das Archiv liegt im Ostflügel. Aktenschränke bis zur Decke und eine Stille, die zuhört.
# show: quill right
quill: Dreizehnter Dezember. Die Schuhe führten hierher. Tee? Er ist noch warm.
quill: Ellis ist im Wald. Er trägt eine Mütze mit Ohrenklappen. Ich habe nichts gesagt.
Auf dem Pult steht ein Karteikasten, der sich verbeugt wie ein sehr alter Butler.
# choice_point: d13a.archivist Der Karteikasten wartet auf eine Anfrage.
* [Höflich um die Tickwell-Akte bitten.] # cid: d13a.archivist.polite
    Eine Schublade gleitet auf. „Sehr wohl.“
    Der Kasten klingt zufrieden, soweit Kästen das können.
* [Selbst in den Schubladen wühlen.] # cid: d13a.archivist.search
    Schubladen knallen, Zettel regnen. Der Kasten sagt: „Das wird vermerkt.“
    quill: Es wurde vermerkt. Wir sehen es später.
- # show: theo left
Hinter einem Regal klappert es. Theo Ashcombe, Ölfleck auf der Nase, drei Ordner im Arm.
theo: Ich suche … Hausaufgaben. Dringend. Im Archiv. Nachts. Wie jeder.
quill: Mr. Ashcombe, die Ordner sind die Familienakte Tickwell.
{ items ? bookmark:
    # spark: d13a.s3 120 320
    theo: Das Lesezeichen! Es hing früher am Pult. Wo habt ihr es her?
}
# emote: theo dots
# choice_point: d13a.theo Theo drückt die Ordner an sich.
* [Theo offen fragen.] # cid: d13a.theo.ask
    ~ trust_theo += 1
    # toast: Theo wird sich das merken.
    theo: Na gut. Isolde war meine Vorfahrin. Siebte Generation. Das wusste ich nicht immer.
    { trust_theo >= 1: theo: Und den Turmschlüssel habe ich geliehen. Nur zum Reparieren. Ich bringe ihn zurück. }
* [Allein weitersuchen.] # cid: d13a.theo.alone
    # item: archive_key
    # toast: Neuer Gegenstand: Archivschlüssel
    Während Theo seine Ordner rettet, findest du im Pult einen kleinen Schlüssel.
    theo: Hey! Der gehört … niemandem. Behaltet ihn.
- quill: Der Kasten hat die Karten der Familie durcheinandergebracht. Sieben Generationen.
{ pet == "owl": Deine Eule sitzt auf dem Pult und blättert mit dem Schnabel. Sie fängt hinten an. }
{ pet == "cat": Deine Katze legt sich auf die Karten. Eine ganz bestimmte. Dann schläft sie ein. }
{ pet == "toad": Deine Kröte hüpft auf die letzte Karte. Sie scheint zu wissen, wohin es führt. }
quill: Das erinnert mich an ein Rätsel aus meiner eigenen Familie. Sie war schlecht sortiert.
# puzzle: p13a
{ last_puzzle_first_try: theo: Die Reihenfolge stimmt. Beim ersten Mal. Ich habe sie nie so schnell gesehen. }
{ not last_puzzle_first_try: theo: Fast. Die Karten werden nicht gern umsortiert. Sie sind von 1726. }
# sfx: spark
Aus der letzten Karte fällt ein gefalteter Brief. Das Siegel ist gesprungen.
# clue: k06
quill: „Mein Ritter.“ Nicht an Theos Familie. An einen Ritter.
quill: „Dreihundert Winter lang wird die Uhr deine Wache sein.
quill: Ein Fremder wird die Stunde schlagen, wenn ihr bereit seid.“
quill: Unterschrieben mit I.
# emote: theo !
theo: Der Fremde. Die Uhr hat geschlagen, als ihr kamt. Ich stand daneben.
Im Archiv tanzen Leuchtmotten wie Lichterketten durch die Regale.
# spark: d13a.s2 214 130
-> END
```

## Rätsel `p13w` – Zentaurenpfeile

> Ein Layton-Dauerbrenner: Wege auf einem Gitter zählen. Per Skript geprüft (`p13w.mjs`).

- **Engine:** `input` (Zahl, 2 Stellen). Bild `puzzle.p13w`: eine Lichtung als Gitter aus 6 × 6 Kreuzungen. Die Herde startet **oben links** (Waldrand) und will zum Gatter **unten rechts**. Sie darf an jeder Kreuzung nur **nach rechts oder nach unten** gehen. Auf **fünf Kreuzungen steht ein Baum**, dort kann niemand durch.
- **Bäume** (Zeile, Spalte, von 0 an gezählt): (1,1) · (1,4) · (2,4) · (3,1) · (4,1).

```text
S . . . . .
. B . . B .
. . . . B .
. B . . . .
. B . . . .
. . . . . G
```

- **Lösung:** **46** Wege. Falle: 252 (so viele wären es ohne Bäume).
- **Per Skript:** Jeder der fünf Bäume ändert das Ergebnis; entfernt man einen, kommt eine andere Zahl heraus.
- **Intro (Ellis):** „Der Zentaur zählt keine Sterne, er zählt Wege. Ich habe gehört, das ist dasselbe.“
- **Hinweise:** 1) Fang bei jeder Kreuzung mit der Zahl der Wege an, die sie erreichen. 2) Die Zahl an einer Kreuzung ist die Summe der Zahlen darüber und links davon. 3) Bei einem Baum steht eine Null.
- **Super-Hinweis:** In der obersten Reihe steht überall eine 1 – bis zum ersten Baum, danach geht es weiter.
- **Lösungstext:** „46 Wege. An jeder Kreuzung addierst du die Wege von oben und von links; bei den Bäumen steht eine Null. Ohne Bäume wären es 252.“
- **Haustier `[PLAN-2]`:** `petHint` im JSON, Hinweis 1 gratis.

## Rätsel `p13a` – Der Stammbaum

> Spezifikation steht in der Bibel, Abschnitt 8 (`arrange` Reihe, keine neue Engine). Hier die Anwendung für den Archiv-Tag.

- **Engine:** `arrange`, Modus `row`, sieben Karteikarten von der ältesten bis zur jüngsten Generation: Isolde (Uhrmacherin), Mabel, Hugo, Ottilie, Barnaby, Cora, Theo.
- **Feste Plätze:** Isolde ganz links, Theo ganz rechts (Regeln `at`).
- **Sechs Hinweise** (Feld `clues` wie bei `p06`, zusätzlich als Regeln hinterlegt):
  1. Hugo ist Mabels Sohn. (`right_of`)
  2. Cora ist weder Mabels Elternteil noch ihr Kind. (`not_next_to`)
  3. Cora ist weder Hugos Elternteil noch sein Kind. (`not_next_to`)
  4. Mabel ist älter als Ottilie. (`left_of`, Abstand 1)
  5. Ottilie ist weder Coras Elternteil noch ihr Kind. (`not_next_to`)
  6. Barnaby lebte mindestens zwei Generationen nach Mabel. (`left_of`, Abstand 2)
- **Per Skript:** genau eine Reihenfolge von 120 Möglichkeiten (jeder Hinweis wird gebraucht): **Isolde, Mabel, Hugo, Ottilie, Barnaby, Cora, Theo**.
- **Intro (Quill):** „Eine Karte pro Generation. Der Karteikasten hat sie gemischt, wie ein Kartenspieler seine Gefühle.“
- **Hinweise:** 1) Isolde und Theo stehen fest. Hugo steht direkt hinter seiner Mutter Mabel. 2) Cora darf nur neben Barnaby oder Theo stehen, nicht neben Mabel, Hugo oder Ottilie. 3) Cora steht direkt vor Theo, davor Barnaby.
- **Super-Hinweis:** Isolde, Mabel, Hugo, Ottilie, Barnaby, Cora, Theo.
- **Lösungstext:** „Isolde, Mabel, Hugo, Ottilie, Barnaby, Cora, Theo: sieben Generationen in dreihundert Jahren. Theo ist die siebte, und er hat es immer gewusst.“

## Setups und Payoffs

| Setup in Tag 13 | Payoff |
| --- | --- |
| Zimtkrümel auf dem Pfad (Wald) | Tag 15w: Sie führen zum Bau des Nifflers; Tag 16: Maren backt Zimtkekse und gesteht, dass sie ihn heimlich füttert |
| Der Zentaur: „Der Kleine sammelt. Er stiehlt nicht.“ (nur `ask`) | Tag 15w: Newt sagt dasselbe über Nifflers |
| `lantern` (nur `on`) | Tag 15w: +1 Funke im Niffler-Bau |
| Ellis' Mütze von Cousine Hortensia | Tag 21: Ellis trägt sie im Uhrturm („gegen die Höhe“) |
| `archive_key` (nur `alone`) | Tag 15a: Abkürzungs-Dialog an der Porträtgalerie |
| Theo: „Siebte Generation“ und der geliehene Turmschlüssel (nur `ask`) | Tag 20: Theo entscheidet sich für oder gegen dich. Tag 21: Quill öffnet den Uhrturm trotzdem mit dem Teelöffel |
| `k06` Brief „Mein Ritter“ (nur Archiv) | Tag 20: Wald-Spieler mit `trust_theo ≥ 2` bekommen ihn von Theo (`[DEC-4]`). Tag 23: Beweis gegen `aldous` |
| „Ein Fremder wird die Stunde schlagen“ | Tag 24: Quill sagt, wer der Fremde war |
| Der Karteikasten „vermerkt“ (nur `search`) | Tag 16: Der Kasten schickt Quill eine Rechnung für zerknickte Karten |
