import { NextRequest, NextResponse } from 'next/server';
import { getShoppingItems, updateShoppingItems } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const shoppingItems = getShoppingItems();
    const item = shoppingItems.find(item => item.id === id);
    
    if (!item) {
      return NextResponse.json({
        success: false,
        error: 'Shopping item not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: item,
      message: 'Shopping item retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve shopping item'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const shoppingItems = getShoppingItems();
    const itemIndex = shoppingItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Shopping item not found'
      }, { status: 404 });
    }

    const body = await request.json();
    shoppingItems[itemIndex] = { ...shoppingItems[itemIndex], ...body };
    updateShoppingItems(shoppingItems);
    
    return NextResponse.json({
      success: true,
      data: shoppingItems[itemIndex],
      message: 'Shopping item updated successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to update shopping item'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const shoppingItems = getShoppingItems();
    const itemIndex = shoppingItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Shopping item not found'
      }, { status: 404 });
    }

    const deletedItem = shoppingItems.splice(itemIndex, 1)[0];
    updateShoppingItems(shoppingItems);
    
    return NextResponse.json({
      success: true,
      data: deletedItem,
      message: 'Shopping item deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to delete shopping item'
    }, { status: 500 });
  }
}
