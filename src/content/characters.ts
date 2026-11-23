/**
 * Truhe → Figuren (DECISIONS.md #80): everyone the player can meet, in the
 * order the story introduces them. Texts are first impressions only, so a
 * card never gives away what the story reveals later.
 */
export interface CharacterCard {
  /** speaker id; the picture is `portrait.<id>` */
  id: string;
  text: string;
}

export const CHARACTER_CARDS: CharacterCard[] = [
  { id: 'wandmaker', text: 'Hat dir deinen Zauberstab ausgesucht. Oder der Zauberstab dich, so genau weiß man das bei ihr nie.' },
  { id: 'quill', text: 'Prof. Henrietta Quill unterrichtet Rätselkunde und Arithmantik. Trägt einen Teelöffel als Hutnadel und weiß: Jedes Rätsel hat eine Lösung. Und jede Lage eine Tasse Tee.' },
  { id: 'hat', text: 'Brummig, weise und seit Jahrhunderten im Dienst. Hat dich in dein Haus geschickt und dabei irgendwie gezwinkert.' },
  { id: 'ellis', text: 'Ellis Wren, Ravenclaw im sechsten Jahr. Redet zu viel, hat Höhenangst und für jedes Rätsel eine Theorie. Laminiert gern Zettel.' },
  { id: 'thornbury', text: 'Die Schulleiterin. Spricht wenig und trocken. Lieblingssatz: „Kein Wort zu irgendjemandem.“' },
  { id: 'peeves', text: 'Der Poltergeist des Schlosses. Bläst Kerzen aus, weil sie dabei so schön zischen.' },
  { id: 'grimsby', text: 'Hausmeister Grimsby schimpft seit dreißig Jahren auf das Ticken der Uhr. Behauptet, die Ruhe zu genießen.' },
  { id: 'aldous', text: 'Sir Aldous Frostbart, ein ritterlicher Hausgeist mit Federhelm. Sagt „Fürwahr“ und „Gestattet“ und ist immer zur Stelle.' },
  { id: 'pince', text: 'Wacht über die Bibliothek wie ein Drache über sein Gold. Riecht Zimtsterne drei Regale weit.' },
  { id: 'hermione', text: 'Kennt jede Seitenzahl auswendig und ist irgendwie in der falschen Woche gelandet. Ein Zeitgast.' },
  { id: 'slughorn', text: 'Professor Slughorn sammelt begabte Menschen. Er unterrichtet hier. Oder hat. Oder wird. Ein Zeitgast.' },
  { id: 'theo', text: 'Theo Ashcombe, Slytherin. Knapp, ironisch und riecht nach Öl und Messing.' },
  { id: 'maren', text: 'Maren Holloway, Vertrauensschülerin in Hufflepuff. Überfreundlich. Bietet Kekse an, sobald sie nervös wird. Also oft.' },
  { id: 'neville', text: 'Topft im Gewächshaus Alraunen um und sucht nebenbei eine Kröte namens Trevor. Ein Zeitgast.' },
  { id: 'nick', text: 'Fast Kopfloser Nick, Hausgeist von Gryffindor. Höflich bis zum letzten Hautfetzen am Hals.' },
  { id: 'friar', text: 'Der Fette Mönch, Hausgeist von Hufflepuff. Vergibt allen alles. Sogar Peeves.' },
  { id: 'grey_lady', text: 'Die Graue Dame, Hausgeist von Ravenclaw. Sagt selten etwas, dann aber das Klügste im Raum.' },
  { id: 'baron', text: 'Der Blutige Baron, Hausgeist von Slytherin. Sogar Peeves wird still, wenn er vorbeischwebt.' },
  { id: 'filch', text: 'Argus Filch mit Mrs. Norris. Zusammen mit Grimsby ein Duett aus Griesgram und Seufzern.' },
  { id: 'hagrid', text: 'Wildhüter mit großem Herzen, großem Bart und Felsenkuchen, die man besser nur bewundert.' },
  { id: 'luna', text: 'Gibt Sternbildern eigene Namen und weiß, wie man Höhenangst einfach wegredet.' },
  { id: 'spider', text: 'Aragogs Urenkelin, so groß wie ein Schaf. Hat ausdrücklich keine Lust, jemanden zu essen.' },
  { id: 'myrte', text: 'Die Maulende Myrte spukt im Kerkergang, ist gern beleidigt und liest erstaunlich gut Spiegelschrift.' },
  { id: 'newt', text: 'Newt Scamander, Magizoologe. Findet, dass Niffler keine Diebe sind, sondern Sammler.' },
  { id: 'knopf', text: 'Ein Niffler. Quiekt. Alles, was glänzt, gehört ihm.' },
  { id: 'dumbledore', text: 'Dumbledores Porträt. Bietet Zitronenbonbons an, zwinkert und gibt grundsätzlich keinen Rat.' },
  { id: 'rosmerta', text: 'Wirtin der Drei Besen in Hogsmeade. Ihr Butterbier wärmt bis in die Zehen.' },
  { id: 'fred', text: 'Die eine Hälfte der Weasley-Zwillinge. Verkauft Scherzartikel und verliert nie ein Spiel um Knallbonbons.' },
  { id: 'george', text: 'Die andere Hälfte der Weasley-Zwillinge. Behauptet gern, er sei Fred.' },
  { id: 'flitwick', text: 'Professor Flitwick, früher Duell-Champion. Klein von Gestalt, riesig im Zauberstabschwingen.' },
];
