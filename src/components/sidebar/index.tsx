'use client';

import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FooterNavigation } from '@/components/sidebar/nav-footer';
import AppNavigation, { type Route } from '@/components/sidebar/nav-main';
import { EnterpriseSwitcher } from '@/components/sidebar/switch-enterprise';
import { LanguageSwitcher } from '@/components/sidebar/switch-language';
import { NotificationsSwitcher } from '@/components/sidebar/switch-notifications';
import { SidebarSwitcher } from '@/components/sidebar/switch-sidebar';
import { ThemeSwitcher } from '@/components/sidebar/switch-theme';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarSeparator, useSidebar } from '@/components/ui/sidebar';
import { buildSidebarRoutes, type SidebarRoute } from '@/config/sidebarRoutes';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useEnterprisesSelect } from '@/hooks/use-enterprises-api';
import { cn } from '@/lib/utils';

const sampleNotifications = [
  {
    id: '1',
    avatar: '/avatars/01.png',
    fallback: 'OM',
    text: 'New order received.',
    time: '10m ago',
  },
  {
    id: '2',
    avatar: '/avatars/02.png',
    fallback: 'JL',
    text: 'Server upgrade completed.',
    time: '1h ago',
  },
  {
    id: '3',
    avatar: '/avatars/03.png',
    fallback: 'HH',
    text: 'New user signed up.',
    time: '2h ago',
  },
];

const THEMES_DARKS = ['dark', 'ocean-blue', 'system'];

const convertToNavRoutes = (routes: SidebarRoute[], t: (key: string) => string): Route[] => {
  return routes.map((route) => {
    const title = t(route.labelKey);

    return {
      id: route.id,
      title,
      icon: route.icon ? <route.icon className="size-4" /> : undefined,
      link: route.path,
      subs: route.children?.map((child) => ({
        title: t(child.labelKey),
        link: child.path,
        icon: child.icon ? <child.icon className="size-4" /> : undefined,
      })),
    };
  });
};

export function AppSidebar() {
  const { theme } = useTheme();
  const { state, setHovered } = useSidebar();
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();
  const enterprisesQuery = useEnterprisesSelect();
  const isCollapsed = state === 'collapsed';

  const isDark = theme && THEMES_DARKS.includes(theme);

  // Agrupando rotas que irão para o footer
  const footerPaths = ['/fleet-manager', '/ia'];

  const { filteredRoutes, footerRoutes } = useMemo(() => {
    const sidebarRoutes = buildSidebarRoutes();
    const allRoutes = convertToNavRoutes(sidebarRoutes, t);

    return {
      filteredRoutes: allRoutes.filter((r) => !footerPaths.includes(r.link)),
      footerRoutes: allRoutes.filter((r) => footerPaths.includes(r.link)),
    };
  }, [t]);

  const selectedEnterprise = useMemo(() => {
    if (!enterprisesQuery.data || !idEnterprise) return null;
    return enterprisesQuery.data.find((e) => e.id === idEnterprise);
  }, [enterprisesQuery.data, idEnterprise]);

  const enterpriseLogoUrl = useMemo(() => {
    if (!selectedEnterprise) return null;
    const imageDarkUrl = typeof selectedEnterprise.imageDark?.url === 'string' ? selectedEnterprise.imageDark.url : undefined;
    return isDark && imageDarkUrl ? imageDarkUrl : selectedEnterprise.image?.url;
  }, [selectedEnterprise, isDark]);

  return (
    <Sidebar variant="floating" collapsible="icon" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="transition-all duration-300 ease-in-out">
      <SidebarHeader className="items-center px-2 pt-3">
        <div className={cn('flex items-center')}>
          <div className={cn('flex items-center', isCollapsed && 'flex-col')}>
            <SidebarSwitcher />
            <NotificationsSwitcher notifications={sampleNotifications} />
          </div>
          {!isCollapsed && (
            <div className="flex items-center">
              <LanguageSwitcher />
              <ThemeSwitcher />
              <EnterpriseSwitcher />
            </div>
          )}
        </div>
        {!isCollapsed && enterpriseLogoUrl && (
          <div className="flex w-full items-center justify-center py-2">
            <img src={enterpriseLogoUrl} alt={selectedEnterprise?.name || 'Logo'} className="max-h-10 max-w-[140px] object-contain" />
          </div>
        )}
        <SidebarSeparator />
      </SidebarHeader>
      <SidebarContent className="px-2 py-1 text-muted-foreground">
        <AppNavigation routes={filteredRoutes} />
      </SidebarContent>
      <SidebarFooter className="px-2 pb-3">
        <FooterNavigation routes={footerRoutes} />
      </SidebarFooter>
    </Sidebar>
  );
}
