# 🚀 Deploy Netlify Functions - Important!

## ⚠️ Problem: Functions Not Deploying

When you **drag and drop** the `dist` folder, Netlify **only deploys the frontend**. The functions in `netlify/functions` are **NOT included**.

## ✅ Solution: Use Git Deployment (Recommended)

### Step 1: Initialize Git Repository

```powershell
cd "K:\Websites\Stock Portfolio"
git init
git add .
git commit -m "Initial commit with Neon functions"
```

### Step 2: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"New repository"**
3. Name it: `stock-portfolio-tracker`
4. **Don't** initialize with README
5. Click **"Create repository"**

### Step 3: Push to GitHub

```powershell
git remote add origin https://github.com/YOUR_USERNAME/stock-portfolio-tracker.git
git branch -M main
git push -u origin main
```

(Replace `YOUR_USERNAME` with your GitHub username)

### Step 4: Connect to Netlify

1. Go to **Netlify Dashboard**
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Select your repository: `stock-portfolio-tracker`
5. Click **"Deploy site"**

**Netlify will automatically:**
- ✅ Deploy your `dist` folder (from build)
- ✅ Deploy your `netlify/functions` folder
- ✅ Set up automatic deployments on every push

---

## ✅ Alternative: Use Netlify CLI

### Step 1: Install Netlify CLI

```powershell
npm install -g netlify-cli
```

### Step 2: Login

```powershell
netlify login
```

### Step 3: Deploy

```powershell
cd "K:\Websites\Stock Portfolio"
netlify deploy --prod
```

This will deploy **both** the site and functions!

---

## 🎯 Quick Fix: Manual Function Upload (If Available)

Some Netlify plans allow manual function upload:

1. Go to **Netlify Dashboard** → **Your Site**
2. **Functions** tab (or **Logs & metrics** → **Functions**)
3. Look for **"Upload function"** or **"Deploy function"** button
4. Upload the function files manually

---

## 📋 Recommended: Use Git

**Git deployment is best because:**
- ✅ Functions deploy automatically
- ✅ Automatic deployments on every push
- ✅ Version control
- ✅ Easy rollbacks

**After connecting to Git:**
- Every time you push to GitHub, Netlify automatically rebuilds and redeploys
- Functions are included automatically
- No manual drag-and-drop needed!

---

## 🚀 Next Steps

1. **Choose one:**
   - **Option A:** Use Git (recommended - 5 minutes setup)
   - **Option B:** Use Netlify CLI (if you prefer command line)

2. **After deploying with functions:**
   - Test: `https://papaya-peony-40bf64.netlify.app/.netlify/functions/test-db`
   - Should work now!

---

**I recommend using Git - it's the easiest and most reliable way!** 🎯

