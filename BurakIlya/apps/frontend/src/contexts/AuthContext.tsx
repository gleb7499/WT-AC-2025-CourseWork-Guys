import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { login as apiLogin, register as apiRegister, getMe } from "../lib/api";
import type { User } from "../types";
import { setAccessToken } from "../lib/api";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAccessToken(token);
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await apiLogin(email, password);
      setUser(resp.user);
      setTokenState(resp.accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await apiRegister({ email, username, password });
      setUser(resp.user);
      setTokenState(resp.accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Register failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTokenState(null);
    setError(null);
  };

  const refreshMe = async () => {
    if (!token) return;
    try {
      const resp = await getMe();
      setUser(resp.user);
    } catch (err) {
      setUser(null);
      setTokenState(null);
    }
  };

  const value: AuthContextValue = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    error,
    refreshMe
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
