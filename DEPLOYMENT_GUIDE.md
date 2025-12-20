# Deployment Guide - Deploy Your Portfolio Tracker Online

This guide will help you deploy your Stock Portfolio Tracker to the internet so you can access it from anywhere.

## Recommended Hosting Services (All Free)

### 🥇 **1. Vercel (Recommended - Easiest)**

**Why Vercel:**
- ✅ **Free forever** - No credit card needed
- ✅ **Easiest setup** - Just connect GitHub
- ✅ **Automatic deployments** - Deploys on every push
- ✅ **Fast CDN** - Global content delivery
- ✅ **Custom domain** - Free SSL certificate
- ✅ **Perfect for React/Vite apps**

**Steps:**
1. Push your code to GitHub (if not already)
2. Go to [vercel.com](https://vercel.com)
3. Sign up with GitHub
4. Click "New Project"
5. Import your repository
6. Click "Deploy" (no configuration needed!)
7. Done! Your site is live in 2 minutes

---

### 🥈 **2. Netlify (Also Great)**

**Why Netlify:**
- ✅ **Free tier** - 100GB bandwidth/month
- ✅ **Easy drag-and-drop** deployment
- ✅ **Continuous deployment** from GitHub
- ✅ **Free SSL** - HTTPS enabled
- ✅ **Custom domains**

**Steps:**
1. Build your app: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Sign up (free)
4. Drag and drop the `dist` folder
5. Or connect GitHub for auto-deploy
6. Done!

---

### 🥉 **3. Firebase Hosting (You Already Have Firebase!)**

**Why Firebase Hosting:**
- ✅ **Free tier** - 10GB storage, 360MB/day transfer
- ✅ **You already have Firebase account**
- ✅ **Fast CDN**
- ✅ **Free SSL**

**Steps:**
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

---

## Quick Deployment Steps (Vercel - Recommended)

### Step 1: Prepare Your Code

1. Make sure your code is in a Git repository (GitHub)
2. If not on GitHub yet:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
   Then push to GitHub

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up** with GitHub (free)
3. **Click "Add New Project"**
4. **Import your repository**
5. **Configure:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Click "Deploy"**
7. **Wait 2-3 minutes**
8. **Your site is live!** 🎉

### Step 3: Access Your Site

- Vercel gives you a URL like: `your-app-name.vercel.app`
- You can access it from anywhere!
- Share the link with anyone

---

## Alternative: Manual Build & Deploy

If you prefer to deploy manually:

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with all production files.

### Deploy Options:

1. **Netlify Drag & Drop:**
   - Go to netlify.com
   - Drag the `dist` folder
   - Done!

2. **GitHub Pages:**
   - Push `dist` folder to `gh-pages` branch
   - Enable GitHub Pages in settings

3. **Any Static Hosting:**
   - Upload `dist` folder contents
   - Works on any web server

---

## Important Notes

### Before Deploying:

1. **Test locally:**
   ```bash
   npm run build
   npm run preview
   ```
   Make sure everything works!

2. **Environment Variables:**
   - Firebase config is already in code (fine for client-side)
   - EmailJS config is in code (fine for client-side)
   - No secrets needed!

3. **Data Storage:**
   - Firebase will work online (if configured)
   - localStorage will work per browser/device
   - Cloud sync will work across all devices!

### After Deploying:

1. **Test the live site**
2. **Check Firebase sync** (if configured)
3. **Test email functionality**
4. **Access from different devices**

---

## Custom Domain (Optional)

All hosting services allow custom domains:
- Vercel: Free SSL, easy setup
- Netlify: Free SSL, easy setup
- Firebase: Free SSL, easy setup

Just add your domain in the hosting dashboard!

---

## Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify build completes successfully
3. Check hosting service logs
4. Make sure all dependencies are in package.json

---

**Recommended: Use Vercel - It's the easiest and fastest!** 🚀

