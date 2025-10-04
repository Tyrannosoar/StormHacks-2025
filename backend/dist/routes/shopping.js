"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hardcodedData_1 = require("../data/hardcodedData");
const router = (0, express_1.Router)();
// GET /api/shopping - Get all shopping items
router.get('/', (req, res) => {
    try {
        const response = {
            success: true,
            data: hardcodedData_1.shoppingItems,
            message: 'Shopping items retrieved successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve shopping items'
        };
        res.status(500).json(response);
    }
});
// GET /api/shopping/:id - Get specific shopping item
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const item = hardcodedData_1.shoppingItems.find(item => item.id === id);
        if (!item) {
            const response = {
                success: false,
                error: 'Shopping item not found'
            };
            return res.status(404).json(response);
        }
        const response = {
            success: true,
            data: item,
            message: 'Shopping item retrieved successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve shopping item'
        };
        res.status(500).json(response);
    }
});
// POST /api/shopping - Add new shopping item
router.post('/', (req, res) => {
    try {
        const newItem = {
            id: Math.max(...hardcodedData_1.shoppingItems.map(item => item.id)) + 1,
            ...req.body
        };
        hardcodedData_1.shoppingItems.push(newItem);
        const response = {
            success: true,
            data: newItem,
            message: 'Shopping item added successfully'
        };
        res.status(201).json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to add shopping item'
        };
        res.status(500).json(response);
    }
});
// PUT /api/shopping/:id - Update shopping item
router.put('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const itemIndex = hardcodedData_1.shoppingItems.findIndex(item => item.id === id);
        if (itemIndex === -1) {
            const response = {
                success: false,
                error: 'Shopping item not found'
            };
            return res.status(404).json(response);
        }
        hardcodedData_1.shoppingItems[itemIndex] = { ...hardcodedData_1.shoppingItems[itemIndex], ...req.body };
        const response = {
            success: true,
            data: hardcodedData_1.shoppingItems[itemIndex],
            message: 'Shopping item updated successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to update shopping item'
        };
        res.status(500).json(response);
    }
});
// DELETE /api/shopping/:id - Delete shopping item
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const itemIndex = hardcodedData_1.shoppingItems.findIndex(item => item.id === id);
        if (itemIndex === -1) {
            const response = {
                success: false,
                error: 'Shopping item not found'
            };
            return res.status(404).json(response);
        }
        const deletedItem = hardcodedData_1.shoppingItems.splice(itemIndex, 1)[0];
        const response = {
            success: true,
            data: deletedItem,
            message: 'Shopping item deleted successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to delete shopping item'
        };
        res.status(500).json(response);
    }
});
// GET /api/shopping/priority/:priority - Get items by priority
router.get('/priority/:priority', (req, res) => {
    try {
        const priority = req.params.priority;
        const items = hardcodedData_1.shoppingItems.filter(item => item.priority === priority);
        const response = {
            success: true,
            data: items,
            message: `Shopping items with priority '${priority}' retrieved successfully`
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve shopping items by priority'
        };
        res.status(500).json(response);
    }
});
// GET /api/shopping/category/:category - Get items by category
router.get('/category/:category', (req, res) => {
    try {
        const category = req.params.category;
        const items = hardcodedData_1.shoppingItems.filter(item => item.category.toLowerCase() === category.toLowerCase());
        const response = {
            success: true,
            data: items,
            message: `Shopping items for category '${category}' retrieved successfully`
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve shopping items by category'
        };
        res.status(500).json(response);
    }
});
// PUT /api/shopping/:id/toggle - Toggle completion status
router.put('/:id/toggle', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const itemIndex = hardcodedData_1.shoppingItems.findIndex(item => item.id === id);
        if (itemIndex === -1) {
            const response = {
                success: false,
                error: 'Shopping item not found'
            };
            return res.status(404).json(response);
        }
        hardcodedData_1.shoppingItems[itemIndex].isCompleted = !hardcodedData_1.shoppingItems[itemIndex].isCompleted;
        const response = {
            success: true,
            data: hardcodedData_1.shoppingItems[itemIndex],
            message: `Shopping item ${hardcodedData_1.shoppingItems[itemIndex].isCompleted ? 'completed' : 'uncompleted'} successfully`
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to toggle shopping item completion'
        };
        res.status(500).json(response);
    }
});
// GET /api/shopping/completed - Get completed items
router.get('/completed/items', (req, res) => {
    try {
        const completedItems = hardcodedData_1.shoppingItems.filter(item => item.isCompleted);
        const response = {
            success: true,
            data: completedItems,
            message: 'Completed shopping items retrieved successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve completed shopping items'
        };
        res.status(500).json(response);
    }
});
exports.default = router;
//# sourceMappingURL=shopping.js.map