"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Crown, Zap } from "lucide-react"
import { useSubscription } from "@/lib/subscription-context"

interface UsageData {
  mealPlansThisWeek: number
  workoutsThisWeek: number
  sideEffectEntries: number
}

export function UsageLimits() {
  const { tier, features } = useSubscription()
  const [usage, setUsage] = useState<UsageData>({
    mealPlansThisWeek: 0,
    workoutsThisWeek: 0,
    sideEffectEntries: 0,
  })

  useEffect(() => {
    // Load usage from localStorage
    const saved = localStorage.getItem("weightoff-usage")
    if (saved) {
      setUsage(JSON.parse(saved))
    }
  }, [])

  const getMealPlanProgress = () => {
    if (features.maxMealPlansPerWeek === -1) return 0
    return (usage.mealPlansThisWeek / features.maxMealPlansPerWeek) * 100
  }

  const getWorkoutProgress = () => {
    if (features.maxWorkoutsPerWeek === -1) return 0
    return (usage.workoutsThisWeek / features.maxWorkoutsPerWeek) * 100
  }

  const getSideEffectProgress = () => {
    if (features.maxSideEffectEntries === -1) return 0
    return (usage.sideEffectEntries / features.maxSideEffectEntries) * 100
  }

  if (tier === "premium") {
    return (
      <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-400" />
            <span className="font-medium text-yellow-300">Premium - Unlimited Access</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Usage This Week
        </CardTitle>
        <CardDescription>Track your feature usage limits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Meal Plans */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">AI Meal Plans</span>
            <span className="text-sm text-muted-foreground">
              {usage.mealPlansThisWeek} / {features.maxMealPlansPerWeek === -1 ? "∞" : features.maxMealPlansPerWeek}
            </span>
          </div>
          {features.maxMealPlansPerWeek !== -1 && (
            <>
              <Progress value={getMealPlanProgress()} className="h-2" />
              {getMealPlanProgress() > 80 && (
                <div className="flex items-center gap-2 text-orange-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs">Approaching limit</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Workouts */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">AI Workouts</span>
            <span className="text-sm text-muted-foreground">
              {usage.workoutsThisWeek} / {features.maxWorkoutsPerWeek === -1 ? "∞" : features.maxWorkoutsPerWeek}
            </span>
          </div>
          {features.maxWorkoutsPerWeek !== -1 && (
            <>
              <Progress value={getWorkoutProgress()} className="h-2" />
              {getWorkoutProgress() > 80 && (
                <div className="flex items-center gap-2 text-orange-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs">Approaching limit</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Side Effects */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Side Effect Entries</span>
            <span className="text-sm text-muted-foreground">
              {usage.sideEffectEntries} / {features.maxSideEffectEntries === -1 ? "∞" : features.maxSideEffectEntries}
            </span>
          </div>
          {features.maxSideEffectEntries !== -1 && (
            <>
              <Progress value={getSideEffectProgress()} className="h-2" />
              {getSideEffectProgress() > 80 && (
                <div className="flex items-center gap-2 text-orange-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs">Approaching limit</span>
                </div>
              )}
            </>
          )}
        </div>

        {tier === "free" && (
          <div className="pt-4 border-t">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">Upgrade for unlimited access to all features</p>
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                Upgrade Now
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
