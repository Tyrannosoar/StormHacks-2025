-- Supabase Database Schema for MagnaCart Grocery Management App

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Shopping Items Table
CREATE TABLE IF NOT EXISTS shopping_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount VARCHAR(100) NOT NULL,
    planned_amount VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(20) CHECK (priority IN ('high', 'medium', 'low')) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Storage Items Table
CREATE TABLE IF NOT EXISTS storage_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount VARCHAR(100) NOT NULL,
    expiry_days INTEGER NOT NULL,
    planned_amount VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meals Table
CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    image TEXT NOT NULL,
    cook_time INTEGER NOT NULL,
    servings INTEGER NOT NULL,
    has_all_ingredients BOOLEAN NOT NULL,
    ingredients TEXT[] NOT NULL,
    instructions TEXT[] NOT NULL,
    planned_date DATE,
    meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar Events Table
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('meal', 'shopping', 'custom')) NOT NULL,
    time VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shopping_items_priority ON shopping_items(priority);
CREATE INDEX IF NOT EXISTS idx_shopping_items_category ON shopping_items(category);
CREATE INDEX IF NOT EXISTS idx_shopping_items_completed ON shopping_items(is_completed);

CREATE INDEX IF NOT EXISTS idx_storage_items_category ON storage_items(category);
CREATE INDEX IF NOT EXISTS idx_storage_items_expiry ON storage_items(expiry_days);

CREATE INDEX IF NOT EXISTS idx_meals_meal_type ON meals(meal_type);
CREATE INDEX IF NOT EXISTS idx_meals_planned_date ON meals(planned_date);
CREATE INDEX IF NOT EXISTS idx_meals_archived ON meals(is_archived);

CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON calendar_events(type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_shopping_items_updated_at BEFORE UPDATE ON shopping_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_storage_items_updated_at BEFORE UPDATE ON storage_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON meals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO shopping_items (name, amount, planned_amount, category, priority, is_completed) VALUES
('Milk', '1L', '1L', 'Dairy', 'high', false),
('Bread', '1 loaf', '1 loaf', 'Grains', 'high', false),
('Eggs', '12 pcs', '12 pcs', 'Dairy', 'high', false),
('Butter', '250g', '250g', 'Dairy', 'high', false),
('Cheese', '200g', '200g', 'Dairy', 'high', false),
('Ground Beef', '500g', '500g', 'Meat', 'high', false),
('Tomatoes', '6 pcs', '4 pcs', 'Vegetables', 'medium', false),
('Chicken Breast', '800g', '600g', 'Meat', 'medium', false),
('Greek Yogurt', '500g', '300g', 'Dairy', 'medium', false),
('Onions', '1kg', '500g', 'Vegetables', 'medium', false);

INSERT INTO storage_items (name, amount, expiry_days, planned_amount, category) VALUES
('Whole Milk', '1L', 3, '500ml', 'Dairy'),
('Greek Yogurt', '500g', 1, '200g', 'Dairy'),
('Cheddar Cheese', '200g', 7, '100g', 'Dairy'),
('Mozzarella', '250g', 4, '150g', 'Dairy'),
('Spinach', '150g', 2, '100g', 'Vegetables'),
('Tomatoes', '6 pcs', 5, '3 pcs', 'Vegetables'),
('Bell Peppers', '3 pcs', 8, '1 pc', 'Vegetables'),
('Carrots', '500g', 10, '200g', 'Vegetables'),
('Chicken Breast', '800g', 3, '400g', 'Meat'),
('Ground Beef', '500g', 2, '300g', 'Meat');

INSERT INTO meals (title, image, cook_time, servings, has_all_ingredients, ingredients, instructions, planned_date, meal_type, is_archived) VALUES
('Spaghetti Carbonara', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center', 25, 4, true, 
 ARRAY['400g Spaghetti', '4 Eggs', '200g Bacon', '100g Parmesan', '1 tsp Black Pepper'],
 ARRAY['Boil pasta according to package instructions', 'Cook bacon until crispy', 'Mix eggs and grated parmesan in a bowl', 'Drain pasta and immediately mix with bacon', 'Remove from heat and quickly stir in egg mixture', 'Season with black pepper and serve'],
 '2025-01-25', 'dinner', false),
('Chicken Stir Fry', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center', 20, 3, true,
 ARRAY['500g Chicken Breast', '2 Bell Peppers', '200g Broccoli', '3 tbsp Soy Sauce', '3 cloves Garlic', '1 tbsp Ginger'],
 ARRAY['Cut chicken into strips', 'Heat oil in a wok or large pan', 'Cook chicken until golden brown', 'Add vegetables and stir-fry for 3-4 minutes', 'Add soy sauce, garlic, and ginger', 'Cook for another 2 minutes and serve'],
 '2025-01-26', 'dinner', false),
('Greek Salad', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center', 15, 2, true,
 ARRAY['3 Tomatoes', '1 Cucumber', '1 Red Onion', '200g Feta Cheese', '10 Kalamata Olives', '3 tbsp Olive Oil', '1 tbsp Oregano'],
 ARRAY['Chop tomatoes and cucumber', 'Slice red onion thinly', 'Combine vegetables in a bowl', 'Add feta cheese and olives', 'Drizzle with olive oil and season'],
 '2025-01-27', 'lunch', false);

INSERT INTO calendar_events (title, type, time, date) VALUES
('Breakfast: Oatmeal', 'meal', '08:00', '2025-01-20'),
('Grocery Shopping', 'shopping', '10:00', '2025-01-21'),
('Lunch: Pasta', 'meal', '12:30', '2025-01-21'),
('Dinner: Salmon', 'meal', '19:00', '2025-01-22'),
('Weekly Shop', 'shopping', '09:00', '2025-01-25'),
('Meal Prep', 'custom', '15:00', '2025-01-19'),
('Dinner Party', 'custom', '18:00', '2025-01-30'),
('Breakfast: Pancakes', 'meal', '09:00', '2025-01-23'),
('Lunch: Caesar Salad', 'meal', '13:00', '2025-01-24'),
('Farmers Market', 'shopping', '08:00', '2025-01-26');

-- Enable Row Level Security (RLS)
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you can modify these based on your auth requirements)
CREATE POLICY "Enable read access for all users" ON shopping_items FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON shopping_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON shopping_items FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON shopping_items FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON storage_items FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON storage_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON storage_items FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON storage_items FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON meals FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON meals FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON meals FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON meals FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON calendar_events FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON calendar_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON calendar_events FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON calendar_events FOR DELETE USING (true);
