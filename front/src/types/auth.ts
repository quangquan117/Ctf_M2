export interface RegisterData {
  pseudo: string;
  password: string;
}

export interface LoginData {
  pseudo: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  pseudo: string;
}