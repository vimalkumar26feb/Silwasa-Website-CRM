'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@silwasa/types';
import { apiClient, ApiError } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await apiClient<{ success: boolean; data: User }>('/auth/me');
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await apiClient<{
        success: boolean;
        data: { user: User; token: string };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.data) {
        setUser(res.data.user);
        if (typeof window !== 'undefined' && res.data.token) {
          sessionStorage.setItem('silwasa_token', res.data.token);
        }
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : 'Invalid email or password';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('silwasa_token');
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
