# Tag 23 – Die Anklage

> Akt III · Die letzte Stunde · Ort `great_hall` · Musik `dungeon` · **setzt `accused`**

| | |
| --- | --- |
| **Kurz** | Quill hat alle Verdächtigen in die Halle gebeten. Der Spieler klagt jemanden an, der Angeklagte antwortet, dann ordnet man die gesammelten Hinweiskarten: wen entlasten sie, worauf zeigen sie? Am Ende tritt Aldous in die Mitte und sagt, dass er es war. Falsch Beschuldigte widerlegen den Verdacht, richtig Beschuldigte bekommen ein stummes Nicken von einem Porträt. |
| **Entscheidungen** | `d23.accuse` (`theo` / `maren` / `grimsby` / `aldous` → `accused`) · `d23.speech` (`gentle` / `firm`, Ton) |
| **Cameo** | **Snape-Porträt** (nickt einmal bei richtiger Anklage, nur Erzählzeile); Theo, Maren (mit Knopf bei `maren_covered`), Grimsby, Aldous |
| **Rätsel** | `p23` Wer war es? (`custom:accuse`, 70 Punkte): Hinweiskarten sortieren, Spezifikation unten |
| **Rückbezug** | alle Hinweise `k01`–`k10` · `anonymous_letter` (Tag 7: gefrorener Brief) · `maren_covered` (Tag 16) · `trust_theo`, `trust_aldous` · Tag 5 (Snapes Porträt) |
| **Türchen-Zauber** | Ein Tannenbaum wächst in der Halle |
| **Wörter** | 236–295 gemessen (`content:simulate`) |

## Beats

1. Die leere Halle, die stehende Uhr, Theo, Maren und Grimsby auf Stühlen. Der Stuhl am Kopfende ist leer. Quill erinnert an die zwei Defekte.
2. **Entscheidung 1 (`d23.accuse`):** Wen klagst du an? Theo, Maren, Grimsby oder Aldous. Die Angeklagten antworten kurz. Bei Aldous fällt noch kein Name im Raum, aber Quill nickt.
3. Rätsel: Die Hinweiskarten sortieren. Wen entlastet welche Karte, worauf zeigen die übrigen?
4. Aldous tritt aus der Kälte. War die Anklage richtig, nickt das Porträt an der Wand einmal. War sie falsch, ist er es, der den Verdacht widerlegt, indem er die Schuld auf sich nimmt.
5. **Entscheidung 2 (`d23.speech`):** freundlich oder fordernd reagieren. Aldous will morgen alles erzählen. Ein Tannenbaum wächst.

## Skript

