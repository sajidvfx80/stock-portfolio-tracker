import { saveData as saveLocalData, loadData as loadLocalData } from './storage';

const API_BASE = '/.netlify/functions';

/**
 * Initialize database (create tables if they don't exist)
 */
export const initializeDatabase = async () => {
  try {
    const response = await fetch(`${API_BASE}/init-db`);
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Database initialization failed:', result);
      throw new Error(result.error || 'Failed to initialize database');
    }
    
    console.log('Database initialized:', result);
    return { success: true, message: result.message };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { 
      success: false, 
      error: error.message,
      details: error.details || 'Check Netlify function logs'
    };
  }
};

/**
 * Load portfolio data from Neon database
 * Falls back to localStorage if Neon fails
 */
export const loadDataFromNeon = async () => {
  try {
    // Initialize database first (idempotent - safe to call multiple times)
    await initializeDatabase();
    
    const response = await fetch(`${API_BASE}/get-portfolio`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Ensure data structure is valid
    const validData = {
      openingBalance: data.openingBalance || 0,
      trades: Array.isArray(data.trades) ? data.trades : [],
      cashFlows: Array.isArray(data.cashFlows) ? data.cashFlows : [],
    };
    
    console.log('Data loaded from Neon successfully:', validData);
    console.log('Trades count:', validData.trades.length);
    console.log('Cash flows count:', validData.cashFlows.length);
    
    // Also save to localStorage as backup
    saveLocalData(validData);
    
    return validData;
  } catch (error) {
    console.error('Error loading from Neon:', error);
    
    // Fallback to localStorage
    const localData = loadLocalData();
    console.log('Fallback to localStorage:', localData);
    return localData;
  }
};

/**
 * Save portfolio data to Neon database
 * Also saves to localStorage as backup
 */
export const saveDataToNeon = async (data) => {
  try {
    // Initialize database first (idempotent)
    await initializeDatabase();
    
    const response = await fetch(`${API_BASE}/save-portfolio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Also save to localStorage as backup
    saveLocalData(data);
    
    console.log('Data saved to Neon successfully');
    return { success: true };
  } catch (error) {
    console.error('Error saving to Neon:', error);
    
    // Fallback to localStorage if Neon fails
    saveLocalData(data);
    
    return {
      success: false,
      error: error.message,
      fallback: 'localStorage',
    };
  }
};

/**
 * Check if Neon is configured (check if we're on Netlify)
 */
export const isNeonConfigured = () => {
  // Check if we're in a Netlify environment
  // In production, NETLIFY_DATABASE_URL will be available to functions
  // For client-side, we check if we can reach the functions
  return typeof window !== 'undefined' && window.location.hostname.includes('netlify.app');
};

/**
 * Diagnostic function for Neon
 */
export const diagnoseNeon = async () => {
  const results = {
    neonConfigured: false,
    connectionWorking: false,
    dataExists: false,
    dataStructure: null,
    error: null,
  };

  try {
    results.neonConfigured = isNeonConfigured();
    
    if (!results.neonConfigured) {
      results.error = 'Not on Netlify or Neon not configured';
      return results;
    }

    // Try to initialize database
    const initResult = await initializeDatabase();
    if (!initResult.success) {
      results.error = 'Failed to initialize database';
      return results;
    }

    // Try to load data
    const data = await loadDataFromNeon();
    
    results.connectionWorking = true;
    results.dataExists = data.trades.length > 0 || data.cashFlows.length > 0 || data.openingBalance > 0;
    
    results.dataStructure = {
      hasOpeningBalance: data.openingBalance > 0,
      tradesCount: data.trades.length,
      cashFlowsCount: data.cashFlows.length,
      sampleData: {
        openingBalance: data.openingBalance,
        trades: data.trades.slice(0, 2),
        cashFlows: data.cashFlows.slice(0, 2),
      },
    };
  } catch (error) {
    results.error = error.message;
    results.connectionWorking = false;
  }

  return results;
};

