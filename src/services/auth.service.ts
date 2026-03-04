import { STORAGE_KEYS } from '../constants/storage';

export type AuthUser = {
  _id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt?: string;
  updatedAt?: string;
};

export const authService = {
  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  getUser: (): AuthUser | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  setAuth: (token: string, user: AuthUser) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  removeAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },
};
