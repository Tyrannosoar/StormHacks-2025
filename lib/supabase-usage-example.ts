// Example of how to use the new Supabase API
// This file shows how to replace your existing API calls with Supabase

import { 
  supabaseShoppingApi, 
  supabaseStorageApi, 
  supabaseMealsApi, 
  supabaseCalendarApi,
  supabaseDashboardApi 
} from './supabase-api'

// Example: Shopping List Component
export async function getShoppingList() {
  try {
    const response = await supabaseShoppingApi.getAll()
    if (response.success && response.data) {
      console.log('Shopping items:', response.data)
      return response.data
    } else {
      console.error('Error fetching shopping items:', response.error)
      return []
    }
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

// Example: Add new shopping item
export async function addShoppingItem(item: {
  name: string
  amount: string
  plannedAmount: string
  category: string
  priority: 'high' | 'medium' | 'low'
}) {
  try {
    const response = await supabaseShoppingApi.create(item)
    if (response.success && response.data) {
      console.log('Item added:', response.data)
      return response.data
    } else {
      console.error('Error adding item:', response.error)
      return null
    }
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Example: Toggle item completion
export async function toggleShoppingItem(id: number) {
  try {
    const response = await supabaseShoppingApi.toggle(id)
    if (response.success && response.data) {
      console.log('Item toggled:', response.data)
      return response.data
    } else {
      console.error('Error toggling item:', response.error)
      return null
    }
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Example: Storage Items
export async function getStorageItems() {
  try {
    const response = await supabaseStorageApi.getAll()
    if (response.success && response.data) {
      console.log('Storage items:', response.data)
      return response.data
    } else {
      console.error('Error fetching storage items:', response.error)
      return []
    }
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

// Example: Get expiring items
export async function getExpiringItems(days: number = 7) {
  try {
    const response = await supabaseStorageApi.getExpiring(days)
    if (response.success && response.data) {
      console.log('Expiring items:', response.data)
      return response.data
    } else {
      console.error('Error fetching expiring items:', response.error)
      return []
    }
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

// Example: Meals
export async function getMeals() {
  try {
    const response = await supabaseMealsApi.getAll()
    if (response.success && response.data) {
      console.log('Meals:', response.data)
      return response.data
    } else {
      console.error('Error fetching meals:', response.error)
      return []
    }
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

// Example: Get saved meals (planned meals)
export async function getSavedMeals() {
  try {
    const response = await supabaseMealsApi.getSaved()
    if (response.success && response.data) {
      console.log('Saved meals:', response.data)
      return response.data
    } else {
      console.error('Error fetching saved meals:', response.error)
      return []
    }
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

// Example: Calendar Events
export async function getCalendarEvents() {
  try {
    const response = await supabaseCalendarApi.getAll()
    if (response.success && response.data) {
      console.log('Calendar events:', response.data)
      return response.data
    } else {
      console.error('Error fetching calendar events:', response.error)
      return []
    }
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

// Example: Get events by date
export async function getEventsByDate(date: string) {
  try {
    const response = await supabaseCalendarApi.getByDate(date)
    if (response.success && response.data) {
      console.log('Events for date:', response.data)
      return response.data
    } else {
      console.error('Error fetching events by date:', response.error)
      return []
    }
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

// Example: Dashboard data
export async function getDashboardData() {
  try {
    const [overview, plannedMeals, urgentShopping, expiringItems, stats] = await Promise.all([
      supabaseDashboardApi.getOverview(),
      supabaseDashboardApi.getPlannedMeals(),
      supabaseDashboardApi.getUrgentShopping(),
      supabaseDashboardApi.getExpiringItems(),
      supabaseDashboardApi.getStats()
    ])

    return {
      overview: overview.success ? overview.data : null,
      plannedMeals: plannedMeals.success ? plannedMeals.data : [],
      urgentShopping: urgentShopping.success ? urgentShopping.data : [],
      expiringItems: expiringItems.success ? expiringItems.data : [],
      stats: stats.success ? stats.data : null
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return {
      overview: null,
      plannedMeals: [],
      urgentShopping: [],
      expiringItems: [],
      stats: null
    }
  }
}

// Example: How to replace existing API calls in your components
/*
// OLD WAY (using hardcoded data):
import { shoppingApi } from '../lib/api'

// NEW WAY (using Supabase):
import { supabaseShoppingApi } from '../lib/supabase-api'

// Replace this:
const response = await shoppingApi.getAll()

// With this:
const response = await supabaseShoppingApi.getAll()
*/
