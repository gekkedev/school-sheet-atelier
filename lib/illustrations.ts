import imagePriceSamples from "../data/image-price-samples.json"
import { USD_TO_EUR, type OpenRouterModel } from "./openrouter"
export const ILLUSTRATION_KEY = "schoolsheet-atelier-illustrations"
export const ILLUSTRATION_STYLES = {
  stickman: "Strichmännchen",
  outline: "Umrisszeichnung",
  pictogram: "Piktogramme",
  flat: "Clipart",
  pencil: "Bleistiftskizze"
} as const
export type IllustrationPreferences = { enabled: boolean; model: string; style: keyof typeof ILLUSTRATION_STYLES }
export const DEFAULT_ILLUSTRATIONS: IllustrationPreferences = { enabled: false, model: "", style: "outline" }
export function illustrationInstruction(preferences?: IllustrationPreferences) {
  return preferences?.enabled
    ? `Illustrationen sind gewünscht und sparsam einzusetzen. Plane mindestens eine fachlich passende Illustration im Dokument, die das Lernen unterstützt, etwa eine Szene, ein Beispiel oder eine Veranschaulichung. Bevorzugter Stil: ${ILLUSTRATION_STYLES[preferences.style]}. Plane im Mittel höchstens ein Bild pro Textseite (etwa 2500 Zeichen), absolut höchstens zwei pro Seite. Reserviere im Text Platz: Setze an der gewünschten Stelle in einem content- oder prompt-String eine eigene Zeile [[ILLUSTRATION: konkrete Beschreibung des Bildes]]. Gib mindestens einen solchen Platzhalter aus. Keine Bilder in Lösungen, keine bloße Dekoration. Aufgaben müssen auch ohne Bild verständlich bleiben. Einfache, kindgerechte Motive ohne Fotorealismus, ohne Schrift und ohne komplexe Details.`
    : "Keine Bilder, Bildplatzhalter oder Illustrationsmarkierungen ausgeben."
}
type ImagePriceLine = { billable: string; unit: string; cost_usd: number | string; variant?: string }

// 1024 × 1024 reference image. These quantities are model-specific, not a universal image-token constant.
// Checked 2026-10-25 against https://ai.google.dev/gemini-api/docs/pricing and
// https://developers.openai.com/api/docs/guides/image-generation (medium quality for the GPT Image 1 family).
const MEASURED_IMAGE_OUTPUT_TOKENS = Object.fromEntries(
  imagePriceSamples
    .filter(
      sample =>
        sample.width === 1024 &&
        sample.height === 1024 &&
        Number.isFinite(sample.usage.completion_tokens_details?.image_tokens) &&
        sample.usage.completion_tokens_details.image_tokens > 0
    )
    .map(sample => [sample.model, sample.usage.completion_tokens_details.image_tokens])
)
const IMAGE_OUTPUT_TOKENS: Record<string, number> = {
  ...MEASURED_IMAGE_OUTPUT_TOKENS,
  "google/gemini-2.5-flash-image": 1290,
  "google/gemini-2.5-flash-image-preview": 1290,
  "google/gemini-3.1-flash-image": 1120,
  "google/gemini-3.1-flash-lite-image": 1120,
  "google/gemini-3-pro-image": 1120,
  "google/gemini-nano-banana-2.1": 1120,
  // Official interactive calculator: 1024², medium, checked 2026-10-25.
  "openai/gpt-image-2": 1756,
  // This wrapper uses GPT Image 2: https://openrouter.ai/openai/gpt-5.4-image-2
  "openai/gpt-5.4-image-2": 1756,
  // Inferred 1K budget from three MAI family measurements; Pro itself has NOT been measured.
  "microsoft/mai-image-2.5-pro": 1024,
  "openai/gpt-image-2.5-sunburst": 439,
  "openai/gpt-image-2.5-flare": 439,
  "openai/gpt-image-1": 1056,
  "openai/gpt-image-1-mini": 1056,
  "openai/gpt-image-1.5": 1056,
  // OpenRouter documents these wrappers as using GPT Image 1 / GPT Image 1 Mini.
  // https://openrouter.ai/openai/gpt-5-image and https://openrouter.ai/openai/gpt-5-image-mini
  "openai/gpt-5-image": 1056,
  "openai/gpt-5-image-mini": 1056
}

