"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Loader2 } from "lucide-react"
import { useSubscription, type SubscriptionTier } from "@/lib/subscription-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PricingPlan {
  tier: SubscriptionTier
  name: string
  monthlyPrice: number
  yearlyPrice: number
  description: string
  features: string[]
  popular?: boolean
  stripeMonthlyPriceId: string
  stripeYearlyPriceId: string
}

const PRICING_PLANS: PricingPlan[] = [
  {
    tier: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for getting started",
    features: [
      "Basic weight tracking",
      "3 AI meal plans per week",
      "2 workouts per week",
      "Injection reminders",
      "Basic side effect tracking (10 entries)",
    ],
    stripeMonthlyPriceId: "",
    stripeYearlyPriceId: "",
  },
  {
    tier: "plus",
    name: "Plus",
    monthlyPrice: 4.99,
    yearlyPrice: 49.99,
    description: "Enhanced AI features",
    popular: true,
    features: [
      "Everything in Free",
      "Unlimited AI meal plans",
      "Unlimited workouts",
      "Community access",
      "Advanced analytics",
      "Data export",
      "Unlimited side effect tracking",
    ],
    stripeMonthlyPriceId: "price_plus_monthly_123",
    stripeYearlyPriceId: "price_plus_yearly_123",
  },
  {
    tier: "premium",
    name: "Premium",
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    description: "Complete AI-powered experience",
    features: [
      "Everything in Plus",
      "24/7 AI Health Copilot",
      "Priority support",
      "Advanced gamification",
      "Detailed progress reports",
      "Early access to new features",
    ],
    stripeMonthlyPriceId: "price_premium_monthly_123",
    stripeYearlyPriceId: "price_premium_yearly_123",
  },
]

export function StripeCheckout() {
  const { tier: currentTier, upgradeTo, isLoading } = useSubscription()
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isYearly, setIsYearly] = useState(false)

  const handleUpgrade = async (plan: PricingPlan, yearly = false) => {
    if (plan.tier === "free") return

    setCheckoutLoading(plan.tier)

    try {
      // In production, this would integrate with Stripe
      // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      // const priceId = yearly ? plan.stripeYearlyPriceId : plan.stripeMonthlyPriceId
      // const { error } = await stripe.redirectToCheckout({
      //   lineItems: [{ price: priceId, quantity: 1 }],
      //   mode: 'subscription',
      //   successUrl: `${window.location.origin}/success`,
      //   cancelUrl: `${window.location.origin}/pricing`,
      // })

      // Simulate Stripe checkout
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await upgradeTo(plan.tier)
      setShowSuccess(true)
    } catch (error) {
      console.error("Checkout failed:", error)
    } finally {
      setCheckoutLoading(null)
    }
  }

  const calculateSavings = (plan: PricingPlan) => {
    const monthlyTotal = plan.monthlyPrice * 12
    const savings = monthlyTotal - plan.yearlyPrice
    const percentage = Math.round((savings / monthlyTotal) * 100)
    return { amount: savings, percentage }
  }

  return (
    <>
      {/* Billing Toggle */}
      <div className="flex items-center justify-center mb-8">
        <div className="bg-muted/50 p-1 rounded-lg flex items-center">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              !isYearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              isYearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Yearly
            <Badge className="ml-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Save 17%</Badge>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {PRICING_PLANS.map((plan) => {
          const savings = calculateSavings(plan)
          const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice

          return (
            <Card
              key={plan.tier}
              className={`relative flex flex-col h-full ${
                plan.popular ? "border-purple-500 shadow-lg scale-105" : ""
              } ${currentTier === plan.tier ? "bg-emerald-500/10 border-emerald-500" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">Most Popular</Badge>
                </div>
              )}
              {currentTier === plan.tier && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-emerald-500 text-white">Current Plan</Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="text-4xl font-bold text-foreground mt-4">
                  ${currentPrice}
                  <span className="text-lg text-muted-foreground">/{isYearly ? "year" : "month"}</span>
                  {isYearly && plan.tier !== "free" && (
                    <div className="text-sm text-emerald-400 font-normal">
                      ${(currentPrice / 12).toFixed(2)}/month • Save ${savings.amount}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => handleUpgrade(plan, isYearly)}
                  disabled={currentTier === plan.tier || checkoutLoading === plan.tier || isLoading}
                  className={`w-full ${
                    plan.tier === "premium"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      : plan.tier === "plus"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : ""
                  }`}
                  variant={plan.tier === "free" ? "outline" : "default"}
                >
                  {checkoutLoading === plan.tier ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : currentTier === plan.tier ? (
                    "Current Plan"
                  ) : plan.tier === "free" ? (
                    "Get Started Free"
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Upgrade to {plan.name}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🎉 Upgrade Successful!</DialogTitle>
            <DialogDescription>
              Welcome to your new subscription tier! You now have access to all the premium features.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowSuccess(false)} className="w-full">
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
