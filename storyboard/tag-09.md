# Tag 9 – Der Hausabend

> Akt II · Verdacht · Ort `common_room` · Musik `castle`

| | |
| --- | --- |
| **Kurz** | Thornburys „Kein Wort zu irgendjemandem“ hat genau acht Tage gehalten: Die ganze Schule weiß von der stehenden Uhr. Am Hausabend geht jeder in seinen Gemeinschaftsraum. Vor der Tür wartet ein neues Passwort, drinnen der Tratsch über die Verdächtigen und der Hausgeist, der mehr über Sir Aldous weiß, als er sagen will. |
| **Entscheidungen** | `d09.secret` (`share` → Gegenstand `house_token` / `keep`, Ton) · `d09.ghost` (`ask` / `leave`, Ton) |
| **Gegenstand** | `house_token` (nur bei `share`, je Haus ein anderer: Löwenfeder, Honigtöpfchen, Adlerbrosche, Glücksstein) |
| **Cameo** | Die vier Hausgeister: **Fast Kopfloser Nick** (Gryffindor), **der Fette Mönch** (Hufflepuff), **die Graue Dame** (Ravenclaw), **der Blutige Baron** (Slytherin) – jeder Spieler sieht nur seinen. Die Fette Dame nur als Erzählzeile |
| **Rätsel** | `p09` Das Passwort (`input`, 30 Punkte, **vier Hausvarianten**) |
| **Rückbezug** | `d01.secret` über `f_d01_watch`: Quill erinnert an „Ich passe auf Ellis auf“ · alle Verdächtigen aus Akt I (Theo `k03`, Maren und Eule 38, Grimsby) |
| **Türchen-Zauber** | Die Kamine brennen in den Hausfarben |

## Beats

1. Morgen in der Großen Halle. Alle tuscheln. Ellis hat „nur drei Leuten“ von der Uhr erzählt. Rückbezug `f_d01_watch`.
2. Quill schickt alle zum Hausabend: Tratsch ist ein Werkzeug, wenn man ihn sortiert.
3. Vor dem eigenen Gemeinschaftsraum: Der Hausgeist kündigt ein neues, verzwicktes Passwort an.
4. Rätsel: das Passwort, je Haus eine eigene Variante.
5. Drinnen Tratsch über Theo, Maren und Grimsby. **Entscheidung 1:** Den Mitschülern erzählen, was man weiß (→ `house_token`), oder schweigen.
6. **Entscheidung 2:** Den Hausgeist nach Sir Aldous fragen oder ihn in Ruhe lassen. Wer fragt, hört zum ersten Mal von „dreihundert Jahren“.
7. Die Kamine brennen in den Hausfarben. Ellis' Eule bringt einen Zettel: morgen Grimsbys Büro.

## Skript

