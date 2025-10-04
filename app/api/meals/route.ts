import { NextRequest, NextResponse } from 'next/server';
import { meals } from '@/lib/mockData';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: meals,
      message: 'Meals retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve meals'
    }, { status: 500 });
  }
}
