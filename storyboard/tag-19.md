# Tag 19 – Die Geisterparade

> Akt III · Die letzte Stunde · Ort `ghost_corridor` · Musik `castle`, am Ende `aldous` (Clair de lune, nah)

| | |
| --- | --- |
| **Kurz** | Im Geisterkorridor probt die Schule ihre Parade für den Ball. Jeder Geist behauptet, der Älteste zu sein, und Quill soll die Reihe ordnen. Aldous steht am Ende, still. Die Graue Dame sagt ihm den klügsten Satz des Abends. Danach folgen alle der Klaviermusik, die seit dem 1. Dezember durch die Flure klingt: Aldous spielt Debussys „Clair de lune“ für Isolde. |
| **Entscheidungen** | `d19.parade` (`nick` / `peeves`, Ton; mit `peeves_friend` ist Peeves brav) · `d19.aldous` (`comfort` +1 `trust_aldous` / `press`, Ton) |
| **Cameo** | **Fast Kopfloser Nick** (`nick`), **Die Graue Dame** (`grey_lady`), **Der Blutige Baron** (`baron`), **Peeves** (`peeves`), Aldous (`aldous`); der **Fette Mönch** und die **Maulende Myrte** (nur Erzählzeilen und Rätsel) |
| **Rätsel** | `p19` Die Parade (`arrange` Reihe, 50 Punkte) |
| **Rückbezug** | `peeves_friend` (Tag 2) · `kept_chair` (Tag 16) · Tag 9 (die Hausgeister) · Tag 14a (Myrte) · `trust_aldous` (Tag 15a, 17) · Tag 15a (Aldous: „Bleiben als Verdienst“) |
| **Türchen-Zauber** | Die Geister singen im Chor |
| **Wörter** | 371–397 gemessen (`content:simulate`) |

## Beats

