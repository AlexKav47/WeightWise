"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Crown, Sparkles } from "lucide-react"
import { useSubscription } from "@/lib/subscription-context"
import { StripeCheckout } from "@/components/stripe-checkout"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface SubscriptionGateProps {
  feature: string
  requiredTier: "plus" | "premium"
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function SubscriptionGate({ feature, requiredTier, children, fallback }: SubscriptionGateProps) {
  const { tier, features } = useSubscription()

  const hasAccess = () => {
    if (requiredTier === "plus") {
      return tier === "plus" || tier === "premium"
    }
    return tier === "premium"
  }

  if (hasAccess()) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <Card className="border-dashed border-2 border-muted">
      <CardContent className="p-8 text-center">
        <div className="flex justify-center mb-4">
          {requiredTier === "premium" ? (
            <Crown className="h-16 w-16 text-yellow-400" />
          ) : (
            <Lock className="h-16 w-16 text-purple-400" />
          )}
        </div>

        <h3 className="text-xl font-semibold mb-2">{requiredTier === "premium" ? "Premium" : "Plus"} Feature</h3>

        <p className="text-muted-foreground mb-4">
          {feature} is available with {requiredTier === "premium" ? "Premium" : "Plus"} subscription.
        </p>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge
            className={`${requiredTier === "premium" ? "bg-yellow-500/20 text-yellow-300" : "bg-purple-500/20 text-purple-300"}`}
          >
            {requiredTier === "premium" ? (
              <>
                <Crown className="h-3 w-3 mr-1" />
                Premium Only
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-1" />
                Plus & Premium
              </>
            )}
          </Badge>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              className={`${
                requiredTier === "premium"
                  ? "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              } text-white`}
            >
              Upgrade to {requiredTier === "premium" ? "Premium" : "Plus"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>Choose Your Plan</DialogTitle>
              <DialogDescription>Unlock {feature} and many more features with a subscription.</DialogDescription>
            </DialogHeader>
            <StripeCheckout />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
