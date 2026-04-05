import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { CloudSunIcon } from '@/components/icons/CloudSun.Icon';
import Gear from '@/components/icons/Gear.Icon';
import { MoonIcon } from '@/components/icons/MoonTheme.Icon';
import { SunDimIcon } from '@/components/icons/SunDim.Icon';
import { SunIcon } from '@/components/icons/SunTheme.Icon';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';

// --- Switcher ---

export function ThemeSwitcher() {
  const { setMenuOpen } = useSidebarToggle();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button size="icon" variant="secondary">
        <SunIcon className="flex h-full w-full items-center justify-center" />
      </Button>
    );
  }

  return (
    <DropdownMenu onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="secondary">
          {theme === 'sunset' ? (
            <SunDimIcon size={16} className="flex h-full w-full items-center justify-center" />
          ) : theme === 'ocean-blue' ? (
            <CloudSunIcon size={16} className="flex h-full w-full items-center justify-center" />
          ) : resolvedTheme === 'dark' ? (
            <MoonIcon size={16} className="flex h-full w-full items-center justify-center" />
          ) : (
            <SunIcon size={16} className="flex h-full w-full items-center justify-center" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setTheme('system')} className={theme === 'system' ? 'bg-accent font-medium' : ''}>
          <Gear />
          System {theme === 'system' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('light')} className={theme === 'light' ? 'bg-accent font-medium' : ''}>
          <SunIcon />
          Light {theme === 'light' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('sunset')} className={theme === 'sunset' ? 'bg-accent font-medium' : ''}>
          <SunDimIcon />
          Sunset {theme === 'sunset' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className={theme === 'dark' ? 'bg-accent font-medium' : ''}>
          <MoonIcon />
          Dark {theme === 'dark' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('ocean-blue')} className={theme === 'ocean-blue' ? 'bg-accent font-medium' : ''}>
          <CloudSunIcon />
          Ocean Blue {theme === 'ocean-blue' && '✓'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
