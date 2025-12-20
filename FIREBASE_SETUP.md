# Firebase Setup Guide

Follow these steps to set up Firebase Firestore for automatic cloud storage and sync.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `stock-portfolio-tracker` (or any name you prefer)
4. Click **Continue**
5. **Disable Google Analytics** (optional, not needed for this app) or enable it if you want
6. Click **Create project**
7. Wait for project creation (takes ~30 seconds)
8. Click **Continue**

## Step 2: Enable Firestore Database

1. In Firebase Console, click **"Firestore Database"** in the left menu
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
   - This allows read/write access (we'll secure it later if needed)
4. Click **Next**
5. Choose a **location** (choose closest to you, e.g., `us-central`, `asia-south1`)
6. Click **Enable**

## Step 3: Get Firebase Configuration

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** `</>` (or "Add app" → Web)
5. Register app:
   - App nickname: `Stock Portfolio Tracker`
   - Check "Also set up Firebase Hosting" (optional, can skip)
   - Click **Register app**
6. Copy the **firebaseConfig** object that appears

It will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

## Step 4: Configure Your App

1. Open `src/config/firebase.js` in your project
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",           // Replace this
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // Replace this
  projectId: "YOUR_PROJECT_ID",         // Replace this
  storageBucket: "YOUR_PROJECT_ID.appspot.com",  // Replace this
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // Replace this
  appId: "YOUR_APP_ID"                   // Replace this
};
```

**Example:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrstuvw",
  authDomain: "stock-portfolio-abc123.firebaseapp.com",
  projectId: "stock-portfolio-abc123",
  storageBucket: "stock-portfolio-abc123.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

## Step 5: Set Firestore Security Rules (Optional but Recommended)

1. In Firebase Console, go to **Firestore Database**
2. Click **"Rules"** tab
3. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to portfolios collection
    match /portfolios/{document=**} {
      allow read, write: if true; // For now, allow all access
      // Later you can add authentication:
      // allow read, write: if request.auth != null;
    }
  }
}
```

4. Click **"Publish"**

> **Note:** For production, you should add authentication. For now, test mode is fine for personal use.

## Step 6: Test the Integration

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the app**:
   ```bash
   npm run dev
   ```

3. **Check the app**:
   - You should see a **"Synced"** indicator in the header (green cloud icon)
   - Add a trade or cash flow
   - Check Firebase Console → Firestore Database → `portfolios` collection
   - You should see your data there!

## Step 7: Verify Cloud Sync

1. **Add some test data** in the app
2. **Open Firebase Console** → Firestore Database
3. You should see:
   - Collection: `portfolios`
   - Document: `user-portfolio`
   - Fields: `openingBalance`, `trades`, `cashFlows`, `lastUpdated`

4. **Test multi-device sync** (optional):
   - Open the app in another browser/device
   - Data should appear automatically!

## Troubleshooting

### "Synced" indicator not showing?
- Check browser console for errors (F12)
- Verify Firebase config is correct in `src/config/firebase.js`
- Make sure Firestore is enabled in Firebase Console

### "Offline" indicator showing?
- Check internet connection
- Verify Firebase config is correct
- Check browser console for errors
- App will still work with localStorage as backup

### Data not syncing?
- Check Firebase Console → Firestore Database
- Verify Firestore rules allow read/write
- Check browser console for errors
- Try refreshing the page

### Firebase errors in console?
- Make sure you copied the config correctly
- Verify project ID matches
- Check that Firestore is enabled
- Verify API key is correct

## Security Notes

### Current Setup (Test Mode)
- **Anyone with your Firebase config can access your data**
- **Fine for personal use** on your own computer
- **Not recommended for sharing** or production

### For Better Security (Optional)
1. Enable Firebase Authentication
2. Update Firestore rules to require authentication
3. Add user login to the app

## Free Tier Limits

Firebase Free Tier includes:
- ✅ **1GB storage** - Enough for ~100,000+ trades
- ✅ **50,000 reads/day** - More than enough for daily use
- ✅ **20,000 writes/day** - Can add 20,000 transactions per day
- ✅ **Real-time sync** - Included
- ✅ **Offline support** - Included

**You'll likely never exceed the free tier!**

## What Happens Now?

✅ **Automatic Cloud Sync**
- Every change saves to Firebase automatically
- Data syncs across all your devices
- Real-time updates

✅ **Offline Support**
- Works offline (saves locally)
- Syncs when you come back online
- Never lose data

✅ **Backup**
- Data stored in Google's cloud
- Automatic backups by Google
- localStorage as additional backup

✅ **Multi-Device**
- Open app on phone → Same data
- Open app on tablet → Same data
- Open app on desktop → Same data

## Need Help?

If you encounter issues:
1. Check browser console (F12) for errors
2. Verify Firebase config is correct
3. Make sure Firestore is enabled
4. Check internet connection
5. Try refreshing the page

---

**You're all set!** Your portfolio data will now automatically sync to the cloud! 🚀

