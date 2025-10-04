// API service functions for communicating with the backend
import { ApiResponse, ShoppingItem, StorageItem, Meal, CalendarEvent } from './types'

const API_BASE_URL = 'http://localhost:3001/api'

// Generic API call function
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  console.log('🌐 Making API call to:', url)
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  console.log('🌐 API response status:', response.status, response.statusText)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('🌐 API call failed:', response.status, response.statusText, errorText)
    throw new Error(`API call failed: ${response.statusText}`)
  }

  const data = await response.json()
  console.log('🌐 API response data:', data)
  return data
}

// Storage API
export const storageApi = {
  getAll: () => apiCall('/storage'),
  getById: (id: number) => apiCall(`/storage/${id}`),
  create: (data: any) => apiCall('/storage', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/storage/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/storage/${id}`, { method: 'DELETE' }),
  getByCategory: (category: string) => apiCall(`/storage/category/${category}`),
  getExpiring: (days: number) => apiCall(`/storage/expiring/${days}`),
}

// Shopping API
export const shoppingApi = {
  getAll: (): Promise<ApiResponse<ShoppingItem[]>> => apiCall('/shopping'),
  getById: (id: number): Promise<ApiResponse<ShoppingItem>> => apiCall(`/shopping/${id}`),
  create: (data: Omit<ShoppingItem, 'id' | 'isCompleted'>): Promise<ApiResponse<ShoppingItem>> => apiCall('/shopping', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<ShoppingItem>): Promise<ApiResponse<ShoppingItem>> => apiCall(`/shopping/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number): Promise<ApiResponse<ShoppingItem>> => apiCall(`/shopping/${id}`, { method: 'DELETE' }),
  toggle: (id: number): Promise<ApiResponse<ShoppingItem>> => apiCall(`/shopping/${id}/toggle`, { method: 'PUT' }),
  getByPriority: (priority: string): Promise<ApiResponse<ShoppingItem[]>> => apiCall(`/shopping/priority/${priority}`),
  getByCategory: (category: string): Promise<ApiResponse<ShoppingItem[]>> => apiCall(`/shopping/category/${category}`),
  getCompleted: (): Promise<ApiResponse<ShoppingItem[]>> => apiCall('/shopping/completed/items'),
}

// Meals API
export const mealsApi = {
  getAll: () => apiCall('/meals'),
  getById: (id: string) => apiCall(`/meals/${id}`),
  create: (data: any) => apiCall('/meals', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiCall(`/meals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiCall(`/meals/${id}`, { method: 'DELETE' }),
  getSaved: () => apiCall('/meals/saved/meals'),
  getExplore: () => apiCall('/meals/explore/meals'),
  getByType: (type: string) => apiCall(`/meals/type/${type}`),
  searchByIngredient: (ingredient: string) => apiCall(`/meals/ingredients/${ingredient}`),
  archive: (id: string) => apiCall(`/meals/${id}/archive`, { method: 'PUT' }),
}

// Calendar API
export const calendarApi = {
  getAll: () => apiCall('/calendar'),
  getById: (id: string) => apiCall(`/calendar/${id}`),
  create: (data: any) => apiCall('/calendar', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiCall(`/calendar/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiCall(`/calendar/${id}`, { method: 'DELETE' }),
  getByDate: (date: string) => apiCall(`/calendar/date/${date}`),
  getByType: (type: string) => apiCall(`/calendar/type/${type}`),
  getByRange: (startDate: string, endDate: string) => apiCall(`/calendar/range/${startDate}/${endDate}`),
}

// Dashboard API
export const dashboardApi = {
  getOverview: () => apiCall('/dashboard'),
  getPlannedMeals: () => apiCall('/dashboard/planned-meals'),
  getUrgentShopping: () => apiCall('/dashboard/urgent-shopping'),
  getExpiringItems: () => apiCall('/dashboard/expiring-items'),
  getStats: () => apiCall('/dashboard/stats'),
}
