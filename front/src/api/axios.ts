import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://10.190.4.90:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("utilisateur");
      const path = window.location.pathname;
      if (path !== "/connexion" && path !== "/inscription") {
        window.location.href = "/connexion";
      }
    }
    return Promise.reject(error);
  }
);

export default api;