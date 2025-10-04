# Voice Navigation Setup Guide

## 🚀 Quick Start (Browser Speech Recognition)

The voice navigation will work immediately using your browser's built-in speech recognition, no API keys needed!

## 🎯 Enhanced Setup (Whisper + ElevenLabs)

For better accuracy and voice responses, follow these steps:

### 1. Create `.env.local` file

Create a `.env.local` file in your project root:

```env
# OpenAI API Key (for Whisper - FREE for first 3 months)
OPENAI_API_KEY=your_openai_api_key_here

# ElevenLabs API Key (optional - FREE tier available)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
```

### 2. Get OpenAI API Key (FREE)

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to "API Keys" section
4. Click "Create new secret key"
5. Copy the key and add it to your `.env.local` file

**Cost:** FREE for first 3 months ($5 credit), then ~$0.006 per minute of audio

### 3. Get ElevenLabs API Key (Optional)

1. Go to https://elevenlabs.io/
2. Sign up for free account
3. Go to your profile settings
4. Copy your API key
5. Add it to your `.env.local` file

**Cost:** FREE tier with 10,000 characters per month

### 4. Test Your Setup

Visit `http://localhost:3000/api/test-keys` to check if your API keys are configured correctly.

## 🎤 How It Works

1. **Without API Keys:** Uses browser speech recognition (works immediately)
2. **With OpenAI Key:** Uses Whisper for better accuracy
3. **With ElevenLabs Key:** Adds voice responses

## 🛠️ Troubleshooting

- **"Browser speech recognition not supported"** → Use Chrome/Edge browser
- **"API Error"** → Check your `.env.local` file and API keys
- **"No audio recorded"** → Check microphone permissions

## 💡 Tips

- Speak clearly and wait for the "Listening..." indicator
- Try commands like "go to shopping", "go to storage", "go to meals"
- The system will automatically restart listening after each response
