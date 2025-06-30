import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientSideEffects } from "@/components/client-side-effects"
import { Toaster } from "@/components/ui/toaster"
import 'highlight.js/styles/atom-one-dark.css'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hello World Blog",
  description: "A modern multi-page blog with categories for IT, Exhibition, Food, Fashion, Travel, and Lifestyle",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
        <ClientSideEffects />
      </body>
    </html>
  )
}
