"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, Plus, Star, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface SideEffect {
  id: string
  type: string
  severity: number // 1-5 scale
  date: string
  notes?: string
  duration?: string
}

const COMMON_SIDE_EFFECTS = [
  "Nausea",
  "Reduced appetite",
  "Fatigue",
  "Constipation",
  "Diarrhea",
  "Headache",
  "Dizziness",
  "Heartburn",
  "Injection site reaction",
  "Other",
]

export function SideEffectsTracker() {
  const [sideEffects, setSideEffects] = useState<SideEffect[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState("")
  const [severity, setSeverity] = useState(1)
  const [notes, setNotes] = useState("")
  const [duration, setDuration] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("weightoff-side-effects")
    if (saved) {
      setSideEffects(JSON.parse(saved))
    }
  }, [])

  const addSideEffect = () => {
    if (!selectedType) return

    const newEffect: SideEffect = {
      id: Date.now().toString(),
      type: selectedType,
      severity,
      date: new Date().toISOString().split("T")[0],
      notes: notes || undefined,
      duration: duration || undefined,
    }

    const updated = [newEffect, ...sideEffects]
    setSideEffects(updated)
    localStorage.setItem("weightoff-side-effects", JSON.stringify(updated))

    // Dispatch custom event for gamification updates
    window.dispatchEvent(new CustomEvent("weightoff-data-updated"))

    // Reset form
    setSelectedType("")
    setSeverity(1)
    setNotes("")
    setDuration("")
    setIsOpen(false)

    toast({
      title: "Side Effect Logged",
      description: `${selectedType} has been recorded`,
    })
  }

  const deleteSideEffect = (id: string) => {
    if (confirm("Are you sure you want to delete this side effect entry?")) {
      const updated = sideEffects.filter((effect) => effect.id !== id)
      setSideEffects(updated)
      localStorage.setItem("weightoff-side-effects", JSON.stringify(updated))

      // Dispatch custom event for gamification updates
      window.dispatchEvent(new CustomEvent("weightoff-data-updated"))

      toast({
        title: "Entry Deleted",
        description: "Side effect entry has been removed",
      })
    }
  }

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) return "text-green-400"
    if (severity <= 3) return "text-yellow-400"
    return "text-red-400"
  }

  const getSeverityLabel = (severity: number) => {
    const labels = ["", "Very Mild", "Mild", "Moderate", "Severe", "Very Severe"]
    return labels[severity] || ""
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Side Effects Tracker
          </CardTitle>
          <CardDescription>Monitor and rate your medication side effects</CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Log Side Effect
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Side Effect</DialogTitle>
              <DialogDescription>Track your symptoms to better understand patterns</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Type of Side Effect</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select side effect" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_SIDE_EFFECTS.map((effect) => (
                      <SelectItem key={effect} value={effect}>
                        {effect}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Severity (1-5)</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSeverity(level)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        severity >= level
                          ? "bg-purple-600 border-purple-600 text-white"
                          : "border-muted text-muted-foreground hover:border-purple-400"
                      }`}
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{getSeverityLabel(severity)}</p>
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="How long did it last?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="< 1 hour">Less than 1 hour</SelectItem>
                    <SelectItem value="1-3 hours">1-3 hours</SelectItem>
                    <SelectItem value="3-6 hours">3-6 hours</SelectItem>
                    <SelectItem value="6-12 hours">6-12 hours</SelectItem>
                    <SelectItem value="All day">All day</SelectItem>
                    <SelectItem value="Ongoing">Still ongoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea
                  placeholder="Any additional details about this side effect..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-20"
                />
              </div>

              <Button onClick={addSideEffect} className="w-full" disabled={!selectedType}>
                Log Side Effect
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sideEffects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No side effects logged yet</p>
              <p className="text-sm">Track symptoms to identify patterns</p>
            </div>
          ) : (
            <div className="space-y-3">
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-3 pr-4">
                  {sideEffects.map((effect) => (
                    <div key={effect.id} className="p-4 border border-border rounded-lg bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{effect.type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(effect.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">Severity:</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= effect.severity ? "fill-yellow-400 text-yellow-400" : "text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className={`text-xs font-medium ${getSeverityColor(effect.severity)}`}>
                              {getSeverityLabel(effect.severity)}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSideEffect(effect.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {effect.duration && (
                        <div className="text-xs text-muted-foreground mb-1">Duration: {effect.duration}</div>
                      )}

                      {effect.notes && <p className="text-sm text-muted-foreground">{effect.notes}</p>}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {sideEffects.length > 0 && (
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium mb-2">Quick Insights</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium text-foreground">Most Common</div>
                  <div className="text-muted-foreground">
                    {(() => {
                      const counts = sideEffects.reduce(
                        (acc, effect) => {
                          acc[effect.type] = (acc[effect.type] || 0) + 1
                          return acc
                        },
                        {} as Record<string, number>,
                      )
                      const mostCommon = Object.entries(counts).sort(([, a], [, b]) => b - a)[0]
                      return mostCommon ? `${mostCommon[0]} (${mostCommon[1]}x)` : "No data yet"
                    })()}
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium text-foreground">Avg Severity</div>
                  <div className="text-muted-foreground">
                    {(sideEffects.reduce((sum, effect) => sum + effect.severity, 0) / sideEffects.length).toFixed(1)}/5
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
