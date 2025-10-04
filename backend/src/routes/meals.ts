import { Router } from 'express'
import { meals, storageItems } from '../data/hardcodedData'
import { ApiResponse, Meal } from '../types'
import fs from 'fs'
import path from 'path'

// File path for persistent storage
const DATA_FILE = path.join(__dirname, '../../data/customMeals.json')

// Load custom meals from file or create empty array
let customMeals: Meal[] = []
try {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, 'utf8')
    customMeals = JSON.parse(data)
  }
} catch (error) {
  console.error('Error loading custom meals:', error)
  customMeals = []
}

// Save custom meals to file
const saveCustomMeals = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(customMeals, null, 2))
  } catch (error) {
    console.error('Error saving custom meals:', error)
  }
}

// Get all meals (hardcoded + custom)
const getAllMeals = () => [...meals, ...customMeals]

const router = Router()

// GET /api/meals - Get all meals
router.get('/', (req, res) => {
  try {
    const response: ApiResponse<Meal[]> = {
      success: true,
      data: getAllMeals(),
      message: 'Meals retrieved successfully'
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve meals'
    }
    res.status(500).json(response)
  }
})

// GET /api/meals/:id - Get specific meal
router.get('/:id', (req, res) => {
  try {
    const id = req.params.id
    const meal = getAllMeals().find(meal => meal.id === id)
    
    if (!meal) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Meal not found'
      }
      return res.status(404).json(response)
    }

    const response: ApiResponse<Meal> = {
      success: true,
      data: meal,
      message: 'Meal retrieved successfully'
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve meal'
    }
    res.status(500).json(response)
  }
})

// POST /api/meals - Add new meal
router.post('/', (req, res) => {
  try {
    const newMeal: Meal = {
      id: `custom-${Date.now()}`,
      ...req.body
    }
    
    customMeals.push(newMeal)
    saveCustomMeals()
    
    const response: ApiResponse<Meal> = {
      success: true,
      data: newMeal,
      message: 'Meal added successfully'
    }
    res.status(201).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to add meal'
    }
    res.status(500).json(response)
  }
})

// PUT /api/meals/:id - Update meal
router.put('/:id', (req, res) => {
  try {
    const id = req.params.id
    const allMeals = getAllMeals()
    const mealIndex = allMeals.findIndex(meal => meal.id === id)
    
    if (mealIndex === -1) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Meal not found'
      }
      return res.status(404).json(response)
    }

    // Check if it's a custom meal
    const customMealIndex = customMeals.findIndex(meal => meal.id === id)
    if (customMealIndex !== -1) {
      customMeals[customMealIndex] = { ...customMeals[customMealIndex], ...req.body }
      saveCustomMeals()
    } else {
      // For hardcoded meals, we can't modify them, so return error
      const response: ApiResponse<null> = {
        success: false,
        error: 'Cannot modify hardcoded meals'
      }
      return res.status(400).json(response)
    }
    
    const response: ApiResponse<Meal> = {
      success: true,
      data: customMeals[customMealIndex],
      message: 'Meal updated successfully'
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update meal'
    }
    res.status(500).json(response)
  }
})

// DELETE /api/meals/:id - Delete meal
router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id
    const customMealIndex = customMeals.findIndex(meal => meal.id === id)
    
    if (customMealIndex === -1) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Meal not found or cannot delete hardcoded meals'
      }
      return res.status(404).json(response)
    }

    const deletedMeal = customMeals.splice(customMealIndex, 1)[0]
    saveCustomMeals()
    
    const response: ApiResponse<Meal> = {
      success: true,
      data: deletedMeal,
      message: 'Meal deleted successfully'
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete meal'
    }
    res.status(500).json(response)
  }
})

