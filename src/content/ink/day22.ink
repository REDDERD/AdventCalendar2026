INCLUDE globals.ink

// Tag 22 – Die Pendelkammer (Akt III). Ort: pendulum_chamber. Rätsel: p22.
// Quelle: storyboard/tag-22.md.
=== day22 ===
# bg: pendulum_chamber
# music: dungeon
# spark: d22.s1 40 170
Zweiundzwanzigster Dezember.
Unter dem Uhrwerk liegt eine Kammer, so hoch wie ein Kirchenschiff.
Darin hängt, reglos, das Pendel. Eine Kupferscheibe, so groß wie ein Tisch.
# show: ellis left
# show: quill right
quill: Isolde schrieb: Das Pendel ist das Herz jeder Uhr. Sehen wir nach.
Auf der Scheibe liegt ein Brett aus Holzstäben. Eine Rechnung, falsch gelegt:
IX + II = VI.
ellis: Römische Zahlen. Ich habe laminierte Tabellen.
ellis: Aber keine, auf der steht, was ich hier soll.
quill: Ein Stab umlegen, und die Klappe geht auf.
quill: Das erinnert mich an ein Rätsel aus der Schulzeit.
# puzzle: p22
{ last_puzzle_first_try: ellis: Beim ersten Mal! Die Römer hätten geweint. Vor Rührung. }
{ not last_puzzle_first_try: quill: Ein Stab ist wenig. Ein Stab zu viel ist ein Irrtum. Man muss ihn finden. }
# sfx: door
Eine Klappe im Pendel springt auf. Tief ins Kupfer geritzt steht: CCC.
# clue: k10
ellis: Drei C. Hundert, hundert, hundert. Dreihundert! Die Sternschnuppen!
ellis: Drei, null, null!
quill: Dreihundert Zyklen. Dreihundert Jahre. Dreihundert Mal ein Türchen.
ellis: Theorie drei! Dreihundert Jahre ohne Urlaub!
ellis: Ich hatte recht, und niemand hat mir geglaubt!
{ bond_ellis >= 3: quill: Ich habe dir geglaubt, Ellis. Heimlich. Mit Teelöffel. }
# show: hermione center
Hinter dem Pendel raschelt es.
Eine junge Frau klettert hervor, den Pergamentstapel im Arm, Staub im Haar.
hermione: Ich bin in der falschen Woche. Oder im falschen Jahr.
hermione: Ich habe drei Seiten Notizen und zwei verloren.
hermione: Habt ihr einen Zeitumkehrer gesehen? Goldene Kette, kleine Sanduhr?
Im Hohlraum des Pendels blitzt eine goldene Sanduhr an einer Kette.
# choice_point: d22.hermione Hermine sucht ihren Zeitumkehrer.
* [Ihr die Sanduhr zurückgeben.] # cid: d22.hermione.give
    hermione: Danke! Ich war sicher, dass er die Zeitfransen verursacht.
    hermione: Ich habe ihn nicht angerührt. Fast.
* [Die Sanduhr als Beweis behalten.] # cid: d22.hermione.keep
    hermione: Beweis? Wofür? Gut. Aber bitte nicht drehen.
    hermione: Es gäbe sonst ein langes Wochenende.
- hermione: Er ist unschuldig. Er hat sich verirrt, weil die Uhr stehen blieb.
hermione: Er braucht Zeit, an der er sich festhält.
# hide: hermione
ellis: Dann kommt Theorie sieben. Die letzte. Ich habe sie mir für heute aufgehoben.
ellis: Eine Uhr bleibt stehen, wenn jemand nicht will, dass die Zeit weitergeht.
# emote: quill !
quill: Das ist die beste Theorie, die ich in dreißig Jahren gehört habe, Ellis.
ellis: Wirklich? Ich meinte es als Scherz. Jetzt macht sie mir Angst.
quill: Ein Ritter, dreihundert Jahre und ein Frost, der nirgends kalt ist.
quill: Ich habe einen Verdacht.
ellis: Wer? Sag es, bitte. Einer von euch beiden.
# choice_point: d22.ellis Ellis sieht dich blass an.
* [Ihm sagen, was du vermutest.] # cid: d22.ellis.tell
    ~ bond_ellis += 1
    # toast: Ellis wird sich das merken.
    ellis: Aldous? Er hat sich vor mir verbeugt! Aber danke, dass du es sagst.
    ellis: Ehrlichkeit ist selten.
* [Ihn schonen, bis es sicher ist.] # cid: d22.ellis.protect
    ellis: Du sagst es nicht? Ich sehe es dir an. Aber gut. Ich warte. Bis morgen.
- # sfx: spark
Das Pendel schwingt einmal. Ein einziger Schlag, und von der Decke fallen Schneeflocken.
# spark: d22.s2 214 150
-> END
