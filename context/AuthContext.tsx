import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { API_BASE_URL } from '../constants/api';

const TOKEN_KEY = 'user_auth_token';

// Helper to safely save token
async function saveToken(token: string) {
  if (Platform.OS !== 'web' && (await SecureStore.isAvailableAsync())) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } else if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

// Helper to safely retrieve token
async function getToken(): Promise<string | null> {
  if (Platform.OS !== 'web' && (await SecureStore.isAvailableAsync())) {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } else if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

// Helper to safely remove token
async function removeToken() {
  if (Platform.OS !== 'web' && (await SecureStore.isAvailableAsync())) {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } else if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

interface AuthContextType {
  token: string | null;
  user: any | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Session Restoration on app launch
  useEffect(() => {
    async function restoreSession() {
      try {
        const savedToken = await getToken();
        if (savedToken) {
          const response = await fetch(`${API_BASE_URL}/profile`, {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setToken(savedToken);
            setUser(userData);
          } else {
            await removeToken();
          }
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  // 2. Login implementation
  const login = async (credentials: any) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    const authToken = data.token;

    await saveToken(authToken);
    setToken(authToken);

    // Fetch user profile after login
    const profileRes = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (profileRes.ok) {
      const profileData = await profileRes.json();
      setUser(profileData);
    }
  };

  // 3. Logout implementation
  const logout = async () => {
    await removeToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
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