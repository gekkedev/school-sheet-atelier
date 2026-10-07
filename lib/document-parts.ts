type Request = {
  messages: Array<{ role: "system" | "user"; content: string }>
  maxTokens: number
  temperature: number
}

export type DocumentPartsOptions = {
  topic: string
  description: string
  focus: string[]
  grade: number
  subject: string
  temperature: number
  maxTokens: number
  generate: (request: Request) => Promise<{ text: string; truncated: boolean }>
  onProgress: (content: string) => void
  signal: AbortSignal
}

export function createPartRequester(options: DocumentPartsOptions) {
  const context = `Fach: ${options.subject}. Klasse: ${options.grade}. Thema: ${options.topic}.\n${options.description}\nFokus: ${options.focus.join(", ")}`
  const system =
    "Du schreibst altersgerechte Grundschulmaterialien auf Deutsch. Antworte ausschließlich mit gültigem JSON. Erstelle nur den angeforderten Teil, nicht das gesamte Dokument."
  return async function request<T>(prompt: string, label: string, parse: (raw: string) => T): Promise<T> {
    let issue = ""
    for (let attempt = 0; attempt < 2; attempt++) {
      options.signal.throwIfAborted()
      const response = await options.generate({
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `${context}\n\n${prompt}${issue ? `\n\nDer vorige Versuch war ungültig: ${issue}. Erstelle diesen Teil erneut vollständig, mit knappen Formulierungen und ohne Wiederholungen.` : ""}`
          }
        ],
        maxTokens: options.maxTokens,
        temperature: attempt ? 0 : options.temperature
      })
      options.signal.throwIfAborted()
      try {
        if (response.truncated) throw new Error("Antwort am Ausgabelimit abgeschnitten")
        return parse(response.text)
      } catch (error) {
        issue = error instanceof Error ? error.message : "Ungültige Antwort"
      }
    }
    throw new Error(
      `${label} konnte nicht vollständig erstellt werden: ${issue}. Bereits fertige Teile bleiben in der Vorschau erhalten.`
    )
  }
}
