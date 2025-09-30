export type WebGPUSupport = {
  supported: boolean
  reason?: string
}

type NavigatorWithGPU = Navigator & {
  gpu?: unknown
}

export function detectWebGPU(): WebGPUSupport {
  if (typeof navigator === "undefined") {
    return { supported: false, reason: "Client-side only" }
  }

  const nav = navigator as NavigatorWithGPU
  const supported = typeof nav.gpu !== "undefined"
  if (supported) {
    return { supported: true }
  }

  let reason = "WebGPU wird von diesem Browser nicht unterstützt."
  const ua = (navigator.userAgent ?? "").toLowerCase()
  if (ua.includes("safari")) {
    reason = "Safari benötigt Version 17 oder neuer mit aktivierter WebGPU-Unterstützung."
  } else if (ua.includes("firefox")) {
    reason = "Firefox benötigt Version 141 oder neuer mit WebGPU."
  } else if (ua.includes("chrome") || ua.includes("edg")) {
    reason = "Chrome oder Edge ab Version 113 mit aktivem WebGPU wird benötigt."
  }

  return { supported: false, reason }
}
