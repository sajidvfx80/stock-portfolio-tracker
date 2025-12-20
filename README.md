# Sajid Stock Portfolio Tracker

An advanced web application for tracking daily trading profits, losses, and portfolio balance with comprehensive analytics and visualizations.

## Features

### 📊 Dashboard
- Real-time balance calculation
- Key metrics display (Current Balance, Total P/L, ROI, Cash Flow)
- Balance over time chart
- Recent trades and cash flows overview
- Editable opening balance

### ➕ Trade Management
- Add daily trades with profit/loss tracking
- Stock name tracking
- Date-based organization
- Automatic validation (profit OR loss, not both)

### 💰 Cash Flow Management
- Track cash inflows and outflows
- Separate cash in/out tracking
- Total cash flow summaries
- Date-based organization

### 📋 Transaction History
- Complete transaction log (trades + cash flows)
- Advanced filtering (by type, search)
- Multiple sorting options (date, amount)
- Delete functionality

### 📈 Analytics
- **Performance Metrics:**
  - Total trades count
  - Win rate percentage
  - ROI (Return on Investment)
  - Profit factor
- **Trade Analysis:**
  - Winning vs losing trades breakdown
  - Average profit and loss
  - Best and worst trades
- **Visualizations:**
  - Daily profit/loss trend chart
  - Daily performance summary table

### 💾 Data Management
- Local storage persistence (data saved in browser)
- Export data to JSON
- **Email portfolio reports** - Send daily reports to your email automatically
- No server required - fully client-side

## Getting Started

### 🚀 Quick Launch (One-Click)

**Windows Users:** Simply double-click **`launch.bat`** to start the application!

The script will automatically:
- Install dependencies on first run (if needed)
- Start the development server
- Open the app in your browser

> **Note:** Make sure Node.js is installed. Download from [nodejs.org](https://nodejs.org/)

### Manual Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🌐 Deploy Online (Access From Anywhere!)

Your portfolio tracker can be deployed online for free so you can access it from any device, anywhere!

### Quick Deploy Options:

1. **Vercel (Recommended - Easiest)** ⭐
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub (free)
   - Import your repository
   - Click "Deploy" - Done in 2 minutes!

2. **Netlify (Drag & Drop)**
   - Run `npm run build`
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Done!

3. **Firebase Hosting (You Already Have Firebase!)**
   - Install: `npm install -g firebase-tools`
   - Login: `firebase login`
   - Initialize: `firebase init hosting`
   - Deploy: `npm run build && firebase deploy`

**See `QUICK_DEPLOY.md` for step-by-step instructions!**

> **Note:** All hosting services offer free tiers - no credit card needed!

## Usage

1. **Set Opening Balance:** Go to Dashboard and click "Edit" to set your initial balance.

2. **Add Trades:** Navigate to "Add Trade" tab and enter:
   - Date
   - Stock name
   - Either profit OR loss (not both)

3. **Manage Cash Flow:** Use the "Cash Flow" tab to record:
   - Cash deposits (Cash In)
   - Cash withdrawals (Cash Out)

4. **View History:** Check "History" tab to see all transactions with filtering and sorting options.

5. **Analyze Performance:** Visit "Analytics" tab for detailed insights and charts.

6. **Send Email Report:** Click the "Send Email" button in the header to email your portfolio report to sajidvfx@yahoo.com

> **Note:** Email functionality requires EmailJS setup. See `EMAIL_SETUP.md` for configuration instructions.

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Chart visualizations
- **date-fns** - Date utilities
- **Lucide React** - Icons
- **LocalStorage** - Data persistence

## Data Storage

### Cloud Storage (Firebase Firestore) - Recommended ✅

The app now supports **automatic cloud storage** with Firebase Firestore:

- ✅ **Automatic sync** - Data saves to cloud automatically
- ✅ **Multi-device** - Access your data on any device
- ✅ **Real-time updates** - Changes sync instantly
- ✅ **Offline support** - Works offline, syncs when online
- ✅ **Automatic backups** - Google handles backups
- ✅ **Free tier** - 1GB storage, 50K reads/day, 20K writes/day

**Setup:** See `FIREBASE_SETUP.md` for detailed setup instructions.

**Status Indicator:** Look for the cloud icon in the header:
- 🟢 **Synced** - Data synced to cloud
- 🟡 **Syncing...** - Currently syncing
- 🔴 **Offline** - Using local storage (Firebase not configured or offline)

### Local Storage (Backup)

Data is also saved locally in your browser's localStorage as a backup. This ensures your data is always available even if cloud sync fails.

### Export Data

Use the "Export Data" button in the header to download a JSON file backup of all your portfolio data.

## Browser Support

Works on all modern browsers that support:
- ES6+ JavaScript
- LocalStorage API
- CSS Grid and Flexbox

## License

MIT

