import { Link } from '@tanstack/react-router';
import Cross from '@/components/icons/Cross.Icon';
import { StarIcon } from '@/components/icons/StarAnimated.Icon';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useFavorites } from '@/hooks/use-favorites';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { t } from '@/lib/helpers/translate.helper';
import { cn } from '@/lib/utils/cn.util';
import { ItemDescription, ItemTitle } from '../ui/item';

export function FavoritesSwitcher() {
  const { setMenuOpen } = useSidebarToggle();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <SidebarMenuItem>
      <DropdownMenu onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            aria-label={t('favorites')}
            tooltip={t('favorites')}
            className={cn('text-muted-foreground hover:bg-sidebar-muted hover:text-foreground', isCollapsed && 'justify-center')}
          >
            <StarIcon size={16} className="shrink-0" />
            {!isCollapsed && <span className="ml-2">{t('favorites')}</span>}
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          {favorites.length === 0 ? (
            <DropdownMenuItem disabled>
              <ItemDescription>{t('favorites.empty')}</ItemDescription>
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
