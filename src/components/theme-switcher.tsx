import { Bubbles, Moon, Settings, Sun, SunDim, Sunset } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';

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
      <Button size="icon" variant="ghost">
        <Sun className="size-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="relative group">
          <div className="animate-pop flex items-center justify-center text-muted-foreground">
            {theme === 'sunset' ? (
              <SunDim className="size-5" />
            ) : theme === 'ocean-blue' ? (
              <Bubbles className="size-5" />
            ) : resolvedTheme === 'dark' ? (
              <Moon className="size-5" />
            ) : (
              <Sun className="size-5" />
            )}
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('system')} className={theme === 'system' ? 'bg-accent font-medium' : ''}>
          <Settings className="mr-2 size-4" />
          System {theme === 'system' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('light')} className={theme === 'light' ? 'bg-accent font-medium' : ''}>
          <Sun className="mr-2 size-4" />
          Light {theme === 'light' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('sunset')} className={theme === 'sunset' ? 'bg-accent font-medium' : ''}>
          <SunDim className="mr-2 size-4" />
          Sunset {theme === 'sunset' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className={theme === 'dark' ? 'bg-accent font-medium' : ''}>
          <Moon className="mr-2 size-4" />
          Dark {theme === 'dark' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('ocean-blue')} className={theme === 'ocean-blue' ? 'bg-accent font-medium' : ''}>
          <Bubbles className="mr-2 size-4" />
          Ocean Blue {theme === 'ocean-blue' && '✓'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
