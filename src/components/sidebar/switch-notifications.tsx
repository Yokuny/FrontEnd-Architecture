import { Link } from '@tanstack/react-router';
import { MessageSquareCheckIcon } from '@/components/icons/MessageSquareCheck.Icon';
import { MessageSquareMoreIcon } from '@/components/icons/MessageSquareMore.Icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { t } from '@/lib/helpers/translate';

// --- Switcher ---

export function NotificationsSwitcher({ notifications }: { notifications: Notification[] }) {
  const { setMenuOpen } = useSidebarToggle();

  const hasNotifications = notifications.length > 0;

  return (
    <DropdownMenu onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="secondary" aria-label="Open notifications" className="group/notif relative">
          {hasNotifications ? <MessageSquareMoreIcon size={20} /> : <MessageSquareCheckIcon size={20} />}
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${hasNotifications ? 'bg-amber-400' : 'bg-green-400'}`} />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${hasNotifications ? 'bg-amber-500' : 'bg-green-500'}`} />
          </span>
          <span className="sr-only">Open notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="my-6 w-80">
        <DropdownMenuLabel>{t('alerts')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-72 overflow-y-auto">
          {hasNotifications ? (
            notifications.map(({ id, avatar, fallback, text, time }) => (
              <DropdownMenuItem key={id} className="flex items-start gap-3">
                <Avatar className="size-8">
                  <AvatarImage src={avatar} alt="Avatar" />
                  <AvatarFallback>{fallback}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="line-clamp-2 font-medium text-sm">{text}</span>
                  <span className="text-muted-foreground text-xs">{time}</span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">{t('notifications.empty')}</div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center font-mono text-muted-foreground text-sm hover:text-primary">
          <Link to="/reminders" search={{ showAll: true }}>
            {t('notifications.viewall')}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export type Notification = {
  id: string;
  avatar: string;
  fallback: string;
  text: string;
  time: string;
};
