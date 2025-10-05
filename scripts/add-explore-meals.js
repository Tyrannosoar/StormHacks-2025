const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client - using placeholder values for now
// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

if (!supabaseUrl || !supabaseKey || supabaseUrl === 'https://your-project.supabase.co') {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please create a .env.local file with your Supabase credentials:')
  console.error('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key')
  console.error('')
  console.error('You can find these values in your Supabase dashboard:')
  console.error('1. Go to https://supabase.com/dashboard')
  console.error('2. Select your project')
  console.error('3. Go to Settings > API')
  console.error('4. Copy the URL and anon key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Explore meals data - meals without planned_date (null) so they appear in explore section
const exploreMeals = [
  // Breakfast meals
  {
    title: 'Avocado Toast with Poached Egg',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop&crop=center',
    cook_time: 15,
    servings: 2,
    has_all_ingredients: false,
    ingredients: [
      '2 slices Sourdough Bread',
      '1 Avocado',
      '2 Eggs',
      '1 tbsp Lemon Juice',
      'Salt and Pepper',
      'Red Pepper Flakes'
    ],
    instructions: [
      'Toast the bread slices until golden',
      'Mash avocado with lemon juice, salt, and pepper',
      'Poach eggs in simmering water for 3-4 minutes',
      'Spread avocado mixture on toast',
      'Top with poached eggs and red pepper flakes'
    ],
    planned_date: null,
    meal_type: 'breakfast',
    is_archived: false
  },
  {
    title: 'Pancakes with Berries',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
    cook_time: 20,
    servings: 4,
    has_all_ingredients: false,
    ingredients: [
      '1 cup All-Purpose Flour',
      '2 tbsp Sugar',
      '1 tsp Baking Powder',
      '1/2 tsp Salt',
      '1 cup Milk',
      '1 Egg',
      '2 tbsp Butter',
      '1 cup Mixed Berries',
      'Maple Syrup'
    ],
    instructions: [
      'Mix dry ingredients in a bowl',
      'Whisk wet ingredients in another bowl',
      'Combine wet and dry ingredients until just mixed',
      'Heat griddle and cook pancakes until bubbles form',
      'Flip and cook until golden brown',
      'Serve with berries and maple syrup'
    ],
    planned_date: null,
    meal_type: 'breakfast',
    is_archived: false
  },
  {
    title: 'Greek Yogurt Parfait',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&crop=center',
    cook_time: 5,
    servings: 1,
    has_all_ingredients: true,
    ingredients: [
      '1 cup Greek Yogurt',
      '1/2 cup Granola',
      '1/4 cup Mixed Berries',
      '1 tbsp Honey',
      '1 tbsp Chia Seeds'
    ],
    instructions: [
      'Layer half the yogurt in a glass',
      'Add half the granola and berries',
      'Repeat layers',
      'Drizzle with honey and sprinkle chia seeds',
      'Serve immediately'
    ],
    planned_date: null,
    meal_type: 'breakfast',
    is_archived: false
  },

  // Lunch meals
  {
    title: 'Mediterranean Quinoa Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center',
    cook_time: 25,
    servings: 2,
    has_all_ingredients: false,
    ingredients: [
      '1 cup Quinoa',
      '1 Cucumber',
      '2 Tomatoes',
      '1/2 Red Onion',
      '1/2 cup Kalamata Olives',
      '200g Feta Cheese',
      '3 tbsp Olive Oil',
      '2 tbsp Lemon Juice',
      'Fresh Herbs'
    ],
    instructions: [
      'Cook quinoa according to package instructions',
      'Dice cucumber and tomatoes',
      'Thinly slice red onion',
      'Combine all ingredients in a bowl',
      'Dress with olive oil and lemon juice',
      'Garnish with fresh herbs'
    ],
    planned_date: null,
    meal_type: 'lunch',
    is_archived: false
  },
  {
    title: 'Chicken Caesar Wrap',
    image: 'https://images.unsplash.com/photo-1565299585323-38174c4c4539?w=400&h=300&fit=crop&crop=center',
    cook_time: 15,
    servings: 2,
    has_all_ingredients: false,
    ingredients: [
      '2 Large Tortillas',
      '300g Grilled Chicken',
      '2 cups Romaine Lettuce',
      '1/2 cup Caesar Dressing',
      '1/4 cup Parmesan Cheese',
      '1/2 cup Croutons',
      'Salt and Pepper'
    ],
    instructions: [
      'Warm tortillas in a dry pan',
      'Slice grilled chicken into strips',
      'Shred lettuce and mix with dressing',
      'Layer chicken, lettuce, and cheese on tortilla',
      'Add croutons and season',
      'Roll tightly and slice in half'
    ],
    planned_date: null,
    meal_type: 'lunch',
    is_archived: false
  },
  {
    title: 'Vegetarian Buddha Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center',
    cook_time: 30,
    servings: 2,
    has_all_ingredients: true,
    ingredients: [
      '1 cup Brown Rice',
      '1 Sweet Potato',
      '1 cup Chickpeas',
      '2 cups Kale',
      '1 Avocado',
      '2 tbsp Tahini',
      '1 tbsp Lemon Juice',
      'Sesame Seeds'
    ],
    instructions: [
      'Cook brown rice according to package',
      'Roast sweet potato cubes at 400°F for 20 minutes',
      'Season and roast chickpeas for 15 minutes',
      'Massage kale with lemon juice',
      'Arrange all ingredients in bowls',
      'Drizzle with tahini and sprinkle sesame seeds'
    ],
    planned_date: null,
    meal_type: 'lunch',
    is_archived: false
  },

  // Dinner meals
  {
    title: 'Beef Stir Fry',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center',
    cook_time: 20,
    servings: 3,
    has_all_ingredients: false,
    ingredients: [
      '500g Beef Strips',
      '2 Bell Peppers',
      '1 Broccoli Head',
      '3 cloves Garlic',
      '2 tbsp Soy Sauce',
      '1 tbsp Oyster Sauce',
      '1 tbsp Cornstarch',
      '2 tbsp Vegetable Oil',
      'Ginger'
    ],
    instructions: [
      'Slice beef into thin strips',
      'Cut vegetables into bite-sized pieces',
      'Heat oil in a wok or large pan',
      'Cook beef until browned, then remove',
      'Stir-fry vegetables for 3-4 minutes',
      'Add beef back with sauce mixture',
      'Cook until sauce thickens'
    ],
    planned_date: null,
    meal_type: 'dinner',
    is_archived: false
  },
  {
    title: 'Salmon with Roasted Vegetables',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&crop=center',
    cook_time: 35,
    servings: 2,
    has_all_ingredients: false,
    ingredients: [
      '2 Salmon Fillets',
      '2 Sweet Potatoes',
      '1 Broccoli Head',
      '1 Zucchini',
      '3 tbsp Olive Oil',
      '2 cloves Garlic',
      'Lemon',
      'Fresh Dill',
      'Salt and Pepper'
    ],
    instructions: [
      'Preheat oven to 425°F',
      'Cut vegetables into chunks',
      'Toss vegetables with oil, garlic, salt, and pepper',
      'Roast vegetables for 20 minutes',
      'Season salmon and add to pan',
      'Roast for 12-15 minutes until fish flakes',
      'Garnish with lemon and dill'
    ],
    planned_date: null,
    meal_type: 'dinner',
    is_archived: false
  },
  {
    title: 'Vegetarian Pasta Primavera',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center',
    cook_time: 25,
    servings: 4,
    has_all_ingredients: true,
    ingredients: [
      '400g Pasta',
      '2 Zucchini',
      '1 Bell Pepper',
      '1 cup Cherry Tomatoes',
      '3 cloves Garlic',
      '1/4 cup Olive Oil',
      '1/2 cup Parmesan Cheese',
      'Fresh Basil',
      'Red Pepper Flakes'
    ],
    instructions: [
      'Cook pasta according to package instructions',
      'Slice vegetables into thin strips',
      'Heat oil in a large pan',
      'Sauté garlic until fragrant',
      'Add vegetables and cook until tender',
      'Toss with pasta and cheese',
      'Garnish with basil and red pepper flakes'
    ],
    planned_date: null,
    meal_type: 'dinner',
    is_archived: false
  },
  {
    title: 'Chicken Tikka Masala',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d4b8?w=400&h=300&fit=crop&crop=center',
    cook_time: 45,
    servings: 4,
    has_all_ingredients: false,
    ingredients: [
      '600g Chicken Thighs',
      '1 Onion',
      '3 cloves Garlic',
      '1 inch Ginger',
      '1 can Coconut Milk',
      '2 tbsp Tomato Paste',
      '2 tbsp Garam Masala',
      '1 tsp Turmeric',
      'Basmati Rice',
      'Fresh Cilantro'
    ],
    instructions: [
      'Cut chicken into bite-sized pieces',
      'Sauté onions until golden',
      'Add garlic, ginger, and spices',
      'Add chicken and cook until browned',
      'Stir in coconut milk and tomato paste',
      'Simmer for 20-25 minutes',
      'Serve over rice with cilantro'
    ],
    planned_date: null,
    meal_type: 'dinner',
    is_archived: false
  },
  {
    title: 'Quick Veggie Stir Fry',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center',
    cook_time: 15,
    servings: 2,
    has_all_ingredients: true,
    ingredients: [
      '2 cups Mixed Vegetables',
      '2 cloves Garlic',
      '1 tbsp Soy Sauce',
      '1 tbsp Sesame Oil',
      '1 tsp Ginger',
      'Sesame Seeds',
      'Green Onions'
    ],
    instructions: [
      'Heat sesame oil in a large pan',
      'Add minced garlic and ginger',
      'Stir-fry vegetables for 5-7 minutes',
      'Add soy sauce and toss',
      'Garnish with sesame seeds and green onions',
      'Serve immediately'
    ],
    planned_date: null,
    meal_type: 'dinner',
    is_archived: false
  }
]

async function addExploreMeals() {
  try {
    console.log('Adding explore meals to database...')
    
    for (const meal of exploreMeals) {
      const { data, error } = await supabase
        .from('meals')
        .insert(meal)
        .select()

      if (error) {
        console.error(`Error adding meal "${meal.title}":`, error)
      } else {
        console.log(`✅ Added meal: "${meal.title}"`)
      }
    }
    
    console.log('✅ All explore meals added successfully!')
  } catch (error) {
    console.error('Error adding explore meals:', error)
  }
}

addExploreMeals()
