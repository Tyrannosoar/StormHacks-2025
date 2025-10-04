"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UtensilsCrossed, ShoppingCart, Calendar, Trash2 } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  type: "meal" | "shopping" | "custom"
  time: string
  date: string
}

interface EditEventModalProps {
  isOpen: boolean
  onClose: () => void
  event: CalendarEvent | null
  onUpdateEvent: (event: CalendarEvent) => void
  onDeleteEvent: (eventId: string) => void
}

export function EditEventModal({ isOpen, onClose, event, onUpdateEvent, onDeleteEvent }: EditEventModalProps) {
  const [eventTitle, setEventTitle] = useState("")
  const [eventType, setEventType] = useState<"meal" | "shopping" | "custom">("custom")
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [eventDuration, setEventDuration] = useState("60")

  useEffect(() => {
    if (event) {
      setEventTitle(event.title)
      setEventType(event.type)
      setEventDate(event.date)
      setEventTime(event.time)
      setEventDuration("60")
    }
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!event || !eventTitle || !eventDate || !eventTime) return

    onUpdateEvent({
      ...event,
      title: eventTitle,
      type: eventType,
      time: eventTime,
      date: eventDate,
    })

    onClose()
  }

  const handleDelete = () => {
    if (!event) return

    onDeleteEvent(event.id)
    onClose()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meal":
        return <UtensilsCrossed className="w-4 h-4" />
      case "shopping":
        return <ShoppingCart className="w-4 h-4" />
      case "custom":
        return <Calendar className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "meal":
        return "text-emerald-400"
      case "shopping":
        return "text-blue-400"
      case "custom":
        return "text-purple-400"
    }
  }

  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-foreground">Edit Event</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-foreground">
              Event Title
            </Label>
            <Input
              id="edit-title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Enter event title..."
              className="bg-background border-border text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Event Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "meal", label: "Meal", icon: "meal" },
                { value: "shopping", label: "Shopping", icon: "shopping" },
                { value: "custom", label: "Custom", icon: "custom" },
              ].map((type) => (
                <Button
                  key={type.value}
                  type="button"
                  variant={eventType === type.value ? "default" : "outline"}
                  onClick={() => setEventType(type.value as any)}
                  className={`flex flex-col gap-1 h-auto py-3 ${
                    eventType === type.value
                      ? `bg-primary text-primary-foreground`
                      : `border-border hover:bg-muted ${getTypeColor(type.value)}`
                  }`}
                >
                  {getTypeIcon(type.icon)}
                  <span className="text-xs">{type.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-date" className="text-foreground">
              Date
            </Label>
            <Input
              id="edit-date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="bg-background border-border text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Time</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="relative">
                  <select
                    value={eventTime.split(":")[0] || "12"}
                    onChange={(e) => {
                      const minutes = eventTime.split(":")[1] || "00"
                      setEventTime(`${e.target.value}:${minutes}`)
                    }}
                    className="w-full h-20 bg-background border border-border rounded-md text-foreground text-center overflow-y-auto scrollbar-thin scrollbar-thumb-muted"
                    size={3}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i.toString().padStart(2, "0")}>
                        {i.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="h-8 border-t border-b border-primary/30 bg-primary/5"></div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-1">Hour</p>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <select
                    value={eventTime.split(":")[1] || "00"}
                    onChange={(e) => {
                      const hours = eventTime.split(":")[0] || "12"
                      setEventTime(`${hours}:${e.target.value}`)
                    }}
                    className="w-full h-20 bg-background border border-border rounded-md text-foreground text-center overflow-y-auto scrollbar-thin scrollbar-thumb-muted"
                    size={3}
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i.toString().padStart(2, "0")}>
                        {i.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="h-8 border-t border-b border-primary/30 bg-primary/5"></div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-1">Min</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-duration" className="text-foreground">
              Duration (minutes)
            </Label>
            <Input
              id="edit-duration"
              type="number"
              value={eventDuration}
              onChange={(e) => setEventDuration(e.target.value)}
              min="15"
              max="480"
              step="15"
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Update Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
