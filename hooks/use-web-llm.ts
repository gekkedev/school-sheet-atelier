"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { InitProgressReport, MLCEngine } from "@mlc-ai/web-llm"
import {
  DEFAULT_MAX_TOKENS,
  DEFAULT_MODEL_ID,
  DEFAULT_TEMPERATURE,
  FALLBACK_MODEL_ID,
  MODEL_APP_CONFIG,
  MODEL_CACHED_FLAG_KEY,
  MODEL_LABELS,
  MODEL_METADATA
} from "@/lib/model"
import { detectWebGPU, type WebGPUSupport } from "@/lib/webgpu"

type Status = "checking" | "unsupported" | "idle" | "initializing" | "ready" | "error"

type ProgressState = {
  value: number
  message?: string
  modelId?: string
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

function readCachedModels(defaultModelId: string): string[] {
  if (typeof window === "undefined") {
    return []
  }

  const raw = window.localStorage.getItem(MODEL_CACHED_FLAG_KEY)
  if (!raw) {
    return []
  }

  if (raw === "true") {
    return [defaultModelId]
  }

  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string")
    }
  } catch (error) {
    console.warn("Unable to parse cached model list", error)
  }

  return []
}

function buildAttemptQueue(preferredModelId: string): string[] {
  const queue: string[] = [preferredModelId]

  if (!queue.includes(DEFAULT_MODEL_ID)) {
    queue.push(DEFAULT_MODEL_ID)
  }
  if (!queue.includes(FALLBACK_MODEL_ID)) {
    queue.push(FALLBACK_MODEL_ID)
  }

  return Array.from(new Set(queue))
}

