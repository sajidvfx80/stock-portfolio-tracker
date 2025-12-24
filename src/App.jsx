import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TradeEntry from './components/TradeEntry';
import TransactionHistory from './components/TransactionHistory';
import CashFlowManager from './components/CashFlowManager';
import Analytics from './components/Analytics';
import EmailSender from './components/EmailSender';
import { loadData, saveData } from './utils/storage';
import { 
  loadDataFromNeon, 
  saveDataToNeon, 
  isNeonConfigured,
  diagnoseNeon
} from './utils/neonStorage';
import { Cloud, CloudOff, RefreshCw, AlertCircle, Moon, Sun, Download } from 'lucide-react';
import { useToast } from './context/ToastContext';
import { useTheme } from './context/ThemeContext';
import { exportToCSV, exportToExcel, exportToPDF } from './utils/exportUtils';

function App() {
  const [data, setData] = useState({
    openingBalance: 0,
    trades: [],
    cashFlows: [],
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNeonEnabled, setIsNeonEnabled] = useState(false);
  const [syncStatus, setSyncStatus] = useState('local'); // 'local', 'syncing', 'synced', 'error'
  const [isLoading, setIsLoading] = useState(true);
  const { success, error: showError, info, warning } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Initialize data loading
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      // Check if Neon is configured
      const neonConfigured = isNeonConfigured();
      setIsNeonEnabled(neonConfigured);

      if (neonConfigured) {
        try {
          console.log('Loading data from Neon...');
          // Try to load from Neon first
          const neonData = await loadDataFromNeon();
          console.log('Neon data loaded:', neonData);
          
          // Ensure data has required structure
          const validData = {
            openingBalance: neonData.openingBalance || 0,
            trades: neonData.trades || [],
            cashFlows: neonData.cashFlows || [],
          };
          
          setData(validData);
          setSyncStatus('synced');
          setIsLoading(false);
        } catch (error) {
          console.error('Neon initialization error:', error);
          // Fallback to localStorage
          const localData = loadData();
          setData(localData);
          setSyncStatus('error');
          setIsLoading(false);
        }
      } else {
        // Neon not configured, use localStorage only
        const localData = loadData();
        setData(localData);
        setSyncStatus('local');
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Manual refresh from Neon
  const refreshFromNeon = async () => {
    if (!isNeonEnabled) {
      warning('Neon is not configured');
      return;
    }
    
    setSyncStatus('syncing');
    try {
      const neonData = await loadDataFromNeon();
      const validData = {
        openingBalance: neonData.openingBalance || 0,
        trades: neonData.trades || [],
        cashFlows: neonData.cashFlows || [],
      };
      setData(validData);
      setSyncStatus('synced');
      
      success(`Data refreshed! Trades: ${validData.trades.length}, Cash Flows: ${validData.cashFlows.length}`, {
        title: 'Data Refreshed',
      });
    } catch (err) {
      console.error('Error refreshing from Neon:', err);
      setSyncStatus('error');
      showError(err.message || 'Error refreshing from cloud. Check console for details.', {
        title: 'Sync Error',
      });
    }
  };

  // Diagnostic function
  const runDiagnostics = async () => {
    if (!isNeonEnabled) {
      warning('Neon is not configured');
      return;
    }

    const results = await diagnoseNeon();
    
    const message = `Neon Configured: ${results.neonConfigured ? 'Yes' : 'No'}\n` +
      `Connection Working: ${results.connectionWorking ? 'Yes' : 'No'}\n` +
      `Data Exists: ${results.dataExists ? 'Yes' : 'No'}` +
      (results.dataStructure ? `\nTrades: ${results.dataStructure.tradesCount}, Cash Flows: ${results.dataStructure.cashFlowsCount}` : '');

    if (results.error) {
      showError(results.error, { title: 'Diagnostic Error' });
    } else {
      info(message, { title: 'Diagnostic Results', duration: 8000 });
    }

    console.log('🔍 Full Diagnostic Results:', results);
  };

  const updateData = async (newData) => {
    const updated = { ...data, ...newData };
    setData(updated);
    
    // Always save to localStorage first (fast, reliable backup)
    saveData(updated);

    // If Neon is enabled, also save to cloud
    if (isNeonEnabled) {
      setSyncStatus('syncing');
      try {
        const result = await saveDataToNeon(updated);
        if (result.success) {
          setSyncStatus('synced');
        } else {
          setSyncStatus('error');
        }
      } catch (error) {
        console.error('Error saving to Neon:', error);
        setSyncStatus('error');
      }
    }
  };

  const addTrade = (trade) => {
    const updatedTrades = [...data.trades, { ...trade, id: Date.now() }];
    updateData({ trades: updatedTrades });
  };

  const addCashFlow = (cashFlow) => {
    const updatedCashFlows = [...data.cashFlows, { ...cashFlow, id: Date.now() }];
    updateData({ cashFlows: updatedCashFlows });
  };

  const deleteTrade = (id) => {
    const updatedTrades = data.trades.filter(t => t.id !== id);
    updateData({ trades: updatedTrades });
  };

  const deleteCashFlow = (id) => {
    const updatedCashFlows = data.cashFlows.filter(cf => cf.id !== id);
    updateData({ cashFlows: updatedCashFlows });
  };

  const updateTrade = (updatedTrade) => {
    const updatedTrades = data.trades.map(t => 
      t.id === updatedTrade.id ? updatedTrade : t
    );
    updateData({ trades: updatedTrades });
  };

  const updateOpeningBalance = (balance) => {
    updateData({ openingBalance: balance });
  };

  const handleExport = (format) => {
    try {
      if (format === 'json') {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        success('Data exported as JSON');
      } else if (format === 'csv') {
        exportToCSV(data);
        success('Data exported as CSV');
      } else if (format === 'excel') {
        exportToExcel(data);
        success('Data exported as Excel');
      } else if (format === 'pdf') {
        exportToPDF(data);
        success('Data exported as PDF');
      }
      setExportMenuOpen(false);
    } catch (err) {
      showError('Export failed: ' + err.message);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'trade', label: 'Add Trade', icon: '➕' },
    { id: 'history', label: 'History', icon: '📋' },
    { id: 'cashflow', label: 'Cash Flow', icon: '💰' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white gradient-text">
              Sajid Stock Portfolio Tracker
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Sync Status Indicator */}
              {isNeonEnabled && (
                <>
                  <div 
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                      syncStatus === 'synced' 
                        ? 'bg-green-50 text-green-700' 
                        : syncStatus === 'syncing'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                    title={
                      syncStatus === 'synced' 
                        ? 'Synced to cloud' 
                        : syncStatus === 'syncing'
                        ? 'Syncing...'
                        : 'Sync error - using local storage'
                    }
                  >
                    {syncStatus === 'synced' ? (
                      <>
                        <Cloud className="h-4 w-4" />
                        <span className="hidden sm:inline">Synced</span>
                      </>
                    ) : syncStatus === 'syncing' ? (
                      <>
                        <Cloud className="h-4 w-4 animate-pulse" />
                        <span className="hidden sm:inline">Syncing...</span>
                      </>
                    ) : (
                      <>
                        <CloudOff className="h-4 w-4" />
                        <span className="hidden sm:inline">Offline</span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={refreshFromNeon}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition flex items-center gap-2 text-sm"
                    title="Refresh data from cloud"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                  <button
                    onClick={runDiagnostics}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition flex items-center gap-2 text-sm"
                    title="Run diagnostics"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Diagnose</span>
                  </button>
                </>
              )}
              <EmailSender data={data} />
              
              {/* Export Menu */}
              <div className="relative">
                <button
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  className="btn-primary flex items-center gap-2"
                  title="Export data"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                {exportMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setExportMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 animate-scale-in">
                      <button
                        onClick={() => handleExport('json')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                      >
                        Export as JSON
                      </button>
                      <button
                        onClick={() => handleExport('csv')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Export as CSV
                      </button>
                      <button
                        onClick={() => handleExport('excel')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Export as Excel
                      </button>
                      <button
                        onClick={() => handleExport('pdf')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                      >
                        Export as PDF
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {isLoading && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <p className="text-blue-800 dark:text-blue-200">Loading data from cloud...</p>
            </div>
          </div>
        )}
        {activeTab === 'dashboard' && (
          <Dashboard
            data={data}
            updateOpeningBalance={updateOpeningBalance}
          />
        )}
        {activeTab === 'trade' && <TradeEntry onAddTrade={addTrade} />}
        {activeTab === 'history' && (
          <TransactionHistory
            trades={data.trades}
            cashFlows={data.cashFlows}
            onDeleteTrade={deleteTrade}
            onDeleteCashFlow={deleteCashFlow}
            onUpdateTrade={updateTrade}
          />
        )}
        {activeTab === 'cashflow' && (
          <CashFlowManager
            cashFlows={data.cashFlows}
            onAddCashFlow={addCashFlow}
            onDeleteCashFlow={deleteCashFlow}
          />
        )}
        {activeTab === 'analytics' && <Analytics data={data} />}
      </main>
    </div>
  );
}

export default App;

