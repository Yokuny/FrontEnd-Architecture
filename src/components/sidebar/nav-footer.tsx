'use client';

import { Link } from '@tanstack/react-router';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { cn } from '@/lib/utils';
import type { Route } from './nav-main';
import { ShipIcon } from './ship-icon';
import { SparklesIcon } from './sparkles-icon';
import { FavoritesSwitcher } from './switch-favorites';

export function FooterNavigation({ routes }: { routes: Route[] }) {
  const { state } = useSidebar();
  const { setMenuOpen } = useSidebarToggle();
  const isCollapsed = state === 'collapsed';

  const getIconForRoute = (routeId: string) => {
    if (routeId === 'ia') return <SparklesIcon size={20} />;
    if (routeId === 'fleet-manager') return <ShipIcon size={20} />;
    return null;
  };

  return (
    <SidebarMenu>
      {routes.map((route) => {
        const hasSubRoutes = !!route.subs?.length;
        const customIcon = getIconForRoute(route.id);

        return (
          <SidebarMenuItem key={route.id}>
            {hasSubRoutes ? (
              <DropdownMenu onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="default" className={cn('transition-all', isCollapsed ? 'justify-center' : 'justify-start')}>
                    {customIcon || route.icon}
                    {!isCollapsed && <span className="ml-2 flex-1 truncate text-left">{route.title}</span>}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="right" className="min-w-48">
                  {route.subs?.map((sub) => (
                    <DropdownMenuItem key={sub.link} asChild>
                      <Link to={sub.link} className="flex items-center gap-2">
                        {sub.icon}
                        <span>{sub.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton size="default" className={cn('transition-all', isCollapsed ? 'justify-center' : 'justify-start')} asChild>
                <Link to={route.link}>
                  {customIcon || route.icon}
                  {!isCollapsed && <span className="ml-2 flex-1 truncate text-left">{route.title}</span>}
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        );
      })}
      <FavoritesSwitcher />
    </SidebarMenu>
  );
}
