"use client"
import { useState } from "react"
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
  const [activeTab, setActiveTab] = useState<"saved" | "explore">("explore")
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([
    {
      id: "saved-1",
      title: "Spaghetti Carbonara",
      image: "/spaghetti-carbonara-pasta-dish.jpg",
      cookTime: 25,
      servings: 4,
      hasAllIngredients: true,
      ingredients: ["Spaghetti", "Eggs", "Bacon", "Parmesan"],
      instructions: ["Boil pasta", "Cook bacon", "Mix eggs and cheese", "Combine all"],
      plannedDate: "2025-01-25",
      mealType: "dinner",
    },
  ])

  const [exploreMeals] = useState<Meal[]>([
    {
      id: "explore-1",
      title: "Chicken Tikka Masala",
      image: "/chicken-tikka-masala-curry-dish.jpg",
      cookTime: 45,
      servings: 4,
      hasAllIngredients: false,
      ingredients: ["Chicken", "Tomatoes", "Cream", "Spices"],
      instructions: ["Marinate chicken", "Cook sauce", "Combine and simmer"],
    },
    {
      id: "explore-2",
      title: "Caesar Salad",
      image: "/caesar-salad-croutons.png",
      cookTime: 15,
      servings: 2,
      hasAllIngredients: true,
      ingredients: ["Romaine", "Croutons", "Parmesan", "Caesar dressing"],
      instructions: ["Wash lettuce", "Make dressing", "Toss and serve"],
    },
    {
      id: "explore-3",
      title: "Beef Stir Fry",
      image: "/beef-stir-fry.png",
      cookTime: 20,
      servings: 3,
      hasAllIngredients: false,
      ingredients: ["Beef strips", "Mixed vegetables", "Soy sauce", "Garlic"],
      instructions: ["Heat wok", "Cook beef", "Add vegetables", "Season and serve"],
    },
    {
      id: "explore-4",
      title: "Margherita Pizza",
      image: "/margherita-pizza-basil.png",
      cookTime: 30,
      servings: 4,
      hasAllIngredients: true,
      ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Basil"],
      instructions: ["Roll dough", "Add sauce", "Top with cheese", "Bake until golden"],
    },
  ])

  const [showPlanModal, setShowPlanModal] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [plannedDate, setPlannedDate] = useState("")
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner">("dinner")

  const handlePlanMeal = (meal: Meal) => {
    setSelectedMeal(meal)
    setShowPlanModal(true)
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

  const MealCard = ({ meal, isSaved = false }: { meal: Meal | SavedMeal; isSaved?: boolean }) => (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="relative">
        <img src={meal.image || "/placeholder.svg"} alt={meal.title} className="w-full h-48 object-cover" />
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

      <div className="p-4">
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
              onClick={() => handlePlanMeal(meal)}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Plan As Meal
            </Button>
            <Button
              onClick={() => handleArchiveMeal(meal)}
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
            variant={activeTab === "explore" ? "default" : "ghost"}
            onClick={() => setActiveTab("explore")}
            className="flex-1 rounded-md"
          >
            Explore
          </Button>
          <Button
            variant={activeTab === "saved" ? "default" : "ghost"}
            onClick={() => setActiveTab("saved")}
            className="flex-1 rounded-md"
          >
            Saved
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {activeTab === "explore" ? (
          <div className="grid grid-cols-1 gap-4">
            {exploreMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {savedMeals.length > 0 ? (
              savedMeals.map((meal) => <MealCard key={meal.id} meal={meal} isSaved />)
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No saved meals yet</p>
                <p className="text-sm text-muted-foreground mt-1">Add meals from the Explore tab to get started</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Plan Your Meal</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meal-date" className="text-foreground">
                When do you want to cook {selectedMeal?.title}?
              </Label>
              <Input
                id="meal-date"
                type="date"
                value={plannedDate}
                onChange={(e) => setPlannedDate(e.target.value)}
                className="bg-background border-border text-foreground"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Meal Type</Label>
              <Select value={mealType} onValueChange={(value: "breakfast" | "lunch" | "dinner") => setMealType(value)}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="breakfast" className="text-foreground hover:bg-muted">
                    Breakfast
                  </SelectItem>
                  <SelectItem value="lunch" className="text-foreground hover:bg-muted">
                    Lunch
                  </SelectItem>
                  <SelectItem value="dinner" className="text-foreground hover:bg-muted">
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
    </div>
  )
}
