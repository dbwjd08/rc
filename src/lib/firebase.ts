import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAI4kAb16wxdlZh2rrb7Nq3-lB4r9B3jaA",
  authDomain: "rccar-84857.firebaseapp.com",
  databaseURL: "https://rccar-84857-default-rtdb.firebaseio.com",
  projectId: "rccar-84857",
  storageBucket: "rccar-84857.firebasestorage.app",
  messagingSenderId: "1090260001562",
  appId: "1:1090260001562:web:d750972fd825933540c2a3",
};

// Initialize Firebase app only if not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
