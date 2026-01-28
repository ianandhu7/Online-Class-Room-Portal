# Vercel Frontend Deployment Guide

## Problem Solved ✅
- Removed Python files from root directory
- Cleaned up backend folders that confused Vercel
- Created proper frontend-only configuration

## Project Structure (Frontend-Only for Vercel)
```
your-repo/
├── frontend/                 # React/Vite app
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.production
├── package.json             # Root package.json for Vercel
├── vercel.json              # Vercel configuration
├── .gitignore               # Updated for frontend-only
└── VERCEL_DEPLOYMENT.md     # This guide
```

## Backend (Separate Repository Recommended)
Your backend should be in a separate repository:
```
backend-repo/
├── simple_backend/
│   ├── api/
│   ├── classroom_portal/
│   ├── manage.py
│   └── requirements.txt
└── render.yaml              # Render configuration
```

## Step-by-Step Deployment

### 1. Prepare Your Repository
✅ **Already Done**: Cleaned up Python files from root
✅ **Already Done**: Updated .gitignore for frontend-only
✅ **Already Done**: Created proper vercel.json

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel should now detect it as a **Vite** project (not Python!)

### 3. Configure Project Settings
- **Framework Preset**: Vite (should auto-detect)
- **Root Directory**: Leave empty
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `cd frontend && npm install`

### 4. Environment Variables
Add in Vercel dashboard:
- `VITE_API_URL` = `https://classroom-portal-backend.onrender.com/api`

### 5. Deploy
Click "Deploy" - should work without Python detection!

## API Configuration

### Frontend API Client
Your frontend should use:
```javascript
// In frontend/src/api/client.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://classroom-portal-backend.onrender.com/api';
```

### Backend CORS (Already Configured)
Your Render backend accepts requests from:
- `https://your-vercel-app.vercel.app`
- `http://localhost:5173` (development)

## Test Credentials
- **Student**: `student@example.com` / `password123`
- **Teacher**: `teacher@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`

## Common Mistakes Fixed ✅

### ❌ What Was Wrong:
- Python files in root directory
- Multiple backend folders confusing Vercel
- `requirements.txt` in root
- Mixed frontend/backend in same deployment

### ✅ What's Fixed:
- Clean frontend-only structure
- Proper API proxy configuration
- Correct environment variable setup
- Separated concerns (frontend on Vercel, backend on Render)

## Troubleshooting

### If Vercel Still Detects Python:
1. Delete `.vercel` folder if it exists
2. Create a new Vercel project
3. Make sure no Python files are in root

### If API Calls Fail:
1. Check `VITE_API_URL` environment variable
2. Verify backend is running: `https://classroom-portal-backend.onrender.com/`
3. Test registration: `https://classroom-portal-backend.onrender.com/api/auth/register/`

### After Deployment:
1. Update backend CORS with your new Vercel domain
2. Test all functionality
3. Remove `CORS_ALLOW_ALL_ORIGINS = True` for security