"use client"

import { ChangeEvent, useEffect, useMemo, useState } from "react"
import { useWebLLM } from "@/hooks/use-web-llm"
import {
  DEFAULT_MODEL_ID,
  FALLBACK_MODEL_ID,
  LOW_RESOURCE_MODEL_ID,
  MODEL_LABELS,
  MODEL_METADATA,
  MODEL_ORDER
} from "@/lib/model"

function formatStatus(status: string) {
  switch (status) {
    case "idle":
      return "Bereit zum Laden"
    case "initializing":
      return "Modell wird heruntergeladen"
    case "ready":
      return "Modell geladen"
    case "unsupported":
      return "WebGPU nicht verfügbar"
    case "error":
      return "Fehler beim Laden"
    default:
      return ""
  }
}

export function ModelLoader() {
  const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_MODEL_ID)
  const { status, progress, error, webgpu, initialize, activeModelId, cachedModels, isModelCached, isGenerating } =
    useWebLLM()
  const [autoStartedFor, setAutoStartedFor] = useState<string | null>(null)

  const modelOptions = useMemo(
    () =>
      MODEL_ORDER.map(modelId => ({
        id: modelId,
        label: MODEL_LABELS[modelId] ?? modelId,
        meta: MODEL_METADATA[modelId]
      })),
    []
  )

  const selectedMeta = MODEL_METADATA[selectedModelId]
  const selectedLabel = MODEL_LABELS[selectedModelId] ?? selectedModelId
  const isSelectedCached = isModelCached(selectedModelId)
  const statusLabel = formatStatus(status)
  const activeLabel = activeModelId ? (MODEL_LABELS[activeModelId] ?? activeModelId) : null
  const fallbackActivated = Boolean(activeModelId && activeModelId !== selectedModelId)

  useEffect(() => {
    setAutoStartedFor(null)
  }, [selectedModelId])

  useEffect(() => {
    if (!webgpu.supported) {
      return
    }
    if (status !== "idle") {
      return
    }
    if (!isSelectedCached) {
      return
    }
    if (autoStartedFor === selectedModelId) {
      return
    }
    setAutoStartedFor(selectedModelId)
    initialize(selectedModelId).catch(console.error)
  }, [autoStartedFor, initialize, isSelectedCached, selectedModelId, status, webgpu.supported])

  const handleLoad = () => {
    setAutoStartedFor(selectedModelId)
    initialize(selectedModelId).catch(console.error)
  }

  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedModelId(event.target.value)
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm shadow-slate-900/5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">On-Device LLM</span>
            <h2 className="text-xl font-semibold text-slate-900">Lade das WebLLM-Modell in deinen Browser</h2>
            <p className="text-sm text-slate-600">
              Standard: {MODEL_LABELS[DEFAULT_MODEL_ID]}. Fallback: {MODEL_LABELS[FALLBACK_MODEL_ID]}. Optional leichtes
              Modell: {MODEL_LABELS[LOW_RESOURCE_MODEL_ID]}.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-72">
            <label htmlFor="model-select" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Modell auswählen
            </label>
            <select
              id="model-select"
              value={selectedModelId}
              onChange={handleModelChange}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-slate-400/60"
            >
              {modelOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label} · {option.meta.downloadSize}
                </option>
              ))}
            </select>
            <div className="flex flex-col items-start gap-1 text-xs text-slate-500 md:items-end">
              <span>Downloadgröße: {selectedMeta?.downloadSize ?? "–"}</span>
              <span>Kontextfenster: {selectedMeta?.contextWindow?.toLocaleString("de-DE") ?? "–"} Token</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          {isSelectedCached ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {selectedLabel} im Cache
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              Erstdownload: {selectedMeta?.downloadSize ?? "–"}
            </span>
          )}
          <div className="flex flex-col items-end gap-1 text-right text-xs text-slate-500">
            {statusLabel && <span className="uppercase tracking-wide">{statusLabel}</span>}
            {activeLabel && (
              <span>
                Geladenes Modell: <span className="font-semibold text-slate-600">{activeLabel}</span>
              </span>
            )}
            <span className="text-[11px] text-slate-400">
              Im Cache: {cachedModels.length > 0 ? cachedModels.map(id => MODEL_LABELS[id] ?? id).join(", ") : "keines"}
            </span>
          </div>
        </div>

        {!webgpu.supported && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <p className="font-semibold">WebGPU benötigt</p>
            <p>{webgpu.reason ?? "Dieser Browser unterstützt WebGPU nicht."}</p>
          </div>
        )}

        {webgpu.supported && (
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={handleLoad}
              disabled={status === "initializing" || status === "unsupported" || isGenerating}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-300 disabled:text-slate-600"
            >
              {status === "ready"
                ? "Modell bereit"
                : status === "initializing"
                  ? "Modell wird geladen"
                  : "Modell laden"}
            </button>

            {(status === "initializing" || progress) && (
              <div className="flex flex-col gap-2">
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-slate-900 transition-all"
                    style={{ width: `${Math.round((progress?.value ?? 0) * 100)}%` }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span>{progress?.message ?? "Lade Modellartefakte"}</span>
                  <span className="font-semibold">{Math.round((progress?.value ?? 0) * 100)}%</span>
                </div>
              </div>
            )}

            {fallbackActivated && activeModelId && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                <p className="font-semibold">Automatischer Fallback aktiviert</p>
                <p>
                  {MODEL_LABELS[activeModelId] ?? activeModelId} wurde geladen, weil {selectedLabel} nicht initialisiert
                  werden konnte.
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <p className="font-semibold">Fehler</p>
                <p>{error}</p>
                {status !== "initializing" && (
                  <button
                    type="button"
                    onClick={handleLoad}
                    className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-600 transition hover:border-rose-300 hover:text-rose-700"
                  >
                    Erneut versuchen
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
