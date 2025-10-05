-- Add explore meals to the database
-- These meals have planned_date = NULL so they appear in the explore section

INSERT INTO meals (title, image, cook_time, servings, has_all_ingredients, ingredients, instructions, planned_date, meal_type, is_archived) VALUES

-- Breakfast meals
('Avocado Toast with Poached Egg', 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop&crop=center', 15, 2, false, 
 ARRAY['2 slices Sourdough Bread', '1 Avocado', '2 Eggs', '1 tbsp Lemon Juice', 'Salt and Pepper', 'Red Pepper Flakes'],
 ARRAY['Toast the bread slices until golden', 'Mash avocado with lemon juice, salt, and pepper', 'Poach eggs in simmering water for 3-4 minutes', 'Spread avocado mixture on toast', 'Top with poached eggs and red pepper flakes'],
 NULL, 'breakfast', false),

('Pancakes with Berries', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center', 20, 4, false,
 ARRAY['1 cup All-Purpose Flour', '2 tbsp Sugar', '1 tsp Baking Powder', '1/2 tsp Salt', '1 cup Milk', '1 Egg', '2 tbsp Butter', '1 cup Mixed Berries', 'Maple Syrup'],
 ARRAY['Mix dry ingredients in a bowl', 'Whisk wet ingredients in another bowl', 'Combine wet and dry ingredients until just mixed', 'Heat griddle and cook pancakes until bubbles form', 'Flip and cook until golden brown', 'Serve with berries and maple syrup'],
 NULL, 'breakfast', false),

('Greek Yogurt Parfait', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&crop=center', 5, 1, true,
 ARRAY['1 cup Greek Yogurt', '1/2 cup Granola', '1/4 cup Mixed Berries', '1 tbsp Honey', '1 tbsp Chia Seeds'],
 ARRAY['Layer half the yogurt in a glass', 'Add half the granola and berries', 'Repeat layers', 'Drizzle with honey and sprinkle chia seeds', 'Serve immediately'],
 NULL, 'breakfast', false),

-- Lunch meals
('Mediterranean Quinoa Bowl', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center', 25, 2, false,
 ARRAY['1 cup Quinoa', '1 Cucumber', '2 Tomatoes', '1/2 Red Onion', '1/2 cup Kalamata Olives', '200g Feta Cheese', '3 tbsp Olive Oil', '2 tbsp Lemon Juice', 'Fresh Herbs'],
 ARRAY['Cook quinoa according to package instructions', 'Dice cucumber and tomatoes', 'Thinly slice red onion', 'Combine all ingredients in a bowl', 'Dress with olive oil and lemon juice', 'Garnish with fresh herbs'],
 NULL, 'lunch', false),

('Chicken Caesar Wrap', 'https://images.unsplash.com/photo-1565299585323-38174c4c4539?w=400&h=300&fit=crop&crop=center', 15, 2, false,
 ARRAY['2 Large Tortillas', '300g Grilled Chicken', '2 cups Romaine Lettuce', '1/2 cup Caesar Dressing', '1/4 cup Parmesan Cheese', '1/2 cup Croutons', 'Salt and Pepper'],
 ARRAY['Warm tortillas in a dry pan', 'Slice grilled chicken into strips', 'Shred lettuce and mix with dressing', 'Layer chicken, lettuce, and cheese on tortilla', 'Add croutons and season', 'Roll tightly and slice in half'],
 NULL, 'lunch', false),

('Vegetarian Buddha Bowl', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center', 30, 2, true,
 ARRAY['1 cup Brown Rice', '1 Sweet Potato', '1 cup Chickpeas', '2 cups Kale', '1 Avocado', '2 tbsp Tahini', '1 tbsp Lemon Juice', 'Sesame Seeds'],
 ARRAY['Cook brown rice according to package', 'Roast sweet potato cubes at 400°F for 20 minutes', 'Season and roast chickpeas for 15 minutes', 'Massage kale with lemon juice', 'Arrange all ingredients in bowls', 'Drizzle with tahini and sprinkle sesame seeds'],
 NULL, 'lunch', false),

-- Dinner meals
('Beef Stir Fry', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center', 20, 3, false,
 ARRAY['500g Beef Strips', '2 Bell Peppers', '1 Broccoli Head', '3 cloves Garlic', '2 tbsp Soy Sauce', '1 tbsp Oyster Sauce', '1 tbsp Cornstarch', '2 tbsp Vegetable Oil', 'Ginger'],
 ARRAY['Slice beef into thin strips', 'Cut vegetables into bite-sized pieces', 'Heat oil in a wok or large pan', 'Cook beef until browned, then remove', 'Stir-fry vegetables for 3-4 minutes', 'Add beef back with sauce mixture', 'Cook until sauce thickens'],
 NULL, 'dinner', false),

