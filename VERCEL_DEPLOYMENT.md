# 🚀 Vercel Deployment Guide

This guide will help you deploy your StormHacks 2025 project to Vercel.

## ✅ Pre-Deployment Checklist

### 1. Project Structure
- ✅ Next.js 14 app with API routes
- ✅ All backend functionality moved to `/app/api/` routes
- ✅ Mock data centralized in `/lib/mockData.ts`
- ✅ Environment detection for local vs production
- ✅ Vercel configuration files added

### 2. What's Been Optimized
- ✅ Removed backend server dependencies
- ✅ Simplified whisper API for production
- ✅ Added `.vercelignore` to exclude unnecessary files
- ✅ Updated `vercel.json` for optimal configuration
- ✅ Cleaned up package.json scripts

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new one
   - Choose your team/account
   - Confirm build settings (should auto-detect Next.js)

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

## 🔧 Configuration Details

### Environment Variables
No environment variables are required for basic functionality. The app uses:
- Mock data for development and production
- Browser speech recognition for voice features
- Client-side state management

### API Routes
All API routes are located in `/app/api/` and will be automatically deployed as serverless functions:
- `/api/shopping` - Shopping list management
- `/api/storage` - Storage items
- `/api/meals` - Meals and recipes
- `/api/whisper` - Voice recognition (fallback mode)

### Build Configuration
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node.js Version**: 18.x (auto-detected)

## 🌐 Production Features

### ✅ What Works in Production
- ✅ All UI components and pages
- ✅ Shopping list management
- ✅ Storage inventory
- ✅ Meal planning
- ✅ Calendar functionality
- ✅ Voice navigation (using browser speech recognition)
- ✅ Camera/scanning features
- ✅ Responsive design

### ⚠️ Limitations in Production
- **Voice Recognition**: Uses browser speech recognition instead of local Whisper
- **Data Persistence**: Data resets on server restart (in-memory storage)
- **File Uploads**: Limited by Vercel's serverless function constraints

## 🔄 Post-Deployment

### 1. Test Your Deployment
- Visit your Vercel URL
- Test all major features:
  - Navigation between pages
  - Adding/editing items
  - Voice navigation
  - Shopping list functionality

### 2. Monitor Performance
- Check Vercel dashboard for function execution times
- Monitor for any errors in the function logs
- Test voice features to ensure fallback works

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check that all imports are correct
   - Ensure no backend server dependencies
   - Verify all API routes export proper functions

2. **API Routes Not Working**
   - Check function logs in Vercel dashboard
   - Verify route file structure
   - Test with simple endpoints first

3. **Voice Features Not Working**
   - This is expected - browser speech recognition is used instead
   - Check browser console for speech recognition errors
   - Ensure HTTPS (required for microphone access)

### Getting Help
- Check Vercel function logs in the dashboard
- Review browser console for client-side errors
- Test locally first with `npm run build && npm start`

## 🎯 Next Steps for Production

### For a Full Production App, Consider:
1. **Database Integration**: Add PostgreSQL or MongoDB
2. **User Authentication**: Implement user accounts
3. **Real-time Updates**: Add WebSocket support
4. **File Storage**: Use Vercel Blob or AWS S3
5. **Advanced Voice**: Integrate with cloud speech services

## 📊 Performance Notes

- **Cold Starts**: First request may be slower (serverless)
- **Function Limits**: 30-second timeout for API routes
- **Memory**: 1GB limit per function
- **Concurrent**: Up to 1000 concurrent executions

Your app is now ready for Vercel deployment! 🎉
