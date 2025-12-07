"use client"

import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer"
import ReactMarkdown from "react-markdown"
import { useState, useEffect, memo } from "react"

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
    fontWeight: "bold"
  },
  heading2: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 8,
    fontWeight: "bold"
  },
  heading3: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 6,
    fontWeight: "bold"
  },
  paragraph: {
    marginBottom: 8,
    lineHeight: 1.5,
    textAlign: "justify"
  },
  listItem: {
    marginLeft: 20,
    marginBottom: 4,
    lineHeight: 1.4
  },
  bold: {
    fontWeight: "bold"
  },
  italic: {
    fontStyle: "italic"
  },
  viewer: {
    width: "100%",
    height: "600px",
    border: "none"
  }
})

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

interface PDFDocumentProps {
  content: string
  title: string
}

export function PDFDocumentContent({ content, title }: PDFDocumentProps) {
  const elements = parseMarkdown(content)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {elements.map((element, index) => {
          switch (element.type) {
            case "title":
              return (
                <Text key={index} style={styles.title}>
                  {element.content}
                </Text>
              )
            case "h2":
              return (
                <Text key={index} style={styles.heading2}>
                  {element.content}
                </Text>
              )
            case "h3":
              return (
                <Text key={index} style={styles.heading3}>
                  {element.content}
                </Text>
              )
            case "listItem":
              return (
                <Text key={index} style={styles.listItem}>
                  • {element.content}
                </Text>
              )
            case "paragraph":
              return (
                <Text key={index} style={styles.paragraph}>
                  {element.content}
                </Text>
              )
            default:
              return null
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
