'use client';

import type { Variants } from 'framer-motion';
import { motion, useAnimation } from 'framer-motion';
import { forwardRef, type HTMLAttributes, useCallback, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { cn } from '@/lib/utils';

// --- Switcher ---

export type Notification = {
  id: string;
  avatar: string;
  fallback: string;
  text: string;
  time: string;
};

export function NotificationsSwitcher({ notifications }: { notifications: Notification[] }) {
  const { setMenuOpen } = useSidebarToggle();
  const { t } = useTranslation();

  const hasNotifications = notifications.length > 0;

  return (
    <DropdownMenu onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="relative" aria-label="Open notifications">
          {hasNotifications ? <BellElectricIcon size={20} /> : <MailCheckIcon size={20} />}
          {hasNotifications && (
            <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          )}
          <span className="sr-only">Open notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="w-80 my-6">
        <DropdownMenuLabel>{t('notifications')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {hasNotifications ? (
            notifications.map(({ id, avatar, fallback, text, time }) => (
              <DropdownMenuItem key={id} className="flex items-start gap-3">
                <Avatar className="size-8">
                  <AvatarImage src={avatar} alt="Avatar" />
                  <AvatarFallback>{fallback}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium line-clamp-2">{text}</span>
                  <span className="text-xs text-muted-foreground">{time}</span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">{t('notifications.empty')}</div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-sm text-muted-foreground font-mono hover:text-primary">{t('notifications.viewall')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// --- Icons ---

export interface MailCheckIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface MailCheckIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const CHECK_VARIANTS: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
      pathLength: { duration: 0.4, ease: 'easeInOut' },
      opacity: { duration: 0.4, ease: 'easeInOut' },
    },
  },
};

const MailCheckIcon = forwardRef<MailCheckIconHandle, MailCheckIconProps>(({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
  const controls = useAnimation();
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;

    return {
      startAnimation: () => controls.start('animate'),
      stopAnimation: () => controls.start('normal'),
    };
  });

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseEnter?.(e);
      } else {
        controls.start('animate');
      }
    },
    [controls, onMouseEnter],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseLeave?.(e);
      } else {
        controls.start('normal');
      }
    },
    [controls, onMouseLeave],
  );

  return (
    <div className={cn(className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
      <svg
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>No Notifications</title>
        <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        <motion.path animate={controls} d="m16 19 2 2 4-4" initial="normal" style={{ transformOrigin: 'center' }} variants={CHECK_VARIANTS} />
      </svg>
    </div>
  );
});

MailCheckIcon.displayName = 'MailCheckIcon';

export interface BellElectricIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface BellElectricIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const BellElectricIcon = forwardRef<BellElectricIconHandle, BellElectricIconProps>(({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
  const controls = useAnimation();
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;
    return {
      startAnimation: () => controls.start('animate'),
      stopAnimation: () => controls.start('normal'),
    };
  });

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseEnter?.(e);
      } else {
        controls.start('animate');
      }
    },
    [controls, onMouseEnter],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseLeave?.(e);
      } else {
        controls.start('normal');
      }
    },
    [controls, onMouseLeave],
  );

  return (
    <div className={cn(className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
      <motion.svg
        animate={controls}
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
        transition={{ duration: 0.9 }}
        variants={{
          normal: { rotate: 0, translateX: 0, translateY: 0 },
          animate: {
            rotate: [0, -12, 12, -8, 8, 0],
            translateX: [0, -1.5, 1.5, -1, 1, 0],
            translateY: [0, -1, 1, -0.5, 0.5, 0],
          },
        }}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Notifications</title>
        <path d="M18.518 17.347A7 7 0 0 1 14 19" />
        <motion.path
          animate={controls}
          d="M18.8 4A11 11 0 0 1 20 9"
          style={{ transformBox: 'fill-box', originX: '50%', originY: '50%' }}
          transition={{ duration: 0.9 }}
          variants={{
            normal: { translateX: 0, translateY: 0, rotate: 0 },
            animate: {
              translateX: [0, -0.8, 0.8, -0.6, 0.6, 0],
              translateY: [0, -0.5, 0.5, -0.3, 0.3, 0],
              rotate: [0, -6, 6, -4, 4, 0],
            },
          }}
        />
        <motion.path
          animate={controls}
          d="M9 9h.01"
          style={{ transformBox: 'fill-box', originX: '50%', originY: '50%' }}
          transition={{ duration: 0.75 }}
          variants={{
            normal: { translateX: 0, translateY: 0, rotate: 0, scale: 1 },
            animate: {
              translateX: [0, -1.6, 1.6, -1.2, 1.2, 0],
              translateY: [0, -1.2, 1.2, -0.8, 0.8, 0],
              rotate: [0, -10, 10, -7, 7, 0],
              scale: [1, 1.08, 0.95, 1.06, 0.98, 1],
            },
          }}
        />
        <circle cx="9" cy="9" r="7" />
        <rect height="6" rx="2" width="10" x="4" y="16" />
        <circle cx="20" cy="16" r="2" />
      </motion.svg>
    </div>
  );
});

BellElectricIcon.displayName = 'BellElectricIcon';
