import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightFromLine, Pin, PinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/hooks/use-sidebar-toggle';

export function SidebarTrigger() {
  const { open, isHovered, toggle } = useSidebar();

  const getIconData = () => {
    if (open) return { Icon: PinOff, key: 'pinoff' };
    if (isHovered) return { Icon: Pin, key: 'pin' };
    return { Icon: ArrowRightFromLine, key: 'arrow' };
  };

  const { Icon, key } = getIconData();

  return (
    <Button size="icon" variant="ghost" onClick={toggle} aria-label="Toggle Sidebar" className="relative overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={key}
          initial={{ rotate: -15 }}
          animate={{
            rotate: [0, 0, 10, 0, 10, -10, 0],
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          className="flex items-center justify-center h-full w-full"
        >
          <Icon className="size-5 text-muted-foreground" />
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
