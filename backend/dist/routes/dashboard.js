"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hardcodedData_1 = require("../data/hardcodedData");
const router = (0, express_1.Router)();
// GET /api/dashboard - Get dashboard overview data
router.get('/', (req, res) => {
    try {
        const dashboardData = {
            plannedMeals: hardcodedData_1.plannedMeals,
            urgentShoppingItems: hardcodedData_1.urgentShoppingItems,
            expiringItems: hardcodedData_1.expiringItems
        };
        const response = {
            success: true,
            data: dashboardData,
            message: 'Dashboard data retrieved successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve dashboard data'
        };
        res.status(500).json(response);
    }
});
// GET /api/dashboard/planned-meals - Get planned meals
router.get('/planned-meals', (req, res) => {
    try {
        const response = {
            success: true,
            data: hardcodedData_1.plannedMeals,
            message: 'Planned meals retrieved successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve planned meals'
        };
        res.status(500).json(response);
    }
});
// GET /api/dashboard/urgent-shopping - Get urgent shopping items
router.get('/urgent-shopping', (req, res) => {
    try {
        const response = {
            success: true,
            data: hardcodedData_1.urgentShoppingItems,
            message: 'Urgent shopping items retrieved successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve urgent shopping items'
        };
        res.status(500).json(response);
    }
});
// GET /api/dashboard/expiring-items - Get expiring items
router.get('/expiring-items', (req, res) => {
    try {
        const response = {
            success: true,
            data: hardcodedData_1.expiringItems,
            message: 'Expiring items retrieved successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve expiring items'
        };
        res.status(500).json(response);
    }
});
// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', (req, res) => {
    try {
        const stats = {
            totalPlannedMeals: hardcodedData_1.plannedMeals.length,
            urgentItemsCount: hardcodedData_1.urgentShoppingItems.filter(item => item.priority === 'high').length,
            expiringItemsCount: hardcodedData_1.expiringItems.filter(item => item.daysLeft <= 3).length,
            highPriorityShopping: hardcodedData_1.urgentShoppingItems.filter(item => item.priority === 'high').length,
            mediumPriorityShopping: hardcodedData_1.urgentShoppingItems.filter(item => item.priority === 'medium').length,
            lowPriorityShopping: hardcodedData_1.urgentShoppingItems.filter(item => item.priority === 'low').length,
            criticalExpiring: hardcodedData_1.expiringItems.filter(item => item.daysLeft <= 1).length,
            soonExpiring: hardcodedData_1.expiringItems.filter(item => item.daysLeft > 1 && item.daysLeft <= 3).length
        };
        const response = {
            success: true,
            data: stats,
            message: 'Dashboard statistics retrieved successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve dashboard statistics'
        };
        res.status(500).json(response);
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map