"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardOverview } from "@/components/dashboard-overview"
import { EnhancedInjectionTracker } from "@/components/enhanced-injection-tracker"
import { MealPlanner } from "@/components/meal-planner"
import { WorkoutGenerator } from "@/components/workout-generator"
import { HealthCopilot } from "@/components/health-copilot"
import { SimpleGamification } from "@/components/simple-gamification"
import { Navigation } from "@/components/navigation"
import { EnhancedWeightTracker } from "@/components/enhanced-weight-tracker"
import { SideEffectsTracker } from "@/components/side-effects-tracker"
import { CommunityDiscussions } from "@/components/community-discussions"
import { DataExport } from "@/components/data-export"
import { SubscriptionGate } from "@/components/subscription-gate"
import { StripeCheckout } from "@/components/stripe-checkout"
import { useSubscription } from "@/lib/subscription-context"

export function DashboardContent() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { tier } = useSubscription()

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="meals">Meals</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="injections">Injections</TabsTrigger>
            <TabsTrigger value="copilot">Copilot</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="meals">
            <SubscriptionGate feature="Unlimited AI Meal Plans" requiredTier="plus" fallback={<MealPlanner />}>
              <MealPlanner />
            </SubscriptionGate>
          </TabsContent>

          <TabsContent value="workouts">
            <SubscriptionGate feature="Unlimited AI Workouts" requiredTier="plus" fallback={<WorkoutGenerator />}>
              <WorkoutGenerator />
            </SubscriptionGate>
          </TabsContent>

          <TabsContent value="injections">
            <EnhancedInjectionTracker />
          </TabsContent>

          <TabsContent value="copilot">
            <SubscriptionGate feature="24/7 AI Health Copilot" requiredTier="premium">
              <HealthCopilot />
            </SubscriptionGate>
          </TabsContent>

          <TabsContent value="community">
            <CommunityDiscussions />
          </TabsContent>

          <TabsContent value="progress">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <EnhancedWeightTracker />
              <SideEffectsTracker />
            </div>
            <div className="mb-6">
              <SimpleGamification />
            </div>
            <SubscriptionGate feature="Advanced Data Export" requiredTier="plus">
              <DataExport />
            </SubscriptionGate>
          </TabsContent>

          <TabsContent value="pricing">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Choose Your Plan
                </h2>
                <p className="text-xl text-muted-foreground">Unlock the full potential of your GLP-1 journey</p>
                {tier !== "free" && (
                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">Current plan: </span>
                    <span className="font-semibold text-foreground capitalize">{tier}</span>
                  </div>
                )}
              </div>
              <StripeCheckout />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
