import type { Transition } from 'framer-motion';
import { motion, useAnimation } from 'framer-motion';
import { forwardRef, type HTMLAttributes, useCallback, useImperativeHandle, useRef } from 'react';
import { UnstyledButton } from '@/components/ui/unstyled-button';
import { cn } from '@/lib/utils/cn.util';

export interface Maximize2IconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export interface Maximize2IconProps extends HTMLAttributes<HTMLButtonElement> {
  size?: number;
}

const DEFAULT_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 250,
  damping: 25,
};

export const Maximize2Icon = forwardRef<Maximize2IconHandle, Maximize2IconProps>(({ onMouseEnter, onMouseLeave, className, size = 20, ...props }, ref) => {
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
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isControlledRef.current) {
        onMouseEnter?.(e);
      } else {
        controls.start('animate');
      }
    },
    [controls, onMouseEnter],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isControlledRef.current) {
        onMouseLeave?.(e);
      } else {
        controls.start('normal');
      }
    },
    [controls, onMouseLeave],
  );

  return (
    <UnstyledButton className={cn(className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
      <svg
        fill="none"
        height={size}
        width={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Maximize2Sidebar</title>
        <motion.path
          animate={controls}
          d="M3 16.2V21m0 0h4.8M3 21l6-6"
          transition={DEFAULT_TRANSITION}
          variants={{
            normal: { translateX: '0%', translateY: '0%' },
            animate: { translateX: '-2px', translateY: '2px' },
          }}
        />
        <motion.path
          animate={controls}
          d="M21 7.8V3m0 0h-4.8M21 3l-6 6"
          transition={DEFAULT_TRANSITION}
          variants={{
            normal: { translateX: '0%', translateY: '0%' },
            animate: { translateX: '2px', translateY: '-2px' },
          }}
        />
      </svg>
    </UnstyledButton>
  );
});

Maximize2Icon.displayName = 'Maximize2Icon';
