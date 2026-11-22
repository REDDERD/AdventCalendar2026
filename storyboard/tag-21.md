# Tag 21 – Im Uhrturm

> Akt III · Die letzte Stunde · Ort `clock_tower` · Musik `dungeon` · Haustier-Hinweis 3

| | |
| --- | --- |
| **Kurz** | Quill öffnet die Tür zum Uhrturm mit dem Teelöffel aus ihrer Hutnadel (seit Tag 1 angekündigt). Ellis klettert dreihundert Stufen trotz Höhenangst. Oben stehen die Zahnräder still, überzogen von Raureif bis in die Achsen. Das ist kein Defekt, das ist ein Wille. |
| **Entscheidungen** | `d21.climb` (`hand` / `alone`, Ton) · `d21.tone` (`talk` / `listen`, Ton) |
| **Hinweis** | `k09` Raureif im Uhrwerk (automatisch) |
| **Cameo** | **Fawkes** (nur bei Zauberstab `phoenix`: eine rote Feder als Funke, nur Erzählzeilen) |
| **Rätsel** | `p21` Zahnräder (`choice` mit Bild, 60 Punkte): **bereits umgesetzt** in `src/content/puzzles/p21.json` |
| **Haustier** | Haustier-Hinweis 3 (`[PLAN-2]`): Das Haustier kommentiert, Hinweis 1 gratis (`petHint` im JSON ergänzen) |
| **Rückbezug** | Tag 1 (Quills Teelöffel) · Tag 10/13a/20 (der Turmschlüssel bei Theo) · Tag 13w (Hortensias Mütze) · Tag 17 `gift_scarf` · `bond_ellis` · Tag 8 (Ellis' Theorie vier: der Setzling) · Tag 15a (Dumbledores Frage) |
| **Türchen-Zauber** | Ein Glockenspiel läutet im Uhrturm |
| **Wörter** | 288–316 gemessen (`content:simulate`) |

## Beats

1. Die Tür am Fuß des Turms. Quills Teelöffel, ein Schloss, das erleichtert aufgibt.
2. Die Treppe, dreihundert Stufen. Ellis steht still. **Entscheidung 1:** Hand reichen oder allein gehen lassen.
3. Oben: stillstehende Zahnräder, Reif bis in die Achsen. `k09`. Ein Platz im Werk ist leer, genau dort, wo Zahnrad Nr. 12 hängen müsste.
4. Ellis' Theorie vier (der Setzling). **Entscheidung 2:** leise zur Uhr sprechen oder schweigend zuhören. Bei `phoenix` fällt eine rote Feder.
5. Haustier-Kommentar, Rätsel: In welche Richtung dreht sich das letzte Rad?
6. Ein Rad bewegt sich um einen Zahn, ein Glockenspiel läutet einmal, dann ist es wieder still.

## Skript

```ink
INCLUDE globals.ink

// Tag 21 – Im Uhrturm (Akt III). Ort: clock_tower. Rätsel: p21. Haustier-Hinweis 3 [PLAN-2].
=== day21 ===
# bg: clock_tower
# music: dungeon
# spark: d21.s1 40 170
Einundzwanzigster Dezember.
Am Fuß des Uhrturms hängt eine Tür, die lange niemand gegrüßt hat.
# show: ellis left
# show: quill right
{ items ? gift_scarf: ellis: Ich trage Hortensias Mütze und deinen Schal. Ich bin eine Zwiebel. Aus Mut. }
{ not (items ? gift_scarf): ellis: Ich trage Hortensias Mütze. Gegen die Höhe. Sie hilft nicht, aber sie wärmt. }
quill: Grimsbys Schlüssel liegt bei Theo, und Theo schläft.
quill: Wir nehmen das Notfallwerkzeug.
Sie zieht den Teelöffel aus der Hutnadel, schiebt ihn ins Schloss und lauscht.
# sfx: door
Das Schloss gibt auf. Es klingt, als wäre es erleichtert.
ellis: Der Teelöffel! Seit Tag eins trägst du ihn mit dir herum, um genau das zu tun!
quill: Nein. Für Tee. Das hier ist ein Nebenverdienst.
Die Treppe windet sich dreihundert Stufen nach oben. Ellis bleibt an der ersten stehen.
# choice_point: d21.climb Ellis starrt auf die erste Stufe.
* [Ihm die Hand reichen.] # cid: d21.climb.hand
    { bond_ellis >= 4: ellis: Danke. Ich hätte es auch allein gekonnt. Aber so ist es schöner. }
    { bond_ellis < 4: ellis: Danke. Ich zähle trotzdem. Laut. Mit Betonung auf den Stufen. }
* [Ihn selbst gehen lassen.] # cid: d21.climb.alone
    { bond_ellis >= 4: ellis: Danke fürs Vertrauen. Ich gehe vor. Ich zähle sogar nicht. Fast. }
    { bond_ellis < 4: ellis: Das war mutig von dir. Ich würde es nicht machen. Ich mache es trotzdem. }
- Oben kreisen riesige Zahnräder, so groß wie Wagenräder. Alle stehen still.
Alle sind weiß vor Reif.
# clue: k09
quill: Reif. Nicht außen, sondern im Werk selbst, bis in die Achsen.
quill: So etwas friert nicht von allein.
ellis: Wie Zucker auf Lebkuchen. Nur kälter. Und nicht essbar. Ich habe geleckt.
Eine Achse ist leer. Genau dort müsste ein Zahnrad hängen. Das mit der 12.
quill: Zwei Defekte. Ein Verlust und ein Wille.
quill: Und eine Uhr, die nirgends kalt ist und trotzdem friert.
ellis: Theorie vier! Man muss mit ihr reden. Die Uhr ist ein Setzling.
ellis: Ich habe es nie aufgegeben.
# choice_point: d21.tone Ellis sieht dich erwartungsvoll an.
* [Leise mit der Uhr sprechen.] # cid: d21.tone.talk
    Du flüsterst. Der Reif knistert, als würde jemand lauschen. Dann ist es wieder still.
* [Still zuhören.] # cid: d21.tone.listen
    Du hörst nichts. Und doch schlägt irgendwo ein sehr leises Herz. Vielleicht ist es deins.
- { wand == "phoenix":
    # spark: d21.s3 130 250
    Von der Turmspitze fällt eine rote Feder. Dein Stab erwärmt sich.
    Irgendwo singt ein Vogel.
  }
{ pet == "owl": Deine Eule sitzt auf dem größten Rad. Sie dreht den Kopf im Takt, den es nicht gibt. }
{ pet == "cat": Deine Katze schnuppert am Reif. Sie niest. Es hört sich an wie ein Ticken. Fast. }
{ pet == "toad": Deine Kröte hüpft aufs Rad B und bleibt kleben. Sie quakt: „Linksrum, linksrum.“ }
quill: Das erinnert mich an ein Rätsel: Man dreht den Anfang, um das Ende zu sehen.
# puzzle: p21
{ last_puzzle_first_try: ellis: Beim ersten Mal! Rad F dreht sich. Ich war nie so stolz auf ein Rad. }
{ not last_puzzle_first_try: ellis: Rad F hat sich bewegt. Nicht lange. Aber sichtbar. Das zählt. }
# sfx: spark
Ein Rad dreht sich um einen Zahn. Im Turm läutet ein Glockenspiel.
Dann ist es wieder still.
quill: Wer eine Uhr einfriert, braucht keine Hände. Er braucht nur Kälte. Und Gründe.
# spark: d21.s2 214 150
-> END
```

## Rätsel `p21` – Zahnräder

> **Bereits umgesetzt** (`src/content/puzzles/p21.json`, Entwurf von M4). Das Storyboard übernimmt ihn unverändert.

- **Engine:** `choice` mit Bild `puzzle.p21.gears`. Quill dreht die Kurbel an Rad A. In welche Richtung dreht sich der Zeiger an Rad F?
- **Antworten:** Im Uhrzeigersinn · **Gegen den Uhrzeigersinn** (Lösung, Index 1) · Gar nicht, alles klemmt · Mal so, mal so.
- **Hinweise:** 1) Zwei Räder, die ineinandergreifen, drehen sich immer gegensinnig. 2) Berühren die drei Räder unten links das Rad B wirklich? 3) Ein Riemen, der über Kreuz läuft, dreht die Richtung um.
- **Super-Hinweis:** Die drei Räder unten links drehen sich nicht mit. Und der Riemen zwischen C und D ist gekreuzt.
- **Lösungstext:** „Gegen den Uhrzeigersinn. A dreht rechts herum, B links, C rechts. Der gekreuzte Riemen kehrt die Richtung um: D links, E rechts, F links.“
- **Haustier `[PLAN-2]`:** `petHint` im JSON (umgesetzt): Eule „Deine Eule hat die Räder lange studiert und dir Hinweis 1 aufgedeckt.“, Katze „Deine Katze pfotet nach dem Riemen. Hinweis 1 ist frei.“, Kröte „Deine Kröte quakt bei jedem Linksdreher. Hinweis 1 ist frei.“

## Setups und Payoffs

| Setup in Tag 21 | Payoff |
| --- | --- |
| Quills Teelöffel öffnet die Tür („ein Nebenverdienst“) | Tag 24: Quill benutzt den Löffel zum Umrühren des Finales |
| Der leere Platz der 12 | Tag 24: Zahnrad Nr. 12 als Scharnier der Tür (Ende A) |
| `k09` Raureif bis in die Achsen („ein Wille“) | Tag 22: Ellis' Theorie sieben (die Wahrheit); Tag 23: Beweis gegen `aldous` |
| `d21.tone.talk` / Ellis' Theorie vier | Tag 24: Wer mit der Uhr gesprochen hat, hört sie als Erster ticken |
| Die rote Feder (nur `phoenix`) | Tag 24: Fawkes' Gesang beim letzten Schlag |
| Ellis' Mütze und der Schal (`gift_scarf`) | Epilog: bei `bond_ellis ≥ 4` schenkt er den Schal zurück |
| Das leise Herz („vielleicht deins“) | Tag 24: Die Uhr tickt im Takt des Herzschlags im Finale |
