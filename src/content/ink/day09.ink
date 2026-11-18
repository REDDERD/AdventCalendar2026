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
