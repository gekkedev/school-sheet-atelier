import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx"
import { pdf } from "@react-pdf/renderer"
import { saveAs } from "file-saver"
import { PDFDocumentContent } from "@/components/pdf-preview"

type MarkdownElement =
  | { type: "title"; content: string }
  | { type: "h2"; content: string }
  | { type: "h3"; content: string }
  | { type: "paragraph"; content: string }
  | { type: "listItem"; content: string }

function parseMarkdown(markdown: string): MarkdownElement[] {
  const lines = markdown.split("\n")
  const elements: MarkdownElement[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Title (first # heading)
    if (line.startsWith("# ")) {
      elements.push({ type: "title", content: line.substring(2).trim() })
    }
    // H2
    else if (line.startsWith("## ")) {
      elements.push({ type: "h2", content: line.substring(3).trim() })
    }
    // H3
    else if (line.startsWith("### ")) {
      elements.push({ type: "h3", content: line.substring(4).trim() })
    }
    // List item
    else if (line.startsWith("- ") || line.startsWith("* ") || /^\d+\./.test(line)) {
      const content = line.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, "")
      elements.push({ type: "listItem", content })
    }
    // Regular paragraph
    else {
      elements.push({ type: "paragraph", content: line })
    }
  }

  return elements
}

function createDocxParagraphs(elements: MarkdownElement[]): Paragraph[] {
  return elements.map(element => {
    switch (element.type) {
      case "title":
        return new Paragraph({
          text: element.content,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 }
        })
      case "h2":
        return new Paragraph({
          text: element.content,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      case "h3":
        return new Paragraph({
          text: element.content,
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 100, after: 80 }
        })
      case "listItem":
        return new Paragraph({
          text: element.content,
          bullet: { level: 0 },
          spacing: { after: 80 }
        })
      case "paragraph":
        return new Paragraph({
          text: element.content,
          spacing: { after: 120 }
        })
    }
  })
}

export async function exportToPDF(content: string, title: string, filename: string) {
  try {
    const blob = await pdf(<PDFDocumentContent content={content} title={title} />).toBlob()
    saveAs(blob, filename)
  } catch (error) {
    console.error("PDF export failed:", error)
    throw new Error("PDF-Export fehlgeschlagen")
  }
}

export async function exportToDOCX(content: string, title: string, filename: string) {
  try {
    const elements = parseMarkdown(content)
    const paragraphs = createDocxParagraphs(elements)

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs
        }
      ]
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, filename)
  } catch (error) {
    console.error("DOCX export failed:", error)
    throw new Error("DOCX-Export fehlgeschlagen")
  }
}
