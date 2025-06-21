"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, MessageSquare, Trophy, Heart, TrendingUp, Star, Crown } from "lucide-react"
import { useState, useEffect } from "react"

interface CommunityStats {
  activeMembers: number
  successStories: number
  supportMessages: number
  averageWeightLoss: string
}

interface LeaderboardMember {
  id: string
  name: string
  weightLoss: number
  medication: string
  streak: number
}

interface CommunityPost {
  id: string
  author: string
  medication: string
  content: string
  likes: number
  replies: number
  timeAgo: string
}

export function CommunityFeatures() {
  const [communityStats, setCommunityStats] = useState<CommunityStats>({
    activeMembers: 0,
    successStories: 0,
    supportMessages: 0,
    averageWeightLoss: "0 lbs",
  })

  const [leaderboard, setLeaderboard] = useState<LeaderboardMember[]>([])
  const [recentPosts, setRecentPosts] = useState<CommunityPost[]>([])

  useEffect(() => {
    // Fetch real community data from API when available
    const fetchCommunityData = async () => {
      try {
        // Replace with actual API calls
        // const statsResponse = await fetch('/api/community/stats')
        // const leaderboardResponse = await fetch('/api/community/leaderboard')
        // const postsResponse = await fetch('/api/community/posts')

        // For now, keep everything empty until real data is available
        setCommunityStats({
          activeMembers: 0,
          successStories: 0,
          supportMessages: 0,
          averageWeightLoss: "0 lbs",
        })
        setLeaderboard([])
        setRecentPosts([])
      } catch (error) {
        console.error("Failed to fetch community data:", error)
      }
    }

    fetchCommunityData()
  }, [])

  const communityStatsDisplay = [
    { label: "Active Members", value: communityStats.activeMembers.toString(), icon: <Users className="h-4 w-4" /> },
    { label: "Success Stories", value: communityStats.successStories.toString(), icon: <Trophy className="h-4 w-4" /> },
    {
      label: "Support Messages",
      value: communityStats.supportMessages.toString(),
      icon: <Heart className="h-4 w-4" />,
    },
    { label: "Average Weight Loss", value: communityStats.averageWeightLoss, icon: <TrendingUp className="h-4 w-4" /> },
  ]

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {communityStatsDisplay.map((stat, index) => (
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
            {leaderboard.length > 0 ? (
              <div className="space-y-4">
                {leaderboard.map((member, index) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
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
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No leaderboard data yet.</p>
                <p className="text-sm">Start tracking your progress to see rankings!</p>
              </div>
            )}
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
            {recentPosts.length > 0 ? (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="p-4 border border-border rounded-lg bg-card">
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
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No community posts yet.</p>
                <p className="text-sm">Be the first to share your journey!</p>
              </div>
            )}
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
