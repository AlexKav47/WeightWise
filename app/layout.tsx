import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SubscriptionProvider } from "@/lib/subscription-context"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WeightWise - Your AI-Powered GLP-1 Companion",
  description:
    "Navigate Mounjaro, Ozempic, and Wegovy with confidence. Get personalized meal plans, adaptive workouts, and 24/7 AI support.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SubscriptionProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SubscriptionProvider>
      </body>
    </html>
  )
}

