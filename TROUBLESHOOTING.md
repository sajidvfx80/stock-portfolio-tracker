# 🔍 Troubleshooting: Data Not Showing on Netlify

## Step 1: Check Firebase Rules ✅

**Make sure Firebase rules are updated:**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **trade-portfolio-26aa2**
3. Go to **Firestore Database** → **Rules** tab
4. Rules should be:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /portfolios/{document} {
         allow read, write: if true;
       }
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```
5. Click **"Publish"** if not already published

---

## Step 2: Use the Diagnostic Tool 🔧

**On your Netlify site:**

1. Look for the **"Diagnose"** button (purple button next to Refresh)
2. Click it
3. It will show you:
   - ✅ Is Firebase configured?
   - ✅ Is connection working?
   - ✅ Does data exist in Firebase?
   - ✅ What's the data structure?

**This will tell us exactly what's wrong!**

---

## Step 3: Check Browser Console 📊

**On your Netlify site:**

1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Look for messages:
   - ✅ "Loading data from Firebase..."
   - ✅ "Data loaded from Firebase successfully"
   - ✅ "Trades count: X"
   - ❌ Any error messages (red text)

**Take a screenshot or copy the error messages**

---

## Step 4: Verify Data Exists in Firebase 🔍

**Check if your data is actually in Firebase:**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **trade-portfolio-26aa2**
3. Go to **Firestore Database** → **Data** tab
4. Look for:
   - Collection: `portfolios`
   - Document: `user-portfolio`
5. **Does it exist?**
   - ✅ **Yes** → Data is there, rules might be blocking
   - ❌ **No** → Data was never saved to Firebase (only in localStorage)

---

## Step 5: Save Data to Firebase from Local System 💾

**If data doesn't exist in Firebase:**

1. Open your app **locally** (`npm run dev`)
2. Make sure you see **"Synced"** (green) in the header
3. Open browser console (F12)
4. Add a test trade
5. Check console for: **"Data saved to Firebase successfully"**
6. If you see errors, Firebase rules might be blocking writes

---

## Common Issues & Solutions

### Issue 1: "Data Exists: No" in Diagnostic
**Solution:** Data was never saved to Firebase. Save it from your local system first.

### Issue 2: "Connection Working: No" in Diagnostic
**Solution:** Check Firebase configuration in `src/config/firebase.js`

### Issue 3: Console shows "Permission denied"
**Solution:** Firebase rules are blocking access. Update rules (Step 1).

### Issue 4: Data exists but shows empty
**Solution:** Data structure might be wrong. Check console logs for data structure.

---

## Quick Test Checklist ✅

- [ ] Firebase rules updated and published
- [ ] Data exists in Firebase Console
- [ ] Diagnostic tool shows "Data Exists: Yes"
- [ ] Browser console shows no errors
- [ ] Clicked "Refresh" button
- [ ] Checked console logs for data structure

---

## Need More Help?

**Share with me:**
1. What the **Diagnostic tool** shows
2. Any **error messages** from browser console
3. Whether **data exists** in Firebase Console

Then I can help you fix it! 🚀
