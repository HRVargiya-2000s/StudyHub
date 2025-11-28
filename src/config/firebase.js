// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA2jsSkHxj-8CEtk1CAYWRxHeDf-Sl9eMs",
  authDomain: "studyhub-a96e0.firebaseapp.com",
  projectId: "studyhub-a96e0",
  storageBucket: "studyhub-a96e0.appspot.com",
  messagingSenderId: "305261911711",
  appId: "1:305261911711:web:d59180e6b04ed119814caa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);