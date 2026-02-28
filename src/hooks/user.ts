import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GET, request } from '@/lib/api/fetch.config';
import type { PartialUser } from '@/lib/interfaces/user';

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      selectedRoom: null,
      rooms: [] as Array<{ _id: string }>,

      refreshUser: async () => {
        try {
          const res = await request('user/partial', GET());
          if (!res.success) throw new Error(res.message);

          const userData = res.data as PartialUser;
          set({
            user: userData,
            rooms: userData.rooms.map((room) => ({ _id: room._id })),
            selectedRoom: userData.rooms?.[0]?._id || null,
          });
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      getUser: async () => {
        const { user } = get();
        if (user) return user;

        try {
          await get().refreshUser();
          const userFound = get().user;
          if (!userFound) throw new Error('Realize o cadastro da clínica antes de continuar.');
          return userFound;
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      setUser: (user: PartialUser) => {
        set({ user });
      },

      setSelectedRoom: (roomID: string) => {
        set({ selectedRoom: roomID });
      },

      getSelectedRoom: async () => {
        const state = get();
        if (state.selectedRoom) return state.selectedRoom;

        if (Array.isArray(state.rooms) && state.rooms.length > 0) {
          const firstRoom = state.rooms[0]?._id;
          set({ selectedRoom: firstRoom });
          return firstRoom;
        }
      },

      getRooms: () => {
        return get().rooms;
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        selectedRoom: state.selectedRoom,
        rooms: state.rooms,
      }),
    },
  ),
);

type UserStore = {
  user: PartialUser | null;
  selectedRoom: string | null;
  rooms: Array<{ _id: string }>;
  refreshUser: () => Promise<void>;
  getUser: () => Promise<PartialUser | null>;
  setUser: (user: PartialUser) => void;
  setSelectedRoom: (roomID: string) => void;
  getSelectedRoom: () => Promise<string | undefined>;
  getRooms: () => Array<{ _id: string }>;
};
