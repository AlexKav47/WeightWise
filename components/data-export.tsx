"use client"

import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Download, FileText } from "lucide-react"

export function DataExport() {
  const [dateRange, setDateRange] = useState("last-3-months")
  const [isExporting, setIsExporting] = useState(false)

  const exportOption = {
    title: "Complete Health Data",
    description:
      "All your health data including weight, injections, side effects, meals, workouts, progress & achievements",
    formats: ["Excel", "PDF"],
  }

  async function handleExport(format: string) {
    setIsExporting(true)

    // Simulate export logic – replace with real implementation.
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const fileName = `metalean-data-${dateRange}.${format.toLowerCase()}`
    console.log(`Exporting ${fileName}`)

    setIsExporting(false)
  }

  return (
    <Card className="space-y-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Your Data
        </CardTitle>
        <CardDescription>
          Download your complete health record for personal backup or to share with your healthcare provider.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Single export option */}
        <div className="space-y-4">
          <h4 className="font-medium">Export Type</h4>
          <div className="p-4 border rounded-lg border-purple-500 bg-purple-500/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 rounded-lg bg-purple-500/20 text-purple-500">
                <FileText className="h-5 w-5" />
              </span>
              <span className="font-medium text-foreground">{exportOption.title}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{exportOption.description}</p>
            <div className="flex gap-2">
              {exportOption.formats.map((fmt) => (
                <Badge key={fmt} variant="outline" className="text-xs">
                  {fmt}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Date range selector */}
        <div className="space-y-2">
          <h4 className="font-medium">Date Range</h4>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Choose range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Export buttons */}
        <div className="space-y-4">
          <h4 className="font-medium">Download</h4>
          <div className="flex gap-3">
            {exportOption.formats.map((fmt) => (
              <Button
                key={fmt}
                disabled={isExporting}
                onClick={() => handleExport(fmt)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exporting…" : `Export as ${fmt}`}
              </Button>
            ))}
          </div>
        </div>

        {/* Privacy notice */}
        <div className="text-xs text-muted-foreground">
          Your export is generated securely on-demand and contains only your personal health information. Keep it safe
          and share only with trusted professionals.
        </div>
      </CardContent>
    </Card>
  )
}

// Provide both named and default exports
export default DataExport