```ink
INCLUDE globals.ink

// Tag 9 – Der Hausabend (Akt II). Ort: common_room. Rätsel: p09 (je Haus eine Variante).
=== day09 ===
# bg: great_hall
# music: castle
# spark: d09.s1 214 150
Neunter Dezember. Die Große Halle summt wie ein Bienenstock. Alle reden über die Uhr.
# show: ellis left
# show: quill right
ellis: Ich habe es niemandem erzählt. Nur drei Leuten. Die haben es weitererzählt.
{ f_d01_watch: quill: Sie wollten auf ihn aufpassen, {name}. Ich sagte ja: eine Lebensaufgabe. }
{ not f_d01_watch: quill: „Kein Wort zu irgendjemandem“, sagte die Schulleiterin. Acht Tage hat es gehalten. }
ellis: Es waren nur Wörter! Keine ganzen Sätze. Gut, ganze Sätze. Mit Ausrufezeichen.
# show: thornbury center
thornbury: Professor Quill. Ich höre, die Uhr ist Tagesgespräch. In meiner Schule.
quill: Nur in Ihrer Schule, Schulleiterin. Draußen weiß es noch niemand.
thornbury: Beruhigend. Der Tagesprophet hat mir eben eine Eule mit drei Fragen geschickt.
# hide: thornbury
quill: Heute ist Hausabend. Hört euch um. Tratsch ist ein Werkzeug, wenn man ihn sortiert.
{ house == "ravenclaw": ellis: Wir gehen zusammen zu den Adlern! Ich kenne den Türklopfer. Er mich leider auch. }
{ house != "ravenclaw": ellis: Ich gehe zu den Adlern. Morgen tauschen wir alles aus. Ich bringe Theorien mit. }
# hide: quill
# hide: ellis
# bg: common_room
{ house:
- "gryffindor":
    Vor dem Porträt der Fetten Dame. Sie singt. Laut. Und mit Begeisterung falsch.
    # show: nick center
    nick: Neues Passwort, junger Freund! Die Dame hat es in ein Lied gesteckt. Mutig, nicht?
- "hufflepuff":
    Neben der Küche stapeln sich Fässer. Auf jedem steht etwas Essbares.
    # show: friar center
    friar: Willkommen, willkommen! Das Passwort steckt in den Fässern. Wie immer: im Essen.
- "ravenclaw":
    Am Ende der Wendeltreppe: eine Tür ohne Klinke, nur ein Türklopfer in Adlerform.
    # show: grey_lady center
    grey_lady: Der Adler fragt. Wer klug antwortet, darf hinein. Wer nicht, lernt etwas.
- "slytherin":
    Eine kahle Steinwand im Kerker. In die Steine sind sechs Wörter geritzt.
    # show: baron center
    baron: Das neue Passwort. Es steht dort. Man muss es nur sehen wollen.
}
Das erinnert dich an Quills liebsten Satz: Jedes Rätsel hat eine Lösung.
# puzzle: p09
{ last_puzzle_first_try: Die Tür gibt nach, kaum dass du das Wort sagst. Hinter dir wird applaudiert. }
{ not last_puzzle_first_try: Beim nächsten Versuch gibt die Tür nach. Hinter dir räuspert sich jemand. }
# sfx: door
Drinnen prasselt das Feuer. Alle wollen wissen, was du über die Uhr weißt.
{ house == "gryffindor": Jemand hat ein Banner gemalt: „Wir finden den Uhrdieb!“ Mit drei Fehlern. }
{ house == "hufflepuff": Auf jedem Tisch stehen Kekse. Niemand weiß, wer sie gebacken hat. Alle ahnen es. }
{ house == "ravenclaw": An der Tafel hängen schon zwölf Theorien. Neun davon in Ellis' Schrift. }
{ house == "slytherin": Alle tun, als interessiere sie die Uhr nicht. Alle sitzen sehr nah am Feuer. }
Ein Mitschüler flüstert: Theo schleicht nachts mit Werkzeug herum. Zahnräder im Notizbuch!
Eine andere: Maren schickt ständig Eulen. Und sie backt. Wer so viel backt, verbirgt was.
Und Grimsby? Der pfeift neuerdings. Er pfeift im Takt einer Uhr, die nicht mehr tickt.
# choice_point: d09.secret Alle sehen dich erwartungsvoll an.
* [Erzählen, was wir wissen.] # cid: d09.secret.share
    # item: house_token
    { house == "gryffindor": Zum Dank steckt man dir eine rote Löwenfeder an. „Für Mut im Dienst.“ }
    { house == "hufflepuff": Zum Dank bekommst du ein Honigtöpfchen aus der Küche. Es ist noch warm. }
    { house == "ravenclaw": Zum Dank heftet man dir eine Adlerbrosche an. Sie zwinkert. Manchmal. }
    { house == "slytherin": Zum Dank drückt man dir einen grünen Glücksstein in die Hand. Er ist kühl. }
    # toast: Neuer Gegenstand: Hausgegenstand
* [Schweigen. Es ist Quills Fall.] # cid: d09.secret.keep
    Du lächelst geheimnisvoll. Das macht es schlimmer. Jetzt gibt es Gerüchte über dich.
    Später flüstert dir jemand zu: „Gut so. Wer schweigt, hört mehr.“
- Der Hausgeist schwebt näher. Er sieht müde aus. Für einen Geist sehr müde.
# choice_point: d09.ghost Der Hausgeist wirkt nachdenklich.
* [Nach Sir Aldous fragen.] # cid: d09.ghost.ask
    { house == "gryffindor": nick: Aldous? Ein feiner Ritter. Er zählt die Tage. Dreihundert, sagt er, sind genug. }
    { house == "hufflepuff": friar: Der arme Aldous. Er zählt die Tage. Dreihundert Jahre, und er hat Angst vor dem letzten. }
    { house == "ravenclaw": grey_lady: Aldous zählt. Dreihundert Jahre. Manche Versprechen sind schwerer als Ketten. }
    { house == "slytherin": baron: Aldous zählt die Tage wie ein Gefangener. Dreihundert. Er wird es dir nicht sagen. }
    Der Geist verstummt, als hätte er zu viel gesagt. Er sieht hinüber zum Uhrturm.
* [Ihn in Ruhe lassen.] # cid: d09.ghost.leave
    Der Geist nickt dankbar und summt eine alte Melodie. Es klingt wie ein Uhrwerk.
- # sfx: spark
Die Flammen im Kamin färben sich in den Hausfarben. Alle jubeln, als wäre es ihr Werk.
# spark: d09.s2 40 200
Eine Eule pickt ans Fenster. Ellis schreibt: „Morgen: Grimsbys Büro. Nimm Kekse mit.“
-> END
```

