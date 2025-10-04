"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Users, Check, X, Archive, Calendar } from "lucide-react"

interface Meal {
  id: string
  title: string
  image: string
  cookTime: number
  servings: number
  hasAllIngredients: boolean
  ingredients: string[]
  instructions: string[]
}

interface SavedMeal extends Meal {
  plannedDate?: string
  mealType?: "breakfast" | "lunch" | "dinner"
  isArchived?: boolean
}

export function MealsPage() {
  const [activeTab, setActiveTab] = useState<"my_food" | "explore">("my_food")
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([])
  const [exploreMeals, setExploreMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [showSavedRecipes, setShowSavedRecipes] = useState(false)
  const [showCreateRecipe, setShowCreateRecipe] = useState(false)
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    image: '',
    cookTime: '',
    servings: '',
    ingredients: '',
    instructions: ''
  })

  const fetchMeals = async () => {
    try {
      setLoading(true)
      // Fetch My Food meals (with ingredient availability)
      const myFoodResponse = await fetch('http://localhost:3001/api/meals/my-food')
      if (myFoodResponse.ok) {
        const myFoodData = await myFoodResponse.json()
        if (myFoodData.success && myFoodData.data) {
          setSavedMeals(myFoodData.data)
        }
      }

      // Fetch explore meals
      const exploreResponse = await fetch('http://localhost:3001/api/meals/explore/meals')
      if (exploreResponse.ok) {
        const exploreData = await exploreResponse.json()
        if (exploreData.success && exploreData.data) {
          setExploreMeals(exploreData.data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch meals:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMeals()
  }, [])

  // Refetch data when switching to My Food tab
  useEffect(() => {
    if (activeTab === 'my_food') {
      fetchMeals()
    }
  }, [activeTab])

  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showMealDetailModal, setShowMealDetailModal] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [plannedDate, setPlannedDate] = useState("")
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner">("dinner")

  const handlePlanMeal = (meal: Meal) => {
    setSelectedMeal(meal)
    setShowPlanModal(true)
  }

  const handleMealClick = (meal: Meal) => {
    setSelectedMeal(meal)
    setShowMealDetailModal(true)
  }

  const handleArchiveMeal = (meal: Meal) => {
    const archivedMeal: SavedMeal = {
      ...meal,
      isArchived: true,
    }
    setSavedMeals((prev) => [...prev, archivedMeal])
  }

  const handleSavePlannedMeal = () => {
    if (!selectedMeal || !plannedDate || !mealType) return

    const newSavedMeal: SavedMeal = {
      ...selectedMeal,
      plannedDate,
      mealType,
    }

    setSavedMeals((prev) => [...prev, newSavedMeal])

    const calendarEvent = {
      id: `meal-${Date.now()}`,
      title: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)}: ${selectedMeal.title}`,
      date: plannedDate,
      time: mealType === "breakfast" ? "08:00" : mealType === "lunch" ? "12:00" : "18:00",
      duration: Math.ceil(selectedMeal.cookTime / 60) || 1,
      type: "meal" as const,
      description: `Cook ${selectedMeal.title} (${selectedMeal.cookTime} min)`,
    }

    const existingEvents = JSON.parse(localStorage.getItem("calendarEvents") || "[]")
    localStorage.setItem("calendarEvents", JSON.stringify([...existingEvents, calendarEvent]))

    setShowPlanModal(false)
    setSelectedMeal(null)
    setPlannedDate("")
    setMealType("dinner")
  }

  const handleCreateRecipe = async () => {
    if (!newRecipe.title || !newRecipe.ingredients || !newRecipe.instructions) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const recipeData = {
        title: newRecipe.title,
        image: newRecipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center",
        cookTime: parseInt(newRecipe.cookTime) || 30,
        servings: parseInt(newRecipe.servings) || 4,
        hasAllIngredients: false,
        ingredients: newRecipe.ingredients.split('\n').filter(line => line.trim()),
        instructions: newRecipe.instructions.split('\n').filter(line => line.trim()),
        plannedDate: new Date().toISOString().split('T')[0],
        mealType: "dinner" as const,
        isArchived: false
      }

      const response = await fetch('http://localhost:3001/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Reset form
          setNewRecipe({
            title: '',
            image: '',
            cookTime: '',
            servings: '',
            ingredients: '',
            instructions: ''
          })
          
          setShowCreateRecipe(false)
          
          // Refresh the data to show the new recipe
          await fetchMeals()
          
          alert('Recipe created successfully!')
        }
      } else {
        alert('Failed to create recipe')
      }
    } catch (error) {
      console.error('Error creating recipe:', error)
      alert('Error creating recipe')
    }
  }

  const MealCard = ({ meal, isSaved = false }: { meal: Meal | SavedMeal; isSaved?: boolean }) => (
    <div 
      className="bg-white/5 backdrop-blur-md rounded-xl border-gray-300/20 shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-200"
      onClick={() => handleMealClick(meal)}
    >
      <div className="relative">
        <img 
          src={meal.image || "/placeholder.svg"} 
          alt={meal.title} 
          className="w-full h-48 object-cover" 
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center"
          }}
        />
        <div className="absolute top-2 right-2">
          {meal.hasAllIngredients ? (
            <div className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Check className="w-3 h-3" />
              Ready
            </div>
          ) : (
            <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <X className="w-3 h-3" />
              Missing
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-white/5 backdrop-blur-sm">
        <h3 className="font-semibold text-foreground mb-2">{meal.title}</h3>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{meal.cookTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{meal.servings} servings</span>
          </div>
        </div>

        {isSaved && "plannedDate" in meal && meal.plannedDate && (
          <div className="text-sm text-primary mb-3">
            {meal.isArchived ? (
              <span className="text-muted-foreground">Archived</span>
            ) : (
              <span>
                {meal.mealType && `${meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)} - `}
                {new Date(meal.plannedDate).toLocaleDateString()}
              </span>
            )}
          </div>
        )}

        {!isSaved && (
          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation()
                handlePlanMeal(meal)
              }}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Plan As Meal
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                handleArchiveMeal(meal)
              }}
              variant="outline"
              className="px-3 border-border hover:bg-muted"
            >
              <Archive className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex bg-muted rounded-lg p-1">
          <Button
            variant={activeTab === "my_food" ? "default" : "ghost"}
            onClick={() => setActiveTab("my_food")}
            className="flex-1 rounded-md"
          >
            My Food
          </Button>
          <Button
            variant={activeTab === "explore" ? "default" : "ghost"}
            onClick={() => setActiveTab("explore")}
            className="flex-1 rounded-md"
          >
            Explore
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading meals...</p>
          </div>
        ) : activeTab === "my_food" ? (
          <div className="space-y-6">
            {/* My Food Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={async () => {
                  await fetchMeals()
                  setShowSavedRecipes(true)
                }}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
              >
                <Archive className="w-4 h-4" />
                View Saved Recipes
              </Button>
              <Button
                onClick={() => setShowCreateRecipe(true)}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Create Recipe
              </Button>
            </div>

            {/* Default Feed - Meals with Available Ingredients */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Ready to Cook</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedMeals.filter(meal => meal.hasAllIngredients).length > 0 ? (
                  savedMeals
                    .filter(meal => meal.hasAllIngredients)
                    .map((meal) => <MealCard key={meal.id} meal={meal} isSaved />)
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-muted-foreground">No meals ready to cook</p>
                    <p className="text-sm text-muted-foreground mt-1">Add ingredients to your storage to see ready-to-cook meals</p>
                  </div>
                )}
              </div>
            </div>

            {/* Meals with Missing Ingredients */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Need Ingredients</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedMeals.filter(meal => !meal.hasAllIngredients).length > 0 ? (
                  savedMeals
                    .filter(meal => !meal.hasAllIngredients)
                    .map((meal) => <MealCard key={meal.id} meal={meal} isSaved />)
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-muted-foreground">All your saved meals are ready to cook!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exploreMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        )}
      </div>

      <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
        <DialogContent className="sm:max-w-md bg-white border-gray-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Plan Your Meal</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meal-date" className="text-gray-700">
                When do you want to cook {selectedMeal?.title}?
              </Label>
              <Input
                id="meal-date"
                type="date"
                value={plannedDate}
                onChange={(e) => setPlannedDate(e.target.value)}
                className="bg-white border-gray-300 text-gray-900"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Meal Type</Label>
              <Select value={mealType} onValueChange={(value: "breakfast" | "lunch" | "dinner") => setMealType(value)}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg">
                  <SelectItem value="breakfast" className="text-gray-900 hover:bg-gray-100">
                    Breakfast
                  </SelectItem>
                  <SelectItem value="lunch" className="text-gray-900 hover:bg-gray-100">
                    Lunch
                  </SelectItem>
                  <SelectItem value="dinner" className="text-gray-900 hover:bg-gray-100">
                    Dinner
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowPlanModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSavePlannedMeal}
                disabled={!plannedDate || !mealType}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Plan Meal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Saved Recipes Modal */}
      <Dialog open={showSavedRecipes} onOpenChange={setShowSavedRecipes}>
        <DialogContent className="max-w-4xl bg-white border-gray-200 shadow-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-2xl">My Saved Recipes</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} isSaved />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Recipe Modal */}
      <Dialog open={showCreateRecipe} onOpenChange={setShowCreateRecipe}>
        <DialogContent className="max-w-2xl bg-white border-gray-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-2xl">Create Custom Recipe</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipe-title" className="text-gray-700">Recipe Title *</Label>
              <Input
                id="recipe-title"
                placeholder="Enter recipe name"
                value={newRecipe.title}
                onChange={(e) => setNewRecipe(prev => ({ ...prev, title: e.target.value }))}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipe-image" className="text-gray-700">Image URL</Label>
              <Input
                id="recipe-image"
                placeholder="https://example.com/image.jpg"
                value={newRecipe.image}
                onChange={(e) => setNewRecipe(prev => ({ ...prev, image: e.target.value }))}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cook-time" className="text-gray-700">Cook Time (minutes)</Label>
                <Input
                  id="cook-time"
                  type="number"
                  placeholder="30"
                  value={newRecipe.cookTime}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, cookTime: e.target.value }))}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="servings" className="text-gray-700">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  placeholder="4"
                  value={newRecipe.servings}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, servings: e.target.value }))}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ingredients" className="text-gray-700">Ingredients (one per line) *</Label>
              <textarea
                id="ingredients"
                placeholder="400g Spaghetti&#10;4 Eggs&#10;200g Bacon"
                value={newRecipe.ingredients}
                onChange={(e) => setNewRecipe(prev => ({ ...prev, ingredients: e.target.value }))}
                className="w-full h-24 p-3 bg-white border border-gray-300 text-gray-900 rounded-md resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-gray-700">Instructions (one per line) *</Label>
              <textarea
                id="instructions"
                placeholder="Boil pasta according to package instructions&#10;Cook bacon until crispy"
                value={newRecipe.instructions}
                onChange={(e) => setNewRecipe(prev => ({ ...prev, instructions: e.target.value }))}
                className="w-full h-32 p-3 bg-white border border-gray-300 text-gray-900 rounded-md resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowCreateRecipe(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleCreateRecipe}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Create Recipe
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Meal Detail Modal */}
      <Dialog open={showMealDetailModal} onOpenChange={setShowMealDetailModal}>
        <DialogContent className="max-w-2xl bg-white border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-2xl">{selectedMeal?.title}</DialogTitle>
          </DialogHeader>

          {selectedMeal && (
            <div className="space-y-6">
              {/* Meal Image */}
              <div className="relative">
                <img 
                  src={selectedMeal.image || "/placeholder.svg"} 
                  alt={selectedMeal.title} 
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center"
                  }}
                />
                <div className="absolute top-4 right-4">
                  {selectedMeal.hasAllIngredients ? (
                    <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Ready to Cook
                    </div>
                  ) : (
                    <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <X className="w-4 h-4" />
                      Missing Ingredients
                    </div>
                  )}
                </div>
              </div>

              {/* Meal Info */}
              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg">{selectedMeal.cookTime} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="text-lg">{selectedMeal.servings} servings</span>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Ingredients</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedMeal.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-800 font-medium">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cooking Instructions */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cooking Instructions</h3>
                <div className="space-y-3">
                  {selectedMeal.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-gray-800">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => {
                    setShowMealDetailModal(false)
                    handlePlanMeal(selectedMeal)
                  }}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Plan This Meal
                </Button>
                <Button
                  onClick={() => {
                    setShowMealDetailModal(false)
                    handleArchiveMeal(selectedMeal)
                  }}
                  variant="outline"
                  className="px-4 border-border hover:bg-muted flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
