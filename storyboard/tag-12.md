# Tag 12 – Der Astronomieturm

> Akt II · Verdacht · Ort `astronomy_tower` · Musik `outdoor` · **Routenwahl**

| | |
| --- | --- |
| **Kurz** | Nachts auf dem Astronomieturm. Von oben will Quill sehen, wohin die beiden Fährten aus Tag 11 führen. Ellis hat Höhenangst, eine Gästin aus einer anderen Zeit benennt Sternbilder nach eigenem Geschmack und findet am Himmel einen Ritter. Am Ende teilt sich die Gruppe: Wald oder Archiv. |
| **Entscheidungen** | `d12.courage` (`encourage` +1 `bond_ellis` / `alone`, Ton) · `d12.route` (`forest` / `archive` → `route`) |
| **Cameo** | **Luna Lovegood** (Gästin aus einer anderen Zeit) |
| **Persönlich** | `personal("patronus")` (Konzept Abschnitt 12, Standard „ein Fuchs“) |
| **Rätsel** | `p12` Das Sternbild (`path`, Sterne, 40 Punkte) |
| **Rückbezug** | Tag 3: Ellis' Höhenangst („Ich mag Treppen nur nicht, wenn sie hoch sind“) · Tag 11: die zwei Fährten · `bond_ellis` |
| **Leitspruch** | Quills „Jedes Rätsel hat eine Lösung“ für Akt II (`[STY-4]`) |
| **Türchen-Zauber** | Sternschnuppen formen Zahlen |

## Beats

1. Die Wendeltreppe hinauf. Ellis zählt die Stufen, um nicht nach unten zu sehen. **Entscheidung 1:** ihm Mut machen oder vorausgehen.
2. Oben sitzt Luna Lovegood im Schnee und benennt Sternbilder neu („Der Ritter“, „Die verlegene Teekanne“). Sie beruhigt Ellis auf ihre Art.
3. Luna sieht den Patronus der Spielfigur (persönlich).
4. Rätsel: den Ritter in einem Zug nachzeichnen. Danach leuchtet er auf, und Sternschnuppen fallen.
5. Von oben sind beide Fährten zu sehen: Pfoten mit Glitzer in den Wald, Schuhe zum Archiv. Quill sagt den Leitspruch.
6. **Entscheidung 2 (Route):** mit Ellis in den Wald oder mit Quill ins Archiv. Tag 13–15 hängen davon ab.

## Skript

```ink
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
```

## Rätsel `p12` – Das Sternbild

- **Engine:** `path`, Regel „jede Linie genau einmal“, **ohne festen Start und ohne festes Ende**, Sterne als Punkte (ohne Buchstaben).
- **Der Ritter:** 13 Sterne, 18 Linien – Helm (Dreieck), Hals, Schultern, Leib mit Schärpe, Beine und Boden, Schwertarm mit Klinge (Dreieck), Schild.
- **Geprüft (Skript):** Nur zwei Sterne haben eine ungerade Zahl von Linien: die beiden unteren Helmecken. Jeder gültige Zug beginnt an der einen und endet an der anderen. Es gibt 384 gültige Züge, aber nur etwa **5,6 %** zufällig gezeichneter Züge gelingen.
- **Intro (Luna):** „Der Ritter schläft. Man darf ihn nicht zweimal am selben Arm ziehen, das mag er nicht.“
- **Hinweise:** 1) Zähl bei jedem Stern, wie viele Linien dort zusammenkommen. 2) Fast überall ist die Zahl gerade. Nur an zwei Sternen nicht – dort musst du anfangen und aufhören. 3) Die beiden besonderen Sterne sitzen am Helm.
- **Super-Hinweis:** Fang an einer unteren Helmecke an und zeichne zuerst den Helm zu Ende.
- **Lösungstext:** „Nur die beiden unteren Helmecken haben drei Linien, alle anderen Sterne zwei oder vier. Also beginnt der Zug an der einen Helmecke und endet an der anderen.“

## Setups und Payoffs

| Setup in Tag 12 | Payoff |
| --- | --- |
| `route` (Wald / Archiv) | Tag 13–15 komplett verschieden, Tag 16 Wiedersehen |
| Sternbild „Der Ritter“ | Tag 15a (Porträt eines Ritters von 1726), Tag 22 (`k10`) |
| Sternschnuppen bilden „3 0 0“ | Tag 22: „CCC“ = 300 im Pendel |
| Luna: „Die Zeit hat Löcher“ | Tag 16: Luna sitzt bei der Tischordnung; Tag 24: Abschied der Zeitgäste |
| `bond_ellis` (Treppe hinauf) | Tag 21: Ellis klettert im Uhrturm, mit `bond_ellis ≥ 4` ohne zu zögern |
