# 🚀 Complete Supabase Setup Guide

Your app is now **ready to use Supabase**, but you need to complete the database setup first!

## ✅ What's Already Done

- ✅ Supabase client installed
- ✅ Environment variables configured
- ✅ Database schema created (`supabase-schema.sql`)
- ✅ API layer created (`lib/supabase-api.ts`)
- ✅ Components updated to use Supabase
- ✅ Migration scripts ready

## 🚨 **CRITICAL: You Must Run the SQL Schema First!**

The app is configured to use Supabase, but the database tables don't exist yet. You need to run the SQL schema in your Supabase dashboard.

### **Step 1: Run the Database Schema**

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Click "SQL Editor"** in the left sidebar
4. **Copy the entire SQL schema** from `supabase-schema.sql`
5. **Paste it into the SQL Editor**
6. **Click "Run"** to execute the schema

### **Step 2: Verify the Setup**

After running the SQL schema, test it:

```bash
node scripts/test-supabase-integration.js
```

### **Step 3: Start Your App**

```bash
npm run dev
```

## 📊 What the SQL Schema Creates

- **4 Database Tables**: `shopping_items`, `storage_items`, `meals`, `calendar_events`
- **Sample Data**: 10 shopping items, 10 storage items, 3 meals, 10 calendar events
- **Indexes**: For better performance
- **Row Level Security**: For data protection
- **Triggers**: For automatic timestamp updates

## 🔄 How the App Now Works

### **Before (Hardcoded Data)**
- Data stored in `backend/src/data/hardcodedData.ts`
- API calls to `http://localhost:3001/api/`
- No real database

### **After (Supabase Database)**
- Data stored in Supabase PostgreSQL database
- API calls to Supabase
- Real-time updates
- Scalable and production-ready

## 🧪 Testing the Complete Setup

After running the SQL schema, you can test everything:

```bash
# Test Supabase connection and tables
node scripts/test-supabase-integration.js

# Test data migration (if needed)
node scripts/run-migration.js
```

## 📱 App Features Now Using Supabase

- **Shopping List**: Add, edit, delete, toggle items
- **Storage Management**: Track pantry items and expiry dates
- **Meal Planning**: Save and manage recipes
- **Calendar Events**: Schedule meals and shopping
- **Dashboard**: Real-time overview of all data

## 🚀 Next Steps After Setup

1. **Run the SQL schema** in Supabase dashboard
2. **Test the integration** with the test script
3. **Start your app** with `npm run dev`
4. **Enjoy your real database!** 🎉

## 🔧 Troubleshooting

### **"Tables not found" error**
- You haven't run the SQL schema yet
- Go to Supabase dashboard → SQL Editor → Run the schema

### **"Connection failed" error**
- Check your environment variables in `.env.local`
- Verify your Supabase project URL and API keys

### **"No data showing" error**
- Run the SQL schema first
- The schema includes sample data
- You can also run the migration script for more data

## 📁 Files Updated for Supabase

- `components/shopping-list-page.tsx` - Now uses `supabaseShoppingApi`
- `components/edit-shopping-item-modal.tsx` - Now uses `supabaseShoppingApi`
- `components/main-dashboard.tsx` - Now uses `supabaseDashboardApi`
- `lib/supabase-api.ts` - Complete Supabase API layer
- `lib/supabase.ts` - Supabase client configuration

## 🎯 **Your app is ready! Just run the SQL schema and you're good to go!**
