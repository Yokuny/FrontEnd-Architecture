import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

type UserUIStore = {
  selectedRoom: string | null;
  setSelectedRoom: (roomID: string) => void;
};
