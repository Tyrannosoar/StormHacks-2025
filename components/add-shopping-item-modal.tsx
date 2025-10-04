"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddShoppingItemModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (item: {
    name: string
    amount: string
    plannedAmount: string
    category: string
    priority: "high" | "medium" | "low"
  }) => void
  categories: string[]
}

export function AddShoppingItemModal({ isOpen, onClose, onAdd, categories }: AddShoppingItemModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    plannedAmount: "",
    category: "",
    priority: "medium" as "high" | "medium" | "low",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.amount || !formData.category) {
      return
    }

    onAdd({
      name: formData.name,
      amount: formData.amount,
      plannedAmount: formData.plannedAmount || formData.amount,
      category: formData.category,
      priority: formData.priority,
    })

    // Reset form
    setFormData({
      name: "",
      amount: "",
      plannedAmount: "",
      category: "",
      priority: "medium",
    })
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const allCategories = Array.from(
    new Set([...categories, "Dairy", "Vegetables", "Fruits", "Meat", "Beverages", "Grains", "Pantry", "Other"])
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 shadow-xl text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-xl">Add Shopping Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Item Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Organic Milk"
              className="w-full bg-white text-gray-900 border-gray-300"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-700 font-medium">
                Amount
              </Label>
              <Input
                id="amount"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="e.g., 1L, 500g, 6 pcs"
                className="w-full bg-white text-gray-900 border-gray-300"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plannedAmount" className="text-gray-700 font-medium">
                Planned Usage
              </Label>
              <Input
                id="plannedAmount"
                value={formData.plannedAmount}
                onChange={(e) => handleInputChange("plannedAmount", e.target.value)}
                placeholder="e.g., 250ml, 100g"
                className="w-full bg-white text-gray-900 border-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-700 font-medium">
                Category
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="w-full bg-white text-gray-900 border-gray-300">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  {allCategories.map((category) => (
                    <SelectItem key={category} value={category} className="text-gray-900">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-gray-700 font-medium">
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "high" | "medium" | "low") => handleInputChange("priority", value)}
              >
                <SelectTrigger className="w-full bg-white text-gray-900 border-gray-300">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value="high" className="text-gray-900">
                    High
                  </SelectItem>
                  <SelectItem value="medium" className="text-gray-900">
                    Medium
                  </SelectItem>
                  <SelectItem value="low" className="text-gray-900">
                    Low
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Add Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
