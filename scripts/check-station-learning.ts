import assert from "node:assert/strict"
import { generateStationLearning } from "../lib/station-learning"
import { generatedDocumentToMarkdown, parseGeneratedDocument } from "../lib/generated-document"
import { generateWithOpenRouter } from "../lib/openrouter"

const plan = {
  title: "Wortarten",
  stations: Array.from({ length: 5 }, (_, i) => ({ title: `Wortarten ${i + 1}`, goal: `Lernziel ${i + 1}` }))
}
const metadata = { docType: "station-learning", grade: 3, subject: "Deutsch" }
const part = {
  ...metadata,
  title: "Station",
  sections: [
    {
      kind: "tasks",
      content: "Einzelarbeit, Papier und Stift, 10 Minuten.",
      items: [
        { id: "task-1", type: "short-answer", prompt: "Welche Wortart ist laufen?" },
        { id: "task-2", type: "short-answer", prompt: "Welche Wortart ist schön?" }
      ]
    }
  ],
  solutions: { "task-1": "Verb", "task-2": "Adjektiv" }
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

export async function checkStationLearning() {
  const requests: Array<Parameters<Parameters<typeof generateStationLearning>[0]["generate"]>[0]> = []
  const progress: string[] = []
  // A valid-looking but truncated first station must be retried, never accepted.
  const document = await generateStationLearning({
    ...defaults,
    onProgress: value => progress.push(value),
    generate: async request => {
      requests.push(request)
      return { text: JSON.stringify(requests.length === 1 ? plan : part), truncated: requests.length === 2 }
    }
  })
  assert.equal(requests.length, 7) // One plan, five stations, one station retry.
  assert.ok(requests.every(r => r.maxTokens === 2048))
  assert.ok(requests.slice(1).every(r => r.messages[1].content.includes(JSON.stringify(plan))))
  assert.ok(requests[2].messages[1].content.includes("Lernziel 1"))
  assert.ok(!requests[3].messages[1].content.includes("Welche Wortart ist laufen?"))
  assert.equal(Object.keys(document.solutions).length, 10)
  assert.equal(document.solutions["station-1-task-1"], "Verb")
  assert.equal(document.solutions["station-5-task-1"], "Verb")
  assert.deepEqual(parseGeneratedDocument(JSON.stringify(document), metadata).errors, [])
  const markdown = generatedDocumentToMarkdown(document)
  assert.match(markdown, /Laufzettel/)
  assert.match(markdown, /Station 5/)
  assert.match(markdown, /Reflexion/)
  assert.ok(progress.some(p => p.includes("Station 2") && p.includes("Welche Wortart ist laufen?")))

  let calls = 0
  let lastProgress = ""
  await assert.rejects(
    generateStationLearning({
      ...defaults,
      onProgress: p => {
        lastProgress = p
      },
      generate: async () => {
        calls++
        return { text: JSON.stringify(calls === 1 ? plan : part), truncated: calls >= 3 }
      }
    }),
    /Station 2.*Ausgabelimit/
  )
  assert.equal(calls, 4)
  assert.match(lastProgress, /Welche Wortart ist laufen\?/)

  const controller = new AbortController()
  calls = 0
  await assert.rejects(
    generateStationLearning({
      ...defaults,
      signal: controller.signal,
      generate: async () => {
        calls++
        controller.abort()
        return { text: JSON.stringify(plan), truncated: false }
      }
    }),
    { name: "AbortError" }
  )
  assert.equal(calls, 1)

  calls = 0
  await assert.rejects(
    generateStationLearning({
      ...defaults,
      generate: async () => {
        calls++
        return { text: JSON.stringify({ ...plan, stations: [] }), truncated: false }
      }
    }),
    /genau 5 Stationen/
  )
  assert.equal(calls, 2)

  // Reasoning can exhaust a cloud response budget without producing visible text.
  const originalFetch = globalThis.fetch
  try {
    globalThis.fetch = async (_input, init) => {
      const body = JSON.parse(String(init?.body))
      assert.equal(body.max_completion_tokens, 8192)
      return new Response(JSON.stringify({ choices: [{ message: { content: "" }, finish_reason: "length" }] }))
    }
    const response = await generateWithOpenRouter({
      token: "test",
      model: "test",
      temperature: 0,
      maxTokens: 8192,
      messages: []
    })
    assert.equal(response.truncated, true)
    assert.equal(response.text, "")
  } finally {
    globalThis.fetch = originalFetch
  }
  console.log("station-learning checks passed")
}
