import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const setStoredSession = ({ token, refreshToken, user }) => {
  localStorage.setItem("cc_token", token);
  if (refreshToken) localStorage.setItem("cc_refresh_token", refreshToken);
  localStorage.setItem("cc_user", JSON.stringify(user));
  if (user?.email) localStorage.setItem("cc_last_email", user.email);
};

export const clearStoredSession = () => {
  localStorage.removeItem("cc_token");
  localStorage.removeItem("cc_refresh_token");
  localStorage.removeItem("cc_user");
};

export const getStoredUser = () => {
  const user = localStorage.getItem("cc_user");
  return user ? JSON.parse(user) : null;
};

export const getLastEmail = () => {
  const lastEmail = localStorage.getItem("cc_last_email");
  if (lastEmail) return lastEmail;

  try {
    return JSON.parse(localStorage.getItem("cc_user") || "{}").email || "";
  } catch {
    return "";
  }
};

export default api;
