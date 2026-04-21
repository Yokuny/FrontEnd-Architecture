import { Maximize2Icon } from '@/components/icons/Maximize2Sidebar.Icon';
import { MaximizeIcon } from '@/components/icons/MaximizeSidebar.Icon';
import { MinimizeIcon } from '@/components/icons/MinimizeSidebar.Icon';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/hooks/use-sidebar-toggle';
import { t } from '@/lib/helpers/translate.helper';

export function SidebarSwitcher() {
  const { open, isHovered, toggle } = useSidebar();

  const getIconData = () => {
    if (open) return MaximizeIcon;
    if (isHovered) return MinimizeIcon;
    return Maximize2Icon;
  };

  const Icon = getIconData();

  return (
    <Button size="icon" variant="secondary" onClick={toggle} aria-label={t('sidebar.toggle')}>
      <Icon size={16} />
      <span className="sr-only">{t('sidebar.toggle')}</span>
    </Button>
  );
}
