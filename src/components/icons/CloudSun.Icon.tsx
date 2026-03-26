import type { Variants } from 'framer-motion';
import { motion, useAnimation } from 'framer-motion';
import { forwardRef, type HTMLAttributes, useCallback, useImperativeHandle, useRef } from 'react';
import { UnstyledButton } from '@/components/ui/unstyled-button';
import { cn } from '@/lib/utils/cn.util';

export interface CloudSunIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export interface CloudSunIconProps extends HTMLAttributes<HTMLButtonElement> {
  size?: number;
}

const CLOUD_VARIANTS: Variants = {
  normal: {
    x: 0,
    y: 0,
  },
  animate: {
    x: [-1, 1, -1, 1, 0],
    y: [-1, 1, -1, 1, 0],
    transition: {
      duration: 1,
      ease: 'easeInOut',
    },
  },
};

const SUN_VARIANTS: Variants = {
  normal: { opacity: 1 },
  animate: (i: number) => ({
    opacity: [0, 1],
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

export const CloudSunIcon = forwardRef<CloudSunIconHandle, CloudSunIconProps>(({ onMouseEnter, onMouseLeave, className, size = 20, ...props }, ref) => {
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
        style={{ overflow: 'visible' }}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>CloudSun</title>
        <motion.g animate={controls} initial="normal" variants={CLOUD_VARIANTS}>
          <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
        </motion.g>
        {['M12 2v2', 'm4.93 4.93 1.41 1.41', 'M20 12h2', 'm19.07 4.93-1.41 1.41', 'M15.947 12.65a4 4 0 0 0-5.925-4.128'].map((d, index) => (
          <motion.path animate={controls} custom={index + 1} d={d} initial="normal" key={d} variants={SUN_VARIANTS} />
        ))}
      </svg>
    </UnstyledButton>
  );
});

CloudSunIcon.displayName = 'CloudSunIcon';
