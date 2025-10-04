"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package, Camera, Calendar, UtensilsCrossed } from "lucide-react"
import { MainDashboard } from "@/components/main-dashboard"
import { StoragePage } from "@/components/storage-page"
import { ShoppingListPage } from "@/components/shopping-list-page"
import { CameraPage } from "@/components/camera-page"
import { CalendarPage } from "@/components/calendar-page"
import { MealsPage } from "@/components/meals-page"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "storage" | "shopping" | "camera" | "calendar" | "meals"
  >("dashboard")
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

    const pages = ["dashboard", "meals", "storage", "shopping", "calendar", "camera"] as const
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
      case "dashboard":
        return <MainDashboard />
      case "meals":
        return <MealsPage />
      case "storage":
        return <StoragePage />
      case "shopping":
        return <ShoppingListPage />
      case "calendar":
        return <CalendarPage />
      case "camera":
        return <CameraPage onClose={() => setCurrentPage("dashboard")} />
      default:
        return <MainDashboard />
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
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Quilar</h1>
        </div>

        {currentPage !== "camera" && (
          <div className="flex items-center gap-1">
            {["dashboard", "meals", "storage", "shopping", "calendar"].map((page, index) => (
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
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
          <div className="flex items-center justify-around p-2">
            <Button
              variant={currentPage === "dashboard" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigateToPage("dashboard")}
              className="flex flex-col gap-1 h-auto py-2 transition-all duration-200"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-xs">Dashboard</span>
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
              variant={currentPage === "shopping" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigateToPage("shopping")}
              className="flex flex-col gap-1 h-auto py-2 transition-all duration-200"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-xs">Shopping</span>
            </Button>
            <Button
              variant={currentPage === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => navigateToPage("calendar")}
              className="flex flex-col gap-1 h-auto py-2 transition-all duration-200"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-xs">Calendar</span>
            </Button>
          </div>
        </nav>
      )}

      {currentPage === "dashboard" && (
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm animate-pulse">
          Swipe left/right to navigate
        </div>
      )}
    </div>
  )
}
