"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, MessageSquare, Trophy, Heart, TrendingUp, Star, Crown } from "lucide-react"

export function CommunityFeatures() {
  const communityStats = [
    { label: "Active Members", value: "10,247", icon: <Users className="h-4 w-4" /> },
    { label: "Success Stories", value: "1,832", icon: <Trophy className="h-4 w-4" /> },
    { label: "Support Messages", value: "45,291", icon: <Heart className="h-4 w-4" /> },
    { label: "Average Weight Loss", value: "23.4 lbs", icon: <TrendingUp className="h-4 w-4" /> },
  ]

  const leaderboard = [
    { name: "Sarah M.", weightLoss: 45, medication: "Mounjaro", streak: 89 },
    { name: "Mike R.", weightLoss: 38, medication: "Ozempic", streak: 76 },
    { name: "Jessica L.", weightLoss: 32, medication: "Wegovy", streak: 65 },
    { name: "David K.", weightLoss: 28, medication: "Mounjaro", streak: 54 },
    { name: "Lisa P.", weightLoss: 25, medication: "Ozempic", streak: 43 },
  ]

  const recentPosts = [
    {
      author: "Emma T.",
      medication: "Mounjaro 7.5mg",
      content:
        "Just hit my 20lb milestone! The nausea was tough at first but the community support made all the difference. Thank you all! 💜",
      likes: 24,
      replies: 8,
      timeAgo: "2h ago",
    },
    {
      author: "Carlos M.",
      medication: "Ozempic 1mg",
      content:
        "Week 12 update: Down 18lbs! The AI meal planner has been a game changer for managing my reduced appetite. Anyone else loving the protein-focused suggestions?",
      likes: 31,
      replies: 12,
      timeAgo: "4h ago",
    },
    {
      author: "Rachel K.",
      medication: "Wegovy 2.4mg",
      content:
        "Struggling with fatigue this week. Any tips for gentle workouts that don't drain energy? The AI suggested some chair exercises but looking for more variety.",
      likes: 15,
      replies: 18,
      timeAgo: "6h ago",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {communityStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">{stat.icon}</div>
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Community Leaderboard
            </CardTitle>
            <CardDescription>Top performers this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Crown className="h-4 w-4 text-yellow-400" />}
                      <span className="font-bold text-lg text-muted-foreground">#{index + 1}</span>
                    </div>
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.medication}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-400">-{member.weightLoss} lbs</div>
                    <div className="text-xs text-muted-foreground">{member.streak} day streak</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Community Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Community Posts
            </CardTitle>
            <CardDescription>Support and celebrate together</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post, index) => (
                <div key={index} className="p-4 border border-border rounded-lg bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                        {post.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm text-foreground">{post.author}</span>
                    <Badge variant="outline" className="text-xs">
                      {post.medication}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">{post.timeAgo}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{post.content}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {post.replies} replies
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Guidelines */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle>Community Guidelines</CardTitle>
          <CardDescription>Help us maintain a supportive environment for everyone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-emerald-400" />
                <span>Be supportive and encouraging</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" />
                <span>Respect everyone's journey</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-purple-400" />
                <span>Share your wins and challenges</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span>Ask questions and offer help</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span>Celebrate milestones together</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-400" />
                <span>No medical advice - consult your doctor</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Join Community CTA */}
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">Ready to Connect?</h3>
          <p className="text-muted-foreground mb-4">
            Join thousands of others on their GLP-1 journey. Share experiences, get support, and celebrate wins
            together.
          </p>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
            <Users className="h-4 w-4 mr-2" />
            Join Community Discussions
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
