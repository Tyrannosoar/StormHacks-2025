// Simple migration script to populate Supabase with all hardcoded data
// Run this with: node scripts/run-migration.js

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Shopping items data
const shoppingItems = [
  // High Priority
  { name: "Milk", amount: "1L", planned_amount: "1L", category: "Dairy", priority: "high", is_completed: false },
  { name: "Bread", amount: "1 loaf", planned_amount: "1 loaf", category: "Grains", priority: "high", is_completed: false },
  { name: "Eggs", amount: "12 pcs", planned_amount: "12 pcs", category: "Dairy", priority: "high", is_completed: false },
  { name: "Butter", amount: "250g", planned_amount: "250g", category: "Dairy", priority: "high", is_completed: false },
  { name: "Cheese", amount: "200g", planned_amount: "200g", category: "Dairy", priority: "high", is_completed: false },
  { name: "Ground Beef", amount: "500g", planned_amount: "500g", category: "Meat", priority: "high", is_completed: false },

  // Medium Priority
  { name: "Tomatoes", amount: "6 pcs", planned_amount: "4 pcs", category: "Vegetables", priority: "medium", is_completed: false },
  { name: "Chicken Breast", amount: "800g", planned_amount: "600g", category: "Meat", priority: "medium", is_completed: false },
  { name: "Greek Yogurt", amount: "500g", planned_amount: "300g", category: "Dairy", priority: "medium", is_completed: false },
  { name: "Onions", amount: "1kg", planned_amount: "500g", category: "Vegetables", priority: "medium", is_completed: false },
  { name: "Bell Peppers", amount: "3 pcs", planned_amount: "2 pcs", category: "Vegetables", priority: "medium", is_completed: false },
  { name: "Salmon", amount: "600g", planned_amount: "400g", category: "Meat", priority: "medium", is_completed: false },
  { name: "Apples", amount: "6 pcs", planned_amount: "4 pcs", category: "Fruits", priority: "medium", is_completed: false },
  { name: "Orange Juice", amount: "1L", planned_amount: "750ml", category: "Beverages", priority: "medium", is_completed: false },

  // Low Priority
  { name: "Olive Oil", amount: "500ml", planned_amount: "250ml", category: "Pantry", priority: "low", is_completed: false },
  { name: "Bananas", amount: "6 pcs", planned_amount: "4 pcs", category: "Fruits", priority: "low", is_completed: false },
  { name: "Rice", amount: "1kg", planned_amount: "500g", category: "Grains", priority: "low", is_completed: false },
  { name: "Spices", amount: "Assorted", planned_amount: "As needed", category: "Pantry", priority: "low", is_completed: false },
  { name: "Pasta", amount: "500g", planned_amount: "300g", category: "Grains", priority: "low", is_completed: false },
  { name: "Coffee Beans", amount: "250g", planned_amount: "200g", category: "Beverages", priority: "low", is_completed: false },
  { name: "Frozen Vegetables", amount: "1kg", planned_amount: "500g", category: "Vegetables", priority: "low", is_completed: false },
  { name: "Cereal", amount: "500g", planned_amount: "300g", category: "Grains", priority: "low", is_completed: false }
]

// Storage items data
const storageItems = [
  // Dairy
  { name: "Whole Milk", amount: "1L", expiry_days: 3, planned_amount: "500ml", category: "Dairy" },
  { name: "Greek Yogurt", amount: "500g", expiry_days: 1, planned_amount: "200g", category: "Dairy" },
  { name: "Cheddar Cheese", amount: "200g", expiry_days: 7, planned_amount: "100g", category: "Dairy" },
  { name: "Mozzarella", amount: "250g", expiry_days: 4, planned_amount: "150g", category: "Dairy" },

  // Vegetables
  { name: "Spinach", amount: "150g", expiry_days: 2, planned_amount: "100g", category: "Vegetables" },
  { name: "Tomatoes", amount: "6 pcs", expiry_days: 5, planned_amount: "3 pcs", category: "Vegetables" },
  { name: "Bell Peppers", amount: "3 pcs", expiry_days: 8, planned_amount: "1 pc", category: "Vegetables" },
  { name: "Carrots", amount: "500g", expiry_days: 10, planned_amount: "200g", category: "Vegetables" },

  // Meat
  { name: "Chicken Breast", amount: "800g", expiry_days: 3, planned_amount: "400g", category: "Meat" },
  { name: "Ground Beef", amount: "500g", expiry_days: 2, planned_amount: "300g", category: "Meat" },
  { name: "Salmon Fillet", amount: "600g", expiry_days: 4, planned_amount: "300g", category: "Meat" },

  // Fruits
  { name: "Bananas", amount: "6 pcs", expiry_days: 4, planned_amount: "2 pcs", category: "Fruits" },
  { name: "Strawberries", amount: "250g", expiry_days: 3, planned_amount: "150g", category: "Fruits" },
  { name: "Apples", amount: "8 pcs", expiry_days: 7, planned_amount: "3 pcs", category: "Fruits" },

  // Pantry
  { name: "Pasta", amount: "500g", expiry_days: 365, planned_amount: "200g", category: "Pantry" },
  { name: "Rice", amount: "1kg", expiry_days: 180, planned_amount: "300g", category: "Pantry" },
  { name: "Olive Oil", amount: "500ml", expiry_days: 730, planned_amount: "50ml", category: "Pantry" },

  // Beverages
  { name: "Orange Juice", amount: "1L", expiry_days: 6, planned_amount: "250ml", category: "Beverages" },
  { name: "Coffee Beans", amount: "250g", expiry_days: 90, planned_amount: "50g", category: "Beverages" },
  { name: "Green Tea", amount: "100 bags", expiry_days: 365, planned_amount: "5 bags", category: "Beverages" },
  { name: "Coconut Water", amount: "1L", expiry_days: 7, planned_amount: "250ml", category: "Beverages" }
]

