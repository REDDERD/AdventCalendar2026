INCLUDE globals.ink

// Tag 5 – Der Enteisungstrank (Akt I). Ort: potions. Rätsel: p05.
// Quelle: storyboard/tag-05.md. Anpassungen: Funke ins 256 × 512-Raster; Quill erscheint wieder, nachdem Theo geht. Rätsel 14/9/5 (DECISIONS.md #44).
=== day05 ===
# bg: potions
# music: dungeon
# spark: d05.s1 22 140
Der Zaubertrank-Kerker. Kessel blubbern. Es riecht nach Schwefel und alten Socken.
An der Wand hängt ein Porträt: schwarze Haare, schmale Lippen, ein Naserümpfen.
Es sagt nichts. Es sagt es sehr laut.
# show: quill right
# show: slughorn center
slughorn: Die neue Assistenz! Wie reizend. Ich sammle begabte Menschen, wie andere Briefmarken.
slughorn: Professor Horace Slughorn. Ich unterrichte hier. Oder habe. Oder werde. Zeitformen.
quill: Horace, wir brauchen einen Enteisungstrank. Für Eis, das nicht dorthin gehört.
# show: ellis left
ellis: Er ist übrigens Gast aus … irgendwann. Zeitfransen. Das Wort habe ich selbst erfunden.
quill: Habe ich erfunden, Ellis.
ellis: Wir haben das gemeinsam erfunden. Mit Fußnote.
# choice_point: d05.slughorn Slughorn mustert dich wie ein Sammlerstück.
* [Ihm ein wenig schmeicheln.] # cid: d05.slughorn.flatter
    slughorn: Wunderbar! Charme und Talent! Sie sind für meinen Weihnachtsclub vorgemerkt.
* [Bescheiden bleiben.] # cid: d05.slughorn.modest
    slughorn: Bescheiden! Noch seltener als Talent. Ich bin entzückt.
- slughorn: Zur Auflockerung: eine Duftprobe. Amortentia, der Trank der stärksten Düfte.
quill: Duftkunde, Horace. Keine Herzensangelegenheiten.
slughorn: Natürlich, natürlich. Jeder riecht, was ihn glücklich macht.
Du schnupperst am Fläschchen. Es duftet nach {personal("amortentiaScents")}.
ellis: Bei mir: Tinte, frischer Toast und Theorien. Ich wusste nicht, dass Theorien duften.
# show: theo right
Hinten wird jemand ganz still. Theo Ashcombe hält den Atem an. Zu spät.
Der Trank duftet nach Maschinenöl und warmem Messing.
theo: Kerzenwachs. Es riecht nach Kerzenwachs. Schreibt das auf.
slughorn: Natürlich, mein Junge. Sehr … wachsig.
# emote: theo dots
{ items ? bookmark: Theo sieht das gestickte Lesezeichen in deiner Hand. Sein Gesicht wird weiß. }
{ items ? bookmark: theo: Wo habt ihr das her? Das gehört euch nicht. }
{ items ? bookmark: quill: Es gehörte Isolde Tickwell. Kennen Sie es, Mr. Ashcombe? }
{ items ? bookmark: theo: Nein. Doch. Ich meine: Nein. Sie müssen es wissen. }
{ not (items ? bookmark): theo: Das ist die Skizze von Isolde Tickwell, nicht wahr? Spannende Lektüre. }
theo: Ihr braut gegen Eis. Mit der alten Rezeptur? Die versagt ohne Messingöl.
# choice_point: d05.ingredient Theo bietet an, Messingöl beizusteuern.
* [Das Messingöl annehmen.] # cid: d05.ingredient.accept
    ~ trust_theo += 1
    # toast: Theo wird sich das merken.
    theo: Nur ein Tropfen. Den Rest behalte ich. Aus Prinzip.
* [Wir kommen allein klar.] # cid: d05.ingredient.decline
    theo: Wie ihr wollt. Ich bin nur ein Slytherin mit Messingöl. Nichts weiter.
- # hide: theo
# show: quill right
quill: Dann los. Wir brauchen genau sieben Maß und noch einmal sieben.
{ pet == "owl": Deine Eule sitzt auf dem Kesselrand und schüttelt den Kopf. Dreimal: vierzehn ist zu viel. }
{ pet == "cat": Deine Katze patscht gegen die mittlere Flasche. Sie meint die kleine. Oder die große. }
{ pet == "toad": Deine Kröte quakt bei Zahlen. Bei neun besonders laut. Sie kennt sich aus. }
# emote: quill dots
quill: Das erinnert mich an ein Rätsel aus meiner ersten Brauprüfung …
# puzzle: p05
{ last_puzzle_first_try: slughorn: Makellos! Gleich im ersten Anlauf. Ich merke mir das. }
{ not last_puzzle_first_try: slughorn: Fehler sind das Gewürz der Tränke! Aber nicht zu viel Gewürz. }
Quill tropft die klare Flüssigkeit auf Isoldes Skizze. Der Eisreif knistert und taut.
Dann schiebt sich ein neuer Reif über das Blatt. Schnell, wie ein Atemzug.
# sfx: spark
# emote: ellis !
quill: Das Eis kehrt zurück. Als wollte jemand nicht, dass wir es sehen.
ellis: Theorie drei! Die Uhr streikt! Dreihundert Jahre ohne Urlaub. Nicht einmal Wochenenden!
quill: Eine gewerkschaftlich organisierte Uhr. Gar nicht so unplausibel.
# spark: d05.s2 200 150
-> END
