"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"

interface OnboardingData {
  startWeight?: number
  targetWeight?: number
  medicationDose?: string
  startDate?: string
  goals?: string[]
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({})

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(data)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="gradient-card backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Welcome to WeightOff!</CardTitle>
                <CardDescription>Let's personalize your GLP-1 journey</CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Current Weight Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startWeight">Current Weight (lbs)</Label>
                    <Input
                      id="startWeight"
                      type="number"
                      placeholder="Enter your current weight"
                      value={data.startWeight || ""}
                      onChange={(e) => updateData({ startWeight: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetWeight">Target Weight (lbs)</Label>
                    <Input
                      id="targetWeight"
                      type="number"
                      placeholder="Your goal weight"
                      value={data.targetWeight || ""}
                      onChange={(e) => updateData({ targetWeight: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Medication Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current GLP-1 Medication & Dose</Label>
                    <Select
                      value={data.medicationDose}
                      onValueChange={(value) => updateData({ medicationDose: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your medication and dose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mounjaro-2.5mg">Mounjaro 2.5mg</SelectItem>
                        <SelectItem value="mounjaro-5mg">Mounjaro 5mg</SelectItem>
                        <SelectItem value="mounjaro-7.5mg">Mounjaro 7.5mg</SelectItem>
                        <SelectItem value="mounjaro-10mg">Mounjaro 10mg</SelectItem>
                        <SelectItem value="mounjaro-12.5mg">Mounjaro 12.5mg</SelectItem>
                        <SelectItem value="mounjaro-15mg">Mounjaro 15mg</SelectItem>
                        <SelectItem value="ozempic-0.25mg">Ozempic 0.25mg</SelectItem>
                        <SelectItem value="ozempic-0.5mg">Ozempic 0.5mg</SelectItem>
                        <SelectItem value="ozempic-1mg">Ozempic 1mg</SelectItem>
                        <SelectItem value="ozempic-2mg">Ozempic 2mg</SelectItem>
                        <SelectItem value="wegovy-0.25mg">Wegovy 0.25mg</SelectItem>
                        <SelectItem value="wegovy-0.5mg">Wegovy 0.5mg</SelectItem>
                        <SelectItem value="wegovy-1mg">Wegovy 1mg</SelectItem>
                        <SelectItem value="wegovy-1.7mg">Wegovy 1.7mg</SelectItem>
                        <SelectItem value="wegovy-2.4mg">Wegovy 2.4mg</SelectItem>
                        <SelectItem value="rybelsus-3mg">Rybelsus 3mg</SelectItem>
                        <SelectItem value="rybelsus-7mg">Rybelsus 7mg</SelectItem>
                        <SelectItem value="rybelsus-14mg">Rybelsus 14mg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-blue-300">
                      💡 This helps us provide personalized meal plans and side effect management tips specific to your
                      medication.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Your Goals</h3>
                <p className="text-muted-foreground">What would you like to focus on? (Select all that apply)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Steady weight loss",
                    "Managing side effects",
                    "Building healthy habits",
                    "Staying motivated",
                    "Meal planning",
                    "Exercise routine",
                    "Community support",
                    "Tracking progress",
                  ].map((goal) => (
                    <div
                      key={goal}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        data.goals?.includes(goal)
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-border hover:border-purple-500/50"
                      }`}
                      onClick={() => {
                        const currentGoals = data.goals || []
                        const newGoals = currentGoals.includes(goal)
                          ? currentGoals.filter((g) => g !== goal)
                          : [...currentGoals, goal]
                        updateData({ goals: newGoals })
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {data.goals?.includes(goal) && <CheckCircle className="h-4 w-4 text-purple-400" />}
                        <span className="text-sm">{goal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4 text-center">
                <h3 className="text-xl font-semibold text-foreground">You're All Set! 🎉</h3>
                <p className="text-muted-foreground">
                  Your personalized WeightOff experience is ready. We'll help you track your progress, manage side
                  effects, and stay motivated on your GLP-1 journey.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Smart Tracking</h4>
                    <p className="text-sm text-muted-foreground">Log weight, injections, and side effects</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">AI Recommendations</h4>
                    <p className="text-sm text-muted-foreground">Personalized meals and workouts</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">24/7 Support</h4>
                    <p className="text-sm text-muted-foreground">AI copilot for instant help</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2"
              >
                {currentStep === totalSteps ? "Start Journey" : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
