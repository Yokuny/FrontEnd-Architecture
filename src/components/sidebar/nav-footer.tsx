'use client';

import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AIPromptSheet } from '@/components/ai-prompt';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Kbd } from '@/components/ui/kbd';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { cn } from '@/lib/utils';
import type { Route } from './nav-main';
import { ShipIcon } from './ship-icon';
import { SparklesIcon } from './sparkles-icon';
import { FavoritesSwitcher } from './switch-favorites';

export function FooterNavigation({ routes }: { routes: Route[] }) {
  const { t } = useTranslation();
  const { state } = useSidebar();
  const { setMenuOpen } = useSidebarToggle();
  const isCollapsed = state === 'collapsed';
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'g' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsPromptOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

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
              <DropdownMenu
                onOpenChange={(open) => {
                  setOpenDropdown(open ? route.id : null);
                  setMenuOpen(open);
                }}
              >
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="default"
                    className={cn(
                      'transition-all',
                      openDropdown === route.id ? 'bg-sidebar-muted text-foreground' : 'text-muted-foreground hover:bg-sidebar-muted hover:text-foreground',
                      isCollapsed ? 'justify-center' : 'justify-start',
                    )}
                  >
                    {customIcon || route.icon}
                    {!isCollapsed && <span className="ml-2 flex-1 truncate text-left">{route.title}</span>}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="right" className="min-w-48">
                  {route.id === 'ia' && (
                    <DropdownMenuItem
                      onClick={() => {
                        setIsPromptOpen(true);
                        setOpenDropdown(null);
                      }}
                      className="flex cursor-pointer items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <SparklesIcon size={16} />
                        <span>{t('ai.assistant')}</span>
                      </div>
                      <Kbd className="ml-auto">Ctrl G</Kbd>
                    </DropdownMenuItem>
                  )}
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
              <SidebarMenuButton
                size="default"
                className={cn('text-muted-foreground transition-all hover:bg-sidebar-muted hover:text-foreground', isCollapsed ? 'justify-center' : 'justify-start')}
                asChild
              >
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
      <AIPromptSheet open={isPromptOpen} onOpenChange={setIsPromptOpen} />
    </SidebarMenu>
  );
}
