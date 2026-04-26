import { MaximizeIcon } from '@/components/icons/MaximizeSidebar.Icon';
import { MinimizeIcon } from '@/components/icons/MinimizeSidebar.Icon';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { SIDEBAR_KEYBOARD_SHORTCUT } from '@/components/ui/sidebar';
import { useModifierKeyLabel } from '@/hooks/use-modifier-key-label';
import { useSidebar } from '@/hooks/use-sidebar-toggle';
import { t } from '@/lib/helpers/translate.helper';

export function SidebarSwitcher() {
  const { open, isHovered, toggle } = useSidebar();
  const modifierLabel = useModifierKeyLabel();

  const getIconData = () => {
    if (open) return MaximizeIcon;
    if (isHovered) return MinimizeIcon;
    return null;
  };

  const Icon = getIconData();

  return (
    <Button size="icon" variant="blank" onClick={toggle} aria-label={t('sidebar.toggle')}>
      <span className="sr-only">{t('sidebar.toggle')}</span>
      {Icon ? (
        <Icon size={16} />
      ) : (
        <Kbd className="uppercase">
          {modifierLabel}
          {SIDEBAR_KEYBOARD_SHORTCUT}
        </Kbd>
      )}
    </Button>
  );
}
