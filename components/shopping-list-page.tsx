"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Milk, Apple, Beef, Coffee, Wheat, Package2, Droplets, Trash2 } from "lucide-react"
import { AddShoppingItemModal } from "@/components/add-shopping-item-modal"

interface ShoppingItem {
  id: number
  name: string
  amount: string
  plannedAmount: string
  category: string
  priority: "high" | "medium" | "low"
  isCompleted: boolean
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

export function ShoppingListPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([
    // High Priority
    { id: 1, name: "Milk", amount: "1L", plannedAmount: "1L", category: "Dairy", priority: "high", isCompleted: false },
    {
      id: 2,
      name: "Bread",
      amount: "1 loaf",
      plannedAmount: "1 loaf",
      category: "Grains",
      priority: "high",
      isCompleted: false,
    },
    {
      id: 3,
      name: "Eggs",
      amount: "12 pcs",
      plannedAmount: "12 pcs",
      category: "Dairy",
      priority: "high",
      isCompleted: false,
    },

    // Medium Priority
    {
      id: 4,
      name: "Tomatoes",
      amount: "6 pcs",
      plannedAmount: "4 pcs",
      category: "Vegetables",
      priority: "medium",
      isCompleted: false,
    },
    {
      id: 5,
      name: "Chicken Breast",
      amount: "800g",
      plannedAmount: "600g",
      category: "Meat",
      priority: "medium",
      isCompleted: false,
    },
    {
      id: 6,
      name: "Greek Yogurt",
      amount: "500g",
      plannedAmount: "300g",
      category: "Dairy",
      priority: "medium",
      isCompleted: false,
    },

    // Low Priority
    {
      id: 7,
      name: "Olive Oil",
      amount: "500ml",
      plannedAmount: "250ml",
      category: "Pantry",
      priority: "low",
      isCompleted: false,
    },
    {
      id: 8,
      name: "Bananas",
      amount: "6 pcs",
      plannedAmount: "4 pcs",
      category: "Fruits",
      priority: "low",
      isCompleted: false,
    },
    {
      id: 9,
      name: "Rice",
      amount: "1kg",
      plannedAmount: "500g",
      category: "Grains",
      priority: "low",
      isCompleted: false,
    },
  ])

  const [completedItems, setCompletedItems] = useState<ShoppingItem[]>([])
  const [swipeStates, setSwipeStates] = useState<Record<number, { isSwipedLeft: boolean; touchStartX: number | null }>>(
    {},
  )

  const activeItems = shoppingItems.filter((item) => !item.isCompleted)
  const categories = Array.from(new Set(activeItems.map((item) => item.category)))

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-accent text-accent-foreground"
      case "low":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const handleItemCheck = (itemId: number) => {
    const item = shoppingItems.find((item) => item.id === itemId)
    if (!item) return

    setShoppingItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, isCompleted: true } : item)))
    setCompletedItems((prev) => [...prev, { ...item, isCompleted: true }])

    setTimeout(() => {
      setShoppingItems((prev) => prev.filter((item) => item.id !== itemId))
    }, 500)

    console.log(`Added ${item.name} to storage`)
  }

  const addNewItem = (newItem: Omit<ShoppingItem, "id" | "isCompleted">) => {
    const id = Math.max(...shoppingItems.map((item) => item.id), 0) + 1
    setShoppingItems([...shoppingItems, { ...newItem, id, isCompleted: false }])
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
    setShoppingItems((prev) => prev.filter((item) => item.id !== itemId))
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
        <h2 className="text-2xl font-bold text-foreground">Shopping List</h2>
        <span className="text-sm text-muted-foreground">{activeItems.length} items</span>
      </div>

      {categories.map((category) => {
        const categoryItems = activeItems.filter((item) => item.category === category)
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
                  <div className="col-span-1"></div>
                  <div className="col-span-5">Item</div>
                  <div className="col-span-2 text-center">Amount</div>
                  <div className="col-span-2 text-center">Priority</div>
                  <div className="col-span-2 text-center">Planned</div>
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
                        className={`grid grid-cols-12 gap-2 items-center py-2 hover:bg-secondary/50 rounded-lg px-2 -mx-2 transition-all duration-500 bg-card relative ${
                          item.isCompleted ? "opacity-0 transform translate-x-full" : "opacity-100"
                        } ${swipeState.isSwipedLeft ? "transform -translate-x-20" : "transform translate-x-0"}`}
                        onTouchStart={(e) => handleTouchStart(item.id, e)}
                        onTouchMove={(e) => handleTouchMove(item.id, e)}
                        onTouchEnd={() => handleTouchEnd(item.id)}
                        onClick={() => swipeState.isSwipedLeft && resetSwipe(item.id)}
                      >
                        <div className="col-span-1 flex justify-center">
                          <Checkbox
                            checked={item.isCompleted}
                            onCheckedChange={() => handleItemCheck(item.id)}
                            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </div>
                        <div className="col-span-5">
                          <span
                            className={`text-sm font-medium ${item.isCompleted ? "line-through text-muted-foreground" : "text-card-foreground"}`}
                          >
                            {item.name}
                          </span>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className="text-sm text-muted-foreground">{item.amount}</span>
                        </div>
                        <div className="col-span-2 text-center">
                          <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>{item.priority}</Badge>
                        </div>
                        <div className="col-span-2 text-center">
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

      {activeItems.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <Package2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">Shopping list is empty</h3>
            <p className="text-muted-foreground mb-4">Add items to your shopping list to get started</p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Add First Item
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="fixed bottom-24 right-4">
        <Button
          onClick={() => setShowAddModal(true)}
          size="lg"
          className="w-14 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <AddShoppingItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addNewItem}
        categories={categories}
      />
    </div>
  )
}
