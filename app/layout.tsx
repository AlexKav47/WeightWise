import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SubscriptionProvider } from "@/lib/subscription-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WeightOff - Your AI-Powered GLP-1 Companion",
  description:
    "Navigate Mounjaro, Ozempic, and Wegovy with confidence. Get personalized meal plans, adaptive workouts, and 24/7 AI support.",
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
        <SubscriptionProvider>{children}</SubscriptionProvider>
      </body>
    </html>
  )
}
