"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Scale, TrendingDown, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface WeightEntry {
  date: string
  weight: number
  notes?: string
}

export function WeightTracker() {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([])
  const [newWeight, setNewWeight] = useState("")
  const [notes, setNotes] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("weightoff-weight-data")
    if (saved) {
      setWeightEntries(JSON.parse(saved))
    } else {
      // Start with empty data for new users
      setWeightEntries([])
    }
  }, [])

  const addWeightEntry = () => {
    if (!newWeight) return

    const entry: WeightEntry = {
      date: new Date().toISOString().split("T")[0],
      weight: Number.parseFloat(newWeight),
      notes: notes || undefined,
    }

    const updated = [...weightEntries, entry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    setWeightEntries(updated)
    localStorage.setItem("weightoff-weight-data", JSON.stringify(updated))

    setNewWeight("")
    setNotes("")
    setIsOpen(false)
  }

  const currentWeight = weightEntries[weightEntries.length - 1]?.weight || 0
  const startWeight = weightEntries[0]?.weight || 0
  const weightLoss = startWeight - currentWeight
  const weightLossPercent = startWeight > 0 ? (weightLoss / startWeight) * 100 : 0

  const chartData = weightEntries.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weight: entry.weight,
  }))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Weight Progress
          </CardTitle>
          <CardDescription>Track your weight loss journey</CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Log Weight
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Your Weight</DialogTitle>
              <DialogDescription>Record your current weight to track progress</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="Enter weight"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="How are you feeling today?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <Button onClick={addWeightEntry} className="w-full">
                Save Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{currentWeight}</div>
            <div className="text-sm text-muted-foreground">Current</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400 flex items-center justify-center gap-1">
              <TrendingDown className="h-5 w-5" />
              {weightLoss.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Lost (lbs)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{weightLossPercent.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Progress</div>
          </div>
        </div>

        {chartData.length > 1 && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={["dataMin - 5", "dataMax + 5"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={{ fill: "#a855f7", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
