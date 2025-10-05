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

    // Direct inventory Q&A without Gemini for reliability and low latency
    const q = String(transcript || '').toLowerCase();
    const inventoryPatterns = [
      /\bhow many\s+([a-zA-Z ]+?)\s+do i have\b/,
      /\bhow many\s+([a-zA-Z ]+)\b/,
      /\bdo i have\s+any\s+([a-zA-Z ]+)\b/,
      /\bhow much\s+([a-zA-Z ]+)\s+do i have\b/,
      /\bwhat do i have for\s+([a-zA-Z ]+)\b/,
      /\bhow many (?:units|items) of\s+([a-zA-Z ]+)\b/
    ];
    let itemQuery: string | null = null;
    for (const re of inventoryPatterns) {
      const m = q.match(re);
      if (m && m[1]) { itemQuery = m[1].trim(); break; }
    }

    if (itemQuery && Array.isArray(context?.storage)) {
      const tokens = itemQuery.split(/\s+/).filter(Boolean);
      const storageItems: any[] = context.storage;
      // Simple fuzzy includes match over name
      const matches = storageItems.filter((s: any) => {
        const name = String(s?.name || '').toLowerCase();
        return tokens.every(t => name.includes(t));
      });

      let responseTextInv = '';
      if (matches.length > 0) {
        // If multiple matches, pick the best by longest name match
        const best = matches.sort((a, b) => String(b.name || '').length - String(a.name || '').length)[0];
        const amt = best?.amount ? String(best.amount) : 'some';
        responseTextInv = `You have ${amt} ${best?.name || ''} in storage.`.trim();
      } else {
        responseTextInv = `You do not have ${itemQuery} in storage.`;
      }

      // TTS via ElevenLabs for inventory response
      try {
        const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB'}` , {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
          },
          body: JSON.stringify({
            text: responseTextInv,
            model_id: 'eleven_monolingual_v1',
            voice_settings: { stability: 0.5, similarity_boost: 0.5 }
          })
        });

        if (ttsResponse.ok) {
          const audioBuffer = await ttsResponse.arrayBuffer();
          return new NextResponse(audioBuffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'X-Response-Text': encodeURIComponent(responseTextInv),
              'X-Model-Used': 'deterministic-inventory'
            }
          });
        }
      } catch {}

      // Fallback to JSON if TTS fails
      return NextResponse.json({ text: responseTextInv, noAudio: true }, { headers: { 'X-Response-Text': encodeURIComponent(responseTextInv), 'X-Model-Used': 'deterministic-inventory' } });
    }

    const systemPrompt = `You are a concise, helpful voice assistant for a grocery app.
Answer in <= 25 words. Only navigate if explicitly asked. If the user asks for meal ideas, propose 2-3 recipes using current ingredients. If they ask for pairings, suggest 2-3 ingredients that pair well. Do not suggest meals or pairings unless asked.`;

    const promptText = [
      systemPrompt,
      `Session: ${sessionId || 'anonymous'}`,
      `Current page: ${currentPage || 'dashboard'}`,
      `Context JSON (shopping, storage): ${typeof context === 'string' ? context : JSON.stringify(context || {}, null, 2)}`,
      `User: ${transcript}`,
      `Assistant:`
    ].join('\n\n');

    // Call Gemini API
    async function callGemini(model: string) {
      return fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: promptText }]
              }
            ],
            generationConfig: { maxOutputTokens: 120, temperature: 0.5, topP: 0.9, topK: 40 }
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
    let combined = '';
    if (Array.isArray(parts) && parts.length > 0) {
      combined = parts
        .map((p: any) => (typeof p?.text === 'string' ? p.text : ''))
        .filter(Boolean)
        .join(' ')
        .trim();
    }
    // Fallback extraction
    if (!combined && geminiData?.candidates?.[0]?.content?.parts?.[0]?.text) {
      combined = String(geminiData.candidates[0].content.parts[0].text).trim();
    }
    const responseText = (combined || 'I understand. Let me help you with that.').trim();

    const normalized = responseText
      .toLowerCase()
      .replace(/^[^a-z0-9]+/g, '') // strip leading emojis/symbols
      .trim();
    const genericPhrases = new Set([
      'i understand. let me help you with that.',
      'i understand let me help you with that',
      'okay.',
      'ok.',
      'okay'
    ]);
    const isGeneric = genericPhrases.has(normalized);

    if (isGeneric) {
      return NextResponse.json({ text: responseText, noAudio: true }, {
        headers: {
          'X-Response-Text': encodeURIComponent(responseText),
          'X-Model-Used': usedModel
        }
      });
    }

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
