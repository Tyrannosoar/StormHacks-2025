import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // Check if there are already explore meals (planned_date IS NULL)
    const { data: existing, error: existingError } = await supabase
      .from('meals')
      .select('id')
      .is('planned_date', null)
      .limit(1)

    if (existingError) throw existingError

    if (existing && existing.length > 0) {
      return NextResponse.json({ success: true, message: 'Explore meals already exist. Skipping seed.' })
    }

    const samples = [
      {
        title: 'Creamy Garlic Chicken Pasta',
        image: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?w=800&auto=format&fit=crop',
        cook_time: 25,
        servings: 4,
        has_all_ingredients: false,
        ingredients: ['200g pasta', '2 chicken breasts', '2 cloves garlic', '200ml cream', 'Parmesan', 'Parsley', 'Olive oil', 'Salt', 'Pepper'],
        instructions: ['Cook pasta until al dente', 'Sear chicken, set aside', 'Sauté garlic', 'Add cream and reduce', 'Combine with pasta and chicken', 'Top with parmesan and parsley'],
        planned_date: null,
        meal_type: null,
        is_archived: false,
      },
      {
        title: 'Sheet-Pan Lemon Herb Salmon',
        image: 'https://images.unsplash.com/photo-1604908554027-18f5c4b2a52b?w=800&auto=format&fit=crop',
        cook_time: 20,
        servings: 2,
        has_all_ingredients: true,
        ingredients: ['2 salmon fillets', '1 lemon', '2 tbsp olive oil', 'Dill', 'Asparagus', 'Salt', 'Pepper'],
        instructions: ['Preheat oven to 425°F (220°C)', 'Toss asparagus with oil, salt, pepper', 'Place salmon on tray', 'Top salmon with lemon and dill', 'Bake 12–15 minutes'],
        planned_date: null,
        meal_type: null,
        is_archived: false,
      },
      {
        title: 'Veggie Stir-Fry with Tofu',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop',
        cook_time: 18,
        servings: 3,
        has_all_ingredients: false,
        ingredients: ['Firm tofu', 'Broccoli', 'Bell pepper', 'Soy sauce', 'Garlic', 'Ginger', 'Sesame oil'],
        instructions: ['Press and cube tofu', 'Sear tofu until golden', 'Stir-fry veggies', 'Add soy-garlic-ginger sauce', 'Toss with tofu and finish with sesame oil'],
        planned_date: null,
        meal_type: null,
        is_archived: false,
      },
      {
        title: 'Beef Tacos with Pico de Gallo',
        image: 'https://images.unsplash.com/photo-1543353071-087092ec393a?w=800&auto=format&fit=crop',
        cook_time: 25,
        servings: 4,
        has_all_ingredients: true,
        ingredients: ['Ground beef', 'Taco seasoning', 'Tortillas', 'Tomato', 'Onion', 'Cilantro', 'Lime', 'Cheddar'],
        instructions: ['Brown beef with seasoning', 'Warm tortillas', 'Make pico de gallo', 'Assemble and serve'],
        planned_date: null,
        meal_type: null,
        is_archived: false,
      },
      {
        title: 'Margherita Flatbread Pizza',
        image: 'https://images.unsplash.com/photo-1541745537413-b804tedb89f1?w=800&auto=format&fit=crop',
        cook_time: 15,
        servings: 2,
        has_all_ingredients: true,
        ingredients: ['Flatbread', 'Tomato sauce', 'Fresh mozzarella', 'Basil', 'Olive oil', 'Salt'],
        instructions: ['Preheat oven to 475°F (245°C)', 'Top flatbread with sauce and cheese', 'Bake 8–10 minutes', 'Finish with basil and oil'],
        planned_date: null,
        meal_type: null,
        is_archived: false,
      },
      {
        title: 'Chickpea Coconut Curry',
        image: 'https://images.unsplash.com/photo-1543770319-4b6c5222e5b3?w=800&auto=format&fit=crop',
        cook_time: 30,
        servings: 4,
        has_all_ingredients: false,
        ingredients: ['Chickpeas', 'Coconut milk', 'Curry paste', 'Onion', 'Garlic', 'Spinach', 'Rice'],
        instructions: ['Sauté aromatics', 'Add curry paste', 'Stir in coconut milk and chickpeas', 'Simmer', 'Wilt spinach', 'Serve over rice'],
        planned_date: null,
        meal_type: null,
        is_archived: false,
      },
      {
        title: 'Greek Chicken Bowls',
        image: 'https://images.unsplash.com/photo-1604908176997-d2d9f04fbfcd?w=800&auto=format&fit=crop',
        cook_time: 28,
        servings: 4,
        has_all_ingredients: false,
        ingredients: ['Chicken thighs', 'Greek seasoning', 'Rice', 'Cucumber', 'Tomato', 'Feta', 'Tzatziki'],
        instructions: ['Marinate and cook chicken', 'Cook rice', 'Assemble bowls with veggies, feta, tzatziki'],
        planned_date: null,
        meal_type: null,
        is_archived: false,
      },
      {
        title: 'Shrimp Scampi',
        image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&auto=format&fit=crop',
        cook_time: 20,
        servings: 2,
        has_all_ingredients: true,
        ingredients: ['Shrimp', 'Butter', 'Garlic', 'White wine', 'Lemon', 'Parsley', 'Pasta'],
        instructions: ['Cook pasta', 'Sauté garlic in butter', 'Add shrimp and wine', 'Finish with lemon and parsley', 'Toss with pasta'],
        planned_date: null,
        meal_type: null,
        is_archived: false,
      },
      {
        title: 'Roasted Veggie Buddha Bowls',
        image: 'https://images.unsplash.com/photo-1525054098605-8e762c017741?w=800&auto=format&fit=crop',
        cook_time: 35,
        servings: 3,
        has_all_ingredients: false,
        ingredients: ['Sweet potato', 'Cauliflower', 'Chickpeas', 'Quinoa', 'Tahini sauce'],
        instructions: ['Roast veggies and chickpeas', 'Cook quinoa', 'Drizzle with tahini sauce'],
        planned_date: null,
        meal_type: null,
        is_archived: false,
      },
      {
        title: 'Turkey Chili',
        image: 'https://images.unsplash.com/photo-1512058454905-61f8f02f6c37?w=800&auto=format&fit=crop',
        cook_time: 40,
        servings: 6,
        has_all_ingredients: false,
        ingredients: ['Ground turkey', 'Beans', 'Tomatoes', 'Onion', 'Chili powder', 'Cumin'],
        instructions: ['Brown turkey', 'Add aromatics and spices', 'Simmer with beans and tomatoes'],
        planned_date: null,
        meal_type: null,
        is_archived: false,
      },
    ]

    const { error: insertError } = await supabase
      .from('meals')
      .insert(samples as any)

    if (insertError) throw insertError

    return NextResponse.json({ success: true, message: 'Seeded explore meals.' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to seed meals' }, { status: 500 })
  }
}


