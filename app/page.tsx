"use client"

import { useEffect, useMemo, useState } from "react"
import { SUBJECTS, type Grade, type Subject, type SubjectId } from "@/data/topics"

type GradeFilter = Grade | "Alle"

function cx(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ")
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
  const [activeSubjectId, setActiveSubjectId] = useState<SubjectId>("deutsch")
  const [activeGrade, setActiveGrade] = useState<GradeFilter>("Alle")

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

  const gradeFilters: GradeFilter[] = ["Alle", ...activeSubject.grades]

  const allTopics = useMemo(() => SUBJECTS.map(subject => subject.topics).flat(), [SUBJECTS])

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
                    : "border-slate-200 bg-white/80 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/10"
                )}
              >
                <span
                  className={cx(
                    "text-xs font-semibold uppercase tracking-wide",
                    isActive ? "text-slate-200" : theme.badge
                  )}
                >
                  Fach
                </span>
                <h2 className={cx("text-2xl font-semibold", isActive ? "text-white" : "text-slate-900")}>
                  {subject.title}
                </h2>
                <p className={cx("text-sm leading-relaxed", isActive ? "text-white/80" : "text-slate-600")}>
                  {subject.tagline}
                </p>
                <p className={cx("text-sm leading-relaxed", isActive ? "text-white/70" : "text-slate-600")}>
                  {subject.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {subject.grades.map(grade => (
                    <span
                      key={subject.id + "-grade-" + grade}
                      className={cx(
                        "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                        isActive ? "border-white/40 text-white/80" : "border-slate-200 text-slate-600"
                      )}
                    >
                      Kl. {grade}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm shadow-slate-900/5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Klassenstufe filtern</span>
              <p className="text-sm text-slate-600">Zeigt nur Themen, die zur ausgewählten Klassenstufe passen.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {gradeFilters.map(grade => {
                const isActive = grade === activeGrade
                const label = grade === "Alle" ? "Alle Klassen" : "Klasse " + grade
                const count = grade === "Alle" ? activeSubject.topics.length : gradeCounts[grade as Grade]
                return (
                  <button
                    key={"grade-filter-" + grade}
                    type="button"
                    onClick={() => setActiveGrade(grade)}
                    className={cx(
                      "group inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition",
                      isActive
                        ? theme.chipActive
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
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
                  {topicsInCategory.map(topic => (
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
                              <li key={topic.id + "-prompt-" + prompt} className="flex items-start gap-2">
                                <span className={cx("mt-1 h-1.5 w-1.5 rounded-full", theme.bullet)} />
                                <span>{prompt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            )
          })}
        </section>
      </main>
    </div>
  )
}
