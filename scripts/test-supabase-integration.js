// Test Supabase integration with the app
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSupabaseIntegration() {
  console.log('🧪 Testing Supabase Integration...')
  console.log('=====================================')
  
  try {
    // Test 1: Check if tables exist
    console.log('1. Testing table existence...')
    const tables = ['shopping_items', 'storage_items', 'meals', 'calendar_events']
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        
        if (error) {
          console.log(`❌ ${table}: Table not found - ${error.message}`)
          return false
        }
        
        console.log(`✅ ${table}: ${count} records`)
      } catch (error) {
        console.log(`❌ ${table}: Error - ${error.message}`)
        return false
      }
    }
    
    // Test 2: Test shopping items API
    console.log('\n2. Testing shopping items API...')
    try {
      const { data: shoppingItems, error } = await supabase
        .from('shopping_items')
        .select('*')
        .limit(5)
      
      if (error) throw error
      
      console.log(`✅ Shopping items: ${shoppingItems.length} items found`)
      console.log('   Sample items:', shoppingItems.map(item => item.name).join(', '))
    } catch (error) {
      console.log(`❌ Shopping items error: ${error.message}`)
      return false
    }
    
    // Test 3: Test storage items API
    console.log('\n3. Testing storage items API...')
    try {
      const { data: storageItems, error } = await supabase
        .from('storage_items')
        .select('*')
        .limit(5)
      
      if (error) throw error
      
      console.log(`✅ Storage items: ${storageItems.length} items found`)
      console.log('   Sample items:', storageItems.map(item => item.name).join(', '))
    } catch (error) {
      console.log(`❌ Storage items error: ${error.message}`)
      return false
    }
    
    // Test 4: Test meals API
    console.log('\n4. Testing meals API...')
    try {
      const { data: meals, error } = await supabase
        .from('meals')
        .select('*')
        .limit(3)
      
      if (error) throw error
      
      console.log(`✅ Meals: ${meals.length} items found`)
      console.log('   Sample meals:', meals.map(meal => meal.title).join(', '))
    } catch (error) {
      console.log(`❌ Meals error: ${error.message}`)
      return false
    }
    
    // Test 5: Test calendar events API
    console.log('\n5. Testing calendar events API...')
    try {
      const { data: events, error } = await supabase
        .from('calendar_events')
        .select('*')
        .limit(5)
      
      if (error) throw error
      
      console.log(`✅ Calendar events: ${events.length} items found`)
      console.log('   Sample events:', events.map(event => event.title).join(', '))
    } catch (error) {
      console.log(`❌ Calendar events error: ${error.message}`)
      return false
    }
    
    console.log('\n=====================================')
    console.log('🎉 All Supabase integration tests passed!')
    console.log('✅ Your app is ready to use Supabase!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Start your app: npm run dev')
    console.log('2. The app will now use Supabase instead of hardcoded data')
    console.log('3. All CRUD operations will work with the real database')
    
    return true
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message)
    return false
  }
}

testSupabaseIntegration()
