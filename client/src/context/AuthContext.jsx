import React from "react";
import { createContext, useContext, useMemo, useState } from "react";
import api, { clearStoredSession, getStoredUser, setStoredSession } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const login = async (payload, admin = false) => {
    const endpoint = admin ? "/admin/login" : "/auth/login";
    const { data } = await api.post(endpoint, payload);
    setStoredSession(data);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    setStoredSession(data);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    clearStoredSession();
    setUser(null);
  };

  const refreshMe = async () => {
    const { data } = await api.get("/auth/me");
    localStorage.setItem("cc_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const value = useMemo(
    () => ({ user, isAdmin: user?.role === "admin", login, register, logout, refreshMe }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
