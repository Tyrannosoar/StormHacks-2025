"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hardcodedData_1 = require("../data/hardcodedData");
const router = (0, express_1.Router)();
// GET /api/calendar - Get all calendar events
router.get('/', (req, res) => {
    try {
        const response = {
            success: true,
            data: hardcodedData_1.calendarEvents,
            message: 'Calendar events retrieved successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve calendar events'
        };
        res.status(500).json(response);
    }
});
// GET /api/calendar/:id - Get specific calendar event
router.get('/:id', (req, res) => {
    try {
        const id = req.params.id;
        const event = hardcodedData_1.calendarEvents.find(event => event.id === id);
        if (!event) {
            const response = {
                success: false,
                error: 'Calendar event not found'
            };
            return res.status(404).json(response);
        }
        const response = {
            success: true,
            data: event,
            message: 'Calendar event retrieved successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve calendar event'
        };
        res.status(500).json(response);
    }
});
// POST /api/calendar - Add new calendar event
router.post('/', (req, res) => {
    try {
        const newEvent = {
            id: Date.now().toString(),
            ...req.body
        };
        hardcodedData_1.calendarEvents.push(newEvent);
        const response = {
            success: true,
            data: newEvent,
            message: 'Calendar event added successfully'
        };
        res.status(201).json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to add calendar event'
        };
        res.status(500).json(response);
    }
});
// PUT /api/calendar/:id - Update calendar event
router.put('/:id', (req, res) => {
    try {
        const id = req.params.id;
        const eventIndex = hardcodedData_1.calendarEvents.findIndex(event => event.id === id);
        if (eventIndex === -1) {
            const response = {
                success: false,
                error: 'Calendar event not found'
            };
            return res.status(404).json(response);
        }
        hardcodedData_1.calendarEvents[eventIndex] = { ...hardcodedData_1.calendarEvents[eventIndex], ...req.body };
        const response = {
            success: true,
            data: hardcodedData_1.calendarEvents[eventIndex],
            message: 'Calendar event updated successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to update calendar event'
        };
        res.status(500).json(response);
    }
});
// DELETE /api/calendar/:id - Delete calendar event
router.delete('/:id', (req, res) => {
    try {
        const id = req.params.id;
        const eventIndex = hardcodedData_1.calendarEvents.findIndex(event => event.id === id);
        if (eventIndex === -1) {
            const response = {
                success: false,
                error: 'Calendar event not found'
            };
            return res.status(404).json(response);
        }
        const deletedEvent = hardcodedData_1.calendarEvents.splice(eventIndex, 1)[0];
        const response = {
            success: true,
            data: deletedEvent,
            message: 'Calendar event deleted successfully'
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to delete calendar event'
        };
        res.status(500).json(response);
    }
});
// GET /api/calendar/date/:date - Get events for specific date
router.get('/date/:date', (req, res) => {
    try {
        const date = req.params.date; // Format: YYYY-MM-DD
        const events = hardcodedData_1.calendarEvents.filter(event => event.date === date);
        const response = {
            success: true,
            data: events,
            message: `Calendar events for ${date} retrieved successfully`
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve calendar events for date'
        };
        res.status(500).json(response);
    }
});
// GET /api/calendar/type/:type - Get events by type
router.get('/type/:type', (req, res) => {
    try {
        const type = req.params.type;
        const events = hardcodedData_1.calendarEvents.filter(event => event.type === type);
        const response = {
            success: true,
            data: events,
            message: `Calendar events of type '${type}' retrieved successfully`
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve calendar events by type'
        };
        res.status(500).json(response);
    }
});
// GET /api/calendar/range/:startDate/:endDate - Get events in date range
router.get('/range/:startDate/:endDate', (req, res) => {
    try {
        const startDate = req.params.startDate;
        const endDate = req.params.endDate;
        const events = hardcodedData_1.calendarEvents.filter(event => event.date >= startDate && event.date <= endDate);
        const response = {
            success: true,
            data: events,
            message: `Calendar events from ${startDate} to ${endDate} retrieved successfully`
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to retrieve calendar events in date range'
        };
        res.status(500).json(response);
    }
});
exports.default = router;
//# sourceMappingURL=calendar.js.map