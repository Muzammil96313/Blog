import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- Firestore import

const firebaseConfig = {
  apiKey: "AIzaSyACu7f80hIc541sEvNYjccoJ8c1rnWWxr8",
  authDomain: "blog-a8ed0.firebaseapp.com",
  projectId: "blog-a8ed0",
  storageBucket: "blog-a8ed0.appspot.com",
  messagingSenderId: "54061669526",
  appId: "1:54061669526:web:7d40de0cbc4f2fae82b6b7",
  measurementId: "G-D1RC9S8DL0",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // <-- Firestore initialize