1. Die Geister stellen sich auf. Nick begrüßt mit einer Verbeugung (fast ohne Kopf). **Entscheidung 1:** Wer führt die Parade an: Nick oder Peeves?
2. Die Graue Dame und der Blutige Baron: jeder will der Älteste sein. Die Reihe ist in Unordnung. Der Mönch rollt heran, Myrte schaut aus dem Rohr. Rätsel: Die Geister nach Jahrhundert ordnen.
3. Die Geister singen im Chor. Aldous steht am Ende und singt nicht. Ellis erinnert ihn an den freien Stuhl (oder lädt ihn nachträglich ein).
4. Die Graue Dame: „Das Gefängnis ist nicht das Bleiben. Es ist, dass dich niemand fragt, ob du willst.“ **Entscheidung 2:** trösten oder zur Rede stellen.
5. Vom Ende des Korridors klingt Klavier, wie jeden Abend. Ellis und Quill gehen nach: Hinter einer angelehnten Tür spielt Aldous „Clair de lune“. Die Musik wechselt von „aus dem Nebenraum“ zu „direkt daneben“ (`# music: aldous`, DECISIONS #81). Er spielt es jeden Abend für Isolde, die es nie gehört hat.

## Skript

```ink
INCLUDE globals.ink

// Tag 19 – Die Geisterparade (Akt III). Ort: ghost_corridor. Rätsel: p19.
=== day19 ===
# bg: ghost_corridor
# music: castle
# spark: d19.s1 36 170
Neunzehnter Dezember. Im Geisterkorridor wird es eng.
Silberne Gestalten stellen sich in einer Reihe auf.
# show: ellis left
# show: quill right
ellis: Eine Geisterparade! Sie findet nur alle hundert Jahre statt.
ellis: Heute zum dritten Mal wieder.
# show: nick center
nick: Sir Nicholas, der Fast Kopflose. Betonung auf „fast“.
nick: Ihr dürft es ansehen, aber nicht berühren.
nick: Wer trägt die erste Laterne? Ich wäre geeignet, aber mein Kopf hat Termine.
# choice_point: d19.parade Die Parade braucht jemanden an der Spitze.
* [Nick führt die Parade an.] # cid: d19.parade.nick
    nick: Eine Ehre! Ich verbeuge mich. Der Kopf verbeugt sich mit. Meistens.
* [Peeves führt die Parade an.] # cid: d19.parade.peeves
    # show: peeves center
    { peeves_friend:
        peeves: Ich bin brav! Ich halte die Laterne! Ich mache nichts kaputt! Sehr nicht!
        Peeves schwebt feierlich voran und murmelt: „Brav, brav, brav.“
    - else:
        peeves: Laternen sind zum Fallenlassen! Tadaa!
        Die Laterne fällt, die Kerzen erlöschen, drei Geister fluchen im Chor.
    }
- # show: grey_lady left
Eine hohe Gestalt in Grau tritt dazu.
# show: baron right
Neben ihr ein finsterer Geist mit Blutflecken auf der Brust.
grey_lady: Du bist die Assistenz. Wir sind die Älteren. Beide.
baron: Ich bin älter. Ich habe es nicht eilig, es zu beweisen.
grey_lady: Die Reihe ist durcheinander. Jeder behauptet, der Älteste zu sein.
grey_lady: Entscheidet ihr.
Der Fette Mönch rollt kichernd heran. Aus einem Rohr schaut Myrte und winkt traurig.
quill: Das erinnert mich an ein Rätsel über Alter, Eitelkeit und Gespensterstolz.
# puzzle: p19
{ last_puzzle_first_try: baron: Beim ersten Versuch. Ich gebe es ungern zu. Also gar nicht. }
{ not last_puzzle_first_try: grey_lady: Fast. Aber Eitelkeit ist keine Reihenfolge. }
# sfx: spark
Die Geister singen im Chor. Falsch, aber so, dass die Rüstungen mitsummen.
# show: aldous center
Am Ende der Reihe steht Sir Aldous. Er singt nicht mit.
{ kept_chair: ellis: Sir Aldous! Wir haben Ihnen einen Stuhl freigehalten. Bei der Tafel. Am Kopfende. }
{ not kept_chair: ellis: Sir Aldous! Sie sind zum Ball eingeladen. Auch wenn wir es spät merken. }
aldous: Einen Stuhl? Für mich? Fürwahr. Das hat seit dreihundert Jahren niemand getan.
grey_lady: Du zählst die Tage, Aldous. Ich sehe es an deinen Schultern.
grey_lady: Das Gefängnis ist nicht das Bleiben.
grey_lady: Es ist, dass dich niemand fragt, ob du willst.
aldous: Gestattet. Ich muss nachdenken.
# choice_point: d19.aldous Aldous senkt den Blick.
* [Aldous trösten.] # cid: d19.aldous.comfort
    ~ trust_aldous += 1
    # toast: Aldous wird sich das merken.
    Du trittst neben ihn. Er sagt nichts. Aber die Luft wird ein wenig wärmer.
* [Ihn zur Rede stellen.] # cid: d19.aldous.press
    ellis: Sir Aldous, wissen Sie, warum die Uhr stehen geblieben ist?
    aldous: Fürwahr … Gestattet, ich muss gehen.
    quill: Er hat nicht Nein gesagt. Das ist erwähnenswert.
- # hide: aldous
Ein Hauch Frost bleibt in der Luft. Die Geister stellen sich neu auf und singen leiser.
Dann, vom Ende des Korridors: ein Klavier. Leise, wie an jedem Abend.
# show: ellis left
ellis: Das höre ich seit dem ersten Dezember. Überall. Und nie sitzt jemand am Klavier.
# show: quill right
quill: Dann sehen wir heute nach. Auf Zehenspitzen.
# music: aldous
Hinter einer angelehnten Tür steht ein verstaubter Flügel. Die Tasten bewegen sich.
Auf dem Hocker schimmert es silbern.
# show: aldous center
aldous: Oh. Ihr habt mich gefunden.
aldous: Ein Franzose hat es geschrieben, Debussy. „Mondschein“. Vor gut hundert Jahren.
aldous: In dreihundert Jahren lernt man viele Stücke. Dieses spiele ich für Isolde.
aldous: Sie hat es nie gehört. Ich spiele es trotzdem jeden Abend.
ellis: Dann waren Sie das. Die Musik in den Fluren. Die ganze Zeit.
Aldous lächelt und spielt weiter. Ihr bleibt bis zum letzten Ton.
# spark: d19.s2 214 140
-> END
```

## Rätsel `p19` – Die Parade

- **Engine:** `arrange`, Modus `row`, sechs Geister in einer Reihe von **links = der Älteste** nach rechts = der Jüngste. Keine neue Engine.
- **Geister:** Graue Dame, Blutiger Baron, Fetter Mönch, Fast Kopfloser Nick, Sir Aldous, Maulende Myrte.
- **Sechs Hinweise** (Feld `clues` wie bei `p06`, zusätzlich als Regeln hinterlegt):
  1. Der Baron kam direkt nach der Grauen Dame. (`right_of`)
  2. Der Mönch und der Baron stehen nebeneinander. (`next_to`)
  3. Nick und Myrte stehen nicht nebeneinander. (`not_next_to`)
  4. Der Baron ist mindestens zwei Plätze älter als Nick. (`left_of`, Abstand 2)
  5. Der Baron ist mindestens zwei Plätze älter als Myrte. (`left_of`, Abstand 2)
  6. Myrte kam direkt nach Aldous. (`right_of`)
- **Per Skript geprüft:** genau **eine** Reihenfolge von 720: **Graue Dame, Baron, Mönch, Nick, Aldous, Myrte** (Jahrhunderte: 10., 11., 14., 15., 18., 20. Jh., in der Szene nicht genannt).
- **Intro (Graue Dame):** „Die Älteren stehen vorn. Das ist keine Höflichkeit, sondern Geometrie.“
- **Hinweise:** 1) Der Baron kam direkt nach der Grauen Dame, also stehen die beiden zuerst nebeneinander. 2) Der Mönch steht direkt neben dem Baron, also hinter ihm, denn links steht schon die Dame. 3) Myrte kam direkt nach Aldous, beide ganz rechts.
- **Super-Hinweis:** Graue Dame, Baron, Mönch, Nick, Aldous, Myrte.
- **Lösungstext:** „Graue Dame, Baron, Mönch, Nick, Aldous, Myrte. Der Mönch muss hinter dem Baron stehen, Nick und Myrte trennt Aldous.“

