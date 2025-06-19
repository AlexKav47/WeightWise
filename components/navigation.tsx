"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, User, LogOut, Crown, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSubscription } from "@/lib/subscription-context"
import { AccountSettings } from "@/components/account-settings"

export function Navigation() {
  const { tier, cancelSubscription } = useSubscription()
  const [showSettings, setShowSettings] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("weightoff-user")
    localStorage.removeItem("weightoff-data")
    localStorage.removeItem("subscription-tier")
    window.location.reload()
  }

  const getTierBadge = () => {
    switch (tier) {
      case "premium":
        return (
          <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-xs">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        )
      case "plus":
        return <Badge className="bg-purple-600 text-white text-xs">Plus</Badge>
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Free
          </Badge>
        )
    }
  }

  return (
    <>
      <nav className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              WeightOff
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {getTierBadge()}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border">
                <DropdownMenuItem onClick={() => setShowSettings(true)} className="text-foreground hover:bg-muted">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                {tier !== "free" && (
                  <DropdownMenuItem onClick={cancelSubscription} className="text-foreground hover:bg-muted">
                    Cancel Subscription
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-foreground hover:bg-muted">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
          </DialogHeader>
          <AccountSettings />
        </DialogContent>
      </Dialog>
    </>
  )
}
