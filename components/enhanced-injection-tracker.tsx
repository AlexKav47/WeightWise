"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
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
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
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

            {injections.length > 0 && !injections[0].medication.includes("Rybelsus") && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span className="font-medium text-blue-300">Next Suggested Site</span>
                </div>
                <p className="text-sm text-blue-300">{getNextSuggestedSite()}</p>
                <p className="text-xs text-blue-400/80 mt-1">Rotating injection sites helps prevent lipodystrophy</p>
              </div>
            )}

            {/* Recent Entries */}
            <div className="space-y-2">
              <h4 className="font-medium">Recent Entries</h4>
              {injections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Syringe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No injections logged yet</p>
                  <p className="text-sm">Start tracking your medication schedule</p>
                </div>
              ) : (
                <ScrollArea className="h-[300px] w-full">
                  <div className="space-y-2 pr-4">
                    {injections.slice(0, 10).map((injection) => (
                      <div
                        key={injection.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg bg-card"
                      >
                        <div>
                          <div className="font-medium text-foreground">
                            {new Date(injection.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {injection.medication} {injection.dose}
                          </div>
                          {injection.injectionSite && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {injection.injectionSite}
                            </div>
                          )}
                          {injection.notes && (
                            <div className="text-xs text-muted-foreground mt-1">{injection.notes}</div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteInjection(injection.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Calendar and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {injections.length > 0 && (
                <div className="space-y-4">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h5 className="font-medium text-sm mb-2">Quick Stats</h5>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Total Injections:</span>
                        <div className="font-medium">{injections.length}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Current Medication:</span>
                        <div className="font-medium">{injections[0]?.medication}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Current Dose:</span>
                        <div className="font-medium">{injections[0]?.dose}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
