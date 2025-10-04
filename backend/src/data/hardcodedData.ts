import { StorageItem, ShoppingItem, Meal, CalendarEvent, PlannedMeal, UrgentShoppingItem, ExpiringItem } from '../types'

// Hardcoded storage items
export const storageItems: StorageItem[] = [
  // Dairy
  { id: 1, name: "Whole Milk", amount: "1L", expiryDays: 3, plannedAmount: "500ml", category: "Dairy" },
  { id: 2, name: "Greek Yogurt", amount: "500g", expiryDays: 1, plannedAmount: "200g", category: "Dairy" },
  { id: 3, name: "Cheddar Cheese", amount: "200g", expiryDays: 7, plannedAmount: "100g", category: "Dairy" },
  { id: 4, name: "Mozzarella", amount: "250g", expiryDays: 4, plannedAmount: "150g", category: "Dairy" },

  // Vegetables
  { id: 5, name: "Spinach", amount: "150g", expiryDays: 2, plannedAmount: "100g", category: "Vegetables" },
  { id: 6, name: "Tomatoes", amount: "6 pcs", expiryDays: 5, plannedAmount: "3 pcs", category: "Vegetables" },
  { id: 7, name: "Bell Peppers", amount: "3 pcs", expiryDays: 8, plannedAmount: "1 pc", category: "Vegetables" },
  { id: 8, name: "Carrots", amount: "500g", expiryDays: 10, plannedAmount: "200g", category: "Vegetables" },

  // Meat
  { id: 9, name: "Chicken Breast", amount: "800g", expiryDays: 3, plannedAmount: "400g", category: "Meat" },
  { id: 10, name: "Ground Beef", amount: "500g", expiryDays: 2, plannedAmount: "300g", category: "Meat" },
  { id: 11, name: "Salmon Fillet", amount: "600g", expiryDays: 4, plannedAmount: "300g", category: "Meat" },

  // Fruits
  { id: 12, name: "Bananas", amount: "6 pcs", expiryDays: 4, plannedAmount: "2 pcs", category: "Fruits" },
  { id: 13, name: "Strawberries", amount: "250g", expiryDays: 3, plannedAmount: "150g", category: "Fruits" },
  { id: 14, name: "Apples", amount: "8 pcs", expiryDays: 7, plannedAmount: "3 pcs", category: "Fruits" },

  // Pantry
  { id: 15, name: "Pasta", amount: "500g", expiryDays: 365, plannedAmount: "200g", category: "Pantry" },
  { id: 16, name: "Rice", amount: "1kg", expiryDays: 180, plannedAmount: "300g", category: "Pantry" },
  { id: 17, name: "Olive Oil", amount: "500ml", expiryDays: 730, plannedAmount: "50ml", category: "Pantry" },

  // Beverages
  { id: 18, name: "Orange Juice", amount: "1L", expiryDays: 6, plannedAmount: "250ml", category: "Beverages" },
  { id: 19, name: "Coffee Beans", amount: "250g", expiryDays: 90, plannedAmount: "50g", category: "Beverages" },
  { id: 20, name: "Green Tea", amount: "100 bags", expiryDays: 365, plannedAmount: "5 bags", category: "Beverages" },
  { id: 21, name: "Coconut Water", amount: "1L", expiryDays: 7, plannedAmount: "250ml", category: "Beverages" },

  // Additional Pantry Items
  { id: 22, name: "Flour", amount: "1kg", expiryDays: 180, plannedAmount: "200g", category: "Pantry" },
  { id: 23, name: "Sugar", amount: "500g", expiryDays: 730, plannedAmount: "50g", category: "Pantry" },
  { id: 24, name: "Salt", amount: "200g", expiryDays: 1095, plannedAmount: "10g", category: "Pantry" },
  { id: 25, name: "Black Pepper", amount: "50g", expiryDays: 365, plannedAmount: "5g", category: "Pantry" },
  { id: 26, name: "Garlic", amount: "1 bulb", expiryDays: 14, plannedAmount: "3 cloves", category: "Vegetables" },
  { id: 27, name: "Ginger", amount: "100g", expiryDays: 21, plannedAmount: "20g", category: "Vegetables" },
  { id: 28, name: "Lemons", amount: "4 pcs", expiryDays: 10, plannedAmount: "1 pc", category: "Fruits" },
  { id: 29, name: "Limes", amount: "6 pcs", expiryDays: 7, plannedAmount: "2 pcs", category: "Fruits" },
  { id: 30, name: "Avocados", amount: "3 pcs", expiryDays: 5, plannedAmount: "1 pc", category: "Fruits" },
]

