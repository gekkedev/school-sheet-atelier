export type DocumentType = {
  id: string
  label: string
  description: string
  icon: string
  systemPromptAddition: string
  taskInstructions: string[]
}

export const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: "worksheet",
    label: "Arbeitsblatt",
    description: "Strukturierte Übungsaufgaben mit Lösungen",
    icon: "📝",
    systemPromptAddition: "Du erstellst ein klassisches Arbeitsblatt mit vielfältigen Übungsaufgaben.",
    taskInstructions: [
      "1. Titel und kurze Einleitung (2-3 Sätze)",
      "2. Lernziele (2-3 Stichpunkte)",
      "3. Aufgabenbereich mit mindestens 5 verschiedenen Aufgaben",
      "4. Jede Aufgabe sollte mit Schwierigkeitsgrad (leicht/mittel/schwer) markiert sein",
      "5. Differenzierungsidee für Förder- und Forderkinder",
      "6. Vollständiger Lösungsteil mit allen Antworten"
    ]
  },
  {
    id: "exam",
    label: "Klassenarbeit",
    description: "Prüfungsformat mit Zeitangabe und Punkteverteilung",
    icon: "📋",
    systemPromptAddition:
      "Du erstellst eine Klassenarbeit mit Punkteverteilung, Zeitangabe und klarer Bewertungsstruktur.",
    taskInstructions: [
      "1. Titel mit Klassenstufe und Zeitangabe (z.B. 45 Minuten)",
      "2. Hinweise für Schüler (erlaubte Hilfsmittel, etc.)",
      "3. Aufgaben mit Punkteangaben (insgesamt sollten 20-30 Punkte erreicht werden)",
      "4. Mindestens 4-6 Aufgaben mit steigendem Schwierigkeitsgrad",
      "5. Notenschlüssel (z.B. ab 27 Punkte = 1, ab 24 Punkte = 2, etc.)",
      "6. Separater Lösungsteil mit Erwartungshorizont und Punkteverteilung"
    ]
  },
  {
    id: "reading",
    label: "Lesetext mit Aufgaben",
    description: "Altersgerechter Text mit Verständnisfragen",
    icon: "📖",
    systemPromptAddition:
      "Du erstellst einen interessanten, altersgerechten Lesetext mit differenzierten Verständnisaufgaben.",
    taskInstructions: [
      "1. Titel und Einleitung",
      "2. Lesetext (150-400 Wörter, angepasst an die Klassenstufe)",
      "3. Textsorte deutlich machen (Erzählung, Sachtext, Brief, etc.)",
      "4. Verständnisfragen in drei Niveaustufen:",
      "   - Leicht: direkt aus dem Text ableitbar",
      "   - Mittel: zwischen den Zeilen lesen",
      "   - Schwer: Transfer und eigene Meinung",
      "5. Wortschatzarbeit: 3-5 schwierige Wörter erklären",
      "6. Lösungen mit Textstellen-Verweisen"
    ]
  },
  {
    id: "cloze",
    label: "Lückentext",
    description: "Text mit gezielten Lücken zum Ausfüllen",
    icon: "✏️",
    systemPromptAddition: "Du erstellst einen Lückentext mit didaktisch sinnvoll platzierten Auslassungen.",
    taskInstructions: [
      "1. Titel und Lernziel (z.B. Wortarten, Rechtschreibung, Sachthema)",
      "2. Einleitungstext für Schüler",
      "3. Lückentext mit 10-15 Lücken (markiere Lücken mit _______ oder [1], [2], etc.)",
      "4. Optional: Wortbank mit den fehlenden Wörtern (durcheinander)",
      "5. Differenzierung: Eine leichtere Version mit Wortvorgaben",
      "6. Lösungen: vollständiger Text ohne Lücken"
    ]
  },
  {
    id: "quiz-multiple-choice",
    label: "Multiple-Choice-Quiz",
    description: "Fragen mit Auswahlmöglichkeiten",
    icon: "✔️",
    systemPromptAddition:
      "Du erstellst ein übersichtliches, altersgerechtes Multiple-Choice-Quiz mit kurzen Sätzen und plausiblen Distraktoren.",
    taskInstructions: [
      "1. Titel und kurze Einleitung",
      "2. 8-12 Multiple-Choice-Fragen zum Thema",
      "3. Pro Frage genau 4 Antwortmöglichkeiten (a, b, c, d)",
      "3a. Jede Antwortmöglichkeit ist kurz, eindeutig und steht im Feld options (nicht im Fragetext)",
      "4. Nur eine Antwort ist korrekt",
      "5. Die falschen Antworten (Distraktoren) sollten plausibel klingen",
      "6. Fragen in verschiedenen Schwierigkeitsgraden",
      "7. Lösungsblatt: Liste der richtigen Antworten mit kurzen Erklärungen"
    ]
  },
  {
    id: "quiz-short-answer",
    label: "Kurzantwort-Quiz",
    description: "Fragen mit kurzen, offenen Antworten",
    icon: "💬",
    systemPromptAddition: "Du erstellst ein Quiz mit kurzen, prägnanten Fragen und offenen Antworten.",
    taskInstructions: [
      "1. Titel und Einleitung",
      "2. 10-15 Fragen mit kurzen Antworten (1-2 Sätze)",
      "3. Mischung aus Fakten-, Verständnis- und Transferfragen",
      "4. Fragen in steigender Schwierigkeit",
      "5. Bei Sachthemen: verschiedene Aspekte abdecken",
      "6. Lösungen mit Musterlösungen (auch alternative Formulierungen angeben)"
    ]
  },
  {
    id: "flashcards",
    label: "Lernkarten",
    description: "Vorderseite (Begriff) und Rückseite (Erklärung)",
    icon: "🗂️",
    systemPromptAddition: "Du erstellst Lernkarten im Vorderseite-Rückseite-Format.",
    taskInstructions: [
      "1. Titel und Hinweise zur Nutzung",
      "2. 10-15 Lernkarten erstellen",
      "3. Jede Karte hat:",
      "   - VORDERSEITE: Begriff, Frage oder Bild-Beschreibung",
      "   - RÜCKSEITE: Definition, Antwort oder Erklärung",
      "4. Formatiere klar mit 'Karte 1 - Vorderseite:' und 'Karte 1 - Rückseite:'",
      "5. Steigender Schwierigkeitsgrad",
      "6. Zusatz: Tipps für Lerntechniken mit den Karten"
    ]
  },
  {
    id: "answer-sheet",
    label: "Antwortbogen",
    description: "Leeres Formular zum Ausfüllen",
    icon: "📄",
    systemPromptAddition: "Du erstellst einen strukturierten Antwortbogen.",
    taskInstructions: [
      "1. Titel (z.B. 'Antwortbogen zu [Thema]')",
      "2. Kopfzeile für Name, Klasse, Datum",
      "3. Nummerierte Antwortfelder (1-20)",
      "4. Je nach Typ:",
      "   - Multiple Choice: □ a) □ b) □ c) □ d)",
      "   - Kurzantwort: _____________________________________",
      "   - Längere Antwort: mehrere Zeilen",
      "5. Punkteangaben neben jeder Frage",
      "6. Gesamtpunktzahl am Ende"
    ]
  },
  {
    id: "project",
    label: "Projektauftrag",
    description: "Mehrwöchiges Projekt mit Arbeitsschritten",
    icon: "🎯",
    systemPromptAddition: "Du erstellst einen strukturierten Projektauftrag mit Phasenplan.",
    taskInstructions: [
      "1. Projekttitel und Leitfrage",
      "2. Lernziele und Kompetenzen",
      "3. Zeitrahmen (z.B. 4 Wochen, 8 Schulstunden)",
      "4. Phasenplan mit 4-6 Schritten:",
      "   - Einstieg und Themenfindung",
      "   - Recherche und Sammlung",
      "   - Gestaltung und Umsetzung",
      "   - Präsentation",
      "5. Materialien und Hilfsmittel",
      "6. Bewertungskriterien (Prozess und Produkt)",
      "7. Differenzierungsideen"
    ]
  },
  {
    id: "station-learning",
    label: "Stationenlernen",
    description: "Mehrere Lernstationen zum selbstständigen Durchlaufen",
    icon: "🔄",
    systemPromptAddition: "Du erstellst ein Stationenlernen mit 5-7 differenzierten Stationen.",
    taskInstructions: [
      "1. Titel und Übersicht über alle Stationen",
      "2. Laufzettel für Schüler (Stations-Checkboxen)",
      "3. Für jede Station (5-7 Stationen):",
      "   - Stationsname und Sozialform (Einzel-, Partner-, Gruppenarbeit)",
      "   - Materialien",
      "   - Aufgabenstellung (klar und selbsterklärend)",
      "   - Zeitangabe",
      "   - Schwierigkeitsgrad (Pflicht- oder Wahlstation)",
      "4. Lösungsblatt für alle Stationen",
      "5. Reflexionsbogen für Schüler"
    ]
  }
]

export function getDocumentType(id: string): DocumentType {
  return DOCUMENT_TYPES.find(type => type.id === id) ?? DOCUMENT_TYPES[0]
}
