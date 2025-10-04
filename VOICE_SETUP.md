# Voice Navigation Setup

This app now uses Whisper for speech recognition and ElevenLabs for voice responses.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# OpenAI API Key for Whisper
OPENAI_API_KEY=your_openai_api_key_here

# ElevenLabs API Key and Voice ID
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Getting API Keys

### OpenAI API Key (for Whisper)
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

### ElevenLabs API Key
1. Go to https://elevenlabs.io/
2. Sign up or log in
3. Go to your profile settings
4. Copy your API key
5. Add it to your `.env.local` file

### ElevenLabs Voice ID
1. Go to https://elevenlabs.io/voice-library
2. Choose a voice you like
3. Copy the voice ID from the URL or voice details
4. Add it to your `.env.local` file

## How It Works

1. **User taps the floating action button**
2. **Voice navigation modal opens**
3. **User taps microphone and speaks** (e.g., "Go to shopping")
4. **Audio is recorded for 5 seconds**
5. **Audio is sent to Whisper API for transcription**
6. **Command is processed and navigation occurs**
7. **ElevenLabs generates a voice response**
8. **User hears the spoken confirmation**

## Voice Commands

- "Go to shopping" or "Shopping" → Navigate to shopping page
- "Go to storage" or "Storage" → Navigate to storage page
- "Go to meals" or "Meals" → Navigate to meals page
- "Go to camera" or "Camera" → Navigate to camera page

The system also understands variations like "shop", "buy", "grocery" for shopping, etc.
