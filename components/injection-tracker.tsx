"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Syringe, CheckCircle, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface InjectionEntry {
  date: string
  dose: string
  sideEffects?: string[]
  notes?: string
}

export function InjectionTracker() {
  const [injections, setInjections] = useState<InjectionEntry[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("weightoff-injection-data")
    if (saved) {
      setInjections(JSON.parse(saved))
    } else {
      // Start with empty data for new users
      setInjections([])
    }
  }, [])

  const logInjection = () => {
    if (!selectedDate) return

    const entry: InjectionEntry = {
      date: selectedDate.toISOString().split("T")[0],
      dose: "7.5mg", // This would come from user profile
      notes: "Injection logged",
    }

    const updated = [...injections, entry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setInjections(updated)
    localStorage.setItem("weightoff-injection-data", JSON.stringify(updated))
    setIsOpen(false)
  }

  const getNextInjectionDate = () => {
    if (injections.length === 0) return new Date()
    const lastInjection = new Date(injections[0].date)
    lastInjection.setDate(lastInjection.getDate() + 7)
    return lastInjection
  }

  const nextInjection = getNextInjectionDate()
  const isOverdue = nextInjection < new Date()
  const daysUntilNext = Math.ceil((nextInjection.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const injectionDates = injections.map((inj) => new Date(inj.date))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Syringe className="h-5 w-5" />
            Injection Tracker
          </CardTitle>
          <CardDescription>Keep track of your medication schedule</CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Syringe className="h-4 w-4 mr-2" />
              Log Injection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Injection</DialogTitle>
              <DialogDescription>Record when you took your medication</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              <Button onClick={logInjection} className="w-full">
                Log Injection for {selectedDate?.toLocaleDateString()}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
              <div>
                <div className="font-medium text-foreground">Next Injection</div>
                <div className="text-sm text-muted-foreground">{nextInjection.toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-2">
                {isOverdue ? (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                )}
                <Badge
                  variant={isOverdue ? "destructive" : "default"}
                  className={isOverdue ? "" : "bg-purple-600 text-white"}
                >
                  {isOverdue ? `${Math.abs(daysUntilNext)} days overdue` : `${daysUntilNext} days`}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Recent Injections</h4>
              {injections.slice(0, 5).map((injection, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-border rounded-lg bg-card"
                >
                  <div>
                    <div className="font-medium text-foreground">{new Date(injection.date).toLocaleDateString()}</div>
                    <div className="text-sm text-muted-foreground">{injection.dose}</div>
                  </div>
                  {injection.sideEffects && (
                    <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                      {injection.sideEffects.join(", ")}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Injection Calendar</h4>
            <Calendar
              mode="multiple"
              selected={injectionDates}
              className="rounded-md border"
              modifiers={{
                injection: injectionDates,
              }}
              modifiersStyles={{
                injection: { backgroundColor: "#a855f7", color: "white" },
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
