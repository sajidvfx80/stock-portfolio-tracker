# Quick Launch Guide

## One-Click Launch

### Option 1: Batch File (Recommended for Windows)
Simply double-click **`launch.bat`** to start the application.

### Option 2: PowerShell Script
Right-click **`launch.ps1`** and select "Run with PowerShell"

### Option 3: Manual Launch
If the scripts don't work, open a terminal in this folder and run:
```bash
npm install
npm run dev
```

## First Time Setup

On first launch, the script will automatically:
1. Install all required dependencies (this may take a few minutes)
2. Start the development server
3. Open the app in your browser (usually at `http://localhost:5173`)

## Requirements

- **Node.js** must be installed on your system
- Download from: https://nodejs.org/

## Troubleshooting

If you encounter issues:

1. **"npm is not recognized"**
   - Install Node.js from https://nodejs.org/
   - Restart your computer after installation

2. **Script won't run**
   - Right-click the `.bat` file → Properties → Unblock (if available)
   - Or use PowerShell: Right-click → Run with PowerShell

3. **Port already in use**
   - Close any other applications using port 5173
   - Or modify `vite.config.js` to use a different port

4. **Dependencies fail to install**
   - Check your internet connection
   - Try deleting `node_modules` folder and `package-lock.json` (if exists)
   - Run `npm install` again

## Stopping the Server

Press `Ctrl+C` in the terminal window to stop the development server.

