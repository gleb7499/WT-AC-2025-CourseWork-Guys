import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, setAccessToken, getAccessToken } from "../lib/api";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      api.users
        .me()
        .then((data) => setUser(data.user))
        .catch(() => setAccessToken(null))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.auth.login({ email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const register = async (email: string, username: string, password: string) => {
    const data = await api.auth.register({ email, username, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
