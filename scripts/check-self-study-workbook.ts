import assert from "node:assert/strict"
import { generateSelfStudyWorkbook } from "../lib/self-study-workbook"
import { generatedDocumentToMarkdown, parseGeneratedDocument } from "../lib/generated-document"

const plan = {
  title: "Wortarten",
  prerequisites: "Kurze Sätze lesen",
  materials: "Stift und Papier",
  chapters: Array.from({ length: 5 }, (_, i) => ({ title: `Lernschritt ${i + 1}`, goal: `Lernziel ${i + 1}` }))
}
const teaching = {
  explanation: "Verben beschreiben Tätigkeiten.",
  example: "In 'Mia läuft' ist läuft ein Verb.",
  rule: "Verben sagen, was passiert.",
  hint: "Frage: Was tut Mia?"
}
const metadata = { docType: "self-study-workbook", grade: 3, subject: "Deutsch" }
const tasks = {
  ...metadata,
  title: "Übungen",
  sections: [
    {
      kind: "tasks",
      items: [
        { id: "1", type: "guided", prompt: "Finde das Verb: Mia läuft. Frage: Was tut Mia?" },
        { id: "2", type: "independent", prompt: "Finde das Verb: Tom singt." },
        { id: "3", type: "independent", prompt: "Finde das Verb: Lea tanzt." }
      ]
    }
  ],
  solutions: { "1": "läuft", "2": "singt", "3": "tanzt" }
}
const defaults = {
  topic: "Wortarten",
  description: "Wortarten erkennen",
  focus: ["Grammatik"],
  grade: 3,
  subject: "Deutsch",
  temperature: 0.4,
  maxTokens: 2048,
  signal: new AbortController().signal,
  onProgress: (_: string) => {}
}
const answer = (prompt: string) =>
  prompt.includes("Plane ein Selbstlernheft") ? plan : prompt.includes("Erkläre ausschließlich") ? teaching : tasks

export async function checkSelfStudyWorkbook() {
  const requests: Array<Parameters<Parameters<typeof generateSelfStudyWorkbook>[0]["generate"]>[0]> = []
  const progress: string[] = []
  const document = await generateSelfStudyWorkbook({
    ...defaults,
    onProgress: p => progress.push(p),
    generate: async request => {
      requests.push(request)
      return { text: JSON.stringify(answer(request.messages[1].content)), truncated: requests.length === 2 }
    }
  })
  // Plan, 5 explanations, 5 exercise sets, 2 mini-checks, final test; plus one explanation retry.
  assert.equal(requests.length, 15)
  assert.ok(requests.every(r => r.maxTokens === 2048))
  assert.ok(requests.slice(1).every(r => r.messages[1].content.includes(JSON.stringify(plan))))
  assert.match(requests[2].messages[1].content, /Erkläre ausschließlich Kapitel 1/)
  assert.match(requests[3].messages[1].content, /Verben beschreiben Tätigkeiten/)
  assert.ok(!requests[4].messages[1].content.includes("Mia läuft")) // No growing document in later requests.
  assert.deepEqual(parseGeneratedDocument(JSON.stringify(document), metadata).errors, [])
  assert.equal(Object.keys(document.solutions).length, 24)
  assert.equal(document.solutions["kapitel-1-1"], "läuft")
  assert.equal(document.solutions["kapitel-5-1"], "läuft")
  assert.equal(document.solutions["check-2-1"], "läuft")
  assert.equal(document.solutions["check-4-1"], "läuft")
  assert.equal(document.solutions["abschlusstest-1"], "läuft")
  const markdown = generatedDocumentToMarkdown(document)
  for (const heading of [
    "Das brauchst du schon",
    "Materialien",
    "So geht es",
    "Merke",
    "Hilfe",
    "Das kann ich jetzt",
    "Abschlusstest",
    "Weiterlernen",
    "Lösungen"
  ]) {
    assert.ok(markdown.includes(heading), heading)
  }
  assert.ok(markdown.indexOf("Mini-Selbstcheck nach Kapitel 2") < markdown.indexOf("## Kapitel 3"))
  assert.ok(markdown.indexOf("Mini-Selbstcheck nach Kapitel 4") < markdown.indexOf("## Kapitel 5"))
  assert.ok(progress.some(p => p.includes("Kapitel 2") && p.includes("Mia läuft")))

  let calls = 0
  let lastProgress = ""
  await assert.rejects(
    generateSelfStudyWorkbook({
      ...defaults,
      onProgress: p => {
        lastProgress = p
      },
      generate: async request => {
        calls++
        return { text: JSON.stringify(answer(request.messages[1].content)), truncated: calls >= 4 }
      }
    }),
    /Kapitel 2.*Ausgabelimit/
  )
  assert.equal(calls, 5)
  assert.match(lastProgress, /Übungen zu Kapitel 1/)

  calls = 0
  await assert.rejects(
    generateSelfStudyWorkbook({
      ...defaults,
      generate: async request => {
        calls++
        return { text: JSON.stringify(calls === 1 ? plan : { ...teaching, example: "" }), truncated: false }
      }
    }),
    /vorgemachtes Beispiel/
  )
  assert.equal(calls, 3)

  const controller = new AbortController()
  calls = 0
  await assert.rejects(
    generateSelfStudyWorkbook({
      ...defaults,
      signal: controller.signal,
      generate: async request => {
        calls++
        if (calls === 3) controller.abort()
        return { text: JSON.stringify(answer(request.messages[1].content)), truncated: false }
      }
    }),
    { name: "AbortError" }
  )
  assert.equal(calls, 3)
  console.log("self-study-workbook checks passed")
}
