import type { Subject } from "./topics.types"

export const RELIGION_SUBJECT: Subject = {
  id: "religion",
  title: "Religion",
  tagline: "Glauben entdecken, Werte leben, Vielfalt verstehen",
  description:
    "Biblische Geschichten, Wertebildung und interreligiöses Lernen für konfessionellen und gemeinsamen Religionsunterricht der Klassen 1-4.",
  grades: ["1", "2", "3", "4"],
  categories: [
    {
      id: "glauben-bibel",
      label: "Glauben & Bibel entdecken",
      summary: "Biblische Erzählungen aufschließen, Lebensfragen stellen und Gottesbilder reflektieren."
    },
    {
      id: "kirchenjahr-symbole",
      label: "Kirchenjahr & Symbole",
      summary: "Jahreskreis, Feste, liturgische Farben und Symbole sinnlich erlebbar machen."
    },
    {
      id: "werte-gemeinschaft",
      label: "Werte, Zusammenleben & Verantwortung",
      summary: "Empathie, Verantwortung und Friedenskompetenz im Schulalltag stärken."
    },
    {
      id: "weltreligionen-kulturen",
      label: "Weltreligionen & Begegnungen",
      summary: "Erste Begegnungen mit anderen Religionen vorbereiten, Vielfalt und Dialog fördern."
    },
    {
      id: "spiritualität",
      label: "Spiritualität & innere Stärke",
      summary: "Stille, Gebet und persönliche Sinnfragen kindgerecht begleiten."
    }
  ],
  topics: [
    {
      id: "schöpfung",
      label: "Schöpfung bewahren",
      category: "werte-gemeinschaft",
      grades: ["1", "2", "3", "4"],
      description:
        "Die Schöpfungsgeschichte erleben, Verantwortung für Natur übernehmen und nachhaltiges Handeln fördern.",
      focus: ["Biblische Geschichte", "Projektarbeit", "Nachhaltigkeit"],
      samplePrompts: [
        "Bitte um eine Projektwoche zur Schöpfung mit Forscheraufgaben und Gebeten.",
        "Erstelle ein Arbeitsblatt, das Gottes Auftrag an Noah mit Umweltschutz heute verknüpft.",
        "Formuliere Reflexionsfragen zur persönlichen Verantwortung für die Schöpfung."
      ]
    },
    {
      id: "jesus",
      label: "Jesus begegnen",
      category: "glauben-bibel",
      grades: ["2", "3", "4"],
      description:
        "Gleichnisse, Wundererzählungen und biografische Schlüsselstellen kennenlernen und auf das eigene Leben beziehen.",
      focus: ["Bibelarbeit", "Rollenspiel", "Lebensweltbezug"],
      samplePrompts: [
        "Erstelle ein Lapbook zu einer Jesus-Geschichte mit Symbolen und Gebeten.",
        "Bitte um eine Erzählwerkstatt zu Gleichnissen mit szenischem Spiel.",
        "Formuliere Impulsfragen, die Kinder vom Gleichnis zur eigenen Lebenswelt führen."
      ]
    },
    {
      id: "propheten",
      label: "Propheten und Mut",
      category: "glauben-bibel",
      grades: ["3", "4"],
      description: "Propheten als Stimmen der Gerechtigkeit kennenlernen und auf heutige Mutmachmenschen beziehen.",
      focus: ["Gerechtigkeit", "Biografien", "Projektidee"],
      samplePrompts: [
        "Bitte um Steckbriefe zu Propheten wie Amos, Jona oder Jeremia.",
        "Erstelle eine Unterrichtseinheit, die Prophetengeschichten mit aktuellen Mutmachgeschichten verknüpft.",
        "Formuliere eine kreative Aufgabe, in der Kinder eigene moderne Prophetensprecher erfinden."
      ]
    },
    {
      id: "psalmen",
      label: "Psalmen beten",
      category: "glauben-bibel",
      grades: ["2", "3", "4"],
      description: "Psalmen als Gebete entdecken, Gefühle ausdrücken und eigene Psalmen verfassen.",
      focus: ["Spiritualität", "Musik", "Schreibimpulse"],
      samplePrompts: [
        "Erstelle eine kreative Schreibwerkstatt, in der Kinder eigene Psalmen formulieren.",
        "Bitte um eine Klangreise zu Psalm 23 mit einfachen Instrumenten.",
        "Formuliere Reflexionsfragen, wie Psalmen in schweren Zeiten Kraft geben."
      ]
    },
    {
      id: "bibel-entdecken",
      label: "Die Bibel entdecken",
      category: "glauben-bibel",
      grades: ["1", "2", "3", "4"],
      description: "Aufbau der Bibel kennenlernen, Lieblingsgeschichten finden und Medienkompetenz aufbauen.",
      focus: ["Bibelwissen", "Recherche", "Methodenvielfalt"],
      samplePrompts: [
        "Bitte um ein Forscherheft zum Aufbau der Bibel für die Klassen 2-4.",
        "Erstelle eine Bibliolog-Einheit für Grundschulkinder.",
        "Formuliere einen Escape-Room mit Bibelrätseln und Symbolen."
      ]
    },
    {
      id: "kirchenjahr",
      label: "Kirchenjahr erleben",
      category: "kirchenjahr-symbole",
      grades: ["1", "2", "3", "4"],
      description: "Advent, Weihnachten, Ostern, Pfingsten und Erntedank mit Ritualen und Bastelideen begleiten.",
      focus: ["Rituale", "Feiergestaltung", "Teambuilding"],
      samplePrompts: [
        "Erstelle eine Jahreskreis-Wandzeitung mit Monaten, Festfarben und Symbolen.",
        "Bitte um eine Sequenz für eine Osterandacht in der Grundschule.",
        "Formuliere Bastel- und Liedideen für jede Festzeit."
      ]
    },
    {
      id: "religiöse-Symbole",
      label: "Religiöse Symbole verstehen",
      category: "kirchenjahr-symbole",
      grades: ["2", "3", "4"],
      description: "Kreuz, Fisch, Licht, Farben und andere Symbole deuten und kreativ darstellen.",
      focus: ["Symbolarbeit", "Gestalten", "Raumerfahrung"],
      samplePrompts: [
        "Bitte um ein Symbol-Lapbook mit Deutungen und Bibelbezugen.",
        "Formuliere eine Bildergalerie, in der Kinder Symbole fotografieren und vorstellen."
      ]
    },
    {
      id: "rituale",
      label: "Rituale und Gottesdienstformen",
      category: "kirchenjahr-symbole",
      grades: ["1", "2", "3", "4"],
      description: "Klassenrituale, Morgenkreis, Segensfeiern und Gottesdienste kindgerecht planen.",
      focus: ["Gemeinschaft", "Stille", "Mitgestaltung"],
      samplePrompts: [
        "Erstelle einen Ablauf für eine Segensfeier zum Schuljahresbeginn.",
        "Bitte um eine Sammlung kurzer Rituale für den Wochenstart.",
        "Formuliere Ideenkarten für kindgerechte Beteiligung am Gottesdienst."
      ]
    },
    {
      id: "heilige",
      label: "Heilige und Vorbilder",
      category: "kirchenjahr-symbole",
      grades: ["2", "3", "4"],
      description: "Biografien von Heiligen, Alltagsvorbilder und Vorbildfunktionen reflektieren.",
      focus: ["Biografische Arbeit", "Projekt", "Wertereflexion"],
      samplePrompts: [
        "Bitte um Steckbriefe zu bekannten Heiligen mit heutigen Bezugspersonen.",
        "Erstelle eine Projektreihe, in der Kinder eigene Vorbilder vorstellen.",
        "Formuliere Aufgaben für ein Theaterstück über heilige Mut-Menschen."
      ]
    },
    {
      id: "werte",
      label: "Werte leben",
      category: "werte-gemeinschaft",
      grades: ["2", "3", "4"],
      description: "Goldene Regel, Nächstenliebe, Gerechtigkeit und Frieden im Klassenalltag üben.",
      focus: ["Soziales Lernen", "Kooperation", "Alltagstransfer"],
      samplePrompts: [
        "Erstelle ein Werte-Projekt mit Klassenvertrag und Streitschlichter-Impulsen.",
        "Bitte um Rollenspiele, die Alltagskonflikte und Lösungen zeigen.",
        "Formuliere Reflexionsfragen für Streit, Versöhnung und Freundschaft."
      ]
    },
    {
      id: "friedensstifter",
      label: "Friedensstifter sein",
      category: "werte-gemeinschaft",
      grades: ["3", "4"],
      description: "Friedensgeschichten, Symbolhandlungen und Mutmacher im eigenen Umfeld betrachten.",
      focus: ["Konfliktlösung", "Projekt", "Empathie"],
      samplePrompts: [
        "Bitte um eine Projektidee zu Friedenssymbolen in Stadt oder Gemeinde.",
        "Erstelle ein Werte-Cafe, in dem Kinder Friedensgeschichten austauschen.",
        "Formuliere Aufgaben, bei denen Kinder Friedensbotschaften gestalten."
      ]
    },
    {
      id: "sozialprojekte",
      label: "Gemeinsam Verantwortung übernehmen",
      category: "werte-gemeinschaft",
      grades: ["3", "4"],
      description: "Soziale Projekte planen, Hilfsaktionen reflektieren und Verantwortung üben.",
      focus: ["Service Learning", "Projektmanagement", "Selbstwirksamkeit"],
      samplePrompts: [
        "Erstelle eine Planungsvorlage für ein soziales Klassenprojekt.",
        "Bitte um Reflexionsfragen nach einem Besuch im Altenheim oder Tafelladen.",
        "Formuliere Aufgaben, die Kinder auf eine Spendenaktion vorbereiten."
      ]
    },
    {
      id: "weltreligionen",
      label: "Weltreligionen entdecken",
      category: "weltreligionen-kulturen",
      grades: ["3", "4"],
      description: "Judentum, Christentum, Islam, Hinduismus und Buddhismus überblicksartig kennenlernen.",
      focus: ["Religionsvergleich", "Landkarten", "Symbole"],
      samplePrompts: [
        "Bitte um ein Infoheft mit Grundwissen zu den fünf Weltreligionen.",
        "Erstelle ein Museum im Klassenzimmer mit Symbolstationen.",
        "Formuliere Aufgaben zum respektvollen Fragenstellen bei Religionsbegegnungen."
      ]
    },
    {
      id: "interreligiöser Dialog",
      label: "Interreligiöser Dialog",
      category: "weltreligionen-kulturen",
      grades: ["3", "4"],
      description: "Vorurteile abbauen, Gemeinsamkeiten und Unterschiede respektvoll benennen.",
      focus: ["Dialogkompetenz", "Rollenspiel", "Empathie"],
      samplePrompts: [
        "Erstelle ein Rollenspiel für einen respektvollen Dialog zwischen Kindern verschiedener Religionen.",
        "Bitte um Leitfragen für ein Interview mit einem Glaubensgast.",
        "Formuliere Reflexionsaufgaben nach dem Besuch einer Moschee oder Synagoge."
      ]
    },
    {
      id: "feste-weltreligionen",
      label: "Feste in Weltreligionen",
      category: "weltreligionen-kulturen",
      grades: ["2", "3", "4"],
      description: "Feste wie Chanukka, Ramadan, Diwali oder Vesakh bestaunen und Gemeinsamkeiten entdecken.",
      focus: ["Feierkultur", "Vergleich", "Praktische Impulse"],
      samplePrompts: [
        "Erstelle ein Klassenfest der Religionen mit Stationen zu Speisen, Liedern und Bräuchen.",
        "Bitte um Steckbriefe zu ausgewählten Festen für ein Lapbook.",
        "Formuliere Aufgaben, die Gemeinsamkeiten und Unterschiede sichtbar machen."
      ]
    },
    {
      id: "religiöser Alltag",
      label: "Religiöser Alltag weltweit",
      category: "weltreligionen-kulturen",
      grades: ["3", "4"],
      description: "Gebetsorte, Kleidungsstücke und Alltagsregeln in verschiedenen Religionen kennenlernen.",
      focus: ["Globale Perspektive", "Fotoberichte", "Interview"],
      samplePrompts: [
        "Bitte um ein Rechercheblatt zu religiösen Alltagsgegenständen.",
        "Erstelle Aufgaben, in denen Kinder Tagesabläufe vergleichen.",
        "Formuliere Interviewfragen für Menschen verschiedener Religionen."
      ]
    },
    {
      id: "gebet",
      label: "Gebet und persönliche Ansprache",
      category: "spiritualität",
      grades: ["1", "2", "3", "4"],
      description: "Gebetsformen entdecken, Dank- und Bittgebete formulieren und persönliche Sprache finden.",
      focus: ["Spiritualität", "Selbstausdruck", "Gemeinschaft"],
      samplePrompts: [
        "Erstelle eine Gebetswerkstatt mit Dank-, Bitte- und Fürgabenkarten.",
        "Bitte um Impulskarten für den Stuhlkreis mit kindgerechten Gebetsideen.",
        "Formuliere Aufgaben, in denen Kinder ein eigenes Gebetbuch gestalten."
      ]
    },
    {
      id: "stille",
      label: "Stille und Achtsamkeit",
      category: "spiritualität",
      grades: ["1", "2", "3", "4"],
      description: "Stilleübungen, Atemtechniken und achtsame Rituale für die Klassenatmosphäre.",
      focus: ["Achtsamkeit", "Selbstwahrnehmung", "Klassengemeinschaft"],
      samplePrompts: [
        "Bitte um eine Sammlung kurzer Stilleübungen für den Unterrichtsbeginn.",
        "Erstelle eine Fantasiereise, die zu einer biblischen Geschichte führt.",
        "Formuliere Reflexionskarten, wie sich Stille auf Gefühle auswirkt."
      ]
    },
    {
      id: "mut-mach-geschichten",
      label: "Mutmach-Geschichten",
      category: "spiritualität",
      grades: ["1", "2", "3", "4"],
      description: "Mutmachtexte, Engelgeschichten und Vertrauensrituale für schwere Situationen.",
      focus: ["Ermutigung", "Selbstwert", "Gemeinschaft"],
      samplePrompts: [
        "Erstelle ein Mutmach-Heft mit Geschichten, Symbolen und kurzen Gebeten.",
        "Bitte um Impulse für einen Mutmach-Kreis mit Klassenritual.",
        "Formuliere Aufgaben, in denen Kinder selbst Mutmachgeschichten schreiben."
      ]
    }
  ]
}
