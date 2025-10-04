# FFmpeg Setup for Voice Recognition

## 🎤 Why FFmpeg is Needed

Whisper requires FFmpeg to process audio files. Without it, you'll see errors like:
- `FileNotFoundError: [Errno 2] No such file or directory: 'ffmpeg'`
- `Browser speech recognition not supported. Local Whisper needs ffmpeg to be installed.`

## 🚀 Quick Installation

### macOS
```bash
# Install using Homebrew (recommended)
brew install ffmpeg

# Verify installation
ffmpeg -version
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ffmpeg

# Verify installation
ffmpeg -version
```

### Windows
1. Download FFmpeg from https://ffmpeg.org/download.html
2. Extract to a folder (e.g., `C:\ffmpeg`)
3. Add the `bin` folder to your PATH environment variable
4. Restart your terminal/command prompt

## ✅ Verify Installation

Run this command to check if FFmpeg is working:
```bash
ffmpeg -version
```

You should see output like:
```
ffmpeg version 4.4.2 Copyright (c) 2000-2021 the FFmpeg developers
```

## 🔧 Troubleshooting

### If you get "command not found":
- **macOS**: Make sure Homebrew is installed: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
- **Linux**: Try `sudo apt update && sudo apt install ffmpeg`
- **Windows**: Make sure FFmpeg is in your PATH

### If Whisper still doesn't work:
1. Restart your development server
2. Check the server logs for any remaining errors
3. Try running the voice navigation again

## 🎯 After Installation

Once FFmpeg is installed:
1. Restart your Next.js development server
2. Try the voice navigation feature
3. You should see "Using local Whisper..." instead of error messages

## 📝 Alternative: Use Browser Speech Recognition

If you can't install FFmpeg, the app will fall back to browser speech recognition (if supported by your browser).
