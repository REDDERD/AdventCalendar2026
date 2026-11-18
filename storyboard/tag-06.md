# Tag 6 – Die Nikolausnacht

> Akt I · Die stehende Uhr · Ort `dorm_corridor` · Musik `dungeon`

| | |
| --- | --- |
| **Kurz** | Nikolausnacht. Ellis will den Nikolaus fangen, „für die Wissenschaft“. Stattdessen schleicht Theo mit einer Werkzeugtasche zur Halle und verliert sein Notizbuch. Zwei Paar Füße, die niemandem gehören, streiten dabei leise. Aus der Halle kommt ein einziges Ticken. |
| **Entscheidungen** | `d06.boot` (`star` / `note`, Ton) · `d06.theo` (`report` −1 / `confront` +1 `trust_theo`) |
| **Hinweis** | `k03` Theos Notizbuch mit Zahnradskizzen (automatisch, falsche Fährte) |
| **Cameo** | **Harry und Ron** unter einem Tarnumhang. Nur zu hören, nie zu sehen (keine Sprecher-IDs nötig) |
| **Rätsel** | `p06` Die Nikolausstiefel (`arrange`, Logikraster 5 × 5 mit Hinweiskarte, 30 Punkte) |
| **Rückbezug** | `d05.ingredient` über `trust_theo`: Theo reagiert auf die Konfrontation je nach Vertrauen anders |
| **Türchen-Zauber** | Die fünf Stiefel füllen sich mit Nüssen, Mandarinen und Zimtsternen. Alle Türen im Korridor tragen für eine Nacht Tannenkränze |

## Beats

1. Nikolausnacht im Gästekorridor. Quill hat euch zur Nachtwache abgestellt. Ellis hat eine Falle aus Socken gebaut.
2. **Entscheidung 1:** Ellis etwas in den Stiefel legen (Zimtstern oder Zettel).
3. Etwas poltert. Nichts ist zu sehen, aber zwei Stimmen zanken über einen Fuß. Zwei Paar Fußspuren im Staub wandern zur Bibliothek.
4. Theo schleicht mit der Tasche zur Halle und lässt sein Notizbuch fallen (`k03`). Zahnrad Nummer zwölf hat ein Herz.
5. **Entscheidung 2:** Quill alles melden oder Theo zur Rede stellen.
6. Der Nikolaus kommt ohne Glockenschlag. Die Namensschilder wehen von den Stiefeln. Rätsel: Wessen Stiefel steht vor welcher Tür, und was liegt darin?
7. Morgens: Ellis findet deinen Gruß. Und aus der Halle dringt ein einzelnes Ticken, das sofort wieder verstummt.

## Skript