// Meals data
const meals = [
  {
    title: "Spaghetti Carbonara",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center",
    cook_time: 25,
    servings: 4,
    has_all_ingredients: true,
    ingredients: ["400g Spaghetti", "4 Eggs", "200g Bacon", "100g Parmesan", "1 tsp Black Pepper"],
    instructions: [
      "Boil pasta according to package instructions",
      "Cook bacon until crispy",
      "Mix eggs and grated parmesan in a bowl",
      "Drain pasta and immediately mix with bacon",
      "Remove from heat and quickly stir in egg mixture",
      "Season with black pepper and serve"
    ],
    planned_date: "2025-01-25",
    meal_type: "dinner",
    is_archived: false
  },
  {
    title: "Chicken Stir Fry",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center",
    cook_time: 20,
    servings: 3,
    has_all_ingredients: true,
    ingredients: ["500g Chicken Breast", "2 Bell Peppers", "200g Broccoli", "3 tbsp Soy Sauce", "3 cloves Garlic", "1 tbsp Ginger"],
    instructions: [
      "Cut chicken into strips",
      "Heat oil in a wok or large pan",
      "Cook chicken until golden brown",
      "Add vegetables and stir-fry for 3-4 minutes",
      "Add soy sauce, garlic, and ginger",
      "Cook for another 2 minutes and serve"
    ],
    planned_date: "2025-01-26",
    meal_type: "dinner",
    is_archived: false
  },
  {
    title: "Greek Salad",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center",
    cook_time: 15,
    servings: 2,
    has_all_ingredients: true,
    ingredients: ["3 Tomatoes", "1 Cucumber", "1 Red Onion", "200g Feta Cheese", "10 Kalamata Olives", "3 tbsp Olive Oil", "1 tbsp Oregano"],
    instructions: [
      "Chop tomatoes and cucumber",
      "Slice red onion thinly",
      "Combine vegetables in a bowl",
      "Add feta cheese and olives",
      "Drizzle with olive oil and season"
    ],
    planned_date: "2025-01-27",
    meal_type: "lunch",
    is_archived: false
  }
]

// Calendar events data
const calendarEvents = [
  { title: "Breakfast: Oatmeal", type: "meal", time: "08:00", date: "2025-01-20" },
  { title: "Grocery Shopping", type: "shopping", time: "10:00", date: "2025-01-21" },
  { title: "Lunch: Pasta", type: "meal", time: "12:30", date: "2025-01-21" },
  { title: "Dinner: Salmon", type: "meal", time: "19:00", date: "2025-01-22" },
  { title: "Weekly Shop", type: "shopping", time: "09:00", date: "2025-01-25" },
  { title: "Meal Prep", type: "custom", time: "15:00", date: "2025-01-19" },
  { title: "Dinner Party", type: "custom", time: "18:00", date: "2025-01-30" },
  { title: "Breakfast: Pancakes", type: "meal", time: "09:00", date: "2025-01-23" },
  { title: "Lunch: Caesar Salad", type: "meal", time: "13:00", date: "2025-01-24" },
  { title: "Farmers Market", type: "shopping", time: "08:00", date: "2025-01-26" }
]

async function migrateData() {
  console.log('🚀 Starting data migration to Supabase...')
  console.log('=====================================')

  try {
    // Migrate shopping items
    console.log('🛒 Migrating shopping items...')
    const { data: shoppingData, error: shoppingError } = await supabase
      .from('shopping_items')
      .insert(shoppingItems)
    
    if (shoppingError) {
      console.error('❌ Error migrating shopping items:', shoppingError)
    } else {
      console.log(`✅ Migrated ${shoppingItems.length} shopping items`)
    }

    // Migrate storage items
    console.log('📦 Migrating storage items...')
    const { data: storageData, error: storageError } = await supabase
      .from('storage_items')
      .insert(storageItems)
    
    if (storageError) {
      console.error('❌ Error migrating storage items:', storageError)
    } else {
      console.log(`✅ Migrated ${storageItems.length} storage items`)
    }

    // Migrate meals
    console.log('🍽️ Migrating meals...')
    const { data: mealsData, error: mealsError } = await supabase
      .from('meals')
      .insert(meals)
    
    if (mealsError) {
      console.error('❌ Error migrating meals:', mealsError)
    } else {
      console.log(`✅ Migrated ${meals.length} meals`)
    }

    // Migrate calendar events
    console.log('📅 Migrating calendar events...')
    const { data: eventsData, error: eventsError } = await supabase
      .from('calendar_events')
      .insert(calendarEvents)
    
    if (eventsError) {
      console.error('❌ Error migrating calendar events:', eventsError)
    } else {
      console.log(`✅ Migrated ${calendarEvents.length} calendar events`)
    }

    console.log('=====================================')
    console.log('🎉 Data migration completed!')
    console.log('')
    console.log('Summary:')
    console.log(`- Shopping items: ${shoppingItems.length} items`)
    console.log(`- Storage items: ${storageItems.length} items`)
    console.log(`- Meals: ${meals.length} items`)
    console.log(`- Calendar events: ${calendarEvents.length} items`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

// Run the migration
migrateData()
