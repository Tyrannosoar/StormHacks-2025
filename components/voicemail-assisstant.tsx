"use client";

import { useState } from "react";
import { Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type GroceryItem = {
  id: string;
  name: string;
  quantity?: string;
  category?: string; //use actual grocery data type
};

const groceries: GroceryItem[] = [
  { id: "1", name: "chicken breast" },
  { id: "2", name: "rice" },
  { id: "3", name: "broccoli" },
];

export default function VoiceMealAssistant() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const startListening = () => {
    const recognition = new (window.SpeechRecognition ||
      (window as any).webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      recognition.stop();
      setListening(false);
      getGeminiRecommendations(text);
    };

    recognition.onerror = () => {
      setListening(false);
    };
  };

  const getGeminiRecommendations = async (voiceText: string) => {
    setLoading(true);
    setRecommendations([]);

    const prompt = `
You are a cooking assistant. Based on the ingredients available and the user's voice input, 
suggest up to 3 meal ideas that can be cooked.

Ingredients I have:
${groceries.map((g) => `- ${g.name}`).join("\n")}

User said:
"${voiceText}"

Respond in a short list, like:
1. ...
2. ...
3. ...
`;
//has to be modified --> json probably
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto text-center space-y-6 p-6">
      <h2 className="text-2xl font-semibold">🎤 AI Meal Assistant</h2>

      <Button
        onClick={startListening}
        disabled={listening || loading}
        className="rounded-full p-6"
      >
        {listening ? (
          <>
            <Loader2 className="animate-spin mr-2" /> Listening...
          </>
        ) : (
          <>
            <Mic className="mr-2" /> Speak to Gemini
          </>
        )}
      </Button>

      {transcript && (
        <p className="text-sm text-muted-foreground">
          You said: <strong>{transcript}</strong>
        </p>
      )}

      {loading && <p>Thinking of delicious ideas...</p>}

      {recommendations.length > 0 && (
        <div className="text-left space-y-2 bg-card p-4 rounded-xl">
          <h3 className="font-medium">Recommended Meals:</h3>
          <ul className="list-decimal pl-5">
            {recommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
