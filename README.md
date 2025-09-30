# SchoolSheet-Atelier

SchoolSheet-Atelier generates elementary school German and Religion exams, worksheets, and printable handouts entirely in the browser using WebGPU plus WebLLM. No server, no API keys. Runs locally on a regular laptop.

> Built with Next.js 15 (App Router, React) and exported as a static site for GitHub Pages.  
> Deploys automatically on every push to `main`.

---

## Features

- On-device LLM (WebLLM plus WebGPU). First model download shows a progress bar, then cached offline.
- Exam and worksheet generator with grade, subject, topic selection, difficulty, and temperature (default 0.3-0.5).
- Self-check pass: model re-reads and fixes grammar or solutions before final output.
- Editable preview with full WYSIWYG editor for last-minute changes before exporting.
- PDF preview and export (DIN A4, page numbers, header and footer).
- DOCX export (opens in Word, LibreOffice, OpenOffice).
- Templates for exams, worksheets, reading passages, cloze texts, flashcards, quizzes, answer sheets.
- Curated topic libraries for Deutsch and Religion, with ability to add custom topics.

---

## Getting Started

### Prerequisites

- A WebGPU-capable browser:
  - Chrome or Edge >= 113
  - Safari 17+
  - Firefox 141+

### Dev setup

```bash
pnpm install --frozen-lockfile   # or npm ci / yarn --frozen-lockfile
pnpm dev       # runs on http://localhost:3000
```

---

## Model Choices (MLC/WebLLM IDs)

- Default: `Llama-3.2-3B-Instruct-q4f32_1-MLC` (balanced quality, ≈1.4 GB download).
- Fallback: `Llama-3.2-1B-Instruct-q4f16_1-MLC` (fallback for mid-range GPUs, ≈0.7 GB download).
- Optional low-resource: `TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC` (fits very constrained GPUs, ≈0.55 GB).

You can change the default in `lib/model.ts` or via `NEXT_PUBLIC_MODEL_ID`.

> Hinweis: Die IDs werden über eine eigene WebLLM-App-Konfiguration eingebunden, damit die Llama-3.2-Modelle auch dann geladen werden, wenn sie (noch) nicht im vorgefertigten Paket enthalten sind.

---

## Document Types

You can generate any printable handout, not just exams:

- Exam (tasks plus solutions, time and points)
- Worksheet or simple tasks
- Reading passage with questions
- Cloze text (Lückentext)
- Flashcards (term versus definition)
- Quiz (multiple choice or short answer)
- Answer sheet (blank grid or lines)

Pick a template, then refine grade, subject, and topics.

---

## Editable Preview

- Full-page WYSIWYG editor (TipTap or Slate).
- Toolbar: headings, bold or italic, lists, page break, images.
- What you edit updates the underlying JSON schema.
- Reset button restores the last generated output.

---

## Export Options

- PDF:
  - True print preview (A4 layout with margins, page numbers).
  - In-browser preview using `react-pdf` or DOM-to-PDF (`html2canvas` plus `jsPDF`).
  - Download final PDF.
- DOCX:
  - Generated from the JSON schema with the `docx` library.
  - Opens in Microsoft Word, LibreOffice, and OpenOffice without layout issues.

---

## Topics Library

Curated lists for quick selection; extendable with custom topics.

### data/topics.de.ts (Deutsch)

- Exportiert `DEUTSCH_SUBJECT` als `Subject` für die Klassen 1-4.
- Fünf Kategorien bündeln Lautbewusstsein, Grammatik, Lesen, Schreiben und Wortschatz für schnellen Zugriff.
- Jede der über zwanzig Lerneinheiten enthält Beschreibung, Fokus-Schlagwörter und drei KI-Impulse für differenzierte Materialien.

### data/topics.reli.ts (Religion)

- Exportiert `RELIGION_SUBJECT` als `Subject` für Religionsunterricht Kl. 1-4.
- Fünf thematische Cluster decken Glauben & Bibel, Kirchenjahr & Symbole, Werte & Gemeinschaft, Weltreligionen sowie Spiritualität ab.
- Enthaltene Themen liefern praxisnahe Beschreibungen, Fokusfelder und KI-Impulslisten für Projekte, Andachten und Wertearbeit.

### data/topics.ts

- Führt beide Fach-Module als `SUBJECTS` zusammen und re-exportiert die gemeinsamen Typdefinitionen.

---

## Privacy

All generation happens locally in the browser. The model is downloaded once (about 1.4 GB for 3B int4), cached in Cache Storage, and reused offline.

---

## Credits

- WebLLM (MLC) - in-browser LLM engine
- Meta Llama 3.2 (3B and 1B variants)
- Next.js for static site generation
- docx, react-pdf, jspdf for export
