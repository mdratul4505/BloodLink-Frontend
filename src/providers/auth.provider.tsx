"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { IUser } from "@/types";
import apiClient, {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_DATA_KEY,
} from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isOrganization: boolean;
  isUser: boolean;
  login: (accessToken: string, refreshToken?: string, userData?: IUser) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<IUser>) => void;
  refreshProfile: () => Promise<IUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async (): Promise<IUser | null> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.ME);
      const userData = response.data?.data || response.data;
      if (userData && userData.id) {
        setUser(userData);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        return userData;
      }
    } catch {
      // failed to refresh profile
    }
    return null;
  }, []);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedUserData = localStorage.getItem(USER_DATA_KEY);

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedUserData) {
        try {
          const parsed = JSON.parse(storedUserData);
          setUser(parsed);
        } catch {
          localStorage.removeItem(USER_DATA_KEY);
        }
      }

      if (storedToken) {
        refreshProfile().finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  }, [refreshProfile]);

  const login = (
    accessToken: string,
    refreshToken?: string,
    userData?: IUser
  ) => {
    setToken(accessToken);
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    if (userData) {
      setUser(userData);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } else {
      refreshProfile();
    }
  };

  const logout = async () => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // ignore server logout error
    } finally {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      setToken(null);
      setUser(null);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  const updateUser = (userData: Partial<IUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const role = user?.role;
  const isAdmin = role === "ADMIN";
  const isOrganization = role === "ORGANIZATION" || role === "HOSPITAL";
  const isUser = role === "USER" || !role;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        isAdmin,
        isOrganization,
        isUser,
        login,
        logout,
        updateUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
