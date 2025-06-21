"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Target, Flame, Award, TrendingUp, Crown, Heart, Shield, Sparkles, Medal, Gift } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatWeight, getUserWeightPreference } from "@/lib/weight-utils"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: "weight" | "consistency" | "health" | "community" | "milestone"
  rarity: "common" | "rare" | "epic" | "legendary"
  unlocked: boolean
  unlockedDate?: Date
  progress?: number
  maxProgress?: number
  xpReward: number
}

interface Streak {
  type: string
  current: number
  best: number
  icon: React.ReactNode
  color: string
}

interface LevelInfo {
  current: number
  xp: number
  xpToNext: number
  title: string
  perks: string[]
}

export function EnhancedGamification() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [streaks, setStreaks] = useState<Streak[]>([])
  const [levelInfo, setLevelInfo] = useState<LevelInfo>({
    current: 1,
    xp: 0,
    xpToNext: 100,
    title: "Getting Started",
    perks: ["Basic tracking", "AI meal suggestions"],
  })
  const [weeklyGoal, setWeeklyGoal] = useState({ current: 0, target: 7, percentage: 0 })
  const [progressData, setProgressData] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    updateAchievementsAndStats()
  }, [])

  const updateAchievementsAndStats = () => {
    // Get weight data
    const weightData = JSON.parse(localStorage.getItem("weightoff-weight-data") || "[]")
    const injectionData = JSON.parse(localStorage.getItem("weightoff-injection-data") || "[]")
    const sideEffectsData = JSON.parse(localStorage.getItem("weightoff-side-effects") || "[]")

    const currentWeight = weightData.length > 0 ? weightData[weightData.length - 1].weight : 0
    const startWeight = weightData.length > 0 ? weightData[0].weight : 0
    const totalLost = startWeight > 0 ? startWeight - currentWeight : 0

    // Get user's preferred weight unit
    const userWeightUnit = getUserWeightPreference()

    // Convert weight thresholds based on user's unit preference
    const getWeightThreshold = (lbs: number) => {
      switch (userWeightUnit) {
        case "kg":
          return lbs / 2.20462 // Convert lbs to kg
        case "stone":
          return lbs // Keep in lbs for stone calculation
        default:
          return lbs // Already in lbs
      }
    }

    // Calculate streaks
    const today = new Date()
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())

    // Daily logging streak
    let dailyStreak = 0
    const currentDate = new Date(today)
    while (currentDate >= weekStart) {
      const dateStr = currentDate.toISOString().split("T")[0]
      const hasWeight = weightData.some((entry: any) => entry.date === dateStr)
      const hasInjection = injectionData.some((entry: any) => entry.date === dateStr)
      const hasSideEffect = sideEffectsData.some((entry: any) => entry.date === dateStr)

      if (hasWeight || hasInjection || hasSideEffect) {
        dailyStreak++
      } else {
        break
      }
      currentDate.setDate(currentDate.getDate() - 1)
    }

    // Weekly activity count
    const weeklyWeights = weightData.filter((entry: any) => new Date(entry.date) >= weekStart).length
    const weeklyInjections = injectionData.filter((entry: any) => new Date(entry.date) >= weekStart).length
    const weeklyTotal = weeklyWeights + weeklyInjections
    const weeklyPercentage = Math.min((weeklyTotal / 7) * 100, 100)

    // Calculate XP and level based on weight loss
    let totalXP = 0
    totalXP += weightData.length * 25 // 25 XP per weight entry
    totalXP += injectionData.length * 50 // 50 XP per injection
    totalXP += sideEffectsData.length * 15 // 15 XP per side effect log
    totalXP += Math.floor(totalLost) * 100 // 100 XP per pound lost

    // Level calculation based on weight loss milestones
    let currentLevel = 1
    let levelTitle = "Getting Started"
    let levelPerks = ["Basic tracking", "AI meal suggestions"]

    if (totalLost >= 20) {
      currentLevel = 8
      levelTitle = "Weight Loss Legend"
      levelPerks = ["3x XP weekends", "Premium meal plans", "VIP AI support", "Advanced analytics"]
    } else if (totalLost >= 15) {
      currentLevel = 7
      levelTitle = "Transformation Master"
      levelPerks = ["2x XP weekends", "Exclusive meal plans", "Priority AI support", "Progress insights"]
    } else if (totalLost >= 10) {
      currentLevel = 6
      levelTitle = "Weight Loss Warrior"
      levelPerks = ["Weekend XP boost", "Custom meal plans", "Enhanced AI support"]
    } else if (totalLost >= 5) {
      currentLevel = 4
      levelTitle = "Progress Pioneer"
      levelPerks = ["Advanced tracking", "Personalized meal plans", "AI coaching"]
    } else if (totalLost >= 2) {
      currentLevel = 2
      levelTitle = "Journey Starter"
      levelPerks = ["Enhanced tracking", "Basic meal suggestions", "AI tips"]
    }

    const xpToNextLevel = currentLevel * 500

    // Update achievements based on actual data with user's weight unit
    const initialAchievements: Achievement[] = [
      // Weight Loss Achievements
      {
        id: "first-weigh-in",
        title: "First Steps",
        description: "Log your first weight entry",
        icon: <Target className="h-5 w-5" />,
        category: "weight",
        rarity: "common",
        unlocked: weightData.length > 0,
        unlockedDate: weightData.length > 0 ? new Date(weightData[0].date) : undefined,
        xpReward: 50,
      },
      {
        id: "first-loss",
        title: "Breaking Barriers",
        description: `Lose your first ${formatWeight(getWeightThreshold(2), userWeightUnit)}`,
        icon: <Trophy className="h-5 w-5" />,
        category: "weight",
        rarity: "common",
        unlocked: totalLost >= getWeightThreshold(2),
        unlockedDate: totalLost >= getWeightThreshold(2) ? new Date() : undefined,
        progress: Math.min(totalLost, getWeightThreshold(2)),
        maxProgress: getWeightThreshold(2),
        xpReward: 100,
      },
      {
        id: "five-pounds",
        title: "Momentum Builder",
        description: `Lose ${formatWeight(getWeightThreshold(5), userWeightUnit)} - you're on fire!`,
        icon: <Medal className="h-5 w-5" />,
        category: "weight",
        rarity: "rare",
        unlocked: totalLost >= getWeightThreshold(5),
        unlockedDate: totalLost >= getWeightThreshold(5) ? new Date() : undefined,
        progress: Math.min(totalLost, getWeightThreshold(5)),
        maxProgress: getWeightThreshold(5),
        xpReward: 200,
      },
      {
        id: "ten-pounds",
        title: "Double Digits",
        description: `Lose ${formatWeight(getWeightThreshold(10), userWeightUnit)} - you're unstoppable!`,
        icon: <Crown className="h-5 w-5" />,
        category: "weight",
        rarity: "epic",
        unlocked: totalLost >= getWeightThreshold(10),
        unlockedDate: totalLost >= getWeightThreshold(10) ? new Date() : undefined,
        progress: Math.min(totalLost, getWeightThreshold(10)),
        maxProgress: getWeightThreshold(10),
        xpReward: 300,
      },
      {
        id: "fifteen-pounds",
        title: "Transformation Master",
        description: `Lose ${formatWeight(getWeightThreshold(15), userWeightUnit)} - incredible progress!`,
        icon: <Sparkles className="h-5 w-5" />,
        category: "weight",
        rarity: "legendary",
        unlocked: totalLost >= getWeightThreshold(15),
        unlockedDate: totalLost >= getWeightThreshold(15) ? new Date() : undefined,
        progress: Math.min(totalLost, getWeightThreshold(15)),
        maxProgress: getWeightThreshold(15),
        xpReward: 500,
      },
      {
        id: "twenty-pounds",
        title: "Phoenix Rising",
        description: `Lose ${formatWeight(getWeightThreshold(20), userWeightUnit)} - you're a new person!`,
        icon: <Sparkles className="h-5 w-5" />,
        category: "weight",
        rarity: "legendary",
        unlocked: totalLost >= getWeightThreshold(20),
        unlockedDate: totalLost >= getWeightThreshold(20) ? new Date() : undefined,
        progress: Math.min(totalLost, getWeightThreshold(20)),
        maxProgress: getWeightThreshold(20),
        xpReward: 750,
      },

      // Consistency Achievements
      {
        id: "week-streak",
        title: "Consistency Champion",
        description: "Log data for 7 days straight",
        icon: <Flame className="h-5 w-5" />,
        category: "consistency",
        rarity: "common",
        unlocked: dailyStreak >= 7,
        unlockedDate: dailyStreak >= 7 ? new Date() : undefined,
        progress: Math.min(dailyStreak, 7),
        maxProgress: 7,
        xpReward: 75,
      },
      {
        id: "month-streak",
        title: "Dedication Dynamo",
        description: "Maintain a 30-day logging streak",
        icon: <Shield className="h-5 w-5" />,
        category: "consistency",
        rarity: "epic",
        unlocked: dailyStreak >= 30,
        unlockedDate: dailyStreak >= 30 ? new Date() : undefined,
        progress: Math.min(dailyStreak, 30),
        maxProgress: 30,
        xpReward: 400,
      },

      // Health Achievements
      {
        id: "first-injection",
        title: "Injection Tracker",
        description: "Log your first injection",
        icon: <Award className="h-5 w-5" />,
        category: "health",
        rarity: "common",
        unlocked: injectionData.length > 0,
        unlockedDate: injectionData.length > 0 ? new Date(injectionData[0].date) : undefined,
        xpReward: 50,
      },
      {
        id: "side-effect-master",
        title: "Side Effect Sage",
        description: "Track side effects for 2 weeks",
        icon: <Heart className="h-5 w-5" />,
        category: "health",
        rarity: "rare",
        unlocked: sideEffectsData.length >= 14,
        unlockedDate: sideEffectsData.length >= 14 ? new Date() : undefined,
        progress: Math.min(sideEffectsData.length, 14),
        maxProgress: 14,
        xpReward: 150,
      },

      // Milestone Achievements
      {
        id: "data-master",
        title: "Data Master",
        description: "Log 50 total entries",
        icon: <Gift className="h-5 w-5" />,
        category: "milestone",
        rarity: "rare",
        unlocked: weightData.length + injectionData.length + sideEffectsData.length >= 50,
        unlockedDate: weightData.length + injectionData.length + sideEffectsData.length >= 50 ? new Date() : undefined,
        progress: Math.min(weightData.length + injectionData.length + sideEffectsData.length, 50),
        maxProgress: 50,
        xpReward: 250,
      },
    ]

    const initialStreaks: Streak[] = [
      {
        type: "Daily Logging",
        current: dailyStreak,
        best: Math.max(dailyStreak, 0),
        icon: <Flame className="h-4 w-4" />,
        color: "text-orange-400",
      },
      {
        type: "Weekly Weigh-ins",
        current: weeklyWeights,
        best: Math.max(weeklyWeights, 0),
        icon: <Target className="h-4 w-4" />,
        color: "text-purple-400",
      },
      {
        type: "Injection Schedule",
        current: injectionData.length,
        best: injectionData.length,
        icon: <Award className="h-4 w-4" />,
        color: "text-blue-400",
      },
    ]

    // Progress chart data based on actual weight entries
    const chartData = weightData.slice(-8).map((entry: any, index: number) => ({
      week: `Week ${index + 1}`,
      xp: (index + 1) * 25, // Remove Math.random() component
      level: Math.floor(((index + 1) * 25) / 500) + 1,
    }))

    setAchievements(initialAchievements)
    setStreaks(initialStreaks)
    setProgressData(chartData)
    setWeeklyGoal({ current: weeklyTotal, target: 7, percentage: weeklyPercentage })
    setLevelInfo({
      current: currentLevel,
      xp: totalXP,
      xpToNext: xpToNextLevel,
      title: levelTitle,
      perks: levelPerks,
    })
  }

  // Listen for storage changes to update achievements
  useEffect(() => {
    const handleStorageChange = () => {
      updateAchievementsAndStats()
    }

    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom events when localStorage is updated in the same tab
    window.addEventListener("weightoff-data-updated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("weightoff-data-updated", handleStorageChange)
    }
  }, [])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-500/30 bg-gray-500/10"
      case "rare":
        return "border-blue-500/30 bg-blue-500/10"
      case "epic":
        return "border-purple-500/30 bg-purple-500/10"
      case "legendary":
        return "border-yellow-500/30 bg-yellow-500/10"
      default:
        return "border-gray-500/30 bg-gray-500/10"
    }
  }

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-400"
      case "rare":
        return "text-blue-400"
      case "epic":
        return "text-purple-400"
      case "legendary":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  const filteredAchievements =
    selectedCategory === "all" ? achievements : achievements.filter((a) => a.category === selectedCategory)

  const levelProgress = ((levelInfo.xp % 500) / 500) * 100
  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalXP = levelInfo.xp

  return (
    <div className="space-y-6">
      {/* Level & XP Overview */}
      <Card className="gradient-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Crown className="h-6 w-6 text-yellow-400" />
                Level {levelInfo.current}
              </CardTitle>
              <CardDescription className="text-lg">{levelInfo.title}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-400">{levelInfo.xp.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total XP</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress to Level {levelInfo.current + 1}</span>
                <span className="text-sm text-muted-foreground">
                  {levelInfo.xp % 500} / {levelInfo.xpToNext} XP
                </span>
              </div>
              <Progress value={levelProgress} className="h-3" />
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Level Perks
              </h4>
              <div className="flex flex-wrap gap-2">
                {levelInfo.perks.map((perk, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                    {perk}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Chart - Single Chart Only */}
      {progressData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              XP Progress Over Time
            </CardTitle>
            <CardDescription>Your journey to greatness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="linear"
                    dataKey="xp"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ fill: "#a855f7", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Streaks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5" />
              Active Streaks
            </CardTitle>
            <CardDescription>Keep the momentum going!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {streaks.map((streak, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-muted ${streak.color}`}>{streak.icon}</div>
                    <div>
                      <span className="text-sm font-medium text-foreground">{streak.type}</span>
                      <div className="text-xs text-muted-foreground">Best: {streak.best} days</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${streak.color}`}>{streak.current}</div>
                    <div className="text-xs text-muted-foreground">days</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Challenge */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Weekly Challenge
            </CardTitle>
            <CardDescription>Complete all goals for bonus XP</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                <div className="text-3xl font-bold text-purple-400 mb-1">{weeklyGoal.percentage.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground mb-3">Weekly Progress</div>
                <Progress value={weeklyGoal.percentage} className="h-2" />
                <div className="text-xs text-muted-foreground mt-2">
                  {weeklyGoal.current} of {weeklyGoal.target} goals completed
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Bonus XP Available</span>
                  <Badge className="bg-yellow-500/20 text-yellow-300">+500 XP</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Complete all weekly goals to earn bonus experience points!
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Achievements
            </CardTitle>
            <CardDescription>
              {unlockedCount} of {achievements.length} unlocked • {totalXP.toLocaleString()} XP earned
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            <Button
              variant={selectedCategory === "weight" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("weight")}
            >
              Weight
            </Button>
            <Button
              variant={selectedCategory === "consistency" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("consistency")}
            >
              Streaks
            </Button>
            <Button
              variant={selectedCategory === "health" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("health")}
            >
              Health
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-4 p-4 rounded-lg border ${getRarityColor(achievement.rarity)} ${
                  achievement.unlocked ? "opacity-100" : "opacity-60"
                }`}
              >
                <div
                  className={`p-3 rounded-full ${
                    achievement.unlocked
                      ? `${getRarityColor(achievement.rarity)} ${getRarityTextColor(achievement.rarity)}`
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`font-medium ${achievement.unlocked ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {achievement.title}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getRarityTextColor(achievement.rarity)} border-current`}
                    >
                      {achievement.rarity}
                    </Badge>
                    {achievement.unlocked && (
                      <Badge className="bg-emerald-500/20 text-emerald-300 text-xs">+{achievement.xpReward} XP</Badge>
                    )}
                  </div>
                  <p
                    className={`text-sm ${achievement.unlocked ? "text-muted-foreground" : "text-muted-foreground/70"}`}
                  >
                    {achievement.description}
                  </p>
                  {achievement.progress !== undefined && achievement.maxProgress && (
                    <div className="mt-2">
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-1" />
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatWeight(achievement.progress, getUserWeightPreference())} /{" "}
                        {formatWeight(achievement.maxProgress, getUserWeightPreference())}
                      </div>
                    </div>
                  )}
                  {achievement.unlocked && achievement.unlockedDate && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Unlocked {achievement.unlockedDate.toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
