# 🍽️ Add Explore Meals to Your App

## ✅ **Explore Meals Ready to Add!**

I've created a comprehensive collection of diverse meals for your explore section. Here's what's included:

### **📊 Meals Added:**
- **3 Breakfast Meals**: Avocado Toast, Pancakes, Greek Yogurt Parfait
- **3 Lunch Meals**: Mediterranean Quinoa Bowl, Chicken Caesar Wrap, Buddha Bowl
- **5 Dinner Meals**: Beef Stir Fry, Salmon with Vegetables, Pasta Primavera, Chicken Tikka Masala, Quick Veggie Stir Fry
- **3 Additional Options**: Mushroom Risotto, Breakfast Burrito, Caprese Salad

### **🎯 Meal Categories:**
- ✅ **Quick & Easy** (5-15 minutes)
- ✅ **Vegetarian Options** 
- ✅ **Protein-Rich Meals**
- ✅ **Healthy & Fresh**
- ✅ **International Cuisine**

## 🚀 **How to Add These Meals:**

### **Option 1: Using Supabase Dashboard (Recommended)**

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the SQL Script**
   - Copy the entire contents of `scripts/add-explore-meals.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute

4. **Verify the Meals**
   - Go to "Table Editor" → "meals"
   - You should see 14 new meals with `planned_date = NULL`

### **Option 2: Using the Node.js Script**

1. **Set up Environment Variables**
   ```bash
   # Create .env.local file with your Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Run the Script**
   ```bash
   node scripts/add-explore-meals.js
   ```

## 🎉 **What You'll Get:**

### **Explore Section Will Show:**
- **14 Diverse Meals** across all meal types
- **Beautiful Food Images** from Unsplash
- **Detailed Ingredients** and cooking instructions
- **Cooking Times** and serving sizes
- **Ingredient Availability** status

### **Meal Features:**
- ✅ **High-Quality Images** - Professional food photography
- ✅ **Detailed Instructions** - Step-by-step cooking guides
- ✅ **Ingredient Lists** - Complete with measurements
- ✅ **Cooking Times** - Accurate preparation estimates
- ✅ **Serving Sizes** - Perfect for meal planning

## 📱 **How It Works:**

1. **Explore Tab** - Users can browse all available meals
2. **Plan Meals** - Click "Plan As Meal" to schedule cooking
3. **View Details** - Click any meal to see full recipe
4. **Archive Meals** - Save favorites for later

## 🔧 **Technical Details:**

- **Database**: All meals stored in Supabase `meals` table
- **Explore Logic**: Meals with `planned_date = NULL` appear in explore
- **Images**: High-quality Unsplash food photography
- **Responsive**: Works on all device sizes

## 🎯 **Next Steps:**

1. **Add the meals** using one of the methods above
2. **Test the explore section** in your app
3. **Customize meals** as needed for your users
4. **Add more meals** using the same pattern

Your explore section will now be filled with delicious, diverse meal options that users can discover and plan! 🍽️✨
