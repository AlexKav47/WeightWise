"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Syringe, CheckCircle, AlertCircle, MapPin, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface InjectionEntry {
  id: string
  date: string
  dose: string
  medication: string
  injectionSite: string
  sideEffects?: string[]
  notes?: string
}

const MEDICATIONS = [
  { value: "mounjaro-2.5mg", label: "Mounjaro 2.5mg" },
  { value: "mounjaro-5mg", label: "Mounjaro 5mg" },
  { value: "mounjaro-7.5mg", label: "Mounjaro 7.5mg" },
  { value: "mounjaro-10mg", label: "Mounjaro 10mg" },
  { value: "mounjaro-12.5mg", label: "Mounjaro 12.5mg" },
  { value: "mounjaro-15mg", label: "Mounjaro 15mg" },
  { value: "ozempic-0.25mg", label: "Ozempic 0.25mg" },
  { value: "ozempic-0.5mg", label: "Ozempic 0.5mg" },
  { value: "ozempic-1mg", label: "Ozempic 1mg" },
  { value: "ozempic-2mg", label: "Ozempic 2mg" },
  { value: "wegovy-0.25mg", label: "Wegovy 0.25mg" },
  { value: "wegovy-0.5mg", label: "Wegovy 0.5mg" },
  { value: "wegovy-1mg", label: "Wegovy 1mg" },
  { value: "wegovy-1.7mg", label: "Wegovy 1.7mg" },
  { value: "wegovy-2.4mg", label: "Wegovy 2.4mg" },
  { value: "rybelsus-3mg", label: "Rybelsus 3mg (Oral)" },
  { value: "rybelsus-7mg", label: "Rybelsus 7mg (Oral)" },
  { value: "rybelsus-14mg", label: "Rybelsus 14mg (Oral)" },
]

const INJECTION_SITES = [
  "Abdomen (left)",
  "Abdomen (right)",
  "Thigh (left)",
  "Thigh (right)",
  "Upper arm (left)",
  "Upper arm (right)",
]

