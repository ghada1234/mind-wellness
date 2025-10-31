
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

// Initialize Analytics only on client side
let analytics: any = null;

// Initialize analytics synchronously on client side
if (typeof window !== 'undefined') {
  try {
    // Use dynamic import to avoid SSR issues
    import('firebase/analytics').then(({ getAnalytics, isSupported }) => {
      isSupported().then((supported) => {
        if (supported) {
          try {
            analytics = getAnalytics(app);
            console.log('✅ Firebase Analytics initialized successfully');
          } catch (error) {
            console.warn('Failed to initialize Firebase Analytics:', error);
          }
        } else {
          console.warn('Firebase Analytics not supported in this environment');
        }
      }).catch(() => {
        // Analytics not supported
      });
    }).catch(() => {
      // Failed to load analytics module
    });
  } catch (error) {
    // Error checking support
  }
}

// Helper function to get analytics instance
export const getAnalyticsInstance = () => {
  return analytics;
};

export { app, auth, db, analytics };