('Salmon with Roasted Vegetables', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&crop=center', 35, 2, false,
 ARRAY['2 Salmon Fillets', '2 Sweet Potatoes', '1 Broccoli Head', '1 Zucchini', '3 tbsp Olive Oil', '2 cloves Garlic', 'Lemon', 'Fresh Dill', 'Salt and Pepper'],
 ARRAY['Preheat oven to 425°F', 'Cut vegetables into chunks', 'Toss vegetables with oil, garlic, salt, and pepper', 'Roast vegetables for 20 minutes', 'Season salmon and add to pan', 'Roast for 12-15 minutes until fish flakes', 'Garnish with lemon and dill'],
 NULL, 'dinner', false),

('Vegetarian Pasta Primavera', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center', 25, 4, true,
 ARRAY['400g Pasta', '2 Zucchini', '1 Bell Pepper', '1 cup Cherry Tomatoes', '3 cloves Garlic', '1/4 cup Olive Oil', '1/2 cup Parmesan Cheese', 'Fresh Basil', 'Red Pepper Flakes'],
 ARRAY['Cook pasta according to package instructions', 'Slice vegetables into thin strips', 'Heat oil in a large pan', 'Sauté garlic until fragrant', 'Add vegetables and cook until tender', 'Toss with pasta and cheese', 'Garnish with basil and red pepper flakes'],
 NULL, 'dinner', false),

('Chicken Tikka Masala', 'https://images.unsplash.com/photo-1563379091339-03246963d4b8?w=400&h=300&fit=crop&crop=center', 45, 4, false,
 ARRAY['600g Chicken Thighs', '1 Onion', '3 cloves Garlic', '1 inch Ginger', '1 can Coconut Milk', '2 tbsp Tomato Paste', '2 tbsp Garam Masala', '1 tsp Turmeric', 'Basmati Rice', 'Fresh Cilantro'],
 ARRAY['Cut chicken into bite-sized pieces', 'Sauté onions until golden', 'Add garlic, ginger, and spices', 'Add chicken and cook until browned', 'Stir in coconut milk and tomato paste', 'Simmer for 20-25 minutes', 'Serve over rice with cilantro'],
 NULL, 'dinner', false),

('Quick Veggie Stir Fry', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center', 15, 2, true,
 ARRAY['2 cups Mixed Vegetables', '2 cloves Garlic', '1 tbsp Soy Sauce', '1 tbsp Sesame Oil', '1 tsp Ginger', 'Sesame Seeds', 'Green Onions'],
 ARRAY['Heat sesame oil in a large pan', 'Add minced garlic and ginger', 'Stir-fry vegetables for 5-7 minutes', 'Add soy sauce and toss', 'Garnish with sesame seeds and green onions', 'Serve immediately'],
 NULL, 'dinner', false),

-- Additional diverse options
('Mushroom Risotto', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop&crop=center', 40, 3, false,
 ARRAY['1 cup Arborio Rice', '300g Mixed Mushrooms', '1 Onion', '3 cloves Garlic', '1/2 cup White Wine', '4 cups Vegetable Stock', '1/2 cup Parmesan Cheese', 'Fresh Thyme', 'Butter'],
 ARRAY['Sauté onions and garlic until soft', 'Add mushrooms and cook until golden', 'Add rice and stir for 2 minutes', 'Add wine and stir until absorbed', 'Add stock gradually, stirring constantly', 'Continue until rice is creamy and tender', 'Stir in cheese and herbs'],
 NULL, 'dinner', false),

('Breakfast Burrito', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop&crop=center', 20, 2, false,
 ARRAY['2 Large Tortillas', '4 Eggs', '1 cup Black Beans', '1/2 cup Shredded Cheese', '1 Avocado', '1/2 cup Salsa', 'Sour Cream', 'Cilantro'],
 ARRAY['Scramble eggs in a pan', 'Warm tortillas in a dry pan', 'Layer beans, eggs, and cheese on tortilla', 'Add avocado slices and salsa', 'Roll tightly and serve with sour cream', 'Garnish with cilantro'],
 NULL, 'breakfast', false),

('Caprese Salad', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center', 10, 2, true,
 ARRAY['3 Tomatoes', '200g Fresh Mozzarella', 'Fresh Basil', '3 tbsp Balsamic Vinegar', '3 tbsp Olive Oil', 'Salt and Pepper'],
 ARRAY['Slice tomatoes and mozzarella', 'Arrange on a plate alternating slices', 'Tear fresh basil leaves', 'Drizzle with balsamic and olive oil', 'Season with salt and pepper', 'Serve immediately'],
 NULL, 'lunch', false);
