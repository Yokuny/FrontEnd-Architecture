import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useSidebarToggle = create<SidebarToggleStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      setIsOpen: () => set({ isOpen: !get().isOpen }),
    }),
    {
      name: "sidebarOpen",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

type SidebarToggleStore = {
  isOpen: boolean;
  setIsOpen: () => void;
};