// Published reference rates, checked 2026-10-25. Live OpenRouter rates take precedence.
// https://ai.google.dev/gemini-api/docs/pricing
// https://developers.openai.com/api/docs/guides/image-generation
const REFERENCE_IMAGE_PRICING: Record<
  string,
  { prompt: string; completion: string; image_output: string; request?: string }
> = {
  "google/gemini-2.5-flash-image": { prompt: "0.0000003", completion: "0.0000025", image_output: "0.00003" },
  "google/gemini-3.1-flash-image": { prompt: "0.0000005", completion: "0.000003", image_output: "0.00006" },
  "google/gemini-3.1-flash-lite-image": { prompt: "0.00000025", completion: "0.0000015", image_output: "0.00003" },
  "google/gemini-3-pro-image": { prompt: "0.000002", completion: "0.000012", image_output: "0.00012" },
  "google/gemini-nano-banana-2.1": { prompt: "0.0000015", completion: "0.0000075", image_output: "0.00003" },
  "openai/gpt-image-1": { prompt: "0.000005", completion: "0", image_output: "0.00004" },
  "openai/gpt-image-1-mini": { prompt: "0.000002", completion: "0", image_output: "0.000008" },
  "openai/gpt-image-1.5": { prompt: "0.000005", completion: "0", image_output: "0.000032" },
  "openai/gpt-5-image": { prompt: "0.00001", completion: "0.00001", image_output: "0.00004" },
  "openai/gpt-5-image-mini": { prompt: "0.0000025", completion: "0.000002", image_output: "0.000008" },
  "openai/gpt-5.4-image-2": { prompt: "0.000008", completion: "0.000015", image_output: "0.00003" },
  "microsoft/mai-image-2.5-pro": { prompt: "0.000005", completion: "0", image_output: "0.000108" },
  "openai/gpt-image-2": { prompt: "0.000005", completion: "0", image_output: "0.00003" },
  "openai/gpt-image-2.5-sunburst": { prompt: "0.000005", completion: "0", image_output: "0.00003" },
  "openai/gpt-image-2.5-flare": { prompt: "0.000005", completion: "0", image_output: "0.00003" }
}
// Public per-image prices checked 2026-10-25. Used only when live endpoint estimates are unavailable.
// https://www.krea.ai/app/api/pricing ; https://openrouter.ai/meta/muse-image
// https://openrouter.ai/sourceful/riverflow-v2-pro ; https://openrouter.ai/sourceful/riverflow-v2-fast
const REFERENCE_FLAT_IMAGE_USD: Record<string, number> = {
  "krea/krea-2-large": 0.06,
  "krea/krea-2-medium": 0.03,
  "krea/krea-2-medium-turbo": 0.015,
  "meta/muse-image": 0.01,
  "sourceful/riverflow-v2-pro": 0.15,
  "sourceful/riverflow-v2-fast": 0.02,
  // K3 is edit-only: 1K output $0.03 + one required input image $0.02; no optional high thinking.
  // https://openrouter.ai/krea/k3-edit
  "krea/k3-edit": 0.05
}

function referenceModelId(id: string) {
  return id.replace(/:[^/]+$/, "").replace(/-preview(?:-\d{2,4}-\d{2}(?:-\d{2})?)?$/, "")
}

