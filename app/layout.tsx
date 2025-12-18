import type React from "react"
import type { Metadata, Viewport } from "next"
import { Nunito, Nunito_Sans } from "next/font/google"
import "./globals.css"

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" })
const nunitoSans = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunito-sans" })

export const metadata: Metadata = {
  title: "GeoBlitz - Geography Quiz Game",
  description:
    "Test your geography knowledge with GeoBlitz! A fast-paced quiz game featuring flags, capitals, country outlines, and map challenges.",
  keywords: ["geography", "quiz", "game", "flags", "capitals", "countries", "educational"],
  authors: [{ name: "GeoBlitz" }],
}

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${nunitoSans.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
