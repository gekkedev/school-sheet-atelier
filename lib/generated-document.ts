export type GeneratedDocument = {
  docType: string
  title: string
  grade: number
  subject: string
  sections: Array<{
    kind: string
    content?: string
    items?: Array<{
      id: string
      type: string
      prompt: string
      options?: string[]
      expected_answer?: string
    }>
  }>
  solutions: Record<string, string>
}

export const GENERATED_DOCUMENT_SCHEMA = `{
  "docType": "the document type id supplied by the user",
  "title": "string",
  "grade": 1,
  "subject": "string",
  "sections": [
    {
      "kind": "instructions|content|tasks|other",
      "content": "optional markdown string",
      "items": [
        {
          "id": "stable unique task id, for example task-1",
          "type": "string",
          "prompt": "string",
          "options": ["optional answer choice"],
          "expected_answer": "optional string"
        }
      ]
    }
  ],
  "solutions": { "task-1": "answer for the task with this id" }
}`

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function parseGeneratedDocument(
  raw: string,
  expected: { docType: string; grade: number; subject: string }
): { document?: GeneratedDocument; errors: string[] } {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]
  const candidate = fenced ?? raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1)
  let value: unknown

  try {
    value = JSON.parse(candidate)
  } catch {
    return { errors: ["The response is not valid JSON."] }
  }

  if (!isRecord(value)) return { errors: ["The root value must be an object."] }

  const errors: string[] = []
  const taskIds: string[] = []
  if (value.docType !== expected.docType) errors.push(`docType must be "${expected.docType}".`)
  if (typeof value.title !== "string" || !value.title.trim()) errors.push("title must be a non-empty string.")
  if (value.grade !== expected.grade) errors.push(`grade must be ${expected.grade}.`)
  if (value.subject !== expected.subject) errors.push(`subject must be "${expected.subject}".`)
  if (!Array.isArray(value.sections) || value.sections.length === 0) {
    errors.push("sections must be a non-empty array.")
  } else {
    value.sections.forEach((section, sectionIndex) => {
      if (!isRecord(section) || typeof section.kind !== "string") {
        errors.push(`sections[${sectionIndex}] must contain a string kind.`)
        return
      }
      if (section.content !== undefined && typeof section.content !== "string") {
        errors.push(`sections[${sectionIndex}].content must be a string.`)
      }
      if (section.items !== undefined && !Array.isArray(section.items)) {
        errors.push(`sections[${sectionIndex}].items must be an array.`)
      } else if (Array.isArray(section.items)) {
        section.items.forEach((item, itemIndex) => {
          if (
            !isRecord(item) ||
            typeof item.id !== "string" ||
            typeof item.type !== "string" ||
            typeof item.prompt !== "string"
          ) {
            errors.push(`sections[${sectionIndex}].items[${itemIndex}] requires string id, type, and prompt.`)
          } else {
            taskIds.push(item.id)
          }
        })
      }
    })
  }
  if (!isRecord(value.solutions) || Object.values(value.solutions).some(solution => typeof solution !== "string")) {
    errors.push("solutions must be an object whose values are strings.")
  } else {
    if (new Set(taskIds).size !== taskIds.length) errors.push("Every task id must be unique.")
    const solutionIds = Object.keys(value.solutions)
    if (taskIds.some(id => !solutionIds.includes(id)) || solutionIds.some(id => !taskIds.includes(id))) {
      errors.push("solutions must contain exactly one entry for every task id.")
    }
  }

  return errors.length > 0 ? { errors } : { document: value as GeneratedDocument, errors }
}

export function generatedDocumentToMarkdown(document: GeneratedDocument): string {
  const lines = [`# ${document.title}`]
  let taskNumber = 0

  for (const section of document.sections) {
    if (section.content) lines.push("", section.content)
    for (const item of section.items ?? []) {
      taskNumber++
      lines.push("", `## Aufgabe ${taskNumber}`, "", item.prompt)
      if (item.options?.length)
        lines.push(
          "",
          ...item.options.map((option, optionIndex) => `${String.fromCharCode(97 + optionIndex)}) ${option}`)
        )
    }
  }

  const solutions = Object.entries(document.solutions)
  if (solutions.length) {
    lines.push("", "# Lösungen")
    for (const [id, solution] of solutions) lines.push("", `**${id}:** ${solution}`)
  }

  return lines.join("\n").trim()
}
