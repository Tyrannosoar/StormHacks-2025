"use client";

import { useState } from "react";
import { Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

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
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  const startListening = () => {
    const recognition = new (window.SpeechRecognition ||
      (window as any).webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);

    // Interrupt TTS playback immediately when user starts speaking
    if (audioPlayer && !audioPlayer.paused) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      recognition.stop();
      setListening(false);
      handleVoiceExchange(text);
    };

    recognition.onerror = () => {
      setListening(false);
    };
  };

  const handleVoiceExchange = async (voiceText: string) => {
    setLoading(true);
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const { data: shopping } = await supabase
        .from('shopping_items')
        .select('name, amount, priority')
        .limit(20);

      const { data: storage } = await supabase
        .from('storage_items')
        .select('name, amount, expiry_days, category')
        .limit(20);

      const context = { shopping, storage };

      const res = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: voiceText, sessionId: session?.user?.id, context, currentPage: 'meals' })
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      setAudioPlayer(audio);
      await audio.play();
    } catch (err) {
      console.error('Voice flow error', err);
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
