"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UtensilsCrossed, ShoppingCart, Calendar, X } from "lucide-react"

interface AddEventModalProps {
  isOpen: boolean
  onClose: () => void
  onAddEvent: (event: { title: string; type: "meal" | "shopping" | "custom"; time: string; date: string }) => void
}

export function AddEventModal({ isOpen, onClose, onAddEvent }: AddEventModalProps) {
  const [eventTitle, setEventTitle] = useState("")
  const [eventType, setEventType] = useState<"meal" | "shopping" | "custom">("custom")
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!eventTitle || !eventDate || !eventTime) return

    onAddEvent({
      title: eventTitle,
      type: eventType,
      time: eventTime,
      date: eventDate,
    })

    // Reset form and close modal
    setEventTitle("")
    setEventType("custom")
    setEventDate("")
    setEventTime("")
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/5 backdrop-blur-md border-gray-300/20 shadow-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-foreground">Add New Event</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              Event Title
            </Label>
            <Input
              id="title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Enter event title..."
              className="bg-background border-border text-foreground"
              required
            />
          </div>

          {/* Event Type */}
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
            <Label htmlFor="date" className="text-foreground">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="bg-background border-border text-foreground"
              required
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-foreground">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="bg-background border-border text-foreground"
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Add Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
