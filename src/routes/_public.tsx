import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { CloudSunIcon } from '@/components/icons/CloudSun.Icon';
import Gear from '@/components/icons/Gear.Icon';
import { MoonIcon } from '@/components/icons/MoonTheme.Icon';
import { SunDimIcon } from '@/components/icons/SunDim.Icon';
import { SunIcon } from '@/components/icons/SunTheme.Icon';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { t } from '@/lib/helpers/translate.helper';

// --- Inline ThemeSwitcher sem dependência do useSidebarToggle ---
function _PublicThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button size="icon-sm" variant="outline" className="rounded-lg border-transparent bg-transparent hover:bg-muted">
        <SunIcon className="size-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-sm" variant="outline" className="rounded-lg border-transparent bg-transparent hover:bg-muted">
          {theme === 'sunset' ? (
            <SunDimIcon size={15} />
          ) : theme === 'ocean-blue' ? (
            <CloudSunIcon size={15} />
          ) : resolvedTheme === 'dark' ? (
            <MoonIcon size={15} />
          ) : (
            <SunIcon size={15} />
          )}
          <span className="sr-only">{t('theme')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('system')} className={theme === 'system' ? 'bg-accent font-medium' : ''}>
          <Gear />
          {t('system')} {theme === 'system' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('light')} className={theme === 'light' ? 'bg-accent font-medium' : ''}>
          <SunIcon />
          {t('light')} {theme === 'light' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('sunset')} className={theme === 'sunset' ? 'bg-accent font-medium' : ''}>
          <SunDimIcon />
          {t('sunset')} {theme === 'sunset' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className={theme === 'dark' ? 'bg-accent font-medium' : ''}>
          <MoonIcon />
          {t('dark')} {theme === 'dark' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('ocean-blue')} className={theme === 'ocean-blue' ? 'bg-accent font-medium' : ''}>
          <CloudSunIcon />
          {t('ocean')} {theme === 'ocean-blue' && '✓'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-6 md:px-6">
      <Outlet />
    </div>
  );
}

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});
