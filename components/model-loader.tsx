"use client"

import { useEffect, useMemo, useState } from "react"
import { useWebLLM } from "@/hooks/use-web-llm"

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
  const { status, progress, error, isCached, webgpu, initialize } = useWebLLM()
  const [autoStarted, setAutoStarted] = useState(false)
  const pct = useMemo(() => {
    if (!progress) {
      return 0
    }
    const value = Math.max(0, Math.min(1, progress.value ?? 0))
    return Math.round(value * 100)
  }, [progress])

  useEffect(() => {
    if (!autoStarted && webgpu.supported && isCached && status === "idle") {
      setAutoStarted(true)
      initialize().catch(console.error)
    }
  }, [autoStarted, initialize, isCached, status, webgpu.supported])

  const handleLoad = () => {
    initialize().catch(console.error)
  }

  const statusLabel = formatStatus(status)

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm shadow-slate-900/5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">On-Device LLM</span>
            <h2 className="text-xl font-semibold text-slate-900">Lade das WebLLM-Modell in deinen Browser</h2>
          </div>
          <div className="flex flex-col items-end gap-1 text-sm text-slate-500">
            {isCached ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Modell im Cache
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                Erstdownload ca. 1.4 GB
              </span>
            )}
            {statusLabel && <span className="text-xs uppercase tracking-wide text-slate-500">{statusLabel}</span>}
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
              disabled={status === "initializing" || status === "ready"}
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
                  <div className="h-3 rounded-full bg-slate-900 transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span>{progress?.message ?? "Lade Modellartefakte"}</span>
                  <span className="font-semibold">{pct}%</span>
                </div>
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
