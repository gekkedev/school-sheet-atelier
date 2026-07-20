import assert from "node:assert/strict"
import { generatedDocumentToMarkdown, parseGeneratedDocument } from "../lib/generated-document.ts"

const raw = JSON.stringify({
  docType: "worksheet",
  title: "Zeitformen",
  grade: 3,
  subject: "Deutsch",
  sections: [{ kind: "tasks", items: [{ id: "task-1", type: "Lückentext", prompt: "Ergänze." }] }],
  solutions: { "task-1": "ging" }
})
const expected = { docType: "worksheet", grade: 3, subject: "Deutsch" }
const valid = parseGeneratedDocument(raw, expected)

assert.equal(valid.errors.length, 0)
assert.ok(valid.document)
assert.match(generatedDocumentToMarkdown(valid.document), /# Lösungen/)
assert.deepEqual(parseGeneratedDocument(raw.replace('"task-1":"ging"', '"other":"ging"'), expected).errors, [
  "solutions must contain exactly one entry for every task id."
])

console.log("generated-document checks passed")
