import { Router } from 'express'
import { calendarEvents } from '../data/hardcodedData'
import { ApiResponse, CalendarEvent } from '../types'

const router = Router()

// GET /api/calendar - Get all calendar events
router.get('/', (req, res) => {
  try {
    const response: ApiResponse<CalendarEvent[]> = {
      success: true,
      data: calendarEvents,
      message: 'Calendar events retrieved successfully'
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve calendar events'
    }
    res.status(500).json(response)
  }
})

// GET /api/calendar/:id - Get specific calendar event
router.get('/:id', (req, res) => {
  try {
    const id = req.params.id
    const event = calendarEvents.find(event => event.id === id)
    
    if (!event) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Calendar event not found'
      }
      return res.status(404).json(response)
    }

    const response: ApiResponse<CalendarEvent> = {
      success: true,
      data: event,
      message: 'Calendar event retrieved successfully'
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve calendar event'
    }
    res.status(500).json(response)
  }
})

// POST /api/calendar - Add new calendar event
router.post('/', (req, res) => {
  try {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      ...req.body
    }
    
    calendarEvents.push(newEvent)
    
    const response: ApiResponse<CalendarEvent> = {
      success: true,
      data: newEvent,
      message: 'Calendar event added successfully'
    }
    res.status(201).json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to add calendar event'
    }
    res.status(500).json(response)
  }
})

// PUT /api/calendar/:id - Update calendar event
router.put('/:id', (req, res) => {
  try {
    const id = req.params.id
    const eventIndex = calendarEvents.findIndex(event => event.id === id)
    
    if (eventIndex === -1) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Calendar event not found'
      }
      return res.status(404).json(response)
    }

    calendarEvents[eventIndex] = { ...calendarEvents[eventIndex], ...req.body }
    
    const response: ApiResponse<CalendarEvent> = {
      success: true,
      data: calendarEvents[eventIndex],
      message: 'Calendar event updated successfully'
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update calendar event'
    }
    res.status(500).json(response)
  }
})

// DELETE /api/calendar/:id - Delete calendar event
router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id
    const eventIndex = calendarEvents.findIndex(event => event.id === id)
    
    if (eventIndex === -1) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Calendar event not found'
      }
      return res.status(404).json(response)
    }

    const deletedEvent = calendarEvents.splice(eventIndex, 1)[0]
    
    const response: ApiResponse<CalendarEvent> = {
      success: true,
      data: deletedEvent,
      message: 'Calendar event deleted successfully'
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete calendar event'
    }
    res.status(500).json(response)
  }
})

// GET /api/calendar/date/:date - Get events for specific date
router.get('/date/:date', (req, res) => {
  try {
    const date = req.params.date // Format: YYYY-MM-DD
    const events = calendarEvents.filter(event => event.date === date)
    
    const response: ApiResponse<CalendarEvent[]> = {
      success: true,
      data: events,
      message: `Calendar events for ${date} retrieved successfully`
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve calendar events for date'
    }
    res.status(500).json(response)
  }
})

// GET /api/calendar/type/:type - Get events by type
router.get('/type/:type', (req, res) => {
  try {
    const type = req.params.type as 'meal' | 'shopping' | 'custom'
    const events = calendarEvents.filter(event => event.type === type)
    
    const response: ApiResponse<CalendarEvent[]> = {
      success: true,
      data: events,
      message: `Calendar events of type '${type}' retrieved successfully`
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve calendar events by type'
    }
    res.status(500).json(response)
  }
})

// GET /api/calendar/range/:startDate/:endDate - Get events in date range
router.get('/range/:startDate/:endDate', (req, res) => {
  try {
    const startDate = req.params.startDate
    const endDate = req.params.endDate
    const events = calendarEvents.filter(event => 
      event.date >= startDate && event.date <= endDate
    )
    
    const response: ApiResponse<CalendarEvent[]> = {
      success: true,
      data: events,
      message: `Calendar events from ${startDate} to ${endDate} retrieved successfully`
    }
    res.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve calendar events in date range'
    }
    res.status(500).json(response)
  }
})

export default router
