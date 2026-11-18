# Tag 2 – Schwebende Kerzen

> Akt I · Die stehende Uhr · Ort `great_hall` · Musik `castle`

| | |
| --- | --- |
| **Kurz** | Grimsby behauptet, Stille sei herrlich. Peeves bläst alle Kerzen aus. Das zweite Türchen öffnet sich, und zwischen Zimtsternen fällt zum ersten Mal der Name eines Verdächtigen: Mäuse. |
| **Entscheidungen** | `d02.grimsby` (`polite` +1 / `cheeky` −1 `trust_grimsby`) · `d02.peeves` (`scare` / `join` → `peeves_friend`) |
| **Hinweis** | `k01` Kratzspuren am Uhrkasten (automatisch) |
| **Cameo** | Peeves (Poltergeist, siehe Bibel) |
| **Rätsel** | `p02` Schwebende Kerzen (`toggle`, 20 Punkte) |
| **Rückbezug** | `bond_ellis` aus `d01.ellis`: Ellis erzählt seine zweite Theorie je nach Stimmung anders |
| **Türchen-Zauber** | Zimtsterne rieseln von der Decke. Ellis fängt neun, Grimsby kehrt sie zusammen und isst heimlich einen |
| **Längster Pfad** | siehe README (gemessen mit `content:simulate`) |

## Beats

1. Zweiter Morgen, die Halle ist still. Grimsby feiert die Ruhe und putzt nervös. Er hält den Zustand für eine Verbesserung.
2. Quill darf die Uhr untersuchen („Erlaubnis“-Gag). **Entscheidung 1:** Wie reagiert man auf Grimsbys Gejammer?
3. `k01`: Kratzer am Uhrkasten. Grimsby sagt „Mäuse“. Ellis stellt Theorie zwei auf (Frosch im Hals).
4. Peeves stürzt herein, bläst alle schwebenden Kerzen aus und reimt. **Entscheidung 2:** anschreien oder mitmachen.
5. Rätsel: die Kerzen wieder anbekommen. Danach springt das zweite Türchen auf (Tag 1 hat das erste geöffnet).
6. Cliffhanger: Etwas Silbriges verbeugt sich am Ende der Halle vor der Uhr und ist weg. Nur Ellis hat es gesehen.

## Skript

```ink
INCLUDE globals.ink

// Tag 2 – Schwebende Kerzen (Akt I). Ort: great_hall. Rätsel: p02.
=== day02 ===
# bg: great_hall
# music: castle
# spark: d02.s1 214 150
Zweiter Dezember. Die Große Halle ist still, nur ein Eimer klappert.
# show: grimsby right
grimsby: Ruhe! Herrlich! Dreißig Jahre Tick, Tick, Tick. Und jetzt: nichts.
grimsby: Ich bin kein bisschen traurig. Ich putze nur. Stille staubt furchtbar.
# show: quill left
quill: Guten Morgen, Mr. Grimsby. Wir würden die Uhr gern untersuchen.
grimsby: Die Uhr gehört dem Schloss. Das Schloss gehört mir. Praktisch, oder?
# show: ellis center
{ bond_ellis >= 2: ellis: Theorie zwei! Du hast ja gesagt, du hörst zu. Also: }
{ bond_ellis < 2: ellis: Ich wollte Theorie zwei eigentlich nicht erzählen. Aber: }
ellis: Die Uhr hat einen Frosch im Hals. Deshalb hustet sie nicht mehr.
quill: Ellis. Eine Uhr hat keinen Hals.
ellis: Die Standuhr hat sogar einen sehr langen. Das ist ein Argument.
# emote: grimsby sweat
grimsby: Und was glotzt ihr so? Wollt ihr etwa Fußspuren auf meinem Boden hinterlassen?
# choice_point: d02.grimsby Grimsby schimpft über Dreck und Lärm.
* [Wir passen auf, versprochen.] # cid: d02.grimsby.polite
    ~ trust_grimsby += 1
    # toast: Grimsby wird sich das merken.
    grimsby: Hm. Manieren. Das gibt es noch? Man lernt nie aus.
* [Sie vermissen das Ticken sicher.] # cid: d02.grimsby.cheeky
    ~ trust_grimsby -= 1
    # toast: Grimsby wird sich das merken.
    # emote: grimsby !
    grimsby: Ich? Das Ticken? Pah! Wer sagt das? Wer hat das gesagt? Ellis?
    ellis: Ich habe nichts gesagt! Ich habe nur sehr laut gedacht!
- quill: Wenn Sie erlauben, Mr. Grimsby. Ich schaue mir nur das Gehäuse an.
# clue: k01
quill: Kratzer. Viele, kleine, in zwei Reihen. Mit Krallen, würde ich sagen.
grimsby: Mäuse. Haben wir hier. Seit Jahrhunderten. Sie zahlen keine Miete.
ellis: Mäuse mit Krallen aus Messing? Das ist die zweite Theorie wert!
# sfx: door
Mit einem Poltern kracht die Saaltür auf. Etwas Durchsichtiges schießt hinein.
# show: peeves center
peeves: Tick, tack, tuck, die Uhr hat Pech! Grimsby, wisch den Boden weg!
# emote: peeves note
Peeves, der Poltergeist, saust durch die Halle und pustet Kerze für Kerze aus.
Die schwebenden Weihnachtskerzen sacken zur Decke. Es wird gespenstisch dunkel.
grimsby: PEEVES! Das war die Weihnachtsbeleuchtung! Ich hänge dich an einen Haken!
peeves: Haken? Ich bin durchsichtig, Grimsby. Ich kann nicht hängen. Nur blubbern.
# choice_point: d02.peeves Peeves hängt kichernd an einem Kerzenleuchter.
* [Peeves anbrüllen.] # cid: d02.peeves.scare
    # emote: peeves !
    peeves: Huch! Ein Schreihals! Dann geh ich eben. Aber aus Prinzip nicht leise!
    # hide: peeves
    Peeves verschwindet laut quietschend in der Wand. Das Echo hört man noch lange.
* [Mit Peeves Kerzen auspusten.] # cid: d02.peeves.join
    ~ peeves_friend = true
    # toast: Peeves wird sich das merken.
    # emote: peeves heart
    peeves: Endlich! Jemand mit Humor! Du bist ab jetzt mein liebster Neuer!
    grimsby: Das wird ein sehr langer Dezember.
    peeves: Ich schulde dir was. Ich vergesse nie, wem ich was schulde. Fast nie.
    # hide: peeves
    Peeves wirbelt davon. Zurück bleiben ein leises Kichern und sehr viel Dunkelheit.
- quill: Nun denn. Ohne Licht sehen wir nichts, und mit Sehen löst man Rätsel.
quill: Die Kerzen reagieren, wenn man ihre Nachbarn berührt. Das kenne ich gut.
# emote: quill dots
quill: Das erinnert mich an ein Rätsel aus meiner Referendarszeit …
# puzzle: p02
{ last_puzzle_first_try: quill: Beim ersten Versuch. Ich merke mir Ihren Namen, {name}. }
{ not last_puzzle_first_try: ellis: Eine Kerze war gemein. Ich nenne sie Kevin. }
# sfx: door
Kaum brennt die letzte Kerze, klickt es im Uhrkasten. Das zweite Türchen springt auf.
Heraus rieseln Zimtsterne. Hunderte. Sie prasseln auf die Köpfe und die Tische.
# emote: ellis heart
ellis: ZIMTSTERNE! Ich fange alle! Ich wusste, dass Schnee ein Anfang ist!
grimsby: Zimtsterne im Haar. Das dauert Wochen, das rauszukämmen.
# emote: grimsby note
Er sammelt einen Stern auf, sieht sich um und steckt ihn in die Tasche.
# spark: d02.s2 40 230
# hide: grimsby
quill: Gestern ein Klicken, heute Gebäck. Ein Fortschritt. Aber die Uhr bleibt stehen.
ellis: Habt ihr das gesehen? Da hinten! Etwas Silbriges hat sich vor der Uhr verbeugt!
# emote: quill ?
quill: Die Halle ist siebenhundert Jahre alt, Ellis. Da spukt es mal.
ellis: Aber es hat sich VERBEUGT. Gespenster verbeugen sich nicht. Die glotzen nur.
quill: Dann hat es Manieren. Das schadet in diesem Schloss selten. Bis morgen.
-> END
```

