import assert from "node:assert/strict"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

const outDir = "out"
const basePath = process.argv.slice(2).find(argument => argument !== "--") ?? ""
const requiredFiles = [
  "index.html",
  "manifest.webmanifest",
  "sw.js",
  "android-chrome-192x192.png",
  "android-chrome-512x512.png"
]
requiredFiles.forEach(file => assert.ok(existsSync(join(outDir, file)), `${file} is missing from the export`))

const manifest = JSON.parse(readFileSync(join(outDir, "manifest.webmanifest"), "utf8"))
assert.equal(manifest.start_url, `${basePath}/`)
assert.equal(manifest.scope, `${basePath}/`)
assert.equal(manifest.display, "standalone")
assert.ok(manifest.name && manifest.short_name)

const index = readFileSync(join(outDir, "index.html"), "utf8")
assert.ok(index.includes(`href="${basePath}/manifest.webmanifest"`))

const chunksDir = join(outDir, "_next", "static", "chunks")
const chunks = readdirSync(chunksDir)
  .filter(file => file.endsWith(".js"))
  .map(file => readFileSync(join(chunksDir, file), "utf8"))
  .join("\n")
assert.ok(chunks.includes("/sw.js"), "service worker registration is missing")
if (basePath) assert.ok(chunks.includes(basePath), "service worker base path is missing")

const worker = readFileSync(join(outDir, "sw.js"), "utf8")
assert.ok(worker.includes('request.mode === "navigate"'))
assert.ok(worker.includes("fetch(request)"), "navigations must try the network before cached HTML")

console.log(`PWA export checks passed for ${basePath || "/"}`)
