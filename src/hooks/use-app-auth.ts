import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userId: string | null;
  user: any | null;
  isAuthenticated: boolean;
  setAuth: (token: string, userId: string, user?: any) => void;
  clearAuth: () => void;
}

export const useAppAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: localStorage.getItem('token'), // fallback for migration
      userId: null,
      user: null,
      isAuthenticated: !!localStorage.getItem('token'),
      setAuth: (token, userId, user) => {
        localStorage.setItem('token', token);
        set({ token, userId, user, isAuthenticated: true });
      },
      clearAuth: () => {
        localStorage.removeItem('token');
        set({ token: null, userId: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'app-auth',
    },
  ),
);
