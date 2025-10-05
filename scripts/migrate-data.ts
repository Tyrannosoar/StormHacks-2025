// Script to migrate all hardcoded data to Supabase
import { 
  supabaseShoppingApi, 
  supabaseStorageApi, 
  supabaseMealsApi, 
  supabaseCalendarApi 
} from '../lib/supabase-api'

// Import the hardcoded data
import { 
  storageItems, 
  shoppingItems, 
  meals, 
  calendarEvents 
} from '../backend/src/data/hardcodedData'

async function migrateShoppingItems() {
  console.log('🛒 Migrating shopping items...')
  
  for (const item of shoppingItems) {
    try {
      const response = await supabaseShoppingApi.create({
        name: item.name,
        amount: item.amount,
        plannedAmount: item.plannedAmount,
        category: item.category,
        priority: item.priority
      })
      
      if (response.success) {
        console.log(`✅ Migrated shopping item: ${item.name}`)
      } else {
        console.error(`❌ Failed to migrate shopping item: ${item.name}`, response.error)
      }
    } catch (error) {
      console.error(`❌ Error migrating shopping item: ${item.name}`, error)
    }
  }
  
  console.log('🛒 Shopping items migration completed')
}

async function migrateStorageItems() {
  console.log('📦 Migrating storage items...')
  
  for (const item of storageItems) {
    try {
      const response = await supabaseStorageApi.create({
        name: item.name,
        amount: item.amount,
        expiryDays: item.expiryDays,
        plannedAmount: item.plannedAmount,
        category: item.category
      })
      
      if (response.success) {
        console.log(`✅ Migrated storage item: ${item.name}`)
      } else {
        console.error(`❌ Failed to migrate storage item: ${item.name}`, response.error)
      }
    } catch (error) {
      console.error(`❌ Error migrating storage item: ${item.name}`, error)
    }
  }
  
  console.log('📦 Storage items migration completed')
}

async function migrateMeals() {
  console.log('🍽️ Migrating meals...')
  
  for (const meal of meals) {
    try {
      const response = await supabaseMealsApi.create({
        title: meal.title,
        image: meal.image,
        cookTime: meal.cookTime,
        servings: meal.servings,
        hasAllIngredients: meal.hasAllIngredients,
        ingredients: meal.ingredients,
        instructions: meal.instructions,
        plannedDate: meal.plannedDate,
        mealType: meal.mealType,
        isArchived: meal.isArchived || false
      })
      
      if (response.success) {
        console.log(`✅ Migrated meal: ${meal.title}`)
      } else {
        console.error(`❌ Failed to migrate meal: ${meal.title}`, response.error)
      }
    } catch (error) {
      console.error(`❌ Error migrating meal: ${meal.title}`, error)
    }
  }
  
  console.log('🍽️ Meals migration completed')
}

async function migrateCalendarEvents() {
  console.log('📅 Migrating calendar events...')
  
  for (const event of calendarEvents) {
    try {
      const response = await supabaseCalendarApi.create({
        title: event.title,
        type: event.type,
        time: event.time,
        date: event.date
      })
      
      if (response.success) {
        console.log(`✅ Migrated calendar event: ${event.title}`)
      } else {
        console.error(`❌ Failed to migrate calendar event: ${event.title}`, response.error)
      }
    } catch (error) {
      console.error(`❌ Error migrating calendar event: ${event.title}`, error)
    }
  }
  
  console.log('📅 Calendar events migration completed')
}

async function migrateAllData() {
  console.log('🚀 Starting data migration to Supabase...')
  console.log('=====================================')
  
  try {
    // Migrate all data types
    await migrateShoppingItems()
    await migrateStorageItems()
    await migrateMeals()
    await migrateCalendarEvents()
    
    console.log('=====================================')
    console.log('🎉 All data migration completed successfully!')
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
if (require.main === module) {
  migrateAllData()
}

export { migrateAllData }