```ink
INCLUDE globals.ink

// Tag 23 – Die Anklage (Akt III). Ort: great_hall. Rätsel: p23 (custom:accuse). Setzt `accused` [END-1].
=== day23 ===
# bg: great_hall
# music: dungeon
# spark: d23.s1 40 170
Dreiundzwanzigster Dezember.
Die Halle ist leer bis auf eine lange Tafel und eine Uhr, die steht.
# show: quill right
# show: ellis left
{ maren_covered: Maren trägt Knopf auf der Schulter. Er knabbert an ihrem Finger. Sie lässt ihn. }
Theo, Maren und Grimsby sitzen auf Stühlen in einer Reihe.
Der Stuhl am Kopf der Tafel bleibt leer.
quill: Zwei Defekte. Ein Zahnrad, das fehlt. Und ein Frost, der immer zurückkehrt.
quill: Heute klären wir, wer die Uhr eingefroren hat. Wer hat es getan?
theo: Ich war es nicht. Ich sage es jetzt, damit es alle gehört haben.
maren: Ich habe Kekse. Zwölf. Falls jemand Mut braucht.
grimsby: Ich war im Kerker. Ich sage es seit Tagen. Niemand schreibt es auf.
{ items ? anonymous_letter: ellis: Der Brief von Tag sieben! „Lasst die Uhr ruhen.“ Das Papier ist gefroren. Das war ein Hinweis. }
# choice_point: d23.accuse Wer hat die Uhr eingefroren?
* [Theo anklagen.] # cid: d23.accuse.theo
    ~ accused = "theo"
    # show: theo center
    theo: Ich? Ich repariere sie!
    theo: Mein Notizbuch, jede Nacht ein Zahnrad, jede Nacht wieder Eis.
* [Maren anklagen.] # cid: d23.accuse.maren
    ~ accused = "maren"
    # show: maren center
    maren: Ich habe nur Knopf versteckt. Er sammelt. Er friert nichts ein. Er ist ein Niffler!
* [Grimsby anklagen.] # cid: d23.accuse.grimsby
    ~ accused = "grimsby"
    # show: grimsby center
    grimsby: Ich? Im Kerker war ich! Rohrbruch! Ich vermisse das Ticken, ihr Schnösel!
* [Sir Aldous anklagen.] # cid: d23.accuse.aldous
    ~ accused = "aldous"
    quill: Dann lassen Sie uns die Beweise ordnen.
- quill: Alle Karten auf den Tisch. Wen entlastet welche, und worauf zeigen die anderen?
# puzzle: p23
{ last_puzzle_first_try: quill: Alles geordnet. Beim ersten Mal. Das hat etwas von Isolde. }
{ not last_puzzle_first_try: quill: Geordnet. Mit Umwegen. Das ist ehrlicher. }
# sfx: spark
Die Luft in der Halle wird eiskalt. Neben dem leeren Stuhl steht Sir Aldous.
Er hat zugehört.
# show: aldous center
{ accused == "aldous":
    Im Rahmen an der Wand lüftet ein schwarzhaariges Porträt eine Braue. Dann nickt es.
    Einmal.
    aldous: Fürwahr. Ihr habt recht. Ich habe die Uhr angehalten.
}
{ accused != "aldous":
    aldous: Ihr sucht an der falschen Stelle. Gestattet: Es war nicht dieser Mensch.
    aldous: Es war ich.
}
{ trust_aldous >= 1: aldous: Ich wollte nie, dass ihr mich so findet. Aber ich bin froh, dass ihr es seid. }
theo: Ein Geist hat meine Reparaturen gestoppt? Ich bin wütend. Und ziemlich erleichtert.
maren: Er hat sich letzte Nacht bei Knopf bedankt. Für die Gesellschaft.
maren: Ich habe nichts gesagt.
{ bond_ellis >= 4: ellis: Aldous. Ich habe dir einen Stuhl freigehalten. Das gilt noch. }
{ bond_ellis < 4: ellis: Aldous … Ich hätte dich gern früher gefragt. Ich wusste nur nicht, was. }
# choice_point: d23.speech Aldous steht vor euch, aufrecht und zitternd.
* [Danke, dass Sie es sagen.] # cid: d23.speech.gentle
    aldous: Ihr seid freundlich. Das macht es schwerer. Und leichter.
* [Warum haben Sie das getan?] # cid: d23.speech.firm
    aldous: Morgen. Morgen erzähle ich alles. Gestattet, ich muss mich sammeln.
- ellis: Einen Moment. Was ist das?
Mitten in der Halle wächst ein Tannenbaum aus dem Fußboden. Er funkelt.
Er ist noch etwas schief.
quill: Morgen früh, zur Stunde der Uhr, in dieser Halle. Wer bleiben will, bleibt.
# spark: d23.s2 214 140
-> END
```

## Rätsel `p23` – Wer war es? (`custom:accuse`)

> **Neue Engine.** Die Spielenden sortieren die Hinweiskarten und sehen, was sie beweisen. Das Rätsel setzt `accused` nicht, das macht die Entscheidung `d23.accuse` davor.

- **Aufbau:** Eine Pinnwand mit allen **zehn** Hinweiskarten `k01`–`k10`. Gefundene Karten sind farbig. Fehlende erscheinen als „Quills Notiz“ mit demselben Text, damit das Rätsel **nie gesperrt** ist (`[DEC-3]`). Drei Aktendeckel liegen daneben: Theo, Maren, Grimsby.
- **Teil 1, Entlasten:** Ordne jedem der drei **eine** Karte zu, die ihn vom Einfrieren entlastet.
- **Teil 2, Zeigen:** Tippe alle Karten an, die auf die übrig gebliebene Person zeigen.

