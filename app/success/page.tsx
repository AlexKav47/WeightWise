"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSubscription } from "@/lib/subscription-context"

export default function SuccessPage() {
  const router = useRouter()
  const { upgradeTo } = useSubscription()

  useEffect(() => {
    // Simulate successful upgrade (in production, this would be handled by Stripe webhooks)
    const urlParams = new URLSearchParams(window.location.search)
    const plan = urlParams.get("plan") || "plus"
    upgradeTo(plan as any)
  }, [upgradeTo])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4 w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful! 🎉</CardTitle>
          <CardDescription>Welcome to your premium WeightWise experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <p className="text-sm text-emerald-300">
              Your subscription is now active and you have access to all premium features!
            </p>
          </div>

          <div className="space-y-2 text-left">
            <h4 className="font-medium">What's next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Access unlimited AI meal plans</li>
              <li>• Join the community discussions</li>
              <li>• Export your health data</li>
              <li>• Get advanced analytics</li>
            </ul>
          </div>

          <Button
            onClick={() => router.push("/")}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
          >
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
