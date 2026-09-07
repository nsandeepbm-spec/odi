import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth, logout as firebaseLogout } from './firebase';
import {
  getCurrentUser,
  syncUserWithBackend,
  updateCurrentUser,
  type AppUser,
} from './api';

export function getInitials(name: string | null | undefined, email: string): string {
  const trimmed = name?.trim();
  if (trimmed) {
    return trimmed
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function displayName(user: AppUser): string {
  return user.full_name?.trim() || user.email.split('@')[0];
}

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<AppUser | null>;
  updateProfile: (patch: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
  }) => Promise<AppUser>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadProfile(firebaseUser: FirebaseUser): Promise<AppUser> {
  try {
    return await getCurrentUser();
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    if (/suspended/i.test(msg)) {
      await firebaseLogout();
      throw err;
    }
    // Profile missing (first login / backend was down during sync) — create it.
    const synced = await syncUserWithBackend(firebaseUser);
    if (synced) return synced;
    return getCurrentUser();
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const profile = await loadProfile(fbUser);
        setUser(profile);
      } catch (err) {
        console.warn('[auth] Failed to load profile:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsub;
  }, []);

  const refreshUser = useCallback(async () => {
    const fbUser = auth.currentUser;
    if (!fbUser) {
      setUser(null);
      return null;
    }
    const profile = await loadProfile(fbUser);
    setUser(profile);
    return profile;
  }, []);

  const updateProfile = useCallback(async (patch: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
  }) => {
    const updated = await updateCurrentUser(patch);
    setUser(updated);
    return updated;
  }, []);

  const signOut = useCallback(async () => {
    await firebaseLogout();
    setUser(null);
    setFirebaseUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      user,
      loading,
      isAdmin: user?.role === 'admin',
      refreshUser,
      updateProfile,
      signOut,
    }),
    [firebaseUser, user, loading, refreshUser, updateProfile, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
