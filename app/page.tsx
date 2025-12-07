"use client"

import { useCallback, useEffect, useMemo, useState, memo } from "react"
import { ModelLoader } from "@/components/model-loader"
import { PDFPreview } from "@/components/pdf-preview"
import { WebLLMProvider, useWebLLMContext } from "@/context/web-llm-context"
import { MODEL_LABELS } from "@/lib/model"
import { exportToPDF, exportToDOCX } from "@/lib/export"
import { SUBJECTS, type Grade, type Subject, type SubjectId, type Topic } from "@/data/topics"

type GradeFilter = Grade | "Alle"

type GenerationStatus = "pending" | "running" | "success" | "error" | "cancelled"

type GenerationItem = {
  id: string
  status: GenerationStatus
  topic: Topic
  grade: Grade
  subjectId: SubjectId
  modelId: string | null
  output: string
  error: string | null
  timestamp: number
  specificPrompt?: string
}

type StoredResult = {
  id: string
  timestamp: number
  topic: Topic
  grade: Grade
  modelId: string
  output: string
  subjectId: SubjectId
}

const STORAGE_KEY = "school-sheet-results"
const QUEUE_STORAGE_KEY = "school-sheet-queue"

function cx(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ")
}

interface QueueItemProps {
  item: GenerationItem
  isExpanded: boolean
  copyStatus: "idle" | "success" | "error"
  onToggleExpanded: () => void
  onCancel: () => void
  onCopy: (output: string) => void
  onDelete: () => void
  onModelClick: (modelId: string) => void
  onDownloadPDF: () => void
  onDownloadDOCX: () => void
}

const QueueItem = memo(function QueueItem({
  item,
  isExpanded,
  copyStatus,
  onToggleExpanded,
  onCancel,
  onCopy,
  onDelete,
  onModelClick,
  onDownloadPDF,
  onDownloadDOCX
}: QueueItemProps) {
  const hasContent = item.output || (item.status === "error" && item.error)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => hasContent && onToggleExpanded()}
          className={cx("flex flex-1 flex-col gap-1 text-left", hasContent ? "cursor-pointer" : "")}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {item.status === "pending" && "Wartend"}
              {item.status === "running" && "Live-Vorschau"}
              {item.status === "success" && "Ergebnis"}
              {item.status === "error" && "Fehler"}
              {item.status === "cancelled" && "Abgebrochen"}
            </span>
            {hasContent && (
              <>
                <svg
                  className={cx("h-4 w-4 text-slate-400 transition-transform", isExpanded ? "rotate-180" : "rotate-0")}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </div>
          <span className="font-semibold text-slate-800">
            {item.topic.label} · Klasse {item.grade}
          </span>
          {item.specificPrompt && (
            <span className="text-xs italic text-slate-500 line-clamp-2">Impuls: {item.specificPrompt}</span>
          )}
          {item.modelId && (
            <span className="text-xs text-slate-500">
              Modell:{" "}
              <span
                onClick={e => {
                  e.stopPropagation()
                  onModelClick(item.modelId!)
                }}
                className="cursor-pointer hover:text-slate-700 hover:underline"
              >
                {MODEL_LABELS[item.modelId] ?? item.modelId}
              </span>
            </span>
          )}
        </button>
        <div className="flex items-center gap-3">
          {(item.status === "pending" || item.status === "running") && (
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer text-xs font-medium text-rose-600 hover:text-rose-700 hover:underline"
            >
              Abbrechen
            </button>
          )}
          {item.status === "success" && (
            <>
              <button
                type="button"
                onClick={onDownloadPDF}
                className="cursor-pointer text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline"
                title="Als PDF herunterladen"
              >
                PDF ↓
              </button>
              <button
                type="button"
                onClick={onDownloadDOCX}
                className="cursor-pointer text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline"
                title="Als DOCX herunterladen (kompatibel mit allen Office-Suiten)"
              >
                DOCX ↓
              </button>
              <button
                type="button"
                onClick={() => onCopy(item.output)}
                disabled={copyStatus !== "idle"}
                className="cursor-pointer text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline disabled:opacity-50"
              >
                {copyStatus === "success" ? "✓ Kopiert" : copyStatus === "error" ? "Fehler" : "Kopieren"}
              </button>
            </>
          )}
          {(item.status === "success" || item.status === "error" || item.status === "cancelled") && (
            <button
              type="button"
              onClick={onDelete}
              className="cursor-pointer text-xs font-medium text-rose-600 hover:text-rose-700 hover:underline"
            >
              Löschen
            </button>
          )}
        </div>
      </div>
      {isExpanded && (
        <>
          {item.output && (
            <div className="mt-4">
              {item.status === "running" ? (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap text-slate-700">
                  {item.output}
                  <span className="inline-block h-4 w-1 animate-pulse bg-slate-900" />
                </div>
              ) : (
                <PDFPreview content={item.output} title={`${item.topic.label} - Klasse ${item.grade}`} />
              )}
            </div>
          )}
          {item.status === "error" && item.error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              <p className="font-semibold">Fehler</p>
              <p>{item.error}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
})

function saveResultToStorage(result: StoredResult) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const results: StoredResult[] = stored ? JSON.parse(stored) : []
    results.unshift(result)
    // Keep only last 50 results
    const trimmed = results.slice(0, 50)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch (error) {
    console.warn("Failed to save result to localStorage", error)
  }
}

function deleteResultFromStorage(id: string) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return
    const results: StoredResult[] = JSON.parse(stored)
    const filtered = results.filter(r => r.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.warn("Failed to delete result from localStorage", error)
  }
}

function loadQueueFromStorage(): GenerationItem[] {
  try {
    const stored = localStorage.getItem(QUEUE_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.warn("Failed to load queue from localStorage", error)
    return []
  }
}

function saveQueueToStorage(queue: GenerationItem[]) {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue))
  } catch (error) {
    console.warn("Failed to save queue to localStorage", error)
  }
}

