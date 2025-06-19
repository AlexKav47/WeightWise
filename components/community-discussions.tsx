"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  Share2,
  Plus,
  Search,
  Filter,
  Users,
  Pin,
  Award,
  ThumbsUp,
  MessageCircle,
  MoreHorizontal,
  Flag,
  ExternalLink,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useSubscription } from "@/lib/subscription-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

interface Post {
  id: string
  author: {
    name: string
    avatar: string
    badge?: string
    medication: string
    weightLoss: number
  }
  title: string
  content: string
  category: string
  tags: string[]
  likes: number
  comments: number
  shares: number
  timestamp: Date
  isPinned?: boolean
  isLiked?: boolean
  replies: Reply[]
}

interface Reply {
  id: string
  author: {
    name: string
    avatar: string
    medication: string
  }
  content: string
  likes: number
  timestamp: Date
  isLiked?: boolean
}

const CATEGORIES = [
  "All",
  "Success Stories",
  "Side Effects",
  "Meal Ideas",
  "Exercise Tips",
  "Motivation",
  "Questions",
  "General Discussion",
]

export function CommunityDiscussions() {
  const { features } = useSubscription()
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [showNewPostDialog, setShowNewPostDialog] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "General Discussion",
    tags: "",
  })

  if (!features.hasCommunityAccess) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Community Access Required</h3>
          <p className="text-muted-foreground mb-4">
            Upgrade to Plus or Premium to join our supportive community of GLP-1 users.
          </p>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">Upgrade Now</Button>
        </CardContent>
      </Card>
    )
  }

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likes + b.comments - (a.likes + a.comments)
      case "recent":
        return b.timestamp.getTime() - a.timestamp.getTime()
      case "discussed":
        return b.comments - a.comments
      default:
        return 0
    }
  })

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
  }

  const handleLikeReply = (postId: string, replyId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              replies: post.replies.map((reply) =>
                reply.id === replyId
                  ? { ...reply, isLiked: !reply.isLiked, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1 }
                  : reply,
              ),
            }
          : post,
      ),
    )
  }

  const handleReportPost = (postId: string) => {
    toast({
      title: "Post Reported",
      description: "Thank you for reporting this post. Our moderators will review it shortly.",
    })
  }

  const handleSharePost = (post: Post) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content.substring(0, 100) + "...",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Post link has been copied to your clipboard.",
      })
    }

    // Update share count
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, shares: p.shares + 1 } : p)))
  }

  const handleCreatePost = () => {
    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: "You",
        avatar: "YO",
        medication: "Mounjaro 7.5mg",
        weightLoss: 15,
      },
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      tags: newPost.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: new Date(),
      replies: [],
    }

    setPosts((prev) => [post, ...prev])
    setNewPost({ title: "", content: "", category: "General Discussion", tags: "" })
    setShowNewPostDialog(false)

    toast({
      title: "Post Created",
      description: "Your post has been shared with the community!",
    })
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Community Discussions</h2>
              <p className="text-muted-foreground">
                Connect with others on their GLP-1 journey. Share experiences, ask questions, and support each other.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{posts.length}</div>
              <div className="text-sm text-muted-foreground">Total Posts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="discussed">Most Discussed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                  <DialogDescription>Share your experience or ask a question</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Post title..."
                      value={newPost.title}
                      onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Select
                      value={newPost.category}
                      onValueChange={(value) => setNewPost((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.slice(1).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Textarea
                      placeholder="Share your thoughts, experience, or question..."
                      value={newPost.content}
                      onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                      className="min-h-32"
                    />
                  </div>

                  <div>
                    <Input
                      placeholder="Tags (comma separated)..."
                      value={newPost.tags}
                      onChange={(e) => setNewPost((prev) => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>

                  <Button onClick={handleCreatePost} disabled={!newPost.title || !newPost.content} className="w-full">
                    Create Post
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to start a conversation in the community!</p>
              <Button
                onClick={() => setShowNewPostDialog(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedPosts.map((post) => (
            <Card key={post.id} className={post.isPinned ? "border-yellow-500/30 bg-yellow-500/5" : ""}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      {post.author.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {post.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
                      <span className="font-semibold text-foreground">{post.author.name}</span>
                      {post.author.badge && (
                        <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                          <Award className="h-3 w-3 mr-1" />
                          {post.author.badge}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {post.author.medication}
                      </Badge>
                      {post.author.weightLoss > 0 && (
                        <Badge className="bg-emerald-500/20 text-emerald-300 text-xs">
                          -{post.author.weightLoss}lbs
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{getTimeAgo(post.timestamp)}</span>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleReportPost(post.id)}>
                            <Flag className="h-4 w-4 mr-2" />
                            Report Post
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSharePost(post)}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-2">{post.title}</h3>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-muted-foreground mb-4 whitespace-pre-wrap">{post.content}</p>

                    <div className="flex items-center gap-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikePost(post.id)}
                        className={`gap-2 ${post.isLiked ? "text-red-400" : "text-muted-foreground"}`}
                      >
                        <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                        {post.likes}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPost(post)}
                        className="gap-2 text-muted-foreground"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground"
                        onClick={() => handleSharePost(post)}
                      >
                        <Share2 className="h-4 w-4" />
                        {post.shares}
                      </Button>
                    </div>

                    {/* Show recent replies */}
                    {post.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-muted space-y-3">
                        {post.replies.slice(0, 2).map((reply) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-muted text-xs">{reply.author.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{reply.author.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {reply.author.medication}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{getTimeAgo(reply.timestamp)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{reply.content}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLikeReply(post.id, reply.id)}
                                className={`gap-1 text-xs ${reply.isLiked ? "text-red-400" : "text-muted-foreground"}`}
                              >
                                <ThumbsUp className={`h-3 w-3 ${reply.isLiked ? "fill-current" : ""}`} />
                                {reply.likes}
                              </Button>
                            </div>
                          </div>
                        ))}
                        {post.replies.length > 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPost(post)}
                            className="text-purple-400 hover:text-purple-300"
                          >
                            View all {post.replies.length} replies
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedPost && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle>{selectedPost.title}</DialogTitle>
              </DialogHeader>

              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    {selectedPost.author.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{selectedPost.author.name}</span>
                    {selectedPost.author.badge && (
                      <Badge variant="outline" className="text-xs">
                        {selectedPost.author.badge}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {selectedPost.author.medication}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{getTimeAgo(selectedPost.timestamp)}</span>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-wrap">{selectedPost.content}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Replies ({selectedPost.replies.length})</h4>
                {selectedPost.replies.map((reply) => (
                  <div key={reply.id} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{reply.author.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{reply.author.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {reply.author.medication}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{getTimeAgo(reply.timestamp)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{reply.content}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikeReply(selectedPost.id, reply.id)}
                        className={`gap-1 text-xs ${reply.isLiked ? "text-red-400" : "text-muted-foreground"}`}
                      >
                        <ThumbsUp className={`h-3 w-3 ${reply.isLiked ? "fill-current" : ""}`} />
                        {reply.likes}
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Textarea placeholder="Write a reply..." className="flex-1" />
                  <Button>Reply</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
