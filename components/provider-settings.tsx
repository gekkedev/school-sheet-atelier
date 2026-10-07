"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AI_PROVIDER_KEY,
  estimateEuroCentsPerPage,
  fetchOpenRouterKeyInfo,
  fetchOpenRouterModels,
  formatEuroCents,
  formatUsdAsEuro,
  isChinaAffiliatedOpenRouterModel,
  isFreeOpenRouterModel,
  isMuskAffiliatedOpenRouterModel,
  OPENROUTER_MODEL_KEY,
  OPENROUTER_TOKEN_KEY,
  openRouterLimitPercent,
  type OpenRouterKeyInfo,
  type OpenRouterModel
} from "@/lib/openrouter"

export type AiProvider = "local" | "openrouter"

export function ProviderSettings({
  provider,
  onProviderChange,
  selectedModel,
  onModelChange,
  onTokenChange,
  usageRefresh
}: {
  provider: AiProvider
  onProviderChange: (provider: AiProvider) => void
  selectedModel: string
  onModelChange: (model: string) => void
  onTokenChange: (token: string) => void
  usageRefresh: number
}) {
  const [token, setToken] = useState("")
  const [models, setModels] = useState<OpenRouterModel[]>([])
  const [freeOnly, setFreeOnly] = useState(false)
  const [excludeChina, setExcludeChina] = useState(true)
  const [excludeMusk, setExcludeMusk] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [keyInfo, setKeyInfo] = useState<OpenRouterKeyInfo | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem(OPENROUTER_TOKEN_KEY) ?? ""
    const storedProvider = localStorage.getItem(AI_PROVIDER_KEY)
    const storedModel = localStorage.getItem(OPENROUTER_MODEL_KEY) ?? ""
    setToken(storedToken)
    onTokenChange(storedToken)
    if (storedProvider === "openrouter") onProviderChange("openrouter")
    if (storedModel) onModelChange(storedModel)
  }, [onModelChange, onProviderChange, onTokenChange])

  useEffect(() => {
    localStorage.setItem(AI_PROVIDER_KEY, provider)
  }, [provider])

  useEffect(() => {
    if (selectedModel) localStorage.setItem(OPENROUTER_MODEL_KEY, selectedModel)
  }, [selectedModel])

  useEffect(() => {
    if (provider !== "openrouter" || token.length < 20) return
    let active = true
    const timeout = window.setTimeout(() => {
      setLoading(true)
      setError("")
      Promise.allSettled([fetchOpenRouterModels(token), fetchOpenRouterKeyInfo(token)]).then(results => {
        if (!active) return
        const [modelsResult, keyResult] = results
        const errors: string[] = []
        if (modelsResult.status === "fulfilled") {
          setModels(modelsResult.value)
          if (!selectedModel && modelsResult.value[0]) onModelChange(modelsResult.value[0].id)
        } else errors.push(modelsResult.reason instanceof Error ? modelsResult.reason.message : "Modellfehler")
        if (keyResult.status === "fulfilled") setKeyInfo(keyResult.value)
        else errors.push(keyResult.reason instanceof Error ? keyResult.reason.message : "Limitfehler")
        setError(errors.join(" "))
        setLoading(false)
      })
    }, 400)
    return () => {
      active = false
      window.clearTimeout(timeout)
    }
  }, [provider, token, onModelChange, usageRefresh])

  const visibleModels = useMemo(
    () =>
      models.filter(
        model =>
          (!freeOnly || isFreeOpenRouterModel(model)) &&
          (!excludeChina || !isChinaAffiliatedOpenRouterModel(model)) &&
          (!excludeMusk || !isMuskAffiliatedOpenRouterModel(model))
      ),
    [freeOnly, excludeChina, excludeMusk, models]
  )
  const selectedModelInfo = models.find(model => model.id === selectedModel)
  const limitPercent = keyInfo ? openRouterLimitPercent(keyInfo) : null
  const limitRemainingUsd =
    keyInfo?.limit === null ? 0 : Math.max(0, keyInfo?.limitRemaining ?? (keyInfo?.limit ?? 0) - (keyInfo?.usage ?? 0))
  const limitUsedUsd = keyInfo?.limit === null ? 0 : Math.max(0, (keyInfo?.limit ?? 0) - limitRemainingUsd)

  useEffect(() => {
    if (models.length > 0 && !visibleModels.some(model => model.id === selectedModel)) {
      onModelChange(visibleModels[0]?.id ?? "")
    }
  }, [models.length, visibleModels, selectedModel, onModelChange])

  const updateToken = (value: string) => {
    setToken(value)
    setKeyInfo(null)
    setModels([])
    setError("")
    onTokenChange(value)
    localStorage.setItem(OPENROUTER_TOKEN_KEY, value)
  }

  return (
    <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm shadow-ink/10">
      <div className="flex flex-col gap-5">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-muted">KI-Anbieter</span>
          <h2 className="text-xl font-semibold text-ink">Lokal oder OpenRouter</h2>
        </div>
        <div className="inline-flex w-fit rounded-full border border-line bg-surface-muted p-1">
          {(["local", "openrouter"] as const).map(value => (
            <button
              key={value}
              type="button"
              onClick={() => onProviderChange(value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${provider === value ? "bg-accent text-on-accent" : "text-muted"}`}
            >
              {value === "local" ? "Lokal" : "OpenRouter"}
            </button>
          ))}
        </div>
        {provider === "openrouter" && (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
              OpenRouter API-Token
              <input
                type="password"
                value={token}
                onChange={event => updateToken(event.target.value)}
                autoComplete="off"
                placeholder="sk-or-v1-…"
                className="rounded-xl border border-line bg-surface px-4 py-3 text-sm normal-case tracking-normal text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <span className="font-normal normal-case tracking-normal text-muted">
                Wird automatisch nur in diesem Browser gespeichert.
              </span>
              {keyInfo && (
                <div className="mt-2 flex flex-col gap-2 rounded-xl border border-line bg-surface-muted p-3 font-normal normal-case tracking-normal">
                  {keyInfo.limit === null ? (
                    <span className="text-sm text-muted">Kein Ausgabenlimit für diesen API-Key gesetzt.</span>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-3 text-sm text-muted">
                        <span>Ausgabenlimit</span>
                        <span className="font-semibold">
                          {formatUsdAsEuro(limitUsedUsd)} / {formatUsdAsEuro(keyInfo.limit)}
                        </span>
                      </div>
                      <div
                        role="progressbar"
                        aria-label="Verbrauch des OpenRouter-Ausgabenlimits"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(limitPercent ?? 0)}
                        className="h-2 overflow-hidden rounded-full bg-line"
                      >
                        <div
                          className={`h-full rounded-full ${limitPercent !== null && limitPercent >= 100 ? "bg-rose-500" : limitPercent !== null && limitPercent >= 80 ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: `${limitPercent ?? 0}%` }}
                        />
                      </div>
                      <span
                        className={
                          limitPercent !== null && limitPercent >= 100
                            ? "text-sm font-semibold text-rose-700"
                            : "text-xs text-muted"
                        }
                      >
                        {limitPercent !== null && limitPercent >= 100
                          ? "Ausgabenlimit erreicht"
                          : `${(limitPercent ?? 0).toLocaleString("de-DE", { maximumFractionDigits: 1 })} % verbraucht · ${formatUsdAsEuro(limitRemainingUsd)} verbleibend`}
                      </span>
                    </>
                  )}
                </div>
              )}
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label htmlFor="openrouter-model" className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Modell
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-muted">
                    <input type="checkbox" checked={freeOnly} onChange={event => setFreeOnly(event.target.checked)} />
                    Nur kostenlose
                  </label>
                  <label
                    className="flex items-center gap-1.5 text-xs text-muted"
                    title="Keine Modelle chinesischer Anbieter oder Marken anzeigen"
                  >
                    <input
                      type="checkbox"
                      checked={excludeChina}
                      onChange={event => setExcludeChina(event.target.checked)}
                    />
                    🇨🇳 ausschließen
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-muted">
                    <input
                      type="checkbox"
                      checked={excludeMusk}
                      onChange={event => setExcludeMusk(event.target.checked)}
                    />
                    Musk ausschließen
                  </label>
                </div>
              </div>
              <select
                id="openrouter-model"
                value={visibleModels.some(model => model.id === selectedModel) ? selectedModel : ""}
                onChange={event => onModelChange(event.target.value)}
                disabled={!token || loading}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-soft focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-surface-muted"
              >
                <option value="">{loading ? "Modelle werden geladen…" : "Modell auswählen"}</option>
                {visibleModels.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name} ·{" "}
                    {isFreeOpenRouterModel(model)
                      ? "kostenlos"
                      : `≈ ${formatEuroCents(estimateEuroCentsPerPage(model))}/Seite`}
                  </option>
                ))}
              </select>
              {selectedModelInfo && (
                <span className="text-sm font-semibold text-ink-soft">
                  Geschätzte Kosten pro Seite: {formatEuroCents(estimateEuroCentsPerPage(selectedModelInfo))}
                </span>
              )}
              <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Hinweis: Eingaben können abhängig von Modell und Anbieter zum Training verwendet und von Menschen
                eingesehen werden. Dafür gibt es hier derzeit noch keinen Filter.
              </span>
              {error && <span className="text-sm text-rose-600">{error}</span>}
              {freeOnly && visibleModels.length === 0 && !loading && (
                <span className="text-sm text-amber-700">Keine kostenlosen Modelle gefunden.</span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
