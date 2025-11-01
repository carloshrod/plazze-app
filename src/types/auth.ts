/* eslint-disable no-unused-vars */
export interface LoginFormFields {
  email: string;
  password: string;
}

export interface RegisterFormFields {
  name: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
  role: "guest" | "seller" | "administrator";
}

export interface RegisterResponse {
  message: string;
  user_id: number;
}

export type UserRole = "guest" | "seller" | "administrator";

export interface RegisterData {
  name: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role?: UserRole;
  businessName?: string;
  phone?: string;
}

export interface User {
  email: string;
  username: string;
  displayName: string;
  role: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setIsLoadingAuth: (isLoadingAuth: boolean) => void;
}
