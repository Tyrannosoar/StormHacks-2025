"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Loader2, Navigation, ShoppingCart, Package, UtensilsCrossed, Camera, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { Meal } from "@/lib/types";
import { supabaseMealsApi } from "@/lib/supabase-api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface VoiceNavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: "shopping" | "storage" | "meals" | "camera") => void;
  currentPage: string;
}

export function VoiceNavigationModal({ isOpen, onClose, onNavigate, currentPage }: VoiceNavigationModalProps) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recommendedMeals, setRecommendedMeals] = useState<Meal[]>([]);
  const [recommendedMissing, setRecommendedMissing] = useState<Record<string, string[]>>({});
  const [selectedRecipe, setSelectedRecipe] = useState<Meal | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);
  const lastAudioUrlRef = useRef<string | null>(null);
  const stopAndCleanupAudio = (deferRevoke = true) => {
    try { audioInstanceRef.current?.pause(); } catch {}
    if (audioInstanceRef.current) {
      audioInstanceRef.current.onended = null;
      audioInstanceRef.current.src = '';
      audioInstanceRef.current = null;
    }
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch {}
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
    const urlToRevoke = lastAudioUrlRef.current;
    lastAudioUrlRef.current = null;
    if (urlToRevoke) {
      if (deferRevoke) {
        setTimeout(() => {
          try { URL.revokeObjectURL(urlToRevoke); } catch {}
        }, 500);
      } else {
        try { URL.revokeObjectURL(urlToRevoke); } catch {}
      }
    }
  };

  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Periodic stream health check
  useEffect(() => {
    if (!isActive) return;

    const healthCheckInterval = setInterval(() => {
      if (streamRef.current && streamRef.current.getTracks().every(track => track.readyState === 'ended')) {
        console.log('Stream health check: stream ended, reinitializing...');
        checkAndRefreshStream();
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(healthCheckInterval);
  }, [isActive]);

  const startVoiceAgent = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setIsActive(true);
      setTranscript("🎤 Voice agent activated. I'm listening...");
      // Cleanup any existing audio instance and URL (defer revoke to avoid AbortError)
      stopAndCleanupAudio(true);
      
      // Always use the backend API for voice recognition
      await startContinuousListening();
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setTranscript("❌ Couldn't access microphone. Please check permissions and try again.");
    }
  };

  const startContinuousListening = async () => {
    if (!streamRef.current) {
      console.log('No stream available, reinitializing...');
      await startVoiceAgent();
      return;
    }

    // Check if stream is still active
    if (streamRef.current.getTracks().every(track => track.readyState === 'ended')) {
      console.log('Stream ended, reinitializing...');
      await startVoiceAgent();
      return;
    }
    
    try {
      // Use a more compatible audio format
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('MediaRecorder stopped, audio chunks:', audioChunksRef.current.length);
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          console.log('Created audio blob:', audioBlob.size, 'bytes');
          await processAudioWithWhisper(audioBlob);
        } else {
          console.log('No audio chunks recorded');
          setTranscript("No audio recorded. Please try speaking louder.");
          setTimeout(() => {
            if (isActive) {
              startContinuousListening();
            }
          }, 2000);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setTranscript("Recording error. Reinitializing microphone...");
        setTimeout(() => {
          if (isActive) {
            startVoiceAgent();
          }
        }, 1000);
      };

      mediaRecorder.start();
      setListening(true);
      setTranscript("🎧 Listening... Speak clearly!");
      stopAndCleanupAudio(true);

      // Stop recording after 3 seconds of silence or 10 seconds max
      const maxRecordingTime = 10000; // 10 seconds max
      const silenceTimeout = 3000; // 3 seconds of silence
      
      const timeoutId = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setListening(false);
        }
      }, maxRecordingTime);
      
      silenceTimeoutRef.current = timeoutId;
    } catch (error) {
      console.error('Error starting MediaRecorder:', error);
      setTranscript("Recording failed. Reinitializing microphone...");
      setTimeout(() => {
        if (isActive) {
          startVoiceAgent();
        }
      }, 1000);
    }
  };

  const stopVoiceAgent = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    setIsActive(false);
    setListening(false);
    setIsProcessing(false);
    setIsSpeaking(false);
    setTranscript("");
  };

  const checkAndRefreshStream = async () => {
    if (!streamRef.current || streamRef.current.getTracks().every(track => track.readyState === 'ended')) {
      console.log('Stream inactive, refreshing...');
      setTranscript("🔄 Refreshing microphone access...");
      await startVoiceAgent();
    }
  };

  const generateIntelligentResponse = async (command: string, targetPage: string | null, currentPage: string): Promise<string> => {
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

      const response = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          transcript: command,
          sessionId: session?.user?.id,
          context: { shopping, storage },
          currentPage
        }),
      });

      if (!response.ok) {
        return `I understand you said "${command}". Let me help you with that.`;
      }

      const responseTextHeader = response.headers.get('X-Response-Text');
      const responseText = responseTextHeader ? decodeURIComponent(responseTextHeader) : '';

      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('audio/mpeg')) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        // Cleanup previous instance and URL
        try { audioInstanceRef.current?.pause(); } catch {}
        if (lastAudioUrlRef.current) {
          URL.revokeObjectURL(lastAudioUrlRef.current);
          lastAudioUrlRef.current = null;
        }
        // Create a fresh audio instance per playback
        const audio = new Audio(audioUrl);
        audio.preload = 'auto';
        audio.load();
        audioInstanceRef.current = audio;
        lastAudioUrlRef.current = audioUrl;
        try {
          await audio.play();
        } catch (err) {
          // Ignore AbortError; suppress noisy logs for expected interruptions
          if (!(err instanceof DOMException && err.name === 'AbortError')) {
            // console.error('Audio play error:', err);
          }
        }
        audio.onended = () => {
          stopAndCleanupAudio(false);
          if (isActive) {
            setTimeout(() => {
              startContinuousListening();
            }, 800);
          }
        };
      } else {
        // No audio - set transcript from header if available
        if (responseText) setTranscript(`🧠 ${responseText}`);
      }

      return responseText || `I understand you said "${command}". Let me help you with that.`;
    } catch (error) {
      return `I understand you said "${command}". Let me help you with that.`;
    }
  };

  const speakResponse = async (text: string) => {
    try {
      setIsSpeaking(true);
      setTranscript(`🔊 Speaking: "${text}"`);
      
      const response = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        console.error('ElevenLabs TTS error:', response.status);
        // Don't show error to user, just continue with text response
        setTranscript(`💬 ${text}`);
        setIsSpeaking(false);
        // Continue listening after a short delay
        if (isActive) {
          setTimeout(() => {
            startContinuousListening();
          }, 2000);
        }
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          // Continue listening after speaking
          if (isActive) {
            setTimeout(() => {
              startContinuousListening();
            }, 1000);
          }
        };
      }
    } catch (error) {
      console.error('TTS error:', error);
      // Don't show error to user, just continue with text response
      setTranscript(`💬 ${text}`);
      setIsSpeaking(false);
      // Continue listening even if TTS fails
      if (isActive) {
        setTimeout(() => {
          startContinuousListening();
        }, 2000);
      }
    }
  };

  const processAudioWithWhisper = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setTranscript("🎤 Processing your speech with local Whisper...");
    
    try {
      console.log('Processing audio blob:', audioBlob.size, 'bytes');
      
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');

      setTranscript("🔄 Sending audio to local Whisper for transcription...");
      console.log('Sending to local Whisper...');
      const response = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });

      console.log('Local Whisper response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend Whisper error:', errorData);
        
        if (errorData.fallback) {
          setTranscript(`🔄 Backend Whisper not available. Using browser speech recognition...`);
          await fallbackToBrowserSpeech();
          return;
        } else {
          setTranscript(`❌ Backend Error: ${errorData.error || 'Unknown error'}. Using browser speech recognition...`);
          await fallbackToBrowserSpeech();
          return;
        }
      }

      const data = await response.json();
      console.log('Backend response:', data);
      
      // Check if the response indicates we should use fallback
      if (data.fallback) {
        setTranscript(`🔄 ${data.message || 'Using browser speech recognition...'}`);
        await fallbackToBrowserSpeech();
        return;
      }
      
      const text = data.text?.toLowerCase() || '';
      
      if (text.trim()) {
        setTranscript(`✅ Transcription: "${text}"`);
        setLastCommand(text);
        
        // Show the command being processed
        setTimeout(() => {
          setTranscript(`🎯 Processing command: "${text}"`);
        }, 1000);
        
        await processVoiceCommand(text);
      } else {
        setTranscript("❌ No speech detected. Please try speaking more clearly.");
        console.log('Empty transcription result');
        // Wait a moment then restart listening
        setTimeout(() => {
          if (isActive) {
            startContinuousListening();
          }
        }, 2000);
      }
      
    } catch (error) {
      console.error('Local Whisper processing error:', error);
      setTranscript(`Error: ${error instanceof Error ? error.message : 'Unknown error'}. Using browser speech recognition instead.`);
      await fallbackToBrowserSpeech();
    } finally {
      setIsProcessing(false);
    }
  };

  const fallbackToBrowserSpeech = async () => {
    // Use browser speech recognition as fallback when backend API fails
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setTranscript("❌ Speech recognition not supported. Please use manual navigation buttons.");
      return;
    }

    setTranscript("🎤 Using browser speech recognition...");

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript.toLowerCase();
        setTranscript(`✅ You said: "${text}"`);
        processVoiceCommand(text);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setTranscript(`❌ Speech recognition error: ${event.error}. Please try again.`);
        // Restart after error
        if (isActive) {
          setTimeout(() => {
            fallbackToBrowserSpeech();
          }, 2000);
        }
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        if (isActive) {
          setTimeout(() => {
            fallbackToBrowserSpeech();
          }, 1000);
        }
      };

      recognition.onstart = () => {
        setTranscript("🎤 Listening... Speak now!");
      };

      console.log('Starting browser speech recognition...');
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setTranscript("❌ Speech recognition failed. Please use manual navigation buttons.");
    }
  };

  const processVoiceCommand = async (command: string) => {
    try {
      // Simple command processing for navigation
      const navigationCommands = {
        "go to shopping": "shopping",
        "shopping": "shopping",
        "shopping list": "shopping",
        "go to storage": "storage", 
        "storage": "storage",
        "inventory": "storage",
        "go to meals": "meals",
        "meals": "meals",
        "recipes": "meals",
        "cooking": "meals",
        "go to camera": "camera",
        "camera": "camera",
        "scan": "camera",
        "take photo": "camera"
      };

      // Find matching command
      let targetPage = null;
      for (const [key, page] of Object.entries(navigationCommands)) {
        if (command.includes(key)) {
          targetPage = page;
          break;
        }
      }

      // Only navigate on explicit commands; otherwise treat as general question
      const intelligentResponse = await generateIntelligentResponse(command, targetPage, currentPage);
      console.log('🎯 Final Gemini response:', intelligentResponse);

      // If user explicitly asked for recipes, open recommendations modal
      const lowerCmd = command.toLowerCase();
      const wantsRecipes = [
        /\b(recommend|suggest) (some )?(recipes|meals)\b/i,
        /\b(what can i (cook|make))\b/i,
        /\b(any (dinner|lunch|breakfast) ideas)\b/i,
        /\b(show (me )?(recipes|meal ideas))\b/i,
        /\b(give me (recipes|meal ideas))\b/i,
        /\b(recipe suggestions?)\b/i
      ].some(r => r.test(lowerCmd));
      if (wantsRecipes) {
        try {
          const { data: storage } = await supabase
            .from('storage_items')
            .select('name')
            .limit(50);
          const pantry = new Set((storage || []).map(i => (i as any).name?.toLowerCase?.().trim() || "").filter(Boolean));

          const explore = await supabaseMealsApi.getExplore();
          const meals = explore.success && explore.data ? explore.data : [];

          // Try to extract an ingredient focus from the query (e.g., "recipes for greek yogurt", "ideas with salmon")
          let ingredientFocus: string | null = null;
          const ingPatterns = [
            /\bfor\s+([a-zA-Z ]{2,})$/i,
            /\bwith\s+([a-zA-Z ]{2,})$/i,
            /\busing\s+([a-zA-Z ]{2,})$/i
          ];
          for (const p of ingPatterns) {
            const m = lowerCmd.match(p);
            if (m && m[1]) { ingredientFocus = m[1].trim(); break; }
          }

          const scoredAll = meals
            .map(m => ({
              meal: m,
              score: (m.ingredients || []).reduce((acc, ing) => {
                const ingLower = (ing || '').toLowerCase();
                // match if any pantry token appears in ingredient string
                const has = Array.from(pantry).some(p => p && ingLower.includes(p));
                return acc + (has ? 1 : 0);
              }, 0)
            }))
            .sort((a, b) => b.score - a.score)
            .map(s => s.meal)
            ;

          let candidateList = (scoredAll.length > 0 ? scoredAll : meals);

          // If an ingredient focus is present, strictly filter recipes to those containing that ingredient term
          if (ingredientFocus) {
            const q = ingredientFocus.toLowerCase();
            const filtered = candidateList.filter(m =>
              Array.isArray(m.ingredients) && m.ingredients.some(ing => String(ing || '').toLowerCase().includes(q))
            );
            candidateList = filtered.length > 0 ? filtered : [];
          }

          // Limit to 4; if no candidates after strict filtering, show an informative message and do not speak unrelated recipes
          const picked = candidateList.slice(0, 4);

          // Compute missing ingredients per meal
          const missingMap: Record<string, string[]> = {};
          for (const m of picked) {
            const missing: string[] = [];
            for (const ing of (m.ingredients || [])) {
              const ingLower = (ing || '').toLowerCase();
              const has = Array.from(pantry).some(p => p && ingLower.includes(p));
              if (!has) missing.push(ing);
            }
            missingMap[m.id] = missing;
          }

          setRecommendedMeals(picked);
          setRecommendedMissing(missingMap);
          if (picked.length > 0) {
            setShowRecipeModal(true);
            const names = picked.map(m => m.title).join(', ');
            if (names) {
              await speakResponse(`Here are some ideas: ${names}.`);
            }
          } else if (ingredientFocus) {
            try {
              const prompt = `Suggest exactly one concise recipe title using ${ingredientFocus}. No descriptions, just the title.`;
              const resp = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
              });
              const data = await resp.json();
              const title = Array.isArray(data?.recommendations) && data.recommendations[0]
                ? String(data.recommendations[0])
                : '';
              if (title) {
                const fallbackMeal: Meal = {
                  id: `gen-${Date.now()}`,
                  title,
                  image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center',
                  cookTime: 20,
                  servings: 2,
                  hasAllIngredients: false,
                  ingredients: [],
                  instructions: []
                };
                setRecommendedMeals([fallbackMeal]);
                setRecommendedMissing({ [fallbackMeal.id]: [] });
                setShowRecipeModal(true);
                await speakResponse(`Here is an idea: ${fallbackMeal.title}.`);
              } else {
                setTranscript(`🧠 No recipes found using ${ingredientFocus}.`);
                await speakResponse(`No recipes found using ${ingredientFocus}.`);
              }
            } catch {
              setTranscript(`🧠 No recipes found using ${ingredientFocus}.`);
              await speakResponse(`No recipes found using ${ingredientFocus}.`);
            }
          }
        } catch (e) {
          console.error('Failed to load recommended meals', e);
        }
      }

      // Detect intent to open a specific recipe (explicit only)
      const openPatterns = [
        /\bi want to (cook|make)\s+([^\.!\?]{2,})/i,
        /\blet(?:'|’)s (cook|make)\s+([^\.!\?]{2,})/i,
        /\bopen (?:the )?(?:recipe|meal)\s+([^\.!\?]{2,})/i,
        /\bshow (?:me )?(?:the )?(?:recipe|meal)\s+([^\.!\?]{2,})/i,
        /\b(cook|make)\s+([^\.!\?]{2,})/i
      ];
      let openRecipeTarget: string | null = null;
      for (const p of openPatterns) {
        const m = command.match(p);
        if (m) {
          // Last capturing group contains the name
          openRecipeTarget = (m[m.length - 1] || '').trim().toLowerCase();
          break;
        }
      }
      if (openRecipeTarget) {
        const targetName = openRecipeTarget;
        let candidate: Meal | undefined = recommendedMeals.find(m => m.title.toLowerCase().includes(targetName));
        if (!candidate) {
          // Fallback search in explore
          try {
            const explore = await supabaseMealsApi.getExplore();
            const meals = explore.success && explore.data ? explore.data : [];
            candidate = meals.find(m => m.title.toLowerCase().includes(targetName)) || meals[0];
          } catch {}
        }
        if (candidate) {
          setSelectedRecipe(candidate);
          setShowRecipeModal(true);
          const overview = `${candidate.title}. ${candidate.cookTime} minutes, serves ${candidate.servings}.`;
          setTranscript(`🧠 ${overview}`);
          await speakResponse(overview);
        }
      }

      if (targetPage && targetPage !== currentPage) {
        setTranscript(`🚀 Navigating to ${getPageName(targetPage)}...`);
        onNavigate(targetPage as any);
        setTimeout(() => {
          setTranscript(`🧠 ${intelligentResponse}`);
        }, 500);
      } else if (targetPage === currentPage) {
        setTranscript(`📍 You're already on the ${getPageName(currentPage)} page!`);
        setTimeout(() => {
          setTranscript(`🧠 ${intelligentResponse}`);
        }, 500);
      } else {
        setTranscript(`🧠 ${intelligentResponse}`);
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      // Fallback to simple text response
      setTranscript(`💬 Processing your command...`);
      // Continue listening
      if (isActive) {
        setTimeout(() => {
          startContinuousListening();
        }, 2000);
      }
    }
  };


  const getPageIcon = (page: string) => {
    switch (page) {
      case "shopping": return <ShoppingCart className="w-5 h-5" />;
      case "storage": return <Package className="w-5 h-5" />;
      case "meals": return <UtensilsCrossed className="w-5 h-5" />;
      case "camera": return <Camera className="w-5 h-5" />;
      default: return <Navigation className="w-5 h-5" />;
    }
  };

  const getPageName = (page: string) => {
    switch (page) {
      case "shopping": return "Shopping";
      case "storage": return "Storage";
      case "meals": return "Meals";
      case "camera": return "Camera";
      default: return page;
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border-gray-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-xl flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Voice Navigation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Page Indicator */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Currently on:</p>
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
              {getPageIcon(currentPage)}
              <span className="font-medium text-blue-900">{getPageName(currentPage)}</span>
            </div>
          </div>

          {/* Voice Agent Section */}
          <div className="flex flex-col items-center space-y-4">
            {!isActive ? (
              <Button
                onClick={startVoiceAgent}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg"
              >
                <Mic className="w-8 h-8" />
              </Button>
            ) : (
              <Button
                onClick={stopVoiceAgent}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg"
              >
                <X className="w-8 h-8" />
              </Button>
            )}

            <div className="text-center">
              {!isActive && (
                <p className="text-gray-600">Tap to start voice agent</p>
              )}
              {isActive && listening && (
                <p className="text-blue-600 font-medium animate-pulse">Listening...</p>
              )}
              {isActive && isProcessing && (
                <p className="text-purple-600 font-medium">Processing with local Whisper...</p>
              )}
              {isActive && isSpeaking && (
                <p className="text-green-600 font-medium animate-pulse">Speaking response...</p>
              )}
              {isActive && !listening && !isProcessing && !isSpeaking && (
                <p className="text-gray-600">Voice agent active - speak anytime</p>
              )}
            </div>
          </div>

          {/* Live Transcript Display */}
          {transcript && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${listening ? 'bg-green-500 animate-pulse' : isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <p className="text-sm font-medium text-blue-800">
                  {listening ? "🎧 Listening..." : isProcessing ? "🔄 Processing..." : "💬 Response"}
                </p>
              </div>
              <p className="text-gray-900 font-medium">
                {transcript}
              </p>
            </div>
          )}

        </div>
        {/* Hidden audio element for TTS playback */}
        <audio ref={audioRef} style={{ display: 'none' }} aria-hidden="true" />

        <Dialog open={showRecipeModal} onOpenChange={setShowRecipeModal}>
          <DialogContent className="max-w-3xl bg-white border-gray-200 shadow-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gray-900 text-xl">Recommended Recipes</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedMeals.map((meal) => {
                  const missing = recommendedMissing[meal.id] || [];
                  const ready = missing.length === 0;
                  return (
                    <div key={meal.id} className="bg-white/5 backdrop-blur-md rounded-xl border-gray-300/20 shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-200">
                      <div className="relative" onClick={() => setSelectedRecipe(meal)}>
                        <img src={meal.image || "/placeholder.svg"} alt={meal.title} className="w-full h-48 object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center" }} />
                        <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${ready ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>
                          {ready ? 'Ready' : 'Need Ingredients'}
                        </div>
                      </div>
                      <div className="p-4 bg-white/5 backdrop-blur-sm">
                        <h3 className="font-semibold text-gray-900 mb-2">{meal.title}</h3>
                        <div className="text-sm text-gray-600 mb-2">{meal.cookTime} min • {meal.servings} servings</div>
                        {selectedRecipe?.id === meal.id && (
                          <div className="mt-2 text-sm text-gray-800">
                            <div className="font-medium mb-1">Overview</div>
                            <div>Cook time: {meal.cookTime} minutes</div>
                            <div>Servings: {meal.servings}</div>
                            {meal.ingredients?.length ? (
                              <div className="mt-2">
                                <div className="font-medium text-xs mb-1">Ingredients</div>
                                <div className="text-xs text-gray-700 line-clamp-3">{meal.ingredients.join(', ')}</div>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
