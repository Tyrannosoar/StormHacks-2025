import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      shopping_items: {
        Row: {
          id: number
          name: string
          amount: string
          planned_amount: string
          category: string
          priority: 'high' | 'medium' | 'low'
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          amount: string
          planned_amount: string
          category: string
          priority: 'high' | 'medium' | 'low'
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          amount?: string
          planned_amount?: string
          category?: string
          priority?: 'high' | 'medium' | 'low'
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      storage_items: {
        Row: {
          id: number
          name: string
          amount: string
          expiry_days: number
          planned_amount: string
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          amount: string
          expiry_days: number
          planned_amount: string
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          amount?: string
          expiry_days?: number
          planned_amount?: string
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          title: string
          image: string
          cook_time: number
          servings: number
          has_all_ingredients: boolean
          ingredients: string[]
          instructions: string[]
          planned_date?: string
          meal_type?: 'breakfast' | 'lunch' | 'dinner'
          is_archived?: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          image: string
          cook_time: number
          servings: number
          has_all_ingredients: boolean
          ingredients: string[]
          instructions: string[]
          planned_date?: string
          meal_type?: 'breakfast' | 'lunch' | 'dinner'
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          image?: string
          cook_time?: number
          servings?: number
          has_all_ingredients?: boolean
          ingredients?: string[]
          instructions?: string[]
          planned_date?: string
          meal_type?: 'breakfast' | 'lunch' | 'dinner'
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      calendar_events: {
        Row: {
          id: string
          title: string
          type: 'meal' | 'shopping' | 'custom'
          time: string
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          type: 'meal' | 'shopping' | 'custom'
          time: string
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: 'meal' | 'shopping' | 'custom'
          time?: string
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
