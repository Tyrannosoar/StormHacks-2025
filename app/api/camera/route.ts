import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
You are a grocery receipt interpreter. The image provided is a photo of a shopping receipt.

Your task:
1. Identify all food items and return them as a JSON array with this format:
[
  { "id": 1, "name": "Whole Milk", "amount": "1L", "expiryDays": 3, "plannedAmount": "500ml", "category": "Dairy" },
  { "id": 2, "name": "Greek Yogurt", "amount": "500g", "expiryDays": 1, "plannedAmount": "200g", "category": "Dairy" },
  ...
]

2. Identify all non-food items (like paper towels, soap, etc.) and return them as a simple string array:
["Toilet Paper", "Dish Soap"]

Return JSON in the structure:
{
  "foodItems": [...],
  "nonFoodItems": [...]
}
`;

    const imageBase64 = image.split(",")[1];

    const result = await model.generateContent([
      { role: "user", parts: [{ text: prompt }, { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }] },
    ]);

    const textResponse = result.response.text();

    // Gemini might return markdown or plain text, so we parse out JSON safely:
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    let parsed;
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      parsed = { foodItems: [], nonFoodItems: [] };
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("Gemini error:", err);
    return NextResponse.json({ error: "Failed to analyze receipt", details: err.message }, { status: 500 });
  }
}