export function useWebLLM(defaultModelId: string = DEFAULT_MODEL_ID) {
  const [status, setStatus] = useState<Status>("checking")
  const [progress, setProgress] = useState<ProgressState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cachedModels, setCachedModels] = useState<string[]>(() => readCachedModels(defaultModelId))
  const [webgpu, setWebgpu] = useState<WebGPUSupport>(() => detectWebGPU())
  const [activeModelId, setActiveModelIdState] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const engineRef = useRef<MLCEngine | null>(null)
  const initPromiseRef = useRef<Promise<MLCEngine> | null>(null)
  const pendingModelIdRef = useRef<string | null>(null)
  const activeModelIdRef = useRef<string | null>(null)
  const lastRequestedModelIdRef = useRef<string>(defaultModelId)

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

  const markCached = useCallback((modelId: string) => {
    setCachedModels(prev => {
      if (prev.includes(modelId)) {
        return prev
      }
      const next = [...prev, modelId]
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(MODEL_CACHED_FLAG_KEY, JSON.stringify(next))
        } catch (storageError) {
          console.warn("Unable to persist cached model list", storageError)
        }
      }
      return next
    })
  }, [])

  const handleProgress = useCallback(
    (report: InitProgressReport | null | undefined) => {
      if (!report) {
        return
      }

      const modelId = pendingModelIdRef.current ?? activeModelIdRef.current ?? defaultModelId
      const sizeLabel = MODEL_METADATA[modelId]?.downloadSize
      const baseMessage = report.text ?? "Lade Modellartefakte"
      const message = sizeLabel ? `${baseMessage} · ${sizeLabel}` : baseMessage
      const value = typeof report.progress === "number" ? report.progress : 0

      setProgress({ value, message, modelId })
      if (value >= 1) {
        markCached(modelId)
        setTimeout(() => setProgress(null), 1200)
      }
    },
    [defaultModelId, markCached]
  )

  const createEngine = useCallback(
    async (requestedModelId: string) => {
      const webLLM = await import("@mlc-ai/web-llm")
      return webLLM.CreateMLCEngine(requestedModelId, {
        appConfig: MODEL_APP_CONFIG,
        initProgressCallback: handleProgress
      }) as Promise<MLCEngine>
    },
    [handleProgress]
  )

  const setActiveModelId = useCallback((modelId: string) => {
    activeModelIdRef.current = modelId
    setActiveModelIdState(modelId)
  }, [])

  const getCurrentModelId = useCallback(() => activeModelIdRef.current, [])

  const loadModel = useCallback(
    async (targetModelId: string) => {
      if (!webgpu.supported) {
        const reason = webgpu.reason ?? "WebGPU wird von diesem Browser nicht unterstützt."
        setStatus("unsupported")
        setError(reason)
        throw new Error(reason)
      }

      pendingModelIdRef.current = targetModelId
      setStatus("initializing")
      setError(null)
      setProgress({
        value: 0,
        message: `Lade ${MODEL_LABELS[targetModelId] ?? targetModelId}`,
        modelId: targetModelId
      })

      try {
        if (engineRef.current) {
          if (activeModelIdRef.current === targetModelId) {
            setStatus("ready")
            markCached(targetModelId)
            setProgress(prev => (prev?.modelId === targetModelId ? null : prev))
            return engineRef.current
          }

          await engineRef.current.reload(targetModelId)
          setStatus("ready")
          setActiveModelId(targetModelId)
          markCached(targetModelId)
          setProgress(prev => (prev?.modelId === targetModelId ? null : prev))
          return engineRef.current
        }

        const engine = await createEngine(targetModelId)
        engineRef.current = engine
        setStatus("ready")
        setActiveModelId(targetModelId)
        markCached(targetModelId)
        setProgress(prev => (prev?.modelId === targetModelId ? null : prev))
        return engine
      } catch (loadError) {
        setProgress(prev => (prev?.modelId === targetModelId ? null : prev))
        throw loadError
      } finally {
        pendingModelIdRef.current = null
      }
    },
    [createEngine, markCached, setActiveModelId, webgpu]
  )

  const initialize = useCallback(
    async (requestedModelId?: string) => {
      const preferredModelId = requestedModelId ?? lastRequestedModelIdRef.current ?? defaultModelId
      lastRequestedModelIdRef.current = preferredModelId

      if (initPromiseRef.current) {
        return initPromiseRef.current
      }

      const attemptQueue = buildAttemptQueue(preferredModelId)

      const initPromise: Promise<MLCEngine> = (async () => {
        let lastError: unknown = null

        for (const candidate of attemptQueue) {
          try {
            const engine = await loadModel(candidate)
            initPromiseRef.current = null
            return engine
          } catch (candidateError) {
            lastError = candidateError
            console.warn(`Model ${candidate} failed to load`, candidateError)
          }
        }

        initPromiseRef.current = null
        const message =
          lastError instanceof Error
            ? lastError.message
            : typeof lastError === "string"
              ? lastError
              : "Unbekannter Fehler beim Laden des Modells."
        setStatus("error")
        setError(message)
        throw lastError instanceof Error ? lastError : new Error(message)
      })()

      initPromiseRef.current = initPromise
      return initPromise
    },
    [defaultModelId, loadModel]
  )

  const generate = useCallback(
    async ({ messages, temperature, maxTokens }: GenerateOptions): Promise<GenerateResult> => {
      const modelId = activeModelIdRef.current ?? lastRequestedModelIdRef.current ?? defaultModelId
      const engine = await initialize(modelId)
      setIsGenerating(true)
      try {
        const request = {
          messages: messages.map(message => ({
            role: message.role,
            content: message.content
          })),
          temperature: temperature ?? DEFAULT_TEMPERATURE,
          max_tokens: maxTokens ?? DEFAULT_MAX_TOKENS,
          stream: false
        }
        const result = await engine.chat.completions.create(
          request as Parameters<typeof engine.chat.completions.create>[0]
        )

        return {
          text: extractText(result),
          raw: result
        }
      } finally {
        setIsGenerating(false)
      }
    },
    [defaultModelId, initialize]
  )

  const isModelCached = useCallback((modelId: string) => cachedModels.includes(modelId), [cachedModels])

  const defaultModelCached = useMemo(() => cachedModels.includes(defaultModelId), [cachedModels, defaultModelId])

  return {
    status,
    progress,
    error,
    isCached: defaultModelCached,
    cachedModels,
    isModelCached,
    isGenerating,
    webgpu,
    activeModelId,
    engine: engineRef.current,
    initialize,
    generate,
    getCurrentModelId
  }
}
