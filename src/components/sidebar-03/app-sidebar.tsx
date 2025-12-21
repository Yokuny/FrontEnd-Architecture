'use client';

import { motion } from 'framer-motion';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Logo } from '@/components/sidebar-03/logo';
import DashboardNavigation from '@/components/sidebar-03/nav-main';
import { NotificationsPopover } from '@/components/sidebar-03/nav-notifications';
import { TeamSwitcher } from '@/components/sidebar-03/team-switcher';
import { useDynamicRoutes } from '@/components/sidebar-03/use-dynamic-routes';
import { SidebarTrigger } from '@/components/sidebar-trigger';
import { ThemeSwitcher } from '@/components/theme-switcher';
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
  { id: '1', name: 'Alpha Inc.', logo: Logo, plan: 'Free' },
  { id: '2', name: 'Beta Corp.', logo: Logo, plan: 'Free' },
  { id: '3', name: 'Gamma Tech', logo: Logo, plan: 'Free' },
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
        <a href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          {!isCollapsed && <span className="font-semibold text-black dark:text-white">Acme</span>}
        </a>

        <motion.div
          key={isCollapsed ? 'header-collapsed' : 'header-expanded'}
          className={cn('flex items-center gap-2', isCollapsed ? 'flex-row md:flex-col-reverse' : 'flex-row')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <LanguageSwitcher />
          <ThemeSwitcher />
          <SidebarTrigger />
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="gap-4 px-2 py-4">
        <DashboardNavigation routes={dynamicRoutes} />
      </SidebarContent>
      <SidebarFooter className="px-2">
        <NotificationsPopover notifications={sampleNotifications} />
        <TeamSwitcher teams={teams} />
      </SidebarFooter>
    </Sidebar>
  );
}