// Hardcoded shopping items
export const shoppingItems: ShoppingItem[] = [
  // High Priority
  { id: 1, name: "Milk", amount: "1L", plannedAmount: "1L", category: "Dairy", priority: "high", isCompleted: false },
  { id: 2, name: "Bread", amount: "1 loaf", plannedAmount: "1 loaf", category: "Grains", priority: "high", isCompleted: false },
  { id: 3, name: "Eggs", amount: "12 pcs", plannedAmount: "12 pcs", category: "Dairy", priority: "high", isCompleted: false },
  { id: 4, name: "Butter", amount: "250g", plannedAmount: "250g", category: "Dairy", priority: "high", isCompleted: false },
  { id: 5, name: "Cheese", amount: "200g", plannedAmount: "200g", category: "Dairy", priority: "high", isCompleted: false },
  { id: 6, name: "Ground Beef", amount: "500g", plannedAmount: "500g", category: "Meat", priority: "high", isCompleted: false },

  // Medium Priority
  { id: 7, name: "Tomatoes", amount: "6 pcs", plannedAmount: "4 pcs", category: "Vegetables", priority: "medium", isCompleted: false },
  { id: 8, name: "Chicken Breast", amount: "800g", plannedAmount: "600g", category: "Meat", priority: "medium", isCompleted: false },
  { id: 9, name: "Greek Yogurt", amount: "500g", plannedAmount: "300g", category: "Dairy", priority: "medium", isCompleted: false },
  { id: 10, name: "Onions", amount: "1kg", plannedAmount: "500g", category: "Vegetables", priority: "medium", isCompleted: false },
  { id: 11, name: "Bell Peppers", amount: "3 pcs", plannedAmount: "2 pcs", category: "Vegetables", priority: "medium", isCompleted: false },
  { id: 12, name: "Salmon", amount: "600g", plannedAmount: "400g", category: "Meat", priority: "medium", isCompleted: false },
  { id: 13, name: "Apples", amount: "6 pcs", plannedAmount: "4 pcs", category: "Fruits", priority: "medium", isCompleted: false },
  { id: 14, name: "Orange Juice", amount: "1L", plannedAmount: "750ml", category: "Beverages", priority: "medium", isCompleted: false },

  // Low Priority
  { id: 15, name: "Olive Oil", amount: "500ml", plannedAmount: "250ml", category: "Pantry", priority: "low", isCompleted: false },
  { id: 16, name: "Bananas", amount: "6 pcs", plannedAmount: "4 pcs", category: "Fruits", priority: "low", isCompleted: false },
  { id: 17, name: "Rice", amount: "1kg", plannedAmount: "500g", category: "Grains", priority: "low", isCompleted: false },
  { id: 18, name: "Spices", amount: "Assorted", plannedAmount: "As needed", category: "Pantry", priority: "low", isCompleted: false },
  { id: 19, name: "Pasta", amount: "500g", plannedAmount: "300g", category: "Grains", priority: "low", isCompleted: false },
  { id: 20, name: "Coffee Beans", amount: "250g", plannedAmount: "200g", category: "Beverages", priority: "low", isCompleted: false },
  { id: 21, name: "Frozen Vegetables", amount: "1kg", plannedAmount: "500g", category: "Vegetables", priority: "low", isCompleted: false },
  { id: 22, name: "Cereal", amount: "500g", plannedAmount: "300g", category: "Grains", priority: "low", isCompleted: false },
]