```ink
INCLUDE globals.ink

// Tag 6 – Die Nikolausnacht (Akt I). Ort: dorm_corridor. Rätsel: p06.
=== day06 ===
~ temp gift = ""
# bg: dorm_corridor
# music: dungeon
# spark: d06.s1 40 160
Sechster Dezember, kurz nach Mitternacht. Nikolausnacht.
Im Korridor stehen fünf Stiefel vor fünf Türen. Einer ist deiner. Alle leer. Alle wartend.
# show: ellis left
ellis: Ich fange den Nikolaus. Für die Wissenschaft. Und für Süßigkeiten.
ellis: Meine Falle: ein Faden aus Socken. Er stolpert, und wir stellen ihm Fragen.
ellis: Quill hat uns die Nachtwache gegeben. Wer nachts zur Halle will, muss hier vorbei.
Die Zeitfransen haben alle Betten durcheinandergewürfelt. Wer wo schläft, weiß keiner.
ellis: Mein Stiefel steht angeblich irgendwo da. Er riecht bestimmt nach Optimismus.
# choice_point: d06.boot Du willst Ellis eine kleine Freude machen.
* [Einen Zimtstern in seinen Stiefel legen.] # cid: d06.boot.star
    ~ gift = "star"
    Du schiebst einen Zimtstern aus der Tasche in einen der Stiefel. Er knistert leise.
* [Einen Zettel: „Danke für die Theorien.“] # cid: d06.boot.note
    ~ gift = "note"
    Du schreibst „Danke für die Theorien“ auf einen Zettel und faltest ihn in den Stiefel.
- # sfx: blip
Etwas klirrt. Die Rüstung neben euch wackelt. Niemand steht dort.
Eine Stimme flüstert: „Harry, du stehst auf meinem Fuß!“
Eine zweite: „Das ist DEIN Fuß, Ron! Ich habe nur den Umhang festgehalten!“
# emote: ellis !
ellis: Zwei Gespenster! Mit Streitkultur! Das gab es noch nie!
Im Staub entstehen zwei Paar Fußspuren. Sie wandern leise zankend Richtung Bibliothek.
# show: theo right
Danach wird es still. Dann: ein Schatten. Theo Ashcombe, Umhang über dem Pyjama.
Er trägt eine Ledertasche, aus der es leise klappert. Er schleicht zur Halle.
Beim Abbiegen rutscht ihm ein Notizbuch aus der Tasche. Er merkt es nicht.
# clue: k03
ellis: Zahnräder! Zahnräder! Und Formeln! Und neben Zahnrad Nummer zwölf ein kleines Herz!
quill: (Aus der Ferne, im Halbschlaf) Ist jemand wach? Brennt etwas an?
# hide: theo
{ trust_theo >= 1: ellis: Theo hat doch die Messingöl-Hilfe angeboten. Aber was macht er mit Zahnrädern? }
{ trust_theo < 1: ellis: Verdächtig. Sehr. Wobei … ich wäre in Pyjama auch verdächtig. }
# choice_point: d06.theo Theo ist mit einer Werkzeugtasche zur Halle geschlichen.
* [Quill alles melden.] # cid: d06.theo.report
    ~ trust_theo -= 1
    # toast: Theo wird davon erfahren.
    Du schickst Quill eine kurze Notiz per Eule. Sie lautet: „Theo. Halle. Werkzeug.“
    ellis: Kurz und effizient. Ich hätte drei Absätze geschrieben. Und Fußnoten.
* [Theo zur Rede stellen.] # cid: d06.theo.confront
    ~ trust_theo += 1
    # toast: Theo wird sich das merken.
    # show: theo right
    { trust_theo >= 2: theo: Von dir hätte ich nichts anderes erwartet. Du fragst, bevor du urteilst. }
    { trust_theo < 2: theo: Du folgst mir? Wie originell. Das war kaum ein Wort. }
    theo: Ich sehe nach der Uhr. Mehr nicht. Das Buch behalte ich, wenn du es nicht petzt.
    # hide: theo
    ellis: Er hat „wenn du es nicht petzt“ gesagt. Das ist die höflichste Drohung, die ich kenne.
- # sfx: spark
Von irgendwoher kommt kein Glockenschlag. Es gibt ja keine Uhr, die schlagen könnte.
Der Nikolaus kommt trotzdem. Er ist ein Mann mit Prinzipien.
Ein Schneewirbel. Die Stiefel hüpfen, tauschen Plätze, die Namensschilder wehen fort.
# emote: ellis note
ellis: Jetzt weiß niemand mehr, wem was gehört! Das ist ein Fall!
quill: (Aus dem Dunkel) Dann löst ihn bitte leise.
# emote: quill dots
Neben den Stiefeln liegt eine Karte. Quills Handschrift, ganz sicher.
# puzzle: p06
{ last_puzzle_first_try: ellis: Beim ersten Versuch! Der Nikolaus weint vor Rührung. Vielleicht. }
{ not last_puzzle_first_try: ellis: Wer hätte gedacht, dass Lakritz so viel Streit auslöst? }
Als ihr zurückkehrt, wartet die Morgendämmerung auf den Fensterbänken.
{ gift == "star": ellis: In meinem Stiefel war ein Zimtstern! Ich habe ihn noch nicht gegessen. Ich sehe ihn an. }
{ gift == "note": ellis: Du hast mir einen Zettel geschrieben! Ich laminiere ihn. Mit Zauberei. }
# emote: ellis heart
# spark: d06.s2 220 140
# sfx: blip
Und dann, ganz leise, aus der Richtung der Halle: Tick.
Nur ein einziges. Dann wieder Stille.
# emote: ellis !
ellis: Die Uhr hat getickt! Ich schwöre, sie hat getickt!
quill: Dann hören wir morgen weiter. Ich habe Post bekommen, und sie ist ausgesprochen unhöflich.
-> END
```

