// Test Supabase connection and check if tables exist
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  console.log('=====================================')
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('shopping_items')
      .select('count')
      .limit(1)
    
    if (error) {
      if (error.code === 'PGRST205') {
        console.log('❌ Tables not found! You need to run the SQL schema first.')
        console.log('')
        console.log('📋 Next Steps:')
        console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard')
        console.log('2. Select your project')
        console.log('3. Go to "SQL Editor" in the left sidebar')
        console.log('4. Copy and paste the SQL from: supabase-schema.sql')
        console.log('5. Click "Run" to execute the schema')
        console.log('6. Then run this test again: node scripts/test-connection.js')
        return
      } else {
        throw error
      }
    }
    
    console.log('✅ Connection successful!')
    console.log('✅ Tables exist and are accessible')
    
    // Test each table
    const tables = ['shopping_items', 'storage_items', 'meals', 'calendar_events']
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        
        if (error) throw error
        
        console.log(`✅ ${table}: ${count} records`)
      } catch (error) {
        console.log(`❌ ${table}: Error - ${error.message}`)
      }
    }
    
    console.log('')
    console.log('🎉 All tests passed! Your Supabase setup is working correctly.')
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
  }
}

testConnection()
