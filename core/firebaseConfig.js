// core/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLH6ZC2cDLpjyS-RJLc_2CRNOexfNObgU",
  authDomain: "kre-goals.firebaseapp.com",
  projectId: "kre-goals",
  storageBucket: "kre-goals.firebasestorage.app",
  messagingSenderId: "107491808488",
  appId: "1:107491808488:web:9c604edbc83bb14e33255d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore instance
export const db = getFirestore(app);

// Auth instance ✅
export const auth = getAuth(app);
