import { type AppConfig, modelLibURLPrefix, modelVersion, prebuiltAppConfig } from "@mlc-ai/web-llm"

export const DEFAULT_MODEL_ID = "Llama-3.2-3B-Instruct-q4f32_1-MLC"
export const FALLBACK_MODEL_ID = "Llama-3.2-1B-Instruct-q4f16_1-MLC"
export const LLAMA_2_MODEL_ID = "Llama-2-7b-chat-hf-q4f32_1-MLC-1k"

export const APPROVED_MODELS = [DEFAULT_MODEL_ID, FALLBACK_MODEL_ID, LLAMA_2_MODEL_ID] as const

export const MODEL_LABELS: Record<string, string> = {
  [DEFAULT_MODEL_ID]: "Llama 3.2 3B Instruct (q4f32)",
  [FALLBACK_MODEL_ID]: "Llama 3.2 1B Instruct (q4f16)",
  [LLAMA_2_MODEL_ID]: "Llama 2 7B Chat (q4f32)"
}

type ModelMeta = {
  downloadSize: string
  sizeBytes: number
  contextWindow: number
}

export const MODEL_METADATA: Record<string, ModelMeta> = {
  [DEFAULT_MODEL_ID]: { downloadSize: "≈1.4 GB", sizeBytes: 1_400_000_000, contextWindow: 4096 },
  [FALLBACK_MODEL_ID]: { downloadSize: "≈0.7 GB", sizeBytes: 700_000_000, contextWindow: 4096 },
  [LLAMA_2_MODEL_ID]: { downloadSize: "≈4.0 GB", sizeBytes: 4_000_000_000, contextWindow: 4096 }
}

const MODEL_LIB_PREFIX = `${modelLibURLPrefix}${modelVersion}`

export const MODEL_APP_CONFIG: AppConfig = {
  useIndexedDBCache: true,
  model_list: prebuiltAppConfig.model_list
}

export const MODEL_CACHED_FLAG_KEY = "schoolsheet-atelier-model-cache"
export const MODEL_SELECTION_KEY = "schoolsheet-atelier-selected-model"

export const DEFAULT_TEMPERATURE = 0.4
export const DEFAULT_MAX_TOKENS = 2048
