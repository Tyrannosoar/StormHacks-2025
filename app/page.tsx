"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package, Camera, UtensilsCrossed } from "lucide-react"
import { StoragePage } from "@/components/storage-page"
import { ShoppingListPage } from "@/components/shopping-list-page"
import { CameraPage } from "@/components/camera-page"
import { MealsPage } from "@/components/meals-page"
import { FloatingActionButton } from "@/components/floating-action-button"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<
    "storage" | "shopping" | "camera" | "meals"
  >("shopping")
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Handle swipe navigation with enhanced feedback
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

    const pages = ["shopping", "storage", "meals", "camera"] as const
    const currentIndex = pages.indexOf(currentPage)

    if (isLeftSwipe && currentIndex < pages.length - 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage(pages[currentIndex + 1])
        setIsTransitioning(false)
      }, 150)
    }
    if (isRightSwipe && currentIndex > 0) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage(pages[currentIndex - 1])
        setIsTransitioning(false)
      }, 150)
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "meals":
        return <MealsPage />
      case "storage":
        return <StoragePage />
      case "shopping":
        return <ShoppingListPage />
      case "camera":
        return <CameraPage onClose={() => setCurrentPage("meals")} />
      default:
        return <MealsPage />
    }
  }

  const navigateToPage = (page: typeof currentPage) => {
    if (page !== currentPage) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage(page)
        setIsTransitioning(false)
      }, 150)
    }
  }

  return (
    <div
      className="min-h-screen bg-background"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Header with Logo and Page Indicators */}
      <header className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md border-b border-gray-300/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Quilar</h1>
        </div>

        {currentPage !== "camera" && (
          <div className="flex items-center gap-1">
            {["meals", "storage", "shopping"].map((page, index) => (
              <div
                key={page}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  currentPage === page ? "bg-primary w-6" : "bg-muted"
                }`}
              />
            ))}
          </div>
        )}

        <Button variant="outline" size="icon" onClick={() => navigateToPage("camera")} className="rounded-full">
          <Camera className="w-4 h-4" />
        </Button>
      </header>

      {/* Main Content with transition */}
      <main className={`flex-1 transition-opacity duration-150 ${isTransitioning ? "opacity-50" : "opacity-100"}`}>
        {renderCurrentPage()}
      </main>

      {/* Bottom Navigation */}
      {currentPage !== "camera" && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-gray-300/30 shadow-lg">
          <div className="flex items-center justify-around p-2">
            <Button
              variant={currentPage === "shopping" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigateToPage("shopping")}
              className="flex flex-col gap-1 h-auto py-2 transition-all duration-200"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-xs">Shopping</span>
            </Button>
            <Button
              variant={currentPage === "storage" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigateToPage("storage")}
              className="flex flex-col gap-1 h-auto py-2 transition-all duration-200"
            >
              <Package className="w-4 h-4" />
              <span className="text-xs">Storage</span>
            </Button>
            <Button
              variant={currentPage === "meals" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigateToPage("meals")}
              className="flex flex-col gap-1 h-auto py-2 transition-all duration-200"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span className="text-xs">Meals</span>
            </Button>
          </div>
        </nav>
      )}


      {/* Floating Action Button */}
      {currentPage !== "camera" && (
        <FloatingActionButton 
          currentPage={currentPage} 
          onNavigate={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  )
}
