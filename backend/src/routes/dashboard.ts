import { Router } from 'express'
import { plannedMeals, urgentShoppingItems, expiringItems } from '../data/hardcodedData'
import { ApiResponse, PlannedMeal, UrgentShoppingItem, ExpiringItem } from '../types'

const router = Router()

// GET /api/dashboard - Get dashboard overview data
router.get('/', (req, res) => {
  try {
    const dashboardData = {
      plannedMeals,
      urgentShoppingItems,
      expiringItems
    }
    
    const response: ApiResponse<typeof dashboardData> = {
      success: true,
      data: dashboardData,
      message: 'Dashboard data retrieved successfully'
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve dashboard data'
    }
    res.status(500).json(response)
  }
})

// GET /api/dashboard/planned-meals - Get planned meals
router.get('/planned-meals', (req, res) => {
  try {
    const response: ApiResponse<PlannedMeal[]> = {
      success: true,
      data: plannedMeals,
      message: 'Planned meals retrieved successfully'
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve planned meals'
    }
    res.status(500).json(response)
  }
})

// GET /api/dashboard/urgent-shopping - Get urgent shopping items
router.get('/urgent-shopping', (req, res) => {
  try {
    const response: ApiResponse<UrgentShoppingItem[]> = {
      success: true,
      data: urgentShoppingItems,
      message: 'Urgent shopping items retrieved successfully'
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve urgent shopping items'
    }
    res.status(500).json(response)
  }
})

// GET /api/dashboard/expiring-items - Get expiring items
router.get('/expiring-items', (req, res) => {
  try {
    const response: ApiResponse<ExpiringItem[]> = {
      success: true,
      data: expiringItems,
      message: 'Expiring items retrieved successfully'
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve expiring items'
    }
    res.status(500).json(response)
  }
})

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalPlannedMeals: plannedMeals.length,
      urgentItemsCount: urgentShoppingItems.filter(item => item.priority === 'high').length,
      expiringItemsCount: expiringItems.filter(item => item.daysLeft <= 3).length,
      highPriorityShopping: urgentShoppingItems.filter(item => item.priority === 'high').length,
      mediumPriorityShopping: urgentShoppingItems.filter(item => item.priority === 'medium').length,
      lowPriorityShopping: urgentShoppingItems.filter(item => item.priority === 'low').length,
      criticalExpiring: expiringItems.filter(item => item.daysLeft <= 1).length,
      soonExpiring: expiringItems.filter(item => item.daysLeft > 1 && item.daysLeft <= 3).length
    }
    
    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats,
      message: 'Dashboard statistics retrieved successfully'
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve dashboard statistics'
    }
    res.status(500).json(response)
  }
})

export default router
