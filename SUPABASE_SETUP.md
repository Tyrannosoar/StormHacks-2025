# Supabase Setup Guide for MagnaCart

This guide will help you set up Supabase for your MagnaCart grocery management app.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `MagnaCart`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
6. Click "Create new project"
7. Wait for the project to be set up (this takes a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)
   - **service_role** key (starts with `eyJ`)

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Existing API Configuration
NODE_ENV=development
```

Replace the placeholder values with your actual Supabase credentials.

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from your project
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema

This will create:
- `shopping_items` table
- `storage_items` table  
- `meals` table
- `calendar_events` table
- Sample data for testing
- Proper indexes for performance
- Row Level Security policies

## Step 5: Update Your API Calls

The project now includes a new Supabase API layer in `lib/supabase-api.ts`. To use it:

1. **For Shopping Items**: Replace `shoppingApi` imports with `supabaseShoppingApi`
2. **For Storage Items**: Replace `storageApi` imports with `supabaseStorageApi`
3. **For Meals**: Replace `mealsApi` imports with `supabaseMealsApi`
4. **For Calendar Events**: Replace `calendarApi` imports with `supabaseCalendarApi`
5. **For Dashboard**: Replace `dashboardApi` imports with `supabaseDashboardApi`

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to your app and test the following:
   - View shopping list
   - Add/remove shopping items
   - Toggle item completion
   - View storage items
   - Add/remove storage items
   - View meals
   - Add/remove meals
   - View calendar events

## Step 7: Optional - Set Up Authentication

If you want to add user authentication later:

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure your authentication providers
3. Update the Row Level Security policies to be user-specific
4. Add user context to your API calls

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**: Check that your environment variables are correct
2. **"Table doesn't exist" error**: Make sure you ran the SQL schema
3. **CORS errors**: Supabase handles CORS automatically, but check your domain settings
4. **Connection issues**: Verify your project URL is correct

### Getting Help:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Join the [Supabase Discord](https://discord.supabase.com)
- Check the [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## Next Steps

Once Supabase is set up, you can:

1. **Add Real-time Features**: Use Supabase's real-time subscriptions for live updates
2. **Add File Storage**: Store meal images and other files in Supabase Storage
3. **Add Authentication**: Implement user accounts and data isolation
4. **Add Advanced Queries**: Use Supabase's powerful query capabilities
5. **Add Database Functions**: Create custom database functions for complex operations

Your app is now ready to use a real database instead of hardcoded data!
