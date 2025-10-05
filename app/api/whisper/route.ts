import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Received audio file:', file.size, 'bytes');

    // In production (Vercel), we can't use local Whisper
    // Return a fallback response that tells the client to use browser speech recognition
    return NextResponse.json({ 
      error: 'Local Whisper not available in production',
      fallback: true,
      message: 'Please use browser speech recognition instead'
    }, { status: 200 });

  } catch (error) {
    console.error('Whisper processing error:', error);
    
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error',
      fallback: true
    }, { status: 500 });
  }
}
