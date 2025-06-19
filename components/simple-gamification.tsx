"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Flame, Crown, Star, Award, Medal, Shield, Sparkles, Zap, Gem } from "lucide-react"

interface LevelBadge {
  level: number
  title: string
  description: string
  weightLoss: number
  icon: React.ReactNode
  color: string
  unlocked: boolean
}

export function SimpleGamification() {
  // Update the initial weight loss values for fresh accounts:
  const [currentWeightLoss] = useState(0) // Start with 0 instead of 15
  const [startWeight] = useState(0) // Will be set when user logs first weight
  const [currentWeight] = useState(0) // Will be set when user logs first weight
  const [levelBadges, setLevelBadges] = useState<LevelBadge[]>([])
  const [currentLevel, setCurrentLevel] = useState(0)
  const [nextLevel, setNextLevel] = useState(0)
  const [progressToNext, setProgressToNext] = useState(0)

  useEffect(() => {
    // Define level badges based on weight loss milestones
    const badges: LevelBadge[] = [
      {
        level: 1,
        title: "First Steps",
        description: "Lost your first 2 pounds",
        weightLoss: 2,
        icon: <Target className="h-6 w-6" />,
        color: "text-gray-400",
        unlocked: currentWeightLoss >= 2,
      },
      {
        level: 2,
        title: "Getting Started",
        description: "Lost 5 pounds",
        weightLoss: 5,
        icon: <Star className="h-6 w-6" />,
        color: "text-blue-400",
        unlocked: currentWeightLoss >= 5,
      },
      {
        level: 3,
        title: "Weight Loss Champion",
        description: "Lost 10 pounds",
        weightLoss: 10,
        icon: <Trophy className="h-6 w-6" />,
        color: "text-emerald-400",
        unlocked: currentWeightLoss >= 10,
      },
      {
        level: 4,
        title: "Transformation Master",
        description: "Lost 15 pounds",
        weightLoss: 15,
        icon: <Crown className="h-6 w-6" />,
        color: "text-purple-400",
        unlocked: currentWeightLoss >= 15,
      },
      {
        level: 5,
        title: "Milestone Crusher",
        description: "Lost 20 pounds",
        weightLoss: 20,
        icon: <Medal className="h-6 w-6" />,
        color: "text-orange-400",
        unlocked: currentWeightLoss >= 20,
      },
      {
        level: 6,
        title: "Dedication Dynamo",
        description: "Lost 25 pounds",
        weightLoss: 25,
        icon: <Flame className="h-6 w-6" />,
        color: "text-red-400",
        unlocked: currentWeightLoss >= 25,
      },
      {
        level: 7,
        title: "Wellness Warrior",
        description: "Lost 30 pounds",
        weightLoss: 30,
        icon: <Shield className="h-6 w-6" />,
        color: "text-indigo-400",
        unlocked: currentWeightLoss >= 30,
      },
      {
        level: 8,
        title: "Phoenix Rising",
        description: "Lost 35 pounds",
        weightLoss: 35,
        icon: <Sparkles className="h-6 w-6" />,
        color: "text-pink-400",
        unlocked: currentWeightLoss >= 35,
      },
      {
        level: 9,
        title: "Transformation Titan",
        description: "Lost 40 pounds",
        weightLoss: 40,
        icon: <Zap className="h-6 w-6" />,
        color: "text-yellow-400",
        unlocked: currentWeightLoss >= 40,
      },
      {
        level: 10,
        title: "Legend",
        description: "Lost 50+ pounds",
        weightLoss: 50,
        icon: <Gem className="h-6 w-6" />,
        color: "text-cyan-400",
        unlocked: currentWeightLoss >= 50,
      },
    ]

    setLevelBadges(badges)

    // Calculate current level
    const unlockedBadges = badges.filter((badge) => badge.unlocked)
    const currentLevelBadge = unlockedBadges[unlockedBadges.length - 1]
    const nextLevelBadge = badges.find((badge) => !badge.unlocked)

    setCurrentLevel(currentLevelBadge?.level || 0)
    setNextLevel(nextLevelBadge?.level || badges[badges.length - 1].level)

    // Calculate progress to next level
    if (nextLevelBadge) {
      const previousWeight = currentLevelBadge?.weightLoss || 0
      const nextWeight = nextLevelBadge.weightLoss
      const progress = ((currentWeightLoss - previousWeight) / (nextWeight - previousWeight)) * 100
      setProgressToNext(Math.max(0, Math.min(100, progress)))
    } else {
      setProgressToNext(100)
    }
  }, [currentWeightLoss])

  const currentBadge = levelBadges.find((badge) => badge.level === currentLevel)
  const nextBadge = levelBadges.find((badge) => badge.level === nextLevel)
  const weightLossPercent = startWeight > 0 ? (currentWeightLoss / startWeight) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Current Level Display */}
      <Card className="gradient-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentBadge && (
                <div className={`p-4 rounded-full bg-muted/50 ${currentBadge.color}`}>{currentBadge.icon}</div>
              )}
              <div>
                <CardTitle className="text-2xl">Level {currentLevel}</CardTitle>
                <CardDescription className="text-lg">{currentBadge?.title || "Getting Started"}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-400">{currentWeightLoss}</div>
              <div className="text-sm text-muted-foreground">lbs lost</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nextBadge && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress to Level {nextLevel}</span>
                  <span className="text-sm text-muted-foreground">
                    {currentWeightLoss} / {nextBadge.weightLoss} lbs
                  </span>
                </div>
                <Progress value={progressToNext} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">
                  {nextBadge.weightLoss - currentWeightLoss} lbs to unlock "{nextBadge.title}"
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-400">{currentWeightLoss}</div>
                <div className="text-sm text-muted-foreground">Total Lost</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{weightLossPercent.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{currentWeight}</div>
                <div className="text-sm text-muted-foreground">Current</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badge Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Badge Collection
          </CardTitle>
          <CardDescription>Unlock badges as you reach weight loss milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {levelBadges.map((badge) => (
              <div
                key={badge.level}
                className={`flex flex-col items-center p-4 rounded-lg border transition-all ${
                  badge.unlocked ? "bg-muted/50 border-border opacity-100" : "bg-muted/20 border-muted opacity-40"
                }`}
              >
                <div
                  className={`p-3 rounded-full mb-3 ${
                    badge.unlocked ? `bg-muted/50 ${badge.color}` : "bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {badge.icon}
                </div>
                <div className="text-center">
                  <div
                    className={`font-medium text-sm mb-1 ${badge.unlocked ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {badge.title}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{badge.weightLoss} lbs</div>
                  {badge.unlocked && <Badge className="bg-emerald-500/20 text-emerald-300 text-xs">Unlocked</Badge>}
                  {!badge.unlocked && badge.level === nextLevel && (
                    <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                      Next Goal
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivation Section */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">
              {nextBadge
                ? `${nextBadge.weightLoss - currentWeightLoss} lbs to your next badge!`
                : "You've unlocked all badges! 🎉"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {nextBadge
                ? `Keep going strong! You're on track to become a "${nextBadge.title}"`
                : "Incredible achievement! You're a true weight loss legend."}
            </p>
            {nextBadge && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground">Next badge:</span>
                <div className={`p-2 rounded-full bg-muted/50 ${nextBadge.color}`}>{nextBadge.icon}</div>
                <span className="font-medium text-foreground">{nextBadge.title}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
