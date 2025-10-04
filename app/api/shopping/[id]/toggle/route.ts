import { NextRequest, NextResponse } from 'next/server';
import { shoppingItems } from '@/lib/mockData';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const itemIndex = shoppingItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Shopping item not found'
      }, { status: 404 });
    }

    shoppingItems[itemIndex].isCompleted = !shoppingItems[itemIndex].isCompleted;
    
    return NextResponse.json({
      success: true,
      data: shoppingItems[itemIndex],
      message: `Shopping item ${shoppingItems[itemIndex].isCompleted ? 'completed' : 'uncompleted'} successfully`
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to toggle shopping item completion'
    }, { status: 500 });
  }
}
