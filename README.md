# SchoolSheet-Atelier

SchoolSheet-Atelier generates elementary school German and Religion exams, worksheets, and printable handouts entirely in the browser using WebGPU plus WebLLM. No server, no API keys. Runs locally on a regular laptop.

> Built with Next.js 16 (App Router, React 19) and configured for static site export for GitHub Pages.  
> Deploys automatically on every push to `main`.

---

## Features

- On-device LLM (WebLLM plus WebGPU). First model download shows a progress bar, then cached offline.
- Worksheet and exam generator with grade, subject, and topic selection.
- Live streaming preview shows content as it's generated.
- Multiple generation queue with status tracking and cancellation.
- PDF preview and export using @react-pdf/renderer (DIN A4 layout).
- DOCX export with docx library (compatible with Word, LibreOffice, OpenOffice).
- Copy to clipboard functionality for generated content.
- Curated topic libraries for Deutsch and Religion with detailed focus areas and sample prompts.
- Persistent storage of generated results in browser localStorage.

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
- Fallback: `Llama-3.2-1B-Instruct-q4f16_1-MLC` (lighter option for mid-range GPUs, ≈0.7 GB download).
- Alternative: `Llama-2-7b-chat-hf-q4f32_1-MLC-1k` (larger model for better quality, ≈4.0 GB download).

You can select models in the UI or change the default in `lib/model.ts`. The app uses the prebuilt WebLLM model list and caches downloaded models in IndexedDB.

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

## Generation Workflow

1. Select a subject (Deutsch or Religion)
2. Choose grade level (1-4 or all grades)
3. Pick a topic from the curated library or enter a custom prompt
4. Click generate to add to queue
5. Watch live streaming preview as content is generated
6. Download as PDF or DOCX, or copy to clipboard

Generated content includes worksheets, exercises, and educational materials tailored to elementary school curriculum.

---

## Preview and Export

- Live streaming preview shows content as it's being generated with a blinking cursor.
- Once complete, view formatted PDF preview with proper A4 layout.
- Export options:
  - **PDF:** Renders using @react-pdf/renderer with proper page layout, headers, and footers.
  - **DOCX:** Converts markdown to structured Word document using the docx library.
  - **Clipboard:** Copy markdown content directly to clipboard.

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

## Technical Stack

**Core:**

- Next.js 16.0.7 with App Router
- React 19.2.1
- TypeScript 5.9.3
- Tailwind CSS 4.1.17

**AI/ML:**

- @mlc-ai/web-llm 0.2.80 for on-device inference

**Export:**

- @react-pdf/renderer 4.3.1 for PDF generation
- docx 9.5.1 for Word document export
- file-saver 2.0.5 for downloads

**Markdown:**

- markdown-it 14.1.0 for parsing
- react-markdown 10.1.0 for rendering

---

## Privacy

All generation happens locally in the browser. The model is downloaded once (about 1.4 GB for 3B int4), cached in IndexedDB, and reused offline.

---

## Credits

- WebLLM (MLC) - in-browser LLM engine
- Meta Llama 3.2 (3B and 1B variants) and Llama 2 (7B)
- Next.js for static site generation
- @react-pdf/renderer and docx for export
