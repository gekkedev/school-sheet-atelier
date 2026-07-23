export const OPENROUTER_TOKEN_KEY = "schoolsheet-atelier-openrouter-token"
export const AI_PROVIDER_KEY = "schoolsheet-atelier-ai-provider"
export const OPENROUTER_MODEL_KEY = "schoolsheet-atelier-openrouter-model"
export const USD_TO_EUR = 0.92

export type OpenRouterModel = {
  id: string
  name: string
  pricing: { prompt: string; completion: string; request?: string }
  architecture?: {
    input_modalities?: string[]
    output_modalities?: string[]
  }
}

export type OpenRouterKeyInfo = {
  limit: number | null
  limitRemaining: number | null
  usage: number
}

export function openRouterLimitPercent(info: OpenRouterKeyInfo): number | null {
  if (info.limit === null) return null
  if (info.limit <= 0) return 100
  const spent = info.limitRemaining === null ? info.usage : info.limit - info.limitRemaining
  return Math.min(100, Math.max(0, (spent / info.limit) * 100))
}

export function isFreeOpenRouterModel(model: OpenRouterModel): boolean {
  return [model.pricing.prompt, model.pricing.completion, model.pricing.request ?? "0"].every(
    value => Number(value) === 0
  )
}

export function isTextOnlyOpenRouterModel(model: OpenRouterModel): boolean {
  const input = model.architecture?.input_modalities ?? []
  const output = model.architecture?.output_modalities ?? []
  return input.includes("text") && output.length === 1 && output[0] === "text"
}

function modelIdentity(model: OpenRouterModel): string {
  return `${model.id} ${model.name}`.toLowerCase()
}

// TODO: Update every 6 months. Last updated: 2026-07-21.
// Ordered for strong German instructional writing, structured worksheets, and nuanced humanities content.
const SCHOOL_SHEET_MODEL_PRIORITY = [
  /claude[^\n]*opus/,
  /gemini[^\n]*pro/,
  /openai\/gpt/,
  /claude[^\n]*sonnet/,
  /gemini[^\n]*flash/,
  /mistral[^\n]*large/,
  /mistral[^\n]*medium/,
  /google\/gemma/,
  /cohere\/command/,
  /claude[^\n]*haiku/
]

export function rankOpenRouterModels(models: OpenRouterModel[]): OpenRouterModel[] {
  return models
    .map((model, apiRank) => ({
      model,
      apiRank,
      priority: SCHOOL_SHEET_MODEL_PRIORITY.findIndex(pattern => pattern.test(modelIdentity(model)))
    }))
    .sort((a, b) => {
      const aPriority = a.priority === -1 ? SCHOOL_SHEET_MODEL_PRIORITY.length : a.priority
      const bPriority = b.priority === -1 ? SCHOOL_SHEET_MODEL_PRIORITY.length : b.priority
      return aPriority - bPriority || a.apiRank - b.apiRank
    })
    .map(({ model }) => model)
}

export function isChinaAffiliatedOpenRouterModel(model: OpenRouterModel): boolean {
  const identity = modelIdentity(model)
  return [
    "deepseek",
    "qwen",
    "alibaba",
    "tongyi",
    "huawei",
    "pangu",
    "baichuan",
    "minimax",
    "moonshot",
    "kimi",
    "zhipu",
    "chatglm",
    "glm-",
    "tencent",
    "hunyuan",
    "bytedance",
    "doubao",
    "baidu",
    "ernie",
    "stepfun",
    "01-ai",
    "xiaomi",
    "meituan"
  ].some(brand => identity.includes(brand))
}

export function isMuskAffiliatedOpenRouterModel(model: OpenRouterModel): boolean {
  const identity = modelIdentity(model)
  return identity.includes("grok") || /(^|[\s/\-_:])x-?ai([\s/\-_:]|$)/.test(identity)
}

export function estimateEuroCentsPerPage(model: OpenRouterModel): number {
  // ponytail: a page estimate is inherently approximate; replace these constants only if measured documents justify it.
  const estimatedUsd =
    Number(model.pricing.prompt) * 500 + Number(model.pricing.completion) * 1000 + Number(model.pricing.request ?? 0)
  return estimatedUsd * USD_TO_EUR * 100
}

export function formatEuroCents(value: number): string {
  return `${value.toLocaleString("de-DE", { minimumFractionDigits: value > 0 && value < 0.01 ? 3 : 2, maximumFractionDigits: 3 })} ct`
}

export function formatUsdAsEuro(value: number): string {
  return (value * USD_TO_EUR).toLocaleString("de-DE", { style: "currency", currency: "EUR" })
}

export async function fetchOpenRouterModels(token: string): Promise<OpenRouterModel[]> {
  const response = await fetch(
    "https://openrouter.ai/api/v1/models?output_modalities=text&sort=intelligence-high-to-low",
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  if (!response.ok) throw new Error(`OpenRouter-Modellliste konnte nicht geladen werden (${response.status}).`)
  const body = (await response.json()) as { data?: OpenRouterModel[] }
  return rankOpenRouterModels(
    (body.data ?? []).filter(model => model.id && model.name && model.pricing && isTextOnlyOpenRouterModel(model))
  )
}

export async function fetchOpenRouterKeyInfo(token: string): Promise<OpenRouterKeyInfo> {
  const response = await fetch("https://openrouter.ai/api/v1/key", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  })
  if (!response.ok) throw new Error(`OpenRouter-Ausgabenlimit konnte nicht geladen werden (${response.status}).`)
  const body = (await response.json()) as {
    data?: { limit?: number | null; limit_remaining?: number | null; usage?: number }
  }
  return {
    limit: body.data?.limit ?? null,
    limitRemaining: body.data?.limit_remaining ?? null,
    usage: body.data?.usage ?? 0
  }
}

export async function generateWithOpenRouter(options: {
  token: string
  model: string
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
  temperature: number
}): Promise<{ text: string; costEuroCents: number; model: string }> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.token}`,
      "Content-Type": "application/json",
      "X-OpenRouter-Title": "SchoolSheet-Atelier"
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature,
      max_completion_tokens: 2048
    })
  })
  const body = (await response.json()) as {
    error?: { message?: string }
    model?: string
    choices?: Array<{ message?: { content?: string } }>
    usage?: { cost?: number }
  }
  if (!response.ok) throw new Error(body.error?.message ?? `OpenRouter-Anfrage fehlgeschlagen (${response.status}).`)
  const text = body.choices?.[0]?.message?.content ?? ""
  if (!text) throw new Error("OpenRouter hat keine Ausgabe geliefert.")
  return {
    text,
    model: body.model ?? options.model,
    costEuroCents: (body.usage?.cost ?? 0) * USD_TO_EUR * 100
  }
}
