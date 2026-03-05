import type { Variants } from 'framer-motion';
import { motion, useAnimation } from 'framer-motion';
import { forwardRef, type HTMLAttributes, useCallback, useImperativeHandle, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface CursorClickIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export interface CursorClickIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const CURSOR_VARIANTS: Variants = {
  normal: { x: 0, y: 0 },
  animate: {
    x: [0, 0, -3, 0],
    y: [0, -4, 0, 0],
    transition: {
      duration: 1,
      bounce: 0.3,
    },
  },
};

const LINE_VARIANTS: Variants = {
  normal: { opacity: 1, x: 0, y: 0 },
  animate: (custom: { x: number; y: number }) => ({
    opacity: [0, 1, 0, 0, 0, 0, 1],
    x: [0, custom.x, 0, 0],
    y: [0, custom.y, 0, 0],
    transition: {
      delay: 1.3,
      type: 'spring',
      stiffness: 70,
      damping: 10,
      mass: 0.4,
    },
  }),
};

export const CursorClickIcon = forwardRef<CursorClickIconHandle, CursorClickIconProps>(({ onMouseEnter, onMouseLeave, className, size = 20, ...props }, ref) => {
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
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>CursorClick</title>
        <motion.path
          animate={controls}
          initial="normal"
          d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"
          variants={CURSOR_VARIANTS}
        />
        <motion.path animate={controls} initial="normal" custom={{ x: 1, y: -1 }} d="M14 4.1 12 6" variants={LINE_VARIANTS} />
        <motion.path animate={controls} initial="normal" custom={{ x: -1, y: 0 }} d="m5.1 8-2.9-.8" variants={LINE_VARIANTS} />
        <motion.path animate={controls} initial="normal" custom={{ x: -1, y: 1 }} d="m6 12-1.9 2" variants={LINE_VARIANTS} />
        <motion.path animate={controls} initial="normal" custom={{ x: 0, y: -1 }} d="M7.2 2.2 8 5.1" variants={LINE_VARIANTS} />
      </svg>
    </div>
  );
});

CursorClickIcon.displayName = 'CursorClickIcon';
