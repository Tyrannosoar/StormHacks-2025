// Script to help you set up the Supabase database schema
require('dotenv').config({ path: '.env.local' })

console.log('📋 Supabase Database Setup Instructions')
console.log('=====================================')
console.log('')
console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard')
console.log('2. Select your project')
console.log('3. Go to "SQL Editor" in the left sidebar')
console.log('4. Copy and paste the following SQL schema:')
console.log('')
console.log('--- COPY THE SQL BELOW ---')
console.log('')

const fs = require('fs')
const path = require('path')

try {
  const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf8')
  console.log(schema)
} catch (error) {
  console.log('❌ Could not read schema file. Please manually copy the contents of supabase-schema.sql')
}

console.log('')
console.log('--- END OF SQL ---')
console.log('')
console.log('5. Click "Run" to execute the schema')
console.log('6. Wait for it to complete')
console.log('7. Then run: node scripts/run-migration.js')
console.log('')
console.log('✅ This will create all the necessary tables and sample data!')
