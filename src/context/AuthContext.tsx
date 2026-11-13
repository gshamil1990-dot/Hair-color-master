import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';

export interface SavedHairPassportRecord {
  id: number;
  clientName: string;
  hairType: string;
  hairConcern: string;
  hairLength: string;
  salonRitual: string;
  careName: string;
  shampoo: string;
  treatmentMask: string;
  leaveInCare: string;
  createdAt: string;
}

export interface SavedBookingRecord {
  id: number;
  serviceTitle: string;
  serviceCategory: string;
  servicePrice: string;
  wearTime?: string | null;
  contactChannel: string;
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  idToken: string | null;
  loading: boolean;
  authError: string | null;
  savedPassports: SavedHairPassportRecord[];
  savedBookings: SavedBookingRecord[];
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  savePassportToCloud: (payload: Omit<SavedHairPassportRecord, 'id' | 'createdAt'>) => Promise<boolean>;
  saveBookingToCloud: (payload: Omit<SavedBookingRecord, 'id' | 'createdAt'>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [savedPassports, setSavedPassports] = useState<SavedHairPassportRecord[]>([]);
  const [savedBookings, setSavedBookings] = useState<SavedBookingRecord[]>([]);

  const syncUserRecords = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.passports)) {
        setSavedPassports(data.passports);
      }
      if (Array.isArray(data.bookings)) {
        setSavedBookings(data.bookings);
      }
    } catch {
      // Quietly fallback so the UI stays responsive
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          setIdToken(token);
          await syncUserRecords(token);
        } catch {
          setIdToken(null);
        }
      } else {
        setIdToken(null);
        setSavedPassports([]);
        setSavedBookings([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncUserRecords]);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const credential = await signInWithPopup(auth, googleAuthProvider);
      const token = await credential.user.getIdToken();
      setIdToken(token);
      await syncUserRecords(token);
    } catch {
      setAuthError('Не удалось выполнить вход через Google. Попробуйте ещё раз.');
    }
  };

  const signOut = async () => {
    setAuthError(null);
    try {
      await firebaseSignOut(auth);
      setIdToken(null);
      setSavedPassports([]);
      setSavedBookings([]);
    } catch {
      // Ignore sign out error
    }
  };

  const savePassportToCloud = async (
    payload: Omit<SavedHairPassportRecord, 'id' | 'createdAt'>
  ): Promise<boolean> => {
    if (!user) return false;
    try {
      const token = idToken || (await user.getIdToken());
      setIdToken(token);
      const res = await fetch('/api/passports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.passport) {
        setSavedPassports((prev) => [data.passport, ...prev]);
      }
      return true;
    } catch {
      return false;
    }
  };

  const saveBookingToCloud = async (
    payload: Omit<SavedBookingRecord, 'id' | 'createdAt'>
  ): Promise<boolean> => {
    if (!user) return false;
    try {
      const token = idToken || (await user.getIdToken());
      setIdToken(token);
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.booking) {
        setSavedBookings((prev) => [data.booking, ...prev]);
      }
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        idToken,
        loading,
        authError,
        savedPassports,
        savedBookings,
        signInWithGoogle,
        signOut,
        savePassportToCloud,
        saveBookingToCloud,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
