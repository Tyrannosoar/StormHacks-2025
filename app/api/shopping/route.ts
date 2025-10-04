import { NextRequest, NextResponse } from 'next/server';
import { getShoppingItems } from '@/lib/mockData';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: getShoppingItems(),
      message: 'Shopping items retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve shopping items'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const currentItems = getShoppingItems();
    const newItem = {
      id: Math.max(...currentItems.map(item => item.id)) + 1,
      ...body,
      isCompleted: false
    };
    
    currentItems.push(newItem);
    
    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'Shopping item added successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to add shopping item'
    }, { status: 500 });
  }
}
