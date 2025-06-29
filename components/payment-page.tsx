"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, ArrowLeft, CreditCard, Shield, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

interface PricingPlan {
  tier: "plus" | "premium"
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
    tier: "plus",
    name: "Plus",
    monthlyPrice: 4.99,
    yearlyPrice: 49.99,
    description: "Enhanced AI features",
    popular: true,
    features: [
      "Unlimited AI meal plans",
      "Unlimited workouts",
      "Community access",
      "Advanced analytics",
      "Data export",
      "Unlimited side effect tracking",
      "Priority email support",
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
      "Advanced gamification",
      "Detailed progress reports",
      "Early access to new features",
      "1-on-1 support calls",
      "Custom meal preferences",
      "Advanced workout customization",
    ],
    stripeMonthlyPriceId: "price_premium_monthly_123",
    stripeYearlyPriceId: "price_premium_yearly_123",
  },
]

export default function PaymentPage() {
  const router = useRouter()
  const [isYearly, setIsYearly] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const calculateSavings = (plan: PricingPlan) => {
    const monthlyTotal = plan.monthlyPrice * 12
    const savings = monthlyTotal - plan.yearlyPrice
    const percentage = Math.round((savings / monthlyTotal) * 100)
    return { amount: savings, percentage }
  }

  const handleSubscribe = async (plan: PricingPlan) => {
    setIsProcessing(true)
    setSelectedPlan(plan)

    try {
      // In production, this would integrate with Stripe
      // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      // const priceId = isYearly ? plan.stripeYearlyPriceId : plan.stripeMonthlyPriceId
      // const { error } = await stripe.redirectToCheckout({
      //   lineItems: [{ price: priceId, quantity: 1 }],
      //   mode: 'subscription',
      //   successUrl: `${window.location.origin}/success`,
      //   cancelUrl: `${window.location.origin}/pricing`,
      // })

      // Simulate Stripe checkout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful payment
      router.push("/success")
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setIsProcessing(false)
      setSelectedPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Choose Your Plan</h1>
            <p className="text-muted-foreground">Unlock the full potential of your health journey</p>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Label htmlFor="billing-toggle" className={!isYearly ? "font-medium" : "text-muted-foreground"}>
            Monthly
          </Label>
          <Switch id="billing-toggle" checked={isYearly} onCheckedChange={setIsYearly} />
          <Label htmlFor="billing-toggle" className={isYearly ? "font-medium" : "text-muted-foreground"}>
            Yearly
          </Label>
          <Badge className="bg-emerald-500 text-white ml-2">Save up to 17%</Badge>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {PRICING_PLANS.map((plan) => {
            const savings = calculateSavings(plan)
            const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice
            const originalMonthlyTotal = plan.monthlyPrice * (isYearly ? 12 : 1)

            return (
              <Card
                key={plan.tier}
                className={`relative flex flex-col h-full ${
                  plan.popular ? "border-purple-500 shadow-lg scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">Most Popular</Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>

                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-foreground">
                      ${currentPrice}
                      <span className="text-lg text-muted-foreground">/{isYearly ? "year" : "month"}</span>
                    </div>

                    {isYearly && (
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground line-through">
                          ${originalMonthlyTotal}/year (monthly billing)
                        </div>
                        <div className="text-sm text-emerald-400 font-medium">
                          Save ${savings.amount} ({savings.percentage}% off)
                        </div>
                        <div className="text-xs text-muted-foreground">
                          That's ${(currentPrice / 12).toFixed(2)}/month
                        </div>
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
                    onClick={() => handleSubscribe(plan)}
                    disabled={isProcessing && selectedPlan?.tier === plan.tier}
                    className={`w-full ${
                      plan.tier === "premium"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {isProcessing && selectedPlan?.tier === plan.tier ? (
                      <>
                        <CreditCard className="h-4 w-4 mr-2 animate-pulse" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Subscribe to {plan.name}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Trust Indicators */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Shield className="h-8 w-8 text-emerald-400" />
              <h3 className="font-medium">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">Your payment information is encrypted and secure</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Zap className="h-8 w-8 text-purple-400" />
              <h3 className="font-medium">Instant Access</h3>
              <p className="text-sm text-muted-foreground">Get immediate access to all premium features</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CreditCard className="h-8 w-8 text-blue-400" />
              <h3 className="font-medium">Cancel Anytime</h3>
              <p className="text-sm text-muted-foreground">No long-term commitments, cancel whenever you want</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}