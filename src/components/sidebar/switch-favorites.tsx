import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ClipboardDocumentListIcon } from '@/components/icons/ClipboardDocumentList.Icon';
import Cross from '@/components/icons/Cross.Icon';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useFavorites } from '@/hooks/use-favorites';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { cn } from '@/lib/utils';
import { ItemDescription, ItemTitle } from '../ui/item';

export function FavoritesSwitcher() {
  const { state } = useSidebar();
  const { setMenuOpen } = useSidebarToggle();
  const { favorites, toggleFavorite } = useFavorites();
  const isCollapsed = state === 'collapsed';
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarMenuItem>
      <DropdownMenu
        onOpenChange={(open) => {
          setIsOpen(open);
          setMenuOpen(open);
        }}
      >
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="default"
            className={cn(
              'transition-all',
              isOpen ? 'bg-sidebar-muted text-foreground' : 'text-muted-foreground hover:bg-sidebar-muted hover:text-foreground',
              isCollapsed ? 'justify-center' : 'justify-start',
            )}
          >
            <ClipboardDocumentListIcon size={20} className="flex items-center justify-center" />
            {!isCollapsed && <span className="ml-2 flex-1 truncate text-left font-mono text-sm">Favoritos</span>}
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right" className="min-w-48">
          {favorites.length === 0 ? (
            <DropdownMenuItem disabled>
              <ItemDescription>Nenhum favorito adicionado</ItemDescription>
            </DropdownMenuItem>
          ) : (
            favorites.map((fav) => (
              <DropdownMenuItem key={fav.link} className="group/fav-item flex items-center justify-between gap-2">
                <Link to={fav.link} className="flex grow items-center gap-2">
                  <ItemTitle className="truncate">{fav.title}</ItemTitle>
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(fav);
                  }}
                  className="opacity-0 transition-opacity group-hover/fav-item:opacity-100"
                >
                  <Cross className="size-4 text-muted-foreground" />
                </button>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
