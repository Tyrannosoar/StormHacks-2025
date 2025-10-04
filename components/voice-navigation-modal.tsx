"use client";

import { useState, useRef } from "react";
import { Mic, Loader2, Navigation, ShoppingCart, Package, UtensilsCrossed, Camera, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startVoiceAgent = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setIsActive(true);
      setTranscript("Voice agent activated. I'm listening...");
      
      // Start the continuous listening loop
      await startContinuousListening();
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Sorry, couldn't access your microphone. Please check permissions.");
    }
  };

  const startContinuousListening = async () => {
    if (!streamRef.current) return;
    
    const mediaRecorder = new MediaRecorder(streamRef.current);
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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
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

    mediaRecorder.start();
    setListening(true);
    setTranscript("Listening... Speak now!");

    // Stop recording after 3 seconds of silence or 10 seconds max
    const maxRecordingTime = 10000; // 10 seconds max
    const silenceTimeout = 3000; // 3 seconds of silence
    
    const timeoutId = setTimeout(() => {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        setListening(false);
      }
    }, maxRecordingTime);
    
    silenceTimeoutRef.current = timeoutId;
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

  const processAudioWithWhisper = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setTranscript("Processing audio with local Whisper...");
    
    try {
      console.log('Processing audio blob:', audioBlob.size, 'bytes');
      
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');

      console.log('Sending to local Whisper...');
      const response = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });

      console.log('Local Whisper response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Local Whisper error:', errorData);
        
        if (errorData.fallback) {
          setTranscript(`Local Whisper not available. Using browser speech recognition instead.`);
          await fallbackToBrowserSpeech();
          return;
        } else {
          setTranscript(`Local Whisper Error: ${response.status} - ${errorData.error}. Using browser speech recognition instead.`);
          await fallbackToBrowserSpeech();
          return;
        }
      }

      const data = await response.json();
      console.log('Local Whisper response:', data);
      
      const text = data.text?.toLowerCase() || '';
      
      if (text.trim()) {
        setTranscript(`You said: "${text}"`);
        setLastCommand(text);
        await processVoiceCommand(text);
      } else {
        setTranscript("I didn't catch that. Please try speaking more clearly.");
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
    // Check for browser speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setTranscript("Browser speech recognition not supported. Local Whisper should be working - check the server logs.");
      // Show manual navigation options
      setTimeout(() => {
        setTranscript("You can manually navigate using the buttons below, or check if local Whisper is properly installed.");
      }, 2000);
      return;
    }

    setTranscript("Using browser speech recognition...");

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript.toLowerCase();
        setTranscript(`You said: "${text}"`);
        processVoiceCommand(text);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setTranscript(`Speech recognition error: ${event.error}. Local Whisper should be working - check server logs.`);
        
        // Show manual options after error
        setTimeout(() => {
          setTranscript("Manual navigation available - use the buttons below or check local Whisper installation.");
        }, 2000);
      };

      recognition.onend = () => {
        if (isActive && !isProcessing && !isSpeaking) {
          setTimeout(() => {
            startContinuousListening();
          }, 1000);
        }
      };

      recognition.onstart = () => {
        setTranscript("Browser speech recognition active - speak now!");
      };

      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setTranscript("Speech recognition failed. Local Whisper should be working - check server logs.");
    }
  };

  const processVoiceCommand = async (command: string) => {
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

    // If no direct match, try to be smarter about it
    if (!targetPage) {
      if (command.includes("shop") || command.includes("buy") || command.includes("grocery")) {
        targetPage = "shopping";
      } else if (command.includes("store") || command.includes("inventory") || command.includes("stock")) {
        targetPage = "storage";
      } else if (command.includes("meal") || command.includes("recipe") || command.includes("cook") || command.includes("food")) {
        targetPage = "meals";
      } else if (command.includes("camera") || command.includes("scan") || command.includes("photo")) {
        targetPage = "camera";
      }
    }

    let responseText = "";
    
    if (targetPage && targetPage !== currentPage) {
      responseText = `Navigating to ${getPageName(targetPage)}.`;
      onNavigate(targetPage as any);
      // Don't close the modal, just navigate
    } else if (targetPage === currentPage) {
      responseText = `You're already on the ${getPageName(currentPage)} page!`;
    } else {
      responseText = "I didn't understand that. Try saying 'go to shopping', 'go to storage', 'go to meals', or 'go to camera'.";
    }

    // Show text response for now (ElevenLabs optional)
    setTranscript(responseText);
    
    // After showing response, restart listening if still active
    if (isActive) {
      setTimeout(() => {
        startContinuousListening();
      }, 2000);
    }
  };

  const speakWithElevenLabs = async (text: string) => {
    setIsSpeaking(true);
    
    try {
      const response = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('ElevenLabs API error');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('ElevenLabs error:', error);
      setIsSpeaking(false);
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

          {/* Transcript Display */}
          {transcript && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">
                {transcript.startsWith("You said:") ? "Transcription:" : "Status:"}
              </p>
              <p className="font-medium text-gray-900">
                {transcript.startsWith("You said:") ? transcript : `"${transcript}"`}
              </p>
            </div>
          )}

          {/* Manual Navigation Buttons */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Manual Navigation</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => onNavigate("shopping")}
                variant="outline"
                className="flex items-center gap-2 h-auto py-3"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-sm">Shopping</span>
              </Button>
              <Button
                onClick={() => onNavigate("storage")}
                variant="outline"
                className="flex items-center gap-2 h-auto py-3"
              >
                <Package className="w-4 h-4" />
                <span className="text-sm">Storage</span>
              </Button>
              <Button
                onClick={() => onNavigate("meals")}
                variant="outline"
                className="flex items-center gap-2 h-auto py-3"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span className="text-sm">Meals</span>
              </Button>
              <Button
                onClick={() => onNavigate("camera")}
                variant="outline"
                className="flex items-center gap-2 h-auto py-3"
              >
                <Camera className="w-4 h-4" />
                <span className="text-sm">Camera</span>
              </Button>
            </div>
          </div>

          {/* Available Commands */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Voice Commands:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-blue-500" />
                <span>"Go to shopping"</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-green-500" />
                <span>"Go to storage"</span>
              </div>
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                <span>"Go to meals"</span>
              </div>
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-500" />
                <span>"Go to camera"</span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <Button
            onClick={() => {
              stopVoiceAgent();
              onClose();
            }}
            variant="outline"
            className="w-full"
          >
            Close Voice Agent
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
