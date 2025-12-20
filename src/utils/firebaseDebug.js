import { db } from '../config/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';

/**
 * Diagnostic tool to check Firebase connection and data
 */
export const diagnoseFirebase = async () => {
  const results = {
    firebaseConfigured: false,
    connectionWorking: false,
    dataExists: false,
    dataStructure: null,
    error: null,
  };

  try {
    // Check if Firebase is configured
    const { firebaseConfig } = await import('../config/firebase');
    results.firebaseConfigured = !!(
      firebaseConfig &&
      firebaseConfig.apiKey &&
      firebaseConfig.projectId
    );

    if (!results.firebaseConfigured) {
      results.error = 'Firebase not configured';
      return results;
    }

    // Try to read from Firestore
    const portfolioRef = doc(db, 'portfolios', 'user-portfolio');
    const docSnap = await getDoc(portfolioRef);

    results.connectionWorking = true;

    if (docSnap.exists()) {
      results.dataExists = true;
      const data = docSnap.data();
      results.dataStructure = {
        hasOpeningBalance: 'openingBalance' in data,
        tradesCount: Array.isArray(data.trades) ? data.trades.length : 'not an array',
        cashFlowsCount: Array.isArray(data.cashFlows) ? data.cashFlows.length : 'not an array',
        keys: Object.keys(data),
        sampleData: {
          openingBalance: data.openingBalance,
          trades: data.trades?.slice(0, 2) || [],
          cashFlows: data.cashFlows?.slice(0, 2) || [],
        },
      };
    } else {
      results.dataExists = false;
      results.error = 'Document does not exist in Firebase';
    }
  } catch (error) {
    results.error = error.message;
    results.connectionWorking = false;
  }

  return results;
};

