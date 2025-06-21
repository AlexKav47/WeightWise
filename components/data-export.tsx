"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, BarChart3, Calendar } from "lucide-react"

export function DataExport() {
  const [dateRange, setDateRange] = useState("last-3-months")
  const [isExporting, setIsExporting] = useState(false)

  const exportOption = {
    id: "complete-data",
    title: "Complete Health Data",
    description:
      "All your health data including weight progress, injections, side effects, meals, workouts, and achievements",
    icon: <FileText className="h-5 w-5" />,
    formats: ["Excel", "PDF"],
  }

  const handleExport = async (format: string) => {
    setIsExporting(true)
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, this would generate and download the actual file
    const fileName = `weightoff-complete-data-${dateRange}.${format.toLowerCase()}`
    console.log(`Exporting ${fileName}`)

    setIsExporting(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Your Data
          </CardTitle>
          <CardDescription>
            Download your health data for personal records or to share with your healthcare provider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Single Export Option */}
            <div className="space-y-4">
              <h4 className="font-medium">Export Your Complete Health Data</h4>
              <div className="p-4 border border-purple-500 bg-purple-500/10 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h5 className="font-medium text-foreground">Complete Health Data</h5>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  All your health data including weight progress, injections, side effects, meals, workouts, and
                  achievements
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    Excel
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    PDF
                  </Badge>
                </div>
              </div>
            </div>

            {/* Date Range Selection */}
            <div className="space-y-2">
              <h4 className="font-medium">Date Range</h4>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue />
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

            {/* Export Buttons */}
            <div className="space-y-4">
              <h4 className="font-medium">Download Format</h4>
              <div className="flex gap-3">
                {exportOption.formats.map((format) => (
                  <Button
                    key={format}
                    onClick={() => handleExport(format)}
                    disabled={isExporting}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? "Exporting..." : `Export as ${format}`}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Privacy Notice */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Data Privacy & Security</h4>
              <p className="text-sm text-muted-foreground">
                Your exported data is generated securely and contains only your personal health information. We
                recommend storing these files securely and only sharing with trusted healthcare providers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Exports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Exports
          </CardTitle>
          <CardDescription>Your download history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">Comprehensive Report</div>
                  <div className="text-sm text-muted-foreground">Last 3 months • PDF</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">2 days ago</div>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">Weight Progress</div>
                  <div className="text-sm text-muted-foreground">Last month • CSV</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">1 week ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