const IMAGE_OBSERVATIONS_KEY = "schoolsheet-atelier-image-cost-observations"
export function recordImageCost(modelId: string, usd: number) {
  if (!Number.isFinite(usd) || usd < 0 || typeof localStorage === "undefined") return
  try {
    const observations = JSON.parse(localStorage.getItem(IMAGE_OBSERVATIONS_KEY) ?? "{}")
    observations[modelId] = { usd, at: Date.now() }
    localStorage.setItem(IMAGE_OBSERVATIONS_KEY, JSON.stringify(observations))
  } catch {
    /* A storage failure must not interrupt a paid generation. */
  }
}
function observedImageCost(modelId: string): number {
  if (typeof localStorage === "undefined") return NaN
  try {
    const observation = JSON.parse(localStorage.getItem(IMAGE_OBSERVATIONS_KEY) ?? "{}")?.[modelId]
    return observation &&
      typeof observation.usd === "number" &&
      Number.isFinite(observation.usd) &&
      observation.usd >= 0 &&
      typeof observation.at === "number" &&
      Date.now() - observation.at < 30 * 86400_000
      ? observation.usd
      : NaN
  } catch {
    return NaN
  }
}

export function estimateImageUsd(modelId: string, lines: ImagePriceLine[]): number {
  const output = lines.filter(line => line.billable === "output_image")
  if (!output.length) return NaN
  const groups = new Map<string, ImagePriceLine[]>()
  for (const line of lines) {
    // Worksheet generation sends no reference images and does not request searches or caching.
    if (["input_image", "input_reference", "input_font", "web_search", "cached_input"].includes(line.billable)) continue
    const key = `${line.billable}/${line.unit}`
    groups.set(key, [...(groups.get(key) ?? []), line])
  }
  let total = 0
  for (const variants of groups.values()) {
    const matching = variants.filter(line => !line.variant || /^(1k|1024x1024|medium)$/i.test(line.variant))
    const rates = (matching.length ? matching : variants).map(line => {
      if (line.cost_usd === "" || !["number", "string"].includes(typeof line.cost_usd)) return NaN
      const rate = Number(line.cost_usd)
      if (!Number.isFinite(rate) || rate < 0) return NaN
      if (rate === 0) return 0
      if (line.billable === "output_image") {
        if (line.unit === "image") return rate
        if (line.unit === "megapixel") return (rate * 1024 * 1024) / 1_000_000
        if (line.unit === "token")
          return rate * (IMAGE_OUTPUT_TOKENS[modelId] ?? IMAGE_OUTPUT_TOKENS[referenceModelId(modelId)] ?? NaN)
      }
      if (line.billable === "input_text" && line.unit === "token") return rate * 500
      if (line.billable === "output_text" && line.unit === "token") return rate * 200
      if (line.billable === "request" && line.unit === "request") return rate
      return NaN
    })
    total += Math.max(...rates)
  }
  return total
}

type ImageEndpoint = { pricing?: ImagePriceLine[] }
const endpointRequests = new Map<string, Promise<ImageEndpoint[]>>()
let endpointQueue: Promise<void> = Promise.resolve()
async function fetchImageEndpoints(modelId: string, token: string): Promise<ImageEndpoint[]> {
  // Cache public pricing metadata for a day; never persist credentials or failed requests.
  const key = `schoolsheet-atelier-image-endpoints-v1:${modelId}`
  try {
    const cached = JSON.parse(localStorage.getItem(key) ?? "null")
    if (cached && cached.expires > Date.now() && Array.isArray(cached.endpoints)) return cached.endpoints
  } catch {
    /* Missing, blocked or invalid storage falls back to the API. */
  }
  const pending = endpointRequests.get(modelId)
  if (pending) return pending
  const request = endpointQueue.then(async () => {
    const response = await fetch(`https://openrouter.ai/api/v1/images/models/${modelId}/endpoints`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(15_000)
    })
    if (!response.ok) throw new Error(`Image pricing unavailable (${response.status}).`)
    const details = await response.json()
    const endpoints: ImageEndpoint[] = details.endpoints ?? details.data?.endpoints ?? []
    if (!Array.isArray(endpoints)) throw new Error("Invalid image pricing response.")
    try {
      localStorage.setItem(key, JSON.stringify({ expires: Date.now() + 86400_000, endpoints }))
    } catch {
      /* Pricing remains usable when storage is unavailable. */
    }
    return endpoints
  })
  // One request at a time, with a half-second pause even after a failure.
  endpointQueue = request.then(
    () => new Promise(resolve => setTimeout(resolve, 500)),
    () => new Promise(resolve => setTimeout(resolve, 500))
  )
  endpointRequests.set(modelId, request)
  try {
    return await request
  } finally {
    endpointRequests.delete(modelId)
  }
}

