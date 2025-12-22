'use client';

import { LanguageSwitcher } from '@/components/language-switcher';
import { type Notification, NotificationsPopover } from '@/components/sidebar-03/nav-notifications';
import { SidebarTrigger } from '@/components/sidebar-trigger';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';

type SettingsCardProps = {
  notifications?: Notification[];
};

export function SettingsCard({ notifications = [] }: SettingsCardProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="cursor-default hover:bg-transparent active:bg-transparent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          asChild
        >
          <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'justify-between gap-3'}`}>
            <SidebarTrigger />
            <NotificationsPopover notifications={notifications} />
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
