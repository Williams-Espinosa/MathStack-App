import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, GamificationStats, AuthResponse } from '../types/api';
import { userService } from '../services/userService';

interface AuthContextType {
  user: User | null;
  gamificationStats: GamificationStats | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [gamificationStats, setGamificationStats] = useState<GamificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const loadProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const profileData = await userService.getProfile();
      setUser(profileData.user);
      setGamificationStats(profileData.gamificationStats);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, []);

  const login = (authData: AuthResponse) => {
    localStorage.setItem('token', authData.token);
    setUser(authData.user);
    refreshProfile();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setGamificationStats(null);
  };

  const refreshProfile = async () => {
    await loadProfile();
  };

  return (
    <AuthContext.Provider value={{ user, gamificationStats, isAuthenticated, isLoading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
