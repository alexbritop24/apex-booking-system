// apps/web/src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

// Ensure the default Firebase app is initialized (side-effect import).
import "../firebase/firebaseConfig";

type AuthStatus = "loading" | "ready";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

type SignInArgs = {
  email: string;
  password: string;
  remember: boolean;
};

type SignUpArgs = {
  email: string;
  password: string;
  remember: boolean;
};

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;

  signIn: (args: SignInArgs) => Promise<void>;
  signUp: (args: SignUpArgs) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(u: User): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useMemo(() => getAuth(), []);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ? toAuthUser(u) : null);
      setStatus("ready");
    });

    return () => unsub();
  }, [auth]);

  const value = useMemo<AuthContextValue>(() => {
    return {
      status,
      user,

      async signIn({ email, password, remember }: SignInArgs) {
        // Persistent sessions are controlled by Auth persistence mode.
        await setPersistence(
          auth,
          remember ? browserLocalPersistence : browserSessionPersistence
        );
        await signInWithEmailAndPassword(auth, email, password);
      },

      async signUp({ email, password, remember }: SignUpArgs) {
        await setPersistence(
          auth,
          remember ? browserLocalPersistence : browserSessionPersistence
        );
        await createUserWithEmailAndPassword(auth, email, password);
      },

      async resetPassword(email: string) {
        await sendPasswordResetEmail(auth, email);
      },

      async logout() {
        await signOut(auth);
      },
    };
  }, [auth, status, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider />");
  }
  return ctx;
}