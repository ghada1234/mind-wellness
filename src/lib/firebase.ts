
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

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

// Initialize Analytics and export it for use in other parts of the app
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);


export { app, auth, db, analytics };

