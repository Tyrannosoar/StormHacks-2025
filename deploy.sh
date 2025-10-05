#!/bin/bash

echo "🚀 Deploying MagnaCart to Vercel..."
echo "=================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the project first
echo "📦 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Deploying to Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Deployment successful!"
        echo "Your app is now live on Vercel!"
    else
        echo "❌ Deployment failed. Check the logs above."
        exit 1
    fi
else
    echo "❌ Build failed. Please fix the errors above."
    exit 1
fi
