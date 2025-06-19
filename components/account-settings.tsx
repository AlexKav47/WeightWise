"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Crown, CreditCard, Trash2 } from "lucide-react"
import { useSubscription } from "@/lib/subscription-context"
import { toast } from "@/components/ui/use-toast"

interface UserProfile {
  name: string
  email: string
  startWeight?: number
  currentWeight?: number
  targetWeight?: number
  medicationDose?: string
  startDate?: string
}

export function AccountSettings() {
  const { tier, cancelSubscription } = useSubscription()
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load user profile from localStorage
    const savedUser = localStorage.getItem("weightoff-user")
    if (savedUser) {
      setProfile(JSON.parse(savedUser))
    }
  }, [])

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem("weightoff-user", JSON.stringify(profile))

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // Clear all data
        localStorage.removeItem("weightoff-user")
        localStorage.removeItem("weightoff-weight-data")
        localStorage.removeItem("weightoff-injection-data")
        localStorage.removeItem("weightoff-side-effects")
        localStorage.removeItem("subscription-tier")

        toast({
          title: "Account Deleted",
          description: "Your account has been successfully deleted.",
        })

        // Redirect to login
        window.location.reload()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete account. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const getTierBadge = () => {
    switch (tier) {
      case "premium":
        return (
          <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        )
      case "plus":
        return <Badge className="bg-purple-600 text-white">Plus</Badge>
      default:
        return <Badge variant="outline">Free</Badge>
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Account Settings</h2>
        <p className="text-muted-foreground">Manage your profile and subscription settings</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startWeight">Start Weight (lbs)</Label>
              <Input
                id="startWeight"
                type="number"
                step="0.1"
                value={profile.startWeight || ""}
                onChange={(e) => setProfile((prev) => ({ ...prev, startWeight: Number.parseFloat(e.target.value) }))}
                placeholder="Starting weight"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentWeight">Current Weight (lbs)</Label>
              <Input
                id="currentWeight"
                type="number"
                step="0.1"
                value={profile.currentWeight || ""}
                onChange={(e) => setProfile((prev) => ({ ...prev, currentWeight: Number.parseFloat(e.target.value) }))}
                placeholder="Current weight"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetWeight">Target Weight (lbs)</Label>
              <Input
                id="targetWeight"
                type="number"
                step="0.1"
                value={profile.targetWeight || ""}
                onChange={(e) => setProfile((prev) => ({ ...prev, targetWeight: Number.parseFloat(e.target.value) }))}
                placeholder="Goal weight"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Current Medication & Dose</Label>
            <Select
              value={profile.medicationDose || ""}
              onValueChange={(value) => setProfile((prev) => ({ ...prev, medicationDose: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your medication and dose" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Mounjaro (Tirzepatide)</div>
                <SelectItem value="mounjaro-2.5mg">Mounjaro 2.5mg</SelectItem>
                <SelectItem value="mounjaro-5mg">Mounjaro 5mg</SelectItem>
                <SelectItem value="mounjaro-7.5mg">Mounjaro 7.5mg</SelectItem>
                <SelectItem value="mounjaro-10mg">Mounjaro 10mg</SelectItem>
                <SelectItem value="mounjaro-12.5mg">Mounjaro 12.5mg</SelectItem>
                <SelectItem value="mounjaro-15mg">Mounjaro 15mg</SelectItem>

                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-2">Ozempic (Semaglutide)</div>
                <SelectItem value="ozempic-0.25mg">Ozempic 0.25mg</SelectItem>
                <SelectItem value="ozempic-0.5mg">Ozempic 0.5mg</SelectItem>
                <SelectItem value="ozempic-1mg">Ozempic 1mg</SelectItem>
                <SelectItem value="ozempic-2mg">Ozempic 2mg</SelectItem>

                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-2">Wegovy (Semaglutide)</div>
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

          <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>

      {/* Subscription Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription
          </CardTitle>
          <CardDescription>Manage your subscription and billing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <div className="font-medium text-foreground">Current Plan</div>
              <div className="text-sm text-muted-foreground capitalize">{tier} subscription</div>
            </div>
            <div className="flex items-center gap-2">{getTierBadge()}</div>
          </div>

          {tier !== "free" && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Your subscription will renew automatically. You can cancel anytime.
              </div>
              <Button
                variant="outline"
                onClick={cancelSubscription}
                className="text-red-400 border-red-400 hover:bg-red-400/10"
              >
                Cancel Subscription
              </Button>
            </div>
          )}

          {tier === "free" && (
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
              <div className="font-medium text-foreground mb-2">Upgrade Your Experience</div>
              <div className="text-sm text-muted-foreground mb-3">
                Get unlimited access to AI features, community discussions, and advanced analytics.
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">View Plans</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Data & Privacy
          </CardTitle>
          <CardDescription>Manage your data and account deletion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="font-medium text-red-300 mb-2">Danger Zone</div>
            <div className="text-sm text-red-400/80 mb-3">
              Permanently delete your account and all associated data. This action cannot be undone.
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
