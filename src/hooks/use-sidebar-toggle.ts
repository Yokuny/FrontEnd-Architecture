import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useIsMobile } from '@/hooks/use-mobile';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';

type SidebarToggleStore = {
  isOpen: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  isMenuOpen: boolean;
  setOpen: (open: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  setHovered: (hovered: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  toggle: () => void;
  // Computed state
  state: 'expanded' | 'collapsed';
};

export const useSidebarToggle = create<SidebarToggleStore>()(
  persist(
    (set, get) => ({
      isOpen: true,
      isMobileOpen: false,
      isHovered: false,
      isMenuOpen: false,
      state: 'expanded',

      setOpen: (open: boolean) => {
        set({ isOpen: open, state: open ? 'expanded' : 'collapsed' });
      },

      setMobileOpen: (open: boolean) => {
        set({ isMobileOpen: open });
      },

      setHovered: (hovered: boolean) => {
        const { isOpen, isMenuOpen } = get();
        set({
          isHovered: hovered,
          state: isOpen || hovered || isMenuOpen ? 'expanded' : 'collapsed',
        });
      },

      setMenuOpen: (open: boolean) => {
        const { isOpen, isHovered } = get();
        set({
          isMenuOpen: open,
          state: isOpen || isHovered || open ? 'expanded' : 'collapsed',
        });
      },

      toggle: () => {
        const { isOpen } = get();
        const newOpen = !isOpen;
        set({
          isOpen: newOpen,
          state: newOpen ? 'expanded' : 'collapsed',
        });
      },
    }),
    {
      name: SIDEBAR_COOKIE_NAME,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isOpen: state.isOpen,
        state: state.state,
      }),
    },
  ),
);

// Hook wrapper que combina Zustand com detecção mobile
export function useSidebar() {
  const isMobile = useIsMobile();
  const { isOpen, isMobileOpen, isHovered, isMenuOpen, state, setOpen, setMobileOpen, setHovered, setMenuOpen } = useSidebarToggle();

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
    isHovered,
    setHovered,
    isMenuOpen,
    setMenuOpen,
    isMobile,
    toggle,
    toggleSidebar: toggle,
  };
}
