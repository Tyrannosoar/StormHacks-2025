import { NextRequest, NextResponse } from 'next/server';
import { getStorageItems } from '@/lib/mockData';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: getStorageItems(),
      message: 'Storage items retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve storage items'
    }, { status: 500 });
  }
}