export function EnhancedInjectionTracker() {
  const [injections, setInjections] = useState<InjectionEntry[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedMedication, setSelectedMedication] = useState("")
  const [selectedSite, setSelectedSite] = useState("")
  const [notes, setNotes] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("weightoff-injection-data")
    if (saved) {
      const savedData = JSON.parse(saved)
      // Add IDs to existing entries if they don't have them
      const withIds = savedData.map((entry: any) => ({
        ...entry,
        id: entry.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
      }))
      setInjections(withIds)
    }
  }, [])

  const logInjection = () => {
    if (!selectedDate || !selectedMedication) return

    const medication = MEDICATIONS.find((m) => m.value === selectedMedication)
    if (!medication) return

    const entry: InjectionEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      date: selectedDate.toISOString().split("T")[0],
      dose: medication.label.split(" ")[1], // Extract dose from label
      medication: medication.label.split(" ")[0], // Extract medication name
      injectionSite: selectedSite,
      notes: notes || undefined,
    }

    const updated = [...injections, entry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setInjections(updated)
    localStorage.setItem("weightoff-injection-data", JSON.stringify(updated))

    // Dispatch custom event for gamification updates
    window.dispatchEvent(new CustomEvent("weightoff-data-updated"))

    // Reset form
    setSelectedMedication("")
    setSelectedSite("")
    setNotes("")
    setIsOpen(false)

    toast({
      title: "Injection Logged",
      description: `${medication.label} has been recorded`,
    })
  }

  const deleteInjection = (id: string) => {
    if (confirm("Are you sure you want to delete this injection entry?")) {
      const updated = injections.filter((injection) => injection.id !== id)
      setInjections(updated)
      localStorage.setItem("weightoff-injection-data", JSON.stringify(updated))

      // Dispatch custom event for gamification updates
      window.dispatchEvent(new CustomEvent("weightoff-data-updated"))

      toast({
        title: "Entry Deleted",
        description: "Injection entry has been removed",
      })
    }
  }

  const getNextInjectionDate = () => {
    if (injections.length === 0) return new Date()
    const lastInjection = new Date(injections[0].date)

    // Check if it's oral medication (Rybelsus)
    const isOral = injections[0].medication === "Rybelsus"
    if (isOral) {
      lastInjection.setDate(lastInjection.getDate() + 1) // Daily for oral
    } else {
      lastInjection.setDate(lastInjection.getDate() + 7) // Weekly for injections
    }
    return lastInjection
  }

  const nextInjection = getNextInjectionDate()
  const isOverdue = nextInjection < new Date()
  const daysUntilNext = Math.ceil((nextInjection.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const injectionDates = injections.map((inj) => new Date(inj.date))

  // Get injection site rotation suggestions
  const getNextSuggestedSite = () => {
    if (injections.length === 0) return "Abdomen (left)"
    const lastSite = injections[0].injectionSite
    const currentIndex = INJECTION_SITES.indexOf(lastSite)
    return INJECTION_SITES[(currentIndex + 1) % INJECTION_SITES.length]
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Syringe className="h-5 w-5" />
            Injection Tracker
          </CardTitle>
          <CardDescription>Keep track of your medication schedule and rotation</CardDescription>
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
              <DialogDescription>Record your medication details</DialogDescription>
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
                <Label>Medication & Dose</Label>
                <Select value={selectedMedication} onValueChange={setSelectedMedication}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your medication and dose" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Mounjaro (Tirzepatide)</div>
                    {MEDICATIONS.filter((m) => m.value.startsWith("mounjaro")).map((med) => (
                      <SelectItem key={med.value} value={med.value}>
                        {med.label}
                      </SelectItem>
                    ))}

                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-2">
                      Ozempic (Semaglutide)
                    </div>
                    {MEDICATIONS.filter((m) => m.value.startsWith("ozempic")).map((med) => (
                      <SelectItem key={med.value} value={med.value}>
                        {med.label}
                      </SelectItem>
                    ))}

                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-2">
                      Wegovy (Semaglutide)
                    </div>
                    {MEDICATIONS.filter((m) => m.value.startsWith("wegovy")).map((med) => (
                      <SelectItem key={med.value} value={med.value}>
                        {med.label}
                      </SelectItem>
                    ))}

                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-2">
                      Rybelsus (Oral Semaglutide)
                    </div>
                    {MEDICATIONS.filter((m) => m.value.startsWith("rybelsus")).map((med) => (
                      <SelectItem key={med.value} value={med.value}>
                        {med.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedMedication && !selectedMedication.includes("rybelsus") && (
                <div className="space-y-2">
                  <Label>Injection Site</Label>
                  <Select value={selectedSite} onValueChange={setSelectedSite}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select injection site" />
                    </SelectTrigger>
                    <SelectContent>
                      {INJECTION_SITES.map((site) => (
                        <SelectItem key={site} value={site}>
                          {site}
                          {site === getNextSuggestedSite() && (
                            <Badge className="ml-2 bg-purple-500/20 text-purple-300 text-xs">Suggested</Badge>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    💡 Suggested next site: {getNextSuggestedSite()} (for proper rotation)
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea
                  placeholder="Any side effects, reactions, or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-20"
                />
              </div>

              <Button
                onClick={logInjection}
                className="w-full"
                disabled={
                  !selectedDate || !selectedMedication || (!selectedMedication.includes("rybelsus") && !selectedSite)
                }
              >
                Log {selectedMedication.includes("rybelsus") ? "Medication" : "Injection"} for{" "}
                {selectedDate?.toLocaleDateString()}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Next Injection Alert */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
            <div>
              <div className="font-medium text-foreground">
                Next {injections.length > 0 && injections[0].medication === "Rybelsus" ? "Dose" : "Injection"}
              </div>
              <div className="text-sm text-muted-foreground">{nextInjection.toLocaleDateString()}</div>
              {injections.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  {injections[0].medication} {injections[0].dose}
                </div>
              )}
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

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Quick Stats */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <h4 className="font-medium">Quick Stats</h4>
                {injections.length > 0 ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-300">{injections.length}</div>
                      <div className="text-sm text-muted-foreground">Total Injections</div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg">
                      <div className="text-lg font-semibold text-blue-300">{injections[0]?.medication}</div>
                      <div className="text-sm text-muted-foreground">Current Medication</div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-lg">
                      <div className="text-lg font-semibold text-emerald-300">{injections[0]?.dose}</div>
                      <div className="text-sm text-muted-foreground">Current Dose</div>
                    </div>

                    {/* Streak Counter */}
                    <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg">
                      <div className="text-xl font-bold text-orange-300">
                        {(() => {
                          // Calculate current streak
                          let streak = 0
                          const today = new Date()
                          const isOral = injections[0]?.medication === "Rybelsus"
                          const intervalDays = isOral ? 1 : 7

                          for (let i = 0; i < injections.length; i++) {
                            const injectionDate = new Date(injections[i].date)
                            const expectedDate = new Date(today)
                            expectedDate.setDate(today.getDate() - i * intervalDays)

                            const daysDiff =
                              Math.abs(injectionDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60 * 24)
                            if (daysDiff <= 1) {
                              streak++
                            } else {
                              break
                            }
                          }
                          return streak
                        })()}
                      </div>
                      <div className="text-sm text-muted-foreground">Day Streak</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Syringe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No data yet</p>
                    <p className="text-xs">Start logging to see stats</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Calendar */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <h4 className="font-medium">Injection Calendar</h4>
                <div className="bg-card border rounded-lg p-4">
                  <Calendar
                    mode="multiple"
                    selected={injectionDates}
                    className="w-full"
                    modifiers={{
                      injection: injectionDates,
                    }}
                    modifiersStyles={{
                      injection: { backgroundColor: "#a855f7", color: "white", fontWeight: "bold" },
                    }}
                    classNames={{
                      months: "flex w-full",
                      month: "space-y-4 w-full",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex w-full",
                      head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] flex-1 text-center",
                      row: "flex w-full mt-2",
                      cell: "text-center text-sm p-0 relative flex-1 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                      day_selected:
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground",
                      day_outside: "text-muted-foreground opacity-50",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                  />
                </div>

                {/* Calendar Legend */}
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>Injection Day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-muted border rounded"></div>
                    <span>Regular Day</span>
                  </div>
                </div>

                {/* Additional Calendar Stats */}
                {injections.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/30 rounded-lg text-center">
                      <div className="text-lg font-semibold text-foreground">
                        {(() => {
                          const thisMonth = new Date().getMonth()
                          const thisYear = new Date().getFullYear()
                          return injections.filter((inj) => {
                            const injDate = new Date(inj.date)
                            return injDate.getMonth() === thisMonth && injDate.getFullYear() === thisYear
                          }).length
                        })()}
                      </div>
                      <div className="text-xs text-muted-foreground">This Month</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg text-center">
                      <div className="text-lg font-semibold text-foreground">
                        {(() => {
                          const lastInjection = injections[0] ? new Date(injections[0].date) : null
                          if (!lastInjection) return "N/A"
                          const daysSince = Math.floor(
                            (new Date().getTime() - lastInjection.getTime()) / (1000 * 60 * 60 * 24),
                          )
                          return daysSince === 0 ? "Today" : `${daysSince}d ago`
                        })()}
                      </div>
                      <div className="text-xs text-muted-foreground">Last Injection</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section - Recent Entries */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Recent Entries</h4>
              {injections.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  Showing latest 10
                </Badge>
              )}
            </div>

            {injections.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Syringe className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2">No injections logged yet</h3>
                <p className="text-sm mb-4">Start tracking your medication schedule</p>
                <Button onClick={() => setIsOpen(true)} className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <Syringe className="h-4 w-4 mr-2" />
                  Log Your First Injection
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {injections.slice(0, 10).map((injection) => (
                  <div
                    key={injection.id}
                    className="group relative p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="font-medium text-foreground">
                            {new Date(injection.date).toLocaleDateString()}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {new Date(injection.date).toLocaleDateString("en-US", { weekday: "short" })}
                          </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground mb-1">
                          {injection.medication} {injection.dose}
                        </div>

                        {injection.injectionSite && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                            <MapPin className="h-3 w-3" />
                            {injection.injectionSite}
                          </div>
                        )}

                        {injection.notes && (
                          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded mt-2 break-words">
                            {injection.notes}
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteInjection(injection.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-400/10 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
