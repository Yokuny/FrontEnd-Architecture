import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GET, POST, request } from '../lib/api/client';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, _get) => ({
      isAuthenticated: false,
      accessToken: null,
      userId: null,
      user: null,

      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

      setAuth: (accessToken, userId, user) =>
        set({
          isAuthenticated: true,
          accessToken,
          userId,
          user,
        }),

      clearAuth: () => {
        set({
          isAuthenticated: false,
          accessToken: null,
          userId: null,
          user: null,
        });
      },

      login: async (body: SignInBody) => {
        const res = await request('auth/signin', POST(body));
        if (!res.success) throw new Error(res.message || 'Falha ao autenticar');

        const { accessToken, userId, user } = res.data;

        set({
          isAuthenticated: true,
          accessToken,
          userId,
          user,
        });

        return { accessToken: accessToken as string };
      },

      logout: async () => {
        try {
          await request('auth/logout', POST({}));
        } finally {
          const professionalColors = localStorage.getItem('professional-colors');
          localStorage.clear();
          if (professionalColors !== null) {
            localStorage.setItem('professional-colors', professionalColors);
          }
          window.location.href = '/auth';
          set({
            isAuthenticated: false,
            accessToken: null,
            userId: null,
            user: null,
          });
        }
      },

      checkAuthentication: async () => {
        try {
          const res = await request('auth/validate', GET());
          const isValid = res.success;

          set({ isAuthenticated: isValid });
          if (!isValid) {
            set({ accessToken: null, userId: null, user: null });
          }
          return isValid;
        } catch {
          set({ isAuthenticated: false, accessToken: null, userId: null, user: null });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);

type SignInBody = {
  email: string;
  password: string;
};

type AuthStore = {
  isAuthenticated: boolean;
  accessToken: string | null;
  userId: string | null;
  user: any | null;
  setAuthenticated: (authenticated: boolean) => void;
  setAuth: (accessToken: string, userId: string, user: any) => void;
  clearAuth: () => void;
  checkAuthentication: () => Promise<boolean>;
  login: (body: SignInBody) => Promise<{ accessToken: string } | undefined>;
  logout: () => Promise<void>;
};
