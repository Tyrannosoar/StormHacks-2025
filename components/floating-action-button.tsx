"use client"

import React, { useState } from "react"
import { AddItemModal } from "@/components/add-item-modal"
import { AddShoppingItemModal } from "@/components/add-shopping-item-modal"
import { AddEventModal } from "@/components/add-event-modal"
import { VoiceMealAssistantModal } from "./voice-meal-assistant-modal"
import { VoiceNavigationModal } from "./voice-navigation-modal"

interface FloatingActionButtonProps {
  currentPage: string
  onNavigate?: (page: "shopping" | "storage" | "meals" | "camera") => void
}

export function FloatingActionButton({ currentPage, onNavigate }: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showVoiceNav, setShowVoiceNav] = useState(false)

  const getModalForPage = () => {
    if (!showAddModal) return null
    
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
            categories={["Dairy", "Fruits", "Vegetables", "Meat", "Beverages", "Grains", "Pantry", "Other"]}
          />
        )
      case "meals":
         return (
        <VoiceMealAssistantModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
        )
      case "calendar":
        return (
          <AddEventModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAddEvent={() => setShowAddModal(false)}
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
      // Show voice navigation for all pages
      setShowVoiceNav(true)
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
      
      {/* Voice Navigation Modal */}
      <VoiceNavigationModal
        isOpen={showVoiceNav}
        onClose={() => setShowVoiceNav(false)}
        onNavigate={(page) => {
          if (onNavigate) {
            onNavigate(page)
          }
          setShowVoiceNav(false)
        }}
        currentPage={currentPage}
      />
    </>
  )
}