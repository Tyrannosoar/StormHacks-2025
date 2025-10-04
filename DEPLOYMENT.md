# Vercel Deployment Guide

## 🚀 Deploy to Vercel

This project is now configured for Vercel deployment with the following changes:

### ✅ What's Been Set Up

1. **Next.js API Routes**: All backend functionality moved to `/app/api/` routes
2. **Mock Data**: Centralized in `/lib/mockData.ts` for easy management
3. **Environment Detection**: API calls automatically use local backend in development, Next.js API routes in production
4. **Vercel Configuration**: `vercel.json` and `.vercelignore` files added

### 📁 New API Routes Created

- `/api/shopping` - Shopping list management
- `/api/shopping/[id]` - Individual shopping item operations
- `/api/shopping/[id]/toggle` - Toggle item completion
- `/api/storage` - Storage items
- `/api/meals` - Meals and recipes
- `/api/whisper` - Voice recognition (existing)

### 🔧 Deployment Steps

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
   - Confirm build settings

### 🌐 Production vs Development

- **Development**: Uses backend server on port 3001
- **Production**: Uses Next.js API routes (no separate backend needed)

### 📝 Notes

- **Voice Recognition**: Will work in production but requires Whisper to be installed on the server
- **Data Persistence**: Currently uses in-memory data (resets on server restart)
- **Database**: For production use, consider adding a database like PostgreSQL or MongoDB

### 🔄 Future Improvements

1. Add database integration for persistent data
2. Implement user authentication
3. Add real-time updates with WebSockets
4. Optimize for serverless functions

### 🐛 Troubleshooting

If deployment fails:
1. Check that all imports are correct
2. Ensure all API routes are properly exported
3. Verify environment variables are set
4. Check Vercel function logs for errors
