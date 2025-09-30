import type { AppConfig } from "@mlc-ai/web-llm"

export const DEFAULT_MODEL_ID = "Llama-3.2-3B-Instruct-q4f32_1-MLC"
export const FALLBACK_MODEL_ID = "Llama-3.2-1B-Instruct-q4f16_1-MLC"
export const LOW_RESOURCE_MODEL_ID = "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC"

export const MODEL_ORDER = [DEFAULT_MODEL_ID, FALLBACK_MODEL_ID, LOW_RESOURCE_MODEL_ID] as const

export const MODEL_LABELS: Record<string, string> = {
  [DEFAULT_MODEL_ID]: "Llama 3.2 3B Instruct (q4f32)",
  [FALLBACK_MODEL_ID]: "Llama 3.2 1B Instruct (q4f16)",
  [LOW_RESOURCE_MODEL_ID]: "TinyLlama 1.1B Chat (q4f16)"
}

type ModelMeta = {
  downloadSize: string
  sizeBytes: number
  contextWindow: number
}

export const MODEL_METADATA: Record<string, ModelMeta> = {
  [DEFAULT_MODEL_ID]: { downloadSize: "≈1.4 GB", sizeBytes: 1_400_000_000, contextWindow: 4096 },
  [FALLBACK_MODEL_ID]: { downloadSize: "≈0.7 GB", sizeBytes: 700_000_000, contextWindow: 4096 },
  [LOW_RESOURCE_MODEL_ID]: { downloadSize: "≈0.55 GB", sizeBytes: 550_000_000, contextWindow: 2048 }
}

const MODEL_VERSION = "v0_2_48"
const MODEL_LIB_PREFIX = `https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/${MODEL_VERSION}`

export const MODEL_APP_CONFIG: AppConfig = {
  useIndexedDBCache: false,
  model_list: [
    {
      model: `https://huggingface.co/mlc-ai/${DEFAULT_MODEL_ID}`,
      model_id: DEFAULT_MODEL_ID,
      model_lib: `${MODEL_LIB_PREFIX}/Llama-3.2-3B-Instruct-q4f32_1-ctx4k_cs1k-webgpu.wasm`,
      required_features: ["shader-f16"],
      overrides: {
        context_window_size: 4096
      }
    },
    {
      model: `https://huggingface.co/mlc-ai/${FALLBACK_MODEL_ID}`,
      model_id: FALLBACK_MODEL_ID,
      model_lib: `${MODEL_LIB_PREFIX}/Llama-3.2-1B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm`,
      required_features: ["shader-f16"],
      low_resource_required: true,
      overrides: {
        context_window_size: 4096
      }
    },
    {
      model: `https://huggingface.co/mlc-ai/${LOW_RESOURCE_MODEL_ID}`,
      model_id: LOW_RESOURCE_MODEL_ID,
      model_lib: `${MODEL_LIB_PREFIX}/TinyLlama-1.1B-Chat-v1.0-q4f16_1-ctx2k_cs1k-webgpu.wasm`,
      required_features: ["shader-f16"],
      low_resource_required: true,
      overrides: {
        context_window_size: 2048
      }
    }
  ]
}

export const MODEL_CACHED_FLAG_KEY = "schoolsheet-atelier-model-cache"

export const DEFAULT_TEMPERATURE = 0.4
export const DEFAULT_MAX_TOKENS = 2048
