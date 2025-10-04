// Frontend API types

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ShoppingItem {
  id: number
  name: string
  amount: string
  plannedAmount: string
  category: string
  priority: "high" | "medium" | "low"
  isCompleted: boolean
}

export interface StorageItem {
  id: number
  name: string
  amount: string
  expiryDays: number
  plannedAmount: string
  category: string
}

export interface Meal {
  id: string
  title: string
  image: string
  cookTime: number
  servings: number
  hasAllIngredients: boolean
  ingredients: string[]
  instructions: string[]
  plannedDate?: string
  mealType?: "breakfast" | "lunch" | "dinner"
  isArchived?: boolean
}

export interface CalendarEvent {
  id: string
  title: string
  type: "meal" | "shopping" | "custom"
  time: string
  date: string
}

export interface PlannedMeal {
  id: number
  name: string
  date: string
  time: string
}

export interface UrgentShoppingItem {
  id: number
  name: string
  priority: "high" | "medium" | "low"
}

export interface ExpiringItem {
  id: number
  name: string
  daysLeft: number
  category: string
}
