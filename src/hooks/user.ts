import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserUIStore = {
  selectedRoom: string | null;
  setSelectedRoom: (roomID: string) => void;
};

/**
 * Client State de UI do usuário.
 * Dados do usuário (server state) vivem no TanStack Query via useUserQuery em @/query/user.
 */
export const useUserStore = create<UserUIStore>()(
  persist(
    (set) => ({
      selectedRoom: null,
      setSelectedRoom: (roomID) => set({ selectedRoom: roomID }),
    }),
    {
      name: 'user-ui',
    },
  ),
);
