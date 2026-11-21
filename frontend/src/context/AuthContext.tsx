import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password?: string) => Promise<void>;
  register: (data: { username: string; email: string; displayName?: string; favoriteGenres?: string[] }) => Promise<void>;
  logout: () => void;
  switchDemoUser: (username: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('bookend_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Auto-authenticate with remembered demo user or Elena Vance by default
  useEffect(() => {
    async function loadUser() {
      const savedUser = localStorage.getItem('bookend_active_user') || 'elena';
      if (token) {
        try {
          const profile = await api.getMe();
          if (profile && profile.username) {
            setUser(profile);
            setIsLoading(false);
            return;
          }
        } catch {
          localStorage.removeItem('bookend_token');
          setToken(null);
        }
      }

      // Default demo login
      try {
        const res = await api.login(savedUser, 'password123');
        localStorage.setItem('bookend_token', res.token);
        localStorage.setItem('bookend_active_user', savedUser);
        setToken(res.token);
        setUser(res.user);
      } catch (err) {
        console.warn('Default demo login offline, continuing guest session:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (username: string, password = 'password123') => {
    setIsLoading(true);
    try {
      const res = await api.login(username, password);
      localStorage.setItem('bookend_token', res.token);
      localStorage.setItem('bookend_active_user', username);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const switchDemoUser = async (username: string) => {
    await login(username, 'password123');
  };

  const register = async (data: { username: string; email: string; displayName?: string; favoriteGenres?: string[] }) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      localStorage.setItem('bookend_token', res.token);
      localStorage.setItem('bookend_active_user', res.user.username);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('bookend_token');
    localStorage.removeItem('bookend_active_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, switchDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
