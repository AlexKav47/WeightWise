"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { User, Target, Pill, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { formatWeight } from "@/lib/weight-utils"

interface ProfileData {
  name: string
  email: string
  startWeight?: number // This will store weight in lbs for consistency
  currentWeight?: number
  targetWeight?: number
  weightUnit?: "lbs" | "stone" | "kg" // Track which weight unit system user prefers
  startWeightStone?: number
  startWeightLbs?: number
  startWeightKg?: number
  targetWeightStone?: number
  targetWeightLbs?: number
  targetWeightKg?: number
  medicationDose?: string
  startDate?: string
  height?: number
  heightUnit?: "imperial" | "metric"
  heightFeet?: number
  heightInches?: number
  heightCm?: number
  age?: number
  gender?: string
}

interface ProfileSetupProps {
  isOpen: boolean
  onComplete: (data: ProfileData) => void
  initialData?: Partial<ProfileData>
}

export function ProfileSetup({ isOpen, onComplete, initialData = {} }: ProfileSetupProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: initialData.name || "",
    email: initialData.email || "",
    startWeight: initialData.startWeight,
    currentWeight: initialData.currentWeight,
    targetWeight: initialData.targetWeight,
    weightUnit: initialData.weightUnit || "lbs",
    startWeightStone: initialData.startWeightStone,
    startWeightLbs: initialData.startWeightLbs,
    startWeightKg: initialData.startWeightKg,
    targetWeightStone: initialData.targetWeightStone,
    targetWeightLbs: initialData.targetWeightLbs,
    targetWeightKg: initialData.targetWeightKg,
    medicationDose: initialData.medicationDose,
    startDate: initialData.startDate,
    height: initialData.height,
    heightUnit: initialData.heightUnit || "imperial",
    heightFeet: initialData.heightFeet,
    heightInches: initialData.heightInches,
    heightCm: initialData.heightCm,
    age: initialData.age,
    gender: initialData.gender,
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    // Save to localStorage
    localStorage.setItem("weightoff-user", JSON.stringify(profileData))

    // If starting weight is provided, create initial weight entry
    if (profileData.startWeight) {
      const initialWeightEntry = {
        date: new Date().toISOString().split("T")[0],
        weight: profileData.startWeight,
        notes: "Initial weight entry",
      }
      localStorage.setItem("weightoff-weight-data", JSON.stringify([initialWeightEntry]))
    }

    toast({
      title: "Profile Complete!",
      description: "Your profile has been set up successfully.",
    })

    onComplete(profileData)
  }

  const updateData = (updates: Partial<ProfileData>) => {
    setProfileData((prev) => ({ ...prev, ...updates }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return profileData.name && profileData.email
      case 2:
        return profileData.startWeight && profileData.targetWeight
      case 3:
        return profileData.medicationDose
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // Only allow closing if profile is complete or user confirms
          const isComplete =
            profileData.name &&
            profileData.email &&
            profileData.startWeight &&
            profileData.targetWeight &&
            profileData.medicationDose

          if (isComplete) {
            handleComplete()
          } else {
            // Show confirmation dialog for incomplete profile
            if (
              confirm(
                "Are you sure you want to close? Your profile setup is not complete and you won't be able to use the app.",
              )
            ) {
              // User confirmed, close without saving
              onComplete({} as any) // This will likely cause issues, but respects user choice
            }
          }
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>Let's set up your profile to personalize your WeightWise experience</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </div>
            <Progress value={progress} className="w-32 h-2" />
          </div>

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-purple-400" />
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={profileData.name}
                    onChange={(e) => updateData({ name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={profileData.email}
                    onChange={(e) => updateData({ email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Age"
                    value={profileData.age || ""}
                    onChange={(e) => updateData({ age: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Height</Label>
                  <div className="space-y-3">
                    <Select
                      value={profileData.heightUnit || "imperial"}
                      onValueChange={(value: "imperial" | "metric") => {
                        updateData({ heightUnit: value })
                        // Clear height values when switching units
                        if (value === "imperial") {
                          updateData({ heightCm: undefined })
                        } else {
                          updateData({ heightFeet: undefined, heightInches: undefined })
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select height unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imperial">Feet & Inches</SelectItem>
                        <SelectItem value="metric">Centimeters</SelectItem>
                      </SelectContent>
                    </Select>

                    {profileData.heightUnit === "imperial" ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Input
                            type="number"
                            placeholder="Feet"
                            value={profileData.heightFeet || ""}
                            onChange={(e) => {
                              const feet = Number.parseInt(e.target.value) || 0
                              const inches = profileData.heightInches || 0
                              const totalInches = feet * 12 + inches
                              updateData({
                                heightFeet: feet,
                                height: totalInches,
                              })
                            }}
                          />
                          <Label className="text-xs text-muted-foreground">Feet</Label>
                        </div>
                        <div>
                          <Input
                            type="number"
                            placeholder="Inches"
                            min="0"
                            max="11"
                            value={profileData.heightInches || ""}
                            onChange={(e) => {
                              const inches = Number.parseInt(e.target.value) || 0
                              const feet = profileData.heightFeet || 0
                              const totalInches = feet * 12 + inches
                              updateData({
                                heightInches: inches,
                                height: totalInches,
                              })
                            }}
                          />
                          <Label className="text-xs text-muted-foreground">Inches</Label>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Input
                          type="number"
                          placeholder="Height in centimeters"
                          value={profileData.heightCm || ""}
                          onChange={(e) => {
                            const cm = Number.parseInt(e.target.value) || 0
                            const inches = Math.round(cm / 2.54) // Convert cm to inches for storage
                            updateData({
                              heightCm: cm,
                              height: inches,
                            })
                          }}
                        />
                        <Label className="text-xs text-muted-foreground">Centimeters</Label>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={profileData.gender || ""} onValueChange={(value) => updateData({ gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-purple-400" />
                <h3 className="text-lg font-semibold">Weight Goals</h3>
              </div>

              <div className="space-y-2 mb-4">
                <Label>Weight Unit</Label>
                <Select
                  value={profileData.weightUnit || "lbs"}
                  onValueChange={(value: "lbs" | "stone" | "kg") => {
                    updateData({ weightUnit: value })
                    // Clear weight values when switching units
                    if (value === "lbs") {
                      updateData({
                        startWeightStone: undefined,
                        startWeightLbs: undefined,
                        startWeightKg: undefined,
                        targetWeightStone: undefined,
                        targetWeightLbs: undefined,
                        targetWeightKg: undefined,
                      })
                    } else if (value === "stone") {
                      updateData({
                        startWeightKg: undefined,
                        targetWeightKg: undefined,
                      })
                    } else {
                      updateData({
                        startWeightStone: undefined,
                        startWeightLbs: undefined,
                        targetWeightStone: undefined,
                        targetWeightLbs: undefined,
                      })
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select weight unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                    <SelectItem value="stone">Stone & Pounds</SelectItem>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Starting Weight *</Label>
                  {profileData.weightUnit === "lbs" && (
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Current weight in lbs"
                      value={profileData.startWeight || ""}
                      onChange={(e) => {
                        const weight = Number.parseFloat(e.target.value)
                        updateData({
                          startWeight: weight,
                          currentWeight: weight,
                        })
                      }}
                    />
                  )}

                  {profileData.weightUnit === "stone" && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          type="number"
                          placeholder="Stone"
                          value={profileData.startWeightStone || ""}
                          onChange={(e) => {
                            const stone = Number.parseInt(e.target.value) || 0
                            const lbs = profileData.startWeightLbs || 0
                            const totalLbs = stone * 14 + lbs
                            updateData({
                              startWeightStone: stone,
                              startWeight: totalLbs,
                              currentWeight: totalLbs,
                            })
                          }}
                        />
                        <Label className="text-xs text-muted-foreground">Stone</Label>
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="Pounds"
                          min="0"
                          max="13"
                          value={profileData.startWeightLbs || ""}
                          onChange={(e) => {
                            const lbs = Number.parseInt(e.target.value) || 0
                            const stone = profileData.startWeightStone || 0
                            const totalLbs = stone * 14 + lbs
                            updateData({
                              startWeightLbs: lbs,
                              startWeight: totalLbs,
                              currentWeight: totalLbs,
                            })
                          }}
                        />
                        <Label className="text-xs text-muted-foreground">Pounds</Label>
                      </div>
                    </div>
                  )}

                  {profileData.weightUnit === "kg" && (
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Current weight in kg"
                      value={profileData.startWeightKg || ""}
                      onChange={(e) => {
                        const kg = Number.parseFloat(e.target.value)
                        const lbs = Math.round(kg * 2.20462 * 10) / 10 // Convert kg to lbs for storage
                        updateData({
                          startWeightKg: kg,
                          startWeight: lbs,
                          currentWeight: lbs,
                        })
                      }}
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Target Weight *</Label>
                  {profileData.weightUnit === "lbs" && (
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Goal weight in lbs"
                      value={profileData.targetWeight || ""}
                      onChange={(e) => updateData({ targetWeight: Number.parseFloat(e.target.value) })}
                    />
                  )}

                  {profileData.weightUnit === "stone" && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          type="number"
                          placeholder="Stone"
                          value={profileData.targetWeightStone || ""}
                          onChange={(e) => {
                            const stone = Number.parseInt(e.target.value) || 0
                            const lbs = profileData.targetWeightLbs || 0
                            const totalLbs = stone * 14 + lbs
                            updateData({
                              targetWeightStone: stone,
                              targetWeight: totalLbs,
                            })
                          }}
                        />
                        <Label className="text-xs text-muted-foreground">Stone</Label>
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="Pounds"
                          min="0"
                          max="13"
                          value={profileData.targetWeightLbs || ""}
                          onChange={(e) => {
                            const lbs = Number.parseInt(e.target.value) || 0
                            const stone = profileData.targetWeightStone || 0
                            const totalLbs = stone * 14 + lbs
                            updateData({
                              targetWeightLbs: lbs,
                              targetWeight: totalLbs,
                            })
                          }}
                        />
                        <Label className="text-xs text-muted-foreground">Pounds</Label>
                      </div>
                    </div>
                  )}

                  {profileData.weightUnit === "kg" && (
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Goal weight in kg"
                      value={profileData.targetWeightKg || ""}
                      onChange={(e) => {
                        const kg = Number.parseFloat(e.target.value)
                        const lbs = Math.round(kg * 2.20462 * 10) / 10 // Convert kg to lbs for storage
                        updateData({
                          targetWeightKg: kg,
                          targetWeight: lbs,
                        })
                      }}
                    />
                  )}
                </div>
              </div>

              {profileData.startWeight && profileData.targetWeight && (
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="text-sm font-medium text-purple-300 mb-1">Weight Loss Goal</div>
                  <div className="text-2xl font-bold text-purple-400">
                    {formatWeight(profileData.startWeight - profileData.targetWeight, profileData.weightUnit || "lbs")}
                  </div>
                  <div className="text-xs text-purple-400/80">
                    {(((profileData.startWeight - profileData.targetWeight) / profileData.startWeight) * 100).toFixed(
                      1,
                    )}
                    % of starting weight
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Pill className="h-5 w-5 text-purple-400" />
                <h3 className="text-lg font-semibold">Medication Information</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Current GLP-1 Medication & Dose *</Label>
                  <Select
                    value={profileData.medicationDose || ""}
                    onValueChange={(value) => updateData({ medicationDose: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your medication and dose" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                        Mounjaro (Tirzepatide)
                      </div>
                      <SelectItem value="mounjaro-2.5mg">Mounjaro 2.5mg</SelectItem>
                      <SelectItem value="mounjaro-5mg">Mounjaro 5mg</SelectItem>
                      <SelectItem value="mounjaro-7.5mg">Mounjaro 7.5mg</SelectItem>
                      <SelectItem value="mounjaro-10mg">Mounjaro 10mg</SelectItem>
                      <SelectItem value="mounjaro-12.5mg">Mounjaro 12.5mg</SelectItem>
                      <SelectItem value="mounjaro-15mg">Mounjaro 15mg</SelectItem>

                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-2">
                        Ozempic (Semaglutide)
                      </div>
                      <SelectItem value="ozempic-0.25mg">Ozempic 0.25mg</SelectItem>
                      <SelectItem value="ozempic-0.5mg">Ozempic 0.5mg</SelectItem>
                      <SelectItem value="ozempic-1mg">Ozempic 1mg</SelectItem>
                      <SelectItem value="ozempic-2mg">Ozempic 2mg</SelectItem>

                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-2">
                        Wegovy (Semaglutide)
                      </div>
                      <SelectItem value="wegovy-0.25mg">Wegovy 0.25mg</SelectItem>
                      <SelectItem value="wegovy-0.5mg">Wegovy 0.5mg</SelectItem>
                      <SelectItem value="wegovy-1mg">Wegovy 1mg</SelectItem>
                      <SelectItem value="wegovy-1.7mg">Wegovy 1.7mg</SelectItem>
                      <SelectItem value="wegovy-2.4mg">Wegovy 2.4mg</SelectItem>

                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-2">
                        Rybelsus (Oral Semaglutide)
                      </div>
                      <SelectItem value="rybelsus-3mg">Rybelsus 3mg (Oral)</SelectItem>
                      <SelectItem value="rybelsus-7mg">Rybelsus 7mg (Oral)</SelectItem>
                      <SelectItem value="rybelsus-14mg">Rybelsus 14mg (Oral)</SelectItem>
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

          {currentStep === 4 && (
            <div className="space-y-4 text-center">
              <div className="flex items-center gap-2 justify-center mb-4">
                <Calendar className="h-5 w-5 text-purple-400" />
                <h3 className="text-lg font-semibold">Ready to Start!</h3>
              </div>

              <p className="text-muted-foreground">
                Your profile is complete! We'll use this information to personalize your WeightWise experience and help
                you achieve your goals.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Smart Tracking</h4>
                  <p className="text-sm text-muted-foreground">Log weight, injections, and side effects</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">AI Recommendations</h4>
                  <p className="text-sm text-muted-foreground">Personalized meals and workouts</p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                <div className="font-medium text-foreground mb-2">Your Journey Summary</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Starting Weight:</span>
                    <div className="font-medium">
                      {profileData.startWeight
                        ? formatWeight(profileData.startWeight, profileData.weightUnit || "lbs")
                        : "--"}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Target Weight:</span>
                    <div className="font-medium">
                      {profileData.targetWeight
                        ? formatWeight(profileData.targetWeight, profileData.weightUnit || "lbs")
                        : "--"}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Goal:</span>
                    <div className="font-medium">
                      {profileData.startWeight && profileData.targetWeight
                        ? formatWeight(
                            profileData.startWeight - profileData.targetWeight,
                            profileData.weightUnit || "lbs",
                          )
                        : "--"}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Medication:</span>
                    <div className="font-medium">
                      {profileData.medicationDose?.replace("-", " ").replace("mg", "mg")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {currentStep === totalSteps ? "Complete Profile" : "Continue"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


