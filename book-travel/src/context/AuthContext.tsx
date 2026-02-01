import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { mockUsers } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  login: (provider: 'google' | 'facebook') => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (provider: 'google' | 'facebook') => {
    // Mock login - use first mock user
    setUser({ ...mockUsers[0], auth_provider: provider });
  };

  const logout = () => setUser(null);

  const updateProfile = (updates: Partial<User>) => {
    if (user) setUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
