import { NextRequest, NextResponse } from 'next/server';
import { getShoppingItems, getStorageItems, updateShoppingItems, updateStorageItems } from '@/lib/mockData';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    console.log('🔄 Toggling item completion for ID:', id);
    
    const shoppingItems = getShoppingItems();
    const itemIndex = shoppingItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      console.log('❌ Item not found:', id);
      return NextResponse.json({
        success: false,
        error: 'Shopping item not found'
      }, { status: 404 });
    }

    const wasCompleted = shoppingItems[itemIndex].isCompleted;
    console.log('📝 Item was completed:', wasCompleted);
    
    shoppingItems[itemIndex].isCompleted = !shoppingItems[itemIndex].isCompleted;
    console.log('✅ Item is now completed:', shoppingItems[itemIndex].isCompleted);
    
    // Update the shopping items array
    updateShoppingItems(shoppingItems);
    
    // If item is being marked as completed, add it to storage
    if (!wasCompleted && shoppingItems[itemIndex].isCompleted) {
      console.log('📦 Adding completed item to storage:', shoppingItems[itemIndex].name);
      const storageItems = getStorageItems();
      const newStorageItem = {
        id: Math.max(...storageItems.map(item => item.id)) + 1,
        name: shoppingItems[itemIndex].name,
        amount: shoppingItems[itemIndex].amount,
        expiryDays: 7, // Default 7 days expiry
        plannedAmount: shoppingItems[itemIndex].plannedAmount,
        category: shoppingItems[itemIndex].category
      };
      storageItems.push(newStorageItem);
      updateStorageItems(storageItems);
      console.log('✅ Item added to storage. Total storage items:', storageItems.length);
    }
    
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