Die Hausgeister sind Geister: durchscheinend und bläulich (DECISIONS.md #47).

## Rätsel `p09` – Das Passwort (vier Varianten)

> Jeder Spieler sieht nur die Variante seines Hauses (`variants` im Rätsel-JSON). Alle vier verstecken das Wort nach einer **Buchstabenregel**, die nur angedeutet wird. Per Skript geprüft: Jede Regel ergibt genau das Passwort.

| Haus | Wächter und Aufgabe | Regel (nur angedeutet) | Passwort |
| --- | --- | --- | --- |
| Gryffindor | Die Fette Dame singt: „Meine Igel singen tagsüber, eigentlich lieber zu Weihnachten, eher im Garten.“ Motto: „Mut fängt immer vorne an.“ | erster Buchstabe jedes Wortes | `MISTELZWEIG` |
| Hufflepuff | Neun Fässer: Salz · Kiwi · Lamm · Brot · Kürbis · Kompott · Kaffee · Zucker · Bohnen. Motto: „Wer fleißig ist, bleibt bis zum Schluss.“ | letzter Buchstabe jedes Fasses | `ZIMTSTERN` |
| Ravenclaw | Der Adler fragt: „Mein Erstes steckt im Sand, doch nicht in der Hand. Mein Zweites im Tor, doch nicht im Ohr. Mein Drittes im Eis, doch nicht im Mais. Mein Viertes in Raben, doch nicht in Gaben. Mein Letztes in der Nuss, doch nicht im Kuss.“ | der Buchstabe, den nur das erste Wort hat | `STERN` |
| Slytherin | In die Wand geritzt: Asche · Wiesel · Alraune · Ebbe · Regen · Orden. Motto: „Salazar schätzt, wer als Zweiter kommt.“ | zweiter Buchstabe jedes Wortes | `SILBER` |

- **Hinweise (je Haus):** 1) Das Motto verrät, wo du suchen musst. 2) Es kommt nur auf einen Buchstaben pro Wort an. 3) Die ersten drei Buchstaben des Passworts (MIS / ZIM / STE / SIL).
- **Super-Hinweis:** die Regel ausgeschrieben (z. B. „Nimm von jedem Fass den letzten Buchstaben.“).
- **Intro:** der jeweilige Hausgeist.

## Setups und Payoffs

| Setup in Tag 9 | Payoff |
| --- | --- |
| `house_token` (Löwenfeder, Honigtöpfchen, Adlerbrosche, Glücksstein) | Tag 18: Bonus-Szene im Raum der Wünsche (`d18.token`) |
| Der Hausgeist: „Aldous zählt die Tage. Dreihundert.“ (nur bei `ask`) | Tag 15a (Porträt 1726), Tag 19 (Geisterparade), Tag 22 (`k10` „CCC“ = 300) |
| Tratsch über Theo, Maren, Grimsby | Tag 10 (Grimsby), Tag 13a (Theo), Tag 16 (Maren) |
| Grimsby pfeift im Takt der Uhr | Tag 10: Er gibt zu, das Ticken zu vermissen |
| Die vier Hausgeister | Tag 19: Geisterparade |
