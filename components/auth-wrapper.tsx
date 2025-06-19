"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"

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

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem("weightoff-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem("weightoff-user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("weightoff-user")
    localStorage.removeItem("weightoff-data")
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-background">Loading...</div>
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <div className="min-h-screen bg-background">{children}</div>
}
