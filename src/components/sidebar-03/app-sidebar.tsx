'use client';

import { Airplay, Navigation, Ship } from 'lucide-react';
import DashboardNavigation from '@/components/sidebar-03/nav-main';
import { SettingsCard } from '@/components/sidebar-03/settings-card';
import { TeamSwitcher } from '@/components/sidebar-03/team-switcher';
import { useDynamicRoutes } from '@/components/sidebar-03/use-dynamic-routes';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from '@/components/ui/sidebar';
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

const teams = [
  { id: '1', name: 'Alpha Inc.', logo: Navigation, plan: 'Free' },
  { id: '2', name: 'Beta Corp.', logo: Airplay, plan: 'Free' },
  { id: '3', name: 'Gamma Tech', logo: Ship, plan: 'Free' },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  // Usar rotas dinâmicas baseadas em MAIN_ROUTES
  const dynamicRoutes = useDynamicRoutes();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader
        className={cn(
          'flex md:pt-3.5',
          isCollapsed ? 'flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start' : 'flex-row items-center justify-between',
        )}
      >
        <SettingsCard notifications={sampleNotifications} />
      </SidebarHeader>
      <SidebarContent className="gap-4 px-2 py-4">
        <DashboardNavigation routes={dynamicRoutes} />
      </SidebarContent>
      <SidebarFooter className="px-2">
        <TeamSwitcher teams={teams} />
      </SidebarFooter>
    </Sidebar>
  );
}
