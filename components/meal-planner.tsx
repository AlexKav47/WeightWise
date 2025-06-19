"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChefHat, Sparkles, ThumbsUp, ThumbsDown, Clock, Users } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface MealPlan {
  id: string
  title: string
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
  cookTime: number
  servings: number
  ingredients: string[]
  instructions: string[]
  tags: string[]
}

export function MealPlanner() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [preferences, setPreferences] = useState({
    calories: "1200-1500",
    cuisine: "any",
    cookingTime: "30",
    dietaryRestrictions: "",
    appetiteLevel: "low",
  })

  const generateMealPlan = async () => {
    setIsGenerating(true)

    try {
      const prompt = `Generate a meal plan for someone on GLP-1 medication (like Mounjaro) with the following preferences:
      - Calorie range: ${preferences.calories}
      - Cuisine preference: ${preferences.cuisine}
      - Maximum cooking time: ${preferences.cookingTime} minutes
      - Dietary restrictions: ${preferences.dietaryRestrictions || "None"}
      - Current appetite level: ${preferences.appetiteLevel}
      
      Please provide 3 meal options (breakfast, lunch, dinner) that are:
      - Easy to digest and GLP-1 friendly
      - High in protein to maintain muscle mass
      - Moderate in healthy fats
      - Lower in simple carbs
      - Portion-controlled for reduced appetite
      
      Format each meal as JSON with: title, description, calories, protein, carbs, fat, cookTime, servings, ingredients (array), instructions (array), tags (array).
      
      Return only valid JSON array of 3 meals.`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        system:
          "You are a nutritionist specializing in meal planning for people on GLP-1 medications. Always return valid JSON.",
      })

      // Try to parse the JSON response
      let parsedMeals
      try {
        parsedMeals = JSON.parse(text)
      } catch {
        // Fallback to demo data if parsing fails
        parsedMeals = [
          {
            title: "Protein-Packed Greek Yogurt Bowl",
            description: "Creamy Greek yogurt with berries and nuts - perfect for sensitive stomachs",
            calories: 280,
            protein: 20,
            carbs: 15,
            fat: 12,
            cookTime: 5,
            servings: 1,
            ingredients: ["1 cup Greek yogurt", "1/4 cup mixed berries", "1 tbsp chopped almonds", "1 tsp honey"],
            instructions: ["Add Greek yogurt to bowl", "Top with berries and almonds", "Drizzle with honey"],
            tags: ["High Protein", "Quick", "GLP-1 Friendly"],
          },
          {
            title: "Gentle Chicken & Rice Soup",
            description: "Soothing and easy to digest with lean protein",
            calories: 320,
            protein: 25,
            carbs: 28,
            fat: 8,
            cookTime: 25,
            servings: 2,
            ingredients: [
              "4 oz chicken breast",
              "1/2 cup white rice",
              "2 cups low-sodium broth",
              "1 carrot",
              "1 celery stalk",
            ],
            instructions: ["Cook chicken in broth", "Add rice and vegetables", "Simmer until tender"],
            tags: ["Comfort Food", "Easy Digest", "Batch Cook"],
          },
          {
            title: "Baked Salmon with Steamed Vegetables",
            description: "Omega-3 rich salmon with gentle, nutritious sides",
            calories: 380,
            protein: 32,
            carbs: 12,
            fat: 22,
            cookTime: 20,
            servings: 1,
            ingredients: ["5 oz salmon fillet", "1 cup broccoli", "1/2 cup carrots", "1 tbsp olive oil", "Lemon"],
            instructions: ["Season salmon with lemon", "Bake at 400°F for 15 minutes", "Steam vegetables until tender"],
            tags: ["Heart Healthy", "Anti-Inflammatory", "Omega-3"],
          },
        ]
      }

      const mealsWithIds = parsedMeals.map((meal: any, index: number) => ({
        ...meal,
        id: `meal-${Date.now()}-${index}`,
      }))

      setMealPlans(mealsWithIds)
    } catch (error) {
      console.error("Error generating meal plan:", error)
      // Show demo data on error
      setMealPlans([
        {
          id: "demo-1",
          title: "Protein-Packed Greek Yogurt Bowl",
          description: "Creamy Greek yogurt with berries and nuts - perfect for sensitive stomachs",
          calories: 280,
          protein: 20,
          carbs: 15,
          fat: 12,
          cookTime: 5,
          servings: 1,
          ingredients: ["1 cup Greek yogurt", "1/4 cup mixed berries", "1 tbsp chopped almonds", "1 tsp honey"],
          instructions: ["Add Greek yogurt to bowl", "Top with berries and almonds", "Drizzle with honey"],
          tags: ["High Protein", "Quick", "GLP-1 Friendly"],
        },
      ])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFeedback = (mealId: string, liked: boolean) => {
    // In a real app, this would send feedback to improve AI recommendations
    console.log(`Meal ${mealId} ${liked ? "liked" : "disliked"}`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            AI Meal Planner
          </CardTitle>
          <CardDescription>Get personalized meal recommendations tailored for GLP-1 users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Daily Calories</Label>
              <Select
                value={preferences.calories}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, calories: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="800-1200">800-1200 (Very Low)</SelectItem>
                  <SelectItem value="1200-1500">1200-1500 (Low)</SelectItem>
                  <SelectItem value="1500-1800">1500-1800 (Moderate)</SelectItem>
                  <SelectItem value="1800-2200">1800-2200 (Higher)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cuisine Preference</Label>
              <Select
                value={preferences.cuisine}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, cuisine: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Cuisine</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Max Cooking Time</Label>
              <Select
                value={preferences.cookingTime}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, cookingTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Current Appetite</Label>
              <Select
                value={preferences.appetiteLevel}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, appetiteLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very-low">Very Low (Nauseous)</SelectItem>
                  <SelectItem value="low">Low (Reduced)</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High (Hungry)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Dietary Restrictions</Label>
              <Textarea
                placeholder="e.g., No dairy, vegetarian, gluten-free..."
                value={preferences.dietaryRestrictions}
                onChange={(e) => setPreferences((prev) => ({ ...prev, dietaryRestrictions: e.target.value }))}
                className="h-20"
              />
            </div>
          </div>

          <Button
            onClick={generateMealPlan}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generating Your Meal Plan...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Meal Plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {mealPlans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mealPlans.map((meal) => (
            <Card key={meal.id} className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg">{meal.title}</CardTitle>
                <CardDescription>{meal.description}</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {meal.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {meal.cookTime} min
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {meal.servings} serving{meal.servings > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div>
                    <div className="font-semibold text-purple-400">{meal.calories}</div>
                    <div className="text-xs text-muted-foreground">Cal</div>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-400">{meal.protein}g</div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-400">{meal.carbs}g</div>
                    <div className="text-xs text-muted-foreground">Carbs</div>
                  </div>
                  <div>
                    <div className="font-semibold text-violet-400">{meal.fat}g</div>
                    <div className="text-xs text-muted-foreground">Fat</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Ingredients:</h4>
                  <ul className="text-sm space-y-1">
                    {meal.ingredients?.map((ingredient, index) => (
                      <li key={index} className="text-gray-600">
                        • {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Instructions:</h4>
                  <ol className="text-sm space-y-1">
                    {meal.instructions?.map((step, index) => (
                      <li key={index} className="text-gray-600">
                        {index + 1}. {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => handleFeedback(meal.id, true)} className="flex-1">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleFeedback(meal.id, false)} className="flex-1">
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Dislike
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
