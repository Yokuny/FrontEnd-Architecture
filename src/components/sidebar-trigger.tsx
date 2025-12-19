import { PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { cn } from "@/lib/utils";

interface SidebarTriggerProps {
  className?: string;
}

export function SidebarTrigger({ className }: SidebarTriggerProps) {
  const { toggle } = useSidebarToggle();

  return (
    <Button variant="ghost" size="icon" className={cn("size-7", className)} onClick={toggle} aria-label="Toggle Sidebar">
      <PanelLeft className="h-5 w-5" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
