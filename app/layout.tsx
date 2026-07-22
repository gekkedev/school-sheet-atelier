import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { PwaRegistration } from "@/components/pwa-registration"
import "./globals.css"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "SchoolSheet-Atelier",
  description:
    "SchoolSheet-Atelier generates elementary school German and Religion exams, worksheets, and printable handouts entirely in the browser. Runs locally on a regular laptop.",
  manifest: `${basePath}/manifest.webmanifest`
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <head>
        <meta name="theme-color" content="#0f172a" />
        <link rel="apple-touch-icon" sizes="180x180" href={`${basePath}/apple-touch-icon.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${basePath}/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${basePath}/favicon-16x16.png`} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <PwaRegistration />
      </body>
    </html>
  )
}
