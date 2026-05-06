export interface RegisterData {
  nom: string;
  email: string;
  motDePasse: string;
}

export interface LoginData {
  email: string;
  motDePasse: string;
}

export interface User {
  id: number;
  nom: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  utilisateur: User;
}