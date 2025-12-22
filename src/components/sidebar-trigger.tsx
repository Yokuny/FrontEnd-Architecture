import { PanelLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';

export function SidebarTrigger() {
  const { toggle } = useSidebarToggle();

  return (
    <Button variant="ghost" onClick={toggle} aria-label="Toggle Sidebar">
      <PanelLeft className="size-5" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
