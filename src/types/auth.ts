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

export interface RegisterData {
  name: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role?: "seller" | "guest";
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
