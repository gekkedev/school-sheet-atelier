export const DEFAULT_MODEL_ID = process.env.NEXT_PUBLIC_MODEL_ID ?? "Llama-3.2-3B-Instruct-q4f32_1-MLC"
export const FALLBACK_MODEL_ID = process.env.NEXT_PUBLIC_FALLBACK_MODEL_ID ?? "Llama-3.2-1B-Instruct-q4f16_1-MLC"

export const MODEL_CACHED_FLAG_KEY = "schoolsheet-atelier-model-cached"

export const DEFAULT_TEMPERATURE = 0.4
export const DEFAULT_MAX_TOKENS = 2048
