"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (item: {
    name: string
    amount: string
    expiryDays: number
    plannedAmount: string
    category: string
  }) => void
  categories: string[]
}

export function AddItemModal({ isOpen, onClose, onAdd, categories }: AddItemModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    expiryDays: "",
    plannedAmount: "",
    category: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.amount || !formData.expiryDays || !formData.category) {
      return
    }

    onAdd({
      name: formData.name,
      amount: formData.amount,
      expiryDays: Number.parseInt(formData.expiryDays),
      plannedAmount: formData.plannedAmount || "0",
      category: formData.category,
    })

    // Reset form
    setFormData({
      name: "",
      amount: "",
      expiryDays: "",
      plannedAmount: "",
      category: "",
    })
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/5 backdrop-blur-md border-gray-300/20 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Add New Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-card-foreground">
              Item Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Organic Milk"
              className="bg-input border-border text-foreground"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-card-foreground">
                Amount
              </Label>
              <Input
                id="amount"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="e.g., 1L, 500g, 6 pcs"
                className="bg-input border-border text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDays" className="text-card-foreground">
                Days Until Expiry
              </Label>
              <Input
                id="expiryDays"
                type="number"
                value={formData.expiryDays}
                onChange={(e) => handleInputChange("expiryDays", e.target.value)}
                placeholder="e.g., 7"
                className="bg-input border-border text-foreground"
                required
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-card-foreground">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {categories && categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-popover-foreground">
                    {category}
                  </SelectItem>
                ))}
                <SelectItem value="Other" className="text-popover-foreground">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plannedAmount" className="text-card-foreground">
              Planned Usage (Optional)
            </Label>
            <Input
              id="plannedAmount"
              value={formData.plannedAmount}
              onChange={(e) => handleInputChange("plannedAmount", e.target.value)}
              placeholder="e.g., 250ml, 100g"
              className="bg-input border-border text-foreground"
            />
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
