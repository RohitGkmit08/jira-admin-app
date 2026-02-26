import { create } from 'zustand';

import type { AuthUser } from '../types';
interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthSession = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  logout: () => set({ user: null }),
}));
