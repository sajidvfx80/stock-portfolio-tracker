# Data Storage Explanation

## How Your Data is Stored

### Current Storage Method: Browser LocalStorage

Your portfolio data is automatically saved in your browser's **localStorage** every time you:

1. ✅ **Add a trade** - Saves immediately
2. ✅ **Add cash flow** - Saves immediately  
3. ✅ **Update opening balance** - Saves immediately
4. ✅ **Delete a transaction** - Saves immediately

### How It Works

```javascript
// Every time you make a change, the app automatically:
1. Updates the data in memory
2. Saves to browser localStorage (instant)
3. Data persists when you close/reopen the browser
```

### Storage Location

- **Where:** Your browser's localStorage (Chrome, Edge, Firefox, etc.)
- **Key:** `stock-portfolio-data`
- **Format:** JSON (JavaScript Object Notation)
- **Size Limit:** ~5-10MB (plenty for years of trading data)

### What Gets Stored

```json
{
  "openingBalance": 325000,
  "trades": [
    {
      "id": 1234567890,
      "date": "2025-12-20",
      "stocks": "Gold Mini/Laurusla",
      "profit": 11863,
      "loss": null
    }
  ],
  "cashFlows": [
    {
      "id": 1234567891,
      "date": "2025-11-05",
      "amount": 50000
    }
  ]
}
```

## Important Notes

### ✅ Advantages

1. **Automatic Saving** - No need to click "Save" button
2. **Fast** - Instant save/load
3. **Offline** - Works without internet
4. **Private** - Data stays on your computer
5. **No Setup** - Works immediately

### ⚠️ Limitations

1. **Browser-Specific** - Data only exists in the browser you use
   - Chrome data ≠ Edge data
   - Different browser = different data

2. **Device-Specific** - Data only on the computer you use
   - Desktop data ≠ Laptop data
   - Different computer = different data

3. **Can Be Cleared** - If you:
   - Clear browser data/cache
   - Use incognito/private mode
   - Uninstall browser
   - Data will be lost

4. **No Cloud Sync** - Not automatically backed up online

## Backup Your Data

### Option 1: Export Data (Recommended)

1. Click **"Export Data"** button in header
2. Downloads JSON file: `portfolio-export-YYYY-MM-DD.json`
3. Save this file somewhere safe (cloud drive, USB, etc.)
4. Can import later if needed

**How often:** Weekly or monthly backup recommended

### Option 2: Email Reports

- Click **"Send Email"** button
- Sends formatted report to your email
- Good for daily/weekly snapshots
- Email acts as backup record

## Data Persistence

### When Data is Saved

- ✅ **Immediately** when you add/edit/delete anything
- ✅ **Automatically** - no manual save needed
- ✅ **Persists** across browser sessions
- ✅ **Survives** browser restarts

### When Data Might Be Lost

- ❌ Clearing browser data/cache
- ❌ Using incognito/private browsing
- ❌ Switching browsers
- ❌ Browser corruption
- ❌ Hard drive failure (if not backed up)

## Best Practices

1. **Regular Backups**
   - Export data weekly/monthly
   - Save export files in cloud (Google Drive, OneDrive, etc.)

2. **Use Same Browser**
   - Stick to one browser (Chrome, Edge, etc.)
   - Don't switch browsers frequently

3. **Email Reports**
   - Send daily/weekly email reports
   - Email inbox acts as backup

4. **Don't Clear Browser Data**
   - Avoid clearing localStorage
   - Be careful with browser cleanup tools

## Future Enhancements (Possible)

If you need cloud storage or multi-device sync, we could add:

1. **Cloud Database** (Firebase, Supabase)
   - Sync across devices
   - Automatic cloud backup
   - Requires account setup

2. **File-Based Storage**
   - Save to local file system
   - More permanent storage
   - Requires file permissions

3. **Server Backend**
   - Dedicated database
   - Full control
   - Requires hosting/server

## Current Status

✅ **Your data is automatically saved every time you make a change**

✅ **Data persists when you close and reopen the browser**

✅ **Use "Export Data" button regularly for backups**

✅ **Use "Send Email" for daily reports/backups**

---

**Summary:** Your data is saved automatically in your browser. It persists between sessions but is specific to that browser/device. Use the Export feature regularly for backups!

