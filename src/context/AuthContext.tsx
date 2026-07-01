"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "@/types";
import { toast } from "sonner";

// Lazy-loaded Firebase
import { app } from "@/lib/firebase";

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
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    const initAuth = async () => {
      const { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } = await import("firebase/auth");
      const { getFirestore } = await import("firebase/firestore");
      
      const auth = getAuth(app);
      const db = getFirestore(app);

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setLoading(true);
        if (!isMounted) return;
        
        if (firebaseUser) {
          try {
            const userRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userRef);
            
            if (!userDoc.exists()) {
              const newUser: User = {
                uid: firebaseUser.uid,
                name: firebaseUser.displayName || "Anonymous",
                email: firebaseUser.email || "",
                photoURL: firebaseUser.photoURL || "",
                createdAt: serverTimestamp(),
              };
              await setDoc(userRef, newUser);
              if (isMounted) setUser(newUser);
            } else {
              if (isMounted) setUser(userDoc.data() as User);
            }
          } catch (error: any) {
            console.error("🔥 Firestore Auth Error:", error);
            toast.error("Failed to load user profile. Please check your connection.");
            
            if (isMounted) {
              setUser({
                uid: firebaseUser.uid,
                name: firebaseUser.displayName || "Anonymous",
                email: firebaseUser.email || "",
                photoURL: firebaseUser.photoURL || "",
                createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
              });
            }
          }
        } else {
          if (isMounted) setUser(null);
        }
        
        if (isMounted) setLoading(false);
      });
    };

    initAuth();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      
      const auth = getAuth(app);
      await signInWithPopup(auth, provider);
      toast.success("Successfully signed in!");
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      toast.error(error.message || "Failed to sign in with Google");
    }
  };

  const signOut = async () => {
    try {
      const { getAuth, signOut: firebaseSignOut } = await import("firebase/auth");
      const auth = getAuth(app);
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
