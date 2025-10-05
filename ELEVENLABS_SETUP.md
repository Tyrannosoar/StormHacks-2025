# ElevenLabs Voice Setup Guide

## 🎤 Setting Up Voice Responses with ElevenLabs

### 1. Get ElevenLabs API Key
1. Go to [ElevenLabs.io](https://elevenlabs.io)
2. Sign up for a free account
3. Go to [API Keys](https://elevenlabs.io/app/settings/api-keys)
4. Create a new API key
5. Copy the API key

### 2. Set Environment Variables
Create a `.env.local` file in your project root:

```bash
# ElevenLabs API Configuration
ELEVENLABS_API_KEY=your_actual_api_key_here
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
```

### 3. Available Voices
- **Default**: `pNInz6obpgDQGcFmaJgB` (Rachel - Female, American)
- **Other options**: Check [ElevenLabs Voice Library](https://elevenlabs.io/voice-library)

### 4. Free Tier Limits
- **10,000 characters per month** (free tier)
- **Perfect for voice navigation responses**

### 5. Test the Setup
Once configured, the voice navigation will:
- ✅ **Listen** to your commands with local Whisper
- ✅ **Respond** with intelligent voice feedback
- ✅ **Navigate** to the requested pages
- ✅ **Confirm** actions with natural speech

## 🎯 Features
- **Intelligent responses** based on your commands
- **Natural voice synthesis** with ElevenLabs
- **Contextual feedback** for navigation actions
- **Error handling** with helpful voice messages
