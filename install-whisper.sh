#!/bin/bash

echo "🎤 Installing Python Whisper for Voice Navigation"
echo "=================================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    echo "   Visit: https://www.python.org/downloads/"
    exit 1
fi

echo "✅ Python 3 found"

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "📦 Installing ffmpeg (required for Whisper)..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install ffmpeg
        else
            echo "❌ Homebrew not found. Please install ffmpeg manually:"
            echo "   brew install ffmpeg"
            echo "   Or visit: https://ffmpeg.org/download.html"
            exit 1
        fi
    else
        echo "❌ Please install ffmpeg manually:"
        echo "   Ubuntu/Debian: sudo apt install ffmpeg"
        echo "   CentOS/RHEL: sudo yum install ffmpeg"
        echo "   Or visit: https://ffmpeg.org/download.html"
        exit 1
    fi
else
    echo "✅ ffmpeg found"
fi

# Check if we're in a conda environment
if [[ "$CONDA_DEFAULT_ENV" != "" ]]; then
    echo "🐍 Detected conda environment: $CONDA_DEFAULT_ENV"
    echo "📦 Installing OpenAI Whisper in conda environment..."
    pip install openai-whisper
else
    echo "🔧 Creating virtual environment for Whisper..."
    
    # Create virtual environment
    python3 -m venv whisper-env
    
    # Activate virtual environment
    source whisper-env/bin/activate
    
    echo "📦 Installing OpenAI Whisper in virtual environment..."
    pip install openai-whisper
    
    echo "⚠️  Note: You'll need to activate the virtual environment to use Whisper:"
    echo "   source whisper-env/bin/activate"
fi

# Check if installation was successful
if command -v whisper &> /dev/null; then
    echo "✅ Whisper installed successfully!"
    echo ""
    echo "🎯 Voice Navigation Setup Complete!"
    echo "   - Python Whisper is now installed"
    echo "   - Voice navigation will use local Whisper"
    echo "   - No API keys needed - completely free!"
    echo ""
    echo "🚀 Try the voice navigation now:"
    echo "   1. Tap the floating action button"
    echo "   2. Tap the green microphone"
    echo "   3. Say 'go to shopping' or 'go to storage'"
    
    if [[ "$CONDA_DEFAULT_ENV" == "" ]]; then
        echo ""
        echo "💡 To use Whisper, activate the virtual environment:"
        echo "   source whisper-env/bin/activate"
    fi
else
    echo "❌ Whisper installation failed. Please try manually:"
    if [[ "$CONDA_DEFAULT_ENV" != "" ]]; then
        echo "   pip install openai-whisper"
    else
        echo "   python3 -m venv whisper-env"
        echo "   source whisper-env/bin/activate"
        echo "   pip install openai-whisper"
    fi
    exit 1
fi
