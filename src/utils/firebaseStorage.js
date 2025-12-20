import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { firebaseConfig } from '../config/firebase';
import { saveData as saveLocalData, loadData as loadLocalData } from './storage';

const COLLECTION_NAME = 'portfolios';
const DOCUMENT_ID = 'user-portfolio'; // Single document for user's portfolio

/**
 * Save portfolio data to Firebase Firestore
 * Also saves to localStorage as backup
 */
export const saveDataToFirebase = async (data) => {
  try {
    // Save to Firebase
    const portfolioRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    await setDoc(portfolioRef, {
      ...data,
      lastUpdated: serverTimestamp(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // Also save to localStorage as backup
    saveLocalData(data);

    console.log('Data saved to Firebase successfully');
    return { success: true };
  } catch (error) {
    console.error('Error saving to Firebase:', error);
    
    // Fallback to localStorage if Firebase fails
    saveLocalData(data);
    
    return { 
      success: false, 
      error: error.message,
      fallback: 'localStorage' 
    };
  }
};

/**
 * Load portfolio data from Firebase Firestore
 * Falls back to localStorage if Firebase fails
 */
export const loadDataFromFirebase = async () => {
  try {
    const portfolioRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const docSnap = await getDoc(portfolioRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Remove Firebase metadata
      const { lastUpdated, updatedAt, ...portfolioData } = data;
      
      // Ensure data structure is valid
      const validData = {
        openingBalance: portfolioData.openingBalance || 0,
        trades: Array.isArray(portfolioData.trades) ? portfolioData.trades : [],
        cashFlows: Array.isArray(portfolioData.cashFlows) ? portfolioData.cashFlows : [],
      };
      
      console.log('Data loaded from Firebase successfully:', validData);
      console.log('Trades count:', validData.trades.length);
      console.log('Cash flows count:', validData.cashFlows.length);
      
      // Also save to localStorage as backup
      saveLocalData(validData);
      
      return validData;
    } else {
      // No data in Firebase, try localStorage
      console.log('No data in Firebase, loading from localStorage');
      const localData = loadLocalData();
      console.log('Local data loaded:', localData);
      return localData;
    }
  } catch (error) {
    console.error('Error loading from Firebase:', error);
    
    // Fallback to localStorage
    const localData = loadLocalData();
    console.log('Fallback to localStorage:', localData);
    return localData;
  }
};

/**
 * Set up real-time listener for portfolio data
 * Automatically updates when data changes (even from other devices)
 */
export const subscribeToPortfolioData = (callback) => {
  try {
    const portfolioRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    
    const unsubscribe = onSnapshot(
      portfolioRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const { lastUpdated, updatedAt, ...portfolioData } = data;
          
          // Ensure data structure is valid
          const validData = {
            openingBalance: portfolioData.openingBalance || 0,
            trades: Array.isArray(portfolioData.trades) ? portfolioData.trades : [],
            cashFlows: Array.isArray(portfolioData.cashFlows) ? portfolioData.cashFlows : [],
          };
          
          console.log('Firebase snapshot - data updated:', validData);
          
          // Save to localStorage as backup
          saveLocalData(validData);
          
          // Call callback with updated data
          callback(validData);
        } else {
          // No data yet, load from localStorage
          console.log('Firebase snapshot - no data, using localStorage');
          const localData = loadLocalData();
          callback(localData);
        }
      },
      (error) => {
        console.error('Firebase snapshot error:', error);
        // Fallback to localStorage
        const localData = loadLocalData();
        callback(localData);
      }
    );

    return unsubscribe; // Return unsubscribe function
  } catch (error) {
    console.error('Error setting up Firebase listener:', error);
    // Fallback to localStorage
    const localData = loadLocalData();
    callback(localData);
    return () => {}; // Return empty unsubscribe function
  }
};

/**
 * Check if Firebase is configured
 */
export const isFirebaseConfigured = () => {
  try {
    // Check if API key is set (not placeholder)
    return firebaseConfig && 
           firebaseConfig.apiKey && 
           firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
           firebaseConfig.projectId && 
           firebaseConfig.projectId !== 'YOUR_PROJECT_ID';
  } catch (error) {
    return false;
  }
};

/**
 * Get sync status
 */
export const getSyncStatus = async () => {
  try {
    const portfolioRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const docSnap = await getDoc(portfolioRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        synced: true,
        lastSynced: data.updatedAt || data.lastUpdated,
        source: 'firebase'
      };
    }
    return {
      synced: false,
      source: 'localStorage'
    };
  } catch (error) {
    return {
      synced: false,
      source: 'localStorage',
      error: error.message
    };
  }
};

