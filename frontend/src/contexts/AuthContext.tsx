import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import api from "../api/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser({ ...res.data.user, id: res.data.user._id, token });
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const res = await api.post('/auth/login', { email, password });
      const loggedInUser = { ...res.data.user, token: res.data.token };
      localStorage.setItem("token", res.data.token);
      setUser(loggedInUser);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to login. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const res = await api.post('/auth/register', { name, email, password });
      const newUser = { ...res.data.user, token: res.data.token };
      localStorage.setItem("token", res.data.token);
      setUser(newUser);
      toast.success("Registered successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to register. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
