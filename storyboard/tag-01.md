# Tag 1 – Die stehende Uhr

> Akt I · Ort `great_hall` · Musik `castle` · **bereits geskriptet:** `src/content/ink/day01.ink` (hier nur als Referenz für Setups und Payoffs)

| | |
| --- | --- |
| **Kurz** | Der erste Morgen ohne Ticken. Quill macht die Spielfigur zu ihrer Assistenz, Ellis will „einen Fall“, Thornbury verlangt Schweigen. Das Rätsel: die Zeiger. |
| **Entscheidungen** | `d01.ellis` (`listen` +1 `bond_ellis` / `hush`) · `d01.secret` (`watch` / `promise`, Ton) |
| **Rätsel** | `p01` Die Zeiger (`input`, 20 Punkte): Wie oft stehen die Zeiger im rechten Winkel? Lösung `22` (Falle: 24) |
| **Wortzahl** | 345–380 (gemessen) |
| **Türchen-Zauber** | Das erste Türchen springt auf – leer. Am Ende: „Das erste Türchen. Leer, aber offen.“ |

## Was spätere Tage von Tag 1 übernehmen

| Setup in Tag 1 | Payoff |
| --- | --- |
| Ellis' sieben Theorien („Theorie eins: Zeitmotten“) | Eine Theorie pro Tag 2, 5, 8, 11, 16, 22 (Bibel Abschnitt 4) |
| Quills Leitspruch „Jedes Rätsel hat eine Lösung“ | Akt II: Tag 12, Akt III: Tag 22 oder 24 (Variante: „manchmal zwei“) |
| „Kein Wort zu irgendjemandem“ (Thornbury) | Dauer-Gag: In Tag 9 wissen es alle |
| `d01.ellis` (`listen`) | `bond_ellis`: Tag 2, 4, 12, 22 |
| `d01.secret` | `watch` → `f_d01_watch` (nur nach Patch unten), Tag 9 |
| Das erste, leere Türchen am Ende | Die Uhr lebt noch (Tag 2: das zweite Türchen, Tag 6: ein Tick, Tag 24: sie tickt wieder) |
| Quills Teelöffel in der Hutnadel | Tag 21: öffnet das Schloss zum Uhrturm |

## Optionaler Patch für `day01.ink`

Damit Tag 9 darauf anspielen kann, braucht die Option `watch` eine Zeile. Das ist die einzige Änderung an einer bestehenden Datei; ohne sie läuft alles, nur die Anspielung entfällt.

```ink
* [Ich passe auf Ellis auf.] # cid: d01.secret.watch
    ~ f_d01_watch = true
    thornbury: Ausgezeichnet. Das ist eine Lebensaufgabe, aber ich glaube an Sie.
```

Dazu `VAR f_d01_watch = false` aus `globals-zusatz.ink` in `globals.ink`.
