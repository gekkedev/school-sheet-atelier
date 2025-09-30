"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { InitProgressReport, MLCEngine } from "@mlc-ai/web-llm"
import {
  DEFAULT_MAX_TOKENS,
  DEFAULT_MODEL_ID,
  DEFAULT_TEMPERATURE,
  FALLBACK_MODEL_ID,
  MODEL_CACHED_FLAG_KEY
} from "@/lib/model"
import { detectWebGPU, type WebGPUSupport } from "@/lib/webgpu"

type Status = "checking" | "unsupported" | "idle" | "initializing" | "ready" | "error"

type ProgressState = {
  value: number
  message?: string
}

type GenerationMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

type GenerateOptions = {
  messages: GenerationMessage[]
  temperature?: number
  maxTokens?: number
}

type GenerateResult = {
  text: string
  raw: unknown
}

function extractText(result: unknown): string {
  if (!result || typeof result !== "object") {
    return ""
  }

  const anyResult = result as {
    choices?: Array<{
      message?: {
        content?: unknown
      }
    }>
  }

  const firstChoice = anyResult.choices?.[0]
  if (!firstChoice?.message) {
    return ""
  }

  const { content } = firstChoice.message
  if (typeof content === "string") {
    return content
  }

  if (Array.isArray(content)) {
    return content
      .map(part => {
        if (!part) {
          return ""
        }
        if (typeof part === "string") {
          return part
        }
        if (typeof part === "object" && "text" in part && typeof part.text === "string") {
          return part.text
        }
        return ""
      })
      .join("")
  }

  return ""
}

export function useWebLLM(modelId: string = DEFAULT_MODEL_ID) {
  const [status, setStatus] = useState<Status>("checking")
  const [progress, setProgress] = useState<ProgressState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCached, setIsCached] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false
    }
    return window.localStorage.getItem(MODEL_CACHED_FLAG_KEY) === "true"
  })
  const [webgpu, setWebgpu] = useState<WebGPUSupport>(() => detectWebGPU())
  const [isGenerating, setIsGenerating] = useState(false)

  const engineRef = useRef<MLCEngine | null>(null)
  const initPromiseRef = useRef<Promise<MLCEngine> | null>(null)

  useEffect(() => {
    setWebgpu(detectWebGPU())
  }, [])

  useEffect(() => {
    if (!webgpu.supported) {
      setStatus("unsupported")
      return
    }

    if (engineRef.current) {
      setStatus("ready")
      return
    }

    setStatus("idle")
  }, [webgpu])

  const markCached = useCallback(() => {
    if (typeof window === "undefined") {
      return
    }
    window.localStorage.setItem(MODEL_CACHED_FLAG_KEY, "true")
    setIsCached(true)
  }, [])

  const handleProgress = useCallback(
    (report: InitProgressReport | null | undefined) => {
      if (!report) {
        return
      }
      const value = typeof report.progress === "number" ? report.progress : 0
      setProgress({ value, message: report.text })
      if (value >= 1) {
        markCached()
        setTimeout(() => setProgress(null), 1200)
      }
    },
    [markCached]
  )

  const createEngine = useCallback(
    async (requestedModelId: string) => {
      const webLLM = await import("@mlc-ai/web-llm")
      return webLLM.CreateMLCEngine(requestedModelId, {
        initProgressCallback: handleProgress
      }) as Promise<MLCEngine>
    },
    [handleProgress]
  )

  const initialize = useCallback(async () => {
    if (!webgpu.supported) {
      const reason = webgpu.reason ?? "WebGPU wird von diesem Browser nicht unterstützt."
      setStatus("unsupported")
      setError(reason)
      throw new Error(reason)
    }

    if (engineRef.current) {
      setStatus("ready")
      return engineRef.current
    }

    if (initPromiseRef.current) {
      return initPromiseRef.current
    }

    setStatus("initializing")
    setError(null)
    setProgress({ value: 0, message: "Lade Modellartefakte..." })

    const initPromise: Promise<MLCEngine> = (async () => {
      try {
        const engine = await createEngine(modelId)
        engineRef.current = engine
        setStatus("ready")
        return engine
      } catch (primaryError) {
        console.warn("Initial model failed, trying fallback", primaryError)
        if (modelId !== FALLBACK_MODEL_ID) {
          try {
            const fallbackEngine = await createEngine(FALLBACK_MODEL_ID)
            engineRef.current = fallbackEngine
            setStatus("ready")
            return fallbackEngine
          } catch (fallbackError) {
            setStatus("error")
            const message =
              fallbackError instanceof Error
                ? fallbackError.message
                : typeof fallbackError === "string"
                  ? fallbackError
                  : "Unbekannter Fehler beim Laden des Fallback-Modells."
            setError(message)
            throw fallbackError
          }
        }

        setStatus("error")
        const message =
          primaryError instanceof Error
            ? primaryError.message
            : typeof primaryError === "string"
              ? primaryError
              : "Unbekannter Fehler beim Laden des Modells."
        setError(message)
        throw primaryError
      } finally {
        initPromiseRef.current = null
      }
    })()

    initPromiseRef.current = initPromise
    return initPromise
  }, [createEngine, modelId, webgpu])

  const generate = useCallback(
    async ({ messages, temperature, maxTokens }: GenerateOptions): Promise<GenerateResult> => {
      const engine = await initialize()
      setIsGenerating(true)
      try {
        const result = await engine.chat.completions.create({
          messages: messages.map(message => ({
            role: message.role,
            content: message.content
          })),
          temperature: temperature ?? DEFAULT_TEMPERATURE,
          max_tokens: maxTokens ?? DEFAULT_MAX_TOKENS,
          stream: false
        } as unknown)

        return {
          text: extractText(result),
          raw: result
        }
      } finally {
        setIsGenerating(false)
      }
    },
    [initialize]
  )

  return {
    status,
    progress,
    error,
    isCached,
    isGenerating,
    webgpu,
    engine: engineRef.current,
    initialize,
    generate
  }
}
