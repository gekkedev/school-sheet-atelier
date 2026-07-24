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
    },
    {
      id: "anlaut-detektive",
      label: "Anlaut-Detektive",
      category: "lautbewusstsein",
      grades: ["1"],
      description: "Anlaute hören, Bildern zuordnen und Grossbuchstaben sicher schreiben.",
      focus: ["Hören und Sprechen", "Bildimpulse", "Feinmotorik"],
    },
    {
      id: "lauttreue-Wörter",
      label: "Lauttreue Wörter bauen",
      category: "lautbewusstsein",
      grades: ["1", "2"],
      description: "Wörter lautgetreu schreiben, Silbenmodelle nutzen und erste Rechtschreibstrategien entwickeln.",
      focus: ["Schriftspracherwerb", "Selbstkontrolle", "Bildunterstützung"],
    },
    {
      id: "wortarten",
      label: "Wortarten (Nomen, Verben, Adjektive)",
      category: "grammatik",
      grades: ["2", "3", "4"],
      description: "Wörter sortieren, Satzbausteine markieren und Wortarten sicher anwenden.",
      focus: ["Grammatikfundament", "Markierungsaufgaben", "Begriffssicherung"],
    },
    {
      id: "gross-klein",
      label: "Gross- und Kleinschreibung",
      category: "grammatik",
      grades: ["2", "3", "4"],
      description: "Regeln wiederholen, knifflige Beispielsatzpaare analysieren und Rechtschreibstrategien anwenden.",
      focus: ["Regelwissen", "Fehleranalyse", "Trainingstexte"],
    },
    {
      id: "zeichensetzung",
      label: "Zeichensetzung (Punkt, Frage-, Ausrufezeichen, wörtliche Rede)",
      category: "grammatik",
      grades: ["2", "3", "4"],
      description:
        "Satzschlusszeichen und wörtliche Rede gezielt üben, Satzmelodie reflektieren und Fehler verbessern.",
      focus: ["Satzbau", "Dialoge", "Selbstkorrektur"],
    },
    {
      id: "zeitformen",
      label: "Zeitformen (Präsens, Präteritum, Perfekt)",
      category: "grammatik",
      grades: ["3", "4"],
      description: "Zeitformen erkennen, konjugieren und in Texten sicher umsetzen.",
      focus: ["Tempustraining", "Vergleichstabellen", "Transfer"],
    },
    {
      id: "satzarten",
      label: "Satzarten und Satzbau",
      category: "grammatik",
      grades: ["2", "3", "4"],
      description: "Aussage-, Frage- und Ausrufesätze unterscheiden und Satzglieder flexibel anordnen.",
      focus: ["Satzgeflecht", "Spielerische Vertiefung", "Satzbauplakate"],
    },
    {
      id: "kommasetzung",
      label: "Kommas in Aufzählungen und wörtlicher Rede",
      category: "grammatik",
      grades: ["3", "4"],
      description: "Kommas setzen, Regeln anwenden und typische Stolperstellen bewusst machen.",
      focus: ["Regeltraining", "Fehlerkultur", "Reflexion"],
    },
    {
      id: "steigerung-adjektive",
      label: "Adjektive und Steigerung",
      category: "grammatik",
      grades: ["2", "3", "4"],
      description: "Adjektive entdecken, steigern und wirkungsvoll in Texten einsetzen.",
      focus: ["Sprache verfeinern", "Synonyme", "Satzbau"],
    },
    {
      id: "zusammengesetzte-nomen",
      label: "Zusammengesetzte Nomen",
      category: "grammatik",
      grades: ["2", "3", "4"],
      description: "Komposita bilden, Trennstriche einsetzen und Bedeutungen entschlüsseln.",
      focus: ["Wortbausteine", "Wortschatzerweiterung", "Lesestrategie"],
    },
    {
      id: "pronomen",
      label: "Pronomen sicher verwenden",
      category: "grammatik",
      grades: ["3", "4"],
      description: "Pronomen erkennen, ersetzen und bewusst in eigenen Texten nutzen.",
      focus: ["Textverständnis", "Kohäsion", "Fehleranalyse"],
    },
    {
      id: "rechtschreibstrategien",
      label: "Rechtschreibstrategien kombinieren",
      category: "grammatik",
      grades: ["2", "3", "4"],
      description: "Merkworter, Regelwörter, Stammprinzip und Mitsprechworte differenziert trainieren.",
      focus: ["Strategiemix", "Selbstreflexion", "Lerntipps"],
    },
    {
      id: "leseverstehen",
      label: "Leseverstehen (Sachtext, Märchen, Fabel)",
      category: "lesen",
      grades: ["2", "3", "4"],
      description: "Texte erschliessen, Leitfragen beantworten und Lesestrategien anwenden.",
      focus: ["Lesestrategien", "Frageformen", "Binnendifferenzierung"],
    },
    {
      id: "lesestrategien",
      label: "Lesestrategien trainieren",
      category: "lesen",
      grades: ["3", "4"],
      description: "Markieren, visualisieren und Fragen stellen als Lesewerkzeuge bewusst einüben.",
      focus: ["Metakognition", "Lesetritts", "Symbolkarten"],
    },
    {
      id: "bildgeschichten",
      label: "Bildgeschichten verstehen und erzählen",
      category: "lesen",
      grades: ["1", "2", "3"],
      description: "Bilder lesen, Reihenfolgen ordnen und Texte zu Bildgeschichten gestalten.",
      focus: ["Bildimpulse", "Erzählgrammatik", "Erzähldecke"],
    },
    {
      id: "sachtexte",
      label: "Sachtexte erschliessen",
      category: "lesen",
      grades: ["3", "4"],
      description: "Informationen markieren, Schaubilder nutzen und Inhalte präzise wiedergeben.",
      focus: ["Informationsentnahme", "Notiztechnik", "Visualisierung"],
    },
    {
      id: "gedichte",
      label: "Gedichte und Reime entdecken",
      category: "lesen",
      grades: ["2", "3", "4"],
      description: "Reime finden, Rhythmus erfassen und kreative Nachdichtungen verfassen.",
      focus: ["Sprachrhythmus", "Vortrag", "Kreatives Schreiben"],
    },
    {
      id: "texte-verfassen",
      label: "Texte verfassen (Bericht, Nacherzählung, Brief)",
      category: "schreiben",
      grades: ["3", "4"],
      description: "Textsortenmerkmale kennen, Schreibplan nutzen und Texte strukturieren.",
      focus: ["Schreibprozess", "Textsortenmerkmale", "Feedback"],
    },
    {
      id: "kreatives-schreiben",
      label: "Kreatives Schreiben und Erzählen",
      category: "schreiben",
      grades: ["2", "3", "4"],
      description: "Schreibimpulse, Perspektivwechsel und Fantasiegeschichten anregen.",
      focus: ["Erzählideen", "Bildimpulse", "Sprachbewusstsein"],
    },
    {
      id: "bericht-schreiben",
      label: "Berichte sachlich schreiben",
      category: "schreiben",
      grades: ["3", "4"],
      description: "Zeitformen korrekt nutzen, W-Fragen beantworten und sachlich formulieren.",
      focus: ["Sachsprache", "Strukturierung", "Rückmeldung"],
    },
    {
      id: "briefe-schreiben",
      label: "Briefe und E-Mails gestalten",
      category: "schreiben",
      grades: ["2", "3", "4"],
      description: "Anrede, Aufbau, Höflichkeit und digitale Kommunikation reflektieren.",
      focus: ["Medienkompetenz", "Soziale Aspekte", "Formales"],
    },
    {
      id: "Textüberarbeitung",
      label: "Texte überarbeiten",
      category: "schreiben",
      grades: ["2", "3", "4"],
      description: "Checklisten nutzen, Feedback geben und Texte zielgerichtet verbessern.",
      focus: ["Peer Feedback", "Schreibprozess", "Sprachbewusstsein"],
    },
    {
      id: "wortschatz-expedition",
      label: "Wortschatz-Expedition",
      category: "wortschatz",
      grades: ["2", "3", "4"],
      description: "Synonyme sammeln, Wortfelder erweitern und treffende Wörter wählen.",
      focus: ["Sprachschatz", "Kommunikation", "Kreativer Austausch"],
    },
    {
      id: "synonyme-antonyme",
      label: "Synonyme und Antonyme",
      category: "wortschatz",
      grades: ["3", "4"],
      description: "Bedeutungsnuancen vergleichen, Gegenteile finden und passende Wörter einsetzen.",
      focus: ["Bedeutungsfelder", "Präzise Sprache", "Differenzierung"],
    },
    {
      id: "redensarten",
      label: "Redensarten und Sprichwörter",
      category: "wortschatz",
      grades: ["3", "4"],
      description: "Bedeutungen erklären, Herkunft erforschen und Redewendungen kreativ nutzen.",
      focus: ["Sprachkultur", "Recherche", "Darstellendes Spiel"],
    },
    {
      id: "sprachdetektive",
      label: "Sprachdetektive im Alltag",
      category: "wortschatz",
      grades: ["2", "3", "4"],
      description: "Sprachliche Besonderheiten im Alltag entdecken, dokumentieren und diskutieren.",
      focus: ["Alltagssprache", "Projektarbeit", "Dokumentation"],
    }
  ]
}
