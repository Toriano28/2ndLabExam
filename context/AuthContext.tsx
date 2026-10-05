import { useRouter } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  signInWithApi: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const signInWithApi = async (email: string, pass: string) => {
    try {
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        setToken(data.token);
        setUser({
          name: email.split('@')[0],
          email: email,
        });
        router.replace('/');
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid email or password' };
      }
    } catch (err) {
      return { success: false, error: 'Network error or server unavailable' };
    }
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    router.replace('/sign-in');
  };

  return (
    <AuthContext.Provider value={{ user, token, signInWithApi, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};