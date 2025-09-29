import type { Subject } from "./topics.types"

export const DEUTSCH_SUBJECT: Subject = {
    id: "deutsch",
    title: "Deutsch",
    tagline: "Sprache entdecken und sicher anwenden",
    description:
      "Kuratiertes Archiv fuer differenzierte Deutschthemen der Klassen 1-4, abgestimmt auf Lehrplaene und praxisnahe Unterrichtsplanung.",
    grades: ["1", "2", "3", "4"],
    categories: [
      {
        id: "lautbewusstsein",
        label: "Einstieg & Lautbewusstsein",
        summary: "Foerdert phonologische Sensibilitaet, Silbenbewusstsein und sichere Startstrategien im Schriftspracherwerb."
      },
      {
        id: "grammatik",
        label: "Grammatik & Rechtschreibung",
        summary: "Sichert grundlegende Grammatik, Satzbau und Rechtschreibstrategien mit klar strukturierten Uebungsformaten."
      },
      {
        id: "lesen",
        label: "Lesen & Verstehen",
        summary: "Trainiert Lesestrategien, Textsortenwissen und reflektiertes Leseverstehen auf verschiedenen Anspruchsniveaus."
      },
      {
        id: "schreiben",
        label: "Schreiben & Texte gestalten",
        summary: "Begleitet den Schreibprozess von der Idee bis zur Ueberarbeitung und staerkt sichere Textproduktion."
      },
      {
        id: "wortschatz",
        label: "Wortschatz & Sprachbewusstsein",
        summary: "Erweitert Wortschatz, Sprachgefuehl und Ausdruckskraft durch kreative, kommunikative Aufgaben."
      }
    ],
    topics: [
      {
        id: "silben-helden",
        label: "Silbenhelden",
        category: "lautbewusstsein",
        grades: ["1", "2"],
        description:
          "Silben klatschen, Silbenboegen setzen und Woerter zerlegen, um sichere Lesestarterinnen und Lesestarter zu foerdern.",
        focus: ["Phonologische Bewusstheit", "Lesestart", "Differenzierung"],
        samplePrompts: [
          "Erstelle ein Partnerarbeitsblatt, auf dem Kinder Woerter in zwei oder drei Silben zerlegen und farbig markieren.",
          "Plane eine Lernkartei mit Silbenpuzzeln fuer heterogene Lerngruppen.",
          "Formuliere ein Stationenlernen, das Silbenklatschen, Silben schwingen und Silben schreiben verbindet."
        ]
      },
      {
        id: "anlaut-detektive",
        label: "Anlaut-Detektive",
        category: "lautbewusstsein",
        grades: ["1"],
        description: "Anlaute hoeren, Bildern zuordnen und Grossbuchstaben sicher schreiben.",
        focus: ["Hoeren und Sprechen", "Bildimpulse", "Feinmotorik"],
        samplePrompts: [
          "Lasse die KI ein Arbeitsblatt erstellen, auf dem Kinder Anlaute hoeren und passende Bildkarten zuordnen.",
          "Entwirf eine Stationsarbeit mit Hoer-Memory, Buchstaben-Spur und Anlautdomino.",
          "Bitte um kurze Geschichten, in denen gezielt neue Anlaute mehrfach vorkommen."
        ]
      },
      {
        id: "lauttreue-woerter",
        label: "Lauttreue Woerter bauen",
        category: "lautbewusstsein",
        grades: ["1", "2"],
        description: "Woerter lautgetreu schreiben, Silbenmodelle nutzen und erste Rechtschreibstrategien entwickeln.",
        focus: ["Schriftspracherwerb", "Selbstkontrolle", "Bildunterstuetzung"],
        samplePrompts: [
          "Formuliere ein Arbeitsblatt, auf dem Kinder lautgetreue Woerter mit Silbenbausteinen zusammensetzen.",
          "Erstelle eine Lernspirale mit Lautgebilden, Silbenhaeusern und Wortbausteinen.",
          "Plane differenzierte Uebungen fuer Lernende mit Foerderbedarf im Schriftspracherwerb."
        ]
      },
      {
        id: "wortarten",
        label: "Wortarten (Nomen, Verben, Adjektive)",
        category: "grammatik",
        grades: ["2", "3", "4"],
        description: "Woerter sortieren, Satzbausteine markieren und Wortarten sicher anwenden.",
        focus: ["Grammatikfundament", "Markierungsaufgaben", "Begriffssicherung"],
        samplePrompts: [
          "Gestalte ein Arbeitsblatt, auf dem Kinder Woerter den Wortarten zuordnen und eigene Beispiele finden.",
          "Bitte um ein kooperatives Spiel, in dem Wortarten gesammelt und zu Saetzen kombiniert werden.",
          "Erstelle ein Grammatik-Quiz mit steigender Schwierigkeit fuer Nomen, Verben und Adjektive."
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
          "Erstelle einen Wochenplan mit Mini-Uebungen zu Nomen und Hoeflichkeitspronomen.",
          "Bitte um einen Lerntipp-Steckbrief zu jeder Rechtschreibstrategie."
        ]
      },
      {
        id: "zeichensetzung",
        label: "Zeichensetzung (Punkt, Frage-, Ausrufezeichen, woertliche Rede)",
        category: "grammatik",
        grades: ["2", "3", "4"],
        description: "Satzschlusszeichen und woertliche Rede gezielt ueben, Satzmelodie reflektieren und Fehler verbessern.",
        focus: ["Satzbau", "Dialoge", "Selbstkorrektur"],
        samplePrompts: [
          "Bitte um kurze Dialoge ohne Zeichensetzung, die von Kindern verbessert werden sollen.",
          "Erstelle ein Partnerdiktat mit verschiedenen Satzschlusszeichen und Rueckmeldekarten.",
          "Entwirf eine Uebung, die den Unterschied zwischen Aussagen, Fragen und Ausrufen verdeutlicht."
        ]
      },
      {
        id: "zeitformen",
        label: "Zeitformen (Praesens, Praeteritum, Perfekt)",
        category: "grammatik",
        grades: ["3", "4"],
        description: "Zeitformen erkennen, konjugieren und in Texten sicher umsetzen.",
        focus: ["Tempustraining", "Vergleichstabellen", "Transfer"],
        samplePrompts: [
          "Formuliere ein Lernplakat, das die drei Zeitformen mit Beispielen gegenueberstellt.",
          "Erstelle Textbausteine, in denen Kinder Zeitformen gezielt tauschen.",
          "Bitte um ein kooperatives Kartenspiel zur Konjugation haeufiger Verben."
        ]
      },
      {
        id: "satzarten",
        label: "Satzarten und Satzbau",
        category: "grammatik",
        grades: ["2", "3", "4"],
        description: "Aussage-, Frage- und Ausrufesaetze unterscheiden und Satzglieder flexibel anordnen.",
        focus: ["Satzgeflecht", "Spielerische Vertiefung", "Satzbauplakate"],
        samplePrompts: [
          "Erstelle ein Stationspaket, in dem Kinder Satzteile legen, kombinieren und umstellen.",
          "Bitte um Bildergeschichten, zu denen unterschiedlich betonte Saetze formuliert werden.",
          "Formuliere ein Lernspiel, das Satzanfangskarten und Satzende verbindet."
        ]
      },
      {
        id: "kommasetzung",
        label: "Kommas in Aufzaehlungen und woertlicher Rede",
        category: "grammatik",
        grades: ["3", "4"],
        description: "Kommas setzen, Regeln anwenden und typische Stolperstellen bewusst machen.",
        focus: ["Regeltraining", "Fehlerkultur", "Reflexion"],
        samplePrompts: [
          "Bitte um eine Fehlersammlung zur Kommasetzung, die Kinder gemeinsam verbessern.",
          "Plane ein Miniprojekt, in dem Lernende eigene Regelplakate gestalten.",
          "Erstelle ein Differenzierungsblatt mit Komma-Cloze fuer schnelle und langsame Lernerinnen."
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
          "Erstelle ein Schreibspiel, in dem Kinder schlichte Saetze mit Adjektiven anreichern.",
          "Plane eine Minilektion zur Komparation unregelmaessiger Adjektive."
        ]
      },
      {
        id: "zusammengesetzte-nomen",
        label: "Zusammengesetzte Nomen",
        category: "grammatik",
        grades: ["2", "3", "4"],
        description: "Komposita bilden, Trennstriche einsetzen und Bedeutungen entschluesseln.",
        focus: ["Wortbausteine", "Wortschatzerweiterung", "Lesestrategie"],
        samplePrompts: [
          "Erstelle eine Wortwerkstatt, in der Kinder neue Nomen aus Vorsilben und Nachsilben bauen.",
          "Bitte um ein Puzzle mit Bildern und zusammengesetzten Woertern.",
          "Formuliere Aufgaben, bei denen Bedeutungen der Komposita erklaert werden sollen."
        ]
      },
      {
        id: "pronomen",
        label: "Pronomen sicher verwenden",
        category: "grammatik",
        grades: ["3", "4"],
        description: "Pronomen erkennen, ersetzen und bewusst in eigenen Texten nutzen.",
        focus: ["Textverstaendnis", "Kohaesion", "Fehleranalyse"],
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
        description: "Merkworter, Regelwoerter, Stammprinzip und Mitsprechworte differenziert trainieren.",
        focus: ["Strategiemix", "Selbstreflexion", "Lerntipps"],
        samplePrompts: [
          "Formuliere ein Reflexionstagebuch, in dem Kinder ihre Rechtschreibstrategien dokumentieren.",
          "Bitte um Mini-Workshops zu vier zentralen Strategien mit passenden Uebungsformaten.",
          "Erstelle ein Lernbuffet, das Rechtschreibstrategien fuer verschiedene Lerntypen anbietet."
        ]
      },
      {
        id: "leseverstehen",
        label: "Leseverstehen (Sachtext, Maerchen, Fabel)",
        category: "lesen",
        grades: ["2", "3", "4"],
        description: "Texte erschliessen, Leitfragen beantworten und Lesestrategien anwenden.",
        focus: ["Lesestrategien", "Frageformen", "Binnendifferenzierung"],
        samplePrompts: [
          "Erstelle ein Lesetagebuch mit Leitfragen fuer unterschiedliche Textsorten.",
          "Bitte um kooperative Lesespiele mit Rollen wie Detektiv, Wortkuenstler, Zusammenfasser.",
          "Formuliere eine Lernzielkontrolle mit offenen und geschlossenen Aufgaben zum Leseverstehen."
        ]
      },
      {
        id: "lesestrategien",
        label: "Lesestrategien trainieren",
        category: "lesen",
        grades: ["3", "4"],
        description: "Markieren, visualisieren und Fragen stellen als Lesewerkzeuge bewusst einueben.",
        focus: ["Metakognition", "Lesetritts", "Symbolkarten"],
        samplePrompts: [
          "Erstelle ein Unterrichtsgespraech, in dem Strategien an einem Beispieltext demonstriert werden.",
          "Bitte um Lesestrategie-Karten, die Kinder vor, waehrend und nach dem Lesen nutzen.",
          "Formuliere einen Wochenplan mit Strategietraining in kooperativen Settings."
        ]
      },
      {
        id: "bildgeschichten",
        label: "Bildgeschichten verstehen und erzaehlen",
        category: "lesen",
        grades: ["1", "2", "3"],
        description: "Bilder lesen, Reihenfolgen ordnen und Texte zu Bildgeschichten gestalten.",
        focus: ["Bildimpulse", "Erzaehlgrammatik", "Erzaehldecke"],
        samplePrompts: [
          "Bitte um eine Bildgeschichte mit passenden Impulsfragen fuer Schreibanfaengerinnen.",
          "Erstelle Aufgaben zur Reihenbildung und Ueberschriftengestaltung.",
          "Plane ein Lernspiel, bei dem Saetze den passenden Bildern zugeordnet werden."
        ]
      },
      {
        id: "sachtexte",
        label: "Sachtexte erschliessen",
        category: "lesen",
        grades: ["3", "4"],
        description: "Informationen markieren, Schaubilder nutzen und Inhalte praezise wiedergeben.",
        focus: ["Informationsentnahme", "Notiztechnik", "Visualisierung"],
        samplePrompts: [
          "Erstelle ein Rechercheblatt mit Text, Tabellen und Kontrollfragen.",
          "Bitte um ein Mini-Projekt, in dem Kinder aus einem Sachtext ein Lapbook gestalten.",
          "Formuliere Differenzierungsaufgaben fuer leistungsstaerkere Lesende."
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
          "Formuliere Impulse fuer eigene Gedichte in unterschiedlichen Reimschemata."
        ]
      },
      {
        id: "texte-verfassen",
        label: "Texte verfassen (Bericht, Nacherzaehlung, Brief)",
        category: "schreiben",
        grades: ["3", "4"],
        description: "Textsortenmerkmale kennen, Schreibplan nutzen und Texte strukturieren.",
        focus: ["Schreibprozess", "Textsortenmerkmale", "Feedback"],
        samplePrompts: [
          "Formuliere ein Schreibgeruest fuer Bericht, Nacherzaehlung und Brief.",
          "Bitte um Peer-Feedback-Karten fuer die Textueberarbeitung.",
          "Erstelle ein Checklisten-Set fuer selbststaendiges Arbeiten."
        ]
      },
      {
        id: "kreatives-schreiben",
        label: "Kreatives Schreiben und Erzaehlen",
        category: "schreiben",
        grades: ["2", "3", "4"],
        description: "Schreibimpulse, Perspektivwechsel und Fantasiegeschichten anregen.",
        focus: ["Erzaehlideen", "Bildimpulse", "Sprachbewusstsein"],
        samplePrompts: [
          "Erstelle kreative Schreibimpulse zu Bildkarten oder Gegenstaenden.",
          "Bitte um eine Ideensammlung fuer Perspektivwechsel und Gefuehlssprache.",
          "Formuliere ein Schreibritual mit Einstieg, Schreibphase und Praesentation."
        ]
      },
      {
        id: "bericht-schreiben",
        label: "Berichte sachlich schreiben",
        category: "schreiben",
        grades: ["3", "4"],
        description: "Zeitformen korrekt nutzen, W-Fragen beantworten und sachlich formulieren.",
        focus: ["Sachsprache", "Strukturierung", "Rueckmeldung"],
        samplePrompts: [
          "Bitte um eine Unterrichtssequenz, die Beschreiben, Sammeln und Schreiben verknuepft.",
          "Erstelle ein Differenzierungsblatt mit Satzanfangshilfen fuer Berichte.",
          "Formuliere eine Lernzielkontrolle mit Bewertungsraster."
        ]
      },
      {
        id: "briefe-schreiben",
        label: "Briefe und E-Mails gestalten",
        category: "schreiben",
        grades: ["2", "3", "4"],
        description: "Anrede, Aufbau, Hoeflichkeit und digitale Kommunikation reflektieren.",
        focus: ["Medienkompetenz", "Soziale Aspekte", "Formales"],
        samplePrompts: [
          "Erstelle eine Mini-Lerneinheit zu analogem und digitalem Briefeschreiben.",
          "Bitte um Rollenkarten fuer Briefe zwischen verschiedenen Figuren.",
          "Formuliere ein Feedbackformular fuer Partnerkorrekturen."
        ]
      },
      {
        id: "textueberarbeitung",
        label: "Texte ueberarbeiten",
        category: "schreiben",
        grades: ["2", "3", "4"],
        description: "Checklisten nutzen, Feedback geben und Texte zielgerichtet verbessern.",
        focus: ["Peer Feedback", "Schreibprozess", "Sprachbewusstsein"],
        samplePrompts: [
          "Formuliere eine Ueberarbeitungsstrategie mit Symbolkarten.",
          "Bitte um einen Stationenlauf mit Aufgaben zu Inhalt, Sprache und Rechtschreibung.",
          "Erstelle ein Reflexionsblatt, auf dem Lernende ihren Fortschritt festhalten."
        ]
      },
      {
        id: "wortschatz-expedition",
        label: "Wortschatz-Expedition",
        category: "wortschatz",
        grades: ["2", "3", "4"],
        description: "Synonyme sammeln, Wortfelder erweitern und treffende Woerter waehlen.",
        focus: ["Sprachschatz", "Kommunikation", "Kreativer Austausch"],
        samplePrompts: [
          "Bitte um ein Wortschatzheft mit Wortfeldern und Einsatzbeispielen.",
          "Erstelle ein Spiel, bei dem Synonyme in Kontexte eingeordnet werden.",
          "Formuliere Impulse fuer Wochenplakate mit Lieblingswoertern."
        ]
      },
      {
        id: "synonyme-antonyme",
        label: "Synonyme und Antonyme",
        category: "wortschatz",
        grades: ["3", "4"],
        description: "Bedeutungsnuancen vergleichen, Gegenteile finden und passende Woerter einsetzen.",
        focus: ["Bedeutungsfelder", "Praezise Sprache", "Differenzierung"],
        samplePrompts: [
          "Erstelle eine Sammlung an Synonymketten von alltaeglichen Woertern.",
          "Bitte um ein Zuordnungsspiel mit Gegenteilen und Beispielsatze.",
          "Formuliere Schreibaufgaben, in denen Synonyme bewusst eingesetzt werden."
        ]
      },
      {
        id: "redensarten",
        label: "Redensarten und Sprichwoerter",
        category: "wortschatz",
        grades: ["3", "4"],
        description: "Bedeutungen erklaeren, Herkunft erforschen und Redewendungen kreativ nutzen.",
        focus: ["Sprachkultur", "Recherche", "Darstellendes Spiel"],
        samplePrompts: [
          "Bitte um kurze Comics, die Redensarten visualisieren.",
          "Erstelle ein Lapbook, in dem Sprichwoerter gesammelt und erklaert werden.",
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
          "Erstelle ein Lerntagebuch, in dem Kinder interessante Woerter sammeln.",
          "Bitte um eine Projektidee fuer Sprachdetektive im Schulhaus.",
          "Formuliere Interviewfragen fuer die Familie zum Thema Lieblingswoerter."
        ]
      }
    ]
  }
