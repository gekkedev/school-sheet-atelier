const CACHE_NAME = "schoolsheet-app-v1"
const APP_ROOT = new URL("./", self.registration.scope).href
const PRECACHE_FILES = [
  "manifest.webmanifest",
  "android-chrome-192x192.png",
  "android-chrome-512x512.png",
  "apple-touch-icon.png",
  "favicon-32x32.png",
  "favicon-16x16.png"
]

async function cacheAppShell() {
  const cache = await caches.open(CACHE_NAME)
  const response = await fetch(APP_ROOT, { cache: "reload" })
  if (!response.ok) throw new Error("App shell could not be loaded")
  await cache.put(APP_ROOT, response.clone())

  const html = await response.text()
  const buildAssets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map(match => new URL(match[1], APP_ROOT))
    .filter(url => url.origin === self.location.origin && url.pathname.includes("/_next/static/"))
  const files = [...new Set([...PRECACHE_FILES.map(file => new URL(file, APP_ROOT).href), ...buildAssets.map(String)])]

  await Promise.allSettled(
    files.map(async url => {
      const asset = await fetch(url, { cache: "reload" })
      if (asset.ok) await cache.put(url, asset)
    })
  )
}

self.addEventListener("install", event => {
  event.waitUntil(cacheAppShell().then(() => self.skipWaiting()))
})

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys.filter(key => key.startsWith("schoolsheet-app-") && key !== CACHE_NAME).map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", event => {
  const { request } = event
  const url = new URL(request.url)
  if (request.method !== "GET" || url.origin !== self.location.origin) return

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async response => {
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME)
            await cache.put(request, response.clone())
            await cache.put(APP_ROOT, response.clone())
          }
          return response
        })
        .catch(async () => (await caches.match(request)) ?? (await caches.match(APP_ROOT)))
    )
    return
  }

  if (url.pathname.includes("/_next/static/") || PRECACHE_FILES.some(file => url.pathname.endsWith(`/${file}`))) {
    event.respondWith(
      caches.match(request).then(
        cached =>
          cached ??
          fetch(request).then(async response => {
            if (response.ok) (await caches.open(CACHE_NAME)).put(request, response.clone())
            return response
          })
      )
    )
  }
})
