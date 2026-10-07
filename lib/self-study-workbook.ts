import { createPartRequester, type DocumentPartsOptions } from "./document-parts"
import {
  GENERATED_DOCUMENT_SCHEMA,
  generatedDocumentToMarkdown,
  parseGeneratedDocument,
  type GeneratedDocument
} from "./generated-document"

type WorkbookPlan = {
  title: string
  prerequisites: string
  materials: string
  chapters: Array<{ title: string; goal: string }>
}
type Teaching = { explanation: string; example: string; rule: string; hint: string }

function readJson(raw: string) {
  const candidate =
    raw.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1)
  return JSON.parse(candidate)
}
function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

export async function generateSelfStudyWorkbook(options: DocumentPartsOptions): Promise<GeneratedDocument> {
  const request = createPartRequester(options)
  const expected = { docType: "self-study-workbook", grade: options.grade, subject: options.subject }
  options.onProgress("Der Kapitelplan wird erstellt …")
  const plan = await request<WorkbookPlan>(
    'Plane ein Selbstlernheft mit genau 5 aufeinander aufbauenden Kapiteln. Pro Kapitel nur ein neuer Lernschritt. Beschreibe Vorwissen und Materialien kurz. Noch keine Kapitel ausarbeiten. Schema: {"title":"Kindgerechter Titel","prerequisites":"Vorwissen","materials":"Materialien","chapters":[{"title":"Kapitelname","goal":"Konkretes Lernziel in einem Satz"}]}.',
    "Der Kapitelplan",
    raw => {
      const value = readJson(raw)
      if (
        !value ||
        !hasText(value.title) ||
        !hasText(value.prerequisites) ||
        !hasText(value.materials) ||
        !Array.isArray(value.chapters) ||
        value.chapters.length !== 5 ||
        value.chapters.some((c: WorkbookPlan["chapters"][number]) => !c || !hasText(c.title) || !hasText(c.goal))
      ) {
        throw new Error("Der Plan benötigt Titel, Vorwissen, Materialien und genau 5 Kapitel mit Lernzielen")
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
          `## Das lernst du\n\n${plan.chapters.map((c, i) => `${i + 1}. ${c.title}: ${c.goal}`).join("\n\n")}\n\n` +
          `## Das brauchst du schon\n\n${plan.prerequisites}\n\n## Materialien\n\n${plan.materials}\n\n` +
          "Lies die Erklärung und das Beispiel. Übe zuerst mit Hilfe, dann allein. Vergleiche deine Antworten anschließend mit den Lösungen am Ende."
      }
    ],
    solutions: {}
  }
  const sharedPlan = `Gemeinsamer Kapitelplan: ${JSON.stringify(plan)}`
  const progress = (label?: string) =>
    options.onProgress(generatedDocumentToMarkdown(document) + (label ? `\n\n${label} wird erstellt …` : ""))

  async function exercises(label: string, prefix: string, prompt: string, guided = false) {
    progress(label)
    const part = await request(
      `${sharedPlan}\n\n${prompt}\nErstelle ausschließlich diesen Aufgabenteil, keine anderen Kapitel. Genau 3 konkrete Aufgaben in sections.items, alle benötigten Texte und Beispiele sowie vollständige Lösungen in solutions. Kurze Sätze, insgesamt höchstens 300 Wörter einschließlich Lösungen.\n` +
        `Schema: ${GENERATED_DOCUMENT_SCHEMA}\nMetadaten: ${JSON.stringify(expected)}.`,
      label,
      raw => {
        const result = parseGeneratedDocument(raw, expected)
        if (!result.document) throw new Error(result.errors.join("; "))
        const tasks = result.document.sections.flatMap(s => s.items ?? [])
        if (
          tasks.length !== 3 ||
          tasks.some(t => !hasText(t.id) || !hasText(t.prompt) || !hasText(result.document!.solutions[t.id]))
        ) {
          throw new Error("Es werden genau 3 vollständige Aufgaben mit Lösungen benötigt")
        }
        if (guided && (tasks[0].type !== "guided" || tasks.slice(1).some(t => t.type !== "independent"))) {
          throw new Error(
            "Zuerst eine angeleitete Aufgabe (type guided), dann zwei selbstständige Aufgaben (type independent)"
          )
        }
        return result.document
      }
    )
    document.sections.push({ kind: "content", content: `## ${label}` })
    for (const section of part.sections) {
      document.sections.push({
        ...section,
        items: section.items?.map(item => {
          const id = `${prefix}-${item.id}`
          document.solutions[id] = part.solutions[item.id]
          return {
            ...item,
            id,
            prompt: `${item.prompt}\n\n____________________________\n\n____________________________`
          }
        })
      })
    }
    progress()
  }

  for (const [index, chapter] of plan.chapters.entries()) {
    const label = `Kapitel ${index + 1}: ${chapter.title}`
    progress(label)
    // Explanation and practice are separate requests so one chapter cannot consume the whole response budget.
    const teaching = await request<Teaching>(
      `${sharedPlan}\n\nErkläre ausschließlich ${label}. Lernziel: ${chapter.goal}. Setze nur das Vorwissen und frühere Kapitel voraus. Keine Aufgaben und keine anderen Kapitel.\n` +
        'Schema: {"explanation":"Kurze Erklärung mit genau einem neuen Lernschritt","example":"Ein vollständig vorgemachtes Beispiel mit erklärten Schritten","rule":"Merksatz in einfacher Sprache","hint":"Hilfetipp ohne Übungsantworten zu verraten"}. Höchstens 250 Wörter insgesamt.',
      label,
      raw => {
        const value = readJson(raw)
        if (!value || ![value.explanation, value.example, value.rule, value.hint].every(hasText)) {
          throw new Error("Erklärung, vorgemachtes Beispiel, Merksatz und Hilfetipp müssen vollständig sein")
        }
        return value
      }
    )
    document.sections.push({
      kind: "content",
      content: `## ${label}\n\n${teaching.explanation}\n\n### So geht es\n\n${teaching.example}\n\n### Merke\n\n${teaching.rule}\n\n### Hilfe\n\n${teaching.hint}`
    })
    await exercises(
      `Übungen zu Kapitel ${index + 1}`,
      `kapitel-${index + 1}`,
      `Erstelle Übungen ausschließlich zu ${label}. Lernziel: ${chapter.goal}. Unterrichtsinhalt: ${JSON.stringify(teaching)}.\n` +
        "Aufgabe 1: angeleitete Übung mit konkreter Hilfestellung im prompt (type guided). Aufgaben 2 und 3: selbstständige Übungen (type independent), die mit der Erklärung lösbar sind. Keine neuen Lerninhalte voraussetzen.",
      true
    )
    if ((index + 1) % 2 === 0) {
      await exercises(
        `Mini-Selbstcheck nach Kapitel ${index + 1}`,
        `check-${index + 1}`,
        `Erstelle einen Mini-Selbstcheck mit 3 abwechslungsreichen Aufgaben zu den Lernzielen der Kapitel ${index} und ${index + 1}. Prüfe nur bereits behandelte Lernziele und verwende keine Inhalte späterer Kapitel.`
      )
    }
  }
  document.sections.push({
    kind: "other",
    content: "## Das kann ich jetzt\n\n" + plan.chapters.map(c => `□ ${c.goal}`).join("\n\n")
  })
  await exercises(
    "Abschlusstest",
    "abschlusstest",
    "Erstelle 3 gemischte Aufgaben zum gesamten Thema. Verbinde die Lernziele der 5 Kapitel und prüfe auch die Anwendung auf ein neues Beispiel. Keine neuen Lerninhalte voraussetzen."
  )
  document.sections.push({
    kind: "other",
    content:
      "## Weiterlernen\n\nWähle ein Kapitel und erfinde eine eigene Aufgabe dazu. Schreibe eine Lösung mit Erklärung. Lass ein anderes Kind deine Aufgabe ausprobieren."
  })
  progress()
  return document
}
