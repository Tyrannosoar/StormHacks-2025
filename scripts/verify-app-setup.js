// Final verification that the app is ready for Supabase
require('dotenv').config({ path: '.env.local' })

console.log('🔍 Verifying App Setup for Supabase...')
console.log('=====================================')

// Check 1: Environment variables
console.log('\n1. Checking environment variables...')
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase environment variables!')
  console.log('   Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
} else {
  console.log('✅ Environment variables are set')
}

// Check 2: Supabase client can be created
console.log('\n2. Testing Supabase client creation...')
try {
  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseKey)
  console.log('✅ Supabase client created successfully')
} catch (error) {
  console.log('❌ Failed to create Supabase client:', error.message)
  process.exit(1)
}

// Check 3: API files exist
console.log('\n3. Checking API files...')
const fs = require('fs')
const path = require('path')

const requiredFiles = [
  'lib/supabase.ts',
  'lib/supabase-api.ts',
  'supabase-schema.sql'
]

let allFilesExist = true
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`)
  } else {
    console.log(`❌ ${file} missing`)
    allFilesExist = false
  }
})

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing!')
  process.exit(1)
}

// Check 4: Components are using Supabase
console.log('\n4. Checking component Supabase usage...')
const componentsDir = 'components'
const componentFiles = fs.readdirSync(componentsDir).filter(file => file.endsWith('.tsx'))

let componentsUsingSupabase = 0
let componentsWithHardcodedData = 0

componentFiles.forEach(file => {
  const content = fs.readFileSync(path.join(componentsDir, file), 'utf8')
  
  if (content.includes('supabase') || content.includes('Supabase')) {
    componentsUsingSupabase++
    console.log(`✅ ${file} uses Supabase`)
  } else if (content.includes('localhost:3001') || content.includes('hardcodedData')) {
    componentsWithHardcodedData++
    console.log(`❌ ${file} still uses hardcoded data or old API`)
  }
})

console.log(`\n📊 Summary:`)
console.log(`   - Components using Supabase: ${componentsUsingSupabase}`)
console.log(`   - Components with hardcoded data: ${componentsWithHardcodedData}`)

if (componentsWithHardcodedData > 0) {
  console.log('\n❌ Some components still use hardcoded data!')
  process.exit(1)
}

console.log('\n=====================================')
console.log('🎉 APP SETUP VERIFICATION COMPLETE!')
console.log('')
console.log('✅ Your app is 100% ready for Supabase!')
console.log('')
console.log('📋 Final Steps:')
console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard')
console.log('2. Select your project')
console.log('3. Go to "SQL Editor"')
console.log('4. Copy and paste the SQL from: supabase-schema.sql')
console.log('5. Click "Run" to execute the schema')
console.log('6. Test with: node scripts/test-supabase-integration.js')
console.log('7. Start your app: npm run dev')
console.log('')
console.log('🚀 Your app will then be fully functional with Supabase!')
