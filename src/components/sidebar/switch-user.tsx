import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import IconAccess from '@/components/icons/Access.Icon';
import IconExit from '@/components/icons/Exit.Icon';
import IconUser from '@/components/icons/User.Icon';
import { UserAnimatedIcon } from '@/components/icons/UserAnimated.Icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/hooks/auth';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { t } from '@/lib/helpers/translate';

export function UserSwitcher() {
  const { setMenuOpen } = useSidebarToggle();
  const { logout } = useAuthStore();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } finally {
      setIsLoading(false);
      setShowLogoutDialog(false);
    }
  };

  return (
    <>
      <DropdownMenu onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="secondary">
            <UserAnimatedIcon className="flex h-full w-full items-center justify-center text-foreground" size={16} />
            <span className="sr-only">User actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link to="/settings/profile" className="flex w-full cursor-pointer items-center">
              <IconUser className="mr-2" />
              {t('profile')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings/access" className="flex w-full cursor-pointer items-center">
              <IconAccess className="mr-2" />
              {t('access')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" className="cursor-pointer" onSelect={() => setShowLogoutDialog(true)}>
            <IconExit className="mr-2" />
            {t('logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('logout')}</AlertDialogTitle>
            <AlertDialogDescription>{t('logout.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              {isLoading ? t('logout.loading') : t('logout')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
