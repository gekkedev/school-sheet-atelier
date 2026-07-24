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
    },
    {
      id: "jesus",
      label: "Jesus begegnen",
      category: "glauben-bibel",
      grades: ["2", "3", "4"],
      description:
        "Gleichnisse, Wundererzählungen und biografische Schlüsselstellen kennenlernen und auf das eigene Leben beziehen.",
      focus: ["Bibelarbeit", "Rollenspiel", "Lebensweltbezug"],
    },
    {
      id: "propheten",
      label: "Propheten und Mut",
      category: "glauben-bibel",
      grades: ["3", "4"],
      description: "Propheten als Stimmen der Gerechtigkeit kennenlernen und auf heutige Mutmachmenschen beziehen.",
      focus: ["Gerechtigkeit", "Biografien", "Projektidee"],
    },
    {
      id: "psalmen",
      label: "Psalmen beten",
      category: "glauben-bibel",
      grades: ["2", "3", "4"],
      description: "Psalmen als Gebete entdecken, Gefühle ausdrücken und eigene Psalmen verfassen.",
      focus: ["Spiritualität", "Musik", "Schreibimpulse"],
    },
    {
      id: "bibel-entdecken",
      label: "Die Bibel entdecken",
      category: "glauben-bibel",
      grades: ["1", "2", "3", "4"],
      description: "Aufbau der Bibel kennenlernen, Lieblingsgeschichten finden und Medienkompetenz aufbauen.",
      focus: ["Bibelwissen", "Recherche", "Methodenvielfalt"],
    },
    {
      id: "kirchenjahr",
      label: "Kirchenjahr erleben",
      category: "kirchenjahr-symbole",
      grades: ["1", "2", "3", "4"],
      description: "Advent, Weihnachten, Ostern, Pfingsten und Erntedank mit Ritualen und Bastelideen begleiten.",
      focus: ["Rituale", "Feiergestaltung", "Teambuilding"],
    },
    {
      id: "religiöse-Symbole",
      label: "Religiöse Symbole verstehen",
      category: "kirchenjahr-symbole",
      grades: ["2", "3", "4"],
      description: "Kreuz, Fisch, Licht, Farben und andere Symbole deuten und kreativ darstellen.",
      focus: ["Symbolarbeit", "Gestalten", "Raumerfahrung"],
    },
    {
      id: "rituale",
      label: "Rituale und Gottesdienstformen",
      category: "kirchenjahr-symbole",
      grades: ["1", "2", "3", "4"],
      description: "Klassenrituale, Morgenkreis, Segensfeiern und Gottesdienste kindgerecht planen.",
      focus: ["Gemeinschaft", "Stille", "Mitgestaltung"],
    },
    {
      id: "heilige",
      label: "Heilige und Vorbilder",
      category: "kirchenjahr-symbole",
      grades: ["2", "3", "4"],
      description: "Biografien von Heiligen, Alltagsvorbilder und Vorbildfunktionen reflektieren.",
      focus: ["Biografische Arbeit", "Projekt", "Wertereflexion"],
    },
    {
      id: "werte",
      label: "Werte leben",
      category: "werte-gemeinschaft",
      grades: ["2", "3", "4"],
      description: "Goldene Regel, Nächstenliebe, Gerechtigkeit und Frieden im Klassenalltag üben.",
      focus: ["Soziales Lernen", "Kooperation", "Alltagstransfer"],
    },
    {
      id: "friedensstifter",
      label: "Friedensstifter sein",
      category: "werte-gemeinschaft",
      grades: ["3", "4"],
      description: "Friedensgeschichten, Symbolhandlungen und Mutmacher im eigenen Umfeld betrachten.",
      focus: ["Konfliktlösung", "Projekt", "Empathie"],
    },
    {
      id: "sozialprojekte",
      label: "Gemeinsam Verantwortung übernehmen",
      category: "werte-gemeinschaft",
      grades: ["3", "4"],
      description: "Soziale Projekte planen, Hilfsaktionen reflektieren und Verantwortung üben.",
      focus: ["Service Learning", "Projektmanagement", "Selbstwirksamkeit"],
    },
    {
      id: "weltreligionen",
      label: "Weltreligionen entdecken",
      category: "weltreligionen-kulturen",
      grades: ["3", "4"],
      description: "Judentum, Christentum, Islam, Hinduismus und Buddhismus überblicksartig kennenlernen.",
      focus: ["Religionsvergleich", "Landkarten", "Symbole"],
    },
    {
      id: "interreligiöser Dialog",
      label: "Interreligiöser Dialog",
      category: "weltreligionen-kulturen",
      grades: ["3", "4"],
      description: "Vorurteile abbauen, Gemeinsamkeiten und Unterschiede respektvoll benennen.",
      focus: ["Dialogkompetenz", "Rollenspiel", "Empathie"],
    },
    {
      id: "feste-weltreligionen",
      label: "Feste in Weltreligionen",
      category: "weltreligionen-kulturen",
      grades: ["2", "3", "4"],
      description: "Feste wie Chanukka, Ramadan, Diwali oder Vesakh bestaunen und Gemeinsamkeiten entdecken.",
      focus: ["Feierkultur", "Vergleich", "Praktische Impulse"],
    },
    {
      id: "religiöser Alltag",
      label: "Religiöser Alltag weltweit",
      category: "weltreligionen-kulturen",
      grades: ["3", "4"],
      description: "Gebetsorte, Kleidungsstücke und Alltagsregeln in verschiedenen Religionen kennenlernen.",
      focus: ["Globale Perspektive", "Fotoberichte", "Interview"],
    },
    {
      id: "gebet",
      label: "Gebet und persönliche Ansprache",
      category: "spiritualität",
      grades: ["1", "2", "3", "4"],
      description: "Gebetsformen entdecken, Dank- und Bittgebete formulieren und persönliche Sprache finden.",
      focus: ["Spiritualität", "Selbstausdruck", "Gemeinschaft"],
    },
    {
      id: "stille",
      label: "Stille und Achtsamkeit",
      category: "spiritualität",
      grades: ["1", "2", "3", "4"],
      description: "Stilleübungen, Atemtechniken und achtsame Rituale für die Klassenatmosphäre.",
      focus: ["Achtsamkeit", "Selbstwahrnehmung", "Klassengemeinschaft"],
    },
    {
      id: "mut-mach-geschichten",
      label: "Mutmach-Geschichten",
      category: "spiritualität",
      grades: ["1", "2", "3", "4"],
      description: "Mutmachtexte, Engelgeschichten und Vertrauensrituale für schwere Situationen.",
      focus: ["Ermutigung", "Selbstwert", "Gemeinschaft"],
    }
  ]
}
