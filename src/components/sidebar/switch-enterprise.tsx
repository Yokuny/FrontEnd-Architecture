'use client';

import { useNavigate } from '@tanstack/react-router';
import type { Variants } from 'framer-motion';
import { motion, useAnimation } from 'framer-motion';
import { LogOutIcon } from 'lucide-react';
import { forwardRef, type HTMLAttributes, useCallback, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useEnterprisesSelect } from '@/hooks/use-enterprises-api';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { cn } from '@/lib/utils';

export function EnterpriseSwitcher() {
  const { t } = useTranslation();
  const { setMenuOpen } = useSidebarToggle();
  const { idEnterprise, setIdEnterprise } = useEnterpriseFilter();
  const { data: enterprises } = useEnterprisesSelect();
  const { clearAuth } = useAuth();
  const navigate = useNavigate();

  const selectedEnterprise = enterprises?.find((e) => e.id === idEnterprise);

  const onLogout = () => {
    clearAuth();
    navigate({ to: '/auth' });
  };

  return (
    <DropdownMenu onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Switch enterprise">
          <UsersIcon className="flex h-full w-full items-center justify-center" />
          <span className="sr-only">{selectedEnterprise?.name || t('enterprise')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 w-64 overflow-y-auto">
        {enterprises?.map((enterprise) => (
          <DropdownMenuItem key={enterprise.id} onClick={() => setIdEnterprise(enterprise.id)} className={idEnterprise === enterprise.id ? 'bg-accent font-medium' : ''}>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm">{enterprise.name}</span>
              <span className="text-muted-foreground text-xs">
                {enterprise.city} - {enterprise.state}
              </span>
            </div>
            {idEnterprise === enterprise.id && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onLogout} variant="destructive">
          <LogOutIcon className="mr-2 size-4" />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const PATH_VARIANTS: Variants = {
  normal: {
    translateX: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 13,
    },
  },
  animate: {
    translateX: [-6, 0],
    transition: {
      delay: 0.1,
      type: 'spring',
      stiffness: 200,
      damping: 13,
    },
  },
};

export interface UsersIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface UsersIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const UsersIcon = forwardRef<UsersIconHandle, UsersIconProps>(({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
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
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <motion.path animate={controls} d="M22 21v-2a4 4 0 0 0-3-3.87" variants={PATH_VARIANTS} />
        <motion.path animate={controls} d="M16 3.13a4 4 0 0 1 0 7.75" variants={PATH_VARIANTS} />
        <title>select enterprise</title>
      </svg>
    </div>
  );
});

UsersIcon.displayName = 'UsersIcon';
