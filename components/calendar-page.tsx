"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ChevronLeft, ChevronRight, UtensilsCrossed, ShoppingCart, Calendar } from "lucide-react"
import { AddEventModal } from "@/components/add-event-modal"
import { EditEventModal } from "@/components/edit-event-modal"

interface CalendarEvent {
  id: string
  title: string
  type: "meal" | "shopping" | "custom"
  time: string
  date: string // Format: YYYY-MM-DD
}

export function CalendarPage() {
  const [currentWeek, setCurrentWeek] = useState(0) // 0 = current week, -1 = previous, 1 = next
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: "1", title: "Breakfast: Oatmeal", type: "meal", time: "08:00", date: "2025-01-20" },
    { id: "2", title: "Grocery Shopping", type: "shopping", time: "10:00", date: "2025-01-21" },
    { id: "3", title: "Lunch: Pasta", type: "meal", time: "12:30", date: "2025-01-21" },
    { id: "4", title: "Dinner: Salmon", type: "meal", time: "19:00", date: "2025-01-22" },
    { id: "5", title: "Weekly Shop", type: "shopping", time: "09:00", date: "2025-01-25" },
    { id: "6", title: "Meal Prep", type: "custom", time: "15:00", date: "2025-01-19" },
    { id: "7", title: "Dinner Party", type: "custom", time: "18:00", date: "2025-01-30" },
  ])

  const getWeekDates = (weekOffset: number) => {
    const today = new Date()
    const currentDay = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - currentDay + 1 + weekOffset * 7)

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      weekDates.push(date)
    }
    return weekDates
  }

  const weekDates = getWeekDates(currentWeek)
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Handle swipe navigation for weeks
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      setCurrentWeek((prev) => prev + 1)
    }
    if (isRightSwipe) {
      setCurrentWeek((prev) => prev - 1)
    }
  }

  const getEventColor = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "meal":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "shopping":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "custom":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getEventIcon = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "meal":
        return <UtensilsCrossed className="w-3 h-3" />
      case "shopping":
        return <ShoppingCart className="w-3 h-3" />
      case "custom":
        return <Calendar className="w-3 h-3" />
    }
  }

  const getEventsForDay = (date: Date) => {
    const dateString = date.toISOString().split("T")[0] // Format: YYYY-MM-DD
    return events.filter((event) => event.date === dateString)
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEditModal(true)
  }

  const handleAddEvent = (newEvent: Omit<CalendarEvent, "id">) => {
    const event: CalendarEvent = {
      ...newEvent,
      id: Date.now().toString(),
    }
    setEvents((prev) => [...prev, event])
  }

  const handleUpdateEvent = (updatedEvent: CalendarEvent) => {
    setEvents((prev) => prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }

  const formatWeekRange = () => {
    const start = weekDates[0]
    const end = weekDates[6]
    const startMonth = start.toLocaleDateString("en", { month: "short" })
    const endMonth = end.toLocaleDateString("en", { month: "short" })

    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()}-${end.getDate()}`
    } else {
      return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Week Navigation Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => setCurrentWeek((prev) => prev - 1)} className="rounded-full">
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground">{formatWeekRange()}</h2>
          <p className="text-sm text-muted-foreground">
            {currentWeek === 0
              ? "This Week"
              : currentWeek > 0
                ? `${currentWeek} week${currentWeek > 1 ? "s" : ""} ahead`
                : `${Math.abs(currentWeek)} week${Math.abs(currentWeek) > 1 ? "s" : ""} ago`}
          </p>
        </div>

        <Button variant="ghost" size="icon" onClick={() => setCurrentWeek((prev) => prev + 1)} className="rounded-full">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-4 pb-20" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <Card className="p-4 bg-white/5 backdrop-blur-md border-gray-300/20 shadow-lg">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-xs font-medium text-muted-foreground mb-1">{day}</div>
                <div
                  className={`text-sm font-semibold p-2 rounded-lg ${
                    weekDates[index].toDateString() === new Date().toDateString()
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {weekDates[index].getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-7 gap-2 min-h-[300px]">
            {Array.from({ length: 7 }, (_, dayIndex) => (
              <div key={dayIndex} className="space-y-1">
                {getEventsForDay(weekDates[dayIndex]).map((event) => (
                  <div
                    key={event.id}
                    className={`p-2 rounded-lg border text-xs cursor-pointer hover:opacity-80 transition-opacity ${getEventColor(event.type)}`}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      {getEventIcon(event.type)}
                      <span className="font-medium">{event.time}</span>
                    </div>
                    <div className="text-xs leading-tight">{event.title}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>

        {/* Event Legend */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <UtensilsCrossed className="w-3 h-3 mr-1" />
            Meals
          </Badge>
          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <ShoppingCart className="w-3 h-3 mr-1" />
            Shopping
          </Badge>
          <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Calendar className="w-3 h-3 mr-1" />
            Custom
          </Badge>
        </div>
      </div>

      {/* Floating Add Button */}
      <Button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <AddEventModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAddEvent={handleAddEvent} />

      <EditEventModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedEvent(null)
        }}
        event={selectedEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  )
}
