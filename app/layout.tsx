import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { generateSEOMetadata, generateOrganizationSchema, generatePersonSchema } from "@/lib/seo-utils"
import { WebsiteStructuredData, StructuredData } from "@/components/seo/structured-data"
import "./globals.css"

export const metadata: Metadata = {
  ...generateSEOMetadata({
    title: "TRISKIDEAS - The Mind's Fruit",
    description: "Explore ideas about human potential, personal development, and making positive change. By Dr. Ferdinand Ibu Ogbaji",
    keywords: [
      "human potential",
      "personal development",
      "self improvement",
      "wellness",
      "mindfulness",
      "philosophy",
      "medicine",
      "art",
      "creativity",
      "inspiration",
      "Dr Ferdinand Ibu Ogbaji",
      "TRISKIDEAS"
    ],
    url: "/",
    type: "website"
  }),
  generator: "Next.js",
  applicationName: "TRISKIDEAS",
  referrer: "origin-when-cross-origin",
  authors: [{ name: "Dr. Ferdinand Ibu Ogbaji" }],
  creator: "Dr. Ferdinand Ibu Ogbaji",
  publisher: "TRISKIDEAS",
  category: "Education",
  classification: "Personal Development",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.ico", sizes: "16x16" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icon.svg",
        color: "#f97316",
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#f97316",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#f97316",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = generateOrganizationSchema()
  const personSchema = generatePersonSchema()

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vercel-insights.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
      </head>
      <body className="font-glacial antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
        <WebsiteStructuredData />
        <StructuredData data={organizationSchema} />
        <StructuredData data={personSchema} />
      </body>
    </html>
  )
}
