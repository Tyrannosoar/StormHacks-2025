"use client";

import { useState, useRef, useEffect } from "react";
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
      console.log('🤖 Requesting Gemini response for:', command);
      
      const response = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          command, 
          currentPage 
        }),
      });

      if (!response.ok) {
        console.error('Voice assistant API error:', response.status);
        const errorText = await response.text();
        console.error('API Error details:', errorText);
        // Fallback to simple response
        return `I understand you said "${command}". Let me help you with that.`;
      }

      const data = await response.json();
      console.log('🤖 Gemini response:', data);
      
      if (data.text && data.text.trim()) {
        return data.text.trim();
      } else {
        console.warn('Empty or invalid response from Gemini:', data);
        return `I understand you said "${command}". Let me help you with that.`;
      }
    } catch (error) {
      console.error('Error generating intelligent response:', error);
      // Fallback to simple response
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

      // Generate intelligent response using Gemini AI
      const intelligentResponse = await generateIntelligentResponse(command, targetPage, currentPage);
      console.log('🎯 Final Gemini response:', intelligentResponse);
      
      if (targetPage && targetPage !== currentPage) {
        setTranscript(`🚀 Navigating to ${getPageName(targetPage)}...`);
        onNavigate(targetPage as any);
        // Show Gemini's response and speak it
        setTimeout(() => {
          setTranscript(`🧠 ${intelligentResponse}`);
        }, 500);
        await speakResponse(intelligentResponse);
      } else if (targetPage === currentPage) {
        setTranscript(`📍 You're already on the ${getPageName(currentPage)} page!`);
        // Show Gemini's response and speak it
        setTimeout(() => {
          setTranscript(`🧠 ${intelligentResponse}`);
        }, 500);
        await speakResponse(intelligentResponse);
      } else {
        setTranscript(`❓ I didn't understand that. Try saying 'go to shopping', 'go to storage', 'go to meals', or 'go to camera'.`);
        // Show Gemini's response and speak it
        setTimeout(() => {
          setTranscript(`🧠 ${intelligentResponse}`);
        }, 500);
        await speakResponse(intelligentResponse);
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
      </DialogContent>
    </Dialog>
  );
}
