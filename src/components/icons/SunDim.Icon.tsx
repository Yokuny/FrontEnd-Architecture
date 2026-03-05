import type { Variants } from 'framer-motion';
import { motion, useAnimation } from 'framer-motion';
import { forwardRef, type HTMLAttributes, useCallback, useImperativeHandle, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface SunDimIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export interface SunDimIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const SUN_DIM_PATH_VARIANTS: Variants = {
  normal: { opacity: 1 },
  animate: (i: number) => ({
    opacity: [0, 1],
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

export const SunDimIcon = forwardRef<SunDimIconHandle, SunDimIconProps>(({ onMouseEnter, onMouseLeave, className, size = 20, ...props }, ref) => {
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
    <div role="presentation" className={cn(className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
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
        <title>SunDim</title>
        <circle cx="12" cy="12" r="4" />
        {['M12 4h.01', 'M20 12h.01', 'M12 20h.01', 'M4 12h.01', 'M17.657 6.343h.01', 'M17.657 17.657h.01', 'M6.343 17.657h.01', 'M6.343 6.343h.01'].map((d, index) => (
          <motion.path animate={controls} custom={index + 1} d={d} key={d} variants={SUN_DIM_PATH_VARIANTS} />
        ))}
      </svg>
    </div>
  );
});

SunDimIcon.displayName = 'SunDimIcon';
