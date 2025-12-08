import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx"
import { pdf } from "@react-pdf/renderer"
import { saveAs } from "file-saver"
import { PDFDocumentContent } from "@/components/pdf-preview"
import MarkdownIt from "markdown-it"

const md = new MarkdownIt()

type TextSegment = {
  text: string
  bold?: boolean
  italic?: boolean
  code?: boolean
}

type ContentElement =
  | { type: "h1"; segments: TextSegment[] }
  | { type: "h2"; segments: TextSegment[] }
  | { type: "h3"; segments: TextSegment[] }
  | { type: "paragraph"; segments: TextSegment[] }
  | { type: "listItem"; segments: TextSegment[] }

function parseInlineTokens(tokens: any[]): TextSegment[] {
  const segments: TextSegment[] = []
  let bold = false
  let italic = false
  let code = false

  for (const token of tokens) {
    if (token.type === "strong_open") {
      bold = true
    } else if (token.type === "strong_close") {
      bold = false
    } else if (token.type === "em_open") {
      italic = true
    } else if (token.type === "em_close") {
      italic = false
    } else if (token.type === "code_inline") {
      segments.push({ text: token.content, code: true })
    } else if (token.type === "text") {
      segments.push({ text: token.content, bold, italic })
    } else if (token.children) {
      segments.push(...parseInlineTokens(token.children))
    }
  }

  return segments
}

function parseMarkdownToElements(markdown: string): ContentElement[] {
  const tokens = md.parse(markdown, {})
  const elements: ContentElement[] = []

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    if (token.type === "heading_open") {
      const level = token.tag
      const inlineToken = tokens[i + 1]
      if (inlineToken && inlineToken.children) {
        const segments = parseInlineTokens(inlineToken.children)
        if (level === "h1") {
          elements.push({ type: "h1", segments })
        } else if (level === "h2") {
          elements.push({ type: "h2", segments })
        } else if (level === "h3") {
          elements.push({ type: "h3", segments })
        }
      }
      i += 2 // Skip inline and closing tokens
    } else if (token.type === "paragraph_open") {
      const inlineToken = tokens[i + 1]
      if (inlineToken && inlineToken.children) {
        const segments = parseInlineTokens(inlineToken.children)
        elements.push({ type: "paragraph", segments })
      }
      i += 2
    } else if (token.type === "bullet_list_open" || token.type === "ordered_list_open") {
      // Process list items
      i++
      while (i < tokens.length && tokens[i].type !== "bullet_list_close" && tokens[i].type !== "ordered_list_close") {
        if (tokens[i].type === "list_item_open") {
          // Find the paragraph inside the list item
          i++
          while (i < tokens.length && tokens[i].type !== "list_item_close") {
            if (tokens[i].type === "paragraph_open") {
              const inlineToken = tokens[i + 1]
              if (inlineToken && inlineToken.children) {
                const segments = parseInlineTokens(inlineToken.children)
                elements.push({ type: "listItem", segments })
              }
              i += 2
            } else if (tokens[i].type === "inline" && tokens[i].children) {
              const segments = parseInlineTokens(tokens[i].children!)
              elements.push({ type: "listItem", segments })
              i++
            } else {
              i++
            }
          }
        }
        i++
      }
    }
  }

  return elements
}

function createTextRuns(segments: TextSegment[]): TextRun[] {
  return segments.map(
    segment =>
      new TextRun({
        text: segment.text,
        bold: segment.bold,
        italics: segment.italic
      })
  )
}

function createDocxParagraphs(elements: ContentElement[]): Paragraph[] {
  return elements.map(element => {
    switch (element.type) {
      case "h1":
        return new Paragraph({
          children: createTextRuns(element.segments),
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 }
        })
      case "h2":
        return new Paragraph({
          children: createTextRuns(element.segments),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      case "h3":
        return new Paragraph({
          children: createTextRuns(element.segments),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 100, after: 80 }
        })
      case "listItem":
        return new Paragraph({
          children: createTextRuns(element.segments),
          bullet: { level: 0 },
          spacing: { after: 80 }
        })
      case "paragraph":
        return new Paragraph({
          children: createTextRuns(element.segments),
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
    const elements = parseMarkdownToElements(content)
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
