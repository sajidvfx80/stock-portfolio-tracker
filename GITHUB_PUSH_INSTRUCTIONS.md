# Push to GitHub and Deploy to Netlify

## Step 1: Create GitHub Repository (if you don't have one)

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in:
   - Repository name: `stock-portfolio-tracker` (or any name you prefer)
   - Description: "Stock Portfolio Tracker with dark mode and modern UI"
   - Choose **Public** or **Private**
   - **DO NOT** initialize with README, .gitignore, or license (we already have files)
4. Click **"Create repository"**

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Replace YOUR_USERNAME with your GitHub username
# Replace REPOSITORY_NAME with the repository name you created

git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git
git branch -M main
git push -u origin main
```

**OR if you already have the repository URL:**

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Connect Netlify to GitHub

1. Go to [app.netlify.com](https://app.netlify.com)
2. Sign in to your account
3. Click **"Add new site"** → **"Import an existing project"**
4. Click **"Deploy with GitHub"**
5. Authorize Netlify to access your GitHub account
6. Select your repository (`stock-portfolio-tracker` or whatever you named it)
7. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
8. Click **"Deploy site"**

## Step 4: Future Updates

Every time you make changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

Netlify will automatically detect the push and redeploy your site!

---

**Quick Commands Summary:**

```bash
# Check current remote (if any)
git remote -v

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main

# For future pushes
git add .
git commit -m "Your message"
git push
```

