import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" +
      process.env.GOOGLE_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const data = await response.json();
  
  // Log the full Gemini response to terminal
  console.log("🔍 Full Gemini API Response:");
  console.log(JSON.stringify(data, null, 2));
  
  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response from Gemini.";

  // Log the extracted text
  console.log("📝 Extracted text from Gemini:");
  console.log(text);

  // Split Gemini's answer into up to 3 lines
  const recommendations = text
    .split(/\d+\.\s+/)
    .filter(Boolean)
    .slice(0, 3);
  
  // Log the final recommendations
  console.log("✅ Final recommendations being returned:");
  console.log(recommendations);

  return NextResponse.json({ recommendations });
}
