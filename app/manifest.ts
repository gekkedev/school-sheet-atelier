import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

  return {
    id: `${basePath}/`,
    name: "SchoolSheet-Atelier",
    short_name: "Atelier",
    description: "Arbeitsblätter und Unterrichtsmaterialien für Deutsch und Religion erstellen.",
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f172a",
    lang: "de",
    orientation: "any",
    icons: [
      {
        src: `${basePath}/android-chrome-192x192.png`,
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: `${basePath}/android-chrome-512x512.png`,
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: `${basePath}/android-chrome-512x512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  }
}
