"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "@/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          // Check if user exists in Firestore
          const userRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            // Create new user in Firestore
            const newUser: User = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || "Anonymous",
              email: firebaseUser.email || "",
              photoURL: firebaseUser.photoURL || "",
              createdAt: serverTimestamp(),
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
          } else {
            setUser(userDoc.data() as User);
          }
        } catch (error: any) {
          console.error("🔥 Firestore Auth Error:", error);
          
          if (error.code === 'not-found' || error.message?.includes('Database \'(default)\' not found')) {
            toast.error("Database connection issue. Please ensure Firestore is enabled in your Firebase Console.");
          } else {
            toast.error("Failed to load user profile. Please check your connection.");
          }
          
          // Still allow the app to run with basic auth info if firestore fails
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || "Anonymous",
            email: firebaseUser.email || "",
            photoURL: firebaseUser.photoURL || "",
            createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      await signInWithPopup(auth, provider);
      toast.success("Successfully signed in!");
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      toast.error(error.message || "Failed to sign in with Google");
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("Signed out successfully");
    } catch (error: any) {
      console.error("Sign-Out Error:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
