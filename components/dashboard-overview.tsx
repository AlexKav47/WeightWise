"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Activity,
  TrendingDown,
  CalendarIcon,
  Target,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Crown,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatWeight, getUserWeightPreference } from "@/lib/weight-utils"

interface QuickStat {
  label: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
}

export function DashboardOverview() {
  const [quickStats, setQuickStats] = useState<QuickStat[]>([])
  const [weeklyGoal, setWeeklyGoal] = useState({ current: 0, target: 7, percentage: 0 })
  const [nextInjection, setNextInjection] = useState({
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    overdue: false,
  })

  // Weight logging state
  const [showWeightDialog, setShowWeightDialog] = useState(false)
  const [newWeight, setNewWeight] = useState("")
  const [weightUnit, setWeightUnit] = useState("lbs")
  const [stoneWeight, setStoneWeight] = useState("")
  const [poundsWeight, setPoundsWeight] = useState("")
  const [selectedWeightDate, setSelectedWeightDate] = useState<Date | undefined>(new Date())

  // Injection logging state
  const [showInjectionDialog, setShowInjectionDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    updateStats()
  }, [])

  const updateStats = () => {
    // Get weight data
    const weightData = JSON.parse(localStorage.getItem("weightoff-weight-data") || "[]")
    const currentWeight = weightData.length > 0 ? weightData[weightData.length - 1].weight : 0
    const startWeight = weightData.length > 0 ? weightData[0].weight : 0
    const totalLost = startWeight > 0 ? startWeight - currentWeight : 0
    const weightLossPercent = startWeight > 0 ? (totalLost / startWeight) * 100 : 0

    // Get injection data
    const injectionData = JSON.parse(localStorage.getItem("weightoff-injection-data") || "[]")

    // Get weekly activity count
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const weeklyWeights = weightData.filter((entry: any) => new Date(entry.date) >= weekStart).length
    const weeklyInjections = injectionData.filter((entry: any) => new Date(entry.date) >= weekStart).length

    const weeklyTotal = weeklyWeights + weeklyInjections
    const weeklyPercentage = (weeklyTotal / 7) * 100

    const userWeightUnit = getUserWeightPreference()

    const stats: QuickStat[] = [
      {
        label: "Current Weight",
        value: currentWeight > 0 ? formatWeight(currentWeight, userWeightUnit) : "--",
        change: currentWeight > 0 ? "Weight logged" : "Log your first weight",
        trend: "neutral",
        icon: <TrendingDown className="h-4 w-4" />,
      },
      {
        label: "Total Lost",
        value: totalLost > 0 ? formatWeight(totalLost, userWeightUnit) : formatWeight(0, userWeightUnit),
        change: totalLost > 0 ? `${weightLossPercent.toFixed(1)}% progress` : "Start your journey",
        trend: totalLost > 0 ? "down" : "neutral",
        icon: <Target className="h-4 w-4" />,
      },
      {
        label: "Current Level",
        value: "Level 0",
        change: "Getting Started",
        trend: "neutral",
        icon: <Crown className="h-4 w-4" />,
      },
      {
        label: "This Week",
        value: `${weeklyTotal}/7 goals`,
        change: `${weeklyPercentage.toFixed(0)}% complete`,
        trend: weeklyTotal > 0 ? "up" : "neutral",
        icon: <CheckCircle className="h-4 w-4" />,
      },
    ]

    setQuickStats(stats)
    setWeeklyGoal({ current: weeklyTotal, target: 7, percentage: weeklyPercentage })
  }

  const handleWeightSubmit = () => {
    if (!selectedWeightDate) return

    let weightInLbs = 0

    if (weightUnit === "lbs") {
      if (!newWeight) return
      weightInLbs = Number.parseFloat(newWeight)
    } else if (weightUnit === "kg") {
      if (!newWeight) return
      weightInLbs = Number.parseFloat(newWeight) * 2.20462
    } else if (weightUnit === "stone") {
      if (!stoneWeight && !poundsWeight) return
      const stone = Number.parseFloat(stoneWeight) || 0
      const pounds = Number.parseFloat(poundsWeight) || 0
      weightInLbs = stone * 14 + pounds
    }

    const weightEntry = {
      date: selectedWeightDate.toISOString().split("T")[0],
      weight: weightInLbs,
    }

    const saved = localStorage.getItem("weightoff-weight-data")
    const existingEntries = saved ? JSON.parse(saved) : []

    const updated = [...existingEntries, weightEntry].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
    localStorage.setItem("weightoff-weight-data", JSON.stringify(updated))

    // Reset form and close dialog
    setNewWeight("")
    setStoneWeight("")
    setPoundsWeight("")
    setSelectedWeightDate(new Date())
    setShowWeightDialog(false)

    // Update stats
    updateStats()
  }

  const handleInjectionSubmit = () => {
    if (!selectedDate) return

    const injectionEntry = {
      date: selectedDate.toISOString().split("T")[0],
      dose: "7.5mg",
      medication: "Mounjaro",
      notes: "Injection logged",
    }

    const saved = localStorage.getItem("weightoff-injection-data")
    const existingInjections = saved ? JSON.parse(saved) : []

    const updated = [...existingInjections, injectionEntry].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    localStorage.setItem("weightoff-injection-data", JSON.stringify(updated))

    setShowInjectionDialog(false)
    updateStats()
  }

  const getTrendColor = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-emerald-400"
      case "down":
        return "text-purple-400"
      default:
        return "text-blue-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions - Moved to top */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to keep you on track</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setShowWeightDialog(true)}
            >
              <Activity className="h-6 w-6" />
              <span className="font-medium">Log Weight</span>
              <span className="text-xs text-muted-foreground">Track your progress</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setShowInjectionDialog(true)}
            >
              <CalendarIcon className="h-6 w-6" />
              <span className="font-medium">Log Injection</span>
              <span className="text-xs text-muted-foreground">Stay on schedule</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <MessageCircle className="h-6 w-6" />
              <span className="font-medium">Ask AI</span>
              <span className="text-xs text-muted-foreground">Get instant help</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-muted/50 ${getTrendColor(stat.trend)}`}>{stat.icon}</div>
                <Badge variant="outline" className="text-xs">
                  {stat.trend === "up" ? "↗" : stat.trend === "down" ? "↘" : "→"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className={`text-xs ${getTrendColor(stat.trend)}`}>{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Weekly Goals
            </CardTitle>
            <CardDescription>Track your consistency this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {weeklyGoal.current}/{weeklyGoal.target}
                  </span>
                </div>
                <Progress value={weeklyGoal.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{weeklyGoal.percentage.toFixed(0)}% complete</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-400" />
                    <span className="text-sm font-medium">Weight Logging</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={0} className="h-2 w-16" />
                    <span className="text-sm text-orange-400 font-medium">0/3</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-400" />
                    <span className="text-sm font-medium">Injections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={0} className="h-2 w-16" />
                    <span className="text-sm text-orange-400 font-medium">0/1</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-400" />
                    <span className="text-sm font-medium">Workouts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={0} className="h-2 w-16" />
                    <span className="text-sm text-orange-400 font-medium">0/3</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-400" />
                    <span className="text-sm font-medium">Meals Planned</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={0} className="h-2 w-16" />
                    <span className="text-sm text-orange-400 font-medium">0/7</span>
                  </div>
                </div>

                <div className="text-center p-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg">
                  <p className="text-sm text-purple-300">Ready to start your journey? 💪</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Medication Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Medication Schedule
            </CardTitle>
            <CardDescription>Stay on track with your injections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Next Injection</p>
                  <p className="text-sm text-muted-foreground">{nextInjection.date.toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">Set up your medication</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">7</div>
                  <div className="text-xs text-muted-foreground">days</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Getting Started</h4>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-blue-300">
                    💡 Log your first injection to start tracking your medication schedule and side effects.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weight Logging Dialog */}
      <Dialog open={showWeightDialog} onOpenChange={setShowWeightDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Your Weight</DialogTitle>
            <DialogDescription>Record your weight to track progress</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={selectedWeightDate}
                onSelect={setSelectedWeightDate}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <Label>Unit</Label>
              <Select value={weightUnit} onValueChange={setWeightUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="stone">Stone & Pounds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {weightUnit === "stone" ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stone">Stone</Label>
                  <Input
                    id="stone"
                    type="number"
                    step="1"
                    placeholder="0"
                    value={stoneWeight}
                    onChange={(e) => setStoneWeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pounds">Pounds</Label>
                  <Input
                    id="pounds"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={poundsWeight}
                    onChange={(e) => setPoundsWeight(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="weight">Weight ({weightUnit === "kg" ? "kg" : "lbs"})</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder={`Enter weight in ${weightUnit === "kg" ? "kg" : "lbs"}`}
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                />
              </div>
            )}

            <Button
              onClick={handleWeightSubmit}
              className="w-full"
              disabled={!selectedWeightDate || (weightUnit === "stone" ? !stoneWeight && !poundsWeight : !newWeight)}
            >
              Save Entry for {selectedWeightDate?.toLocaleDateString()}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Injection Logging Dialog */}
      <Dialog open={showInjectionDialog} onOpenChange={setShowInjectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Injection</DialogTitle>
            <DialogDescription>Record when you took your medication</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
            <Button onClick={handleInjectionSubmit} className="w-full" disabled={!selectedDate}>
              Log Injection for {selectedDate?.toLocaleDateString()}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
