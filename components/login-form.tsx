"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { ProfileSetup } from "@/components/profile-setup"

interface User {
  id: string
  name: string
  email: string
  startWeight?: number
  currentWeight?: number
  targetWeight?: number
  medicationDose?: string
  startDate?: string
}

interface LoginFormProps {
  onLogin: (user: User) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [showProfileSetup, setShowProfileSetup] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isSignUp) {
      // For new sign-ups, show profile setup
      setShowProfileSetup(true)
    } else {
      // For existing users, check if profile exists
      const existingProfile = localStorage.getItem("weightoff-user")
      if (existingProfile) {
        const profileData = JSON.parse(existingProfile)
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          ...profileData,
        }
        onLogin(user)
      } else {
        // If no profile exists, show setup
        setShowProfileSetup(true)
      }
    }
  }

  const handleProfileComplete = (profileData: any) => {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: profileData.name,
      email: profileData.email,
      startWeight: profileData.startWeight,
      currentWeight: profileData.currentWeight,
      targetWeight: profileData.targetWeight,
      medicationDose: profileData.medicationDose,
      startDate: new Date().toISOString(),
    }
    setShowProfileSetup(false)
    onLogin(user)
  }

  return (
    <>
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full shadow-lg">
                <Activity className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              WeightOff
            </h1>
            <p className="text-gray-300 mt-2">Your AI-powered wellness companion</p>
          </div>

          <Card className="gradient-card backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">{isSignUp ? "Get Started" : "Welcome Back"}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {isSignUp
                  ? "Create your account to start your wellness journey"
                  : "Sign in to continue your wellness journey"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                  disabled={!formData.name || !formData.email}
                >
                  {isSignUp ? "Create Account" : "Sign In"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <ProfileSetup isOpen={showProfileSetup} onComplete={handleProfileComplete} initialData={formData} />
    </>
  )
}
