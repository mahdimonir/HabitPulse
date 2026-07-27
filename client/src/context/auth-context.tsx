'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
        }
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = res.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(user);
  };

  const register = async (email: string, password: string, name?: string) => {
    const res = await api.post('/auth/register', { email, password, name });
    const { user, accessToken, refreshToken } = res.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(user);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const updateProfile = async (name: string) => {
    const res = await api.patch('/auth/profile', { name });
    setUser(res.data.user);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await api.patch('/auth/password', { currentPassword, newPassword });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
