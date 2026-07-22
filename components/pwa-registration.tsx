"use client"

import { useEffect } from "react"

export function PwaRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
    navigator.serviceWorker
      .register(`${basePath}/sw.js`, { scope: `${basePath}/`, updateViaCache: "none" })
      .catch(error => console.warn("Service worker registration failed", error))
  }, [])

  return null
}
