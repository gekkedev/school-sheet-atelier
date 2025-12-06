"use client"

import { createContext, useContext } from "react"
import type { ReactNode } from "react"
import { useWebLLM } from "@/hooks/use-web-llm"

const WebLLMContext = createContext<ReturnType<typeof useWebLLM> | null>(null)

type WebLLMProviderProps = {
  children: ReactNode
  preferredModelId?: string
}

export function WebLLMProvider({ children, preferredModelId }: WebLLMProviderProps) {
  const value = useWebLLM(preferredModelId)
  return <WebLLMContext.Provider value={value}>{children}</WebLLMContext.Provider>
}

export function useWebLLMContext() {
  const ctx = useContext(WebLLMContext)
  if (!ctx) {
    throw new Error("useWebLLMContext must be used within a WebLLMProvider")
  }
  return ctx
}