// GET /api/meals/saved - Get saved meals only
router.get('/saved/meals', (req, res) => {
  try {
    const savedMeals = getAllMeals().filter(meal => meal.id.startsWith('saved-') || meal.isArchived === false)
    
    const response: ApiResponse<Meal[]> = {
      success: true,
      data: savedMeals,
      message: 'Saved meals retrieved successfully'
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve saved meals'
    }
    res.status(500).json(response)
  }
})

// GET /api/meals/explore - Get explore meals only
router.get('/explore/meals', (req, res) => {
  try {
    const exploreMeals = getAllMeals().filter(meal => meal.id.startsWith('explore-'))
    
    const response: ApiResponse<Meal[]> = {
      success: true,
      data: exploreMeals,
      message: 'Explore meals retrieved successfully'
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve explore meals'
    }
    res.status(500).json(response)
  }
})

// GET /api/meals/my-food - Get meals with ingredient availability check
router.get('/my-food', (req, res) => {
  try {
    // Get saved meals (those with plannedDate or custom recipes)
    const savedMeals = getAllMeals().filter(meal => meal.plannedDate || meal.id.startsWith('custom-'))
    
    // Function to check if ingredients are available in storage
    const checkIngredientAvailability = (meal: Meal) => {
      const availableIngredients = storageItems.map(item => item.name.toLowerCase())
      const mealIngredients = meal.ingredients.map(ingredient => 
        ingredient.toLowerCase().split(' ').slice(1).join(' ') // Remove quantity, keep ingredient name
      )
      
      const availableCount = mealIngredients.filter(ingredient => 
        availableIngredients.some(available => 
          available.includes(ingredient) || ingredient.includes(available)
        )
      ).length
      
      return {
        ...meal,
        hasAllIngredients: availableCount === mealIngredients.length,
        availableIngredientsCount: availableCount,
        totalIngredientsCount: mealIngredients.length
      }
    }
    
    const mealsWithAvailability = savedMeals.map(checkIngredientAvailability)
    
    const response: ApiResponse<any[]> = {
      success: true,
      data: mealsWithAvailability,
      message: 'My Food meals retrieved successfully'
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve My Food meals'
    }
    res.status(500).json(response)
  }
})

// GET /api/meals/type/:mealType - Get meals by type
router.get('/type/:mealType', (req, res) => {
  try {
    const mealType = req.params.mealType as 'breakfast' | 'lunch' | 'dinner'
    const filteredMeals = getAllMeals().filter(meal => meal.mealType === mealType)
    
    const response: ApiResponse<Meal[]> = {
      success: true,
      data: filteredMeals,
      message: `Meals for type '${mealType}' retrieved successfully`
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve meals by type'
    }
    res.status(500).json(response)
  }
})

// GET /api/meals/ingredients/:ingredient - Search meals by ingredient
router.get('/ingredients/:ingredient', (req, res) => {
  try {
    const ingredient = req.params.ingredient.toLowerCase()
    const filteredMeals = getAllMeals().filter(meal => 
      meal.ingredients.some(ing => ing.toLowerCase().includes(ingredient))
    )
    
    const response: ApiResponse<Meal[]> = {
      success: true,
      data: filteredMeals,
      message: `Meals containing '${ingredient}' retrieved successfully`
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to search meals by ingredient'
    }
    res.status(500).json(response)
  }
})

// PUT /api/meals/:id/archive - Archive/unarchive meal
router.put('/:id/archive', (req, res) => {
  try {
    const id = req.params.id
    const customMealIndex = customMeals.findIndex(meal => meal.id === id)
    
    if (customMealIndex === -1) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Meal not found or cannot archive hardcoded meals'
      }
      return res.status(404).json(response)
    }

    customMeals[customMealIndex].isArchived = !customMeals[customMealIndex].isArchived
    saveCustomMeals()
    
    const response: ApiResponse<Meal> = {
      success: true,
      data: customMeals[customMealIndex],
      message: `Meal ${customMeals[customMealIndex].isArchived ? 'archived' : 'unarchived'} successfully`
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to archive/unarchive meal'
    }
    res.status(500).json(response)
  }
})

export default router
