import { Moon, Settings, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';

type Theme = 'light' | 'dark' | 'system';

export function ThemeSwitcher() {
  const { state: sidebarState, setMenuOpen } = useSidebarToggle();
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <DropdownMenu onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="relative group">
          <div key={sidebarState} className="animate-pop flex items-center justify-center text-muted-foreground">
            <Sun className="size-5 scale-100 transition-all dark:scale-0" />
            <Moon className="absolute size-5 scale-0 transition-all dark:scale-100" />
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeTheme('system')} className={theme === 'system' ? 'bg-accent' : ''}>
          <Settings className="mr-2 size-4" />
          System {theme === 'system' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme('light')} className={theme === 'light' ? 'bg-accent' : ''}>
          <Sun className="mr-2 size-4" />
          Light {theme === 'light' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme('dark')} className={theme === 'dark' ? 'bg-accent' : ''}>
          <Moon className="mr-2 size-4" />
          Dark {theme === 'dark' && '✓'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
