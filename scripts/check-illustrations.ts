import screenshotPricing from "./fixtures/image-pricing-api.json"
import imagePriceSamples from "../data/image-price-samples.json"
import assert from "node:assert/strict"
import { inflateRawSync } from "node:zlib"
import { Packer } from "docx"
import { createElement } from "react"
import { renderToBuffer } from "@react-pdf/renderer"
import { createDOCXDocument } from "../lib/export"
import { PDFDocumentContent } from "../components/pdf-preview"
import {
  DEFAULT_ILLUSTRATIONS,
  fetchIllustrationModels,
  estimateImageUsd,
  recordImageCost,
  generateIllustration,
  fillIllustrations,
  illustrationInstruction,
  imageEuroCents
} from "../lib/illustrations"
import { isFreeOpenRouterModel, formatEuroCents, generateWithOpenRouter, USD_TO_EUR } from "../lib/openrouter"

function unzip(buffer: Buffer) {
  const files = new Map<string, Buffer>()
  let offset = buffer.readUInt32LE(buffer.length - 6)
  while (buffer.readUInt32LE(offset) === 0x02014b50) {
    const size = buffer.readUInt32LE(offset + 20)
    const nameLength = buffer.readUInt16LE(offset + 28)
    const local = buffer.readUInt32LE(offset + 42)
    const start = local + 30 + buffer.readUInt16LE(local + 26) + buffer.readUInt16LE(local + 28)
    const bytes = buffer.subarray(start, start + size)
    files.set(
      buffer.toString("utf8", offset + 46, offset + 46 + nameLength),
      buffer.readUInt16LE(offset + 10) === 8 ? inflateRawSync(bytes) : bytes
    )
    offset += 46 + nameLength + buffer.readUInt16LE(offset + 30) + buffer.readUInt16LE(offset + 32)
  }
  return files
}

