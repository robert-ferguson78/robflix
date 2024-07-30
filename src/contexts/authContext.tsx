import React, { useState, useEffect, ReactNode } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { UserId } from "../types/interfaces";
import { AuthContext } from '../util';

// AuthProvider component to provide authentication context to children
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State to hold the current user
  const [currentUser, setCurrentUser] = useState<UserId | null>(null);

  // useEffect to handle authentication state changes
  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        // If user is logged in, extract uid and set currentUser
        const { uid } = user;
        setCurrentUser({ uid });
      } else {
        // If user is logged out, set currentUser to null
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);

  // Value rovided by the AuthContext
  const value = {
    currentUser,
  };

  // Return authentication context to children
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};