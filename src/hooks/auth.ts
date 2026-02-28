import { create } from 'zustand';
import { GET, POST, request } from '../lib/api/client';

export const useAuthStore = create<AuthStore>((set, _get) => ({
  isAuthenticated: false,
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

  login: async (body: SignInBody) => {
    const res = await request('auth/signin', POST(body));
    if (!res.success) throw new Error(res.message || 'Falha ao autenticar');

    set({ isAuthenticated: true });
    if (res.data?.accessToken) return { accessToken: res.data.accessToken as string };
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
      set({ isAuthenticated: false });
    }
  },

  checkAuthentication: async () => {
    try {
      const res = await request('auth/validate', GET());
      const isValid = res.success;

      set({ isAuthenticated: isValid });
      return isValid;
    } catch {
      set({ isAuthenticated: false });
      return false;
    }
  },
}));

type SignInBody = {
  email: string;
  password: string;
};

type AuthStore = {
  isAuthenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  checkAuthentication: () => Promise<boolean>;
  login: (body: SignInBody) => Promise<{ accessToken: string } | undefined>;
  logout: () => Promise<void>;
};