// Hardcoded meals
export const meals: Meal[] = [
  // Saved meals
  {
    id: "saved-1",
    title: "Spaghetti Carbonara",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center",
    cookTime: 25,
    servings: 4,
    hasAllIngredients: true,
    ingredients: ["Spaghetti", "Eggs", "Bacon", "Parmesan", "Black Pepper"],
    instructions: [
      "Boil pasta according to package instructions",
      "Cook bacon until crispy",
      "Mix eggs and grated parmesan in a bowl",
      "Drain pasta and immediately mix with bacon",
      "Remove from heat and quickly stir in egg mixture",
      "Season with black pepper and serve"
    ],
    plannedDate: "2025-01-25",
    mealType: "dinner",
    isArchived: false
  },
  {
    id: "saved-2",
    title: "Chicken Stir Fry",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center",
    cookTime: 20,
    servings: 3,
    hasAllIngredients: true,
    ingredients: ["Chicken Breast", "Bell Peppers", "Broccoli", "Soy Sauce", "Garlic", "Ginger"],
    instructions: [
      "Cut chicken into strips",
      "Heat oil in a wok or large pan",
      "Cook chicken until golden brown",
      "Add vegetables and stir-fry for 3-4 minutes",
      "Add soy sauce, garlic, and ginger",
      "Cook for another 2 minutes and serve"
    ],
    plannedDate: "2025-01-26",
    mealType: "dinner",
    isArchived: false
  },

  // Explore meals
  {
    id: "explore-1",
    title: "Chicken Tikka Masala",
    image: "https://images.unsplash.com/photo-1585937421612-70a0084f8f05?w=400&h=300&fit=crop&crop=center",
    cookTime: 45,
    servings: 4,
    hasAllIngredients: false,
    ingredients: ["Chicken", "Tomatoes", "Cream", "Spices", "Onions", "Garlic"],
    instructions: [
      "Marinate chicken with yogurt and spices",
      "Cook chicken until golden",
      "Make tomato-based sauce with onions and garlic",
      "Add cream and simmer",
      "Combine chicken with sauce and cook until tender"
    ]
  },
  {
    id: "explore-2",
    title: "Caesar Salad",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&crop=center",
    cookTime: 15,
    servings: 2,
    hasAllIngredients: true,
    ingredients: ["Romaine Lettuce", "Croutons", "Parmesan", "Caesar Dressing", "Lemon"],
    instructions: [
      "Wash and chop romaine lettuce",
      "Make homemade croutons",
      "Prepare caesar dressing with lemon and parmesan",
      "Toss lettuce with dressing",
      "Top with croutons and parmesan shavings"
    ]
  },
  {
    id: "explore-3",
    title: "Beef Stir Fry",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop&crop=center",
    cookTime: 20,
    servings: 3,
    hasAllIngredients: false,
    ingredients: ["Beef Strips", "Mixed Vegetables", "Soy Sauce", "Garlic", "Sesame Oil"],
    instructions: [
      "Heat wok or large pan over high heat",
      "Cook beef strips until browned",
      "Add mixed vegetables and stir-fry",
      "Season with soy sauce and garlic",
      "Finish with sesame oil and serve"
    ]
  },
  {
    id: "explore-4",
    title: "Margherita Pizza",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop&crop=center",
    cookTime: 30,
    servings: 4,
    hasAllIngredients: true,
    ingredients: ["Pizza Dough", "Tomato Sauce", "Mozzarella", "Fresh Basil", "Olive Oil"],
    instructions: [
      "Preheat oven to 450°F",
      "Roll out pizza dough",
      "Spread tomato sauce evenly",
      "Top with mozzarella cheese",
      "Bake for 12-15 minutes until golden",
      "Garnish with fresh basil and olive oil"
    ]
  },
  {
    id: "explore-5",
    title: "Greek Salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&crop=center",
    cookTime: 10,
    servings: 4,
    hasAllIngredients: true,
    ingredients: ["Tomatoes", "Cucumber", "Red Onion", "Feta Cheese", "Olives", "Olive Oil"],
    instructions: [
      "Chop tomatoes and cucumber",
      "Slice red onion thinly",
      "Combine vegetables in a bowl",
      "Add feta cheese and olives",
      "Drizzle with olive oil and season"
    ]
  },
  {
    id: "explore-6",
    title: "Chicken Teriyaki",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop&crop=center",
    cookTime: 30,
    servings: 4,
    hasAllIngredients: false,
    ingredients: ["Chicken Thighs", "Soy Sauce", "Honey", "Garlic", "Ginger", "Rice"],
    instructions: [
      "Marinate chicken in teriyaki sauce",
      "Cook chicken until golden brown",
      "Make teriyaki sauce with soy sauce and honey",
      "Simmer chicken in sauce",
      "Serve over rice"
    ]
  },
  {
    id: "explore-7",
    title: "Vegetable Stir Fry",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center",
    cookTime: 15,
    servings: 3,
    hasAllIngredients: true,
    ingredients: ["Mixed Vegetables", "Soy Sauce", "Garlic", "Sesame Oil", "Rice"],
    instructions: [
      "Heat oil in wok",
      "Add garlic and stir-fry",
      "Add mixed vegetables",
      "Season with soy sauce",
      "Serve over rice"
    ]
  },
  {
    id: "explore-8",
    title: "Pasta Aglio e Olio",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center",
    cookTime: 20,
    servings: 2,
    hasAllIngredients: true,
    ingredients: ["Spaghetti", "Garlic", "Olive Oil", "Red Pepper Flakes", "Parsley"],
    instructions: [
      "Boil pasta until al dente",
      "Heat olive oil with garlic",
      "Add red pepper flakes",
      "Toss pasta with oil mixture",
      "Garnish with parsley"
    ]
  }
]

