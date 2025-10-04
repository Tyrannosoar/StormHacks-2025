"use client"

import React, { useState } from "react"
import { AddItemModal } from "@/components/add-item-modal"
import { AddShoppingItemModal } from "@/components/add-shopping-item-modal"
import { AddEventModal } from "@/components/add-event-modal"

interface FloatingActionButtonProps {
  currentPage: string
}

export function FloatingActionButton({ currentPage }: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const getModalForPage = () => {
    switch (currentPage) {
      case "storage":
        return (
          <AddItemModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={() => setShowAddModal(false)}
            categories={["Dairy", "Fruits", "Vegetables", "Meat", "Beverages", "Grains", "Pantry", "Other"]}
          />
        )
      case "shopping":
        return (
          <AddShoppingItemModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={() => setShowAddModal(false)}
          />
        )
      case "calendar":
        return (
          <AddEventModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={() => setShowAddModal(false)}
          />
        )
      default:
        return null
    }
  }

  const handleMainButtonClick = () => {
    if (isExpanded) {
      setIsExpanded(false)
    } else {
      setShowAddModal(true)
    }
  }

  return (
    <>
      <div className="fixed bottom-24 right-4 z-50">
        <div className="flex flex-col items-end space-y-3">
          {/* Main FAB */}
          <button
            onClick={handleMainButtonClick}
            className="w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
            </div>
          </button>
        </div>
      </div>

      {getModalForPage()}
    </>
  )
}
