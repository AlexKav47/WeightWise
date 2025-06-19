"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Flame, Star, Award, TrendingUp } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  progress?: number
  maxProgress?: number
}

interface Streak {
  type: string
  current: number
  best: number
  icon: React.ReactNode
}

export function Gamification() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [streaks, setStreaks] = useState<Streak[]>([])
  const [userStats, setUserStats] = useState({
    totalWeightLost: 15,
    weeklyGoalProgress: 75,
    level: 3,
    xp: 750,
    xpToNext: 1000,
  })

  useEffect(() => {
    // Initialize achievements
    const initialAchievements: Achievement[] = [
      {
        id: "first-weigh-in",
        title: "First Steps",
        description: "Log your first weight entry",
        icon: <Target className="h-5 w-5" />,
        unlocked: true,
      },
      {
        id: "first-injection",
        title: "Injection Tracker",
        description: "Log your first injection",
        icon: <Award className="h-5 w-5" />,
        unlocked: true,
      },
      {
        id: "five-pounds",
        title: "5 Pound Club",
        description: "Lose your first 5 pounds",
        icon: <Trophy className="h-5 w-5" />,
        unlocked: true,
      },
      {
        id: "ten-pounds",
        title: "Double Digits",
        description: "Lose 10 pounds",
        icon: <Trophy className="h-5 w-5" />,
        unlocked: true,
      },
      {
        id: "fifteen-pounds",
        title: "Milestone Master",
        description: "Lose 15 pounds",
        icon: <Trophy className="h-5 w-5" />,
        unlocked: true,
      },
      {
        id: "twenty-pounds",
        title: "Transformation",
        description: "Lose 20 pounds",
        icon: <Star className="h-5 w-5" />,
        unlocked: false,
        progress: 15,
        maxProgress: 20,
      },
      {
        id: "meal-planner",
        title: "Meal Master",
        description: "Generate your first AI meal plan",
        icon: <Award className="h-5 w-5" />,
        unlocked: false,
      },
      {
        id: "workout-warrior",
        title: "Workout Warrior",
        description: "Complete 5 AI-generated workouts",
        icon: <Trophy className="h-5 w-5" />,
        unlocked: false,
        progress: 2,
        maxProgress: 5,
      },
    ]

    const initialStreaks: Streak[] = [
      {
        type: "Daily Logging",
        current: 7,
        best: 12,
        icon: <Flame className="h-4 w-4" />,
      },
      {
        type: "Weekly Weigh-ins",
        current: 4,
        best: 8,
        icon: <Target className="h-4 w-4" />,
      },
      {
        type: "Injection Schedule",
        current: 6,
        best: 10,
        icon: <Award className="h-4 w-4" />,
      },
    ]

    setAchievements(initialAchievements)
    setStreaks(initialStreaks)
  }, [])

  const levelProgress = (userStats.xp / userStats.xpToNext) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Progress & Achievements
        </CardTitle>
        <CardDescription>Track your milestones and stay motivated</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="font-medium text-foreground">Level {userStats.level}</span>
            </div>
            <span className="text-sm text-gray-500">
              {userStats.xp} / {userStats.xpToNext} XP
            </span>
          </div>
          <Progress value={levelProgress} className="h-2" />
        </div>

        {/* Current Streaks */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Flame className="h-4 w-4" />
            Current Streaks
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {streaks.map((streak, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
              >
                <div className="flex items-center gap-2">
                  {streak.icon}
                  <span className="text-sm font-medium text-foreground">{streak.type}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-400">{streak.current}</div>
                  <div className="text-xs text-muted-foreground">Best: {streak.best}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Achievements
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  achievement.unlocked ? "bg-emerald-500/10 border-emerald-500/30" : "bg-muted/50 border-border"
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    achievement.unlocked ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${achievement.unlocked ? "text-emerald-300" : "text-muted-foreground"}`}
                    >
                      {achievement.title}
                    </span>
                    {achievement.unlocked && (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/20 text-emerald-300 text-xs border-emerald-500/30"
                      >
                        Unlocked
                      </Badge>
                    )}
                  </div>
                  <p className={`text-sm ${achievement.unlocked ? "text-emerald-400/80" : "text-muted-foreground"}`}>
                    {achievement.description}
                  </p>
                  {achievement.progress !== undefined && achievement.maxProgress && (
                    <div className="mt-2">
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-1" />
                      <div className="text-xs text-gray-500 mt-1">
                        {achievement.progress} / {achievement.maxProgress}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-purple-300">This Week's Goal</h4>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-sm text-purple-400/80 mb-3">Log meals and weight 5 times this week</p>
          <Progress value={userStats.weeklyGoalProgress} className="h-2" />
          <div className="text-xs text-purple-400/80 mt-1">{userStats.weeklyGoalProgress}% complete</div>
        </div>
      </CardContent>
    </Card>
  )
}
