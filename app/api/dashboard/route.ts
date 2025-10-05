import { NextRequest, NextResponse } from 'next/server';
import { getShoppingItems, getStorageItems } from '@/lib/mockData';

export async function GET() {
  try {
    // Get planned meals (mock data)
    const plannedMeals = [
      { id: 1, name: "Spaghetti Carbonara", date: "Today", time: "7:00 PM" },
      { id: 2, name: "Chicken Stir Fry", date: "Tomorrow", time: "6:30 PM" },
      { id: 3, name: "Greek Salad", date: "Wednesday", time: "12:30 PM" },
    ];

    // Get urgent shopping items (high priority)
    const urgentShoppingItems = getShoppingItems()
      .filter(item => item.priority === "high")
      .map(item => ({ id: item.id, name: item.name, priority: item.priority }));

    // Get expiring items (items with expiryDays <= 3)
    const expiringItems = getStorageItems()
      .filter(item => item.expiryDays <= 3)
      .map(item => ({ id: item.id, name: item.name, daysLeft: item.expiryDays, category: item.category }));

    return NextResponse.json({
      success: true,
      data: {
        plannedMeals,
        urgentShoppingItems,
        expiringItems
      },
      message: 'Dashboard data retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve dashboard data'
    }, { status: 500 });
  }
}
