import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ClipboardCheckIcon } from '@/components/icons/ClipboardCheck.Icon';
import { ScheduleDialog } from '@/components/schedule/schedule-dialog';
import { Kbd } from '@/components/ui/kbd';
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useModifierKeyLabel } from '@/hooks/use-modifier-key-label';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { t } from '@/lib/helpers/translate.helper';
import type { PartialSchedule } from '@/lib/interfaces/schedule.interface';
import { cn } from '@/lib/utils/cn.util';
import { scheduleKeys } from '@/query/schedule';

const SCHEDULE_KEYBOARD_SHORTCUT = 'e';

export function ScheduleDialogSwitcher() {
  const queryClient = useQueryClient();
  const { setMenuOpen } = useSidebarToggle();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const modifierLabel = useModifierKeyLabel();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === SCHEDULE_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = () => setOpen(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    setMenuOpen(isOpen);
  };

  const handleSave = (_saved: PartialSchedule) => {
    void queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    handleOpenChange(false);
  };

  const handleDelete = (_id: string) => {
    void queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    handleOpenChange(false);
  };

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setOpen(true)}
          aria-label={t('schedule.new')}
          tooltip={t('schedule.new')}
          className={cn('text-muted-foreground hover:bg-sidebar-muted hover:text-foreground', isCollapsed && 'justify-center')}
        >
          <ClipboardCheckIcon size={14} className="shrink-0" />
          {!isCollapsed && (
            <>
              <span className="ml-2 flex-1 truncate text-left">{t('schedule.new')}</span>
              <Kbd className="uppercase">
                {modifierLabel}
                {SCHEDULE_KEYBOARD_SHORTCUT}
              </Kbd>
            </>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
      <ScheduleDialog open={open} onOpenChange={handleOpenChange} onClose={handleClose} event={null} onSave={handleSave} onDelete={handleDelete} />
    </>
  );
}
