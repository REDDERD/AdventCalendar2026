# Tag 20 – Der Duellierclub

> Akt III · Die letzte Stunde · Ort `dueling_club` · Musik `dungeon`

| | |
| --- | --- |
| **Kurz** | Vor dem Ball übt die Schule im Duellierclub. Ein winziger Duellmeister aus einem anderen Dezember bringt das Zauberrad bei, in der Ecke signiert ein Mann mit Lächeln die Luft. Dann tritt Theo auf, mit Schraubenschlüssel in der Tasche, und gesteht, was er seit Wochen nachts tut. Wer ihm traut, bekommt seinen Schlüssel. |
| **Entscheidungen** | `d20.lockhart` (`sign` / `wave`, Ton) · `d20.duel` (`ally` nur bei `trust_theo ≥ 1` → Gegenstand `theo_wrench` / `oppose`, Ton / `wand`, Ton je Zauberstab) |
| **Gegenstand** | `theo_wrench` (nur `ally`): Ende A, ein Schritt weniger |
| **Hinweis (Nachholer, `[DEC-4]`)** | `k06` bei `trust_theo ≥ 2`, wenn man ihn noch nicht hat (Wald-Route) |
| **Cameo** | **Filius Flitwick** (`flitwick`), **Gilderoy Lockhart** (nur Erzählzeilen) |
| **Rätsel** | `p20` Zauberduell (`choice` mit Zauberrad, 50 Punkte) |
| **Rückbezug** | `trust_theo` (Tag 5, 6, 13a) · `k03` (Theos Notizbuch) · Tag 10 (der fehlende Turmschlüssel) · `wand` (Prolog) · `k06` |
| **Türchen-Zauber** | Die Zauberstäbe funkeln wie Wunderkerzen |
| **Wörter** | 231–279 gemessen (`content:simulate`) |

## Beats

1. Der Duellierclub. Flitwick auf einem Bücherstapel erklärt das Zauberrad: Jeder Spruch schlägt drei andere und verliert gegen drei. Lockhart signiert die Luft. **Entscheidung 1:** mitsignieren oder abwinken.
2. Rätsel: Flitwick wirft fünf Sprüche nach einem festen Muster. Der sechste ist zu besiegen.
3. Theo tritt auf. Ellis misstraut. Theo gesteht, dass er seit dem Stillstand nachts repariert und die Uhr jedes Mal wieder einfriert. Er ist Isoldes Nachfahre und hat den Turmschlüssel.
4. **Entscheidung 2:** an seiner Seite kämpfen, gegen ihn antreten oder den eigenen Stab sprechen lassen.
5. Bei `trust_theo ≥ 2` gibt er den Brief aus der Akte weiter, falls man ihn noch nicht hat. Wunderkerzen-Zauber.

## Skript

```ink
INCLUDE globals.ink

// Tag 20 – Der Duellierclub (Akt III). Ort: dueling_club. Rätsel: p20.
=== day20 ===
# bg: dueling_club
# music: dungeon
# spark: d20.s1 40 160
Zwanzigster Dezember. Im Duellierclub riecht es nach Kreide und Ehrgeiz.
# show: ellis left
# show: flitwick center
Auf einem Stapel Bücher steht ein winziger Professor mit Zauberstab und Siegerlächeln.
flitwick: Filius Flitwick! Duellmeister, einst Champion.
flitwick: Ich bin Gast aus einem anderen Dezember.
flitwick: Heute lernen wir das Zauberrad.
flitwick: Jeder Spruch schlägt drei andere und verliert gegen drei.
In der Ecke signiert ein blonder Mann mit strahlendem Lächeln die Luft.
Niemand weiß, wofür.
# choice_point: d20.lockhart Der Mann in der Ecke winkt dir zu.
* [Die Luft mitunterschreiben.] # cid: d20.lockhart.sign
    Du unterschreibst die Luft. Ein Schnörkel bleibt kurz sichtbar. Dann verdunstet er.
* [Höflich abwinken.] # cid: d20.lockhart.wave
    Er nickt gnädig: „Verstehe, Sie sind schüchtern.“ Er ist es nicht, aber das sagt er nicht.
- flitwick: Ich werfe fünf Sprüche in einer festen Folge.
flitwick: Finde den sechsten und schlage ihn.
# show: quill right
quill: Das erinnert mich an ein Rätsel, das sich selbst beim Sortieren erklärt.
# puzzle: p20
{ last_puzzle_first_try: flitwick: Ausgezeichnet! Sie lesen Muster wie andere die Zeitung. }
{ not last_puzzle_first_try: flitwick: Ein kleiner Fehler. Das Rad dreht sich weiter. Und wir mit ihm. }
# sfx: spark
Alle Zauberstäbe im Raum beginnen zu funkeln wie Wunderkerzen.
# show: theo right
Aus dem Schatten tritt Theo Ashcombe. In der Tasche ein Schraubenschlüssel.
theo: Ich brauche einen Gegner. Oder einen Partner. Ich entscheide mich nicht.
{ clues ? k03: ellis: Ein Notizbuch voller Zahnräder. Ein Schlüssel. Er ist es, oder? }
theo: Ja. Ich repariere die Uhr. Jede Nacht. Und jedes Mal friert sie wieder ein.
theo: Ich bin Isoldes Nachfahre. Wenn ich es nicht schaffe, wer dann?
ellis: Das erklärt das Messingöl. Und die Ölflecken. Ich bin erleichtert. Und verwirrt.
quill: Jemand friert sie wieder ein, kaum dass sie tickt.
quill: Das ist kein Defekt, Mr. Ashcombe.
quill: Das ist ein Wille.
theo: Ein Wille. Ja. Das habe ich auch gedacht. Ich wusste nur nicht, wessen.
{ trust_theo >= 1: theo: Den Turmschlüssel habe ich auch. Geliehen. Ich gebe ihn zurück. }
# choice_point: d20.duel Theo hebt den Zauberstab.
* { trust_theo >= 1 } [An Theos Seite kämpfen.] # cid: d20.duel.ally
    # item: theo_wrench
    # toast: Neuer Gegenstand: Theos Schraubenschlüssel
    theo: Hier. Mein Schlüssel. Er passt zu keinem Schloss. Aber zu fast jedem Zahnrad.
* [Gegen Theo antreten.] # cid: d20.duel.oppose
    Ihr tauscht ein paar Funken. Theo grinst schief. Er verliert, aber nicht ohne Stolz.
* [Den eigenen Stab sprechen lassen.] # cid: d20.duel.wand
    { wand == "phoenix": Dein Phönixstab glüht warm. Selbst Lockhart hört kurz auf, sich zu bewundern. }
    { wand == "dragon": Dein Drachenstab knistert. Die Kreidestriche an der Wand tanzen. }
    { wand == "unicorn": Dein Einhornstab beruhigt den Raum. Die Kreide hört auf zu quietschen. }
- { not (clues ? k06) and trust_theo >= 2:
    theo: Der Brief aus der Akte. „Mein Ritter.“ Er gehört nicht mir. Er gehört der Uhr.
    # clue: k06
  }
flitwick: Gut gekämpft! Und beim nächsten Mal nicht gegen die Uhr, sondern mit ihr.
# spark: d20.s2 214 140
-> END
```

