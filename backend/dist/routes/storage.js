"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hardcodedData_1 = require("../data/hardcodedData");
const router = (0, express_1.Router)();
// GET /api/storage - Get all storage items
router.get('/', (req, res) => {
    try {
        const response = {
            success: true,
            data: hardcodedData_1.storageItems,
            message: 'Storage items retrieved successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve storage items'
        };
        res.status(500).json(response);
    }
});
// GET /api/storage/:id - Get specific storage item
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const item = hardcodedData_1.storageItems.find(item => item.id === id);
        if (!item) {
            const response = {
                success: false,
                error: 'Storage item not found'
            };
            return res.status(404).json(response);
        }
        const response = {
            success: true,
            data: item,
            message: 'Storage item retrieved successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve storage item'
        };
        res.status(500).json(response);
    }
});
// POST /api/storage - Add new storage item
router.post('/', (req, res) => {
    try {
        const newItem = {
            id: Math.max(...hardcodedData_1.storageItems.map(item => item.id)) + 1,
            ...req.body
        };
        hardcodedData_1.storageItems.push(newItem);
        const response = {
            success: true,
            data: newItem,
            message: 'Storage item added successfully'
        };
        res.status(201).json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to add storage item'
        };
        res.status(500).json(response);
    }
});
// PUT /api/storage/:id - Update storage item
router.put('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const itemIndex = hardcodedData_1.storageItems.findIndex(item => item.id === id);
        if (itemIndex === -1) {
            const response = {
                success: false,
                error: 'Storage item not found'
            };
            return res.status(404).json(response);
        }
        hardcodedData_1.storageItems[itemIndex] = { ...hardcodedData_1.storageItems[itemIndex], ...req.body };
        const response = {
            success: true,
            data: hardcodedData_1.storageItems[itemIndex],
            message: 'Storage item updated successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to update storage item'
        };
        res.status(500).json(response);
    }
});
// DELETE /api/storage/:id - Delete storage item
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const itemIndex = hardcodedData_1.storageItems.findIndex(item => item.id === id);
        if (itemIndex === -1) {
            const response = {
                success: false,
                error: 'Storage item not found'
            };
            return res.status(404).json(response);
        }
        const deletedItem = hardcodedData_1.storageItems.splice(itemIndex, 1)[0];
        const response = {
            success: true,
            data: deletedItem,
            message: 'Storage item deleted successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to delete storage item'
        };
        res.status(500).json(response);
    }
});
// GET /api/storage/category/:category - Get items by category
router.get('/category/:category', (req, res) => {
    try {
        const category = req.params.category;
        const items = hardcodedData_1.storageItems.filter(item => item.category.toLowerCase() === category.toLowerCase());
        const response = {
            success: true,
            data: items,
            message: `Storage items for category '${category}' retrieved successfully`
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve storage items by category'
        };
        res.status(500).json(response);
    }
});
// GET /api/storage/expiring - Get items expiring soon
router.get('/expiring/:days', (req, res) => {
    try {
        const days = parseInt(req.params.days);
        const items = hardcodedData_1.storageItems.filter(item => item.expiryDays <= days);
        const response = {
            success: true,
            data: items,
            message: `Storage items expiring within ${days} days retrieved successfully`
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve expiring storage items'
        };
        res.status(500).json(response);
    }
});
exports.default = router;
//# sourceMappingURL=storage.js.map