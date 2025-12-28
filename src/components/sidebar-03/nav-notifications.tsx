'use client';

import { MessageCircleWarning } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';

export type Notification = {
  id: string;
  avatar: string;
  fallback: string;
  text: string;
  time: string;
};

export function NotificationsPopover({ notifications }: { notifications: Notification[] }) {
  const { state, setMenuOpen } = useSidebarToggle();

  return (
    <DropdownMenu onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Open notifications">
          <MessageCircleWarning key={state} className="size-5 animate-swing text-muted-foreground" />
          <span className="sr-only">Open notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="w-80 my-6">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map(({ id, avatar, fallback, text, time }) => (
          <DropdownMenuItem key={id} className="flex items-start gap-3">
            <Avatar className="size-8">
              <AvatarImage src={avatar} alt="Avatar" />
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{text}</span>
              <span className="text-xs text-muted-foreground">{time}</span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-sm text-muted-foreground hover:text-primary">View all notifications</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
