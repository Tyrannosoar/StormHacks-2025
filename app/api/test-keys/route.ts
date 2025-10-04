import { NextResponse } from 'next/server';

export async function GET() {
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasElevenLabs = !!process.env.ELEVENLABS_API_KEY;
  
  return NextResponse.json({
    openai: hasOpenAI,
    elevenlabs: hasElevenLabs,
    message: hasOpenAI && hasElevenLabs 
      ? 'All API keys are configured' 
      : 'Missing API keys - check your .env.local file'
  });
}
