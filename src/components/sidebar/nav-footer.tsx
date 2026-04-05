import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import Down from '@/components/icons/Down.Icon';
import Star from '@/components/icons/Star.Icon';
import Up from '@/components/icons/Up.Icon';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuItem as SidebarMenuSubItem, useSidebar } from '@/components/ui/sidebar';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils/cn.util';
import type { Route } from './nav-main';

export function FooterNavigation({ routes }: { routes: Route[] }) {
  const { state } = useSidebar();
  const { toggleFavorite, isFavorite } = useFavorites();
  const isCollapsed = state === 'collapsed';
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

  return (
    <SidebarMenu>
      {routes.map((route) => {
        const isOpen = !isCollapsed && openCollapsible === route.id;
        const hasSubRoutes = !!route.subs?.length;

        return (
          <SidebarMenuItem key={route.id}>
            {hasSubRoutes ? (
              <Collapsible open={isOpen} onOpenChange={(open) => setOpenCollapsible(open ? route.id : null)} className="w-full">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={cn(
                      'flex w-full items-center transition-colors',
                      isOpen ? 'bg-sidebar-muted text-foreground' : 'text-muted-foreground hover:bg-sidebar-muted hover:text-foreground',
                      isCollapsed && 'justify-center',
                    )}
                  >
                    {route.icon}
                    {!isCollapsed && <span className="ml-2 flex-1 truncate text-left">{route.title}</span>}
                    {!isCollapsed && hasSubRoutes && <span className="ml-auto">{isOpen ? <Up className="size-4" /> : <Down className="size-4" />}</span>}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {!isCollapsed && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {route.subs?.map((subRoute) => {
                        const favorited = isFavorite(subRoute.link);
                        return (
                          <SidebarMenuSubItem key={`${route.id}${subRoute.title}`} className="group/sub flex h-auto items-center">
                            <button
                              type="button"
                              onClick={() => toggleFavorite({ title: subRoute.title, link: subRoute.link })}
                              className={cn(
                                'mb-0.5 cursor-pointer transition-opacity duration-2000 ease-initial',
                                favorited ? 'text-amber-500/50 opacity-100' : 'text-muted-foreground opacity-0 hover:text-yellow-400 group-hover/sub:opacity-100',
                              )}
                            >
                              <Star className={cn('size-3', favorited && 'fill-current')} />
                            </button>
                            <SidebarMenuSubButton size="sm" asChild>
                              <Link to={subRoute.link} className="text-foreground hover:bg-sidebar-muted hover:text-muted-foreground">
                                {subRoute.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </Collapsible>
            ) : (
              <SidebarMenuButton className={cn('text-muted-foreground hover:bg-sidebar-muted hover:text-foreground', isCollapsed && 'justify-center')} asChild>
                <Link to={route.link} className={cn('flex items-center rounded-lg px-2', isCollapsed && 'justify-center')}>
                  {route.icon}
                  {!isCollapsed && <span className="ml-2">{route.title}</span>}
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
