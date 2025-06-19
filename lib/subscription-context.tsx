"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type SubscriptionTier = "free" | "plus" | "premium"

interface SubscriptionContextType {
  tier: SubscriptionTier
  isLoading: boolean
  features: {
    maxMealPlansPerWeek: number
    maxWorkoutsPerWeek: number
    hasAICopilot: boolean
    hasCommunityAccess: boolean
    hasAdvancedAnalytics: boolean
    hasDataExport: boolean
    hasPrioritySupport: boolean
    maxSideEffectEntries: number
  }
  upgradeTo: (tier: SubscriptionTier) => void
  cancelSubscription: () => void
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<SubscriptionTier>("free")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load subscription from localStorage or API
    const savedTier = localStorage.getItem("subscription-tier") as SubscriptionTier
    if (savedTier) {
      setTier(savedTier)
    }
  }, [])

  const getFeatures = (currentTier: SubscriptionTier) => {
    switch (currentTier) {
      case "free":
        return {
          maxMealPlansPerWeek: 3,
          maxWorkoutsPerWeek: 2,
          hasAICopilot: false,
          hasCommunityAccess: false,
          hasAdvancedAnalytics: false,
          hasDataExport: false,
          hasPrioritySupport: false,
          maxSideEffectEntries: 10,
        }
      case "plus":
        return {
          maxMealPlansPerWeek: -1, // unlimited
          maxWorkoutsPerWeek: -1,
          hasAICopilot: false,
          hasCommunityAccess: true,
          hasAdvancedAnalytics: true,
          hasDataExport: true,
          hasPrioritySupport: false,
          maxSideEffectEntries: -1,
        }
      case "premium":
        return {
          maxMealPlansPerWeek: -1,
          maxWorkoutsPerWeek: -1,
          hasAICopilot: true,
          hasCommunityAccess: true,
          hasAdvancedAnalytics: true,
          hasDataExport: true,
          hasPrioritySupport: true,
          maxSideEffectEntries: -1,
        }
    }
  }

  const upgradeTo = async (newTier: SubscriptionTier) => {
    setIsLoading(true)
    try {
      // In production, this would call Stripe API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setTier(newTier)
      localStorage.setItem("subscription-tier", newTier)
    } catch (error) {
      console.error("Upgrade failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const cancelSubscription = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setTier("free")
      localStorage.setItem("subscription-tier", "free")
    } catch (error) {
      console.error("Cancellation failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        isLoading,
        features: getFeatures(tier),
        upgradeTo,
        cancelSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}
