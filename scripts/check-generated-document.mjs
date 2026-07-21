import assert from "node:assert/strict"
import { generatedDocumentToMarkdown, parseGeneratedDocument } from "../lib/generated-document.ts"
import {
  estimateEuroCentsPerPage,
  formatUsdAsEuro,
  isChinaAffiliatedOpenRouterModel,
  isFreeOpenRouterModel,
  isMuskAffiliatedOpenRouterModel,
  openRouterLimitPercent,
  rankOpenRouterModels
} from "../lib/openrouter.ts"

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

const free = { id: "example/free", name: "Free", pricing: { prompt: "0", completion: "0", request: "0" } }
const paid = { id: "example/paid", name: "Paid", pricing: { prompt: "0.000001", completion: "0.000002", request: "0" } }
assert.equal(isFreeOpenRouterModel(free), true)
assert.equal(isFreeOpenRouterModel(paid), false)
assert.equal(estimateEuroCentsPerPage(free), 0)
assert.ok(Math.abs(estimateEuroCentsPerPage(paid) - 0.23) < 1e-10)
assert.equal(openRouterLimitPercent({ limit: 10, limitRemaining: 2.5, usage: 99 }), 75)
assert.equal(openRouterLimitPercent({ limit: 10, limitRemaining: 0, usage: 10 }), 100)
assert.equal(openRouterLimitPercent({ limit: null, limitRemaining: null, usage: 10 }), null)
assert.match(formatUsdAsEuro(10), /9,20/)
assert.equal(isChinaAffiliatedOpenRouterModel({ ...free, id: "future-brand/deepseek-v9" }), true)
assert.equal(isChinaAffiliatedOpenRouterModel({ ...free, id: "huawei/pangu-next" }), true)
assert.equal(isChinaAffiliatedOpenRouterModel({ ...free, id: "xiaomi/mimo-next" }), true)
assert.equal(isChinaAffiliatedOpenRouterModel({ ...free, id: "meituan/longcat-next" }), true)
assert.equal(isChinaAffiliatedOpenRouterModel({ ...free, id: "anthropic/claude" }), false)
assert.equal(isMuskAffiliatedOpenRouterModel({ ...free, id: "x-ai/future-model" }), true)
assert.equal(isMuskAffiliatedOpenRouterModel({ ...free, id: "someone/grok-next" }), true)
assert.equal(isMuskAffiliatedOpenRouterModel({ ...free, id: "openai/gpt" }), false)
const ranked = rankOpenRouterModels([
  { ...free, id: "unknown/api-best", name: "API best" },
  { ...free, id: "google/gemma-4", name: "Gemma 4" },
  { ...free, id: "google/gemma-2", name: "Gemma 2" },
  { ...free, id: "anthropic/claude-future-opus", name: "Claude Future Opus" },
  { ...free, id: "google/gemini-future-pro", name: "Gemini Future Pro" }
])
assert.deepEqual(
  ranked.map(model => model.id),
  ["anthropic/claude-future-opus", "google/gemini-future-pro", "google/gemma-4", "google/gemma-2", "unknown/api-best"]
)
console.log("openrouter checks passed")
