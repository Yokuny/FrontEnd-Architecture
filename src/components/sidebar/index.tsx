import { useMemo } from 'react';
import { FooterNavigation } from '@/components/sidebar/nav-footer';
import AppNavigation, { type Route } from '@/components/sidebar/nav-main';
import { SidebarSwitcher } from '@/components/sidebar/switch-sidebar';
import { ThemeSwitcher } from '@/components/sidebar/switch-theme';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarSeparator, useSidebar } from '@/components/ui/sidebar';
import type { SidebarRoute } from '@/config/sidebarRoutes';
import { buildSidebarRoutes } from '@/config/sidebarRoutes';
import { t } from '@/config/translate';

import { cn } from '@/lib/utils';
import { NotificationsSwitcher } from './switch-notifications';

const convertToNavRoutes = (routes: SidebarRoute[]): Route[] => {
  return routes.map((route) => ({
    id: route.id,
    title: t(route.labelKey),
    icon: route.icon,
    link: route.path,
    subs: route.children?.map((child) => ({
      title: t(child.labelKey),
      link: child.path,
      icon: child.icon,
    })),
  }));
};

export function AppSidebar() {
  const { state, setHovered } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const navRoutes = useMemo(() => {
    const sidebarRoutes = buildSidebarRoutes();
    return convertToNavRoutes(sidebarRoutes);
  }, []);

  return (
    <Sidebar variant="floating" collapsible="icon" className="transition-all duration-300 ease-in-out" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <SidebarHeader className="items-center px-2 pt-3">
        <div className="flex items-center">
          <div className={cn('flex items-center', isCollapsed && 'flex-col')}>
            <SidebarSwitcher />
            <NotificationsSwitcher notifications={[]} />
          </div>
          {!isCollapsed && <ThemeSwitcher />}
        </div>
        <SidebarSeparator />
      </SidebarHeader>
      <SidebarContent className="px-2 py-1 text-muted-foreground">
        <AppNavigation routes={navRoutes} />
      </SidebarContent>
      <SidebarFooter className="px-2 pb-3">
        <FooterNavigation routes={[]} />
      </SidebarFooter>
    </Sidebar>
  );
}