| Karte | Text | Zeile |
| --- | --- | --- |
| `k01` | Kratzspuren am Uhrkasten | Weder noch (Knopf) |
| `k02` | Eiskalte Stelle vor der Uhr | **zeigt auf Aldous** |
| `k03` | Theos Notizbuch mit Zahnradskizzen | **entlastet Theo** (er repariert, wer repariert, friert nicht ein) |
| `k04` | Das goldene Zahnrad | Weder noch (zweiter Defekt) |
| `k05` | Knopf, der Niffler | **entlastet Maren** (Knopf sammelt, er friert nichts) |
| `k06` | Brief an „meinen Ritter“ | **zeigt auf Aldous** |
| `k07` | Porträt von 1726 mit Aldous | **zeigt auf Aldous** |
| `k08` | Grimsbys Logbuch (Rohrbruch im Kerker) | **entlastet Grimsby** (Alibi) |
| `k09` | Raureif im Uhrwerk | **zeigt auf Aldous** |
| `k10` | Inschrift „CCC“ im Pendel | **zeigt auf Aldous** |

- **Lösung:** `clears`: Theo → `k03`, Maren → `k05`, Grimsby → `k08`; `points`: `k02`, `k06`, `k07`, `k09`, `k10`. `k01` und `k04` bleiben liegen (sie erklären den zweiten Defekt, nicht den Frost).
- **Intro (Quill):** „Wer eine Anklage erhebt, schuldet Beweise. Nicht allen, aber sich selbst.“
- **Hinweise:** 1) Entlaste zuerst die, die du mit einer Karte freisprechen kannst: Wer repariert, wer nur sammelt, wer nicht da war. 2) Manche Karten erklären den fehlenden Zahn im Werk, aber nicht den Frost. Die bleiben liegen. 3) Die fünf Karten, die übrig bleiben, haben alle mit Kälte, Ritter oder dreihundert zu tun.
- **Super-Hinweis:** Theo ← Notizbuch, Maren ← Knopf, Grimsby ← Logbuch.
- **Lösungstext:** „Theo repariert, Maren hütet einen Sammler, Grimsby war im Kerker. Die fünf übrigen Karten zeigen auf Aldous: Kälte, der Brief an ihren Ritter, das Bild von 1726, der Reif im Werk und die dreihundert Jahre.“
- **Punkte:** 70. **Verify (`puzzles:verify`):** eindeutig, jede Karte liegt in genau einer Klasse (entlastet, zeigt, weder noch).
- **Bei falscher Anklage:** Das Rätsel läuft trotzdem, die Beweise zeigen es dem Spieler.

## Zusätze für die Umsetzung

- **Engine `custom:accuse`:** Logik `src/puzzles/logic/accuse.ts` (Config: Verdächtige, Karten mit Klasse und Text; Zustand: Zuordnung + Auswahl; `verify`: Klassen vollständig und konsistent), Oberfläche `engines/Accuse.tsx`, Tests (`[PZL-2]`).
- **Karten ohne Fund:** `has_clue(id)` entscheidet nur über die Darstellung (farbig / Notiz), nicht über die Lösung.
- **Snape-Porträt:** nur Erzählzeile, kein Sprecher (DECISIONS #41).

## Setups und Payoffs

| Setup in Tag 23 | Payoff |
| --- | --- |
| `accused` | Tag 24: `[END-1]` wertet Ende A, B, C_A, C_B aus |
| Aldous: „Ich habe die Uhr angehalten.“ | Tag 24: Das Geständnis in der Halle, dann die dritte Lösung |
| Der Tannenbaum, schief | Tag 24: er wird gerade, wenn die Uhr tickt |
| Snapes Nicken (nur bei `aldous`) | Easter Egg, Tag 24: Snape verabschiedet sich nicht, er nickt zurück |
| `maren_covered`, Knopf auf der Schulter | Epilog: Knopf wird Schul-Niffler |
| Der leere Stuhl | Tag 24: Aldous setzt sich (bei `kept_chair`) |
