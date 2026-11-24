INCLUDE globals.ink

// Tag 19 – Die Geisterparade (Akt III). Ort: ghost_corridor. Rätsel: p19.
// Quelle: storyboard/tag-19.md.
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
# spark: d19.s2 214 140
-> END
