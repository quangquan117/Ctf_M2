import api from "../api/axios";
import type { RegisterData, LoginData, AuthResponse } from "../types/auth";

export const authService = {

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("pseudo");
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem("token") !== null;
  },
};