"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hardcodedData_1 = require("../data/hardcodedData");
const router = (0, express_1.Router)();
// GET /api/meals - Get all meals
router.get('/', (req, res) => {
    try {
        const response = {
            success: true,
            data: hardcodedData_1.meals,
            message: 'Meals retrieved successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve meals'
        };
        res.status(500).json(response);
    }
});
// GET /api/meals/:id - Get specific meal
router.get('/:id', (req, res) => {
    try {
        const id = req.params.id;
        const meal = hardcodedData_1.meals.find(meal => meal.id === id);
        if (!meal) {
            const response = {
                success: false,
                error: 'Meal not found'
            };
            return res.status(404).json(response);
        }
        const response = {
            success: true,
            data: meal,
            message: 'Meal retrieved successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve meal'
        };
        res.status(500).json(response);
    }
});
// POST /api/meals - Add new meal
router.post('/', (req, res) => {
    try {
        const newMeal = {
            id: `meal-${Date.now()}`,
            ...req.body
        };
        hardcodedData_1.meals.push(newMeal);
        const response = {
            success: true,
            data: newMeal,
            message: 'Meal added successfully'
        };
        res.status(201).json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to add meal'
        };
        res.status(500).json(response);
    }
});
// PUT /api/meals/:id - Update meal
router.put('/:id', (req, res) => {
    try {
        const id = req.params.id;
        const mealIndex = hardcodedData_1.meals.findIndex(meal => meal.id === id);
        if (mealIndex === -1) {
            const response = {
                success: false,
                error: 'Meal not found'
            };
            return res.status(404).json(response);
        }
        hardcodedData_1.meals[mealIndex] = { ...hardcodedData_1.meals[mealIndex], ...req.body };
        const response = {
            success: true,
            data: hardcodedData_1.meals[mealIndex],
            message: 'Meal updated successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to update meal'
        };
        res.status(500).json(response);
    }
});
// DELETE /api/meals/:id - Delete meal
router.delete('/:id', (req, res) => {
    try {
        const id = req.params.id;
        const mealIndex = hardcodedData_1.meals.findIndex(meal => meal.id === id);
        if (mealIndex === -1) {
            const response = {
                success: false,
                error: 'Meal not found'
            };
            return res.status(404).json(response);
        }
        const deletedMeal = hardcodedData_1.meals.splice(mealIndex, 1)[0];
        const response = {
            success: true,
            data: deletedMeal,
            message: 'Meal deleted successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to delete meal'
        };
        res.status(500).json(response);
    }
});
// GET /api/meals/saved - Get saved meals only
router.get('/saved/meals', (req, res) => {
    try {
        const savedMeals = hardcodedData_1.meals.filter(meal => meal.id.startsWith('saved-') || meal.isArchived === false);
        const response = {
            success: true,
            data: savedMeals,
            message: 'Saved meals retrieved successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve saved meals'
        };
        res.status(500).json(response);
    }
});
// GET /api/meals/explore - Get explore meals only
router.get('/explore/meals', (req, res) => {
    try {
        const exploreMeals = hardcodedData_1.meals.filter(meal => meal.id.startsWith('explore-'));
        const response = {
            success: true,
            data: exploreMeals,
            message: 'Explore meals retrieved successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve explore meals'
        };
        res.status(500).json(response);
    }
});
// GET /api/meals/type/:mealType - Get meals by type
router.get('/type/:mealType', (req, res) => {
    try {
        const mealType = req.params.mealType;
        const filteredMeals = hardcodedData_1.meals.filter(meal => meal.mealType === mealType);
        const response = {
            success: true,
            data: filteredMeals,
            message: `Meals for type '${mealType}' retrieved successfully`
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve meals by type'
        };
        res.status(500).json(response);
    }
});
// GET /api/meals/ingredients/:ingredient - Search meals by ingredient
router.get('/ingredients/:ingredient', (req, res) => {
    try {
        const ingredient = req.params.ingredient.toLowerCase();
        const filteredMeals = hardcodedData_1.meals.filter(meal => meal.ingredients.some(ing => ing.toLowerCase().includes(ingredient)));
        const response = {
            success: true,
            data: filteredMeals,
            message: `Meals containing '${ingredient}' retrieved successfully`
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to search meals by ingredient'
        };
        res.status(500).json(response);
    }
});
// PUT /api/meals/:id/archive - Archive/unarchive meal
router.put('/:id/archive', (req, res) => {
    try {
        const id = req.params.id;
        const mealIndex = hardcodedData_1.meals.findIndex(meal => meal.id === id);
        if (mealIndex === -1) {
            const response = {
                success: false,
                error: 'Meal not found'
            };
            return res.status(404).json(response);
        }
        hardcodedData_1.meals[mealIndex].isArchived = !hardcodedData_1.meals[mealIndex].isArchived;
        const response = {
            success: true,
            data: hardcodedData_1.meals[mealIndex],
            message: `Meal ${hardcodedData_1.meals[mealIndex].isArchived ? 'archived' : 'unarchived'} successfully`
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to archive/unarchive meal'
        };
        res.status(500).json(response);
    }
});
exports.default = router;
//# sourceMappingURL=meals.js.map