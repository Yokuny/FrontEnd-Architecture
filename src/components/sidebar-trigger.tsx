import { PanelLeftOpen, PanelRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { cn } from '@/lib/utils';

export function SidebarTrigger() {
  const { state, toggle } = useSidebarToggle();
  const Icon = state === 'collapsed' ? PanelRight : PanelLeftOpen;

  return (
    <Button size="icon" variant="ghost" onClick={toggle} aria-label="Toggle Sidebar">
      <div className={cn('transition-all duration-300', state === 'expanded' && 'rotate-180')}>
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
