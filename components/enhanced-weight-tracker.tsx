"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Scale, TrendingDown, Plus, Settings, Keyboard, Bell, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"

interface WeightEntry {
  date: string
  weight: number
  notes?: string
}

export function EnhancedWeightTracker() {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([])
  const [newWeight, setNewWeight] = useState("")
  const [weightUnit, setWeightUnit] = useState("lbs")
  const [stoneWeight, setStoneWeight] = useState("")
  const [poundsWeight, setPoundsWeight] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isOpen, setIsOpen] = useState(false)
  const [detailedView, setDetailedView] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("weightoff-weight-data")
    if (saved) {
      setWeightEntries(JSON.parse(saved))
    }

    // Keyboard shortcut listener
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "w") {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  const addWeightEntry = () => {
    if (!selectedDate) return

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

    const entry: WeightEntry = {
      date: selectedDate.toISOString().split("T")[0],
      weight: weightInLbs,
      notes: notes || undefined,
    }

    const updated = [...weightEntries, entry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    setWeightEntries(updated)
    localStorage.setItem("weightoff-weight-data", JSON.stringify(updated))

    // Dispatch custom event for gamification updates
    window.dispatchEvent(new CustomEvent("weightoff-data-updated"))

    setNewWeight("")
    setStoneWeight("")
    setPoundsWeight("")
    setNotes("")
    setSelectedDate(new Date())
    setIsOpen(false)

    toast({
      title: "Weight Logged",
      description: `Successfully logged ${weightInLbs.toFixed(1)} lbs`,
    })
  }

  const deleteWeightEntry = (index: number) => {
    if (confirm("Are you sure you want to delete this weight entry?")) {
      const updated = weightEntries.filter((_, i) => i !== index)
      setWeightEntries(updated)
      localStorage.setItem("weightoff-weight-data", JSON.stringify(updated))

      // Dispatch custom event for gamification updates
      window.dispatchEvent(new CustomEvent("weightoff-data-updated"))

      toast({
        title: "Entry Deleted",
        description: "Weight entry has been removed",
      })
    }
  }

  const currentWeight = weightEntries[weightEntries.length - 1]?.weight || 0
  const startWeight = weightEntries[0]?.weight || 0
  const weightLoss = startWeight - currentWeight
  const weightLossPercent = startWeight > 0 ? (weightLoss / startWeight) * 100 : 0

  // Calculate weekly trend
  const recentEntries = weightEntries.slice(-4)
  const weeklyLoss =
    recentEntries.length >= 2
      ? recentEntries[recentEntries.length - 1].weight - recentEntries[recentEntries.length - 2].weight
      : 0

  const chartData = weightEntries.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weight: entry.weight,
    fullDate: entry.date,
  }))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Weight Progress
            <Badge variant="outline" className="text-xs">
              <Keyboard className="h-3 w-3 mr-1" />
              Ctrl+W
            </Badge>
          </CardTitle>
          <CardDescription>Track your weight loss journey</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Display Options</h4>
                <div className="flex items-center justify-between">
                  <Label htmlFor="detailed-view">Detailed Metrics</Label>
                  <Switch id="detailed-view" checked={detailedView} onCheckedChange={setDetailedView} />
                </div>
                <div className="space-y-2">
                  <Label>Quick Reminders</Label>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Set Daily Weigh-in Reminder
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
                <DialogDescription>Record your weight to track progress</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
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

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Input
                    id="notes"
                    placeholder="How are you feeling today?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <Button
                  onClick={addWeightEntry}
                  className="w-full"
                  disabled={!selectedDate || (weightUnit === "stone" ? !stoneWeight && !poundsWeight : !newWeight)}
                >
                  Save Entry for {selectedDate?.toLocaleDateString()}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-4 mb-6 ${detailedView ? "grid-cols-2 md:grid-cols-4" : "grid-cols-3"}`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {currentWeight > 0 ? currentWeight.toFixed(1) : "--"}
            </div>
            <div className="text-sm text-muted-foreground">Current</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400 flex items-center justify-center gap-1">
              <TrendingDown className="h-5 w-5" />
              {weightLoss > 0 ? weightLoss.toFixed(1) : "0"}
            </div>
            <div className="text-sm text-muted-foreground">Lost (lbs)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {weightLossPercent > 0 ? weightLossPercent.toFixed(1) : "0"}%
            </div>
            <div className="text-sm text-muted-foreground">Progress</div>
          </div>
          {detailedView && (
            <div className="text-center">
              <div className={`text-2xl font-bold ${weeklyLoss < 0 ? "text-emerald-400" : "text-orange-400"}`}>
                {weeklyLoss > 0 ? "+" : ""}
                {weeklyLoss.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">This Week</div>
            </div>
          )}
        </div>

        {detailedView && weightEntries.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="font-medium text-foreground">BMI Change</div>
              <div className="text-muted-foreground">-2.4 points</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="font-medium text-foreground">Avg Weekly Loss</div>
              <div className="text-muted-foreground">1.2 lbs/week</div>
            </div>
          </div>
        )}

        {/* Weight Entries List */}
        {weightEntries.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Recent Entries</h4>
            <ScrollArea className="h-[200px] w-full">
              <div className="space-y-2 pr-4">
                {weightEntries
                  .slice()
                  .reverse()
                  .map((entry, index) => (
                    <div
                      key={entry.date}
                      className="flex items-center justify-between p-3 border border-border rounded-lg bg-card"
                    >
                      <div>
                        <div className="font-medium text-foreground">{new Date(entry.date).toLocaleDateString()}</div>
                        <div className="text-sm text-muted-foreground">{entry.weight.toFixed(1)} lbs</div>
                        {entry.notes && <div className="text-xs text-muted-foreground">{entry.notes}</div>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteWeightEntry(weightEntries.length - 1 - index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Single Chart - Straight Lines */}
        {chartData.length > 1 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Weight Progress</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={["dataMin - 5", "dataMax + 5"]} />
                  <Tooltip />
                  <Line
                    type="linear"
                    dataKey="weight"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ fill: "#a855f7", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {chartData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No weight entries yet</p>
            <p className="text-sm">Start logging to see your progress</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
