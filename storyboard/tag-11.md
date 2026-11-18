# Tag 11 – Das Boot

> Akt II · Die Spur · Ort `grounds_snow` · Musik `outdoor` · **Rätsel ersetzt den Entwurf `p11` „Spuren im Schnee“** (DECISIONS.md #40: Entwurf bis zum Storyboard von Tag 11)

| | |
| --- | --- |
| **Kurz** | Zwei Fährten führen vom Uhrturm weg. Am Seeufer braucht Hagrid Hilfe: Seine Herde muss mit einem Zweier-Boot ins Winterquartier, und Hippogreife sind nur einzeln höflich. Das Rätsel ist eine Fassung von „Wolves and Chicks“ (Layton). Am Ende steht fest: Der Dieb mit dem Glitzer klaut Löffel. |
| **Entscheidungen** | `d11.snow` (`play` +1 `bond_ellis` / `search` +1 Funke) · `d11.hagrid` (`eat` → `ate_rockcake` / `decline`, Ton) |
| **Cameo** | **Hagrid** (Gast aus einem anderen Dienstag), **Fang**, **Seidenschnabel** und zwei weitere Hippogreife, drei Frettchen (eines blasiert, streichbar) |
| **Rätsel** | `p11` Das Boot (`custom:cross`, 40 Punkte) |
| **Rückbezug** | Tag 1 (Quills Teelöffel in der Hutnadel) · Tag 6 (Harry und Ron unter dem Tarnumhang: Hagrid sieht zwei Paar Stiefel ohne Menschen) |
| **Ellis' Theorie** | Fünf: „Die Uhr hat sich eingeschneit.“ Gag |
| **Türchen-Zauber** | Schneemänner winken |
| **Neue Variable** | `ate_rockcake` (steht schon in `globals-zusatz.ink`) |

## Beats

1. Morgen nach dem Schneefall. Zwei Fährten vom Uhrturm: kleine Pfoten mit Glitzer zum Wald, feste Schuhe zum Archiv. Ellis' Theorie fünf.
2. **Entscheidung 1:** Schneeballschlacht oder Fährten ansehen.
3. Am See: Hagrid mit Fang, drei Hippogreifen und drei Frettchen. Er erklärt Boot und Regel.
4. **Entscheidung 2:** Felsenkuchen essen oder höflich ablehnen.
5. Hagrid erwähnt Stiefel im Schnee, an denen niemand steckt (Tag 6).
6. Rätsel: alle sechs ans andere Ufer.
7. Dank. Hagrid kennt den glitzernden Dieb: Er hat zwölf Löffel geklaut. Quill greift an ihre Hutnadel. Ausblick auf den Astronomieturm (Tag 12, Routenwahl).

## Skript

```ink
INCLUDE globals.ink

// Tag 11 – Das Boot (Akt II). Ort: grounds_snow. Rätsel: p11.
=== day11 ===
# bg: grounds_snow
# music: outdoor
# spark: d11.s1 30 140
Es hat die ganze Nacht geschneit. Der Uhrturm trägt eine Zipfelmütze aus Schnee.
Von ihm führen zwei Fährten weg. Kleine Pfoten, die glitzern, zum Wald.
Feste Schuhe zum Archiv.
# show: quill right
# show: ellis left
ellis: Theorie fünf! Die Uhr hat sich eingeschneit. Das erklärt alles. Auch das Wetter.
quill: Es erklärt gar nichts, aber es klingt gemütlich.
# choice_point: d11.snow Ellis schaut sehnsüchtig auf den frischen Schnee.
* [Eine Schneeballschlacht anfangen.] # cid: d11.snow.play
    ~ bond_ellis += 1
    # toast: Ellis lacht zum ersten Mal ohne Theorie.
    ellis: Du triffst mit links! Ich dachte, das können nur Meisterduellanten!
* [Die Fährten genauer ansehen.] # cid: d11.snow.search
    # spark: d11.s3 120 150
    Zwischen den Pfotenabdrücken liegt ein glitzernder Krümel. Sonst nichts.
    quill: Sorgfältig. Und der Schnee darf es nicht haben.
- # sfx: blip
# hide: ellis
# show: hagrid center
Am Seeufer fuchtelt jemand Riesiges mit den Armen. Neben ihm ein Hund, groß wie ein Sofa.
hagrid: Ihr da! Gut! Ich brauch Hände! Rubeus Hagrid, Wildhüter. Das is Fang.
hagrid: Er is feige. Aber treu.
quill: Ein Gast aus einer anderen Zeit, nehme ich an?
hagrid: Dienstag, glaub ich. Oder 'n anderer.
Hinter ihm warten drei Hippogreife und drei Frettchen. Alle sechs sehen einander an.
Eins der Frettchen reckt die Nase. Blasiert. Es sieht aus, als wüsste sein Vater davon.
hagrid: Meine Herde muss rüber ins Winterquartier. Ich hab nur ein Boot. Zwei passen rein.
hagrid: Es rudert allein, sobald einer drinsitzt. Aber: Hippogreife sind einzeln höflich.
hagrid: In der Überzahl vergessen sie ihre Manieren. Auf einem Ufer, wo ein Frettchen steht,
hagrid: dürfen nie mehr Hippogreife stehen als Frettchen. Wo keins steht, is es egal.
ellis: Und wenn doch?
hagrid: Dann hab ich ein Frettchen weniger. Und Seidenschnabel ein schlechtes Gewissen.
# choice_point: d11.hagrid Hagrid hält dir einen Teller hin.
* [Einen Felsenkuchen essen.] # cid: d11.hagrid.eat
    ~ ate_rockcake = true
    # sfx: blip
    # toast: Ein Zahn wackelt. Ein bisschen.
    hagrid: Selbst gebacken! Zweiter Versuch. Der erste hat die Tür getroffen.
* [Höflich ablehnen.] # cid: d11.hagrid.decline
    hagrid: Is gut. Fang isst ihn. Fang is hart im Nehmen.
- { ate_rockcake: ellis: Du hast ihn gegessen. Ich schreibe das unter „Mut“. }
{ not ate_rockcake: ellis: Sehr vernünftig. Ich schreibe das unter „Zähne“. }
hagrid: Vorhin im Schnee: zwei Paar Stiefel, aber keiner drin. Nur so'n Schimmern drüber.
quill: Es ist ein merkwürdiges Jahr, Mr. Hagrid.
quill: Das erinnert mich an ein Rätsel über Wölfe und Küken …
hagrid: Wölfe? Hier gibt's nur Hippogreife. Die sind besser erzogen. Meistens.
# puzzle: p11
{ last_puzzle_first_try: hagrid: Alle sechs drüben, keine Feder zu viel! Gleich beim ersten Mal! }
{ not last_puzzle_first_try: hagrid: Ein paar Federn sind geflogen. Aber alle sind drüben. Das zählt. }
# sfx: spark
Im Schnee springt ein Schneemann auf. Er winkt mit einem Stock.
hagrid: Die kleine Fährte mit Glitzer, Richtung Wald? Die kenn ich.
hagrid: Ein winziger Kerl. Hat mir die Löffel geklaut. Alle zwölf.
# emote: quill dots
Quill greift an ihre Hutnadel. Der Teelöffel steckt noch. Sie atmet auf.
quill: Morgen der Astronomieturm. Von oben sehen wir, welche Fährte weiter reicht.
ellis: Von oben. Hoch. Mit Treppen.
# spark: d11.s2 220 120
-> END
```

## Rätsel `p11` – Das Boot

> Fassung von „Wolves and Chicks“ (Layton): drei Räuber, drei Beutetiere, Boot für zwei, Überzahl auf einem Ufer ist verboten. Ersetzt den Entwurf „Spuren im Schnee“ (`tap`, `puzzle.p11.snow`). Die Engine `custom:cross` gibt es in `src/` **noch nicht**; unten steht die Spezifikation.

### Regeln im Spiel

- Links stehen **3 Hippogreife (H)** und **3 Frettchen (F)**, das Boot liegt links. Ziel: alle sechs am rechten Ufer.
- Das Boot trägt **1 oder 2 Wesen** (kein leeres Boot). Es fährt von selbst, sobald jemand drinsitzt.
- **Verbot:** Auf einem Ufer mit mindestens einem Frettchen dürfen nie mehr Hippogreife stehen als Frettchen. Gleichstand ist sicher, ein Ufer ohne Frettchen ist egal.
- Geprüft wird nach jeder Überfahrt an beiden Ufern: Das Abfahrtsufer ohne die Passagiere, das Zielufer mit ihnen. Im Boot selbst passiert nichts.

### Per BFS geprüft (Scratchpad, `cross.mjs`)

| Größe | Wert |
| --- | --- |
| Sichere Zustände (mit Bootsseite) | 16 |
| Kürzeste Lösung | **11 Überfahrten** |
| Kürzeste Lösungen | **4** (zwei Möglichkeiten am Anfang, zwei am Ende) |
| Erste Überfahrt, legal | 1H · 1H1F · 2H |
| Zufallsspiel (zufällige legale Züge) | löst in 60 Zügen ca. **24 %**. Ehrliche Einschätzung: Der Zustandsraum ist klein, der Reiz liegt im Umweg, nicht im Probieren |

Kürzeste Lösung (H = Hippogreife, F = Frettchen, → rechts, ← links):
`2H→ · 1H← · 2H→ · 1H← · 2F→ · 1H1F← · 2F→ · 1H← · 2H→ · 1H← · 2H→`

Zustand links nach jedem Zug (H/F): 1/3 → 2/3 → 0/3 → 1/3 → 1/1 → 2/2 → 2/0 → 3/0 → 1/0 → 2/0 → 0/0.

### Wenn es knackiger sein soll

Die Größen lassen sich per JSON ändern. Gemessen: 4 + 4 mit Boot für 3: 9 Überfahrten (leichter); **5 + 5 mit Boot für 3: 11 Überfahrten, 28 Zustände, Zufallsquote nur ca. 13 %**; 6 + 6 mit Boot für 4: 9 Überfahrten. Für Layton-Treue bleibt 3 + 3 (Entscheidung Auftraggeber).

### Entwurf `src/content/puzzles/p11.json`

```json
{
  "id": "p11",
  "number": 11,
  "title": "Das Boot",
  "points": 40,
  "type": "custom",
  "prompt": "Drei Hippogreife und drei Frettchen sollen über den See. Das Boot trägt zwei. Wo ein Frettchen steht, dürfen nie mehr Hippogreife stehen als Frettchen.",
  "config": {
    "component": "cross",
    "capacity": 2,
    "predators": { "label": "Hippogreife", "count": 3 },
    "prey": { "label": "Frettchen", "count": 3 },
    "banks": ["Schlossufer", "Winterquartier"]
  },
  "solution": [0, 0],
  "hints": [
    "Wo kein Frettchen steht, ist alles erlaubt. Dort können Hippogreife allein stehen.",
    "Zuerst müssen die Hippogreife rüber, einer fährt als Rückfahrer zurück. Erst dann sind die Frettchen dran.",
    "Nach vier Fahrten stehen zwei Hippogreife rechts und alles andere links. Dann fahren die Frettchen zu zweit."
  ],
  "superHint": "Zwei Hippogreife hin, einer zurück, zwei hin, einer zurück. Dann zwei Frettchen hin.",
  "solutionText": "11 Überfahrten: 2 Hippogreife hin, 1 zurück, 2 hin, 1 zurück, 2 Frettchen hin, 1 Hippogreif und 1 Frettchen zurück, 2 Frettchen hin, 1 Hippogreif zurück, 2 hin, 1 zurück, 2 hin.",
  "intro": {
    "speaker": "hagrid",
    "text": "Ich hab sechs Tiere, ein Boot und kein Talent fürs Rechnen. Aber ich hab euch."
  }
}
```

`solution` ist das Ziel `[Hippogreife links, Frettchen links] = [0, 0]` mit Boot rechts.

### Spezifikation der Engine `custom:cross` (später in `src/`)

- **Logik** `src/puzzles/logic/cross.ts`, Aufbau wie `pour.ts`: `crossConfig` (zod: `component: 'cross'`, `capacity`, `predators`/`prey` mit `count` und `label`, `banks`), `crossLogic` mit `initial`, `check`, `describe`, `verify`.
- **Zustand:** `{ left: [h, f], boatLeft: boolean, moves: number }`.
- **Zug:** `cross(config, state, h, f)`: `1 ≤ h + f ≤ capacity`, genug Wesen am Bootsufer, beide Ufer nach der Fahrt sicher (siehe Regeln). Sonst `null`.
- **`verify` / `puzzles:verify`:** BFS über Zustände mit `bfs()` aus `logic/types.ts`, meldet `11 moves minimum`; Fehler, wenn nicht lösbar oder Start unsicher.
- **Oberfläche** `engines/Cross.tsx`, ähnlich `Pour.tsx`: zwei Ufer mit Tieren, Boot in der Mitte. Tier antippen: steigt ein (maximal 2) oder wieder aus. Knopf „Ablegen“. Verbotene Überfahrt wird gezeigt (Federn fliegen, Quieken), dann Zug zurückgenommen und `refused` wie bei `pour`.
- **Tests** in `tests/unit/engines.test.ts` nach dem `pour`-Muster: lösbar in 11 (Zugliste oben), falsches Ziel abgelehnt, Überzahl abgelehnt (z. B. 3H gegen 1F am Ufer), leeres Boot und Überladung abgelehnt.
- **Assets:** Pixel-Sprites Hippogreif und Frettchen, Boot, Ufer (bis dahin Platzhalter `[GFX-6]`). Entfällt: `puzzle.p11.snow`, `public/assets/puzzles/p11.png`.
- **Mit umzuziehen:** `src/content/schedule.ts` Tag 11 (`Spuren im Schnee` → `Das Boot`), Sprecher `hagrid` in `CHARACTERS` und `speakers.ts`, DECISIONS-Eintrag.

## Setups und Payoffs

| Setup in Tag 11 | Payoff |
| --- | --- |
| Zwei Fährten (Pfoten mit Glitzer, Schuhe) | Tag 12: Routenwahl `d12.route` (Wald / Archiv). Die Pfoten führen zu `knopf` (Tag 15w), die Schuhe zu Theo (Tag 13a) |
| Hagrid: „Ein winziger Kerl, hat zwölf Löffel geklaut“ | Tag 15w: Knopf sammelt Glänzendes. Newt: Nifflers sind keine Diebe, sondern Sammler. Die Löffel liegen in seinem Bau |
| Quills Teelöffel in der Hutnadel | Tag 21: öffnet das Schloss zum Uhrturm (bleibt bewusst unangetastet) |
| `ate_rockcake` | Tag 16: Hagrid bei der Tischordnung. Mit Kuchen erinnert er sich und bringt dir einen mit |
| Hagrid und Seidenschnabel als Zeitgäste | Tag 16: Tischordnung. Tag 24: sie kehren zurück, Seidenschnabel verbeugt sich als Letzter |
| Stiefel ohne Menschen (Harry und Ron, Tag 6) | Tag 17: die beiden stehen in Hogsmeade ohne Umhang vor dem Honigtopf |
| Das blasierte Frettchen (streichbar) | Tag 16: Es sitzt am Ball-Tisch und verlangt, dass sein Vater benachrichtigt wird |
