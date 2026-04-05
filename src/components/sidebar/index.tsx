import { useMemo } from 'react';
import { FooterNavigation } from '@/components/sidebar/nav-footer';
import AppNavigation, { type Route } from '@/components/sidebar/nav-main';
import { SidebarSwitcher } from '@/components/sidebar/switch-sidebar';
import { ThemeSwitcher } from '@/components/sidebar/switch-theme';
import { UserSwitcher } from '@/components/sidebar/switch-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarSeparator, useSidebar } from '@/components/ui/sidebar';
import type { SidebarRoute } from '@/lib/config/sidebarRoutes.config';
import { buildSidebarRoutes } from '@/lib/config/sidebarRoutes.config';
import { t } from '@/lib/helpers/translate.helper';
import { cn } from '@/lib/utils/cn.util';
import { FavoritesSwitcher } from './switch-favorites';
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

  const { mainRoutes, footerRoutes } = useMemo(() => {
    const sidebarRoutes = buildSidebarRoutes();
    const allRoutes = convertToNavRoutes(sidebarRoutes);

    return {
      mainRoutes: allRoutes.filter((route) => route.id !== 'settings'),
      footerRoutes: allRoutes.filter((route) => route.id === 'settings'),
    };
  }, []);

  return (
    <Sidebar variant="floating" collapsible="icon" className="transition-all duration-300 ease-in-out" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <SidebarHeader className="items-center px-2 pt-3">
        <div className="flex items-center">
          <div className={cn('flex items-center', isCollapsed && 'flex-col')}>
            <SidebarSwitcher />
            <NotificationsSwitcher notifications={[]} />
          </div>
          {!isCollapsed && (
            <>
              <FavoritesSwitcher />
              <ThemeSwitcher />
              <UserSwitcher />
            </>
          )}
        </div>
        <SidebarSeparator />
      </SidebarHeader>
      <SidebarContent className="px-2 py-1 text-muted-foreground">
        <AppNavigation routes={mainRoutes} />
      </SidebarContent>
      <SidebarFooter className="px-2 pb-3">
        <FooterNavigation routes={footerRoutes} />
      </SidebarFooter>
    </Sidebar>
  );
}