## Rätsel `p06` – Die Nikolausstiefel

> Deutlich schwerer als die erste Skizze (DECISIONS.md #44, #49). Umgesetzt in `src/content/puzzles/p06.json`.

- **Engine:** `arrange`, Modus `grid` als **Logikraster 5 × 5**: Spalten = Türen 1–5 (von links nach rechts), Zeilen = Leckereien (Zimtstern, Mandarine, Nuss, Lakritz, Lebkuchen, als kleine Symbole). Fünf Namen (**Ellis, Maren, Theo, Quill, du**) kommen je auf ein Feld: jede Tür und jede Leckerei genau einmal.
- **Quills Karte** (Knopf „Karte“, Hinweise lassen sich abhaken). Nur fünf Hinweise, kein einziger „X steht vor Tür n“:
  1. In Quills Stiefel liegt keine Nuss.
  2. Ellis' Stiefel steht zwei Türen links von dem Stiefel mit der Nuss.
  3. Theos Stiefel steht zwei Türen links von deinem Stiefel.
  4. Der Stiefel mit dem Zimtstern steht zwei Türen rechts von dem Stiefel mit der Mandarine.
  5. Ellis' Stiefel steht direkt links neben dem Stiefel mit dem Lebkuchen.
- **Geprüft:** Von 14 400 möglichen Anordnungen passt genau **eine**. Die Kartentexte werden aus den Regeln erzeugt und von `puzzles:verify` gegengeprüft.
- **Lösung:** Tür 1 Quill (Mandarine) · Tür 2 Theo (Lakritz) · Tür 3 Ellis (Zimtstern) · Tür 4 du (Lebkuchen) · Tür 5 Maren (Nuss). Ellis hat den Zimtstern – passend zu seiner Zeile nach dem Rätsel.
- **Intro (Ellis):** „Wer bekommt was? Das ist ein Logikrätsel. Das sind die besten Rätsel. Neben denen mit Kuchen.“
- **Hinweise:** 1) Hinweis 2 und 5 hängen zusammen: Ellis, Lebkuchen, Nuss stehen direkt nebeneinander. 2) Ellis kann nur vor Tür 1, 2 oder 3 stehen – jede Möglichkeit mit Hinweis 3 und 4 prüfen. 3) Ellis steht vor Tür 3.
- **Super-Hinweis:** Tür 1: Quill, Tür 2: Theo, Tür 3: Ellis.
- **Lösungstext:** „Tür 1 Quill mit der Mandarine, Tür 2 Theo mit dem Lakritz, Tür 3 Ellis mit dem Zimtstern, Tür 4 du mit dem Lebkuchen, Tür 5 Maren mit der Nuss.“

## Setups und Payoffs

| Setup in Tag 6 | Payoff |
| --- | --- |
| Zahnrad Nr. 12 mit Herz in Theos Notizbuch (`k03`) | Tag 14w: das goldene Zahnrad ist Nr. 12. Es ist Theos Ur-Ur-…-Großmutters Meisterstück |
| Theo repariert nachts heimlich | Tag 13a: Theo ist Isoldes Nachfahre; Tag 20: `theo_wrench` |
| Das einzelne Ticken am Morgen | Tag 21: Das Eis ist wieder da, jemand friert die Uhr jedes Mal wieder ein |
| Harry und Ron unter dem Umhang | Tag 17: beide sitzen im „Drei Besen“ (Hogsmeade), diesmal ohne Umhang. Ihr „Fuß“-Streit geht weiter |
| Stiefel-Gruß für Ellis (`star` / `note`) | Tag 17: Ellis' Schal-Reaktion; Tag 24: Ellis trägt den laminierten Zettel im Abspann |
