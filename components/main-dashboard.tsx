import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, AlertTriangle, ShoppingCart } from "lucide-react"
import { supabaseDashboardApi } from "@/lib/supabase-api"
import { useState, useEffect } from "react"
import { PlannedMeal, UrgentShoppingItem, ExpiringItem } from "@/lib/types"

export function MainDashboard() {
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([])
  const [urgentShoppingItems, setUrgentShoppingItems] = useState<UrgentShoppingItem[]>([])
  const [expiringItems, setExpiringItems] = useState<ExpiringItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        const response = await supabaseDashboardApi.getOverview() as any
        if (response.success && response.data) {
          setPlannedMeals(response.data.plannedMeals || [])
          setUrgentShoppingItems(response.data.urgentShoppingItems || [])
          setExpiringItems(response.data.expiringItems || [])
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

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

  const getExpiryColor = (daysLeft: number) => {
    if (daysLeft <= 1) return "bg-destructive text-destructive-foreground"
    if (daysLeft <= 3) return "bg-accent text-accent-foreground"
    return "bg-primary text-primary-foreground"
  }

  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Planned Meals Widget */}
      <Card className="bg-white/5 backdrop-blur-md border-gray-300/20 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Calendar className="w-5 h-5 text-primary" />
            Planned Meals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {plannedMeals.map((meal) => (
            <div key={meal.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div>
                <h3 className="font-medium text-secondary-foreground">{meal.name}</h3>
                <p className="text-sm text-muted-foreground">{meal.date}</p>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {meal.time}
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full mt-3 bg-transparent">
            Plan New Meal
          </Button>
        </CardContent>
      </Card>

      {/* Bottom Row - Two Widgets Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Urgent Shopping Items */}
        <Card className="bg-white/5 backdrop-blur-md border-gray-300/20 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-card-foreground text-base">
              <ShoppingCart className="w-4 h-4 text-primary" />
              Urgent Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {urgentShoppingItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">{item.name}</span>
                <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>{item.priority}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Expiring Items */}
        <Card className="bg-white/5 backdrop-blur-md border-gray-300/20 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-card-foreground text-base">
              <AlertTriangle className="w-4 h-4 text-accent" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {expiringItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-card-foreground">{item.name}</span>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
                <Badge className={`text-xs ${getExpiryColor(item.daysLeft)}`}>{item.daysLeft}d</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
