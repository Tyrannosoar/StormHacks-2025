// Test script to check Supabase connection
require('dotenv').config({ path: '.env.local' })

console.log('🔍 Checking Supabase environment variables...')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('')
  console.log('❌ Please set up your Supabase environment variables in .env.local:')
  console.log('')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
  console.log('')
  console.log('Get these values from your Supabase dashboard: Settings → API')
  process.exit(1)
}

console.log('')
console.log('✅ Environment variables are set!')
console.log('🚀 Ready to run migration...')
