// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, // uses .env value
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}; 
/* const firebaseConfig = {
  apiKey: "AIzaSyDbq-j31pjzsLqtvVMZFen5KUKY0iO2t-g",
  authDomain: "blass-college.firebaseapp.com",
  projectId: "blass-college",
  storageBucket: "blass-college.firebasestorage.app",
  messagingSenderId: "953411325932",
  appId: "1:953411325932:web:bd0f69b6bc542d7328bac9",
  measurementId: "G-01MKMJQ7M0"
}; */


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app)
