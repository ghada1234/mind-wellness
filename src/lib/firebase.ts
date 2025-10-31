
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChEa5H8pa4jO2fhk5HVEGruX-5lQbZJac",
  authDomain: "mindfulflow-o3lmh.firebaseapp.com",
  projectId: "mindfulflow-o3lmh",
  storageBucket: "mindfulflow-o3lmh.firebasestorage.app",
  messagingSenderId: "1096732411136",
  appId: "1:1096732411136:web:ab158c0af0aef571bc5fe5",
  measurementId: "G-6KVVT27CNX"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics only on client side (dynamic import to avoid SSR issues)
let analytics: any = null;
let analyticsInitializing = false;
let analyticsReady = false;

// Helper function to get analytics (waits for initialization if needed)
export const getAnalyticsInstance = async () => {
  if (typeof window === 'undefined') {
    return null;
  }

  // If already initialized, return it
  if (analytics && analyticsReady) {
    return analytics;
  }

  // If already initializing, wait for it
  if (analyticsInitializing) {
    // Wait up to 2 seconds for initialization
    let attempts = 0;
    while (attempts < 20 && !analyticsReady) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    return analytics && analyticsReady ? analytics : null;
  }

  // Start initialization
  analyticsInitializing = true;
  
  try {
    const { getAnalytics, isSupported } = await import('firebase/analytics');
    const supported = await isSupported();
    
    if (supported) {
      try {
        analytics = getAnalytics(app);
        analyticsReady = true;
        return analytics;
      } catch (error) {
        console.warn('Failed to initialize Firebase Analytics:', error);
        analyticsInitializing = false;
        return null;
      }
    } else {
      console.warn('Firebase Analytics not supported in this environment');
      analyticsInitializing = false;
      return null;
    }
  } catch (error) {
    console.warn('Error loading Firebase Analytics:', error);
    analyticsInitializing = false;
    return null;
  }
};

// Initialize analytics on client side
if (typeof window !== 'undefined') {
  // Start initialization in the background
  getAnalyticsInstance().catch(() => {
    // Silently handle errors - analytics is optional
  });
}

export { app, auth, db, analytics };

