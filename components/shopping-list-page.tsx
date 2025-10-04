"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Milk, Apple, Beef, Coffee, Wheat, Package2, Droplets, Trash2 } from "lucide-react"
import { AddShoppingItemModal } from "@/components/add-shopping-item-modal"
import { EditShoppingItemModal } from "@/components/edit-shopping-item-modal"
import { shoppingApi } from "@/lib/api"
import { ShoppingItem } from "@/lib/types"

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
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null)
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [completedItems, setCompletedItems] = useState<ShoppingItem[]>([])
  const [swipeStates, setSwipeStates] = useState<Record<number, { isSwipedLeft: boolean; touchStartX: number | null }>>(
    {},
  )

  // Load shopping items from API
  useEffect(() => {
    const loadShoppingItems = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('🛒 Loading shopping items...')
        const response = await shoppingApi.getAll()
        console.log('🛒 API Response:', response)
        
        if (response.success && response.data) {
          setShoppingItems(response.data)
          console.log('🛒 Shopping items loaded successfully:', response.data.length, 'items')
        } else {
          setError('Invalid response from server')
          console.error('🛒 Invalid response:', response)
        }
      } catch (err) {
        setError('Failed to load shopping items')
        console.error('🛒 Error loading shopping items:', err)
      } finally {
        setLoading(false)
      }
    }

    loadShoppingItems()
  }, [])

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

  const handleItemCheck = async (itemId: number) => {
    const item = shoppingItems.find((item) => item.id === itemId)
    if (!item) return

    try {
      // Update the item completion status via API
      const response = await shoppingApi.toggle(itemId)
      if (response.success && response.data) {
        // Update local state with the response from API
        setShoppingItems((prev) => prev.map((item) => 
          item.id === itemId ? response.data! : item
        ))
        
        // If item is now completed, add to completed items and show success message
        if (response.data.isCompleted) {
          setCompletedItems((prev) => [...prev, response.data!])
          console.log('✅ Item completed and added to storage:', response.data.name)
          // Show success message
          alert(`✅ ${response.data.name} completed and added to storage!`)
          setTimeout(() => {
            setShoppingItems((prev) => prev.filter((item) => item.id !== itemId))
          }, 500)
        }
      }
    } catch (err) {
      console.error('Error updating item:', err)
      setError('Failed to update item')
    }
  }

  const handleItemClick = (item: ShoppingItem) => {
    setEditingItem(item)
    setShowEditModal(true)
  }

  const handleEditSave = (updatedItem: ShoppingItem) => {
    setShoppingItems((prev) => prev.map((item) => 
      item.id === updatedItem.id ? updatedItem : item
    ))
    setShowEditModal(false)
    setEditingItem(null)
  }

  const handleEditDelete = (itemId: number) => {
    setShoppingItems((prev) => prev.filter((item) => item.id !== itemId))
    setShowEditModal(false)
    setEditingItem(null)
  }

  const addNewItem = async (newItem: Omit<ShoppingItem, "id" | "isCompleted">) => {
    try {
      const response = await shoppingApi.create(newItem)
      if (response.success && response.data) {
        setShoppingItems((prev) => [...prev, response.data!])
      }
    } catch (err) {
      console.error('Error adding item:', err)
      setError('Failed to add item')
    }
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

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md border-b border-gray-300/20">
          <h2 className="text-xl font-semibold text-foreground">Shopping List</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading shopping items...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md border-b border-gray-300/20">
          <h2 className="text-xl font-semibold text-foreground">Shopping List</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Shopping List</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{activeItems.length} items</span>
          <Button
            onClick={() => setShowAddModal(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </Button>
        </div>
      </div>

      {categories.map((category) => {
        const categoryItems = activeItems.filter((item) => item.category === category)
        const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Package2

        return (
          <Card key={category} className="bg-white/5 backdrop-blur-md border-gray-300/20 shadow-lg">
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
                        className={`grid grid-cols-12 gap-2 items-center py-2 hover:bg-secondary/50 rounded-lg px-2 -mx-2 transition-all duration-500 bg-card relative cursor-pointer ${
                          item.isCompleted ? "opacity-0 transform translate-x-full" : "opacity-100"
                        } ${swipeState.isSwipedLeft ? "transform -translate-x-20" : "transform translate-x-0"}`}
                        onTouchStart={(e) => handleTouchStart(item.id, e)}
                        onTouchMove={(e) => handleTouchMove(item.id, e)}
                        onTouchEnd={() => handleTouchEnd(item.id)}
                        onClick={(e) => {
                          if (swipeState.isSwipedLeft) {
                            resetSwipe(item.id)
                          } else {
                            // Only open edit modal if not swiping and not clicking checkbox
                            if (!(e.target as HTMLElement).closest('input[type="checkbox"]')) {
                              handleItemClick(item)
                            }
                          }
                        }}
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
        <Card className="bg-white/5 backdrop-blur-md border-gray-300/20 shadow-lg">
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

      <EditShoppingItemModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        item={editingItem}
        onSave={handleEditSave}
        onDelete={handleEditDelete}
      />
    </div>
  )
}