async function check() {
  assert.match(illustrationInstruction(), /Keine Bilder/)
  assert.match(
    illustrationInstruction({ ...DEFAULT_ILLUSTRATIONS, enabled: true, style: "stickman" }),
    /Strichmännchen/
  )
  const image =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC"
  let calls = 0
  const short = await fillIllustrations(
    "Text\n[[ILLUSTRATION: Apfel]]\n[[ILLUSTRATION: Birne]]\n[[ILLUSTRATION: Banane]]",
    async () => {
      calls++
      return image
    }
  )
  assert.equal(calls, 2)
  assert.doesNotMatch(short, /ILLUSTRATION/)
  assert.equal((short.match(/!\[/g) ?? []).length, 2)
  await fillIllustrations("Ohne Bild", async () => {
    throw new Error("must not generate")
  })
  calls = 0
  await fillIllustrations(
    "x".repeat(3000) + "\n[[ILLUSTRATION: A]]\n[[ILLUSTRATION: B]]\n[[ILLUSTRATION: C]]",
    async () => {
      calls++
      return image
    }
  )
  assert.equal(calls, 3, "longer documents may contain more than two images")
  let partial = ""
  await assert.rejects(
    fillIllustrations(
      "[[ILLUSTRATION: A]]\n[[ILLUSTRATION: B]]",
      async description => {
        if (description === "B") throw new Error("offline")
        return image
      },
      value => {
        partial = value
      }
    ),
    /offline/
  )
  assert.match(partial, /data:image/)

  const approximately = (actual: number, expected: number) =>
    assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} != ${expected}`)
  approximately(
    estimateImageUsd("google/gemini-3.1-flash-image", [
      { billable: "output_image", unit: "token", cost_usd: "0.00006" },
      { billable: "input_text", unit: "token", cost_usd: 0.0000005 },
      { billable: "input_image", unit: "token", cost_usd: 99 }
    ]),
    1120 * 0.00006 + 500 * 0.0000005
  )
  approximately(
    estimateImageUsd("openai/gpt-image-1-mini", [{ billable: "output_image", unit: "token", cost_usd: 0.000008 }]),
    1056 * 0.000008
  )
  approximately(
    estimateImageUsd("mp-model", [{ billable: "output_image", unit: "megapixel", cost_usd: 0.02 }]),
    0.02 * 1.048576
  )
  approximately(
    estimateImageUsd("tiered", [
      { billable: "output_image", unit: "image", cost_usd: 0.01, variant: "1k" },
      { billable: "output_image", unit: "image", cost_usd: 0.04, variant: "4k" },
      { billable: "input_image", unit: "image", cost_usd: 1 }
    ]),
    0.01
  )
  assert.ok(
    Number.isNaN(
      estimateImageUsd("unknown-token-model", [{ billable: "output_image", unit: "token", cost_usd: 0.00001 }])
    )
  )
  assert.ok(Number.isNaN(estimateImageUsd("unpriced", [])))
  assert.ok(Number.isNaN(estimateImageUsd("invalid", [{ billable: "output_image", unit: "image", cost_usd: "-1" }])))

  const originalFetch = globalThis.fetch
  let activeEndpoints = 0
  let maxActiveEndpoints = 0
  const endpointStarts: number[] = []
  try {
    globalThis.fetch = async input => {
      const url = String(input)
      if (url.includes("/models?output_modalities=image"))
        return Response.json({
          data: [
            {
              id: "google/gemini-3.1-flash-image",
              pricing: { image_output: "0.00006", prompt: "0.0000005", completion: "0.000003" }
            }
          ]
        })
      if (url.endsWith("/images/models"))
        return Response.json({
          data: [
            { id: "cheap", name: "Cheap" },
            { id: "unknown", name: "Unknown" },
            { id: "free", name: "Free" },
            { id: "unavailable", name: "Unavailable" },
            { id: "google/gemini-3.1-flash-image", name: "Gemini" }
          ]
        })
      activeEndpoints++
      maxActiveEndpoints = Math.max(maxActiveEndpoints, activeEndpoints)
      endpointStarts.push(performance.now())
      await new Promise(resolve => setTimeout(resolve, 5))
      activeEndpoints--
      if (url.includes("unavailable") || url.includes("google/gemini-3.1-flash-image"))
        return new Response(null, { status: 503 })
      return Response.json({
        endpoints: [
          {
            pricing: url.includes("unknown")
              ? []
              : [{ billable: "output_image", unit: "image", cost_usd: url.includes("free") ? 0 : 0.01 }]
          }
        ]
      })
    }
    const progress: import("../lib/openrouter").OpenRouterModel[][] = []
    const models = await fetchIllustrationModels("test", models => progress.push(models))
    assert.equal(progress[0].length, 5, "models are published before pricing finishes")
    assert.ok(progress[0].every(model => model.pricing.image === "loading"))
    assert.ok(progress[0].every(model => Number.isNaN(imageEuroCents(model))))
    assert.equal(formatEuroCents(1 + imageEuroCents(progress[0][0])), "??? ct", "pending prices keep totals unknown")
    assert.equal(progress[1].filter(model => model.pricing.image === "loading").length, 4)
    assert.ok(progress.at(-1)!.every(model => model.pricing.image !== "loading"))
    assert.equal(maxActiveEndpoints, 1, "pricing requests run one at a time")
    assert.equal(endpointStarts.length, 5)
    for (let index = 1; index < endpointStarts.length; index++)
      assert.ok(endpointStarts[index] - endpointStarts[index - 1] >= 450, "pricing requests are spaced apart")
    assert.deepEqual(
      models.map(model => model.id),
      ["free", "cheap", "google/gemini-3.1-flash-image", "unknown", "unavailable"]
    )
    assert.equal(isFreeOpenRouterModel(models[0]), true)
    assert.equal(isFreeOpenRouterModel(models[1]), false)
    assert.ok(Math.abs(imageEuroCents(models[1]) - 0.01 * USD_TO_EUR * 100) < 1e-10)
    approximately(imageEuroCents(models[2]), (1120 * 0.00006 + 500 * 0.0000005 + 200 * 0.000003) * USD_TO_EUR * 100)
    for (const model of models.slice(3)) {
      assert.equal(isFreeOpenRouterModel(model), false)
      assert.equal(formatEuroCents(imageEuroCents(model)), "??? ct")
      assert.equal(formatEuroCents(1 + imageEuroCents(model)), "??? ct")
    }
  } finally {
    globalThis.fetch = originalFetch
  }

  // Replay 9 actual nine API records, including empty pricing arrays.
  for (const metadataUnavailable of [false, true]) {
    try {
      globalThis.fetch = async input => {
        const url = String(input)
        if (url.endsWith("/images/models")) return Response.json({ data: screenshotPricing.models })
        if (metadataUnavailable) return new Response(null, { status: 503 })
        if (url.includes("/models?output_modalities=image")) return Response.json({ data: screenshotPricing.models })
        const model = screenshotPricing.models.find(model => url.endsWith(`/images/models/${model.id}/endpoints`))
        return Response.json({ endpoints: model?.endpoints ?? [] })
      }
      const models = await fetchIllustrationModels("test")
      assert.equal(models.length, 9)
      for (const model of models)
        assert.ok(
          Number.isFinite(imageEuroCents(model)) && imageEuroCents(model) > 0,
          `${model.id} must have an estimate (metadata unavailable: ${metadataUnavailable})`
        )
      const byId = new Map(models.map(model => [model.id, model]))
      approximately(imageEuroCents(byId.get("sourceful/riverflow-v2-pro")!), 0.15 * USD_TO_EUR * 100)
      approximately(imageEuroCents(byId.get("sourceful/riverflow-v2-fast")!), 0.02 * USD_TO_EUR * 100)
      approximately(imageEuroCents(byId.get("krea/krea-2-large")!), 0.06 * USD_TO_EUR * 100)
      approximately(imageEuroCents(byId.get("krea/krea-2-medium")!), 0.03 * USD_TO_EUR * 100)
      approximately(imageEuroCents(byId.get("krea/krea-2-medium-turbo")!), 0.015 * USD_TO_EUR * 100)
      approximately(imageEuroCents(byId.get("meta/muse-image")!), 0.01 * USD_TO_EUR * 100)
      approximately(
        imageEuroCents(byId.get("openai/gpt-5.4-image-2")!),
        (1756 * 0.00003 + 500 * 0.000008 + 200 * 0.000015) * USD_TO_EUR * 100
      )
      assert.match(byId.get("microsoft/mai-image-2.5-pro")!.imagePriceNote!, /nicht gemessen/)
      assert.equal(byId.get("krea/k3-edit")!.imageInputRequired, true)
    } finally {
      globalThis.fetch = originalFetch
    }
  }

  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage")
  try {
    const storage = new Map<string, string>()
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value)
      }
    })
    const originalNow = Date.now
    let now = originalNow()
    let endpointCalls = 0
    let failEndpoints = false
    try {
      Date.now = () => now
      globalThis.fetch = async input => {
        const url = String(input)
        if (url.endsWith("/images/models")) return Response.json({ data: [{ id: "cache-check", name: "Cache check" }] })
        if (!url.endsWith("/endpoints")) return Response.json({ data: [] })
        endpointCalls++
        if (failEndpoints) return new Response(null, { status: 503 })
        return Response.json({
          endpoints: [{ pricing: [{ billable: "output_image", unit: "image", cost_usd: 0.02 }] }]
        })
      }
      const [first, concurrent] = await Promise.all([fetchIllustrationModels("test"), fetchIllustrationModels("test")])
      assert.equal(endpointCalls, 1, "overlapping pricing requests are shared")
      assert.deepEqual(first, concurrent)
      assert.deepEqual(await fetchIllustrationModels("test"), first)
      assert.equal(endpointCalls, 1, "persisted pricing is reused")
      assert.ok(
        [...storage.values()].every(value => !value.includes("Bearer")),
        "cache contains no credentials"
      )
      now += 86400_001
      failEndpoints = true
      await fetchIllustrationModels("test")
      assert.equal(endpointCalls, 2, "expired pricing is refreshed")
      failEndpoints = false
      await fetchIllustrationModels("test")
      assert.equal(endpointCalls, 3, "failed pricing requests are retried")
      storage.set("schoolsheet-atelier-image-endpoints-v1:cache-check", "broken json")
      await fetchIllustrationModels("test")
      assert.equal(endpointCalls, 4, "corrupt cache falls back to the API")
    } finally {
      Date.now = originalNow
      storage.clear()
    }
    globalThis.fetch = async input =>
      String(input).endsWith("/images/models")
        ? Response.json({
            data: [
              { id: "google/gemini-3-pro-image-preview", name: "Gemini preview" },
              { id: "openai/gpt-image-2.5-sunburst", name: "Sunburst" },
              { id: "microsoft/unmeasured", name: "Microsoft unmeasured" },
              { id: "microsoft/mai-image-2.6", name: "Microsoft measured" }
            ]
          })
        : new Response(null, { status: 503 })
    const models = await fetchIllustrationModels("test")
    assert.ok(
      Number.isFinite(imageEuroCents(models.find(model => model.id.startsWith("google/"))!)),
      "dated reference pricing covers failed metadata and known preview aliases"
    )
    assert.ok(
      Number.isFinite(imageEuroCents(models.find(model => model.id.startsWith("openai/"))!)),
      "GPT Image 2.5 has a documented reference token count"
    )
    const measured = models.find(model => model.id === "microsoft/mai-image-2.6")!
    approximately(
      imageEuroCents(measured),
      imagePriceSamples.find(sample => sample.model === measured.id)!.usage.cost * USD_TO_EUR * 100
    )
    const microsoft = models.find(model => model.id === "microsoft/unmeasured")!
    assert.equal(formatEuroCents(imageEuroCents(microsoft)), "??? ct")
    recordImageCost(microsoft.id, 0.02)
    approximately(imageEuroCents(microsoft), 0.02 * USD_TO_EUR * 100)
    recordImageCost(microsoft.id, NaN)
    approximately(imageEuroCents(microsoft), 0.02 * USD_TO_EUR * 100)
  } finally {
    globalThis.fetch = originalFetch
    if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage)
    else Reflect.deleteProperty(globalThis, "localStorage")
  }
  approximately(
    estimateImageUsd("openai/gpt-image-2.5-flare", [{ billable: "output_image", unit: "token", cost_usd: 0.00003 }]),
    439 * 0.00003
  )
  approximately(
    estimateImageUsd("openai/gpt-image-2", [{ billable: "output_image", unit: "token", cost_usd: 0.00003 }]),
    1756 * 0.00003
  )

  for (const sample of imagePriceSamples) {
    assert.equal(sample.width, 1024)
    assert.equal(sample.height, 1024)
    assert.equal(sample.parameters.n, 1)
    approximately(
      estimateImageUsd(sample.model, [{ billable: "output_image", unit: "token", cost_usd: 1 }]),
      sample.usage.completion_tokens_details.image_tokens
    )
  }

  const originalBitmap = Object.getOwnPropertyDescriptor(globalThis, "createImageBitmap")
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document")
  try {
    Object.defineProperty(globalThis, "createImageBitmap", {
      configurable: true,
      value: async () => ({ width: 1, height: 1, close() {} })
    })
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        createElement: () => ({ getContext: () => ({ fillRect() {}, drawImage() {} }), toDataURL: () => image })
      }
    })
    globalThis.fetch = async (input, init) => {
      if (String(input).startsWith("data:")) return originalFetch(input, init)
      const request = JSON.parse(String(init?.body))
      if (String(input).endsWith("/chat/completions"))
        return Response.json({ choices: [{ message: { content: "Text" } }], usage: { cost: 0.005 } })
      assert.equal(request.n, 1)
      return Response.json({
        data: [{ b64_json: image.split(",")[1], media_type: "image/png" }],
        usage: { cost: 0.02 }
      })
    }
    const text = await generateWithOpenRouter({ token: "test", model: "text", messages: [], temperature: 0 })
    let total = text.costEuroCents
    let imageCharges = 0
    for (let index = 0; index < 2; index++) {
      await generateIllustration({
        token: "test",
        model: "unknown-price",
        prompt: "Apfel",
        style: "Umrisszeichnung",
        signal: new AbortController().signal,
        onCost: cost => {
          total += cost
          imageCharges++
        }
      })
    }
    assert.equal(imageCharges, 2, "each separate image request must contribute once")
    assert.ok(
      Math.abs(total - (0.005 + 2 * 0.02) * USD_TO_EUR * 100) < 1e-10,
      "USD text + image usage must accumulate in euro-cents"
    )
  } finally {
    globalThis.fetch = originalFetch
    if (originalBitmap) Object.defineProperty(globalThis, "createImageBitmap", originalBitmap)
    else Reflect.deleteProperty(globalThis, "createImageBitmap")
    if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument)
    else Reflect.deleteProperty(globalThis, "document")
  }

  const content = `# Test\n\nVorher\n\n![Apfel](${image})\n\nMitte\n\n![Birne](${image})\n\n![Banane](${image})\n\nNachher`
  const files = unzip(await Packer.toBuffer(createDOCXDocument(content)))
  const xml = files.get("word/document.xml")!.toString()
  assert.equal((xml.match(/<wp:inline[ >]/g) ?? []).length, 3, "pictures must be editable inline Word objects")
  assert.equal((xml.match(/<w:pageBreakBefore/g) ?? []).length, 1, "third image must start a new page")
  assert.ok([...files.keys()].some(name => name.startsWith("word/media/")))
  assert.match(files.get("word/_rels/document.xml.rels")!.toString(), /relationships\/image/)
  assert.ok(xml.indexOf("Vorher") < xml.indexOf("<wp:inline"))
  assert.ok(xml.lastIndexOf("Nachher") > xml.lastIndexOf("<wp:inline"))
  const pdf = await renderToBuffer(createElement(PDFDocumentContent, { content, title: "Test" }))
  const pdfText = pdf.toString("latin1")
  assert.match(pdfText, /\/Subtype \/Image/)
  assert.equal((pdfText.match(/\/Type \/Page\b/g) ?? []).length, 2)
  console.log("illustration checks passed: budgets, prices, partial failures, inline DOCX media and PDF pagination")
}
check().catch(error => {
  console.error(error)
  process.exitCode = 1
})
