'use client';

import { Airplay, Navigation, Ship } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import AppNavigation from '@/components/sidebar/nav-main';
import { NotificationsPopover } from '@/components/sidebar/nav-notifications';
import { TeamSwitcher } from '@/components/sidebar/team-switcher';
import { useDynamicRoutes } from '@/components/sidebar/use-dynamic-routes';
import { SidebarTrigger } from '@/components/sidebar-trigger';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarSeparator, useSidebar } from '@/components/ui/sidebar';
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
  const { state, setHovered } = useSidebar();
  const isCollapsed = state === 'collapsed';

  // Usar rotas dinâmicas baseadas em MAIN_ROUTES
  const dynamicRoutes = useDynamicRoutes();

  return (
    <Sidebar variant="floating" collapsible="icon" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="transition-all duration-300 ease-in-out">
      <SidebarHeader className="pt-3 items-center gap-2 px-2">
        <div className={cn('flex items-center')}>
          <div className={cn('flex items-center', isCollapsed && 'flex-col')}>
            <SidebarTrigger />
            <NotificationsPopover notifications={sampleNotifications} />
          </div>
          {!isCollapsed && (
            <div className="flex items-center">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          )}
        </div>
        <SidebarSeparator />
      </SidebarHeader>
      <SidebarContent className="gap-4 px-2 py-4">
        <AppNavigation routes={dynamicRoutes} />
      </SidebarContent>
      <SidebarFooter className="px-2">
        <TeamSwitcher teams={teams} />
      </SidebarFooter>
    </Sidebar>
  );
}
