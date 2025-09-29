import type { Subject } from "./topics.types"

export const DEUTSCH_SUBJECT: Subject = {
  id: "deutsch",
  title: "Deutsch",
  tagline: "Sprache entdecken und sicher anwenden",
  description:
    "Kuratiertes Archiv für differenzierte Deutschthemen der Klassen 1-4, abgestimmt auf Lehrpläne und praxisnahe Unterrichtsplanung.",
  grades: ["1", "2", "3", "4"],
  categories: [
    {
      id: "lautbewusstsein",
      label: "Einstieg & Lautbewusstsein",
      summary:
        "Fördert phonologische Sensibilität, Silbenbewusstsein und sichere Startstrategien im Schriftspracherwerb."
    },
    {
      id: "grammatik",
      label: "Grammatik & Rechtschreibung",
      summary:
        "Sichert grundlegende Grammatik, Satzbau und Rechtschreibstrategien mit klar strukturierten Übungsformaten."
    },
    {
      id: "lesen",
      label: "Lesen & Verstehen",
      summary:
        "Trainiert Lesestrategien, Textsortenwissen und reflektiertes Leseverstehen auf verschiedenen Anspruchsniveaus."
    },
    {
      id: "schreiben",
      label: "Schreiben & Texte gestalten",
      summary: "Begleitet den Schreibprozess von der Idee bis zur Überarbeitung und stärkt sichere Textproduktion."
    },
    {
      id: "wortschatz",
      label: "Wortschatz & Sprachbewusstsein",
      summary: "Erweitert Wortschatz, Sprachgefühl und Ausdruckskraft durch kreative, kommunikative Aufgaben."
    }
  ],
  topics: [
    {
      id: "silben-helden",
      label: "Silbenhelden",
      category: "lautbewusstsein",
      grades: ["1", "2"],
      description:
        "Silben klatschen, Silbenbögen setzen und Wörter zerlegen, um sichere Lesestarterinnen und Lesestarter zu fördern.",
      focus: ["Phonologische Bewusstheit", "Lesestart", "Differenzierung"],
      samplePrompts: [
        "Erstelle ein Partnerarbeitsblatt, auf dem Kinder Wörter in zwei oder drei Silben zerlegen und farbig markieren.",
        "Plane eine Lernkartei mit Silbenpuzzeln für heterogene Lerngruppen.",
        "Formuliere ein Stationenlernen, das Silbenklatschen, Silben schwingen und Silben schreiben verbindet."
      ]
    },
    {
      id: "anlaut-detektive",
      label: "Anlaut-Detektive",
      category: "lautbewusstsein",
      grades: ["1"],
      description: "Anlaute hören, Bildern zuordnen und Grossbuchstaben sicher schreiben.",
      focus: ["Hören und Sprechen", "Bildimpulse", "Feinmotorik"],
      samplePrompts: [
        "Lasse die KI ein Arbeitsblatt erstellen, auf dem Kinder Anlaute hören und passende Bildkarten zuordnen.",
        "Entwirf eine Stationsarbeit mit Hör-Memory, Buchstaben-Spur und Anlautdomino.",
        "Bitte um kurze Geschichten, in denen gezielt neue Anlaute mehrfach vorkommen."
      ]
    },
    {
      id: "lauttreue-Wörter",
      label: "Lauttreue Wörter bauen",
      category: "lautbewusstsein",
      grades: ["1", "2"],
      description: "Wörter lautgetreu schreiben, Silbenmodelle nutzen und erste Rechtschreibstrategien entwickeln.",
      focus: ["Schriftspracherwerb", "Selbstkontrolle", "Bildunterstützung"],
      samplePrompts: [
        "Formuliere ein Arbeitsblatt, auf dem Kinder lautgetreue Wörter mit Silbenbausteinen zusammensetzen.",
        "Erstelle eine Lernspirale mit Lautgebilden, Silbenhäusern und Wortbausteinen.",
        "Plane differenzierte Übungen für Lernende mit Förderbedarf im Schriftspracherwerb."
      ]
    },
    {
      id: "wortarten",
      label: "Wortarten (Nomen, Verben, Adjektive)",
      category: "grammatik",
      grades: ["2", "3", "4"],
      description: "Wörter sortieren, Satzbausteine markieren und Wortarten sicher anwenden.",
      focus: ["Grammatikfundament", "Markierungsaufgaben", "Begriffssicherung"],
      samplePrompts: [
        "Gestalte ein Arbeitsblatt, auf dem Kinder Wörter den Wortarten zuordnen und eigene Beispiele finden.",
        "Bitte um ein kooperatives Spiel, in dem Wortarten gesammelt und zu Sätzen kombiniert werden.",
        "Erstelle ein Grammatik-Quiz mit steigender Schwierigkeit für Nomen, Verben und Adjektive."
      ]
    },
    {
      id: "gross-klein",
      label: "Gross- und Kleinschreibung",
      category: "grammatik",
      grades: ["2", "3", "4"],
      description: "Regeln wiederholen, knifflige Beispielsatzpaare analysieren und Rechtschreibstrategien anwenden.",
      focus: ["Regelwissen", "Fehleranalyse", "Trainingstexte"],
      samplePrompts: [
        "Formuliere ein Diagnoseblatt mit typischen Fehlern zur Gross- und Kleinschreibung.",
        "Erstelle einen Wochenplan mit Mini-Übungen zu Nomen und Höflichkeitspronomen.",
        "Bitte um einen Lerntipp-Steckbrief zu jeder Rechtschreibstrategie."
      ]
    },
    {
      id: "zeichensetzung",
      label: "Zeichensetzung (Punkt, Frage-, Ausrufezeichen, wörtliche Rede)",
      category: "grammatik",
      grades: ["2", "3", "4"],
      description:
        "Satzschlusszeichen und wörtliche Rede gezielt üben, Satzmelodie reflektieren und Fehler verbessern.",
      focus: ["Satzbau", "Dialoge", "Selbstkorrektur"],
      samplePrompts: [
        "Bitte um kurze Dialoge ohne Zeichensetzung, die von Kindern verbessert werden sollen.",
        "Erstelle ein Partnerdiktat mit verschiedenen Satzschlusszeichen und Rückmeldekarten.",
        "Entwirf eine Übung, die den Unterschied zwischen Aussagen, Fragen und Ausrufen verdeutlicht."
      ]
    },
    {
      id: "zeitformen",
      label: "Zeitformen (Präsens, Präteritum, Perfekt)",
      category: "grammatik",
      grades: ["3", "4"],
      description: "Zeitformen erkennen, konjugieren und in Texten sicher umsetzen.",
      focus: ["Tempustraining", "Vergleichstabellen", "Transfer"],
      samplePrompts: [
        "Formuliere ein Lernplakat, das die drei Zeitformen mit Beispielen gegenüberstellt.",
        "Erstelle Textbausteine, in denen Kinder Zeitformen gezielt tauschen.",
        "Bitte um ein kooperatives Kartenspiel zur Konjugation häufiger Verben."
      ]
    },
    {
      id: "satzarten",
      label: "Satzarten und Satzbau",
      category: "grammatik",
      grades: ["2", "3", "4"],
      description: "Aussage-, Frage- und Ausrufesätze unterscheiden und Satzglieder flexibel anordnen.",
      focus: ["Satzgeflecht", "Spielerische Vertiefung", "Satzbauplakate"],
      samplePrompts: [
        "Erstelle ein Stationspaket, in dem Kinder Satzteile legen, kombinieren und umstellen.",
        "Bitte um Bildergeschichten, zu denen unterschiedlich betonte Sätze formuliert werden.",
        "Formuliere ein Lernspiel, das Satzanfangskarten und Satzende verbindet."
      ]
    },
    {
      id: "kommasetzung",
      label: "Kommas in Aufzählungen und wörtlicher Rede",
      category: "grammatik",
      grades: ["3", "4"],
      description: "Kommas setzen, Regeln anwenden und typische Stolperstellen bewusst machen.",
      focus: ["Regeltraining", "Fehlerkultur", "Reflexion"],
      samplePrompts: [
        "Bitte um eine Fehlersammlung zur Kommasetzung, die Kinder gemeinsam verbessern.",
        "Plane ein Miniprojekt, in dem Lernende eigene Regelplakate gestalten.",
        "Erstelle ein Differenzierungsblatt mit Komma-Cloze für schnelle und langsame Lernerinnen."
      ]
    },
    {
      id: "steigerung-adjektive",
      label: "Adjektive und Steigerung",
      category: "grammatik",
      grades: ["2", "3", "4"],
      description: "Adjektive entdecken, steigern und wirkungsvoll in Texten einsetzen.",
      focus: ["Sprache verfeinern", "Synonyme", "Satzbau"],
      samplePrompts: [
        "Bitte um Wortschatzkarten mit Adjektiven und passenden Steigerungsformen.",
        "Erstelle ein Schreibspiel, in dem Kinder schlichte Sätze mit Adjektiven anreichern.",
        "Plane eine Minilektion zur Komparation unregelmäßiger Adjektive."
      ]
    },
    {
      id: "zusammengesetzte-nomen",
      label: "Zusammengesetzte Nomen",
      category: "grammatik",
      grades: ["2", "3", "4"],
      description: "Komposita bilden, Trennstriche einsetzen und Bedeutungen entschlüsseln.",
      focus: ["Wortbausteine", "Wortschatzerweiterung", "Lesestrategie"],
      samplePrompts: [
        "Erstelle eine Wortwerkstatt, in der Kinder neue Nomen aus Vorsilben und Nachsilben bauen.",
        "Bitte um ein Puzzle mit Bildern und zusammengesetzten Wörtern.",
        "Formuliere Aufgaben, bei denen Bedeutungen der Komposita erklärt werden sollen."
      ]
    },
    {
      id: "pronomen",
      label: "Pronomen sicher verwenden",
      category: "grammatik",
      grades: ["3", "4"],
      description: "Pronomen erkennen, ersetzen und bewusst in eigenen Texten nutzen.",
      focus: ["Textverständnis", "Kohäsion", "Fehleranalyse"],
      samplePrompts: [
        "Bitte um Geschichten mit Pronomenfehlern, die Kinder berichtigen.",
        "Gestalte ein Lernspiel, bei dem Nomen durch passende Pronomen ersetzt werden.",
        "Erstelle ein Regelposter zu den wichtigsten Personal- und Possessivpronomen."
      ]
    },
    {
      id: "rechtschreibstrategien",
      label: "Rechtschreibstrategien kombinieren",
      category: "grammatik",
      grades: ["2", "3", "4"],
      description: "Merkworter, Regelwörter, Stammprinzip und Mitsprechworte differenziert trainieren.",
      focus: ["Strategiemix", "Selbstreflexion", "Lerntipps"],
      samplePrompts: [
        "Formuliere ein Reflexionstagebuch, in dem Kinder ihre Rechtschreibstrategien dokumentieren.",
        "Bitte um Mini-Workshops zu vier zentralen Strategien mit passenden Übungsformaten.",
        "Erstelle ein Lernbuffet, das Rechtschreibstrategien für verschiedene Lerntypen anbietet."
      ]
    },
    {
      id: "leseverstehen",
      label: "Leseverstehen (Sachtext, Märchen, Fabel)",
      category: "lesen",
      grades: ["2", "3", "4"],
      description: "Texte erschliessen, Leitfragen beantworten und Lesestrategien anwenden.",
      focus: ["Lesestrategien", "Frageformen", "Binnendifferenzierung"],
      samplePrompts: [
        "Erstelle ein Lesetagebuch mit Leitfragen für unterschiedliche Textsorten.",
        "Bitte um kooperative Lesespiele mit Rollen wie Detektiv, Wortkünstler, Zusammenfasser.",
        "Formuliere eine Lernzielkontrolle mit offenen und geschlossenen Aufgaben zum Leseverstehen."
      ]
    },
    {
      id: "lesestrategien",
      label: "Lesestrategien trainieren",
      category: "lesen",
      grades: ["3", "4"],
      description: "Markieren, visualisieren und Fragen stellen als Lesewerkzeuge bewusst einüben.",
      focus: ["Metakognition", "Lesetritts", "Symbolkarten"],
      samplePrompts: [
        "Erstelle ein Unterrichtsgespräch, in dem Strategien an einem Beispieltext demonstriert werden.",
        "Bitte um Lesestrategie-Karten, die Kinder vor, während und nach dem Lesen nutzen.",
        "Formuliere einen Wochenplan mit Strategietraining in kooperativen Settings."
      ]
    },
    {
      id: "bildgeschichten",
      label: "Bildgeschichten verstehen und erzählen",
      category: "lesen",
      grades: ["1", "2", "3"],
      description: "Bilder lesen, Reihenfolgen ordnen und Texte zu Bildgeschichten gestalten.",
      focus: ["Bildimpulse", "Erzählgrammatik", "Erzähldecke"],
      samplePrompts: [
        "Bitte um eine Bildgeschichte mit passenden Impulsfragen für Schreibanfängerinnen.",
        "Erstelle Aufgaben zur Reihenbildung und Überschriftengestaltung.",
        "Plane ein Lernspiel, bei dem Sätze den passenden Bildern zugeordnet werden."
      ]
    },
    {
      id: "sachtexte",
      label: "Sachtexte erschliessen",
      category: "lesen",
      grades: ["3", "4"],
      description: "Informationen markieren, Schaubilder nutzen und Inhalte präzise wiedergeben.",
      focus: ["Informationsentnahme", "Notiztechnik", "Visualisierung"],
      samplePrompts: [
        "Erstelle ein Rechercheblatt mit Text, Tabellen und Kontrollfragen.",
        "Bitte um ein Mini-Projekt, in dem Kinder aus einem Sachtext ein Lapbook gestalten.",
        "Formuliere Differenzierungsaufgaben für leistungsstärkere Lesende."
      ]
    },
    {
      id: "gedichte",
      label: "Gedichte und Reime entdecken",
      category: "lesen",
      grades: ["2", "3", "4"],
      description: "Reime finden, Rhythmus erfassen und kreative Nachdichtungen verfassen.",
      focus: ["Sprachrhythmus", "Vortrag", "Kreatives Schreiben"],
      samplePrompts: [
        "Bitte um ein Poesie-Heft mit Reimaufgaben und Vortragsideen.",
        "Erstelle ein Klangexperiment, bei dem Kinder Gedichte rhythmisch begleiten.",
        "Formuliere Impulse für eigene Gedichte in unterschiedlichen Reimschemata."
      ]
    },
    {
      id: "texte-verfassen",
      label: "Texte verfassen (Bericht, Nacherzählung, Brief)",
      category: "schreiben",
      grades: ["3", "4"],
      description: "Textsortenmerkmale kennen, Schreibplan nutzen und Texte strukturieren.",
      focus: ["Schreibprozess", "Textsortenmerkmale", "Feedback"],
      samplePrompts: [
        "Formuliere ein Schreibgerüst für Bericht, Nacherzählung und Brief.",
        "Bitte um Peer-Feedback-Karten für die Textüberarbeitung.",
        "Erstelle ein Checklisten-Set für selbstständiges Arbeiten."
      ]
    },
    {
      id: "kreatives-schreiben",
      label: "Kreatives Schreiben und Erzählen",
      category: "schreiben",
      grades: ["2", "3", "4"],
      description: "Schreibimpulse, Perspektivwechsel und Fantasiegeschichten anregen.",
      focus: ["Erzählideen", "Bildimpulse", "Sprachbewusstsein"],
      samplePrompts: [
        "Erstelle kreative Schreibimpulse zu Bildkarten oder Gegenständen.",
        "Bitte um eine Ideensammlung für Perspektivwechsel und Gefühlssprache.",
        "Formuliere ein Schreibritual mit Einstieg, Schreibphase und Präsentation."
      ]
    },
    {
      id: "bericht-schreiben",
      label: "Berichte sachlich schreiben",
      category: "schreiben",
      grades: ["3", "4"],
      description: "Zeitformen korrekt nutzen, W-Fragen beantworten und sachlich formulieren.",
      focus: ["Sachsprache", "Strukturierung", "Rückmeldung"],
      samplePrompts: [
        "Bitte um eine Unterrichtssequenz, die Beschreiben, Sammeln und Schreiben verknüpft.",
        "Erstelle ein Differenzierungsblatt mit Satzanfangshilfen für Berichte.",
        "Formuliere eine Lernzielkontrolle mit Bewertungsraster."
      ]
    },
    {
      id: "briefe-schreiben",
      label: "Briefe und E-Mails gestalten",
      category: "schreiben",
      grades: ["2", "3", "4"],
      description: "Anrede, Aufbau, Höflichkeit und digitale Kommunikation reflektieren.",
      focus: ["Medienkompetenz", "Soziale Aspekte", "Formales"],
      samplePrompts: [
        "Erstelle eine Mini-Lerneinheit zu analogem und digitalem Briefeschreiben.",
        "Bitte um Rollenkarten für Briefe zwischen verschiedenen Figuren.",
        "Formuliere ein Feedbackformular für Partnerkorrekturen."
      ]
    },
    {
      id: "Textüberarbeitung",
      label: "Texte überarbeiten",
      category: "schreiben",
      grades: ["2", "3", "4"],
      description: "Checklisten nutzen, Feedback geben und Texte zielgerichtet verbessern.",
      focus: ["Peer Feedback", "Schreibprozess", "Sprachbewusstsein"],
      samplePrompts: [
        "Formuliere eine Überarbeitungsstrategie mit Symbolkarten.",
        "Bitte um einen Stationenlauf mit Aufgaben zu Inhalt, Sprache und Rechtschreibung.",
        "Erstelle ein Reflexionsblatt, auf dem Lernende ihren Fortschritt festhalten."
      ]
    },
    {
      id: "wortschatz-expedition",
      label: "Wortschatz-Expedition",
      category: "wortschatz",
      grades: ["2", "3", "4"],
      description: "Synonyme sammeln, Wortfelder erweitern und treffende Wörter wählen.",
      focus: ["Sprachschatz", "Kommunikation", "Kreativer Austausch"],
      samplePrompts: [
        "Bitte um ein Wortschatzheft mit Wortfeldern und Einsatzbeispielen.",
        "Erstelle ein Spiel, bei dem Synonyme in Kontexte eingeordnet werden.",
        "Formuliere Impulse für Wochenplakate mit Lieblingswörtern."
      ]
    },
    {
      id: "synonyme-antonyme",
      label: "Synonyme und Antonyme",
      category: "wortschatz",
      grades: ["3", "4"],
      description: "Bedeutungsnuancen vergleichen, Gegenteile finden und passende Wörter einsetzen.",
      focus: ["Bedeutungsfelder", "Präzise Sprache", "Differenzierung"],
      samplePrompts: [
        "Erstelle eine Sammlung an Synonymketten von alltäglichen Wörtern.",
        "Bitte um ein Zuordnungsspiel mit Gegenteilen und Beispielsatze.",
        "Formuliere Schreibaufgaben, in denen Synonyme bewusst eingesetzt werden."
      ]
    },
    {
      id: "redensarten",
      label: "Redensarten und Sprichwörter",
      category: "wortschatz",
      grades: ["3", "4"],
      description: "Bedeutungen erklären, Herkunft erforschen und Redewendungen kreativ nutzen.",
      focus: ["Sprachkultur", "Recherche", "Darstellendes Spiel"],
      samplePrompts: [
        "Bitte um kurze Comics, die Redensarten visualisieren.",
        "Erstelle ein Lapbook, in dem Sprichwörter gesammelt und erklärt werden.",
        "Formuliere Rollenspiele, die Redensarten in Alltagssituationen zeigen."
      ]
    },
    {
      id: "sprachdetektive",
      label: "Sprachdetektive im Alltag",
      category: "wortschatz",
      grades: ["2", "3", "4"],
      description: "Sprachliche Besonderheiten im Alltag entdecken, dokumentieren und diskutieren.",
      focus: ["Alltagssprache", "Projektarbeit", "Dokumentation"],
      samplePrompts: [
        "Erstelle ein Lerntagebuch, in dem Kinder interessante Wörter sammeln.",
        "Bitte um eine Projektidee für Sprachdetektive im Schulhaus.",
        "Formuliere Interviewfragen für die Familie zum Thema Lieblingswörter."
      ]
    }
  ]
}
