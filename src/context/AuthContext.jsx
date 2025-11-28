// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';
import {
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Logout function
  const logout = () => {
    return signOut(auth);
  };

  // Google Sign in
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result;
  };

  // Save user data to Firestore
  const saveUserToFirestore = async (user) => {
    if (!user) return;

    try {
      // Wait for auth token to be fully available
      await user.getIdToken(true);
      
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // First time login - create user document
        const newUserData = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          class: null, // Will be set later in profile
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        };

        await setDoc(userRef, newUserData, { merge: true });
        setUserData(newUserData);
      } else {
        // Update last login
        const existingData = userSnap.data();
        await setDoc(userRef, {
          lastLogin: serverTimestamp()
        }, { merge: true });
        setUserData(existingData);
      }
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
      // Set basic user data even if Firestore fails
      setUserData({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        class: null,
        createdAt: new Date(),
        lastLogin: new Date()
      });
    }
  };

  // Update user class
  const updateUserClass = async (className) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        class: className
      }, { merge: true });

      setUserData(prev => ({
        ...prev,
        class: className
      }));
    } catch (error) {
      console.error('Error updating user class:', error);
      // Update local state even if Firestore fails
      setUserData(prev => ({
        ...prev,
        class: className
      }));
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Save to Firestore with proper error handling
        try {
          await saveUserToFirestore(currentUser);
        } catch (err) {
          console.warn('Non-blocking saveUserToFirestore failed:', err);
          setUserData({
            uid: currentUser.uid,
            name: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            class: null,
            createdAt: new Date(),
            lastLogin: new Date()
          });
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userData,
    loading,
    logout,
    signInWithGoogle,
    updateUserClass
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
