"use client"

import { useEffect } from "react"

export function PwaRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then(async registrations => {
        const hadController = Boolean(navigator.serviceWorker.controller)
        await Promise.all(
          registrations
            .filter(registration => registration.active?.scriptURL.endsWith("/sw.js"))
            .map(registration => registration.unregister())
        )
        if (hadController && !sessionStorage.getItem("schoolsheet-dev-sw-cleared")) {
          sessionStorage.setItem("schoolsheet-dev-sw-cleared", "true")
          location.reload()
        }
      })
      return
    }

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
    navigator.serviceWorker
      .register(`${basePath}/sw.js`, { scope: `${basePath}/`, updateViaCache: "none" })
      .catch(error => console.warn("Service worker registration failed", error))
  }, [])

  return null
}
