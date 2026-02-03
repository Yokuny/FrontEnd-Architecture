import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { type DecodedToken, decodeToken } from '@/config/token';
import { useEnterpriseFilter } from './use-enterprise-filter';

// import { usePermissions } from './use-permissions';

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
      rememberedEmail: null,
      loginType: null,
      mapShowName: false,

      setAuth: (token: string, loginType: 'normal' | 'sso' = 'normal') => {
        const user = decodeToken(token);
        if (!user) return;

        if (user.request) {
          useEnterpriseFilter.getState().setIdEnterprise(user.request);
        }

        set({
          isAuthenticated: true,
          user,
          token,
          loginType,
          mapShowName: true,
          locked: null,
        });

        // usePermissions.getState().fetchPermissions(user.request);
      },

      clearAuth: () => {
        useEnterpriseFilter.getState().setIdEnterprise('');
        // usePermissions.getState().clearPermissions();
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          loginType: null,
          locked: null,
        });
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),

      setLocked: (locked: LockedAccount) => set({ locked }),

      clearLocked: () => set({ locked: null }),

      setRememberEmail: (remember: boolean) =>
        set((state) => ({
          rememberEmail: remember,
          rememberedEmail: remember ? state.rememberedEmail : null,
        })),

      setRememberedEmail: (email: string | null) => set({ rememberedEmail: email }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        rememberEmail: state.rememberEmail,
        rememberedEmail: state.rememberedEmail,
        loginType: state.loginType,
        mapShowName: state.mapShowName,
      }),
    },
  ),
);

type AuthStore = {
  isAuthenticated: boolean;
  user: DecodedToken | null;
  token: string | null;
  isLoading: boolean;
  locked: LockedAccount | null;
  rememberEmail: boolean;
  rememberedEmail: string | null;
  loginType: 'normal' | 'sso' | null;
  mapShowName: boolean;
  setAuth: (token: string, loginType?: 'normal' | 'sso') => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  setLocked: (locked: LockedAccount) => void;
  clearLocked: () => void;
  setRememberEmail: (remember: boolean) => void;
  setRememberedEmail: (email: string | null) => void;
};