## Rätsel `p02` – Schwebende Kerzen

> Schwerer als die erste Skizze (DECISIONS.md #44). Umgesetzt in `src/content/puzzles/p02.json`.

- **Engine:** `toggle`, **4 × 5 Kerzen**. Antippen schaltet die Kerze und ihre vier Nachbarn (Kreuzform, nicht diagonal). Ziel: alle 20 brennen.
- **Start:** Peeves hat nicht alle erwischt: Kerzen 2 und 5 in Reihe 1, 4 in Reihe 2, 1 in Reihe 3 und 3 in Reihe 4 brennen noch.
- **Geprüft (Gauß-Verfahren über GF(2)):** genau **eine** Lösung, **11 Berührungen**: Reihe 1: 1–4 · Reihe 2: 1, 2, 4, 5 · Reihe 3: 4, 5 · Reihe 4: 1.
- **Intro (Quill):** „Eine Kerze, die man berührt, steckt ihre Nachbarn an. Eine alte Regel, nach der auch Gerüchte funktionieren.“
- **Hinweise:** 1) Jede Kerze höchstens einmal, die Reihenfolge ist egal. 2) Licht jagen: Reihe für Reihe nach unten, unter jeder dunklen Kerze die darunter antippen. 3) Was unten dunkel bleibt, hängt nur von der obersten Reihe ab.
- **Super-Hinweis:** In der obersten Reihe die vier linken Kerzen, dann das Licht nach unten jagen.
- **Lösungstext:** „Elf Berührungen. Reihe 1: Kerzen 1 bis 4. Reihe 2: Kerzen 1, 2, 4 und 5. Reihe 3: Kerzen 4 und 5. Reihe 4: Kerze 1. Wer oben richtig anfängt, jagt das Licht einfach nach unten.“

## Setups und Payoffs

| Setup in Tag 2 | Payoff |
| --- | --- |
| Grimsby vermisst das Ticken (`cheeky` trifft ins Schwarze) | Tag 10: Grimsby gibt es zu |
| Peeves mag dich (`peeves_friend`) | Tag 19: Peeves hält sich bei der Geisterparade zurück, wenn du ihn darum bittest |
| Zimtsterne im Haar | Tag 24: Zimtsterne regnen beim letzten Türchen wieder, diesmal gewollt |
| Das Silbrige, das sich verbeugt | Tag 3 (Kälte), Tag 4 (Aldous stellt sich vor) |
| Ellis' Theorie zwei (Frosch im Hals) | Theorie drei folgt Tag 5 |
| Kratzspuren `k01` (Mäuse mit Krallen) | Tag 15w: `knopf` |