## Rätsel `p20` – Zauberduell

- **Engine:** `choice` mit Bild `puzzle.p20.wheel` (das **Zauberrad**), vier Antwortkarten. Das Rad zeigt sieben Sprüche im Kreis; **jeder schlägt die nächsten drei im Uhrzeigersinn** und verliert gegen die drei davor.
- **Die Sprüche** im Uhrzeigersinn: Funkenflug · Windstoß · Eisregen · Steinhagel · Schattennebel · Blitzkette · Lichtsplitter.
- **Die Folge** (Flitwicks fünf Würfe): Funkenflug, Steinhagel, Lichtsplitter, Eisregen, Blitzkette. Muster: jedes Mal **drei Felder weiter** im Rad. Der sechste Wurf ist also **Windstoß**.
- **Wer schlägt Windstoß?** Funkenflug, Lichtsplitter und Blitzkette. Auf den Karten steht nur eine davon.
- **Antwortkarten:** Schattennebel · Windstoß · Steinhagel · **Lichtsplitter** (Lösung, Index 3).
- **Per Skript geprüft:** Jeder Spruch schlägt genau drei und verliert gegen genau drei. Wer ein falsches Muster liest (ein, zwei, vier oder fünf Felder weiter), landet bei Schattennebel, Steinhagel oder Windstoß, nicht bei der richtigen Karte.
- **Intro (Flitwick):** „Ein Duell ist ein Gespräch, in dem man nicht das letzte Wort spricht. Sondern das beste.“
- **Hinweise:** 1) Das Rad hat sieben Felder. Zähl, wie viele Felder zwischen zwei Würfen liegen. 2) Immer drei Felder weiter. Nach Blitzkette kommt Windstoß. 3) Windstoß verliert gegen die drei Sprüche vor ihm: Funkenflug, Lichtsplitter, Blitzkette.
- **Super-Hinweis:** Lichtsplitter schlägt Windstoß.
- **Lösungstext:** „Drei Felder weiter bei jedem Wurf. Nach Blitzkette kommt Windstoß, und den schlägt Lichtsplitter.“

## Setups und Payoffs

| Setup in Tag 20 | Payoff |
| --- | --- |
| `theo_wrench` (nur `ally`) | Tag 24: Ende A, ein Schritt weniger im Finale-Rätsel |
| Theo: „Jedes Mal friert sie wieder ein.“ | Tag 21: Raureif im Uhrwerk (`k09`) erklärt das |
| `k06` über Theo (nur Wald-Route, `trust_theo ≥ 2`) | Tag 23: Beweis gegen `aldous`; Epilog: `trust_theo ≥ 2` → Theo wird Uhrmacher-Lehrling |
| Der Turmschlüssel „geliehen“ | Tag 21: Quill öffnet den Uhrturm trotzdem mit ihrem Teelöffel; Theo gibt den Schlüssel zurück |
| Flitwick: „Beim nächsten Mal nicht gegen die Uhr, sondern mit ihr“ | Tag 24: die dritte Lösung |
| Lockhart signiert die Luft (`sign`) | Tag 24: Der Schnörkel hängt als Unterschrift unter dem Abschied der Zeitgäste |
| `wand` | Tag 21: Fawkes reagiert nur auf `phoenix` |
