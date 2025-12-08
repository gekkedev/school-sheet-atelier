"use client"

import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer"
import { useState, useEffect, memo } from "react"
import MarkdownIt from "markdown-it"

const md = new MarkdownIt()

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff"
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontFamily: "Helvetica-Bold"
  },
  heading2: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 8,
    fontFamily: "Helvetica-Bold"
  },
  heading3: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 6,
    fontFamily: "Helvetica-Bold"
  },
  paragraph: {
    marginBottom: 8,
    lineHeight: 1.5,
    textAlign: "justify"
  },
  listItem: {
    marginLeft: 20,
    marginBottom: 4,
    lineHeight: 1.4,
    flexDirection: "row"
  },
  listBullet: {
    width: 15
  },
  bold: {
    fontFamily: "Helvetica-Bold"
  },
  italic: {
    fontFamily: "Helvetica-Oblique"
  },
  boldItalic: {
    fontFamily: "Helvetica-BoldOblique"
  },
  viewer: {
    width: "100%",
    height: "600px",
    border: "none"
  }
})

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

function renderTextSegments(segments: TextSegment[]) {
  return segments.map((segment, idx) => {
    let style = {}
    if (segment.bold && segment.italic) {
      style = styles.boldItalic
    } else if (segment.bold) {
      style = styles.bold
    } else if (segment.italic) {
      style = styles.italic
    }

    return (
      <Text key={idx} style={style}>
        {segment.text}
      </Text>
    )
  })
}

interface PDFDocumentProps {
  content: string
  title: string
}

export function PDFDocumentContent({ content, title }: PDFDocumentProps) {
  const elements = parseMarkdownToElements(content)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {elements.map((element, index) => {
          switch (element.type) {
            case "h1":
              return (
                <Text key={index} style={styles.title}>
                  {renderTextSegments(element.segments)}
                </Text>
              )
            case "h2":
              return (
                <Text key={index} style={styles.heading2}>
                  {renderTextSegments(element.segments)}
                </Text>
              )
            case "h3":
              return (
                <Text key={index} style={styles.heading3}>
                  {renderTextSegments(element.segments)}
                </Text>
              )
            case "listItem":
              return (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={{ flex: 1 }}>{renderTextSegments(element.segments)}</Text>
                </View>
              )
            case "paragraph":
              return (
                <Text key={index} style={styles.paragraph}>
                  {renderTextSegments(element.segments)}
                </Text>
              )
          }
        })}
      </Page>
    </Document>
  )
}

interface PDFPreviewProps {
  content: string
  title: string
}

export const PDFPreview = memo(function PDFPreview({ content, title }: PDFPreviewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-600">PDF wird geladen...</p>
      </div>
    )
  }

  return (
    <PDFViewer style={styles.viewer} showToolbar={true}>
      <PDFDocumentContent content={content} title={title} />
    </PDFViewer>
  )
})
