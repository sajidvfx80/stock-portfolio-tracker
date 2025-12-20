import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCseA8nHM2EC-P3LxwoCTrIcfGvNZpXXgM",
  authDomain: "trade-portfolio-26aa2.firebaseapp.com",
  projectId: "trade-portfolio-26aa2",
  storageBucket: "trade-portfolio-26aa2.firebasestorage.app",
  messagingSenderId: "547503057974",
  appId: "1:547503057974:web:237bce071c8ec1c977bc97",
  measurementId: "G-GGC28GLZJ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Enable offline persistence (cache data locally)
// This allows the app to work offline and sync when online
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn('Firebase persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // Browser doesn't support persistence
      console.warn('Firebase persistence not supported in this browser');
    }
  });
} catch (error) {
  console.warn('Firebase persistence error:', error);
}

export default app;

