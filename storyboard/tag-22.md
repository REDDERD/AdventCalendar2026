# Tag 22 – Die Pendelkammer

> Akt III · Die letzte Stunde · Ort `pendulum_chamber` · Musik `dungeon`

| | |
| --- | --- |
| **Kurz** | Unter dem Uhrwerk hängt das Pendel, reglos, mit einer falschen Rechnung aus Holzstäben. Löst man sie, springt eine Klappe auf: Im Kupfer steht „CCC“, dreihundert. Ellis' siebte Theorie ist die Wahrheit, Quill nennt sie die beste, und eine Gästin mit einer Sanduhr löst den Zeitfransen-Gag auf. |
| **Entscheidungen** | `d22.hermione` (`give` / `keep`, Ton) · `d22.ellis` (`tell` +1 `bond_ellis` / `protect`, Ton) |
| **Hinweis** | `k10` Inschrift „CCC“ im Pendel (automatisch) |
| **Cameo** | **Hermine** (`hermione`) mit dem Zeitumkehrer: Auflösung des Zeitfransen-Gags |
| **Rätsel** | `p22` Römische Stäbe (`arrange` Stäbe, 60 Punkte): **bereits umgesetzt** in `src/content/puzzles/p22.json` |
| **Rückbezug** | Tag 4 (Hermine in der falschen Woche) · Tag 12 (Sternschnuppen „3 0 0“) · Tag 14a (Isoldes „PENDEL“) · Tag 5 (Ellis' Theorie drei: 300 Jahre ohne Urlaub) · Tag 9 und 15a/19 (die dreihundert) · `bond_ellis` · `k09` |
| **Ellis' Theorie** | Sieben: „Eine Uhr bleibt stehen, wenn jemand nicht will, dass die Zeit weitergeht.“ Die Wahrheit, Quill: „Das ist die beste Theorie.“ |
| **Türchen-Zauber** | Das Pendel schwingt einmal, Schneeflocken fallen |
| **Wörter** | 328–345 gemessen (`content:simulate`) |

## Beats

1. Die Pendelkammer, hoch wie ein Kirchenschiff. Das Pendel hängt still. Auf der Scheibe liegt ein Brett aus Holzstäben mit einer falschen Rechnung.
2. Rätsel: einen Stab umlegen.
3. Eine Klappe springt auf. Im Kupfer: CCC. `k10`. Ellis erkennt die Sternschnuppen von Tag 12 und seine Theorie drei von Tag 5: dreihundert Jahre ohne Urlaub.
4. Hermine klettert hinter dem Pendel hervor. Im Hohlraum liegt ihr Zeitumkehrer. **Entscheidung 1:** zurückgeben oder als Beweis behalten. Sie erklärt: Der Zeitumkehrer hat die Zeitfransen nicht verursacht, er hat sich nur verirrt, weil die Uhr stehen blieb.
5. Ellis' Theorie sieben. Quill: „Die beste.“ **Entscheidung 2:** Ellis den Verdacht nennen oder ihn schonen.

## Skript

```ink
INCLUDE globals.ink

// Tag 22 – Die Pendelkammer (Akt III). Ort: pendulum_chamber. Rätsel: p22.
=== day22 ===
# bg: pendulum_chamber
# music: dungeon
# spark: d22.s1 40 170
Zweiundzwanzigster Dezember.
Unter dem Uhrwerk liegt eine Kammer, so hoch wie ein Kirchenschiff.
Darin hängt, reglos, das Pendel. Eine Kupferscheibe, so groß wie ein Tisch.
# show: ellis left
# show: quill right
quill: Isolde schrieb: Das Pendel ist das Herz jeder Uhr. Sehen wir nach.
Auf der Scheibe liegt ein Brett aus Holzstäben. Eine Rechnung, falsch gelegt:
IX + II = VI.
ellis: Römische Zahlen. Ich habe laminierte Tabellen.
ellis: Aber keine, auf der steht, was ich hier soll.
quill: Ein Stab umlegen, und die Klappe geht auf.
quill: Das erinnert mich an ein Rätsel aus der Schulzeit.
# puzzle: p22
{ last_puzzle_first_try: ellis: Beim ersten Mal! Die Römer hätten geweint. Vor Rührung. }
{ not last_puzzle_first_try: quill: Ein Stab ist wenig. Ein Stab zu viel ist ein Irrtum. Man muss ihn finden. }
# sfx: door
Eine Klappe im Pendel springt auf. Tief ins Kupfer geritzt steht: CCC.
# clue: k10
ellis: Drei C. Hundert, hundert, hundert. Dreihundert! Die Sternschnuppen!
ellis: Drei, null, null!
quill: Dreihundert Zyklen. Dreihundert Jahre. Dreihundert Mal ein Türchen.
ellis: Theorie drei! Dreihundert Jahre ohne Urlaub!
ellis: Ich hatte recht, und niemand hat mir geglaubt!
{ bond_ellis >= 3: quill: Ich habe dir geglaubt, Ellis. Heimlich. Mit Teelöffel. }
# show: hermione center
Hinter dem Pendel raschelt es.
Eine junge Frau klettert hervor, den Pergamentstapel im Arm, Staub im Haar.
hermione: Ich bin in der falschen Woche. Oder im falschen Jahr.
hermione: Ich habe drei Seiten Notizen und zwei verloren.
hermione: Habt ihr einen Zeitumkehrer gesehen? Goldene Kette, kleine Sanduhr?
Im Hohlraum des Pendels blitzt eine goldene Sanduhr an einer Kette.
# choice_point: d22.hermione Hermine sucht ihren Zeitumkehrer.
* [Ihr die Sanduhr zurückgeben.] # cid: d22.hermione.give
    hermione: Danke! Ich war sicher, dass er die Zeitfransen verursacht.
    hermione: Ich habe ihn nicht angerührt. Fast.
* [Die Sanduhr als Beweis behalten.] # cid: d22.hermione.keep
    hermione: Beweis? Wofür? Gut. Aber bitte nicht drehen.
    hermione: Es gäbe sonst ein langes Wochenende.
- hermione: Er ist unschuldig. Er hat sich verirrt, weil die Uhr stehen blieb.
hermione: Er braucht Zeit, an der er sich festhält.
# hide: hermione
ellis: Dann kommt Theorie sieben. Die letzte. Ich habe sie mir für heute aufgehoben.
ellis: Eine Uhr bleibt stehen, wenn jemand nicht will, dass die Zeit weitergeht.
# emote: quill !
quill: Das ist die beste Theorie, die ich in dreißig Jahren gehört habe, Ellis.
ellis: Wirklich? Ich meinte es als Scherz. Jetzt macht sie mir Angst.
quill: Ein Ritter, dreihundert Jahre und ein Frost, der nirgends kalt ist.
quill: Ich habe einen Verdacht.
ellis: Wer? Sag es, bitte. Einer von euch beiden.
# choice_point: d22.ellis Ellis sieht dich blass an.
* [Ihm sagen, was du vermutest.] # cid: d22.ellis.tell
    ~ bond_ellis += 1
    # toast: Ellis wird sich das merken.
    ellis: Aldous? Er hat sich vor mir verbeugt! Aber danke, dass du es sagst.
    ellis: Ehrlichkeit ist selten.
* [Ihn schonen, bis es sicher ist.] # cid: d22.ellis.protect
    ellis: Du sagst es nicht? Ich sehe es dir an. Aber gut. Ich warte. Bis morgen.
- # sfx: spark
Das Pendel schwingt einmal. Ein einziger Schlag, und von der Decke fallen Schneeflocken.
# spark: d22.s2 214 150
-> END
```

## Rätsel `p22` – Römische Stäbe

> **Bereits umgesetzt** (`src/content/puzzles/p22.json`, Entwurf von M4). Das Storyboard übernimmt ihn unverändert.

- **Engine:** `arrange`, Modus `sticks`, ein Zug. Die Rechnung aus Holzstäben: **IX + II = VI**. Genau ein Stab wird umgelegt, danach stimmt sie.
- **Lösung:** **IX − III = VI.** Der senkrechte Stab des Plus wandert zur II und macht daraus eine III. Es ist die einzige Möglichkeit.
- **Intro (Ellis):** „Römische Zahlen. Die Römer hatten keine Null. Kein Wunder, dass ihr Reich untergegangen ist.“
- **Hinweise:** 1) Neun plus zwei ist elf, nicht sechs. Mit einem Stab ist der Abstand zu groß, außer du änderst die Rechenart. 2) Ein Plus besteht aus zwei Stäben, ein Minus aus einem. 3) Der Stab, der wandern muss, steht senkrecht, aber er ist keine Zahl.
- **Super-Hinweis:** Nimm den senkrechten Stab aus dem Plus.
- **Lösungstext:** „IX − III = VI. Der senkrechte Stab des Plus wandert zur II und macht daraus eine III. Neun minus drei ist sechs. Es ist die einzige Möglichkeit.“

