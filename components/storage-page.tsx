"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Package2, Milk, Apple, Beef, Coffee, Wheat, Droplets, Trash2 } from "lucide-react"
import { AddItemModal } from "@/components/add-item-modal"

interface StorageItem {
  id: number
  name: string
  amount: string
  expiryDays: number
  plannedAmount: string
  category: string
}

const categoryIcons = {
  Dairy: Milk,
  Fruits: Apple,
  Vegetables: Apple,
  Meat: Beef,
  Beverages: Coffee,
  Grains: Wheat,
  Pantry: Package2,
  Other: Droplets,
}

export function StoragePage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [storageItems, setStorageItems] = useState<StorageItem[]>([
    // Dairy
    { id: 1, name: "Whole Milk", amount: "1L", expiryDays: 3, plannedAmount: "500ml", category: "Dairy" },
    { id: 2, name: "Greek Yogurt", amount: "500g", expiryDays: 1, plannedAmount: "200g", category: "Dairy" },
    { id: 3, name: "Cheddar Cheese", amount: "200g", expiryDays: 7, plannedAmount: "100g", category: "Dairy" },

    // Vegetables
    { id: 4, name: "Spinach", amount: "150g", expiryDays: 2, plannedAmount: "100g", category: "Vegetables" },
    { id: 5, name: "Tomatoes", amount: "6 pcs", expiryDays: 5, plannedAmount: "3 pcs", category: "Vegetables" },
    { id: 6, name: "Bell Peppers", amount: "3 pcs", expiryDays: 8, plannedAmount: "1 pc", category: "Vegetables" },

    // Meat
    { id: 7, name: "Chicken Breast", amount: "800g", expiryDays: 3, plannedAmount: "400g", category: "Meat" },
    { id: 8, name: "Ground Beef", amount: "500g", expiryDays: 2, plannedAmount: "300g", category: "Meat" },

    // Fruits
    { id: 9, name: "Bananas", amount: "6 pcs", expiryDays: 4, plannedAmount: "2 pcs", category: "Fruits" },
    { id: 10, name: "Strawberries", amount: "250g", expiryDays: 3, plannedAmount: "150g", category: "Fruits" },

    // Pantry
    { id: 11, name: "Pasta", amount: "500g", expiryDays: 365, plannedAmount: "200g", category: "Pantry" },
    { id: 12, name: "Rice", amount: "1kg", expiryDays: 180, plannedAmount: "300g", category: "Pantry" },

    // Beverages
    { id: 13, name: "Orange Juice", amount: "1L", expiryDays: 6, plannedAmount: "250ml", category: "Beverages" },
  ])

  const [swipeStates, setSwipeStates] = useState<Record<number, { isSwipedLeft: boolean; touchStartX: number | null }>>(
    {},
  )

  const categories = Array.from(new Set(storageItems.map((item) => item.category)))

  const getExpiryColor = (daysLeft: number) => {
    if (daysLeft <= 1) return "bg-destructive text-destructive-foreground"
    if (daysLeft <= 3) return "bg-accent text-accent-foreground"
    if (daysLeft <= 7) return "bg-primary text-primary-foreground"
    return "bg-secondary text-secondary-foreground"
  }

  const getExpiryText = (daysLeft: number) => {
    if (daysLeft <= 0) return "Expired"
    if (daysLeft === 1) return "1 day"
    if (daysLeft <= 7) return `${daysLeft} days`
    if (daysLeft <= 30) return `${Math.ceil(daysLeft / 7)} weeks`
    return `${Math.ceil(daysLeft / 30)} months`
  }

  const addNewItem = (newItem: Omit<StorageItem, "id">) => {
    const id = Math.max(...storageItems.map((item) => item.id)) + 1
    setStorageItems([...storageItems, { ...newItem, id }])
  }

  const handleTouchStart = (itemId: number, e: React.TouchEvent) => {
    setSwipeStates((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], touchStartX: e.touches[0].clientX },
    }))
  }

  const handleTouchMove = (itemId: number, e: React.TouchEvent) => {
    const state = swipeStates[itemId]
    if (!state?.touchStartX) return

    const currentX = e.touches[0].clientX
    const diffX = state.touchStartX - currentX
    const shouldSwipeLeft = diffX > 50

    setSwipeStates((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], isSwipedLeft: shouldSwipeLeft },
    }))
  }

  const handleTouchEnd = (itemId: number) => {
    setSwipeStates((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], touchStartX: null },
    }))
  }

  const deleteItem = (itemId: number) => {
    setStorageItems((prev) => prev.filter((item) => item.id !== itemId))
    setSwipeStates((prev) => {
      const newState = { ...prev }
      delete newState[itemId]
      return newState
    })
  }

  const resetSwipe = (itemId: number) => {
    setSwipeStates((prev) => ({
      ...prev,
      [itemId]: { isSwipedLeft: false, touchStartX: null },
    }))
  }

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Storage Overview</h2>
        <span className="text-sm text-muted-foreground">{storageItems.length} items</span>
      </div>

      {categories.map((category) => {
        const categoryItems = storageItems.filter((item) => item.category === category)
        const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Package2

        return (
          <Card key={category} className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <IconComponent className="w-5 h-5 text-primary" />
                {category}
                <Badge variant="secondary" className="ml-auto">
                  {categoryItems.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground border-b border-border pb-2">
                  <div className="col-span-4">Item</div>
                  <div className="col-span-2 text-center">Amount</div>
                  <div className="col-span-3 text-center">Expires</div>
                  <div className="col-span-3 text-center">Planned</div>
                </div>

                {categoryItems.map((item) => {
                  const swipeState = swipeStates[item.id] || { isSwipedLeft: false, touchStartX: null }

                  return (
                    <div key={item.id} className="relative overflow-hidden rounded-lg">
                      <div className="absolute inset-y-0 right-0 flex items-center justify-center w-20 bg-destructive">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                          className="text-destructive-foreground hover:bg-destructive-foreground/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div
                        className={`grid grid-cols-12 gap-2 items-center py-2 hover:bg-secondary/50 rounded-lg px-2 -mx-2 transition-all duration-200 bg-card relative ${
                          swipeState.isSwipedLeft ? "transform -translate-x-20" : "transform translate-x-0"
                        }`}
                        onTouchStart={(e) => handleTouchStart(item.id, e)}
                        onTouchMove={(e) => handleTouchMove(item.id, e)}
                        onTouchEnd={() => handleTouchEnd(item.id)}
                        onClick={() => swipeState.isSwipedLeft && resetSwipe(item.id)}
                      >
                        <div className="col-span-4">
                          <span className="text-sm font-medium text-card-foreground">{item.name}</span>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className="text-sm text-muted-foreground">{item.amount}</span>
                        </div>
                        <div className="col-span-3 text-center">
                          <Badge className={`text-xs ${getExpiryColor(item.expiryDays)}`}>
                            {getExpiryText(item.expiryDays)}
                          </Badge>
                        </div>
                        <div className="col-span-3 text-center">
                          <span className="text-xs text-muted-foreground">{item.plannedAmount}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}

      <div className="fixed bottom-24 right-4">
        <Button
          onClick={() => setShowAddModal(true)}
          size="lg"
          className="w-14 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addNewItem}
        categories={categories}
      />
    </div>
  )
}
