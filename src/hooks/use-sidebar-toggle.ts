import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useIsMobile } from "@/hooks/use-mobile";

const SIDEBAR_COOKIE_NAME = "sidebar_state";

type SidebarToggleStore = {
  isOpen: boolean;
  isMobileOpen: boolean;
  setOpen: (open: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  toggle: () => void;
  // Computed state
  state: "expanded" | "collapsed";
};

export const useSidebarToggle = create<SidebarToggleStore>()(
  persist(
    (set, get) => ({
      isOpen: true,
      isMobileOpen: false,
      state: "expanded",

      setOpen: (open: boolean) => {
        set({ isOpen: open, state: open ? "expanded" : "collapsed" });
      },

      setMobileOpen: (open: boolean) => {
        set({ isMobileOpen: open });
      },

      toggle: () => {
        // Por padrão, toggle desktop
        const { isOpen } = get();
        const newOpen = !isOpen;
        set({
          isOpen: newOpen,
          state: newOpen ? "expanded" : "collapsed",
        });
      },
    }),
    {
      name: SIDEBAR_COOKIE_NAME,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// Hook wrapper que combina Zustand com detecção mobile
export function useSidebar() {
  const isMobile = useIsMobile();
  const { isOpen, isMobileOpen, state, setOpen, setMobileOpen } = useSidebarToggle();

  const toggle = () => {
    if (isMobile) {
      setMobileOpen(!isMobileOpen);
    } else {
      const newOpen = !isOpen;
      setOpen(newOpen);
    }
  };

  return {
    state,
    open: isOpen,
    setOpen,
    openMobile: isMobileOpen,
    setOpenMobile: setMobileOpen,
    isMobile,
    toggle,
    toggleSidebar: toggle,
  };
}
