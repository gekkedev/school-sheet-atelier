import {
  GENERATED_DOCUMENT_SCHEMA,
  generatedDocumentToMarkdown,
  parseGeneratedDocument,
  type GeneratedDocument
} from "./generated-document"
import { createPartRequester, type DocumentPartsOptions } from "./document-parts"

type StationPlan = { title: string; stations: Array<{ title: string; goal: string }> }
// Each request contains only the shared plan and one station, never the growing document.
export async function generateStationLearning(options: DocumentPartsOptions): Promise<GeneratedDocument> {
  const expected = { docType: "station-learning", grade: options.grade, subject: options.subject }
  const request = createPartRequester(options)

  options.onProgress("Der Stationsplan wird erstellt …")
  const plan = await request<StationPlan>(
    'Plane genau 5 unterschiedliche, aufeinander abgestimmte Stationen mit zunehmendem Anspruch. Nur Titel und je ein konkretes Lernziel, noch keine Aufgaben. Schema: {"title":"Titel des Stationenlernens","stations":[{"title":"Stationsname","goal":"Lernziel in einem Satz"}]}.',
    "Der Stationsplan",
    raw => {
      const candidate =
        raw.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1)
      const value = JSON.parse(candidate)
      if (
        !value ||
        typeof value.title !== "string" ||
        !value.title.trim() ||
        !Array.isArray(value.stations) ||
        value.stations.length !== 5 ||
        value.stations.some(
          (s: StationPlan["stations"][number]) =>
            !s || typeof s.title !== "string" || !s.title.trim() || typeof s.goal !== "string" || !s.goal.trim()
        )
      ) {
        throw new Error("Der Plan benötigt einen Titel und genau 5 Stationen mit Titel und Lernziel")
      }
      return value
    }
  )
  const document: GeneratedDocument = {
    ...expected,
    title: plan.title,
    sections: [
      {
        kind: "instructions",
        content:
          "## Laufzettel\n\nName: ____________________\n\nBearbeite die Pflichtstationen. Wähle danach eine Wahlstation. Hake fertige Stationen ab.\n\n" +
          plan.stations
            .map((s, i) => `□ Station ${i + 1}: ${s.title} (${i < 3 ? "Pflicht" : "Wahl"}) — ${s.goal}`)
            .join("\n\n")
      }
    ],
    solutions: {}
  }
  for (const [index, station] of plan.stations.entries()) {
    const label = `Station ${index + 1}: ${station.title}`
    options.onProgress(`${generatedDocumentToMarkdown(document)}\n\n${label} wird erstellt … (${index + 1}/5)`)
    const part = await request(
      `Gemeinsamer Plan: ${JSON.stringify(plan)}\n\nErstelle ausschließlich ${label}. Lernziel: ${station.goal}. ${index < 3 ? "Pflichtstation" : "Wahlstation"}.\n` +
        "Schreibe eine kurze Einführung mit Sozialform, Materialien, Zeit und Schwierigkeitsgrad in sections.content. Erstelle genau 2 konkrete, selbsterklärende Aufgaben in sections.items und vollständige Lösungen in solutions. Alle benötigten Texte, Wörter und Beispiele müssen enthalten sein; keine Verweise auf fehlende Bilder oder Materialien. Verwende kurze Sätze. Höchstens 350 Wörter insgesamt für diese Station einschließlich Lösungen. Keine anderen Stationen, kein Laufzettel und kein Reflexionsbogen.\n" +
        `Schema: ${GENERATED_DOCUMENT_SCHEMA}\nMetadaten: ${JSON.stringify(expected)}. title: ${station.title}.`,
      label,
      raw => {
        const result = parseGeneratedDocument(raw, expected)
        if (!result.document) throw new Error(result.errors.join("; "))
        const tasks = result.document.sections.flatMap(s => s.items ?? [])
        if (
          tasks.length !== 2 ||
          tasks.some(t => !t.id.trim() || !t.prompt.trim() || !result.document!.solutions[t.id]?.trim())
        ) {
          throw new Error("Jede Station benötigt genau 2 vollständige Aufgaben mit Lösungen")
        }
        return result.document
      }
    )
    document.sections.push({ kind: "content", content: `## ${label}` })
    for (const section of part.sections) {
      document.sections.push({
        ...section,
        items: section.items?.map(item => {
          const id = `station-${index + 1}-${item.id}`
          document.solutions[id] = part.solutions[item.id]
          return { ...item, id }
        })
      })
    }
    options.onProgress(generatedDocumentToMarkdown(document))
  }
  document.sections.push({
    kind: "other",
    content:
      "## Reflexion\n\nDas habe ich gelernt: ____________________\n\nDas kann ich jetzt allein: ____________________\n\nHier brauche ich noch Hilfe: ____________________"
  })
  return document
}