// Hardcoded calendar events
export const calendarEvents: CalendarEvent[] = [
  { id: "1", title: "Breakfast: Oatmeal", type: "meal", time: "08:00", date: "2025-01-20" },
  { id: "2", title: "Grocery Shopping", type: "shopping", time: "10:00", date: "2025-01-21" },
  { id: "3", title: "Lunch: Pasta", type: "meal", time: "12:30", date: "2025-01-21" },
  { id: "4", title: "Dinner: Salmon", type: "meal", time: "19:00", date: "2025-01-22" },
  { id: "5", title: "Weekly Shop", type: "shopping", time: "09:00", date: "2025-01-25" },
  { id: "6", title: "Meal Prep", type: "custom", time: "15:00", date: "2025-01-19" },
  { id: "7", title: "Dinner Party", type: "custom", time: "18:00", date: "2025-01-30" },
  { id: "8", title: "Breakfast: Pancakes", type: "meal", time: "09:00", date: "2025-01-23" },
  { id: "9", title: "Lunch: Caesar Salad", type: "meal", time: "13:00", date: "2025-01-24" },
  { id: "10", title: "Farmers Market", type: "shopping", time: "08:00", date: "2025-01-26" },
  { id: "11", title: "Dinner: Chicken Teriyaki", type: "meal", time: "19:30", date: "2025-01-27" },
  { id: "12", title: "Bulk Shopping", type: "shopping", time: "14:00", date: "2025-01-28" },
  { id: "13", title: "Lunch: Pasta Aglio e Olio", type: "meal", time: "12:30", date: "2025-01-29" },
  { id: "14", title: "Meal Prep Session", type: "custom", time: "16:00", date: "2025-01-30" },
  { id: "15", title: "Breakfast: Avocado Toast", type: "meal", time: "08:30", date: "2025-01-31" },
  { id: "16", title: "Dinner: Vegetable Stir Fry", type: "meal", time: "18:45", date: "2025-02-01" },
  { id: "17", title: "Weekend Grocery Run", type: "shopping", time: "10:00", date: "2025-02-02" }
]

// Dashboard data
export const plannedMeals: PlannedMeal[] = [
  { id: 1, name: "Spaghetti Carbonara", date: "Today", time: "7:00 PM" },
  { id: 2, name: "Chicken Stir Fry", date: "Tomorrow", time: "6:30 PM" },
  { id: 3, name: "Greek Salad", date: "Wednesday", time: "12:30 PM" },
  { id: 4, name: "Beef Stir Fry", date: "Thursday", time: "7:30 PM" },
  { id: 5, name: "Margherita Pizza", date: "Friday", time: "6:00 PM" },
  { id: 6, name: "Chicken Teriyaki", date: "Saturday", time: "7:00 PM" },
  { id: 7, name: "Pasta Aglio e Olio", date: "Sunday", time: "6:30 PM" }
]

export const urgentShoppingItems: UrgentShoppingItem[] = [
  { id: 1, name: "Milk", priority: "high" },
  { id: 2, name: "Bread", priority: "high" },
  { id: 3, name: "Eggs", priority: "high" },
  { id: 4, name: "Cheese", priority: "high" },
  { id: 5, name: "Ground Beef", priority: "high" },
  { id: 6, name: "Tomatoes", priority: "medium" },
  { id: 7, name: "Chicken Breast", priority: "medium" },
  { id: 8, name: "Greek Yogurt", priority: "medium" },
  { id: 9, name: "Olive Oil", priority: "low" },
  { id: 10, name: "Bananas", priority: "low" }
]

export const expiringItems: ExpiringItem[] = [
  { id: 1, name: "Greek Yogurt", daysLeft: 1, category: "Dairy" },
  { id: 2, name: "Spinach", daysLeft: 2, category: "Vegetables" },
  { id: 3, name: "Chicken Breast", daysLeft: 3, category: "Meat" },
  { id: 4, name: "Strawberries", daysLeft: 3, category: "Fruits" },
  { id: 5, name: "Mozzarella", daysLeft: 4, category: "Dairy" },
  { id: 6, name: "Avocados", daysLeft: 5, category: "Fruits" },
  { id: 7, name: "Limes", daysLeft: 7, category: "Fruits" },
  { id: 8, name: "Coconut Water", daysLeft: 7, category: "Beverages" },
  { id: 9, name: "Orange Juice", daysLeft: 6, category: "Beverages" },
  { id: 10, name: "Garlic", daysLeft: 14, category: "Vegetables" }
]
