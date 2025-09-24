// src/context/AuthContext.tsx
import { createContext, useEffect, useState, ReactNode } from 'react';
import { message } from 'antd';
import { API_HOST, API_ENDPOINTS } from '../config/apiConfig';

interface AuthTokens {
  access: string;
  refresh: string;
}

interface UserPayload {
  user_id: string;
  email: string;
  exp: number;
  iat: number;
}

interface AuthContextType {
  user: UserPayload | null;
  authTokens: AuthTokens | null;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  authTokens: null,
  loginUser: async () => false,
  logoutUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => {
    const tokenString = localStorage.getItem('authTokens');
    return tokenString ? JSON.parse(tokenString) : null;
  });

  const [user, setUser] = useState<UserPayload | null>(() => {
    if (authTokens) return parseJwt(authTokens.access);
    return null;
  });

  const parseJwt = (token: string): UserPayload | null => {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (e) {
      return null;
    }
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_HOST}${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Login failed');
      const data: AuthTokens = await res.json();
      setAuthTokens(data);
      const parsedUser = parseJwt(data.access);
      setUser(parsedUser);
      localStorage.setItem('authTokens', JSON.stringify(data));
      message.success('Login successful');
      return true;
    } catch (err) {
      message.error('Invalid credentials');
      return false;
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    message.success('Logged out');
  };

  const refreshToken = async () => {
    if (!authTokens?.refresh) return;
    try {
      const res = await fetch(`${API_HOST}${API_ENDPOINTS.REFRESH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: authTokens.refresh }),
      });

      if (res.ok) {
        const data = await res.json();
        const updated = { ...authTokens, access: data.access };
        setAuthTokens(updated);
        setUser(parseJwt(data.access));
        localStorage.setItem('authTokens', JSON.stringify(updated));
      } else {
        logoutUser();
      }
    } catch {
      logoutUser();
    }
  };

  useEffect(() => {
    if (authTokens) {
      const interval = setInterval(refreshToken, 4 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [authTokens]);

  return (
    <AuthContext.Provider value={{ user, authTokens, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
