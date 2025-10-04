// Mock data for Vercel deployment
let shoppingItems = [
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
];

let storageItems = [
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
];

export const meals = [
  {
    id: "saved-1",
    title: "Spaghetti Carbonara",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center",
    cookTime: 25,
    servings: 4,
    hasAllIngredients: true,
    ingredients: ["400g Spaghetti", "4 Eggs", "200g Bacon", "100g Parmesan", "1 tsp Black Pepper"],
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
    ingredients: ["500g Chicken Breast", "2 Bell Peppers", "200g Broccoli", "3 tbsp Soy Sauce", "3 cloves Garlic", "1 tbsp Ginger"],
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
  }
];

// Export getter functions to ensure we always get the current state
export const getShoppingItems = () => shoppingItems;
export const getStorageItems = () => storageItems;
export const getMeals = () => meals;

// Export setters for API routes
export const updateShoppingItems = (items: typeof shoppingItems) => {
  shoppingItems = items;
};

export const updateStorageItems = (items: typeof storageItems) => {
  storageItems = items;
};
