import { supabase } from './supabase'
import { ApiResponse, ShoppingItem, StorageItem, Meal, CalendarEvent } from './types'

// Shopping Items API
export const supabaseShoppingApi = {
  async getAll(): Promise<ApiResponse<ShoppingItem[]>> {
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error

      const shoppingItems: ShoppingItem[] = data.map(item => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        plannedAmount: item.planned_amount,
        category: item.category,
        priority: item.priority,
        isCompleted: item.is_completed
      }))

      return { success: true, data: shoppingItems }
    } catch (error) {
      console.error('Error fetching shopping items:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getById(id: number): Promise<ApiResponse<ShoppingItem>> {
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      const shoppingItem: ShoppingItem = {
        id: data.id,
        name: data.name,
        amount: data.amount,
        plannedAmount: data.planned_amount,
        category: data.category,
        priority: data.priority,
        isCompleted: data.is_completed
      }

      return { success: true, data: shoppingItem }
    } catch (error) {
      console.error('Error fetching shopping item:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async create(item: Omit<ShoppingItem, 'id' | 'isCompleted'>): Promise<ApiResponse<ShoppingItem>> {
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .insert({
          name: item.name,
          amount: item.amount,
          planned_amount: item.plannedAmount,
          category: item.category,
          priority: item.priority,
          is_completed: false
        })
        .select()
        .single()

      if (error) throw error

      const shoppingItem: ShoppingItem = {
        id: data.id,
        name: data.name,
        amount: data.amount,
        plannedAmount: data.planned_amount,
        category: data.category,
        priority: data.priority,
        isCompleted: data.is_completed
      }

      return { success: true, data: shoppingItem }
    } catch (error) {
      console.error('Error creating shopping item:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async update(id: number, updates: Partial<ShoppingItem>): Promise<ApiResponse<ShoppingItem>> {
    try {
      const updateData: any = {}
      if (updates.name) updateData.name = updates.name
      if (updates.amount) updateData.amount = updates.amount
      if (updates.plannedAmount) updateData.planned_amount = updates.plannedAmount
      if (updates.category) updateData.category = updates.category
      if (updates.priority) updateData.priority = updates.priority
      if (updates.isCompleted !== undefined) updateData.is_completed = updates.isCompleted

      const { data, error } = await supabase
        .from('shopping_items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const shoppingItem: ShoppingItem = {
        id: data.id,
        name: data.name,
        amount: data.amount,
        plannedAmount: data.planned_amount,
        category: data.category,
        priority: data.priority,
        isCompleted: data.is_completed
      }

      return { success: true, data: shoppingItem }
    } catch (error) {
      console.error('Error updating shopping item:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async delete(id: number): Promise<ApiResponse<ShoppingItem>> {
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .delete()
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const shoppingItem: ShoppingItem = {
        id: data.id,
        name: data.name,
        amount: data.amount,
        plannedAmount: data.planned_amount,
        category: data.category,
        priority: data.priority,
        isCompleted: data.is_completed
      }

      return { success: true, data: shoppingItem }
    } catch (error) {
      console.error('Error deleting shopping item:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async toggle(id: number): Promise<ApiResponse<ShoppingItem>> {
    try {
      // First get the current item
      const { data: currentItem, error: fetchError } = await supabase
        .from('shopping_items')
        .select('is_completed')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // Toggle the completion status
      const { data, error } = await supabase
        .from('shopping_items')
        .update({ is_completed: !currentItem.is_completed })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const shoppingItem: ShoppingItem = {
        id: data.id,
        name: data.name,
        amount: data.amount,
        plannedAmount: data.planned_amount,
        category: data.category,
        priority: data.priority,
        isCompleted: data.is_completed
      }

      return { success: true, data: shoppingItem }
    } catch (error) {
      console.error('Error toggling shopping item:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getByPriority(priority: string): Promise<ApiResponse<ShoppingItem[]>> {
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .select('*')
        .eq('priority', priority)
        .order('created_at', { ascending: false })

      if (error) throw error

      const shoppingItems: ShoppingItem[] = data.map(item => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        plannedAmount: item.planned_amount,
        category: item.category,
        priority: item.priority,
        isCompleted: item.is_completed
      }))

      return { success: true, data: shoppingItems }
    } catch (error) {
      console.error('Error fetching shopping items by priority:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getByCategory(category: string): Promise<ApiResponse<ShoppingItem[]>> {
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) throw error

      const shoppingItems: ShoppingItem[] = data.map(item => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        plannedAmount: item.planned_amount,
        category: item.category,
        priority: item.priority,
        isCompleted: item.is_completed
      }))

      return { success: true, data: shoppingItems }
    } catch (error) {
      console.error('Error fetching shopping items by category:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getCompleted(): Promise<ApiResponse<ShoppingItem[]>> {
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .select('*')
        .eq('is_completed', true)
        .order('updated_at', { ascending: false })

      if (error) throw error

      const shoppingItems: ShoppingItem[] = data.map(item => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        plannedAmount: item.planned_amount,
        category: item.category,
        priority: item.priority,
        isCompleted: item.is_completed
      }))

      return { success: true, data: shoppingItems }
    } catch (error) {
      console.error('Error fetching completed shopping items:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Storage Items API
export const supabaseStorageApi = {
  async getAll(): Promise<ApiResponse<StorageItem[]>> {
    try {
      const { data, error } = await supabase
        .from('storage_items')
        .select('*')
        .order('expiry_days', { ascending: true })

      if (error) throw error

      const storageItems: StorageItem[] = data.map(item => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        expiryDays: item.expiry_days,
        plannedAmount: item.planned_amount,
        category: item.category
      }))

      return { success: true, data: storageItems }
    } catch (error) {
      console.error('Error fetching storage items:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getById(id: number): Promise<ApiResponse<StorageItem>> {
    try {
      const { data, error } = await supabase
        .from('storage_items')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      const storageItem: StorageItem = {
        id: data.id,
        name: data.name,
        amount: data.amount,
        expiryDays: data.expiry_days,
        plannedAmount: data.planned_amount,
        category: data.category
      }

      return { success: true, data: storageItem }
    } catch (error) {
      console.error('Error fetching storage item:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async create(item: Omit<StorageItem, 'id'>): Promise<ApiResponse<StorageItem>> {
    try {
      const { data, error } = await supabase
        .from('storage_items')
        .insert({
          name: item.name,
          amount: item.amount,
          expiry_days: item.expiryDays,
          planned_amount: item.plannedAmount,
          category: item.category
        })
        .select()
        .single()

      if (error) throw error

      const storageItem: StorageItem = {
        id: data.id,
        name: data.name,
        amount: data.amount,
        expiryDays: data.expiry_days,
        plannedAmount: data.planned_amount,
        category: data.category
      }

      return { success: true, data: storageItem }
    } catch (error) {
      console.error('Error creating storage item:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async update(id: number, updates: Partial<StorageItem>): Promise<ApiResponse<StorageItem>> {
    try {
      const updateData: any = {}
      if (updates.name) updateData.name = updates.name
      if (updates.amount) updateData.amount = updates.amount
      if (updates.expiryDays) updateData.expiry_days = updates.expiryDays
      if (updates.plannedAmount) updateData.planned_amount = updates.plannedAmount
      if (updates.category) updateData.category = updates.category

      const { data, error } = await supabase
        .from('storage_items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const storageItem: StorageItem = {
        id: data.id,
        name: data.name,
        amount: data.amount,
        expiryDays: data.expiry_days,
        plannedAmount: data.planned_amount,
        category: data.category
      }

      return { success: true, data: storageItem }
    } catch (error) {
      console.error('Error updating storage item:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async delete(id: number): Promise<ApiResponse<StorageItem>> {
    try {
      const { data, error } = await supabase
        .from('storage_items')
        .delete()
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const storageItem: StorageItem = {
        id: data.id,
        name: data.name,
        amount: data.amount,
        expiryDays: data.expiry_days,
        plannedAmount: data.planned_amount,
        category: data.category
      }

      return { success: true, data: storageItem }
    } catch (error) {
      console.error('Error deleting storage item:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getByCategory(category: string): Promise<ApiResponse<StorageItem[]>> {
    try {
      const { data, error } = await supabase
        .from('storage_items')
        .select('*')
        .eq('category', category)
        .order('expiry_days', { ascending: true })

      if (error) throw error

      const storageItems: StorageItem[] = data.map(item => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        expiryDays: item.expiry_days,
        plannedAmount: item.planned_amount,
        category: item.category
      }))

      return { success: true, data: storageItems }
    } catch (error) {
      console.error('Error fetching storage items by category:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getExpiring(days: number): Promise<ApiResponse<StorageItem[]>> {
    try {
      const { data, error } = await supabase
        .from('storage_items')
        .select('*')
        .lte('expiry_days', days)
        .order('expiry_days', { ascending: true })

      if (error) throw error

      const storageItems: StorageItem[] = data.map(item => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        expiryDays: item.expiry_days,
        plannedAmount: item.planned_amount,
        category: item.category
      }))

      return { success: true, data: storageItems }
    } catch (error) {
      console.error('Error fetching expiring storage items:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Meals API
export const supabaseMealsApi = {
  async getAll(): Promise<ApiResponse<Meal[]>> {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const meals: Meal[] = data.map(item => ({
        id: item.id,
        title: item.title,
        image: item.image,
        cookTime: item.cook_time,
        servings: item.servings,
        hasAllIngredients: item.has_all_ingredients,
        ingredients: item.ingredients,
        instructions: item.instructions,
        plannedDate: item.planned_date,
        mealType: item.meal_type,
        isArchived: item.is_archived
      }))

      return { success: true, data: meals }
    } catch (error) {
      console.error('Error fetching meals:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getById(id: string): Promise<ApiResponse<Meal>> {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      const meal: Meal = {
        id: data.id,
        title: data.title,
        image: data.image,
        cookTime: data.cook_time,
        servings: data.servings,
        hasAllIngredients: data.has_all_ingredients,
        ingredients: data.ingredients,
        instructions: data.instructions,
        plannedDate: data.planned_date,
        mealType: data.meal_type,
        isArchived: data.is_archived
      }

      return { success: true, data: meal }
    } catch (error) {
      console.error('Error fetching meal:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async create(meal: Omit<Meal, 'id'>): Promise<ApiResponse<Meal>> {
    try {
      const { data, error } = await supabase
        .from('meals')
        .insert({
          title: meal.title,
          image: meal.image,
          cook_time: meal.cookTime,
          servings: meal.servings,
          has_all_ingredients: meal.hasAllIngredients,
          ingredients: meal.ingredients,
          instructions: meal.instructions,
          planned_date: meal.plannedDate,
          meal_type: meal.mealType,
          is_archived: meal.isArchived || false
        })
        .select()
        .single()

      if (error) throw error

      const newMeal: Meal = {
        id: data.id,
        title: data.title,
        image: data.image,
        cookTime: data.cook_time,
        servings: data.servings,
        hasAllIngredients: data.has_all_ingredients,
        ingredients: data.ingredients,
        instructions: data.instructions,
        plannedDate: data.planned_date,
        mealType: data.meal_type,
        isArchived: data.is_archived
      }

      return { success: true, data: newMeal }
    } catch (error) {
      console.error('Error creating meal:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async update(id: string, updates: Partial<Meal>): Promise<ApiResponse<Meal>> {
    try {
      const updateData: any = {}
      if (updates.title) updateData.title = updates.title
      if (updates.image) updateData.image = updates.image
      if (updates.cookTime) updateData.cook_time = updates.cookTime
      if (updates.servings) updateData.servings = updates.servings
      if (updates.hasAllIngredients !== undefined) updateData.has_all_ingredients = updates.hasAllIngredients
      if (updates.ingredients) updateData.ingredients = updates.ingredients
      if (updates.instructions) updateData.instructions = updates.instructions
      if (updates.plannedDate) updateData.planned_date = updates.plannedDate
      if (updates.mealType) updateData.meal_type = updates.mealType
      if (updates.isArchived !== undefined) updateData.is_archived = updates.isArchived

      const { data, error } = await supabase
        .from('meals')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const meal: Meal = {
        id: data.id,
        title: data.title,
        image: data.image,
        cookTime: data.cook_time,
        servings: data.servings,
        hasAllIngredients: data.has_all_ingredients,
        ingredients: data.ingredients,
        instructions: data.instructions,
        plannedDate: data.planned_date,
        mealType: data.meal_type,
        isArchived: data.is_archived
      }

      return { success: true, data: meal }
    } catch (error) {
      console.error('Error updating meal:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async delete(id: string): Promise<ApiResponse<Meal>> {
    try {
      const { data, error } = await supabase
        .from('meals')
        .delete()
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const meal: Meal = {
        id: data.id,
        title: data.title,
        image: data.image,
        cookTime: data.cook_time,
        servings: data.servings,
        hasAllIngredients: data.has_all_ingredients,
        ingredients: data.ingredients,
        instructions: data.instructions,
        plannedDate: data.planned_date,
        mealType: data.meal_type,
        isArchived: data.is_archived
      }

      return { success: true, data: meal }
    } catch (error) {
      console.error('Error deleting meal:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getSaved(): Promise<ApiResponse<Meal[]>> {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('is_archived', false)
        .not('planned_date', 'is', null)
        .order('planned_date', { ascending: true })

      if (error) throw error

      const meals: Meal[] = data.map(item => ({
        id: item.id,
        title: item.title,
        image: item.image,
        cookTime: item.cook_time,
        servings: item.servings,
        hasAllIngredients: item.has_all_ingredients,
        ingredients: item.ingredients,
        instructions: item.instructions,
        plannedDate: item.planned_date,
        mealType: item.meal_type,
        isArchived: item.is_archived
      }))

      return { success: true, data: meals }
    } catch (error) {
      console.error('Error fetching saved meals:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getExplore(): Promise<ApiResponse<Meal[]>> {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .is('planned_date', null)
        .order('created_at', { ascending: false })

      if (error) throw error

      const meals: Meal[] = data.map(item => ({
        id: item.id,
        title: item.title,
        image: item.image,
        cookTime: item.cook_time,
        servings: item.servings,
        hasAllIngredients: item.has_all_ingredients,
        ingredients: item.ingredients,
        instructions: item.instructions,
        plannedDate: item.planned_date,
        mealType: item.meal_type,
        isArchived: item.is_archived
      }))

      return { success: true, data: meals }
    } catch (error) {
      console.error('Error fetching explore meals:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getByType(type: string): Promise<ApiResponse<Meal[]>> {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('meal_type', type)
        .order('created_at', { ascending: false })

      if (error) throw error

      const meals: Meal[] = data.map(item => ({
        id: item.id,
        title: item.title,
        image: item.image,
        cookTime: item.cook_time,
        servings: item.servings,
        hasAllIngredients: item.has_all_ingredients,
        ingredients: item.ingredients,
        instructions: item.instructions,
        plannedDate: item.planned_date,
        mealType: item.meal_type,
        isArchived: item.is_archived
      }))

      return { success: true, data: meals }
    } catch (error) {
      console.error('Error fetching meals by type:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async searchByIngredient(ingredient: string): Promise<ApiResponse<Meal[]>> {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .contains('ingredients', [ingredient])
        .order('created_at', { ascending: false })

      if (error) throw error

      const meals: Meal[] = data.map(item => ({
        id: item.id,
        title: item.title,
        image: item.image,
        cookTime: item.cook_time,
        servings: item.servings,
        hasAllIngredients: item.has_all_ingredients,
        ingredients: item.ingredients,
        instructions: item.instructions,
        plannedDate: item.planned_date,
        mealType: item.meal_type,
        isArchived: item.is_archived
      }))

      return { success: true, data: meals }
    } catch (error) {
      console.error('Error searching meals by ingredient:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async archive(id: string): Promise<ApiResponse<Meal>> {
    try {
      const { data, error } = await supabase
        .from('meals')
        .update({ is_archived: true })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const meal: Meal = {
        id: data.id,
        title: data.title,
        image: data.image,
        cookTime: data.cook_time,
        servings: data.servings,
        hasAllIngredients: data.has_all_ingredients,
        ingredients: data.ingredients,
        instructions: data.instructions,
        plannedDate: data.planned_date,
        mealType: data.meal_type,
        isArchived: data.is_archived
      }

      return { success: true, data: meal }
    } catch (error) {
      console.error('Error archiving meal:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Calendar Events API
export const supabaseCalendarApi = {
  async getAll(): Promise<ApiResponse<CalendarEvent[]>> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      if (error) throw error

      const events: CalendarEvent[] = data.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        time: item.time,
        date: item.date
      }))

      return { success: true, data: events }
    } catch (error) {
      console.error('Error fetching calendar events:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getById(id: string): Promise<ApiResponse<CalendarEvent>> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      const event: CalendarEvent = {
        id: data.id,
        title: data.title,
        type: data.type,
        time: data.time,
        date: data.date
      }

      return { success: true, data: event }
    } catch (error) {
      console.error('Error fetching calendar event:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async create(event: Omit<CalendarEvent, 'id'>): Promise<ApiResponse<CalendarEvent>> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          title: event.title,
          type: event.type,
          time: event.time,
          date: event.date
        })
        .select()
        .single()

      if (error) throw error

      const newEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        type: data.type,
        time: data.time,
        date: data.date
      }

      return { success: true, data: newEvent }
    } catch (error) {
      console.error('Error creating calendar event:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async update(id: string, updates: Partial<CalendarEvent>): Promise<ApiResponse<CalendarEvent>> {
    try {
      const updateData: any = {}
      if (updates.title) updateData.title = updates.title
      if (updates.type) updateData.type = updates.type
      if (updates.time) updateData.time = updates.time
      if (updates.date) updateData.date = updates.date

      const { data, error } = await supabase
        .from('calendar_events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const event: CalendarEvent = {
        id: data.id,
        title: data.title,
        type: data.type,
        time: data.time,
        date: data.date
      }

      return { success: true, data: event }
    } catch (error) {
      console.error('Error updating calendar event:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async delete(id: string): Promise<ApiResponse<CalendarEvent>> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const event: CalendarEvent = {
        id: data.id,
        title: data.title,
        type: data.type,
        time: data.time,
        date: data.date
      }

      return { success: true, data: event }
    } catch (error) {
      console.error('Error deleting calendar event:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getByDate(date: string): Promise<ApiResponse<CalendarEvent[]>> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('date', date)
        .order('time', { ascending: true })

      if (error) throw error

      const events: CalendarEvent[] = data.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        time: item.time,
        date: item.date
      }))

      return { success: true, data: events }
    } catch (error) {
      console.error('Error fetching calendar events by date:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getByType(type: string): Promise<ApiResponse<CalendarEvent[]>> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('type', type)
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      if (error) throw error

      const events: CalendarEvent[] = data.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        time: item.time,
        date: item.date
      }))

      return { success: true, data: events }
    } catch (error) {
      console.error('Error fetching calendar events by type:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getByRange(startDate: string, endDate: string): Promise<ApiResponse<CalendarEvent[]>> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      if (error) throw error

      const events: CalendarEvent[] = data.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        time: item.time,
        date: item.date
      }))

      return { success: true, data: events }
    } catch (error) {
      console.error('Error fetching calendar events by range:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Dashboard API
export const supabaseDashboardApi = {
  async getOverview(): Promise<ApiResponse<any>> {
    try {
      // Get counts for dashboard overview
      const [shoppingCount, storageCount, mealsCount, eventsCount] = await Promise.all([
        supabase.from('shopping_items').select('*', { count: 'exact', head: true }),
        supabase.from('storage_items').select('*', { count: 'exact', head: true }),
        supabase.from('meals').select('*', { count: 'exact', head: true }),
        supabase.from('calendar_events').select('*', { count: 'exact', head: true })
      ])

      return {
        success: true,
        data: {
          shoppingItems: shoppingCount.count || 0,
          storageItems: storageCount.count || 0,
          meals: mealsCount.count || 0,
          events: eventsCount.count || 0
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard overview:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getPlannedMeals(): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .not('planned_date', 'is', null)
        .eq('is_archived', false)
        .order('planned_date', { ascending: true })

      if (error) throw error

      const plannedMeals = data.map(meal => ({
        id: meal.id,
        name: meal.title,
        date: meal.planned_date,
        time: '7:00 PM' // Default time, you might want to store this in the database
      }))

      return { success: true, data: plannedMeals }
    } catch (error) {
      console.error('Error fetching planned meals:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getUrgentShopping(): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .select('*')
        .eq('priority', 'high')
        .eq('is_completed', false)
        .order('created_at', { ascending: false })

      if (error) throw error

      const urgentItems = data.map(item => ({
        id: item.id,
        name: item.name,
        priority: item.priority
      }))

      return { success: true, data: urgentItems }
    } catch (error) {
      console.error('Error fetching urgent shopping items:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getExpiringItems(): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('storage_items')
        .select('*')
        .lte('expiry_days', 7)
        .order('expiry_days', { ascending: true })

      if (error) throw error

      const expiringItems = data.map(item => ({
        id: item.id,
        name: item.name,
        daysLeft: item.expiry_days,
        category: item.category
      }))

      return { success: true, data: expiringItems }
    } catch (error) {
      console.error('Error fetching expiring items:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getStats(): Promise<ApiResponse<any>> {
    try {
      const [shoppingStats, storageStats, mealStats] = await Promise.all([
        supabase.from('shopping_items').select('priority, is_completed'),
        supabase.from('storage_items').select('category, expiry_days'),
        supabase.from('meals').select('meal_type, is_archived')
      ])

      if (shoppingStats.error) throw shoppingStats.error
      if (storageStats.error) throw storageStats.error
      if (mealStats.error) throw mealStats.error

      const stats = {
        shopping: {
          total: shoppingStats.data.length,
          completed: shoppingStats.data.filter(item => item.is_completed).length,
          highPriority: shoppingStats.data.filter(item => item.priority === 'high').length
        },
        storage: {
          total: storageStats.data.length,
          expiringSoon: storageStats.data.filter(item => item.expiry_days <= 3).length,
          categories: [...new Set(storageStats.data.map(item => item.category))].length
        },
        meals: {
          total: mealStats.data.length,
          archived: mealStats.data.filter(item => item.is_archived).length,
          byType: {
            breakfast: mealStats.data.filter(item => item.meal_type === 'breakfast').length,
            lunch: mealStats.data.filter(item => item.meal_type === 'lunch').length,
            dinner: mealStats.data.filter(item => item.meal_type === 'dinner').length
          }
        }
      }

      return { success: true, data: stats }
    } catch (error) {
      console.error('Error fetching stats:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}
