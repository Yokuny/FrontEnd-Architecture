import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { clearStoredToken, type DecodedToken, decodeToken, setStoredToken } from '@/config/token';
import { useEnterpriseFilter } from './use-enterprises-api';

interface LockedAccount {
  id: string;
  isBlockedTemporary: boolean;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      locked: null,
      rememberEmail: false,

      setAuth: (token: string, loginType: 'normal' | 'sso' = 'normal') => {
        const user = decodeToken(token);
        if (!user) {
          return;
        }

        // Save to localStorage
        setStoredToken(token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('typelog', loginType);
        localStorage.setItem('map_show_name', 'true');

        if (user.request) {
          useEnterpriseFilter.getState().setIdEnterprise(user.request);
        }

        set({
          isAuthenticated: true,
          user,
          token,
          locked: null,
        });
      },

      clearAuth: () => {
        clearStoredToken();
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          locked: null,
        });
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),

      setLocked: (locked: LockedAccount) => set({ locked }),

      clearLocked: () => set({ locked: null }),

      setRememberEmail: (remember: boolean) => set({ rememberEmail: remember }),

      // Initialize from localStorage on mount
      hydrate: () => {
        const token = localStorage.getItem('token');
        if (token) {
          const user = decodeToken(token);
          if (user) {
            set({
              isAuthenticated: true,
              user,
              token,
            });
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        rememberEmail: state.rememberEmail,
      }),
    },
  ),
);

// Hydrate on app start
useAuth.getState().hydrate();

type AuthStore = {
  isAuthenticated: boolean;
  user: DecodedToken | null;
  token: string | null;
  isLoading: boolean;
  locked: LockedAccount | null;
  rememberEmail: boolean;
  setAuth: (token: string, loginType?: 'normal' | 'sso') => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  setLocked: (locked: LockedAccount) => void;
  clearLocked: () => void;
  setRememberEmail: (remember: boolean) => void;
  hydrate: () => void;
};
