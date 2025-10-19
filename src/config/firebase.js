// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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
export const auth = getAuth(app);