export async function fetchIllustrationModels(
  token: string,
  onProgress?: (models: OpenRouterModel[]) => void
): Promise<OpenRouterModel[]> {
  const headers = { Authorization: `Bearer ${token}` }
  const response = await fetch("https://openrouter.ai/api/v1/images/models", {
    headers,
    signal: AbortSignal.timeout(15_000)
  })
  if (!response.ok) throw new Error(`Bildmodelle konnten nicht geladen werden (${response.status}).`)
  const body = await response.json()
  const models: OpenRouterModel[] = body.data ?? []
  const currentModels: OpenRouterModel[] = models.map(model => ({
    ...model,
    imageInputRequired: (model.supported_parameters?.input_references?.min ?? 0) > 0 || model.id === "krea/k3-edit",
    pricing: { prompt: "0", completion: "0", image: "loading" }
  }))
  onProgress?.([...currentModels])
  // The general catalog also exposes separate image-output token rates and text-input/output prices.
  // Never use its `image` field as an output price: that field can describe image INPUT.
  const catalog = (await fetch("https://openrouter.ai/api/v1/models?output_modalities=image", {
    headers,
    signal: AbortSignal.timeout(15_000)
  })
    .then(async response => (response.ok ? ((await response.json()).data ?? []) : []))
    .catch(() => [])) as Array<{
    id: string
    pricing?: { prompt?: string; completion?: string; request?: string; image_output?: string }
  }>
  const catalogById = new Map(catalog.map(model => [model.id, model]))
  const results = await Promise.all(
    models.map(async (model, index) => {
      let estimate = NaN
      const pricing = { ...REFERENCE_IMAGE_PRICING[referenceModelId(model.id)], ...catalogById.get(model.id)?.pricing }
      const textPrices: ImagePriceLine[] = [
        { billable: "input_text", unit: "token", cost_usd: pricing?.prompt ?? "0" },
        { billable: "output_text", unit: "token", cost_usd: pricing?.completion ?? "0" },
        { billable: "request", unit: "request", cost_usd: pricing?.request ?? "0" }
      ]
      try {
        const endpoints = await fetchImageEndpoints(model.id, token)
        const estimates = endpoints.map(endpoint => {
          const lines = endpoint.pricing ?? []
          return estimateImageUsd(model.id, [
            ...lines,
            ...textPrices.filter(extra => !lines.some(line => line.billable === extra.billable))
          ])
        })
        if (estimates.length && estimates.every(Number.isFinite)) estimate = Math.max(...estimates)
      } catch {
        /* Fall back to catalog pricing; retain unpriced models as well. */
      }
      if (!Number.isFinite(estimate)) {
        if (pricing?.image_output !== undefined) {
          estimate = estimateImageUsd(model.id, [
            { billable: "output_image", unit: "token", cost_usd: pricing.image_output },
            { billable: "input_text", unit: "token", cost_usd: pricing.prompt ?? "0" },
            { billable: "output_text", unit: "token", cost_usd: pricing.completion ?? "0" },
            { billable: "request", unit: "request", cost_usd: pricing.request ?? "0" }
          ])
        }
      }
      if (!Number.isFinite(estimate)) estimate = REFERENCE_FLAT_IMAGE_USD[referenceModelId(model.id)] ?? NaN
      if (!Number.isFinite(estimate)) estimate = observedImageCost(model.id)
      if (!Number.isFinite(estimate))
        estimate = imagePriceSamples.find(sample => sample.model === model.id)?.usage.cost ?? NaN
      const pricedModel: OpenRouterModel = {
        ...model,
        imageInputRequired: (model.supported_parameters?.input_references?.min ?? 0) > 0 || model.id === "krea/k3-edit",
        imagePriceNote:
          model.id === "microsoft/mai-image-2.5-pro"
            ? "Grobe Schätzung: 1024 Bildtokens aus drei MAI-Vergleichsmodellen; Pro selbst wurde nicht gemessen."
            : undefined,
        pricing: { prompt: "0", completion: "0", image: Number.isFinite(estimate) ? String(estimate) : "unknown" }
      }
      currentModels[index] = pricedModel
      onProgress?.([...currentModels])
      return pricedModel
    })
  )
  return results.sort((a, b) => {
    const aPrice = imageEuroCents(a),
      bPrice = imageEuroCents(b)
    return (Number.isFinite(aPrice) ? aPrice : Infinity) - (Number.isFinite(bPrice) ? bPrice : Infinity)
  })
}
export function imageEuroCents(model: OpenRouterModel) {
  if (model.pricing.image === "loading") return NaN
  const published = Number(model.pricing.image)
  return (Number.isFinite(published) ? published : observedImageCost(model.id)) * USD_TO_EUR * 100
}
export async function generateIllustration(options: {
  token: string
  model: string
  prompt: string
  style: string
  signal: AbortSignal
  onCost?: (costEuroCents: number) => void
}) {
  const response = await fetch("https://openrouter.ai/api/v1/images", {
    method: "POST",
    signal: options.signal,
    headers: { Authorization: `Bearer ${options.token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: options.model,
      n: 1,
      prompt: `Eine einfache, kindgerechte Illustration für ein Grundschul-Arbeitsblatt. Bevorzugter Stil: ${options.style}, sofern fachlich passend; sonst einfache schematische Umrisszeichnung. Beachte Stilhinweise der Bildbeschreibung. Weißer Hintergrund, klare Formen, keine Schrift, keine Fotos. ${options.prompt}`
    })
  })
  const body = await response.json()
  if (!response.ok || body.error)
    throw new Error(body.error?.message ?? `Bilderzeugung fehlgeschlagen (${response.status}).`)
  if (typeof body.usage?.cost === "number") {
    recordImageCost(options.model, body.usage.cost)
    options.onCost?.(body.usage.cost * USD_TO_EUR * 100)
  }
  const image = body.data?.[0]
  if (!image?.b64_json || !["image/png", "image/jpeg", "image/webp"].includes(image.media_type ?? "image/png"))
    throw new Error("Kein unterstütztes Bild erhalten.")
  const original = `data:${image.media_type ?? "image/png"};base64,${image.b64_json}`
  const bitmap = await createImageBitmap(await (await fetch(original)).blob())
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 384
  const context = canvas.getContext("2d")
  if (!context) {
    bitmap.close()
    throw new Error("Bild konnte nicht eingebettet werden.")
  }
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, 384, 384)
  const scale = Math.min(384 / bitmap.width, 384 / bitmap.height)
  context.drawImage(
    bitmap,
    (384 - bitmap.width * scale) / 2,
    (384 - bitmap.height * scale) / 2,
    bitmap.width * scale,
    bitmap.height * scale
  )
  bitmap.close()
  return {
    source: canvas.toDataURL("image/jpeg", 0.8),
    costEuroCents: typeof body.usage?.cost === "number" ? body.usage.cost * USD_TO_EUR * 100 : undefined
  }
}
export async function fillIllustrations(
  content: string,
  generate: (description: string) => Promise<string>,
  onProgress?: (content: string) => void
) {
  let output = "",
    offset = 0,
    count = 0
  const maxImages = 2 * Math.max(1, Math.ceil(content.replace(/\[\[ILLUSTRATION:[^\]]+\]\]/g, "").length / 2500))
  for (const match of content.matchAll(/\[\[ILLUSTRATION:\s*([^\]]+)\]\]/g)) {
    output += content.slice(offset, match.index)
    if (count++ < maxImages) {
      const description = match[1].trim()
      const source = await generate(description)
      output += `\n\n![${description.replace(/[\[\]\n\r]/g, " ")}](${source})\n\n`
    }
    offset = match.index! + match[0].length
    onProgress?.(output + content.slice(offset))
  }
  return output + content.slice(offset)
}
