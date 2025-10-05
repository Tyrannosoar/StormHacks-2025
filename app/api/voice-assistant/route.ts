import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { command, currentPage } = await request.json();
    
    if (!command) {
      return NextResponse.json({ error: 'No command provided' }, { status: 400 });
    }

    // Create a context-aware prompt for Gemini focused on voice responses
    const systemPrompt = `You are MagnaCarter, a helpful voice assistant for a grocery management app.

User said: "${command}"
Current page: ${currentPage || 'dashboard'}

If the user wants to navigate to a page, respond with a friendly confirmation:

- If they mention "shopping", "shop", "buy", "grocery" → "Taking you to your shopping list. What do you need to buy today?"
- If they mention "storage", "inventory", "pantry" → "Opening your inventory. Let's see what's in your pantry."
- If they mention "meals", "recipes", "cooking", "food" → "Here's your meal planner. What sounds good for dinner?"
- If they mention "camera", "scan", "photo" → "Opening the camera. Ready to scan some items?"

If you don't understand what they want, say: "Sorry, I didn't understand. Try saying 'go to shopping' or 'open storage'."

Keep it conversational and under 20 words. Respond:`;

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 150,
            temperature: 0.8,
            topP: 0.9,
            topK: 40,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', geminiResponse.status);
      return NextResponse.json({ 
        error: 'Gemini API error',
        fallback: true 
      }, { status: 500 });
    }

    const geminiData = await geminiResponse.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I understand. Let me help you with that.";

    console.log('Gemini raw response:', geminiData);
    console.log('Gemini processed text:', responseText);

    return NextResponse.json({ 
      text: responseText.trim(),
      method: 'gemini-ai',
      fullResponse: geminiData
    });

  } catch (error) {
    console.error('Voice assistant error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      fallback: true 
    }, { status: 500 });
  }
}
