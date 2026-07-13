import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDsgiK7NuObjj6l6LX6-LXoQAnjHPnSuZk',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'sri-vihaan-sap-testing.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'sri-vihaan-sap-testing',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'sri-vihaan-sap-testing.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '831254271389',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:831254271389:web:a732ca0a8abf5105c78b74',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-DGHCZR3161',
};

let app = null;
let authObj = null;
let dbObj = null;
let analyticsObj = null;
let storageObj = null;

try {
  if (
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'your_api_key' &&
    firebaseConfig.apiKey !== 'undefined'
  ) {
    app = initializeApp(firebaseConfig);
    authObj = getAuth(app);
    dbObj = getFirestore(app);
    storageObj = getStorage(app);
    if (typeof window !== 'undefined') {
      analyticsObj = getAnalytics(app);
    }
  } else {
    console.warn('Firebase API key is missing. Authentication will be disabled.');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export const auth = authObj as any;
export const db = dbObj as any;
export const storage = storageObj as any;
export const analytics = analyticsObj;
