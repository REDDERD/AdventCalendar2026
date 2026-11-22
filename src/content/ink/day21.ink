INCLUDE globals.ink

// Tag 21 – Im Uhrturm (Akt III). Ort: clock_tower. Rätsel: p21. Haustier-Hinweis 3 [PLAN-2].
// Quelle: storyboard/tag-21.md.
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
