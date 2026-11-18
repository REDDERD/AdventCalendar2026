INCLUDE globals.ink

// Prologue – train ride and arrival (Section 6.1 step 5). Sorting and reveal follow as screens.
=== prologue ===
# bg: train
# music: title
# show: player left
Der Hogwarts-Express schnauft durch die verschneiten Highlands.
{ pet == "owl": Deine Eule schläft auf der Gepäckablage. Sie schnarcht. Leise, aber eindeutig. }
{ pet == "cat": Deine Katze hat das ganze Abteil für sich beansprucht. Und deinen Schal. }
{ pet == "toad": Deine Kröte starrt aus dem Fenster, als würde sie die Schneeflocken zählen. }
Draußen tauchen Lichter auf. Ein Schloss, als hätte jemand Sterne gestapelt.
Mit einem Ruck hält der Zug. Auf dem Bahnsteig wartet jemand mit spitzem Hut. # show: quill right
quill: Willkommen! Du musst {pronoun_form("unsere neue Austauschschülerin", "unser neuer Austauschschüler", "unser neuer Gast")} sein.
quill: Henrietta Quill, Rätselkunde. Ich trinke zu viel Tee und stelle zu viele Fragen.
quill: Der Sprechende Hut wartet schon. Er ist ungeduldig. Für einen Hut.
# choice_point: d00.nervous Wie fühlst du dich vor der Einteilung?
* [Ich bin bereit!] # cid: d00.nervous.ready
    # emote: quill heart
    quill: So gefällt mir das. Mut steht dir.
* [Ein bisschen nervös …] # cid: d00.nervous.nervous
    # emote: quill note
    quill: Das ist ganz normal. Der Hut beißt nicht. Meistens.
- quill: Komm, {name}. Hogwarts wartet auf dich.
-> END
