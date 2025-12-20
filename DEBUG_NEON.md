# 🔍 Debug Neon Database Connection

## Step 1: Test Database Connection

After deploying, test the connection directly:

**Open this URL in your browser:**
```
https://papaya-peony-40bf64.netlify.app/.netlify/functions/test-db
```

This will show you:
- ✅ If `NETLIFY_DATABASE_URL` is set
- ✅ If connection works
- ✅ The actual error message

---

## Step 2: Check Function Logs

1. **Go to Netlify Dashboard**
2. **Your Site** → **Functions** tab (or **Logs & metrics** → **Functions**)
3. **Click on `init-db` function**
4. **Go to "Logs" tab**
5. **Look for error messages**

**Common errors you might see:**

### Error: "NETLIFY_DATABASE_URL is not set"
**Solution:** Database not claimed
- Go to **Neon** section in Netlify
- Click **"Connect Neon"** to claim database
- Redeploy site

### Error: "Connection refused" or "ECONNREFUSED"
**Solution:** Database not active
- Check if database is expired
- Re-claim database if needed

### Error: "permission denied" or "authentication failed"
**Solution:** Database credentials issue
- Try disconnecting and reconnecting Neon
- Check if database is claimed

---

## Step 3: Verify Database is Claimed

1. **Go to Netlify Dashboard**
2. **Click "Neon" in left sidebar**
3. **Check if you see:**
   - ✅ Database name (not "temporary")
   - ✅ No "Connect Neon" button (already connected)
   - ✅ Environment variables visible

**If you see "Connect Neon" button:**
- Click it to claim the database
- Wait for it to connect
- Redeploy your site

---

## Step 4: Check Environment Variables

1. **Netlify Dashboard** → **Your Site**
2. **Site settings** → **Environment variables**
3. **Look for:**
   - `NETLIFY_DATABASE_URL`
   - `NETLIFY_DATABASE_URL_UNPOOLED`

**If they don't exist:**
- Database is not claimed
- Go back to Step 3

---

## Step 5: Test init-db Function Directly

**Open this URL:**
```
https://papaya-peony-40bf64.netlify.app/.netlify/functions/init-db
```

**You should see:**
- ✅ `{"success": true, "message": "Database initialized successfully"}`
- ❌ OR an error message with details

---

## Quick Fix Checklist

- [ ] Database is **claimed** in Neon section
- [ ] Environment variables exist (`NETLIFY_DATABASE_URL`)
- [ ] Site has been **redeployed** after claiming
- [ ] Checked function logs for specific error
- [ ] Tested `test-db` function URL
- [ ] Tested `init-db` function URL

---

## Share the Results

After testing, share with me:
1. What `test-db` function shows
2. What `init-db` function shows  
3. Any errors from function logs

Then I can help you fix it! 🚀

