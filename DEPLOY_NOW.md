# 🚀 Deploy Your Portfolio Tracker Online - Step by Step

## Option 1: Vercel (EASIEST - Recommended) ⭐

### Step 1: Create GitHub Account & Repository

1. **Go to [github.com](https://github.com)** and sign up (free)
2. **Click the "+" icon** (top right) → **"New repository"**
3. **Name it:** `stock-portfolio-tracker` (or any name you like)
4. **Make it Public** (or Private - both work)
5. **DON'T** check "Initialize with README" (we already have files)
6. **Click "Create repository"**

### Step 2: Upload Your Code to GitHub

**Option A: Using GitHub Desktop (Easiest)**
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Install and sign in
3. Click "File" → "Add Local Repository"
4. Select your folder: `K:\Websites\Stock Portfolio`
5. Click "Publish repository"
6. Done!

**Option B: Using Command Line (If you have Git installed)**
Run these commands in PowerShell:
```powershell
cd "K:\Websites\Stock Portfolio"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```
(Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual GitHub username and repository name)

### Step 3: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Sign Up"** → Choose **"Continue with GitHub"**
3. **Authorize Vercel** to access your GitHub
4. **Click "Add New Project"**
5. **Find your repository** (`stock-portfolio-tracker`) and click **"Import"**
6. **Click "Deploy"** (no changes needed - it auto-detects Vite!)
7. **Wait 2-3 minutes** for deployment
8. **Done!** 🎉 Your site is live!

**Your live URL will be:** `your-app-name.vercel.app`

---

## Option 2: Netlify (No GitHub Needed - Drag & Drop)

### Step 1: Build Your App

Double-click **`deploy.bat`** in your project folder, or run:
```powershell
npm run build
```

This creates a `dist` folder with all your website files.

### Step 2: Deploy to Netlify

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up** (free, no credit card needed)
3. **Drag and drop** the **`dist`** folder onto the Netlify page
4. **Wait 1-2 minutes**
5. **Done!** Your site is live! 🎉

**Your live URL will be:** `random-name-123.netlify.app`

---

## Option 3: Firebase Hosting (You Already Have Firebase!)

### Step 1: Install Firebase Tools

Open PowerShell and run:
```powershell
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```powershell
firebase login
```
This will open your browser - click "Allow"

### Step 3: Initialize Hosting

```powershell
cd "K:\Websites\Stock Portfolio"
firebase init hosting
```

**Answer the questions:**
- Use an existing project? → **Yes**
- Select project: → Choose `trade-portfolio-26aa2`
- What do you want to use as your public directory? → Type: **dist**
- Configure as a single-page app? → **Yes**
- Set up automatic builds? → **No**
- File dist/index.html already exists. Overwrite? → **No**

### Step 4: Build and Deploy

```powershell
npm run build
firebase deploy
```

**Your live URL will be:** `trade-portfolio-26aa2.web.app`

---

## ✅ After Deployment

1. **Test your live site** - Open the URL in your browser
2. **Check Firebase sync** - If you configured Firebase, it should work online too
3. **Test email functionality** - Try sending a portfolio report
4. **Access from your phone** - Open the URL on any device!

---

## 🎯 Which Option Should You Choose?

- **Vercel** → Best for automatic updates (when you push to GitHub)
- **Netlify** → Best for quick drag-and-drop deployment
- **Firebase** → Best if you want everything in one place (database + hosting)

**My Recommendation: Use Vercel** - It's the easiest and gives you automatic updates!

---

## 📱 Access Your Site From Anywhere

Once deployed, you can:
- ✅ Access from any computer
- ✅ Access from your phone/tablet
- ✅ Share the link with anyone
- ✅ Bookmark it for quick access

---

## 🔄 Updating Your Site Later

**If using Vercel:**
- Just push changes to GitHub
- Vercel automatically updates your site!

**If using Netlify/Firebase:**
- Run `npm run build`
- Drag `dist` folder to Netlify again, or run `firebase deploy`

---

**Need help? Let me know which option you want to use!**

