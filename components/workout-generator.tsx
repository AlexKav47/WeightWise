"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dumbbell, Sparkles, Clock, Zap, Home, Building } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface Workout {
  id: string
  title: string
  description: string
  duration: number
  intensity: string
  location: string
  equipment: string[]
  exercises: {
    name: string
    sets?: number
    reps?: string
    duration?: string
    description: string
  }[]
  tips: string[]
}

export function WorkoutGenerator() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [preferences, setPreferences] = useState({
    fitnessLevel: "beginner",
    duration: "20",
    location: "home",
    energyLevel: "low",
    equipment: "none",
    limitations: "",
  })

  const generateWorkout = async () => {
    setIsGenerating(true)

    try {
      const prompt = `Generate a workout plan for someone on GLP-1 medication (like Mounjaro) with the following preferences:
      - Fitness level: ${preferences.fitnessLevel}
      - Duration: ${preferences.duration} minutes
      - Location: ${preferences.location}
      - Current energy level: ${preferences.energyLevel}
      - Available equipment: ${preferences.equipment}
      - Physical limitations: ${preferences.limitations || "None"}
      
      Please provide a workout that is:
      - Gentle and accommodating for potential fatigue or nausea
      - Focused on maintaining muscle mass during weight loss
      - Scalable based on energy levels
      - Safe for beginners or those returning to exercise
      - Includes modifications for low energy days
      
      Format as JSON with: title, description, duration, intensity, location, equipment (array), exercises (array with name, sets, reps/duration, description), tips (array).
      
      Return only valid JSON for 1 workout.`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        system:
          "You are a fitness trainer specializing in exercise programs for people on GLP-1 medications and weight loss journeys. Always return valid JSON.",
      })

      // Try to parse the JSON response
      let parsedWorkout
      try {
        parsedWorkout = JSON.parse(text)
      } catch {
        // Fallback to demo data if parsing fails
        parsedWorkout = {
          title: "Gentle Strength & Mobility",
          description: "A low-impact workout perfect for days when energy is limited but you want to stay active",
          duration: 20,
          intensity: "Low to Moderate",
          location: "Home",
          equipment: ["None required"],
          exercises: [
            {
              name: "Wall Push-ups",
              sets: 2,
              reps: "8-12",
              description: "Stand arm's length from wall, place palms flat against wall, push in and out gently",
            },
            {
              name: "Chair Squats",
              sets: 2,
              reps: "10-15",
              description: "Sit down and stand up from a chair, use arms for support if needed",
            },
            {
              name: "Seated Marching",
              duration: "2 minutes",
              description: "Sit in chair and march in place, lifting knees alternately",
            },
            {
              name: "Arm Circles",
              sets: 1,
              reps: "10 each direction",
              description: "Extend arms to sides, make small circles, gradually increase size",
            },
            {
              name: "Deep Breathing",
              duration: "3 minutes",
              description: "Sit comfortably, breathe deeply through nose, out through mouth",
            },
          ],
          tips: [
            "Listen to your body - stop if you feel nauseous",
            "Stay hydrated but sip water slowly",
            "It's okay to do less on low-energy days",
            "Focus on consistency over intensity",
          ],
        }
      }

      const workoutWithId = {
        ...parsedWorkout,
        id: `workout-${Date.now()}`,
      }

      setWorkouts([workoutWithId])
    } catch (error) {
      console.error("Error generating workout:", error)
      // Show demo data on error
      setWorkouts([
        {
          id: "demo-workout",
          title: "Gentle Strength & Mobility",
          description: "A low-impact workout perfect for days when energy is limited but you want to stay active",
          duration: 20,
          intensity: "Low to Moderate",
          location: "Home",
          equipment: ["None required"],
          exercises: [
            {
              name: "Wall Push-ups",
              sets: 2,
              reps: "8-12",
              description: "Stand arm's length from wall, place palms flat against wall, push in and out gently",
            },
            {
              name: "Chair Squats",
              sets: 2,
              reps: "10-15",
              description: "Sit down and stand up from a chair, use arms for support if needed",
            },
          ],
          tips: ["Listen to your body - stop if you feel nauseous", "Stay hydrated but sip water slowly"],
        },
      ])
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            AI Workout Generator
          </CardTitle>
          <CardDescription>
            Get personalized workouts that adapt to your energy levels and GLP-1 journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Fitness Level</Label>
              <Select
                value={preferences.fitnessLevel}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, fitnessLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="returning">Returning to Exercise</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Select
                value={preferences.duration}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, duration: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="20">20 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Select
                value={preferences.location}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, location: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="gym">Gym</SelectItem>
                  <SelectItem value="outdoor">Outdoor</SelectItem>
                  <SelectItem value="office">Office/Work</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Current Energy Level</Label>
              <Select
                value={preferences.energyLevel}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, energyLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very-low">Very Low (Nauseous/Tired)</SelectItem>
                  <SelectItem value="low">Low (Some Fatigue)</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High (Feeling Great)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Available Equipment</Label>
              <Select
                value={preferences.equipment}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, equipment: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Bodyweight)</SelectItem>
                  <SelectItem value="basic">Basic (Resistance bands, light weights)</SelectItem>
                  <SelectItem value="home-gym">Home Gym Setup</SelectItem>
                  <SelectItem value="full-gym">Full Gym Access</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Physical Limitations</Label>
              <Textarea
                placeholder="e.g., knee issues, back problems, balance concerns..."
                value={preferences.limitations}
                onChange={(e) => setPreferences((prev) => ({ ...prev, limitations: e.target.value }))}
                className="h-20"
              />
            </div>
          </div>

          <Button
            onClick={generateWorkout}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generating Your Workout...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Workout
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {workouts.length > 0 && (
        <div className="space-y-6">
          {workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{workout.title}</span>
                  <div className="flex items-center gap-2">
                    {workout.location === "home" ? <Home className="h-4 w-4" /> : <Building className="h-4 w-4" />}
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                      {workout.location}
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription>{workout.description}</CardDescription>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {workout.duration} minutes
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    {workout.intensity}
                  </div>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4" />
                    {workout.equipment?.join(", ") || "No equipment"}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Exercises:</h4>
                  <div className="space-y-4">
                    {workout.exercises?.map((exercise, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-foreground">{exercise.name}</h5>
                          <div className="text-sm text-muted-foreground">
                            {exercise.sets && `${exercise.sets} sets`}
                            {exercise.reps && ` × ${exercise.reps}`}
                            {exercise.duration && exercise.duration}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{exercise.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {workout.tips && workout.tips.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Tips for Success:</h4>
                    <ul className="space-y-2">
                      {workout.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1">Start Workout</Button>
                  <Button variant="outline" className="flex-1">
                    Save for Later
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