## Setups und Payoffs

| Setup in Tag 22 | Payoff |
| --- | --- |
| `k10` „CCC“ = 300 (Sternschnuppen, Ellis' Theorie drei) | Tag 23: Beweis gegen `aldous`; Tag 24: Aldous' Zyklus endet am 24. Dezember |
| Ellis' Theorie sieben (die Wahrheit), „Ich meinte es als Scherz“ | Tag 24: Ellis darf sie dem Geist selbst sagen; Epilog: Ellis' Zettel „Theorie sieben“ wird laminiert |
| `d22.ellis.tell` (+1 `bond_ellis`) | Epilog: `bond_ellis ≥ 4` → Ellis schenkt seinen Schal; Ende C_A |
| Hermine und der Zeitumkehrer („er braucht Zeit, an der er sich festhält“) | Tag 24: Wenn die Uhr wieder läuft, bringt der Umkehrer alle Zeitgäste nach Hause |
| `d22.hermione.keep` (Sanduhr als Beweis) | Tag 24: Hermine gibt ihn in der Verabschiedung gegen einen Schokofrosch zurück |
| Quills Verdacht („ein Ritter, ein Frost“) | Tag 23: die Anklage |
| Das Pendel, das einmal schwingt | Tag 24: der letzte Schlag, das Pendel schwingt weiter |