## Zusätze für die Umsetzung

- **Geister-Flag:** Alle sechs Geister (und Peeves) bekommen im NPC-Rezept `ghost` (DECISIONS #47); Aldous ganz blassblau, die anderen anteilig.
- **Sprecher:** `nick`, `grey_lady`, `baron`, `friar` stehen schon in `CHARACTERS`. Neu ist nur `myrte` (kommt schon an Tag 14a vor): `CHARACTERS` und `speakers.ts` ergänzen.
- **`else` in Ink:** Der `peeves_friend`-Zweig nutzt einen mehrzeiligen `{ cond: … - else: … }`-Block.

## Setups und Payoffs

| Setup in Tag 19 | Payoff |
| --- | --- |
| „Das Gefängnis ist nicht das Bleiben. Es ist, dass dich niemand fragt, ob du willst.“ | Tag 24: Die dritte Lösung besteht darin, Aldous zu fragen |
| Aldous: „Seit dreihundert Jahren hat das niemand getan.“ | Tag 22: `k10` „CCC“ = 300 |
| `kept_chair` und der freie Stuhl | Tag 24: Aldous sitzt am Kopf der Tafel |
| `peeves_friend` und die Laterne | Tag 24: Peeves wirft zum Abschied Konfetti statt Kerzen |
| Nick: „Mein Kopf hat Termine“ | Tag 24: Nick verabschiedet sich als Erster, der Kopf folgt später |
| `trust_aldous` +1 (`comfort`) | Tag 24: Bedingung für Ende A (`trust_aldous ≥ 1`) |
| Die Klaviermusik in den Fluren (Tag 1–18, `castle`) | Tag 19: Aldous ist der Pianist. „Clair de lune“ spielt er für Isolde |
| Aldous weicht aus (`press`) | Tag 23: Quill hält die Szene in der Anklage fest |
