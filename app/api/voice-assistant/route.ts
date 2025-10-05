import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { transcript, sessionId, context, currentPage } = await request.json();
    
    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ error: 'Missing Google API key' }, { status: 500 });
    }

    const systemPrompt = `You are a helpful voice assistant for a grocery management app.

Session: ${sessionId || 'anonymous'}
Current page: ${currentPage || 'dashboard'}

Context (shopping and storage are arrays):
${typeof context === 'string' ? context : JSON.stringify(context || {}, null, 2)}

Respond concisely (<= 20 words). Prefer actionable responses. If navigation intent is detected, confirm the target page briefly.`;

    // Call Gemini API
    async function callGemini(model: string) {
      return fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] },
            contents: [
              { role: 'user', parts: [{ text: transcript }] },
              { role: 'user', parts: [{ text: `Context JSON: ${JSON.stringify(context || {})}` }] }
            ],
            generationConfig: { maxOutputTokens: 150, temperature: 0.7, topP: 0.9, topK: 40 }
          })
        }
      );
    }

    let geminiResponse = await callGemini('gemini-2.5-flash');
    let usedModel = 'gemini-2.5-flash';
    if (!geminiResponse.ok) {
      geminiResponse = await callGemini('gemini-1.5-pro');
      usedModel = 'gemini-1.5-pro';
    }

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', geminiResponse.status);
      return NextResponse.json({ 
        error: 'Gemini API error',
        fallback: true 
      }, { status: 500 });
    }

    const geminiData = await geminiResponse.json();
    const parts = geminiData?.candidates?.[0]?.content?.parts || [];
    const combined = Array.isArray(parts)
      ? parts.map((p: any) => (typeof p?.text === 'string' ? p.text : '')).filter(Boolean).join(' ').trim()
      : '';
    const responseText = (combined || "I understand. Let me help you with that.").trim();

    // Convert text to audio via ElevenLabs
    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB'}` , {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
      },
      body: JSON.stringify({
        text: responseText,
        model_id: 'eleven_monolingual_v1',
        voice_settings: { stability: 0.5, similarity_boost: 0.5 }
      })
    });

    if (!ttsResponse.ok) {
      const err = await ttsResponse.text();
      console.error('ElevenLabs API error:', err);
      return NextResponse.json({ error: 'Text-to-speech failed' }, { status: 500 });
    }

    const audioBuffer = await ttsResponse.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'X-Response-Text': encodeURIComponent(responseText),
        'X-Model-Used': usedModel
      }
    });

  } catch (error) {
    console.error('Voice assistant error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      fallback: true 
    }, { status: 500 });
  }
}
