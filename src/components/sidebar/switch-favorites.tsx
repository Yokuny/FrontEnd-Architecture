import { Link } from '@tanstack/react-router';
import { FolderHeartIcon } from '@/components/icons/FolderHeart.Icon';
import Cross from '@/components/icons/Cross.Icon';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useFavorites } from '@/hooks/use-favorites';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { ItemDescription, ItemTitle } from '../ui/item';

export function FavoritesSwitcher() {
  const { setMenuOpen } = useSidebarToggle();
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <DropdownMenu onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="secondary" className="flex items-center justify-center">
          <FolderHeartIcon size={16} className="text-foreground" />
          <span className="sr-only">Favoritos</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
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
  );
}
