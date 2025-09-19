// core/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined while loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // signup
  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  // login
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // logout
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
