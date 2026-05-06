import api from "../api/axios";
import type {
  RegisterData,
  LoginData,
  AuthResponse,
  User,
} from "../types/auth";

const TOKEN_KEY = "accessToken";
const USER_KEY = "utilisateur";

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    authService.saveSession(response.data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    authService.saveSession(response.data);
    return response.data;
  },

  saveSession: (authResponse: AuthResponse): void => {
    if (!authResponse?.accessToken || !authResponse?.utilisateur) {
      console.warn("Réponse d'authentification invalide :", authResponse);
      return;
    }
    localStorage.setItem(TOKEN_KEY, authResponse.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authResponse.utilisateur));
  },

  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },


  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token !== null && token !== "" && token !== "undefined";
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);

    if (!userStr || userStr === "undefined" || userStr === "null") {
      return null;
    }

    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.warn("Données utilisateur corrompues, nettoyage en cours...");
      authService.logout();
      return null;
    }
  },
};