function getTheme(subjectId: SubjectId) {
  if (subjectId === "deutsch") {
    return {
      chipActive: "border-amber-500 bg-amber-500 text-white hover:bg-amber-500",
      chipCountInactive: "bg-amber-500/10 text-amber-700",
      categoryHeading: "text-amber-800",
      focusChip: "border border-amber-200 bg-amber-50 text-amber-800",
      badge: "text-amber-600",
      bullet: "bg-amber-500",
      cardBorder: "border-amber-100",
      cardShadow: "shadow-amber-500/10"
    }
  }

  return {
    chipActive: "border-sky-500 bg-sky-500 text-white hover:bg-sky-500",
    chipCountInactive: "bg-sky-500/10 text-sky-800",
    categoryHeading: "text-sky-800",
    focusChip: "border border-sky-200 bg-sky-50 text-sky-800",
    badge: "text-sky-600",
    bullet: "bg-sky-500",
    cardBorder: "border-sky-100",
    cardShadow: "shadow-sky-500/10"
  }
}

export default function Home() {
  return (
    <WebLLMProvider>
      <PageContent />
    </WebLLMProvider>
  )
}

function PageContent() {
  const [activeSubjectId, setActiveSubjectId] = useState<SubjectId>("deutsch")
  const [activeGrade, setActiveGrade] = useState<GradeFilter>("Alle")
  const [selectedModelId, setSelectedModelId] = useState<string>("")
  const webllm = useWebLLMContext()
  const {
    status: engineStatus,
    initialize,
    generate,
    cancel,
    isGenerating,
    progress,
    webgpu,
    activeModelId,
    getCurrentModelId
  } = webllm

  const [queue, setQueue] = useState<GenerationItem[]>([])
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle")
  const [hydrated, setHydrated] = useState(false)
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null)

  useEffect(() => {
    setHydrated(true)
    const loadedQueue = loadQueueFromStorage()
    setQueue(loadedQueue)
    // Expand the latest item by default
    if (loadedQueue.length > 0) {
      setExpandedItemId(loadedQueue[loadedQueue.length - 1].id)
    }
  }, [])

  useEffect(() => {
    if (hydrated) {
      saveQueueToStorage(queue)
    }
  }, [queue, hydrated])

  useEffect(() => {
    setActiveGrade("Alle")
  }, [activeSubjectId])

  const activeSubject = useMemo<Subject>(() => {
    const fallback = SUBJECTS[0]
    return SUBJECTS.find(subject => subject.id === activeSubjectId) ?? fallback
  }, [activeSubjectId])

  const theme = useMemo(() => getTheme(activeSubject.id), [activeSubject.id])

  const gradeCounts = useMemo(() => {
    return activeSubject.grades.reduce<Record<Grade, number>>(
      (acc, grade) => {
        acc[grade] = activeSubject.topics.filter(topic => topic.grades.includes(grade)).length
        return acc
      },
      { "1": 0, "2": 0, "3": 0, "4": 0 }
    )
  }, [activeSubject])

  const visibleTopicCount = useMemo(() => {
    if (activeGrade === "Alle") {
      return activeSubject.topics.length
    }
    return activeSubject.topics.filter(topic => topic.grades.includes(activeGrade)).length
  }, [activeSubject, activeGrade])

  const determineGrade = useCallback(
    (topic: Topic): Grade => {
      if (activeGrade !== "Alle" && topic.grades.includes(activeGrade)) {
        return activeGrade
      }
      return (topic.grades[0] ?? "3") as Grade
    },
    [activeGrade]
  )

  const handleGenerate = useCallback(
    async (topic: Topic, specificPrompt?: string) => {
      const gradeForPrompt = determineGrade(topic)
      const newItem: GenerationItem = {
        id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
        status: "pending",
        topic: specificPrompt ? { ...topic, samplePrompts: [specificPrompt] } : topic,
        grade: gradeForPrompt,
        subjectId: activeSubject.id,
        modelId: null,
        output: "",
        error: null,
        timestamp: Date.now(),
        specificPrompt
      }

      setQueue(prev => [...prev, newItem])
      // Expand the newly added item
      setExpandedItemId(newItem.id)
    },
    [activeSubject.id, determineGrade]
  )

  const processQueue = useCallback(async () => {
    const pending = queue.find(item => item.status === "pending")
    if (!pending || isGenerating) return

    const usedModelId = getCurrentModelId() ?? activeModelId ?? null

    setQueue(prev =>
      prev.map(item => (item.id === pending.id ? { ...item, status: "running" as const, modelId: usedModelId } : item))
    )
    setCopyStatus("idle")

    try {
      await initialize()

      const systemPrompt =
        "Du bist eine Grundschul-Fachautor*in. Du erstellst altersgerechte Unterrichtsmaterialien, die exakt zur angegebenen Klassenstufe passen. Jede Ausgabe enthält strukturierte Aufgaben, klare Anweisungen und einen vollständigen Lösungsteil."

      const focusLine = pending.topic.focus.length > 0 ? `Fokusthemen: ${pending.topic.focus.join(", ")}.` : ""
      const impulses =
        pending.topic.samplePrompts.length > 0
          ? `Inspiration aus der Themenbibliothek:\n- ${pending.topic.samplePrompts.join("\n- ")}`
          : ""

      const subjectTitle = SUBJECTS.find(s => s.id === pending.subjectId)?.title ?? pending.subjectId
      const userPrompt = [
        `Fach: ${subjectTitle}`,
        `Klassenstufe: ${pending.grade}`,
        `Thema: ${pending.topic.label}`,
        `Beschreibung: ${pending.topic.description}`,
        focusLine,
        impulses,
        "Erstelle ein vollständiges Unterrichtsmaterial in deutscher Sprache mit folgenden Abschnitten:",
        "1. Titel",
        "2. Lernziele (2-3 Bulletpoints)",
        "3. Einleitungstext für die Schüler (2-3 Sätze)",
        "4. Aufgabenbereich mit mindestens drei Aufgaben (markiere jede Aufgabe mit leicht/mittel/schwer und nenne benötigtes Material)",
        "5. Differenzierungsidee (für Förder- und Forderkinder)",
        "6. Lösungsteil mit eindeutigen Antworten"
      ]
        .filter(Boolean)
        .join("\n\n")

      const response = await generate({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.4,
        onChunk: (chunk: string) => {
          setQueue(prev =>
            prev.map(item =>
              item.id === pending.id && item.status === "running" ? { ...item, output: item.output + chunk } : item
            )
          )
        }
      })

      const currentItem = queue.find(item => item.id === pending.id)
      const output = currentItem?.output || response.text.trim()
      const finalOutput = output.length > 0 ? output : "⚠️ Das Modell hat keine Ausgabe geliefert."

      // Save to results storage if successful
      if (finalOutput && !finalOutput.startsWith("⚠️") && usedModelId) {
        saveResultToStorage({
          id: pending.id,
          timestamp: pending.timestamp,
          topic: pending.topic,
          grade: pending.grade,
          modelId: usedModelId,
          output: finalOutput,
          subjectId: pending.subjectId
        })
      }

      setQueue(prev =>
        prev.map(item =>
          item.id === pending.id
            ? { ...item, status: "success" as const, output: finalOutput, modelId: usedModelId }
            : item
        )
      )
    } catch (err) {
      const message =
        err instanceof Error ? err.message : typeof err === "string" ? err : "Unbekannter Fehler bei der Generierung."
      setQueue(prev =>
        prev.map(item => (item.id === pending.id ? { ...item, status: "error" as const, error: message } : item))
      )
    }
  }, [queue, isGenerating, initialize, generate, getCurrentModelId, activeModelId])

  useEffect(() => {
    processQueue()
  }, [queue, isGenerating])

  const handleCancel = useCallback(
    async (itemId: string) => {
      const item = queue.find(q => q.id === itemId)
      if (item?.status === "running") {
        await cancel()
      }
      setQueue(prev => prev.map(q => (q.id === itemId ? { ...q, status: "cancelled" as const } : q)))
    },
    [cancel, queue]
  )

  const handleCopy = useCallback(async (output: string) => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopyStatus("success")
      setTimeout(() => setCopyStatus("idle"), 2000)
    } catch (error) {
      console.warn("Copy failed", error)
      setCopyStatus("error")
      setTimeout(() => setCopyStatus("idle"), 2500)
    }
  }, [])

  const handleDelete = useCallback(
    (itemId: string) => {
      deleteResultFromStorage(itemId)
      setQueue(prev => prev.filter(q => q.id !== itemId))
      setCopyStatus("idle")
      // If the deleted item was expanded, clear the expanded state
      if (expandedItemId === itemId) {
        setExpandedItemId(null)
      }
    },
    [expandedItemId]
  )

  const handleDownloadPDF = useCallback(async (item: GenerationItem) => {
    if (!item.output) return
    try {
      const filename = `${item.topic.label.replace(/[^a-z0-9]/gi, "_")}_Klasse${item.grade}.pdf`
      await exportToPDF(item.output, `${item.topic.label} - Klasse ${item.grade}`, filename)
    } catch (error) {
      console.error("PDF download failed:", error)
      alert("PDF-Download fehlgeschlagen")
    }
  }, [])

  const handleDownloadDOCX = useCallback(async (item: GenerationItem) => {
    if (!item.output) return
    try {
      const filename = `${item.topic.label.replace(/[^a-z0-9]/gi, "_")}_Klasse${item.grade}.docx`
      await exportToDOCX(item.output, `${item.topic.label} - Klasse ${item.grade}`, filename)
    } catch (error) {
      console.error("DOCX download failed:", error)
      alert("DOCX-Download fehlgeschlagen")
    }
  }, [])

  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItemId(prev => (prev === itemId ? null : itemId))
  }, [])

  const gradeFilters: GradeFilter[] = ["Alle", ...activeSubject.grades]
  const allTopics = useMemo(() => SUBJECTS.flatMap(subject => subject.topics), [])
  const currentItem = queue.find(item => item.status === "running") ?? queue[queue.length - 1]

  const activeModelLabel = activeModelId ? (MODEL_LABELS[activeModelId] ?? activeModelId) : "Kein Modell geladen"
  const isEngineBusy = engineStatus === "initializing" || engineStatus === "checking"

  if (!hydrated) {
    // Render a static placeholder during SSR
    return <div className="h-20 bg-gray-100 animate-pulse" />
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16 text-slate-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pt-16 md:px-8 lg:pt-20">
        <header className="flex flex-col gap-6">
          <span
            className={cx(
              "inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide",
              theme.badge
            )}
          >
            Topic Library
          </span>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Kuratiertes Themenarchiv für Deutsch und Religion
            </h1>
            <p className="max-w-3xl text-base text-slate-600 sm:text-lg">
              Wähle ein Fach, filtere nach Klassenstufe und erhalte inspirierende Themenbausteine für Arbeitsblätter,
              Projekte oder Unterrichtsreihen. Alle Inhalte sind auf die Klassen 1-4 zugeschnitten und lassen sich
              direkt mit dem Generator kombinieren.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {activeSubject.title}: {visibleTopicCount} Themen sichtbar
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              Gesamtbibliothek: {allTopics.length} Themen in {activeSubject.categories.length} Clustern
            </span>
          </div>
        </header>

        <ModelLoader externalSelectedModelId={selectedModelId} onModelIdChange={setSelectedModelId} />

        <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm shadow-slate-900/5">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">Generator</span>
            <h2 className="text-xl font-semibold text-slate-900">Entwurf aus einem Thema starten</h2>
            <p className="text-sm text-slate-600">
              Aktives Modell: {activeModelLabel}. Temperatur 0,4 (fokussiert auf Zuverlässigkeit).
            </p>
          </div>

          {!webgpu.supported && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <p className="font-semibold">WebGPU benötigt</p>
              <p>{webgpu.reason ?? "Dieser Browser unterstützt WebGPU nicht."}</p>
            </div>
          )}

          {engineStatus === "initializing" && progress && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
              <span className="font-semibold">Ein Modell wird geladen, bitte warte...</span>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            {queue.length === 0 && (
              <p>
                Wähle unten ein Thema und klicke auf <span className="font-semibold">„Entwurf erstellen"</span>, um ein
                komplettes Arbeitsblatt zu erzeugen. Fokus: strukturierte Aufgaben, klare Instruktionen und Lösungsteil.
              </p>
            )}
            {queue.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Warteschlange: {queue.filter(q => q.status === "pending" || q.status === "running").length} aktiv,{" "}
                    {queue.filter(q => q.status === "success").length} abgeschlossen
                  </span>
                </div>
              </div>
            )}
          </div>

          {queue
            .slice()
            .reverse()
            .map(item => (
              <QueueItem
                key={item.id}
                item={item}
                isExpanded={expandedItemId === item.id}
                copyStatus={copyStatus}
                onToggleExpanded={() => toggleExpanded(item.id)}
                onCancel={() => handleCancel(item.id)}
                onCopy={handleCopy}
                onDelete={() => handleDelete(item.id)}
                onDownloadPDF={() => handleDownloadPDF(item)}
                onDownloadDOCX={() => handleDownloadDOCX(item)}
                onModelClick={modelId => {
                  setSelectedModelId(modelId)
                  document.querySelector("[data-model-loader]")?.scrollIntoView({ behavior: "smooth" })
                }}
              />
            ))}
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {SUBJECTS.map(subject => {
            const isActive = subject.id === activeSubject.id
            return (
              <button
                key={subject.id}
                type="button"
                onClick={() => setActiveSubjectId(subject.id)}
                className={cx(
                  "group relative flex h-full flex-col gap-3 rounded-3xl border p-6 text-left transition duration-200",
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                    : "border-slate-200 cursor-pointer bg-white/80 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/10"
                )}
              >
                <span
                  className={cx(
                    "inline-flex items-center gap-3 text-left text-lg font-semibold",
                    isActive ? "text-white" : "text-slate-800"
                  )}
                >
                  {subject.title}
                  <span
                    className={cx(
                      "rounded-full px-2 py-0.5 text-xs font-semibold transition",
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600 group-hover:text-slate-800"
                    )}
                  >
                    {subject.topics.length}
                  </span>
                </span>
                <p className={cx("text-sm", isActive ? "text-slate-200" : "text-slate-600")}>{subject.tagline}</p>
              </button>
            )
          })}
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {gradeFilters.map(grade => {
                const isActive = activeGrade === grade
                const label = grade === "Alle" ? "Alle Klassen" : `Klasse ${grade}`
                const count = grade === "Alle" ? visibleTopicCount : gradeCounts[grade]
                return (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setActiveGrade(grade)}
                    className={cx(
                      "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
                      isActive
                        ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                        : "cursor-pointer border-slate-200 bg-white/80 text-slate-600 hover:border-slate-300 hover:text-slate-800"
                    )}
                  >
                    <span>{label}</span>
                    <span
                      className={cx(
                        "rounded-full px-2 py-0.5 text-xs font-semibold transition",
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600 group-hover:text-slate-800"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-10">
          {activeSubject.categories.map(category => {
            const topicsInCategory = activeSubject.topics.filter(topic => {
              if (topic.category !== category.id) {
                return false
              }
              if (activeGrade === "Alle") {
                return true
              }
              return topic.grades.includes(activeGrade)
            })

            if (topicsInCategory.length === 0) {
              return null
            }

            return (
              <div
                key={activeSubject.id + "-category-" + category.id}
                className={cx(
                  "rounded-3xl border bg-white/80 p-6 shadow-sm shadow-slate-900/5",
                  theme.cardBorder,
                  theme.cardShadow
                )}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex flex-col gap-2">
                    <h3 className={cx("text-xl font-semibold", theme.categoryHeading)}>{category.label}</h3>
                    <p className="max-w-3xl text-sm text-slate-600">{category.summary}</p>
                  </div>
                  <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {topicsInCategory.length} Themen
                  </span>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {topicsInCategory.map(topic => {
                    const isTopicLoading = queue.some(q => q.status === "running" && q.topic.id === topic.id)
                    return (
                      <article
                        key={topic.id}
                        className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-900/10"
                      >
                        <div className="flex flex-col gap-2">
                          <h4 className="text-lg font-semibold text-slate-900">{topic.label}</h4>
                          <p className="text-sm leading-relaxed text-slate-600">{topic.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {topic.grades.map(grade => (
                            <span
                              key={topic.id + "-grade-" + grade}
                              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600"
                            >
                              Kl. {grade}
                            </span>
                          ))}
                        </div>
                        {topic.focus.length > 0 && (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fokus</span>
                            <div className="flex flex-wrap gap-2">
                              {topic.focus.map(item => (
                                <span
                                  key={topic.id + "-focus-" + item}
                                  className={cx("rounded-full px-2.5 py-1 text-xs font-semibold", theme.focusChip)}
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {topic.samplePrompts.length > 0 && (
                          <div className="flex flex-col gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              KI-Impulse
                            </span>
                            <ul className="flex flex-col gap-2 text-sm text-slate-600">
                              {topic.samplePrompts.map(prompt => (
                                <li
                                  key={topic.id + "-prompt-" + prompt}
                                  className="group relative flex items-start gap-2"
                                >
                                  <span className={cx("mt-1 h-1.5 w-1.5 rounded-full", theme.bullet)} />
                                  <button
                                    type="button"
                                    onClick={e => {
                                      e.stopPropagation()
                                      handleGenerate(topic, prompt)
                                    }}
                                    disabled={isEngineBusy || !webgpu.supported}
                                    title="Entwurf erstellen"
                                    className="relative flex flex-1 cursor-pointer items-start gap-2 text-left transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <span className="flex-1">{prompt}</span>
                                    <svg
                                      className="mt-0.5 h-4 w-4 shrink-0 opacity-0 transition group-hover:opacity-100"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </article>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </section>
      </main>
    </div>
  )
}
